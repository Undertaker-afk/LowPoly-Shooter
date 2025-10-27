import * as THREE from 'three';
import { Player } from './player.js';
import { TerrainGenerator } from './terrain.js';

export class Game {
    constructor(network, playerName) {
        this.network = network;
        this.playerName = playerName;
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // Game objects
        this.localPlayer = null;
        this.remotePlayers = new Map();
        this.bullets = [];
        
        // Game state
        this.players = {};
        this.isRunning = false;
        
        // Network update rate
        this.NETWORK_UPDATE_RATE = 0.1; // 10% of frames
        
        // Input
        this.keys = {};
        this.mouse = { x: 0, y: 0 };
        this.isPointerLocked = false;
        
        // UI reference
        this.ui = null;
    }
    
    async init() {
        // Set up Three.js scene
        this.setupScene();
        
        // Generate terrain
        const terrainGen = new TerrainGenerator(this.scene);
        terrainGen.generate();
        
        // Create local player
        this.localPlayer = new Player(this.playerName, true);
        this.localPlayer.createMesh(this.scene);
        this.localPlayer.position.set(
            Math.random() * 20 - 10,
            5,
            Math.random() * 20 - 10
        );
        
        // Set up camera
        this.camera.position.copy(this.localPlayer.position);
        this.camera.position.y += 1.6;
        
        // Register player
        this.players[this.network.room.selfId] = {
            name: this.playerName,
            kills: 0,
            deaths: 0
        };
        
        // Set up network callbacks
        this.setupNetworkCallbacks();
        
        // Set up controls
        this.setupControls();
        
        // Start game loop
        this.isRunning = true;
        this.animate();
        
        // Send initial player info
        this.network.broadcast('playerInfo', {
            name: this.playerName,
            position: this.localPlayer.position,
            rotation: this.localPlayer.rotation,
            kills: 0,
            deaths: 0
        });
        
        console.log('Game initialized');
    }
    
    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    setupNetworkCallbacks() {
        this.network.onPositionReceived = (data, peerId) => {
            if (!this.remotePlayers.has(peerId)) {
                const player = new Player(data.name || 'Remote', false);
                player.createMesh(this.scene);
                this.remotePlayers.set(peerId, player);
            }
            
            const player = this.remotePlayers.get(peerId);
            player.targetPosition.set(data.position.x, data.position.y, data.position.z);
            player.targetRotation.y = data.rotation.y;
        };
        
        this.network.onShootReceived = (data, peerId) => {
            this.createBulletTrail(data.origin, data.direction);
        };
        
        this.network.onHitReceived = (data, peerId) => {
            if (data.targetId === this.network.room.selfId) {
                this.localPlayer.takeDamage(data.damage);
                this.updateUI();
            }
        };
        
        this.network.onChatReceived = (data, peerId) => {
            const player = this.players[peerId] || { name: 'Unknown' };
            this.addChatMessage(player.name, data.message);
        };
        
        this.network.onPlayerInfoReceived = (data, peerId) => {
            this.players[peerId] = {
                name: data.name,
                kills: data.kills || 0,
                deaths: data.deaths || 0
            };
            this.updateScoreboard();
        };
        
        this.network.onPeerJoined = (peerId) => {
            // Send our info to the new peer
            this.network.broadcast('playerInfo', {
                name: this.playerName,
                position: this.localPlayer.position,
                rotation: this.localPlayer.rotation,
                kills: this.players[this.network.room.selfId]?.kills || 0,
                deaths: this.players[this.network.room.selfId]?.deaths || 0
            });
        };
        
        this.network.onPeerLeft = (peerId) => {
            if (this.remotePlayers.has(peerId)) {
                const player = this.remotePlayers.get(peerId);
                this.scene.remove(player.mesh);
                this.remotePlayers.delete(peerId);
            }
            delete this.players[peerId];
            this.updateScoreboard();
        };
    }
    
    setupControls() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Chat input toggle
            if (e.code === 'Enter' && !document.getElementById('chat-input').matches(':focus')) {
                document.getElementById('chat-input').focus();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse
        this.renderer.domElement.addEventListener('click', () => {
            if (!this.isPointerLocked) {
                this.renderer.domElement.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isPointerLocked) {
                this.mouse.x = e.movementX;
                this.mouse.y = e.movementY;
            }
        });
        
        window.addEventListener('mousedown', (e) => {
            if (this.isPointerLocked && e.button === 0) {
                this.shoot();
            }
        });
    }
    
