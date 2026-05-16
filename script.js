// Global Session Profile States
let currentUserProfile = ""; // Stores "F.." or "S.." dynamically based on the specific passcode used
let fCoords = { lat: null, lon: null };
let sCoords = { lat: null, lon: null };

// Dynamic Identity Verification Handshake Entrance Gate
function checkPassword() {
    const input = document.getElementById('password-input').value.trim();
    const errorMsg = document.getElementById('login-error');
    const appContainer = document.getElementById('sanctuary-app');
    const loginScreen = document.getElementById('login-screen');
    const badge = document.getElementById('user-session-badge');
    
    if (input === 'SF0805') {
        currentUserProfile = "F.."; // Verified as Fauzan
        badge.innerText = "Profile: F..";
        badge.style.borderColor = "rgba(147, 112, 219, 0.4)";
        badge.style.color = "#9370db";
        proceedIntoSanctuary();
    } else if (input === 'SF0508') {
        currentUserProfile = "S.."; // Verified as Shabiya
        badge.innerText = "Profile: S..";
        badge.style.borderColor = "rgba(255, 192, 203, 0.4)";
        badge.style.color = "#ffc0cb";
        proceedIntoSanctuary();
    } else {
        errorMsg.classList.remove('hidden');
    }

    function proceedIntoSanctuary() {
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            appContainer.classList.remove('hidden');
            initializeCoreSanctuary();
            triggerPushNotification("System Link", `Authenticated securely as ${currentUserProfile}. Matrix Synced.`);
        }, 800);
    }
}

// Global UI Navigation Routing Engine
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(tab => tab.classList.add('hidden'));
    
    const activeLinks = document.querySelectorAll('.nav-link');
    activeLinks.forEach(link => link.classList.remove('active'));
    
    document.getElementById(tabId).classList.remove('hidden');
    if(window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

// Multi-Media Stream Compilation Engine Stamped by Identity
function handleUpload(event) {
    const files = event.target.files;
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createMediaElement(e.target.result, file.type, `Uploaded by ${currentUserProfile} ✦ Click to Edit Caption`);
        };
        reader.readAsDataURL(file);
    }
}

function createMediaElement(src, type, placeholderText) {
    const grid = document.getElementById('gallery-grid');
    const wrapper = document.createElement('div');
    wrapper.className = 'media-card-wrapper animate-fade-in';
    
    const card = document.createElement('div');
    card.className = 'media-card';
    
    if (type.startsWith('image/')) {
        card.innerHTML = `<img src="${src}"><div class="media-overlay" contenteditable="true">${placeholderText}</div>`;
    } else if (type.startsWith('video/')) {
        card.innerHTML = `<video src="${src}" controls></video><div class="media-overlay" contenteditable="true">${placeholderText}</div>`;
    } else if (type.startsWith('audio/')) {
        card.innerHTML = `<p style="font-size:0.85rem; padding:15px; color:#ffc0cb; font-weight:600;">🎙️ Voice Memo (${currentUserProfile})</p><audio src="${src}" controls style="width:100%; margin-bottom:10px;"></audio><div class="media-overlay" contenteditable="true" style="position:relative; bottom:0;">${placeholderText}</div>`;
    }
    
    wrapper.appendChild(card);
    grid.insertBefore(wrapper, grid.firstChild);
}

// Hardware Microphone Audio Capture Module Stamped by Identity
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recordTimerInterval;
let startTime;

function toggleVoiceRecording(e) {
    e.preventDefault();
    const card = document.getElementById('voice-card');
    const btn = e.target;
    const text = document.getElementById('record-text');
    const controls = document.getElementById('rec-controls');
    
    if (!isRecording) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    createMediaElement(audioUrl, 'audio/mp3', `Voice Memo recorded by ${currentUserProfile}`);
                    triggerPushNotification("System Vault", `Audio note saved to ${currentUserProfile}'s timeline archive.`);
                };
                
                mediaRecorder.start();
                isRecording = true;
                card.classList.add('recording');
                btn.innerText = "Stop";
                text.innerText = `Recording Audio as ${currentUserProfile}...`;
                controls.classList.remove('hidden');
                
                startTime = Date.now();
                recordTimerInterval = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - startTime) / 1000);
                    const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
                    const secs = String(elapsed % 60).padStart(2, '0');
                    document.getElementById('rec-timer').innerText = `${mins}:${secs}`;
                }, 1000);
            }).catch(() => {
                triggerPushNotification("Security Error", "Microphone audio route verification failed.");
            });
    } else {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        card.classList.remove('recording');
        btn.innerText = "Start";
        text.innerText = "Record Voice Memo";
        controls.classList.add('hidden');
        clearInterval(recordTimerInterval);
        document.getElementById('rec-timer').innerText = "00:00";
    }
}

