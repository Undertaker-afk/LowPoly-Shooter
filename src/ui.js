export class UI {
    constructor(app) {
        this.app = app;
        this.menu = document.getElementById('menu');
        this.hud = document.getElementById('hud');
        this.serverList = document.getElementById('server-list');
        this.scoreList = document.getElementById('score-list');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('create-room-btn').addEventListener('click', () => {
            const playerName = document.getElementById('player-name').value || 'Player';
            const roomName = document.getElementById('room-name').value;
            this.app.createRoom(playerName, roomName);
        });
        
        document.getElementById('join-room-btn').addEventListener('click', () => {
            const playerName = document.getElementById('player-name').value || 'Player';
            const roomName = document.getElementById('room-name').value;
            this.app.joinRoom(playerName, roomName);
        });
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.chatInput.value.trim()) {
                this.sendChatMessage(this.chatInput.value);
                this.chatInput.value = '';
                this.chatInput.blur();
            }
        });
    }
    
    showMenu() {
        this.menu.classList.remove('hidden');
        this.hud.classList.remove('active');
    }
    
    hideMenu() {
        this.menu.classList.add('hidden');
    }
    
    showHUD() {
        this.hud.classList.add('active');
    }
    
    updateHealth(health) {
        document.getElementById('health-value').textContent = health;
    }
    
    updateAmmo(ammo) {
        document.getElementById('ammo-value').textContent = ammo;
    }
    
    updateScoreboard(players) {
        this.scoreList.innerHTML = '';
        
        // Sort players by kills
        const sortedPlayers = Object.entries(players).sort((a, b) => {
            return (b[1].kills || 0) - (a[1].kills || 0);
        });
        
        sortedPlayers.forEach(([id, player]) => {
            const item = document.createElement('div');
            item.className = 'score-item';
            item.innerHTML = `
                <span>${player.name}</span>
                <span>${player.kills || 0}</span>
            `;
            this.scoreList.appendChild(item);
        });
    }
    
    addChatMessage(playerName, message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.innerHTML = `<span class="player-name">${playerName}:</span> ${message}`;
        this.chatMessages.appendChild(messageEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    sendChatMessage(message) {
        if (this.app.game) {
            this.app.game.sendChatMessage(message);
        }
    }
    
    addServerToList(roomName) {
        const item = document.createElement('div');
        item.className = 'server-item';
        item.textContent = roomName;
        item.addEventListener('click', () => {
            document.getElementById('room-name').value = roomName;
        });
        this.serverList.appendChild(item);
    }
}
