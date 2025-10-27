import * as THREE from 'three';

export class TerrainGenerator {
    constructor(scene) {
        this.scene = scene;
        this.terrain = null;
    }
    
    generate() {
        // Create a procedural low-poly terrain
        const geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        
        // Randomize vertex heights for terrain variation
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            
            // Simple height calculation using sine waves
            const height = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 5 +
                          Math.random() * 2;
            
            vertices[i + 2] = height;
        }
        
        geometry.computeVertexNormals();
        
        // Create low-poly material
        const material = new THREE.MeshLambertMaterial({
            color: 0x4a8c3f,
            flatShading: true,
            side: THREE.DoubleSide
        });
        
        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.y = 0;
        this.terrain.receiveShadow = true;
        
        this.scene.add(this.terrain);
        
        // Add some trees/obstacles
        this.addObstacles();
        
        return this.terrain;
    }
    
    addObstacles() {
        const treeGeometry = new THREE.ConeGeometry(1, 4, 4);
        const treeMaterial = new THREE.MeshLambertMaterial({
            color: 0x2d5016,
            flatShading: true
        });
        
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({
            color: 0x4a2511,
            flatShading: true
        });
        
        // Add random trees
        for (let i = 0; i < 30; i++) {
            const tree = new THREE.Group();
            
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1;
            tree.add(trunk);
            
            const foliage = new THREE.Mesh(treeGeometry, treeMaterial);
            foliage.position.y = 3;
            tree.add(foliage);
            
            tree.position.x = (Math.random() - 0.5) * 180;
            tree.position.z = (Math.random() - 0.5) * 180;
            
            // Get height at this position
            const height = Math.sin(tree.position.x * 0.1) * Math.cos(tree.position.z * 0.1) * 5 +
                          Math.random() * 2;
            tree.position.y = height;
            
            tree.castShadow = true;
            tree.receiveShadow = true;
            
            this.scene.add(tree);
        }
        
        // Add some rocks
        const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
        const rockMaterial = new THREE.MeshLambertMaterial({
            color: 0x808080,
            flatShading: true
        });
        
        for (let i = 0; i < 20; i++) {
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            rock.position.x = (Math.random() - 0.5) * 180;
            rock.position.z = (Math.random() - 0.5) * 180;
            
            const height = Math.sin(rock.position.x * 0.1) * Math.cos(rock.position.z * 0.1) * 5 +
                          Math.random() * 2;
            rock.position.y = height + 0.5;
            
            rock.scale.set(
                Math.random() + 0.5,
                Math.random() + 0.5,
                Math.random() + 0.5
            );
            
            rock.castShadow = true;
            rock.receiveShadow = true;
            
            this.scene.add(rock);
        }
    }
}
