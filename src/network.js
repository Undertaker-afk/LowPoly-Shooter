import { joinRoom } from 'trystero';

export class NetworkManager {
    constructor(roomName, playerName) {
        this.roomName = roomName;
        this.playerName = playerName;
        this.room = null;
        this.peers = new Map();
        
        // Actions for different message types
        this.sendPosition = null;
        this.sendShoot = null;
        this.sendHit = null;
        this.sendChat = null;
        this.sendPlayerInfo = null;
        
        // Callbacks
        this.onPositionReceived = null;
        this.onShootReceived = null;
        this.onHitReceived = null;
        this.onChatReceived = null;
        this.onPlayerInfoReceived = null;
        this.onPeerJoined = null;
        this.onPeerLeft = null;
    }
    
    async connect() {
        // Use Trystero with public STUN/TURN servers
        const config = {
            appId: 'lowpoly-shooter-app',
            rtcConfig: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        };
        
        this.room = joinRoom(config, this.roomName);
        
        // Set up action listeners
        [this.sendPosition, this.receivePosition] = this.room.makeAction('position');
        [this.sendShoot, this.receiveShoot] = this.room.makeAction('shoot');
        [this.sendHit, this.receiveHit] = this.room.makeAction('hit');
        [this.sendChat, this.receiveChat] = this.room.makeAction('chat');
        [this.sendPlayerInfo, this.receivePlayerInfo] = this.room.makeAction('playerInfo');
        
        // Set up event listeners
        this.receivePosition((data, peerId) => {
            if (this.onPositionReceived) {
                this.onPositionReceived(data, peerId);
            }
        });
        
        this.receiveShoot((data, peerId) => {
            if (this.onShootReceived) {
                this.onShootReceived(data, peerId);
            }
        });
        
        this.receiveHit((data, peerId) => {
            if (this.onHitReceived) {
                this.onHitReceived(data, peerId);
            }
        });
        
        this.receiveChat((data, peerId) => {
            if (this.onChatReceived) {
                this.onChatReceived(data, peerId);
            }
        });
        
        this.receivePlayerInfo((data, peerId) => {
            if (this.onPlayerInfoReceived) {
                this.onPlayerInfoReceived(data, peerId);
            }
        });
        
        this.room.onPeerJoin(peerId => {
            console.log(`Peer joined: ${peerId}`);
            this.peers.set(peerId, { id: peerId });
            
            if (this.onPeerJoined) {
                this.onPeerJoined(peerId);
            }
        });
        
        this.room.onPeerLeave(peerId => {
            console.log(`Peer left: ${peerId}`);
            this.peers.delete(peerId);
            
            if (this.onPeerLeft) {
                this.onPeerLeft(peerId);
            }
        });
        
        console.log('Network manager connected');
    }
    
    broadcast(action, data) {
        if (action === 'position' && this.sendPosition) {
            this.sendPosition(data);
        } else if (action === 'shoot' && this.sendShoot) {
            this.sendShoot(data);
        } else if (action === 'hit' && this.sendHit) {
            this.sendHit(data);
        } else if (action === 'chat' && this.sendChat) {
            this.sendChat(data);
        } else if (action === 'playerInfo' && this.sendPlayerInfo) {
            this.sendPlayerInfo(data);
        }
    }
    
    disconnect() {
        if (this.room) {
            this.room.leave();
        }
    }
}
