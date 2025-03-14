/**
 * ModelLoader class
 * Utility for loading 3D models in various formats
 */
class ModelLoader {
    /**
     * Constructor
     * @param {THREE.Scene} scene - The Three.js scene
     */
    constructor(scene) {
        this.scene = scene;
        
        // Initialize loaders
        this.gltfLoader = new THREE.GLTFLoader();
        
        // Cache for loaded models
        this.modelCache = {};
        
        console.log("ModelLoader initialized");
    }
    
    /**
     * Load a GLTF model
     * @param {string} url - URL of the GLTF model
     * @returns {Promise<THREE.Object3D>} - Promise resolving to the loaded model
     */
    loadGLTF(url) {
        // Check cache first
        if (this.modelCache[url]) {
            return Promise.resolve(this.modelCache[url].clone());
        }
        
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf) => {
                    const model = gltf.scene || gltf.scenes[0];
                    this.setupModel(model);
                    
                    // Cache the model
                    this.modelCache[url] = model.clone();
                    
                    resolve(model);
                },
                (xhr) => {
                    console.log(`${url}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
                },
                (error) => {
                    console.error('Error loading GLTF model:', error);
                    reject(error);
                }
            );
        });
    }
    
    /**
     * Create a primitive geometric shape
     * @param {string} type - Type of primitive ('box', 'sphere', 'cylinder', etc.)
     * @param {Object} params - Parameters for the primitive
     * @returns {THREE.Mesh} - The created primitive mesh
     */
    createPrimitive(type, params = {}) {
        let geometry;
        let material;
        
        // Default parameters
        const defaultParams = {
            color: 0xcccccc,
            metalness: 0.2,
            roughness: 0.8,
            transparent: false,
            opacity: 1,
            wireframe: false
        };
        
        // Merge with provided params
        const mergedParams = { ...defaultParams, ...params };
        
        // Create material
        material = new THREE.MeshStandardMaterial({
            color: mergedParams.color,
            metalness: mergedParams.metalness,
            roughness: mergedParams.roughness,
            transparent: mergedParams.transparent,
            opacity: mergedParams.opacity,
            wireframe: mergedParams.wireframe
        });
        
        // Create geometry based on type
        switch (type.toLowerCase()) {
            case 'box':
                geometry = new THREE.BoxGeometry(
                    mergedParams.width || 1,
                    mergedParams.height || 1,
                    mergedParams.depth || 1,
                    mergedParams.widthSegments || 1,
                    mergedParams.heightSegments || 1,
                    mergedParams.depthSegments || 1
                );
                break;
                
            case 'sphere':
                geometry = new THREE.SphereGeometry(
                    mergedParams.radius || 1,
                    mergedParams.widthSegments || 32,
                    mergedParams.heightSegments || 16
                );
                break;
                
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(
                    mergedParams.radiusTop || 1,
                    mergedParams.radiusBottom || 1,
                    mergedParams.height || 1,
                    mergedParams.radialSegments || 32,
                    mergedParams.heightSegments || 1,
                    mergedParams.openEnded || false
                );
                break;
                
            case 'cone':
                geometry = new THREE.ConeGeometry(
                    mergedParams.radius || 1,
                    mergedParams.height || 1,
                    mergedParams.radialSegments || 32,
                    mergedParams.heightSegments || 1,
                    mergedParams.openEnded || false
                );
                break;
                
            case 'plane':
                geometry = new THREE.PlaneGeometry(
                    mergedParams.width || 1,
                    mergedParams.height || 1,
                    mergedParams.widthSegments || 1,
                    mergedParams.heightSegments || 1
                );
                break;
                
            default:
                console.warn(`Unknown primitive type: ${type}, defaulting to box`);
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Set mesh properties
        mesh.castShadow = mergedParams.castShadow !== undefined ? mergedParams.castShadow : true;
        mesh.receiveShadow = mergedParams.receiveShadow !== undefined ? mergedParams.receiveShadow : true;
        
        // Set position if provided
        if (mergedParams.position) {
            mesh.position.copy(mergedParams.position);
        }
        
        // Set rotation if provided
        if (mergedParams.rotation) {
            mesh.rotation.copy(mergedParams.rotation);
        }
        
        // Set scale if provided
        if (mergedParams.scale) {
            mesh.scale.copy(mergedParams.scale);
        }
        
        return mesh;
    }
    
    /**
     * Setup a model with common settings
     * @param {THREE.Object3D} model - The model to setup
     */
    setupModel(model) {
        // Enable shadows for all meshes in the model
        model.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                
                // Check for transparent materials
                if (obj.material) {
                    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                    
                    materials.forEach(material => {
                        if (material.transparent) {
                            // Improve transparent rendering
                            material.depthWrite = false;
                        }
                    });
                }
            }
        });
        
        return model;
    }
    
    /**
     * Clear the model cache
     */
    clearCache() {
        this.modelCache = {};
        console.log("Model cache cleared");
    }
    
    /**
     * Dispose of a model to free memory
     * @param {THREE.Object3D} model - The model to dispose
     */
    disposeModel(model) {
        if (!model) return;
        
        model.traverse(obj => {
            if (obj.isMesh) {
                obj.geometry.dispose();
                
                if (obj.material) {
                    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
                    
                    materials.forEach(material => {
                        material.dispose();
                        
                        // Dispose of textures
                        if (material.map) material.map.dispose();
                        if (material.normalMap) material.normalMap.dispose();
                        if (material.specularMap) material.specularMap.dispose();
                        if (material.emissiveMap) material.emissiveMap.dispose();
                    });
                }
            }
        });
        
        console.log("Model disposed:", model);
    }
} 