// Main application file for the French Bulldog & Owner 3D Models project

// Global variables
let scene, camera, renderer, controls;
let logger;
let sceneManager;
let modelLoader;
let dogModel, ownerModel;
let currentModel = null;
let boundingBoxHelper = null;
let isInitialized = false;
let testGroup;
let modelsCreated = false;

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', onWindowResize);

// Force hide loading screen after timeout regardless of loading state
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('Forcing loading screen to hide after timeout');
        loadingScreen.style.display = 'none';
    }
    
    // If scene is not initialized, show error to user
    if (!isInitialized) {
        console.error('Scene failed to initialize properly within timeout period');
        alert('The 3D scene is taking too long to load. Please check the console for errors.');
    }
}, 8000); // 8 seconds max loading time

/**
 * Initialize the Three.js scene and application
 */
function init() {
    console.log('Initializing 3D application...');
    
    // Initialize the logger
    if (window.logger) {
        logger = window.logger;
        logger.log('Logger initialized');
    } else {
        // Fallback to console logging
        logger = {
            log: (msg) => console.log(msg),
            error: (msg) => console.error(msg),
            warn: (msg) => console.warn(msg),
            success: (msg) => console.log('%c' + msg, 'color: green')
        };
        console.log('Using fallback logger');
    }
    
    // Update loading progress
    updateLoadingProgress(10);
    
    try {
        // Setup scene, camera, and renderer
        setupRenderer();
        
        // Add test objects immediately to verify rendering works
        logger.log('Adding test objects to scene');
        addTestObjects();
        
        // Handle model selection changes
        const modelSelect = document.getElementById('modelSelect');
        if (modelSelect) {
            modelSelect.addEventListener('change', function() {
                loadSelectedModel(this.value);
            });
        }
        
        // Add controls event listeners
        setupControlButtons();
        
        // Load the default model
        const defaultModel = 'both';
        logger.log(`Loading default model: ${defaultModel}`);
        loadSelectedModel(defaultModel);
        
        // Start animation loop
        animate();
        
        // Update loading progress to completion
        setTimeout(() => {
            updateLoadingProgress(100);
            
            // Auto-hide loading screen after a delay
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                    logger.success('Loading screen hidden - initialization complete');
                }
            }, 500);
        }, 1000);
        
    } catch (error) {
        logger.error(`Error during initialization: ${error.message}`);
        console.error(error);
        showErrorMessage(`Failed to initialize: ${error.message}`);
    }
}

/**
 * Setup the Three.js renderer, scene, camera, and controls
 */
function setupRenderer() {
    logger.log('Setting up renderer, scene, camera, and controls');
    
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        60,                                     // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,                                    // Near clipping plane
        1000                                    // Far clipping plane
    );
    
    // Set initial camera position
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);
    
    // Create renderer with improved settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Add renderer to DOM
    const container = document.getElementById('container');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }
    
    // Create orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
    controls.target.set(0, 1, 0); // Look at center of scene, slightly above ground
    
    // Create scene manager
    sceneManager = new ParkSceneCreator(scene);
    
    // Create model loader
    modelLoader = new ModelLoader(scene);
    
    // Update loading progress
    updateLoadingProgress(30);
    
    // Create park scene with enhanced settings
    sceneManager.createScene({
        groundSize: 20,
        treesCount: 15,
        bushesCount: 20,
        flowersCount: 30,
        addBenches: true,
        addPathway: true,
        addPond: true,
        skyBox: true,
        enableParticles: true,
        enhancedLighting: true,
        grassDetail: 'high',
        ambientOcclusion: true
    });
    
    // Update loading progress
    updateLoadingProgress(50);
    
    // Set flag to indicate initialization is complete
    isInitialized = true;
    
    logger.success('Renderer setup complete');
}

/**
 * Create the dog and owner models
 */
function createModels() {
    logger.log('Creating dog and owner models');
    
    // Create dog model
    dogModel = new DogModel(scene, modelLoader);
    
    // Create owner model
    ownerModel = new OwnerModel(scene, modelLoader);
    
    // Set flag to indicate models are created
    modelsCreated = true;
    
    logger.success('Models created');
}

/**
 * Load the selected model(s)
 * @param {string} modelType - The type of model to load ('dog', 'owner', or 'both')
 */
