import * as THREE from 'three';
import { joinRoom } from 'trystero';
import { Game } from './game.js';
import { NetworkManager } from './network.js';
import { TerrainGenerator } from './terrain.js';
import { UI } from './ui.js';

class App {
    constructor() {
        this.game = null;
        this.network = null;
        this.ui = new UI(this);
        
        this.init();
    }
    
    init() {
        console.log('Low-Poly Shooter initialized');
        this.ui.showMenu();
    }
    
    async createRoom(playerName, roomName) {
        const actualRoomName = roomName || `room-${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            this.network = new NetworkManager(actualRoomName, playerName);
            await this.network.connect();
            
            this.game = new Game(this.network, playerName);
            await this.game.init();
            
            this.ui.hideMenu();
            this.ui.showHUD();
            
            console.log(`Room created: ${actualRoomName}`);
        } catch (error) {
            console.error('Failed to create room:', error);
            alert('Failed to create room. Please try again.');
        }
    }
    
    async joinRoom(playerName, roomName) {
        if (!roomName) {
            alert('Please enter a room name');
            return;
        }
        
        try {
            this.network = new NetworkManager(roomName, playerName);
            await this.network.connect();
            
            this.game = new Game(this.network, playerName);
            await this.game.init();
            
            this.ui.hideMenu();
            this.ui.showHUD();
            
            console.log(`Joined room: ${roomName}`);
        } catch (error) {
            console.error('Failed to join room:', error);
            alert('Failed to join room. Please try again.');
        }
    }
}

// Start the application
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