// Stamped Shared Ledger Vault Entries
function saveNote() {
    const title = document.getElementById('note-title').value;
    const text = document.getElementById('note-text').value;
    if (!title || !text) return;
    
    const noteList = document.getElementById('notes-list');
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card animate-slide-up';
    
    // Inserts a clean dynamic label identifying which user profile committed the ledger entry note
    noteCard.innerHTML = `
        <span style="font-size:0.65rem; color:#ffc0cb; letter-spacing:1px; text-transform:uppercase; font-weight:600;">Sealed By ${currentUserProfile}</span>
        <h3 contenteditable="true" style="margin-top:5px;">${title}</h3>
        <p style="color:#fff; line-height:1.6; margin-top:10px; font-size:0.95rem; white-space:pre-wrap;" contenteditable="true">${text}</p>
    `;
    
    noteList.insertBefore(noteCard, noteList.firstChild);
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
    triggerPushNotification("Ledger", `Entry written directly into memory files by ${currentUserProfile}.`);
}

// Push Message Frequency Dispatches Stamped by Identity
function sendSecureMessage() {
    const input = document.getElementById('msg-input');
    if (!input.value) return;
    
    triggerPushNotification(currentUserProfile, input.value);
    input.value = '';
}

// Automatic Profile Targeted Mood Synchronization Loop
function updateLocalMood(emoji, description) {
    if (currentUserProfile === "F..") {
        document.getElementById('f-emoji').innerText = emoji;
        document.getElementById('f-label').innerText = description;
        triggerPushNotification("Resonance Sync", `F.. updated status to: ${description} ${emoji}`);
    } else if (currentUserProfile === "S..") {
        document.getElementById('s-emoji').innerText = emoji;
        document.getElementById('s-label').innerText = description;
        triggerPushNotification("Resonance Sync", `S.. updated status to: ${description} ${emoji}`);
    } else {
        triggerPushNotification("Security Link", "No active profile session identity parsed.");
    }
}

// Automatic Profile Geolocation Matrix Sync Routing
function initializeLiveTracking() {
    if (navigator.geolocation) {
        triggerPushNotification("System Latency", `Querying GPS matrix hardware node for ${currentUserProfile}...`);
        
        navigator.geolocation.getCurrentPosition(position => {
            const currentLat = position.coords.latitude;
            const currentLon = position.coords.longitude;

            if (currentUserProfile === "F..") {
                fCoords.lat = currentLat;
                fCoords.lon = currentLon;
                document.getElementById('f-lat').innerText = `Lat: ${fCoords.lat.toFixed(4)}° N`;
                document.getElementById('f-lon').innerText = `Lon: ${fCoords.lon.toFixed(4)}° E`;
                triggerPushNotification("Telemetry Node", "F.. position tracking metrics successfully verified.");
            } else if (currentUserProfile === "S..") {
                sCoords.lat = currentLat;
                sCoords.lon = currentLon;
                document.getElementById('s-lat').innerText = `Lat: ${sCoords.lat.toFixed(4)}° N`;
                document.getElementById('s-lon').innerText = `Lon: ${sCoords.lon.toFixed(4)}° E`;
                triggerPushNotification("Telemetry Node", "S.. position tracking metrics successfully verified.");
            }

            calculateVectorDistance();
        }, () => {
            triggerPushNotification("Security Error", "Device positioning track connection handshake rejected.");
        }, { enableHighAccuracy: true });
    }
}

function calculateVectorDistance() {
    if (fCoords.lat === null || sCoords.lat === null) {
        document.getElementById('distance-value').innerText = "Awaiting Peer Sync...";
        return;
    }
    const R = 6371; // Radius of Earth in KM
    const dLat = (sCoords.lat - fCoords.lat) * Math.PI / 180;
    const dLon = (sCoords.lon - fCoords.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(fCoords.lat * Math.PI / 180) * Math.cos(sCoords.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    document.getElementById('distance-value').innerText = `${(R * c).toFixed(1)} KM`;
}

// Notification Overlay HUD Controls
function triggerPushNotification(sender, messageText) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = 'push-notification';
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    notification.innerHTML = `
        <div class="notification-avatar">${sender[0]}</div>
        <div class="notification-content">
            <div class="notification-header">
                <span class="notification-app-name">💬 SANCTUARY MESH</span>
                <span class="notification-time">${timeString}</span>
            </div>
            <div class="notification-title">${sender}</div>
            <div class="notification-body">${messageText}</div>
        </div>
    `;
    container.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 5000);
}

function triggerGlobalPopup(title, body) {
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-body').innerText = body;
    document.getElementById('global-popup').classList.remove('hidden');
}

function closePopup() { document.getElementById('global-popup').classList.add('hidden'); }

function initializeCoreSanctuary() {
    const calGrid = document.getElementById('calendar-grid-dates');
    calGrid.innerHTML = '';
    for(let i=1; i<=31; i++) {
        const d = document.createElement('div');
        d.innerText = i;
        if(i === 8) { 
            d.className = 'marked';
            d.onclick = () => triggerGlobalPopup("May 8th", "Our Anniversary Milestone. Genesis point of the link.");
        }
        calGrid.appendChild(d);
    }
}