    shoot() {
        if (!this.localPlayer.canShoot()) return;
        
        this.localPlayer.shoot();
        this.updateUI();
        
        // Get shoot direction
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        // Create local bullet trail
        this.createBulletTrail(this.camera.position.clone(), direction);
        
        // Broadcast shoot
        this.network.broadcast('shoot', {
            origin: this.camera.position.toArray(),
            direction: direction.toArray()
        });
        
        // Check for hits
        const raycaster = new THREE.Raycaster(this.camera.position, direction);
        
        // Filter to only players with valid meshes
        const targetMeshes = Array.from(this.remotePlayers.values())
            .filter(p => p.mesh)
            .flatMap(p => p.mesh.children);
        
        const intersects = raycaster.intersectObjects(targetMeshes, false);
        
        if (intersects.length > 0) {
            // Find which player was hit by checking parent groups
            for (const [peerId, player] of this.remotePlayers.entries()) {
                if (player.mesh && player.mesh.children.includes(intersects[0].object)) {
                    this.network.broadcast('hit', {
                        targetId: peerId,
                        damage: 10
                    });
                    
                    // Update kills
                    if (this.players[this.network.room.selfId]) {
                        this.players[this.network.room.selfId].kills++;
                        this.updateScoreboard();
                    }
                    break;
                }
            }
        }
    }
    
    createBulletTrail(origin, direction) {
        const start = new THREE.Vector3(origin.x || origin[0], origin.y || origin[1], origin.z || origin[2]);
        const dir = new THREE.Vector3(direction.x || direction[0], direction.y || direction[1], direction.z || direction[2]);
        const end = start.clone().add(dir.multiplyScalar(100));
        
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const line = new THREE.Line(geometry, material);
        
        this.scene.add(line);
        
        // Remove after short delay
        setTimeout(() => {
            this.scene.remove(line);
            geometry.dispose();
            material.dispose();
        }, 100);
    }
    
    update(deltaTime) {
        if (!this.localPlayer) return;
        
        // Update local player movement
        const moveSpeed = 10 * deltaTime;
        const moveVector = new THREE.Vector3();
        
        if (this.keys['KeyW']) moveVector.z -= 1;
        if (this.keys['KeyS']) moveVector.z += 1;
        if (this.keys['KeyA']) moveVector.x -= 1;
        if (this.keys['KeyD']) moveVector.x += 1;
        
        if (moveVector.length() > 0) {
            moveVector.normalize();
            moveVector.applyQuaternion(this.camera.quaternion);
            moveVector.y = 0;
            
            this.localPlayer.position.add(moveVector.multiplyScalar(moveSpeed));
        }
        
        // Update camera rotation
        if (this.isPointerLocked) {
            this.localPlayer.rotation.y -= this.mouse.x * 0.002;
            
            // Update camera pitch
            const euler = new THREE.Euler(0, 0, 0, 'YXZ');
            euler.setFromQuaternion(this.camera.quaternion);
            euler.x -= this.mouse.y * 0.002;
            euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
            this.camera.quaternion.setFromEuler(euler);
            
            this.mouse.x = 0;
            this.mouse.y = 0;
        }
        
        // Update camera position
        this.camera.position.copy(this.localPlayer.position);
        this.camera.position.y += 1.6;
        
        // Update camera rotation from player
        const playerRotation = new THREE.Euler(
            this.camera.rotation.x,
            this.localPlayer.rotation.y,
            0,
            'YXZ'
        );
        this.camera.quaternion.setFromEuler(playerRotation);
        
        // Update player mesh rotation
        if (this.localPlayer.mesh) {
            this.localPlayer.mesh.rotation.y = this.localPlayer.rotation.y;
        }
        
        // Send position update
        if (Math.random() < this.NETWORK_UPDATE_RATE) { // Send updates periodically
            this.network.broadcast('position', {
                name: this.playerName,
                position: this.localPlayer.position,
                rotation: this.localPlayer.rotation
            });
        }
        
        // Update remote players
        for (const player of this.remotePlayers.values()) {
            player.update(deltaTime);
        }
        
        // Update local player (for reload timer)
        if (this.localPlayer) {
            this.localPlayer.update(deltaTime);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = 0.016; // Assuming 60 FPS
        this.update(deltaTime);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateUI() {
        const healthEl = document.getElementById('health-value');
        const ammoEl = document.getElementById('ammo-value');
        
        if (healthEl) healthEl.textContent = this.localPlayer.health;
        if (ammoEl) ammoEl.textContent = this.localPlayer.ammo;
    }
    
    updateScoreboard() {
        const scoreList = document.getElementById('score-list');
        if (!scoreList) return;
        
        scoreList.innerHTML = '';
        
        const sortedPlayers = Object.entries(this.players).sort((a, b) => {
            return (b[1].kills || 0) - (a[1].kills || 0);
        });
        
        sortedPlayers.forEach(([id, player]) => {
            const item = document.createElement('div');
            item.className = 'score-item';
            item.innerHTML = `
                <span>${player.name}</span>
                <span>${player.kills || 0}</span>
            `;
            scoreList.appendChild(item);
        });
    }
    
    addChatMessage(playerName, message) {
        const messagesEl = document.getElementById('chat-messages');
        if (!messagesEl) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.innerHTML = `<span class="player-name">${playerName}:</span> ${message}`;
        messagesEl.appendChild(messageEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    
    sendChatMessage(message) {
        this.network.broadcast('chat', { message });
        this.addChatMessage(this.playerName, message);
    }
}
