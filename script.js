const isSecureContext = location.protocol === "https:" || location.hostname === "localhost";

// --- DualMix Hash ---
async function dualMixHash(str, pepper = "") {
  const enc = new TextEncoder();
  const data1 = enc.encode(str + pepper);
  const data2 = enc.encode(str.split("").reverse().join("") + pepper);

  const sha256 = await crypto.subtle.digest("SHA-256", data1);
  const sha512 = await crypto.subtle.digest("SHA-512", data2);

  const b256 = new Uint8Array(sha256);
  const b512 = new Uint8Array(sha512);

  const mixed = b512.map((b, i) => b ^ b256[i % b256.length]);
  const finalHash = await crypto.subtle.digest("SHA-256", mixed);
  return Array.from(new Uint8Array(finalHash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// --- LocalStorage Records ---
function saveRecord(hash, preview, pepper) {
  const records = JSON.parse(localStorage.getItem("records") || "[]");
  records.push({ hash, preview, pepper, timestamp: new Date().toISOString() });
  localStorage.setItem("records", JSON.stringify(records));
}

// --- Security ---
let authenticated = false;

async function register() {
  if (isSecureContext && window.PublicKeyCredential) {
    try {
      const pubKey = {
        challenge: new Uint8Array(32),
        rp: { name: "DualMix Notary" },
        user: { id: new Uint8Array(16), name: "user@example.com", displayName: "User" },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }]
      };
      await navigator.credentials.create({ publicKey: pubKey });
      localStorage.setItem("auth", "webauthn");
      authenticated = true;
      setAuthStatus("Authenticated (WebAuthn).");
    } catch {
      fallbackRegister();
    }
  } else {
    fallbackRegister();
  }
}

function fallbackRegister() {
  localStorage.setItem("auth", "fallbackKey-" + Math.random().toString(36).slice(2));
  authenticated = true;
  setAuthStatus("Authenticated (Local Fallback).");
}

async function login() {
  const key = localStorage.getItem("auth");
  if (key) {
    authenticated = true;
    const mode = key.startsWith("fallbackKey") ? "Local Fallback" : "WebAuthn";
    setAuthStatus("Authenticated (" + mode + ").");
  } else {
    document.getElementById("authStatus").innerText = "No registration found.";
  }
}

function setAuthStatus(msg) {
  document.getElementById("authStatus").innerText = msg;
  document.getElementById("app").classList.remove("hidden");
}

// --- UI Actions ---
document.getElementById("registerBtn").onclick = register;
document.getElementById("loginBtn").onclick = login;

document.getElementById("createBtn").onclick = async () => {
  if (!authenticated) return alert("Please authenticate first.");
  let text = document.getElementById("inputText").value;
  const file = document.getElementById("fileInput").files[0];
  if (file) text = await file.text();
  const pepper = document.getElementById("pepper").value;
  const hash = await dualMixHash(text, pepper);
  saveRecord(hash, text.slice(0, 20), pepper);
  document.getElementById("output").innerText = "Hash: " + hash;
};

document.getElementById("verifyBtn").onclick = async () => {
  let text = document.getElementById("verifyText").value;
  const file = document.getElementById("verifyFile").files[0];
  if (file) text = await file.text();
  const pepper = document.getElementById("verifyPepper").value;
  const hash = await dualMixHash(text, pepper);
  const records = JSON.parse(localStorage.getItem("records") || "[]");
  const found = records.find(r => r.hash === hash);
  document.getElementById("verifyOutput").innerText = found
    ? "Match found (Created: " + found.timestamp + ")"
    : "No matching record.";
};

document.getElementById("showBtn").onclick = () => {
  const records = JSON.parse(localStorage.getItem("records") || "[]");
  document.getElementById("records").innerText = JSON.stringify(records, null, 2);
};

document.getElementById("exportBtn").onclick = () => {
  const records = localStorage.getItem("records") || "[]";
  const blob = new Blob([records], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "records.json";
  a.click();
};

document.getElementById("clearBtn").onclick = () => {
  localStorage.removeItem("records");
  document.getElementById("records").innerText = "";
};
