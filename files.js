const authPanel = document.querySelector("#authPanel");
const appPanel = document.querySelector("#appPanel");
const authForm = document.querySelector("#authForm");
const authName = document.querySelector("#authName");
const authPassword = document.querySelector("#authPassword");
const authStatus = document.querySelector("#authStatus");
const activeUser = document.querySelector("#activeUser");
const logoutButton = document.querySelector("#logoutButton");
const fileInput = document.querySelector("#fileInput");
const uploadZone = document.querySelector("#uploadZone");
const fileList = document.querySelector("#fileList");
const fileEmpty = document.querySelector("#fileEmpty");
const clearFiles = document.querySelector("#clearFiles");
const previewTitle = document.querySelector("#previewTitle");
const previewStage = document.querySelector("#previewStage");
const previewDownload = document.querySelector("#previewDownload");
const chatForm = document.querySelector("#chatForm");
const chatMessage = document.querySelector("#chatMessage");
const messages = document.querySelector("#messages");
const clearChat = document.querySelector("#clearChat");
const year = document.querySelector("#year");

const ACCOUNT_KEY = "voidultr4.accounts";
const SESSION_KEY = "voidultr4.activeAccount";
const FILE_KEY = "voidultr4.sharedFiles";
const CHAT_KEY = "voidultr4.chatMessages";

let currentUser = localStorage.getItem(SESSION_KEY);
let accounts = loadStored(ACCOUNT_KEY, {});
let sharedFiles = loadStored(FILE_KEY, []);
let chatMessages = loadStored(CHAT_KEY, [
  {
    name: "System",
    text: "This file room is saved in this browser. Add cloud storage later for real friend sharing.",
    time: new Date().toISOString(),
  },
]);

function loadStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function encodePassword(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function getFileLabel(fileName) {
  const extension = fileName.includes(".") ? fileName.split(".").pop() : "file";
  return extension.slice(0, 4).toUpperCase();
}

function setStatus(text, isError = false) {
  authStatus.textContent = text;
  authStatus.classList.toggle("error", isError);
}

function setAppState() {
  const signedIn = Boolean(currentUser && accounts[currentUser]);
  authPanel.hidden = signedIn;
  appPanel.hidden = !signedIn;
  activeUser.textContent = signedIn ? currentUser : "Guest";

  if (signedIn) {
    renderFiles();
    renderMessages();
  }
}

function renderFiles() {
  fileList.replaceChildren();
  fileEmpty.hidden = sharedFiles.length !== 0;

  sharedFiles.forEach((file) => {
    const item = document.createElement("article");
    item.className = "file-item";

    const icon = document.createElement("span");
    icon.className = "file-icon";
    icon.textContent = getFileLabel(file.name);

    const meta = document.createElement("button");
    meta.className = "file-meta file-meta-button";
    meta.type = "button";
    meta.addEventListener("click", () => previewFile(file));

    const name = document.createElement("strong");
    name.textContent = file.name;

    const details = document.createElement("span");
    details.textContent = `${formatBytes(file.size)} - ${file.owner} - ${formatTime(file.createdAt)}`;

    meta.append(name, details);

    const actions = document.createElement("div");
    actions.className = "file-actions";

    const view = document.createElement("button");
    view.type = "button";
    view.textContent = "View";
    view.addEventListener("click", () => previewFile(file));

    const download = document.createElement("a");
    download.href = file.dataUrl;
    download.download = file.name;
    download.textContent = "Download";

    const share = document.createElement("button");
    share.type = "button";
    share.textContent = "Share";
    share.addEventListener("click", () => {
      const text = `File: ${file.name}\nOwner: ${file.owner}\nSize: ${formatBytes(file.size)}\nOpen the voidultr4 file room to view it.`;
      copyText(text).then((copied) => {
        share.textContent = copied ? "Copied" : "Copy failed";
        setTimeout(() => {
          share.textContent = "Share";
        }, 1200);
      });
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      sharedFiles = sharedFiles.filter((entry) => entry.id !== file.id);
      saveStored(FILE_KEY, sharedFiles);
      renderFiles();
      resetPreview();
    });

    actions.append(view, download, share, remove);
    item.append(icon, meta, actions);
    fileList.append(item);
  });
}

function previewFile(file) {
  previewTitle.textContent = file.name;
  previewDownload.hidden = false;
  previewDownload.href = file.dataUrl;
  previewDownload.download = file.name;
  previewStage.replaceChildren();

  if (file.type.startsWith("image/")) {
    const image = document.createElement("img");
    image.src = file.dataUrl;
    image.alt = file.name;
    previewStage.append(image);
    return;
  }

  if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = file.dataUrl;
    video.controls = true;
    previewStage.append(video);
    return;
  }

  if (file.type.startsWith("audio/")) {
    const audio = document.createElement("audio");
    audio.src = file.dataUrl;
    audio.controls = true;
    previewStage.append(audio);
    return;
  }

  if (file.type === "application/pdf") {
    const frame = document.createElement("iframe");
    frame.src = file.dataUrl;
    frame.title = file.name;
    previewStage.append(frame);
    return;
  }

  if (file.textContent) {
    const pre = document.createElement("pre");
    pre.textContent = file.textContent;
    previewStage.append(pre);
    return;
  }

  const fallback = document.createElement("p");
  fallback.textContent = "This file type cannot be previewed here. Use Download to open it.";
  previewStage.append(fallback);
}

