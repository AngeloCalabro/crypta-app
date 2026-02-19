/* ===== MATRIX BACKGROUND ===== */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
let letters = "アァカサタナハマヤャラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let fontSize = 14;
let columns, drops;

function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}
initMatrix();
window.addEventListener("resize", initMatrix);

function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff88";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
}
drawMatrix();

/* ===== BOOT SEQUENCE ===== */
const bootLines = [
    "> Initializing kernel...",
    "> Loading encryption modules...",
    "> System secure.",
    "> Awaiting authentication..."
];
let bootIndex = 0;

function bootSequence() {
    if (bootIndex < bootLines.length) {
        document.getElementById("bootText").innerText += bootLines[bootIndex++] + "\n";
        setTimeout(bootSequence, 700);
    } else {
        // Listener sia per desktop che per mobile touch
        const continueHandler = () => {
            showLogin();
            document.removeEventListener("keydown", continueHandler);
            document.removeEventListener("touchstart", continueHandler);
        };
        document.addEventListener("keydown", continueHandler);
        document.addEventListener("touchstart", continueHandler);
    }
}

function showLogin() {
    document.getElementById("boot").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
    // Focalizza l'input password reale su mobile
    const pwInput = document.getElementById("passwordInput");
    if (pwInput) pwInput.focus();
}

bootSequence();

/* ===== LOGIN SYSTEM ===== */
const ACCESS = "matrix";
let attempts = 0;

const passwordInput = document.getElementById("passwordInput");
const messageDiv = document.getElementById("message");

passwordInput.addEventListener("keydown", e => {
    if (e.key === "Enter") checkPassword();
});

function checkPassword() {
    const typed = passwordInput.value;

    if (typed.toLowerCase() === ACCESS.toLowerCase()) {
        messageDiv.innerText = "ACCESS GRANTED";
        document.getElementById("status").innerText = "STATUS: AUTHENTICATED";
        flashGreen();
        startLoading();
    } else {
        attempts++;
        if (attempts >= 3) lockScreen();
        else {
            messageDiv.innerText = "ACCESS DENIED";
            passwordInput.value = "";
        }
    }
}

/* ===== FLASH GREEN ===== */
function flashGreen() {
    const flash = document.getElementById("flash");
    flash.classList.add("flashActive");
    setTimeout(() => flash.classList.remove("flashActive"), 400);
}

/* ===== LOADING CINEMATIC ===== */
function startLoading() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("loading").classList.remove("hidden");

    const lines = [
        "Decrypting secure channel...",
        "Bypassing firewall...",
        "Injecting root protocol...",
        "Access complete."
    ];

    let i = 0;
    function next() {
        if (i < lines.length) {
            document.getElementById("loadingText").innerText += lines[i++] + "\n";
            setTimeout(next, 800);
        } else {
            setTimeout(() => {
                document.getElementById("loading").classList.add("hidden");
                document.getElementById("app").classList.remove("hidden");
            }, 700);
        }
    }
    next();
}

/* ===== CAESAR CIPHER ===== */
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
const shiftSelect = document.getElementById("shiftLetter");

alphabet.split("").forEach((letter, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.text = letter === " " ? "[SPACE]" : letter;
    shiftSelect.appendChild(opt);
});

function encrypt(text, shift) {
    return [...text.toUpperCase()].map(c => {
        const i = alphabet.indexOf(c);
        return i !== -1 ? alphabet[(i + shift) % alphabet.length] : c;
    }).join("");
}

function decrypt(text, shift) {
    return [...text.toUpperCase()].map(c => {
        const i = alphabet.indexOf(c);
        return i !== -1 ? alphabet[(i - shift + alphabet.length) % alphabet.length] : c;
    }).join("");
}

/* ===== BUTTONS ===== */
document.getElementById("encryptBtn").addEventListener("click", () => {
    const input = document.getElementById("inputText").value;
    document.getElementById("output").innerText = encrypt(input, parseInt(shiftSelect.value));
});

document.getElementById("decryptBtn").addEventListener("click", () => {
    const input = document.getElementById("inputText").value;
    document.getElementById("output").innerText = decrypt(input, parseInt(shiftSelect.value));
});

document.getElementById("clearBtn").addEventListener("click", () => {
    document.getElementById("inputText").value = "";
    document.getElementById("output").innerText = "";
});

document.getElementById("logoutBtn").addEventListener("click", () => location.reload());

/* ===== LOCK SCREEN ===== */
function lockScreen() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("terminalBox").classList.add("hidden");

    const redFlash = document.createElement("div");
    Object.assign(redFlash.style, {
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        background: "#ff0000", opacity: 0.9, zIndex: 9999
    });
    document.body.appendChild(redFlash);
    setTimeout(() => { redFlash.style.transition = "opacity 1s"; redFlash.style.opacity = 0; }, 200);
    setTimeout(() => document.body.removeChild(redFlash), 1200);

    const canvasLock = document.createElement("canvas");
    canvasLock.width = window.innerWidth;
    canvasLock.height = window.innerHeight;
    document.body.appendChild(canvasLock);
    const ctxLock = canvasLock.getContext("2d");
    const fontSizeLock = 16;
    const columnsLock = Math.floor(canvasLock.width / fontSizeLock);
    const dropsLock = Array(columnsLock).fill(1);

    function drawLock() {
        ctxLock.fillStyle = "rgba(0,0,0,0.05)";
        ctxLock.fillRect(0, 0, canvasLock.width, canvasLock.height);
        ctxLock.fillStyle = "#00ff00";
        ctxLock.font = fontSizeLock + "px monospace";

        for (let i = 0; i < dropsLock.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctxLock.fillText(text, i * fontSizeLock, dropsLock[i] * fontSizeLock);
            if (dropsLock[i] * fontSizeLock > canvasLock.height && Math.random() > 0.975) dropsLock[i] = 0;
            dropsLock[i]++;
        }
        requestAnimationFrame(drawLock);
    }
    drawLock();
}