async function loadSelectedModel(modelType) {
    logger.log(`Loading model: ${modelType}`);
    
    // Clear existing models
    clearModels();
    
    // Create models if not already created
    if (!modelsCreated) {
        createModels();
    }
    
    try {
        // Load the selected model(s)
        switch (modelType) {
            case 'dog':
                // Create and add dog model
                const dogModelObj = dogModel.createFullModel();
                scene.add(dogModelObj);
                currentModel = dogModelObj;
                logger.success('Dog model loaded successfully');
                break;
                
            case 'owner':
                // Create and add owner model
                const ownerModelObj = ownerModel.createFullModel();
                scene.add(ownerModelObj);
                currentModel = ownerModelObj;
                logger.success('Owner model loaded successfully');
                break;
                
            case 'both':
                // Create and add both models with proper positioning
                const dogObj = dogModel.createFullModel();
                const ownerObj = ownerModel.createFullModel();
                
                // Position the dog and owner relative to each other and away from the pond
                dogObj.position.set(3.5, 0.02, 2.5); // Move to the right side of the scene, away from pond
                ownerObj.position.set(2.5, 0.02, 2.5); // Position next to the dog, away from pond
                
                // Add a leash connecting the dog and owner
                const leash = createLeash(dogObj, ownerObj);
                
                // Add models to scene
                scene.add(dogObj);
                scene.add(ownerObj);
                scene.add(leash);
                
                // Store references
                currentModel = new THREE.Group();
                currentModel.add(dogObj);
                currentModel.add(ownerObj);
                currentModel.add(leash);
                
                logger.success('Both models loaded successfully');
                break;
                
            default:
                logger.error(`Unknown model type: ${modelType}`);
                break;
        }
    } catch (error) {
        logger.error(`Error loading model: ${error.message}`);
        console.error(error);
        showErrorMessage(`Failed to load model: ${error.message}`);
    }
}

/**
 * Create a leash connecting the dog and owner
 * @param {THREE.Object3D} dogObj - The dog model
 * @param {THREE.Object3D} ownerObj - The owner model
 * @returns {THREE.Object3D} - The leash object
 */
function createLeash(dogObj, ownerObj) {
    // Create a group for the leash
    const leashGroup = new THREE.Group();
    
    // Define connection points - adjusted for the new positions
    const dogCollarPosition = new THREE.Vector3(
        dogObj.position.x,
        dogObj.position.y + 0.25, // Lower to match the dog's neck height
        dogObj.position.z
    );
    
    // Improved hand position - properly positioned in the owner's right hand
    const ownerHandPosition = new THREE.Vector3(
        ownerObj.position.x + 0.25,  // Position in the right hand
        ownerObj.position.y + 0.75,  // Proper height for hand position
        ownerObj.position.z          // Same Z position
    );
    
    // Create a curve for the leash with more natural droop
    const curve = new THREE.CatmullRomCurve3([
        dogCollarPosition,
        new THREE.Vector3(
            (dogCollarPosition.x + ownerHandPosition.x) * 0.5,
            Math.min(dogCollarPosition.y, ownerHandPosition.y) - 0.1, // Create a natural droop
            (dogCollarPosition.z + ownerHandPosition.z) * 0.5
        ),
        ownerHandPosition
    ]);
    
    // Create the leash geometry with improved resolution
    const leashGeometry = new THREE.TubeGeometry(curve, 32, 0.008, 8, false);
    
    // Create the leash material with improved appearance
    const leashMaterial = new THREE.MeshStandardMaterial({
        color: 0x5D2906, // Darker brown for more realistic leather
        roughness: 0.9,
        metalness: 0.1
    });
    
    // Create the leash mesh
    const leashMesh = new THREE.Mesh(leashGeometry, leashMaterial);
    leashGroup.add(leashMesh);
    
    // Name the leash for easy reference
    leashGroup.name = 'leash';
    
    return leashGroup;
}

/**
 * Handle window resize events
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    if (controls) {
        controls.update();
    }
    
    // Update scene manager if available
    if (sceneManager && sceneManager.update) {
        sceneManager.update();
    }
    
    // Render the scene
    if (scene && camera && renderer) {
        renderer.render(scene, camera);
    }
    
    // Update any model animations
    if (currentModel) {
        // If the current model is a group containing both models
        if (currentModel.children && currentModel.children.length > 0) {
            // Update each child model
            currentModel.children.forEach(child => {
                if (child.userData && child.userData.update) {
                    child.userData.update();
                }
            });
        } else if (currentModel.userData && currentModel.userData.update) {
            // Update the current model
            currentModel.userData.update();
        }
    }
}

/**
 * Setup control buttons event listeners
 */
function setupControlButtons() {
    // Reset view button
    const resetViewBtn = document.getElementById('resetViewBtn');
    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', function() {
            // Reset camera position
            camera.position.set(5, 3, 5);
            controls.target.set(0, 1, 0);
            controls.update();
        });
    }
    
    // Toggle wireframe button
    const toggleWireframeBtn = document.getElementById('toggleWireframeBtn');
    if (toggleWireframeBtn) {
        toggleWireframeBtn.addEventListener('click', function() {
            toggleWireframe();
            this.classList.toggle('active');
        });
    }
    
    // Toggle shadows button
    const toggleShadowsBtn = document.getElementById('toggleShadowsBtn');
    if (toggleShadowsBtn) {
        toggleShadowsBtn.addEventListener('click', function() {
            toggleShadows();
            this.classList.toggle('active');
        });
    }
    
    // Toggle grid button
    const toggleGridBtn = document.getElementById('toggleGridBtn');
    if (toggleGridBtn) {
        toggleGridBtn.addEventListener('click', function() {
            toggleGrid();
            this.classList.toggle('active');
        });
    }
    
    // Pet the dog button
    const petDogBtn = document.getElementById('petDogBtn');
    if (petDogBtn) {
        petDogBtn.addEventListener('click', function() {
            petDog();
        });
    }
}