function resetPreview() {
  previewTitle.textContent = "Select a file";
  previewDownload.hidden = true;
  previewStage.replaceChildren();
  const note = document.createElement("p");
  note.textContent = "Upload or select a file to view it here.";
  previewStage.append(note);
}

function addFiles(files) {
  [...files].forEach((file) => {
    const reader = new FileReader();
    const textReader = new FileReader();

    reader.addEventListener("load", () => {
      const entry = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${file.name}`,
        owner: currentUser,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        createdAt: new Date().toISOString(),
        dataUrl: reader.result,
      };

      const saveEntry = () => {
        sharedFiles.unshift(entry);
        const saved = saveStored(FILE_KEY, sharedFiles);
        if (!saved) {
          sharedFiles.shift();
          alert("That file is too large for browser-only storage. Try a smaller file or add cloud storage later.");
        }
        renderFiles();
        previewFile(entry);
      };

      if (file.type.startsWith("text/") || file.name.match(/\.(txt|md|json|css|js|html)$/i)) {
        textReader.addEventListener("load", () => {
          entry.textContent = String(textReader.result).slice(0, 20000);
          saveEntry();
        });
        textReader.readAsText(file);
      } else {
        saveEntry();
      }
    });

    reader.readAsDataURL(file);
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function renderMessages() {
  messages.replaceChildren();

  chatMessages.forEach((message) => {
    const item = document.createElement("article");
    item.className = "message";

    const top = document.createElement("div");
    top.className = "message-top";

    const name = document.createElement("strong");
    name.textContent = message.name;

    const time = document.createElement("span");
    time.textContent = formatTime(message.time);

    const text = document.createElement("p");
    text.textContent = message.text;

    top.append(name, time);
    item.append(top, text);
    messages.append(item);
  });

  messages.scrollTop = messages.scrollHeight;
}

authForm.addEventListener("click", (event) => {
  if (event.target.matches("button[data-mode]")) {
    authForm.dataset.mode = event.target.dataset.mode;
  }
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = authForm.dataset.mode || "login";
  const username = authName.value.trim();
  const password = authPassword.value;

  if (!username || !password) return;

  if (mode === "signup") {
    if (accounts[username]) {
      setStatus("That username already exists.", true);
      return;
    }
    accounts[username] = { password: encodePassword(password), createdAt: new Date().toISOString() };
    saveStored(ACCOUNT_KEY, accounts);
    currentUser = username;
    localStorage.setItem(SESSION_KEY, currentUser);
    setStatus("");
    setAppState();
    return;
  }

  if (!accounts[username] || accounts[username].password !== encodePassword(password)) {
    setStatus("Username or password is wrong.", true);
    return;
  }

  currentUser = username;
  localStorage.setItem(SESSION_KEY, currentUser);
  setStatus("");
  setAppState();
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  currentUser = null;
  setAppState();
});

fileInput.addEventListener("change", () => {
  addFiles(fileInput.files);
  fileInput.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  uploadZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadZone.classList.remove("dragging");
  });
});

uploadZone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

clearFiles.addEventListener("click", () => {
  sharedFiles = [];
  saveStored(FILE_KEY, sharedFiles);
  renderFiles();
  resetPreview();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatMessage.value.trim();
  if (!text) return;

  chatMessages.push({
    name: currentUser,
    text,
    time: new Date().toISOString(),
  });
  saveStored(CHAT_KEY, chatMessages);
  chatMessage.value = "";
  renderMessages();
});

clearChat.addEventListener("click", () => {
  chatMessages = [];
  saveStored(CHAT_KEY, chatMessages);
  renderMessages();
});

year.textContent = new Date().getFullYear();
setAppState();
