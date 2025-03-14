/**
 * SceneManager class
 * Handles common scene operations and utilities
 */
class SceneManager {
    /**
     * Constructor
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {THREE.Camera} camera - The Three.js camera
     * @param {THREE.WebGLRenderer} renderer - The Three.js renderer
     */
    constructor(scene, camera, renderer) {
        console.log("SceneManager constructor called");
        
        if (!scene) {
            console.error("Scene is null in SceneManager constructor");
            throw new Error("Scene cannot be null");
        }
        
        if (!camera) {
            console.error("Camera is null in SceneManager constructor");
            throw new Error("Camera cannot be null");
        }
        
        if (!renderer) {
            console.error("Renderer is null in SceneManager constructor");
            throw new Error("Renderer cannot be null");
        }
        
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        // Add basic helpers
        this.addAxesHelper(5);
        this.addGridHelper(20, 20);
        
        console.log("SceneManager initialized successfully");
    }

    /**
     * Center a model in the scene and adjust camera
     * @param {THREE.Object3D} model - The model to center
     */
    centerModel(model) {
        if (!model) {
            console.warn("Cannot center null model");
            return;
        }

        // Compute the bounding box
        const boundingBox = new THREE.Box3().setFromObject(model);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        
        console.log("Model bounding box:", {
            center: center,
            size: size,
            min: boundingBox.min,
            max: boundingBox.max
        });

        // If the bounding box has zero size in any dimension, use default values
        if (size.x === 0 || size.y === 0 || size.z === 0) {
            console.warn("Model has zero size in at least one dimension, using default positioning");
            model.position.set(0, 1, 0);
            this.camera.position.set(0, 1, 5);
            this.camera.lookAt(0, 1, 0);
            this.camera.updateProjectionMatrix();
            return;
        }

        // Center the model (subtract center position to bring to origin)
        model.position.x = model.position.x - center.x;
        model.position.y = model.position.y - center.y;
        model.position.z = model.position.z - center.z;
        
        // Now move it up so it's on the grid
        const bottomY = boundingBox.min.y;
        if (bottomY < 0) {
            model.position.y -= bottomY;
        }
        
        console.log("Model positioned at:", model.position);

        // Position the camera to see the whole model
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim === 0) {
            console.warn("Model has zero maximum dimension, using default camera position");
            this.camera.position.set(0, 1, 5);
            this.camera.lookAt(0, 0, 0);
            this.camera.updateProjectionMatrix();
            return;
        }
        
        const fov = this.camera.fov * (Math.PI / 180);
        let cameraDistance = maxDim / (2 * Math.tan(fov / 2));
        // Ensure minimum distance
        cameraDistance = Math.max(cameraDistance, 3);
        
        // Position camera slightly above and in front of the model
        const cameraPosition = new THREE.Vector3(0, maxDim * 0.5, cameraDistance * 1.5);
        this.camera.position.copy(cameraPosition);
        this.camera.lookAt(new THREE.Vector3(0, maxDim * 0.3, 0));
        
        console.log("Camera positioned at:", this.camera.position);
        
        // Update the orbit controls target to point at the model
        if (window.controls) {
            window.controls.target.set(0, maxDim * 0.3, 0);
            window.controls.update();
        }
        
        // Update the projection matrix
        this.camera.updateProjectionMatrix();
    }

    /**
     * Add axes helper to the scene
     * @param {number} size - Size of the axes helper
     * @returns {THREE.AxesHelper} - The created axes helper
     */
    addAxesHelper(size = 5) {
        const axesHelper = new THREE.AxesHelper(size);
        this.scene.add(axesHelper);
        return axesHelper;
    }
    
    /**
     * Add grid helper to the scene
     * @param {number} size - Size of the grid
     * @param {number} divisions - Number of divisions
     * @returns {THREE.GridHelper} - The created grid helper
     */
    addGridHelper(size = 20, divisions = 20) {
        const gridHelper = new THREE.GridHelper(size, divisions);
        this.scene.add(gridHelper);
        return gridHelper;
    }
    
    /**
     * Set wireframe mode for all materials in the scene
     * @param {boolean} isWireframe - Whether wireframe mode should be enabled
     */
    setWireframe(isWireframe) {
        this.scene.traverse(obj => {
            if (obj.isMesh && obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => {
                        mat.wireframe = isWireframe;
                    });
                } else {
                    obj.material.wireframe = isWireframe;
                }
            }
        });
    }
    
    /**
     * Enable shadows for the renderer and objects in the scene
     */
    enableShadows() {
        this.renderer.shadowMap.enabled = true;
        
        this.scene.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
    }
    
    /**
     * Disable shadows for the renderer
     */
    disableShadows() {
        this.renderer.shadowMap.enabled = false;
    }
    
    /**
     * Clear all objects from the scene except lights and cameras
     */
    clearScene() {
        console.log("Clearing scene objects");
        
        const objectsToRemove = [];
        
        this.scene.traverse(object => {
            // Keep cameras, lights, and essential helpers
            if (!object.isLight && 
                !object.isCamera && 
                !object.isGridHelper && 
                !object.isAxesHelper &&
                object !== this.scene) {
                
                objectsToRemove.push(object);
            }
        });
        
        // Remove objects
        for (const object of objectsToRemove) {
            if (object.parent) {
                object.parent.remove(object);
            }
        }
        
        console.log(`Removed ${objectsToRemove.length} objects from scene`);
    }
    
    /**
     * Setup basic lighting for the scene
     */
    setupLighting() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        console.log("Basic lighting setup complete");
    }

    /**
     * Take a screenshot of the current scene
     * @returns {string} - Data URL of the screenshot
     */
    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL('image/png');
    }

    /**
     * Show/hide the grid
     * @param {boolean} visible - Whether the grid should be visible
     */
    setGridVisible(visible) {
        console.log(`Setting grid visibility: ${visible}`);
        
        this.scene.traverse(object => {
            if (object instanceof THREE.GridHelper) {
                object.visible = visible;
            }
        });
    }

    /**
     * Set the background color of the scene
     * @param {number} color - Hexadecimal color value
     */
    setBackgroundColor(color) {
        console.log(`Setting background color: ${color.toString(16)}`);
        
        this.scene.background = new THREE.Color(color);
    }
    
    /**
     * Create a bounding box visualization for a model
     * @param {THREE.Object3D} model - The model to visualize
     * @param {number} color - The color of the bounding box
     */
    createBoundingBoxHelper(model, color = 0xff0000) {
        if (!model) return null;
        
        const boundingBox = new THREE.Box3().setFromObject(model);
        const helper = new THREE.Box3Helper(boundingBox, new THREE.Color(color));
        this.scene.add(helper);
        return helper;
    }
    
    /**
     * Enable fog in the scene
     * @param {number} color - Fog color
     * @param {number} near - Near distance where fog begins
     * @param {number} far - Far distance where fog is solid
     */
    enableFog(color = 0xcccccc, near = 10, far = 50) {
        console.log(`Enabling fog (color: ${color.toString(16)}, near: ${near}, far: ${far})`);
        
        this.scene.fog = new THREE.Fog(color, near, far);
    }
    
    /**
     * Disable fog in the scene
     */
    disableFog() {
        console.log("Disabling fog");
        
        this.scene.fog = null;
    }
} 