import * as THREE from 'three';

export class Player {
    constructor(name, isLocal = false) {
        this.name = name;
        this.isLocal = isLocal;
        
        // Position and rotation
        this.position = new THREE.Vector3();
        this.rotation = new THREE.Euler();
        
        // For smooth interpolation of remote players
        this.targetPosition = new THREE.Vector3();
        this.targetRotation = new THREE.Euler();
        
        // Stats
        this.health = 100;
        this.maxHealth = 100;
        this.ammo = 30;
        this.maxAmmo = 30;
        
        // Shooting
        this.lastShootTime = 0;
        this.shootCooldown = 200; // ms
        
        // Mesh
        this.mesh = null;
    }
    
    createMesh(scene) {
        // Create a simple low-poly player model
        const group = new THREE.Group();
        
        // Body (box)
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({
            color: this.isLocal ? 0x4CAF50 : 0xF44336,
            flatShading: true
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        
        // Head (box)
        const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const headMaterial = new THREE.MeshLambertMaterial({
            color: 0xFFDBAC,
            flatShading: true
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.75;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);
        
        // Gun (box)
        const gunGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.8);
        const gunMaterial = new THREE.MeshLambertMaterial({
            color: 0x333333,
            flatShading: true
        });
        const gun = new THREE.Mesh(gunGeometry, gunMaterial);
        gun.position.set(0.4, 0.5, -0.3);
        gun.castShadow = true;
        group.add(gun);
        
        // Name tag
        if (!this.isLocal) {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, 256, 64);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, 128, 42);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.y = 2.5;
            sprite.scale.set(2, 0.5, 1);
            group.add(sprite);
        }
        
        this.mesh = group;
        this.mesh.position.copy(this.position);
        
        scene.add(this.mesh);
    }
    
    update(deltaTime) {
        if (!this.isLocal && this.mesh) {
            // Smooth interpolation for remote players
            this.position.lerp(this.targetPosition, 0.2);
            this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.2;
            
            this.mesh.position.copy(this.position);
            this.mesh.rotation.y = this.rotation.y;
        }
    }
    
    canShoot() {
        const now = Date.now();
        if (now - this.lastShootTime < this.shootCooldown) {
            return false;
        }
        if (this.ammo <= 0) {
            return false;
        }
        return true;
    }
    
    shoot() {
        if (!this.canShoot()) return false;
        
        this.lastShootTime = Date.now();
        this.ammo--;
        
        // Reload after 1 second if empty
        if (this.ammo <= 0) {
            setTimeout(() => {
                this.ammo = this.maxAmmo;
            }, 1000);
        }
        
        return true;
    }
    
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        
        if (this.health <= 0) {
            this.respawn();
        }
    }
    
    respawn() {
        this.health = this.maxHealth;
        this.ammo = this.maxAmmo;
        
        // Respawn at random position
        this.position.set(
            Math.random() * 40 - 20,
            5,
            Math.random() * 40 - 20
        );
        
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }
}