/**
 * Toggle wireframe mode for all meshes in the scene
 */
function toggleWireframe() {
    scene.traverse(function(object) {
        if (object.isMesh) {
            object.material.wireframe = !object.material.wireframe;
        }
    });
}

/**
 * Toggle shadows in the scene
 */
function toggleShadows() {
    renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
    
    scene.traverse(function(object) {
        if (object.isMesh) {
            object.castShadow = renderer.shadowMap.enabled;
            object.receiveShadow = renderer.shadowMap.enabled;
        }
    });
}

/**
 * Toggle grid helper
 */
function toggleGrid() {
    const existingGrid = scene.getObjectByName('gridHelper');
    
    if (existingGrid) {
        scene.remove(existingGrid);
    } else {
        const gridHelper = new THREE.GridHelper(20, 20);
        gridHelper.name = 'gridHelper';
        scene.add(gridHelper);
    }
}

/**
 * Pet the dog animation
 */
function petDog() {
    const dog = scene.getObjectByName('frenchBulldog');
    
    if (dog) {
        // Create a simple animation for the dog
        const startScale = { y: dog.scale.y };
        const endScale = { y: dog.scale.y * 1.1 };
        
        // Use GSAP if available, otherwise use a simple animation
        if (window.gsap) {
            gsap.timeline()
                .to(dog.scale, { y: endScale.y, duration: 0.3, ease: "power1.out" })
                .to(dog.scale, { y: startScale.y, duration: 0.3, ease: "power1.in" })
                .to(dog.rotation, { y: dog.rotation.y + Math.PI * 2, duration: 1, ease: "power1.inOut" });
        } else {
            // Simple animation fallback
            let startTime = Date.now();
            const duration = 1000; // 1 second
            
            const animatePet = function() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                if (progress < 0.3) {
                    // Scale up
                    dog.scale.y = startScale.y + (endScale.y - startScale.y) * (progress / 0.3);
                } else if (progress < 0.6) {
                    // Scale down
                    dog.scale.y = endScale.y - (endScale.y - startScale.y) * ((progress - 0.3) / 0.3);
                } else {
                    // Rotate
                    dog.rotation.y = (progress - 0.6) / 0.4 * Math.PI * 2;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animatePet);
                } else {
                    dog.scale.y = startScale.y;
                    dog.rotation.y = 0;
                }
            };
            
            animatePet();
        }
    }
}

/**
 * Clear all models from the scene
 */
function clearModels() {
    if (currentModel) {
        // If current model is a group, remove all children
        if (currentModel.isGroup) {
            while (currentModel.children.length > 0) {
                const child = currentModel.children[0];
                currentModel.remove(child);
                scene.remove(child);
            }
        }
        
        // Remove the current model from the scene
        scene.remove(currentModel);
        currentModel = null;
    }
    
    // Also try to find and remove models by name
    const dogModel = scene.getObjectByName('frenchBulldog');
    if (dogModel) {
        scene.remove(dogModel);
    }
    
    const ownerModel = scene.getObjectByName('dogOwner');
    if (ownerModel) {
        scene.remove(ownerModel);
    }
}

/**
 * Update the loading progress bar
 * @param {number} progress - Progress percentage (0-100)
 */
function updateLoadingProgress(progress) {
    const progressBar = document.getElementById('loading-progress-bar');
    const progressText = document.getElementById('loading-progress-text');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }
}

function addTestObjects() {
    logger.log('Creating test objects to verify rendering');
    
    // Create a group to hold test objects
    testGroup = new THREE.Group();
    testGroup.name = 'testGroup';
    
    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x91e396 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    testGroup.add(ground);
    
    // Add a red cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, 0);
    testGroup.add(cube);
    
    // Add a blue sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(2, 0.5, 0);
    testGroup.add(sphere);
    
    // Add a green cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(-2, 0.5, 0);
    testGroup.add(cylinder);
    
    // Position the group
    testGroup.position.y = 0.5;
    
    // Add the group to the scene
    scene.add(testGroup);
    
    logger.success('Test objects added to scene');
}

function showErrorMessage(message) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const loadingText = loadingScreen.querySelector('h2');
        if (loadingText) {
            loadingText.innerHTML = `Error: ${message}`;
            loadingText.style.color = '#ff5555';
        }
        
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.backgroundColor = '#ff5555';
        }
    }
    
    logger.error(`Error displayed to user: ${message}`);
} 