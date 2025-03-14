/**
 * DogModel class
 * Handles creation and management of the French Bulldog 3D model
 */
class DogModel {
    /**
     * Constructor
     * @param {THREE.Scene} scene - The Three.js scene (optional)
     * @param {ModelLoader} modelLoader - The model loader utility (optional)
     */
    constructor(scene, modelLoader) {
        // Store scene reference if provided, otherwise use the global scene
        this.scene = scene || window.scene;
        this.modelLoader = modelLoader;
        
        // Define dog breed proportions (French Bulldog) - refined for better realism
        this.proportions = {
            height: 0.35,           // Slightly shorter overall height
            length: 0.45,           // Body length for stockier appearance
            headWidth: 0.22,        // Width of the head
            headHeight: 0.18,       // Height of the head
            headLength: 0.20,       // Length of the head
            legHeight: 0.12,        // Shorter leg height for Frenchie
            legLength: 0.15,        // Length of legs
            legWidth: 0.06,         // Thicker legs
            chestWidth: 0.28,       // Wider chest (stocky build)
            chestDepth: 0.30,       // Deeper chest for better profile
            neckLength: 0.04,       // Shorter neck (Frenchies have compact necks)
            neckSize: 0.14,         // Thicker neck
            tailLength: 0.08,       // Short tail
            tailWidth: 0.05,        // Tail width/diameter
            earSize: 0.12,          // Larger bat ears
            eyeSize: 0.025,         // Eye size
            noseSize: 0.04,         // Nose size
            muzzleDepth: 0.06,      // Flat face
            pawSize: 0.05           // Paw size
        };
        
        // Check that Three.js is available
        if (!window.THREE && typeof THREE === 'undefined') {
            console.error('THREE is not defined. Make sure Three.js is loaded before using DogModel.');
        }
        
        // Log successful initialization
        console.log('DogModel initialized with improved proportions');
        
        // Color and material properties - enhanced for realism
        this.colors = {
            body: 0x1A1A1A,         // Black base color
            bodyHighlight: 0x2A2A2A, // Slight highlight for texture
            bodyStripe: 0x0A0A0A,    // Darker black for depth
            head: 0x1A1A1A,         // Head color (same as body)
            ears: 0x1A1A1A,         // Ear color (same as body)
            eyes: 0x3E2723,         // Dark brown eyes
            nose: 0x000000,         // Very dark nose
            paws: 0x1A1A1A,         // Paw color (same as body)
            tongue: 0xE57373,       // Pink tongue
            collar: 0x1976D2,       // Blue collar
            tag: 0xC0C0C0           // Silver tag
        };
        
        // Model caching
        this.components = {};
        
        // Initialize animation states
        this.jumpAnimation = {
            active: false,
            startTime: 0,
            duration: 0,
            height: 0,
            forwardDistance: 0,
            startPosition: null
        };
        
        this.spinAnimation = {
            active: false,
            startTime: 0,
            duration: 0,
            rotations: 0,
            bounceHeight: 0,
            startRotation: 0
        };
        
        this.happiness = 0.5; // Initial happiness level
        this.originalPositions = null;
        this.originalRotation = 0;
    }
    
    /**
     * Create a dog model
     * This is the main entry point for creating a dog model with proper animations
     * @returns {THREE.Group} - The complete dog model
     */
    createModel() {
        console.log('Creating dog model with improved animation system...');
        try {
            // Create the full model first
            const model = this.createFullModel();
            
            if (!model) {
                console.error('Failed to create full model');
                return null;
            }
            
            // Explicitly ensure all animation methods are available
            const self = this;
            
            // Add direct methods to the model for easy access
            model.jump = function() {
                console.log('Jump method called directly from model');
                return self.jump();
            };
            
            model.spin = function() {
                console.log('Spin method called directly from model');
                return self.spin();
            };
            
            model.updateAnimations = function(deltaTime) {
                console.log('UpdateAnimations called directly from model');
                return self.updateAnimations(deltaTime);
            };
            
            // Store references to important parts for animation
            this.body = model.getObjectByName('dogBody');
            this.head = model.getObjectByName('dogHead');
            this.tail = model.getObjectByName('dogTail');
            
            // Store original positions for animation reference
            this.originalPositions = {
                body: this.body ? this.body.position.clone() : null,
                head: this.head ? this.head.position.clone() : null,
                tail: this.tail ? this.tail.position.clone() : null
            };
            
            // Initialize animation states
            this.jumpAnimation = {
                active: false,
                startTime: 0,
                duration: 1000,
                height: 1.0,
                forwardDistance: 0.3
            };
            
            this.spinAnimation = {
                active: false,
                startTime: 0,
                duration: 1200,
                rotations: 1.5,
                bounceHeight: 0.2
            };
            
            // Initialize random idle animation timing
            this.lastIdleAnimationTime = performance.now();
            this.idleAnimationInterval = 5000 + Math.random() * 5000;
            
            console.log('Dog model created successfully with animation methods attached');
            return model;
        } catch (error) {
            console.error('Error in DogModel.createModel:', error);
            return this.createSimpleDogModel();
        }
    }
    
    /**
     * Load a specific component of the dog model
     * @param {string} component - Component to load ('full', 'base', 'head', etc.)
     * @returns {Promise<THREE.Object3D>} - Promise resolving to the loaded component
     */
    async loadComponent(component) {
        // Check if we have a cached version
        if (this.components[component]) {
            return Promise.resolve(this.components[component].clone());
        }
        
        // Skip trying to load from file since they don't exist
        // Create component programmatically instead
        console.log(`Creating dog component programmatically: ${component}`);
        return this.createComponent(component);
    }
    
    /**
     * Create a specific coat variant
     * @param {string} variant - Coat variant ('brindle', 'fawn', 'pied', 'cream')
     * @returns {THREE.Object3D} - The model with the specified coat variant
     */
    createCoatVariant(variant) {
        // Set the appropriate color based on variant
        switch (variant.toLowerCase()) {
            case 'brindle':
                this.setCoatColor(0x5D4037); // Dark brown
                    break;
            case 'fawn':
                this.setCoatColor(0xD7B889); // Light tan
                    break;
            case 'pied':
                this.setCoatColor(0xF5F5DC); // White with pattern (simplified)
                    break;
            case 'cream':
                this.setCoatColor(0xFFF8DC); // Cream color
                    break;
                default:
                this.setCoatColor(0x000000); // Default black
                    break;
            }
            
        // Return full model with updated coat color
                return this.createFullModel();
    }
    
    /**
     * Create a full dog model with all components
     * @returns {THREE.Group} - The complete dog model
     */
    createFullModel() {
        try {
            console.log('Creating enhanced French Bulldog model...');
            
            // Create a group to hold all components
            const group = new THREE.Group();
            group.name = 'frenchBulldog';
            
            // Create enhanced body with better proportions
            const body = this.createEnhancedBody();
            body.name = 'dogBody'; // Named for easy retrieval
            group.add(body);
            
            // Create enhanced head with better shape
            const head = this.createEnhancedHead();
            head.name = 'dogHead'; // Named for easy retrieval
            head.position.set(0, this.proportions.height * 0.7, this.proportions.length * 0.4);
            group.add(head);
            
            // Create legs with better proportions
            const legsGroup = this.createEnhancedLegs();
            group.add(legsGroup);
            
            // Create enhanced tail
            const tail = this.createEnhancedTail();
            tail.name = 'dogTail'; // Named for easy retrieval
            tail.position.set(0, this.proportions.height * 0.6, -this.proportions.length * 0.4);
            tail.rotation.x = Math.PI / 6; // Angle the tail slightly upward
            group.add(tail);
            
            // Add collar
            const collar = this.createCollar();
            collar.position.set(0, this.proportions.height * 0.65, this.proportions.length * 0.35);
            group.add(collar);
            
            // Add brindle pattern
            this.addBrindlePattern(group);
            
            // Add muscle definition
            this.addMuscleDefinition(group);
            
            // Add fur texture effect
            this.addFurTextureEffect(group);
            
            // Store references to important parts for animations
            this.body = body;
            this.head = head;
            this.tail = tail;
            
            // Explicitly add direct animation methods to the dog model
            const self = this; // Store reference to DogModel instance
            
            // Direct jump method on the model
            group.jump = function() {
                console.log('Jump method called from group');
                return self.jump();
            };
            
            // Direct spin method on the model
            group.spin = function() {
                console.log('Spin method called from group');
                return self.spin();
            };
            
            // Set up animation system
            this.setupAnimationSystem(group);
            
            console.log('Enhanced French Bulldog model created successfully');
            return group;
        } catch (error) {
            console.error('Error creating enhanced dog model:', error);
            console.log('Falling back to simple dog model...');
            return this.createSimpleDogModel();
        }
    }
    
    /**
     * Create a simple dog model as a fallback
     * @returns {THREE.Group} - A simple dog model
     */
    createSimpleDogModel() {
        const group = new THREE.Group();
        group.name = 'simpleDog';
        
        // Create a simple body using a box
        const bodyGeometry = new THREE.BoxGeometry(
            this.proportions.chestWidth,
            this.proportions.height * 0.5,
            this.proportions.length
        );
        
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.body,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = this.proportions.height * 0.5;
        body.castShadow = true;
        group.add(body);
        
        // Create a simple head using a box
        const headGeometry = new THREE.BoxGeometry(
            this.proportions.headWidth,
            this.proportions.headHeight,
            this.proportions.headLength
        );
        
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.set(
            0,
            this.proportions.height * 0.75,
            this.proportions.length * 0.4
        );
        head.castShadow = true;
        group.add(head);
        
        // Create simple legs using cylinders
        const legGeometry = new THREE.CylinderGeometry(
            this.proportions.legWidth * 0.5,
            this.proportions.legWidth * 0.5,
            this.proportions.height * 0.5,
            8
        );
        
        // Front left leg
        const frontLeftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
        frontLeftLeg.position.set(
            this.proportions.chestWidth * 0.4,
            this.proportions.height * 0.25,
            this.proportions.length * 0.3
        );
        frontLeftLeg.castShadow = true;
        group.add(frontLeftLeg);
        
        // Front right leg
        const frontRightLeg = frontLeftLeg.clone();
        frontRightLeg.position.x = -frontLeftLeg.position.x;
        group.add(frontRightLeg);
        
        // Back left leg
        const backLeftLeg = frontLeftLeg.clone();
        backLeftLeg.position.z = -this.proportions.length * 0.3;
        group.add(backLeftLeg);
        
        // Back right leg
        const backRightLeg = frontRightLeg.clone();
        backRightLeg.position.z = -this.proportions.length * 0.3;
        group.add(backRightLeg);
        
        // Create a simple tail using a cylinder
        const tailGeometry = new THREE.CylinderGeometry(
            this.proportions.tailWidth * 0.5,
            this.proportions.tailWidth * 0.3,
            this.proportions.tailLength,
            8
        );
        
        const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
        tail.position.set(
            0,
            this.proportions.height * 0.6,
            -this.proportions.length * 0.5
        );
        tail.rotation.x = Math.PI / 4; // Angle the tail upward
        tail.castShadow = true;
        group.add(tail);
        
        // Create simple ears using cones
        const earGeometry = new THREE.ConeGeometry(
            this.proportions.headWidth * 0.2,
            this.proportions.headHeight * 0.5,
            8
        );
        
        // Left ear
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(
            this.proportions.headWidth * 0.3,
            this.proportions.headHeight * 0.9,
            this.proportions.length * 0.35
        );
        leftEar.castShadow = true;
        group.add(leftEar);
        
        // Right ear
        const rightEar = leftEar.clone();
        rightEar.position.x = -leftEar.position.x;
        group.add(rightEar);
        
        console.log('Simple dog model created as fallback');
        return group;
    }
    
    /**
     * Create a collar for the dog
     * @returns {THREE.Group} - The collar group
     */
    createCollar() {
        const collarGroup = new THREE.Group();
        collarGroup.name = 'dogCollar';
        
        // Create collar geometry - a torus
        const collarGeometry = new THREE.TorusGeometry(
            this.proportions.neckSize * 1.2,
            this.proportions.neckSize * 0.15,
            16,
            32
        );
        
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x8B4513), // Brown leather color
            roughness: 0.7,
            metalness: 0.3
        });
        
        const collar = new THREE.Mesh(collarGeometry, collarMaterial);
        collar.rotation.x = Math.PI / 2;
        collar.castShadow = true;
        collarGroup.add(collar);
        
        // Add a tag to the collar
        const tagGeometry = new THREE.CylinderGeometry(
            this.proportions.neckSize * 0.2,
            this.proportions.neckSize * 0.2,
            this.proportions.neckSize * 0.1,
            16
        );
        
        const tagMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xC0C0C0), // Silver color
            roughness: 0.4,
            metalness: 0.8
        });
        
        const tag = new THREE.Mesh(tagGeometry, tagMaterial);
        tag.position.set(0, -this.proportions.neckSize * 1.2, 0);
        tag.rotation.x = Math.PI / 2;
        tag.castShadow = true;
        collarGroup.add(tag);
        
        return collarGroup;
    }
    
    /**
     * Add brindle pattern to the dog model
     * @param {THREE.Group} dogGroup - The dog group to add pattern to
     */
    addBrindlePattern(dogGroup) {
        // This would ideally use a custom shader or texture
        // For now, we'll simulate it by adding small darker patches
        
        const bodyMesh = dogGroup.getObjectByName('dogBody');
        if (!bodyMesh) return;
        
        const stripeGeometry = new THREE.BoxGeometry(
            this.proportions.chestWidth * 0.1,
            this.proportions.height * 0.05,
            this.proportions.length * 0.1
        );
        
        const stripeMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x5D4037), // Darker brown
            roughness: 0.9,
            metalness: 0.1,
            transparent: true,
            opacity: 0.7
        });
        
        // Add random stripes to the body
        for (let i = 0; i < 15; i++) {
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            
            // Random position on the body
            stripe.position.set(
                (Math.random() - 0.5) * this.proportions.chestWidth,
                this.proportions.height * 0.5 + (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * this.proportions.length
            );
            
            // Random rotation
            stripe.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Random scale
            const scale = 0.5 + Math.random() * 1.5;
            stripe.scale.set(scale, scale * 0.5, scale);
            
            bodyMesh.add(stripe);
        }
    }
    
    /**
     * Add muscle definition to the dog model
     * @param {THREE.Group} dogGroup - The dog group to add muscles to
     */
    addMuscleDefinition(dogGroup) {
        // This would ideally use displacement maps
        // For now, we'll simulate it with subtle geometry
        
        const bodyMesh = dogGroup.getObjectByName('dogBody');
        if (!bodyMesh) return;
        
        const muscleGeometry = new THREE.SphereGeometry(
            this.proportions.chestWidth * 0.15,
            8,
            8
        );
        
        const muscleMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.body,
            roughness: 0.8,
            metalness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        // Add shoulder muscles
        const leftShoulderMuscle = new THREE.Mesh(muscleGeometry, muscleMaterial);
        leftShoulderMuscle.position.set(
            this.proportions.chestWidth * 0.4,
            this.proportions.height * 0.6,
            this.proportions.length * 0.2
        );
        leftShoulderMuscle.scale.set(1, 0.7, 1.2);
        bodyMesh.add(leftShoulderMuscle);
        
        const rightShoulderMuscle = leftShoulderMuscle.clone();
        rightShoulderMuscle.position.x = -leftShoulderMuscle.position.x;
        bodyMesh.add(rightShoulderMuscle);
        
        // Add thigh muscles
        const leftThighMuscle = new THREE.Mesh(muscleGeometry, muscleMaterial);
        leftThighMuscle.position.set(
            this.proportions.chestWidth * 0.35,
            this.proportions.height * 0.55,
            -this.proportions.length * 0.25
        );
        leftThighMuscle.scale.set(1.2, 0.8, 1.3);
        bodyMesh.add(leftThighMuscle);
        
        const rightThighMuscle = leftThighMuscle.clone();
        rightThighMuscle.position.x = -leftThighMuscle.position.x;
        bodyMesh.add(rightThighMuscle);
    }
    
    /**
     * Add fur texture effect to the dog model
     * @param {THREE.Group} dogGroup - The dog group to add fur to
     */
    addFurTextureEffect(dogGroup) {
        // This would ideally use a custom shader or displacement map
        // For now, we'll adjust the material properties
        
        dogGroup.traverse((object) => {
            if (object.isMesh && object.material) {
                // Skip objects that aren't part of the fur (like eyes, nose, etc.)
                if (object.material.color && 
                    object.material.color.getHex() !== new THREE.Color(this.colors.body).getHex()) {
                    return;
                }
                
                // Clone the material to avoid affecting other meshes
                object.material = object.material.clone();
                
                // Adjust material properties to simulate fur
                object.material.roughness = 0.95;
                object.material.metalness = 0.05;
                
                // Add subtle displacement for fur effect
                if (!object.material.displacementMap) {
                    // In a real implementation, we would load a fur displacement texture
                    // For now, we'll just adjust the existing material properties
                    object.material.bumpScale = 0.02;
                }
            }
        });
    }
    
    /**
     * Set up animation system for the dog model
     * @param {THREE.Group} dogModel - The dog model to animate
     */
    setupAnimationSystem(dogModel) {
        if (!dogModel) {
            console.error("Cannot setup animation system: No dog model provided");
            return;
        }
        
        console.log('Setting up enhanced animation system for dog model');
        
        // Store animation state
        dogModel.userData.animations = {
            time: 0,
            breathing: {
                enabled: true,
                speed: 1.5,
                amplitude: 0.02
            },
            headMovement: {
                enabled: true,
                speed: 0.8,
                amplitude: 0.05
            },
            tailWagging: {
                enabled: true,
                speed: 5.0,
                amplitude: 0.2
            },
            blinking: {
                enabled: true,
                interval: 4000, // ms
                duration: 150,  // ms
                lastBlink: 0
            },
            petResponse: {
                active: false,
                startTime: 0,
                duration: 3000 // ms
            },
            happy: {
                active: false,
                intensity: 0,
                duration: 5000,
                startTime: 0
            },
            jumping: {
                active: false,
                startTime: 0,
                duration: 1000,
                height: 0.5,
                originalY: 0
            },
            spinning: {
                active: false,
                startTime: 0,
                duration: 1500,
                rotations: 1,
                originalRotation: 0
            }
        };
        
        // Find all animatable components and store references
        const body = dogModel.getObjectByName('dogBody');
        const head = dogModel.getObjectByName('dogHead');
        const tail = dogModel.getObjectByName('dogTail');
        
        // Store components directly on this instance
        this.body = body;
        this.head = head;
        this.tail = tail;
        
        // Also store references in dogModel.userData for animation system
        dogModel.userData.components = {
            body: body,
            head: head,
            tail: tail
        };
        
        // Log component discovery results
        console.log('Dog model components found:', {
            body: !!body,
            head: !!head, 
            tail: !!tail
        });
        
        // Store original positions and rotations for animation reference
        if (body) {
            this.originalBodyPos = body.position.clone();
            this.originalBodyRot = body.rotation.clone();
            body.userData.originalPosition = body.position.clone();
            body.userData.originalRotation = body.rotation.clone();
            body.userData.originalScale = body.scale.clone();
        }
        
        if (head) {
            this.originalHeadPos = head.position.clone();
            this.originalHeadRot = head.rotation.clone();
            head.userData.originalPosition = head.position.clone();
            head.userData.originalRotation = head.rotation.clone();
        }
        
        if (tail) {
            this.originalTailPos = tail.position.clone();
            this.originalTailRot = tail.rotation.clone();
            tail.userData.originalPosition = tail.position.clone();
            tail.userData.originalRotation = tail.rotation.clone();
        }
        
        // Store original positions for animation reference
        this.originalPositions = {
            body: body ? body.position.clone() : null,
            head: head ? head.position.clone() : null,
            tail: tail ? tail.position.clone() : null
        };
        
        this.originalRotations = {
            body: body ? body.rotation.clone() : null,
            head: head ? head.rotation.clone() : null,
            tail: tail ? tail.rotation.clone() : null
        };
        
        // Set up individual animations
        if (body) this.setupBreathingAnimation(body);
        if (head) this.setupHeadMovement(head);
        if (tail) this.setupTailWagging(tail);
        
        // Set up petting response
        this.setupPettingResponse(dogModel, head, tail);
        
        // Set up new animations
        this.setupJumpAnimation(dogModel);
        this.setupSpinAnimation(dogModel);
        
        // Set up eye blinking if eyes exist
        const eyes = head?.getObjectByName('dogEyes');
        if (eyes) {
            this.setupEyeBlinking(eyes, dogModel.userData.animations.blinking);
        }
        
        // Attach animation methods directly to dogModel
        dogModel.jump = () => {
            console.log('Jump method called on dog model (userData)');
            return this.jump();
        };
        
        dogModel.spin = () => {
            console.log('Spin method called on dog model (userData)');
            return this.spin();
        };
        
        // Create update method on the dog model
        dogModel.update = (deltaTime) => {
            // Update animations
            this.updateAnimations(dogModel);
        };
        
        // Create the main animation loop for this dog
        const animateThis = (time) => {
            const deltaTime = time * 0.001; // Convert to seconds
            dogModel.userData.animations.time = deltaTime;
            
            // Call instance update method to ensure both animation systems work
            this.updateAnimations(deltaTime);
            
            // Update all animations through userData system as well
            this.updateAnimations(dogModel);
            
            // Continue animation loop for this dog
            dogModel.userData.animationFrameId = requestAnimationFrame(animateThis);
        };
        
        // Start animation loop
        dogModel.userData.animationFrameId = requestAnimationFrame(animateThis);
        
        console.log('Dog animation system setup complete');
    }
    
    /**
     * Set up the jump animation configuration
     * @param {THREE.Group} dogModel - The dog model
     */
    setupJumpAnimation(dogModel) {
        if (!dogModel || !dogModel.userData) return;
        
        console.log('Setting up jump animation...');
        
        const animations = dogModel.userData.animations;
        if (!animations) return;
        
        const components = dogModel.userData.components;
        if (!components) return;
        
        // Configure jump animation
        animations.jumping = {
            active: false,
            startTime: 0,
            duration: 1000,     // 1 second jump
            height: 1.0,        // Maximum jump height
            forwardDistance: 0.3, // How far forward to move during jump
            originalY: dogModel.position.y
        };
        
        // Add direct jump method to dog model's userData
        dogModel.userData.jump = () => {
            console.log('Jump activated from userData');
            
            // Safety check to prevent overlapping animations
            if (animations.jumping.active || animations.spinning.active) {
                console.log('Animation already in progress, ignoring jump');
                return false;
            }
            
            // Store original positions for reference
            if (components.body) {
                animations.jumping.originalBodyPos = components.body.position.clone();
                animations.jumping.originalBodyRot = components.body.rotation.clone();
            }
            
            if (components.head) {
                animations.jumping.originalHeadPos = components.head.position.clone();
            }
            
            if (components.tail) {
                animations.jumping.originalTailPos = components.tail.position.clone();
            }
            
            // Save model position
            animations.jumping.originalY = dogModel.position.y;
            
            // Activate animation
            animations.jumping.active = true;
            animations.jumping.startTime = Date.now();
            
            // Also increase happiness
            animations.happy.intensity = 1.0;
            animations.happy.startTime = Date.now();
            animations.happy.duration = animations.jumping.duration + 500; // Continue being happy after jumping
            
            console.log('Dog is jumping!', animations.jumping);
            
            // Also call the instance method (added in createFullModel)
            if (this.jumpAnimation) {
                this.jump();
            }
            
            return true;
        };
        
        // Connect the global instance jump method to also trigger the userData jump
        const originalJump = this.jump.bind(this);
        this.jump = () => {
            console.log('Global jump method called, delegating to both methods');
            
            // Call the original instance method
            originalJump();
            
            // Also trigger the userData method if it hasn't been triggered already
            if (dogModel && dogModel.userData && dogModel.userData.jump && 
                !dogModel.userData.animations.jumping.active) {
                dogModel.userData.jump();
            }
            
            return true;
        };
    }

    /**
     * Set up spin animation
     * @param {THREE.Group} dogModel - The dog model
     */
    setupSpinAnimation(dogModel) {
        if (!dogModel) return;

        // Add spin method to dog model
        dogModel.spin = () => {
            console.log('Spin method called on dog model via setupSpinAnimation');
            if (dogModel.userData.animations.jumping.active || 
                dogModel.userData.animations.spinning.active) {
                console.log('Animation already in progress');
                return;
            }
            
            const animations = dogModel.userData.animations;
            animations.spinning.active = true;
            animations.spinning.startTime = Date.now();
            animations.spinning.originalRotation = dogModel.rotation.y;
            
            // Store original Y position if not already set
            if (!animations.jumping.originalY) {
                animations.jumping.originalY = dogModel.position.y;
            }
            
            // Make sure rotations and duration are set
            animations.spinning.rotations = 2; // Number of full rotations
            animations.spinning.duration = 1500; // 1.5 seconds for the spin

            // Increase happiness while spinning
            animations.happy.active = true;
            animations.happy.intensity = 1.0;
            animations.happy.startTime = Date.now();
            animations.happy.duration = animations.spinning.duration + 500; // Continue being happy after spinning

            console.log('Dog is spinning!', animations.spinning);
            
            // Also call the instance method (added in createFullModel)
            if (this.spinAnimation) {
                this.spin();
            }
        };
    }

    /**
     * Update all animations for the dog model
     * @param {THREE.Group} dogModel - The dog model to animate
     */
    updateAnimations(dogModel) {
        // Version 1: Update dogModel passed as parameter (from animation system)
        if (dogModel && dogModel.userData && dogModel.userData.animations) {
            const time = dogModel.userData.animations.time || (Date.now() * 0.001);
            const components = dogModel.userData.components;
            const animations = dogModel.userData.animations;
            
            // Update breathing animation
            if (components && components.body && animations.breathing && animations.breathing.enabled) {
                const breathingFactor = Math.sin(time * animations.breathing.speed) * 
                                       animations.breathing.amplitude + 1;
                
                if (components.body.userData && components.body.userData.originalScale) {
                    components.body.scale.set(
                        components.body.userData.originalScale.x,
                        components.body.userData.originalScale.y * breathingFactor,
                        components.body.userData.originalScale.z * breathingFactor
                    );
                }
            }
            
            // Update head movement animation
            if (components && components.head && animations.headMovement && animations.headMovement.enabled) {
                const headMovement = Math.sin(time * animations.headMovement.speed) * 
                                    animations.headMovement.amplitude;
                
                if (components.head.userData && components.head.userData.originalRotation) {
                    components.head.rotation.y = components.head.userData.originalRotation.y + 
                                                headMovement;
                    components.head.rotation.x = components.head.userData.originalRotation.x + 
                                                headMovement * 0.5;
                }
            }
            
            // Update tail wagging animation
            if (components && components.tail && animations.tailWagging && animations.tailWagging.enabled) {
                const tailWag = Math.sin(time * animations.tailWagging.speed) * 
                                animations.tailWagging.amplitude;
                
                if (components.tail.userData && components.tail.userData.originalRotation) {
                    components.tail.rotation.y = components.tail.userData.originalRotation.y + 
                                                tailWag;
                }
            }
            
            // Update jumping animation
            if (animations.jumping && animations.jumping.active) {
                const jumpElapsed = Date.now() - animations.jumping.startTime;
                const jumpProgress = Math.min(jumpElapsed / animations.jumping.duration, 1);
                
                // Create a smooth jump curve using sine
                const jumpHeight = Math.sin(jumpProgress * Math.PI) * animations.jumping.height;
                
                // Apply jump height to the entire model and its components
                dogModel.position.y = animations.jumping.originalY + jumpHeight;
                
                // Add forward motion during jump if not spinning
                if (!animations.spinning.active) {
                    if (jumpProgress < 0.5) {
                        dogModel.position.z += 0.01; // Move forward during upward motion
                        // Tilt the dog's body up slightly during the jump
                        if (components.body) {
                            components.body.rotation.x = -jumpProgress * Math.PI * 0.1;
                        }
                    } else {
                        // Tilt back to normal during descent
                        if (components.body) {
                            components.body.rotation.x = -(1 - jumpProgress) * Math.PI * 0.1;
                        }
                    }
                }
                
                // Log progress for debugging
                if (jumpProgress === 0 || jumpProgress === 1) {
                    console.log(`Jump progress: ${jumpProgress.toFixed(2)}, height: ${jumpHeight.toFixed(2)}`);
                }
                
                // Reset when animation is complete
                if (jumpProgress >= 1) {
                    animations.jumping.active = false;
                    dogModel.position.y = animations.jumping.originalY;
                    if (components.body) {
                        components.body.rotation.x = 0;
                    }
                    console.log('Jump animation completed');
                }
            }

            // Update spinning animation
            if (animations.spinning && animations.spinning.active) {
                const spinElapsed = Date.now() - animations.spinning.startTime;
                const spinProgress = Math.min(spinElapsed / animations.spinning.duration, 1);
                
                // Create a smooth spin using easing functions
                const rotationsInRadians = animations.spinning.rotations * Math.PI * 2;
                let currentRotation;
                
                if (spinProgress < 0.5) {
                    // Accelerate
                    currentRotation = rotationsInRadians * this.easeIn(spinProgress * 2) / 2;
                } else {
                    // Decelerate
                    currentRotation = rotationsInRadians * (0.5 + this.easeOut((spinProgress - 0.5) * 2) / 2);
                }
                
                dogModel.rotation.y = animations.spinning.originalRotation + currentRotation;
                
                // Add some vertical bounce during spin
                const bounceHeight = 0.3 * Math.sin(spinProgress * Math.PI * 2);
                
                // Make sure we have a valid original Y position
                if (typeof animations.jumping.originalY === 'undefined' || animations.jumping.originalY === null) {
                    animations.jumping.originalY = 0.05; // Default height above ground
                }
                
                dogModel.position.y = animations.jumping.originalY + bounceHeight;
                
                // Log progress for debugging
                if (spinProgress === 0 || spinProgress === 0.5 || spinProgress === 1) {
                    console.log(`Spin progress: ${spinProgress.toFixed(2)}, rotation: ${currentRotation.toFixed(2)}, bounce: ${bounceHeight.toFixed(2)}`);
                }
                
                // Reset when animation is complete
                if (spinProgress >= 1) {
                    animations.spinning.active = false;
                    dogModel.rotation.y = animations.spinning.originalRotation;
                    dogModel.position.y = animations.jumping.originalY;
                    console.log('Spin animation completed');
                }
            }
        }
        
        // Version 2: Update instance animations (from directly calling methods)
        const currentTime = performance.now();

        // Update jump animation
        if (this.jumpAnimation && this.jumpAnimation.active) {
            const elapsed = currentTime - this.jumpAnimation.startTime;
            const progress = Math.min(elapsed / this.jumpAnimation.duration, 1.0);
            
            if (progress < 1.0) {
                // Calculate vertical position using sine wave for smooth up/down
                const jumpHeight = Math.sin(progress * Math.PI) * this.jumpAnimation.height;
                
                // Calculate forward movement
                const forwardProgress = this.easeInOutQuad(progress);
                const forwardMove = forwardProgress * this.jumpAnimation.forwardDistance;
                
                if (this.body) {
                    // Update positions
                    this.body.position.y = (this.originalPositions.body ? 
                                         this.originalPositions.body.y : 0) + jumpHeight;
                    this.body.position.z = (this.originalPositions.body ? 
                                         this.originalPositions.body.z : 0) + forwardMove;
                    
                    // Tilt body during jump
                    const tiltAngle = Math.sin(progress * Math.PI * 2) * 0.2;
                    this.body.rotation.x = tiltAngle;
                }
                
                if (this.head && this.originalPositions.head) {
                    // Update head position
                    this.head.position.y = this.originalPositions.head.y + jumpHeight;
                    this.head.position.z = this.originalPositions.head.z + forwardMove;
                }
                
                if (this.tail && this.originalPositions.tail) {
                    // Update tail position
                    this.tail.position.y = this.originalPositions.tail.y + jumpHeight;
                    this.tail.position.z = this.originalPositions.tail.z + forwardMove;
                }
                
                if (progress === 0 || progress === 0.5 || progress === 1) {
                    console.log(`Instance jump progress: ${progress.toFixed(2)}`);
                }
            } else {
                // Reset positions and end animation
                this.resetPositions();
                this.jumpAnimation.active = false;
                console.log('Jump animation on instance completed');
            }
        }

        // Update spin animation
        if (this.spinAnimation && this.spinAnimation.active) {
            const elapsed = currentTime - this.spinAnimation.startTime;
            const progress = Math.min(elapsed / this.spinAnimation.duration, 1.0);
            
            if (progress < 1.0) {
                // Calculate rotation angle
                const rotationAngle = this.spinAnimation.startRotation + 
                    (Math.PI * 2 * this.spinAnimation.rotations * this.easeInOutQuad(progress));
                
                // Calculate bounce height using sine wave
                const bounceHeight = Math.sin(progress * Math.PI * 2) * this.spinAnimation.bounceHeight;
                
                if (this.body) {
                    // Update rotation and position
                    this.body.rotation.y = rotationAngle;
                    this.body.position.y = this.originalPositions.body.y + bounceHeight;
                    
                    // Debug logging for spin execution
                    if (progress === 0 || progress >= 0.5 || progress >= 0.99) {
                        console.log(`Spin progress: ${progress.toFixed(2)}, rotation: ${(rotationAngle % (Math.PI * 2)).toFixed(2)}`);
                    }
                }
                
                // Update head position for bounce
                if (this.head && this.originalPositions.head) {
                    this.head.position.y = this.originalPositions.head.y + bounceHeight;
                }
                
                // Update tail position for bounce
                if (this.tail && this.originalPositions.tail) {
                    this.tail.position.y = this.originalPositions.tail.y + bounceHeight;
                }
            } else {
                // Reset rotation and position
                this.resetPositions();
                if (this.body) {
                    this.body.rotation.y = this.originalRotation || 0;
                }
                this.spinAnimation.active = false;
                console.log('Spin animation on instance completed');
            }
        }
    }
    
    /**
     * Reset positions to original values
     */
    resetPositions() {
        if (!this.originalPositions) return;
        
        if (this.body && this.originalPositions.body) {
            this.body.position.copy(this.originalPositions.body);
            this.body.rotation.x = 0; // Reset any tilt
        }
        
        if (this.head && this.originalPositions.head) {
            this.head.position.copy(this.originalPositions.head);
        }
        
        if (this.tail && this.originalPositions.tail) {
            this.tail.position.copy(this.originalPositions.tail);
        }
        
        console.log('Reset positions completed');
    }

    /**
     * Easing function for smooth animation (ease in)
     * @param {number} t - Progress (0-1)
     * @returns {number} Eased value
     */
    easeIn(t) {
        return t * t;
    }
    
    /**
     * Easing function for smooth animation (ease out)
     * @param {number} t - Progress (0-1)
     * @returns {number} Eased value
     */
    easeOut(t) {
        return t * (2 - t);
    }
    
    /**
     * Easing function for smooth acceleration and deceleration
     * @param {number} t - Normalized time (0-1)
     * @returns {number} - Eased value
     */
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    /**
     * Set up breathing animation for the body
     * @param {THREE.Group} bodyGroup - The body group to animate
     */
    setupBreathingAnimation(bodyGroup) {
        if (!bodyGroup) return;
        
        // Store the original scale
        bodyGroup.userData.originalScale = bodyGroup.scale.clone();
    }
    
    /**
     * Set up subtle head movement animation
     * @param {THREE.Group} headGroup - The head group to animate
     */
    setupHeadMovement(headGroup) {
        if (!headGroup) return;
        
        // Store the original rotation
        headGroup.userData.originalRotation = {
            x: headGroup.rotation.x,
            y: headGroup.rotation.y,
            z: headGroup.rotation.z
        };
    }
    
    /**
     * Set up tail wagging animation
     * @param {THREE.Group} tailGroup - The tail group to animate
     */
    setupTailWagging(tailGroup) {
        if (!tailGroup) return;
        
        // Store the original rotation
        tailGroup.userData.originalRotation = {
            x: tailGroup.rotation.x,
            y: tailGroup.rotation.y,
            z: tailGroup.rotation.z
        };
    }
    
    /**
     * Set up response to petting
     * @param {THREE.Group} dogGroup - The main dog group
     * @param {THREE.Group} headGroup - The head group
     * @param {THREE.Group} tailGroup - The tail group
     */
    setupPettingResponse(dogGroup, headGroup, tailGroup) {
        if (!dogGroup) return;
        
        // Initialize userData if not exists
        if (!dogGroup.userData) dogGroup.userData = {};
        if (!dogGroup.userData.animations) dogGroup.userData.animations = {};
        
        // Add happy animation state
        dogGroup.userData.animations.happy = {
            active: false,
            intensity: 0,
            duration: 5000, // 5 seconds of happiness
            startTime: 0
        };
        
        // Add petting response method directly to the model
        dogGroup.respondToPetting = function() {
            // Set pet response active
            if (!this.userData.animations.petResponse) {
                this.userData.animations.petResponse = {};
            }
            
            this.userData.animations.petResponse.active = true;
            this.userData.animations.petResponse.startTime = Date.now();
            
            // Activate happy animation
            this.userData.animations.happy.active = true;
            this.userData.animations.happy.startTime = Date.now();
            this.userData.animations.happy.intensity = 1.0;
            
            // Find components if not provided
            if (!headGroup) {
                headGroup = this.getObjectByName('dogHead');
            }
            if (!tailGroup) {
                tailGroup = this.getObjectByName('dogTail');
            }
            
            // Store original positions if not already stored
            if (headGroup && !headGroup.userData.originalPosition) {
                headGroup.userData.originalPosition = {
                    rotation: {
                        x: headGroup.rotation.x,
                        y: headGroup.rotation.y,
                        z: headGroup.rotation.z
                    }
                };
            }
            
            if (tailGroup && !tailGroup.userData.originalPosition) {
                tailGroup.userData.originalPosition = {
                    rotation: {
                        x: tailGroup.rotation.x,
                        y: tailGroup.rotation.y,
                        z: tailGroup.rotation.z
                    }
                };
            }
            
            console.log('Dog is happy and being petted!');
        }.bind(dogGroup);

        // Add method to stop petting response
        dogGroup.stopPettingResponse = function() {
            if (this.userData && this.userData.animations) {
                this.userData.animations.petResponse.active = false;
                
                // Gradually decrease happiness
                if (this.userData.animations.happy) {
                    this.userData.animations.happy.intensity = 0.5; // Remain a bit happy
                    setTimeout(() => {
                        this.userData.animations.happy.intensity = 0;
                        this.userData.animations.happy.active = false;
                    }, 3000); // Gradually return to normal over 3 seconds
                }
            }
            
            // Find components if not provided
            if (!headGroup) {
                headGroup = this.getObjectByName('dogHead');
            }
            if (!tailGroup) {
                tailGroup = this.getObjectByName('dogTail');
            }
            
            // Reset positions gradually
            if (headGroup && headGroup.userData.originalPosition) {
                const originalRot = headGroup.userData.originalPosition.rotation;
                headGroup.rotation.x = originalRot.x;
                headGroup.rotation.y = originalRot.y;
                headGroup.rotation.z = originalRot.z;
            }
            
            if (tailGroup && tailGroup.userData.originalPosition) {
                const originalRot = tailGroup.userData.originalPosition.rotation;
                tailGroup.rotation.x = originalRot.x;
                tailGroup.rotation.y = originalRot.y;
                tailGroup.rotation.z = originalRot.z;
            }
        }.bind(dogGroup);

        // Add happy animation method
        dogGroup.setHappy = function(intensity = 1.0, duration = 5000) {
            if (!this.userData.animations.happy) {
                this.userData.animations.happy = {};
            }
            
            this.userData.animations.happy.active = true;
            this.userData.animations.happy.intensity = intensity;
            this.userData.animations.happy.startTime = Date.now();
            this.userData.animations.happy.duration = duration;
        }.bind(dogGroup);
    }

    /**
     * Set up eye blinking animation
     * @param {THREE.Group} eyesGroup - The eyes group
     * @param {Object} blinkConfig - Blinking configuration
     */
    setupEyeBlinking(eyesGroup, blinkConfig) {
        // Find eyelids or create them if they don't exist
        let leftEyelid = eyesGroup.getObjectByName('leftEyelid');
        let rightEyelid = eyesGroup.getObjectByName('rightEyelid');
        
        if (!leftEyelid || !rightEyelid) {
            // Find the eyes
            const leftEye = eyesGroup.getObjectByName('leftEye');
            const rightEye = eyesGroup.getObjectByName('rightEye');
            
            if (leftEye && rightEye) {
                // Create eyelids
                const eyelidMaterial = new THREE.MeshStandardMaterial({
                    color: this.colors.body,
                    roughness: 0.9,
                    metalness: 0.1
                });
                
                // Create left eyelid
                leftEyelid = new THREE.Mesh(
                    leftEye.geometry.clone(),
                    eyelidMaterial
                );
                leftEyelid.name = 'leftEyelid';
                leftEyelid.position.copy(leftEye.position);
                leftEyelid.scale.set(1.1, 0.1, 1.1); // Flattened
                leftEyelid.position.y += 0.01; // Slightly above eye
                leftEyelid.visible = false; // Hidden by default
                eyesGroup.add(leftEyelid);
                
                // Create right eyelid
                rightEyelid = new THREE.Mesh(
                    rightEye.geometry.clone(),
                    eyelidMaterial
                );
                rightEyelid.name = 'rightEyelid';
                rightEyelid.position.copy(rightEye.position);
                rightEyelid.scale.set(1.1, 0.1, 1.1); // Flattened
                rightEyelid.position.y += 0.01; // Slightly above eye
                rightEyelid.visible = false; // Hidden by default
                eyesGroup.add(rightEyelid);
            }
        }
    }
    
    /**
     * Trigger a blink animation
     * @param {THREE.Group} eyesGroup - The eyes group
     * @param {number} duration - Blink duration in ms
     */
    blinkEyes(eyesGroup, duration) {
        const leftEyelid = eyesGroup.getObjectByName('leftEyelid');
        const rightEyelid = eyesGroup.getObjectByName('rightEyelid');
        
        if (leftEyelid && rightEyelid) {
            // Show eyelids
            leftEyelid.visible = true;
            rightEyelid.visible = true;
            
            // Hide after duration
            setTimeout(() => {
                leftEyelid.visible = false;
                rightEyelid.visible = false;
            }, duration);
        }
    }
    
    /**
     * Create an enhanced body with better shape and proportions
     * @returns {THREE.Group} - The body mesh group
     */
    createEnhancedBody() {
        // Create a group to hold body components
        const group = new THREE.Group();
        group.name = 'dogBody';
        
        // Main body - use more complex geometry for better shape
        // French Bulldogs have a compact, muscular body with a wide chest
        const bodyGeometry = new THREE.CapsuleGeometry(
            this.proportions.chestWidth / 2,
            this.proportions.length * 0.8,
            12,
            24
        );
        
        // Create more realistic material with subtle texture
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.body,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: false
        });
        
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.position.set(0, this.proportions.height * 0.5, 0);
        bodyMesh.rotation.z = Math.PI / 2; // Rotate to align with Z axis
        bodyMesh.castShadow = true;
        group.add(bodyMesh);
        
        // Create chest bulge for more realistic body shape
        const chestGeometry = new THREE.SphereGeometry(
            this.proportions.chestWidth / 1.7,
            20,
            20
        );
        
        const chestMesh = new THREE.Mesh(chestGeometry, bodyMaterial);
        chestMesh.position.set(0, this.proportions.height * 0.45, this.proportions.length * 0.3);
        chestMesh.scale.set(1, 0.85, 0.95);
        chestMesh.castShadow = true;
        group.add(chestMesh);
        
        // Add shoulder definition
        const leftShoulderGeometry = new THREE.SphereGeometry(
            this.proportions.chestWidth / 4,
            12,
            12
        );
        
        const leftShoulder = new THREE.Mesh(leftShoulderGeometry, bodyMaterial);
        leftShoulder.position.set(this.proportions.chestWidth / 2.2, this.proportions.height * 0.6, this.proportions.length * 0.25);
        leftShoulder.castShadow = true;
        group.add(leftShoulder);
        
        const rightShoulder = leftShoulder.clone();
        rightShoulder.position.x = -leftShoulder.position.x;
        rightShoulder.castShadow = true;
        group.add(rightShoulder);
        
        // Add hip definition
        const leftHipGeometry = new THREE.SphereGeometry(
            this.proportions.chestWidth / 4.5,
            12,
            12
        );
        
        const leftHip = new THREE.Mesh(leftHipGeometry, bodyMaterial);
        leftHip.position.set(this.proportions.chestWidth / 2.5, this.proportions.height * 0.55, -this.proportions.length * 0.3);
        leftHip.castShadow = true;
        group.add(leftHip);
        
        const rightHip = leftHip.clone();
        rightHip.position.x = -leftHip.position.x;
        rightHip.castShadow = true;
        group.add(rightHip);
        
        // Add back definition - French Bulldogs have a slightly arched back
        const backGeometry = new THREE.CapsuleGeometry(
            this.proportions.chestWidth / 3,
            this.proportions.length * 0.5,
            8,
            12
        );
        
        const backMesh = new THREE.Mesh(backGeometry, bodyMaterial);
        backMesh.position.set(0, this.proportions.height * 0.65, -this.proportions.length * 0.1);
        backMesh.rotation.x = Math.PI / 2;
        backMesh.scale.set(1, 1, 0.7);
        backMesh.castShadow = true;
        group.add(backMesh);
        
        // Add neck - French Bulldogs have a thick, short neck
        const neckGeometry = new THREE.CylinderGeometry(
            this.proportions.chestWidth / 2.2,
            this.proportions.chestWidth / 2,
            this.proportions.neckLength,
            12,
            1
        );
        
        const neckMesh = new THREE.Mesh(neckGeometry, bodyMaterial);
        neckMesh.position.set(0, this.proportions.height * 0.65, this.proportions.length * 0.35);
        neckMesh.rotation.x = Math.PI / 4; // Angle the neck
        neckMesh.castShadow = true;
        group.add(neckMesh);
        
        return group;
    }
    
    /**
     * Create an enhanced head for the French Bulldog
     * @returns {THREE.Group} - The head group
     */
    createEnhancedHead() {
        const headGroup = new THREE.Group();
        headGroup.name = 'dogHead';
        
        try {
            // Create the main head shape - French Bulldogs have a distinctive flat, square head
            const headGeometry = new THREE.BoxGeometry(
                this.proportions.headWidth,
                this.proportions.headHeight,
                this.proportions.headLength
            );
            
            // Round the edges for a more natural look
            headGeometry.translate(0, 0, this.proportions.headLength * 0.1);
            
            const headMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.body,
                roughness: 0.8,
                metalness: 0.1
            });
            
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.castShadow = true;
            headGroup.add(head);
            
            // Add detailed face features
            const faceGroup = this.createDetailedFace();
            faceGroup.position.z = this.proportions.headLength * 0.4;
            headGroup.add(faceGroup);
            
            // Add detailed ears
            const earsGroup = this.createDetailedEars();
            earsGroup.position.y = this.proportions.headHeight * 0.4;
            headGroup.add(earsGroup);
            
            // Add detailed eyes
            const eyesGroup = this.createDetailedEyes();
            eyesGroup.position.set(0, 0, this.proportions.headLength * 0.3);
            headGroup.add(eyesGroup);
            
            // Add detailed nose
            const noseGroup = this.createDetailedNose();
            noseGroup.position.set(0, -this.proportions.headHeight * 0.1, this.proportions.headLength * 0.45);
            headGroup.add(noseGroup);
            
            // Add detailed mouth
            const mouthGroup = this.createDetailedMouth();
            mouthGroup.position.set(0, -this.proportions.headHeight * 0.25, this.proportions.headLength * 0.4);
            headGroup.add(mouthGroup);
            
            // Add wrinkles - characteristic of French Bulldogs
            this.addWrinkles(headGroup);
            
            console.log('Enhanced dog head created successfully');
            return headGroup;
        } catch (error) {
            console.error('Error creating enhanced dog head:', error);
            return this.createSimpleComponent('head');
        }
    }
    
    /**
     * Create a detailed face for the French Bulldog
     * @returns {THREE.Group} - The face group
     */
    createDetailedFace() {
        const faceGroup = new THREE.Group();
        faceGroup.name = 'dogFace';
        
        try {
            // Create the muzzle - French Bulldogs have a short, pushed-in muzzle
            const muzzleGeometry = new THREE.BoxGeometry(
                this.proportions.headWidth * 0.7,
                this.proportions.headHeight * 0.5,
                this.proportions.headLength * 0.3
            );
            
            // Round the edges for a more natural look
            const muzzleMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.body,
                roughness: 0.8,
                metalness: 0.1
            });
            
            const muzzle = new THREE.Mesh(muzzleGeometry, muzzleMaterial);
            muzzle.castShadow = true;
            faceGroup.add(muzzle);
            
            // Add jowls - the droopy sides of the mouth
            const jowlGeometry = new THREE.SphereGeometry(
                this.proportions.headWidth * 0.15,
                8,
                8,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );
            
            const jowlMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.body,
                roughness: 0.8,
                metalness: 0.1
            });
            
            // Left jowl
            const leftJowl = new THREE.Mesh(jowlGeometry, jowlMaterial);
            leftJowl.position.set(
                -this.proportions.headWidth * 0.25,
                -this.proportions.headHeight * 0.2,
                this.proportions.headLength * 0.1
            );
            leftJowl.rotation.x = Math.PI;
            leftJowl.rotation.z = -Math.PI / 4;
            leftJowl.castShadow = true;
            faceGroup.add(leftJowl);
            
            // Right jowl
            const rightJowl = leftJowl.clone();
            rightJowl.position.x = -leftJowl.position.x;
            rightJowl.rotation.z = -leftJowl.rotation.z;
            faceGroup.add(rightJowl);
            
            // Add cheeks - French Bulldogs have prominent cheeks
            const cheekGeometry = new THREE.SphereGeometry(
                this.proportions.headWidth * 0.2,
                8,
                8
            );
            
            const cheekMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.body,
                roughness: 0.8,
                metalness: 0.1
            });
            
            // Left cheek
            const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
            leftCheek.position.set(
                -this.proportions.headWidth * 0.35,
                0,
                0
            );
            leftCheek.scale.set(0.7, 0.7, 0.7);
            leftCheek.castShadow = true;
            faceGroup.add(leftCheek);
            
            // Right cheek
            const rightCheek = leftCheek.clone();
            rightCheek.position.x = -leftCheek.position.x;
            faceGroup.add(rightCheek);
            
            // Add facial wrinkles - characteristic of French Bulldogs
            this.addFacialWrinkles(faceGroup);
            
            console.log('Detailed dog face created successfully');
            return faceGroup;
        } catch (error) {
            console.error('Error creating detailed dog face:', error);
            return new THREE.Group(); // Return empty group as fallback
        }
    }
    
    /**
     * Add facial wrinkles to the dog's face
     * @param {THREE.Group} faceGroup - The face group to add wrinkles to
     */
    addFacialWrinkles(faceGroup) {
        // Create wrinkle material - slightly darker than coat color
        const wrinkleMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.colors.body).multiplyScalar(0.9),
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Add forehead wrinkles
        for (let i = 0; i < 3; i++) {
            const wrinkleGeometry = new THREE.TorusGeometry(
                this.proportions.headWidth * 0.25,
                this.proportions.headWidth * 0.02,
                8,
                12,
                Math.PI
            );
            
            const wrinkle = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial);
            wrinkle.position.set(
                0,
                this.proportions.headHeight * (0.2 - i * 0.05),
                this.proportions.headLength * 0.2
            );
            wrinkle.rotation.x = Math.PI / 2;
            wrinkle.castShadow = true;
            faceGroup.add(wrinkle);
        }
        
        // Add muzzle wrinkles
        for (let i = 0; i < 2; i++) {
            const wrinkleGeometry = new THREE.TorusGeometry(
                this.proportions.headWidth * 0.2,
                this.proportions.headWidth * 0.015,
                8,
                12,
                Math.PI
            );
            
            const wrinkle = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial);
            wrinkle.position.set(
                0,
                -this.proportions.headHeight * (0.1 + i * 0.05),
                this.proportions.headLength * 0.3
            );
            wrinkle.rotation.x = Math.PI / 2;
            wrinkle.castShadow = true;
            faceGroup.add(wrinkle);
        }
    }
    
    /**
     * Add wrinkles to the dog's head
     * @param {THREE.Group} headGroup - The head group to add wrinkles to
     */
    addWrinkles(headGroup) {
        // Create wrinkle material - slightly darker than coat color
        const wrinkleMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.colors.body).multiplyScalar(0.9),
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Add top head wrinkles
        for (let i = 0; i < 2; i++) {
            const wrinkleGeometry = new THREE.TorusGeometry(
                this.proportions.headWidth * 0.3,
                this.proportions.headWidth * 0.02,
                8,
                12,
                Math.PI
            );
            
            const wrinkle = new THREE.Mesh(wrinkleGeometry, wrinkleMaterial);
            wrinkle.position.set(
                0,
                this.proportions.headHeight * 0.4,
                this.proportions.headLength * (0 - i * 0.15)
            );
            wrinkle.rotation.x = Math.PI / 2;
            wrinkle.castShadow = true;
            headGroup.add(wrinkle);
        }
    }
    
    /**
     * Get the current coat color
     * @returns {number} - The coat color as a hex value
     */
    getCoatColor() {
        return this.colors.body;
    }
    
    /**
     * Create detailed ears for a French Bulldog
     * @returns {THREE.Group} - The ears group
     */
    createDetailedEars() {
        const group = new THREE.Group();
        
        // French Bulldogs have distinctive upright "bat ears"
        const earGeometry = new THREE.ConeGeometry(
            this.proportions.headWidth * 0.2,
            this.proportions.headHeight * 0.6,
            12,
            1,
            true
        );
        
        const earMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.ears || this.colors.body,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide
        });
        
        // Left ear
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(
            this.proportions.headWidth * 0.35,
            this.proportions.headHeight * 0.3,
            -this.proportions.headLength * 0.1
        );
        // Rotate to make it stand up and angle slightly outward
        leftEar.rotation.x = -Math.PI / 12;
        leftEar.rotation.z = -Math.PI / 12;
        leftEar.castShadow = true;
        group.add(leftEar);
        
        // Right ear
        const rightEar = leftEar.clone();
        rightEar.position.x = -leftEar.position.x;
        rightEar.rotation.z = Math.PI / 12; // Mirror the Z rotation
        rightEar.castShadow = true;
        group.add(rightEar);
        
        // Add inner ear details
        const innerEarGeometry = new THREE.ConeGeometry(
            this.proportions.headWidth * 0.15,
            this.proportions.headHeight * 0.5,
            12,
            1,
            true
        );
        
        const innerEarMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffccd5), // Pink inner ear
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide
        });
        
        // Left inner ear
        const leftInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        leftInnerEar.position.copy(leftEar.position);
        leftInnerEar.position.y += 0.02; // Slight offset to prevent z-fighting
        leftInnerEar.rotation.copy(leftEar.rotation);
        leftInnerEar.castShadow = false;
        group.add(leftInnerEar);
        
        // Right inner ear
        const rightInnerEar = leftInnerEar.clone();
        rightInnerEar.position.x = -leftInnerEar.position.x;
        rightInnerEar.rotation.z = Math.PI / 12; // Mirror the Z rotation
        group.add(rightInnerEar);
        
        return group;
    }
    
    /**
     * Create a detailed mouth for a French Bulldog
     * @returns {THREE.Group} - The mouth group
     */
    createDetailedMouth() {
        const group = new THREE.Group();
        
        // Create the mouth/muzzle area
        const muzzleGeometry = new THREE.BoxGeometry(
            this.proportions.headWidth * 0.7,
            this.proportions.headHeight * 0.3,
            this.proportions.headLength * 0.3
        );
        
        const muzzleMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.head || this.colors.body,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const muzzle = new THREE.Mesh(muzzleGeometry, muzzleMaterial);
        muzzle.castShadow = true;
        group.add(muzzle);
        
        // Add the underbite - characteristic of French Bulldogs
        const jawGeometry = new THREE.BoxGeometry(
            this.proportions.headWidth * 0.65,
            this.proportions.headHeight * 0.1,
            this.proportions.headLength * 0.25
        );
        
        const jawMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.head || this.colors.body,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const jaw = new THREE.Mesh(jawGeometry, jawMaterial);
        jaw.position.set(0, -this.proportions.headHeight * 0.2, this.proportions.headLength * 0.05);
        jaw.castShadow = true;
        group.add(jaw);
        
        // Add teeth (underbite showing)
        const teethGeometry = new THREE.BoxGeometry(
            this.proportions.headWidth * 0.5,
            this.proportions.headHeight * 0.05,
            this.proportions.headLength * 0.05
        );
        
        const teethMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff), // White teeth
            roughness: 0.5,
            metalness: 0.2
        });
        
        const teeth = new THREE.Mesh(teethGeometry, teethMaterial);
        teeth.position.set(0, -this.proportions.headHeight * 0.15, this.proportions.headLength * 0.15);
        group.add(teeth);
        
        // Add tongue
        const tongueGeometry = new THREE.SphereGeometry(
            this.proportions.headWidth * 0.15,
            8,
            8
        );
        
        const tongueMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xff9999), // Pink tongue
            roughness: 0.9,
            metalness: 0.0
        });
        
        const tongue = new THREE.Mesh(tongueGeometry, tongueMaterial);
        tongue.scale.set(1, 0.5, 1.5);
        tongue.position.set(0, -this.proportions.headHeight * 0.2, this.proportions.headLength * 0.1);
        group.add(tongue);
        
        return group;
    }
    
    /**
     * Create an enhanced tail with better shape and proportions
     * @returns {THREE.Group} - The tail mesh group
     */
    createEnhancedTail() {
        const tailGroup = new THREE.Group();
        tailGroup.name = 'dogTail';
        
        // French Bulldogs have a short, stubby tail
        // Create a curved tail using a custom curve
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, this.proportions.tailLength * 0.5, -this.proportions.tailLength * 0.2),
            new THREE.Vector3(0, this.proportions.tailLength * 0.8, -this.proportions.tailLength * 0.5),
            new THREE.Vector3(0, this.proportions.tailLength, -this.proportions.tailLength * 0.3)
        );
        
        // Create a tube geometry along the curve
        const tailGeometry = new THREE.TubeGeometry(
            curve,
            12,  // tubularSegments
            this.proportions.tailWidth * 0.5,  // radius
            8,   // radialSegments
            false // closed
        );
        
        const tailMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.body,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const tailMesh = new THREE.Mesh(tailGeometry, tailMaterial);
        tailMesh.castShadow = true;
        tailGroup.add(tailMesh);
        
        // Add a small bulge at the base of the tail
        const tailBaseGeometry = new THREE.SphereGeometry(
            this.proportions.tailWidth * 0.7,
            12,
            12
        );
        
        const tailBase = new THREE.Mesh(tailBaseGeometry, tailMaterial);
        tailBase.position.set(0, 0, 0);
        tailBase.castShadow = true;
        tailGroup.add(tailBase);
        
        // Add a small tip at the end of the tail
        const tailTipGeometry = new THREE.SphereGeometry(
            this.proportions.tailWidth * 0.4,
            8,
            8
        );
        
        const tailTip = new THREE.Mesh(tailTipGeometry, tailMaterial);
        tailTip.position.set(0, this.proportions.tailLength, -this.proportions.tailLength * 0.3);
        tailTip.castShadow = true;
        tailGroup.add(tailTip);
        
        return tailGroup;
    }
    
    /**
     * Create a detailed collar with tag
     * @returns {THREE.Group} - The collar group
     */
    createDetailedCollar() {
        const collarGroup = new THREE.Group();
        
        // Create collar geometry
        const collarGeometry = new THREE.TorusGeometry(
            this.proportions.headSize / 1.8,
            this.proportions.headSize / 20,
            16,
            32,
            Math.PI * 1.6 // Not a complete circle
        );
        
        const collarMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.collar,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const collarMesh = new THREE.Mesh(collarGeometry, collarMaterial);
        collarMesh.rotation.x = Math.PI / 2;
        collarMesh.rotation.z = Math.PI / 10;
        collarGroup.add(collarMesh);
        
        // Add collar tag
        const tagGeometry = new THREE.CylinderGeometry(
            this.proportions.headSize / 15,
            this.proportions.headSize / 15,
            this.proportions.headSize / 40,
            16
        );
        
        const tagMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.tag,
            roughness: 0.3,
            metalness: 0.8
        });
        
        const tagMesh = new THREE.Mesh(tagGeometry, tagMaterial);
        tagMesh.position.set(0, -this.proportions.headSize / 1.8, 0);
        tagMesh.rotation.x = Math.PI / 2;
        collarGroup.add(tagMesh);
        
        return collarGroup;
    }
    
    /**
     * Update the coat color of the dog
     * @param {number} color - New coat color as hex value
     */
    setCoatColor(color) {
        this.colors.body = color;
        
        // Update any existing models
        Object.values(this.components).forEach(component => {
            component.traverse(child => {
                if (child.isMesh && child.material && 
                    child.material.color && 
                    child.material.color.getHex() === this.colors.body) {
                    child.material.color.setHex(color);
                }
            });
        });
    }
    
    /**
     * Create a component programmatically
     * @param {string} component - Component to create
     * @returns {THREE.Object3D} - The created component
     */
    createComponent(component) {
        console.log(`Creating dog component: ${component}`);
        let object;
        
        try {
            switch (component) {
                case 'full':
                    object = this.createFullModel();
                    break;
                case 'base':
                    object = this.createEnhancedBody();
                    break;
                case 'head':
                    object = this.createEnhancedHead();
                    break;
                case 'body':
                    object = this.createEnhancedBody();
                    break;
                case 'ears':
                    object = this.createDetailedEars();
                    break;
                case 'eyes':
                    object = this.createDetailedEyes();
                    break;
                case 'nose':
                    object = this.createDetailedNose();
                    break;
                case 'mouth':
                    object = this.createDetailedMouth();
                    break;
                case 'paws':
                    object = this.createImprovedPaws();
                    break;
                case 'tail':
                    object = this.createEnhancedTail();
                    break;
                default:
                    console.warn(`Unknown component: ${component}, creating full model instead`);
                    object = this.createFullModel();
            }
            
            // Cache the component
            if (object) {
                this.components[component] = object.clone();
            }
            
            return object;
        } catch (error) {
            console.error(`Error creating dog component ${component}:`, error);
            // Return a simple placeholder for the component
            return this.createSimpleComponent(component);
        }
    }

    /**
     * Create a simple placeholder component
     * @param {string} component - Component type
     * @returns {THREE.Object3D} - Simple placeholder
     */
    createSimpleComponent(component) {
        const group = new THREE.Group();
        group.name = `dogSimple_${component}`;
        
        // Create a simple colored box as placeholder
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshStandardMaterial({ color: this.colors.body });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
        
        return group;
    }

    /**
     * Create detailed eyes for the dog
     * @param {THREE.Group} headGroup - The head group to add eyes to
     * @returns {THREE.Group} - The eyes group
     */
    createDetailedEyes() {
        const eyesGroup = new THREE.Group();
        eyesGroup.name = 'dogEyes';
        
        // Eye geometry - slightly oval for realism
        const eyeGeometry = new THREE.SphereGeometry(
            this.proportions.eyeSize,
            16,
            16
        );
        
        // Eye white material
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.2,
            metalness: 0.1
        });
        
        // Iris material
        const irisMaterial = new THREE.MeshStandardMaterial({
            color: 0x663300, // Brown eyes
            roughness: 0.1,
            metalness: 0.2
        });
        
        // Pupil material
        const pupilMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.1,
            metalness: 0.1
        });
        
        // Create left eye
        const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEyeWhite.position.set(
            -this.proportions.headSize * 0.3,
            this.proportions.headSize * 0.1,
            this.proportions.headSize * 0.7
        );
        leftEyeWhite.scale.set(1, 0.8, 0.8); // Slightly oval
        
        // Create iris for left eye
        const leftIrisGeometry = new THREE.SphereGeometry(
            this.proportions.eyeSize * 0.7,
            16,
            16
        );
        const leftIris = new THREE.Mesh(leftIrisGeometry, irisMaterial);
        leftIris.position.set(0, 0, this.proportions.eyeSize * 0.5);
        leftEyeWhite.add(leftIris);
        
        // Create pupil for left eye
        const leftPupilGeometry = new THREE.SphereGeometry(
            this.proportions.eyeSize * 0.4,
            16,
            16
        );
        const leftPupil = new THREE.Mesh(leftPupilGeometry, pupilMaterial);
        leftPupil.position.set(0, 0, this.proportions.eyeSize * 0.3);
        leftIris.add(leftPupil);
        
        // Add left eye to group
        eyesGroup.add(leftEyeWhite);
        
        // Create right eye (clone of left)
        const rightEyeWhite = leftEyeWhite.clone();
        rightEyeWhite.position.x = -leftEyeWhite.position.x;
        eyesGroup.add(rightEyeWhite);
        
        // Add eyes to head
        return eyesGroup;
    }

    /**
     * Create detailed nose
     * @returns {THREE.Group} - Nose group
     */
    createDetailedNose() {
        const noseGroup = new THREE.Group();
        noseGroup.name = 'dogNose';
        
        // Nose geometry
        const noseGeometry = new THREE.SphereGeometry(
            this.proportions.noseSize,
            16,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        
        // Nose material with wet look
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.nose,
            roughness: 0.3,
            metalness: 0.2,
            envMapIntensity: 1.5
        });
        
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(
            0,
            0,
            this.proportions.headSize * 0.5
        );
        nose.castShadow = true;
        noseGroup.add(nose);
        
        // Add nostrils
        const nostrilGeometry = new THREE.SphereGeometry(
            this.proportions.noseSize * 0.3,
            8,
            8
        );
        
        const leftNostril = new THREE.Mesh(nostrilGeometry, noseMaterial);
        leftNostril.position.set(
            this.proportions.noseSize * 0.4,
            -this.proportions.noseSize * 0.2,
            this.proportions.headSize * 0.5 + this.proportions.noseSize * 0.5
        );
        leftNostril.scale.set(1, 0.6, 0.6);
        noseGroup.add(leftNostril);
        
        const rightNostril = new THREE.Mesh(nostrilGeometry, noseMaterial);
        rightNostril.position.set(
            -this.proportions.noseSize * 0.4,
            -this.proportions.noseSize * 0.2,
            this.proportions.headSize * 0.5 + this.proportions.noseSize * 0.5
        );
        rightNostril.scale.set(1, 0.6, 0.6);
        noseGroup.add(rightNostril);
        
        return noseGroup;
    }

    /**
     * Create improved paws
     * @returns {THREE.Group} - Paws group
     */
    createImprovedPaws() {
        const pawsGroup = new THREE.Group();
        pawsGroup.name = 'dogPaws';
        
        // Paw geometry
        const pawGeometry = new THREE.SphereGeometry(
            this.proportions.pawSize,
            8,
            8
        );
        
        // Paw material
        const pawMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.paws,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Create four paws
        const positions = [
            // Front left
            [this.proportions.chestWidth * 0.4, 0, this.proportions.length * 0.35],
            // Front right
            [-this.proportions.chestWidth * 0.4, 0, this.proportions.length * 0.35],
            // Back left
            [this.proportions.chestWidth * 0.4, 0, -this.proportions.length * 0.35],
            // Back right
            [-this.proportions.chestWidth * 0.4, 0, -this.proportions.length * 0.35]
        ];
        
        positions.forEach((pos, index) => {
            const paw = new THREE.Mesh(pawGeometry, pawMaterial);
            paw.position.set(...pos);
            paw.scale.set(1, 0.5, 1.2);
            paw.castShadow = true;
            paw.name = `paw_${index}`;
            pawsGroup.add(paw);
            
            // Add paw pad
            const padGeometry = new THREE.SphereGeometry(
                this.proportions.pawSize * 0.7,
                8,
                8,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );
            
            const padMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.9,
                metalness: 0.1
            });
            
            const pad = new THREE.Mesh(padGeometry, padMaterial);
            pad.rotation.x = Math.PI / 2;
            pad.position.set(0, -this.proportions.pawSize * 0.4, 0);
            pad.scale.set(1, 0.8, 1);
            paw.add(pad);
        });
        
        return pawsGroup;
    }

    jump() {
        console.log('Jump method executed on DogModel instance', this);
        
        // Safety check for animation in progress
        if ((this.jumpAnimation && this.jumpAnimation.active) || 
            (this.spinAnimation && this.spinAnimation.active)) {
            console.log('Animation already in progress');
            return;
        }
        
        // Log to track execution
        console.log('Starting jump animation');
        
        // Initialize animation state if not present
        if (!this.jumpAnimation) {
            this.jumpAnimation = {
                active: false,
                startTime: 0,
                duration: 0
            };
        }
        
        // Store original positions
        this.originalPositions = {
            body: this.body ? this.body.position.clone() : null,
            head: this.head ? this.head.position.clone() : null,
            tail: this.tail ? this.tail.position.clone() : null
        };
        
        // Configure jump animation
        this.jumpAnimation = {
            active: true,
            startTime: performance.now(),
            duration: 1000, // 1 second jump
            height: 1.0,    // Jump height
            forwardDistance: 0.3
        };
        
        console.log('Jump animation started with config:', this.jumpAnimation);
        
        // Force an initial animation update
        this.updateAnimations(0.016);
        
        return true;
    }
    
    /**
     * Spin the dog
     * Implementation ensures the dog spins smoothly
     */
    spin() {
        console.log('Spin method executed on DogModel instance', this);
        
        // Safety check for animation in progress
        if ((this.jumpAnimation && this.jumpAnimation.active) || 
            (this.spinAnimation && this.spinAnimation.active)) {
            console.log('Animation already in progress');
            return;
        }
        
        // Log to track execution
        console.log('Starting spin animation');
        
        // Initialize animation state if not present
        if (!this.spinAnimation) {
            this.spinAnimation = {
                active: false,
                startTime: 0,
                duration: 0
            };
        }
        
        // Store original positions and rotation
        this.originalPositions = {
            body: this.body ? this.body.position.clone() : null,
            head: this.head ? this.head.position.clone() : null,
            tail: this.tail ? this.tail.position.clone() : null
        };
        
        // Store original rotation
        this.originalRotation = this.body ? this.body.rotation.y : 0;
        
        // Configure spin animation
        this.spinAnimation = {
            active: true,
            startTime: performance.now(),
            duration: 1200, // 1.2 seconds spin
            rotations: 1.5,  // Number of rotations
            bounceHeight: 0.2
        };
        
        console.log('Spin animation started with config:', this.spinAnimation);
        
        // Force an initial animation update
        this.updateAnimations(0.016);
        
        return true;
    }
    
    /**
     * Update animations
     * @param {number} deltaTime - Time since last frame
     */
    updateAnimations(deltaTime) {
        // Get current time
        const currentTime = performance.now();
        
        // Debug logging occasionally
        if (Math.random() < 0.01) {
            console.log('Animation update tick', {
                jumpActive: this.jumpAnimation && this.jumpAnimation.active,
                spinActive: this.spinAnimation && this.spinAnimation.active,
                hasBody: !!this.body,
                hasHead: !!this.head,
                hasTail: !!this.tail
            });
        }
        
        // === JUMP ANIMATION ===
        if (this.jumpAnimation && this.jumpAnimation.active) {
            const elapsed = currentTime - this.jumpAnimation.startTime;
            const progress = Math.min(elapsed / this.jumpAnimation.duration, 1.0);
            
            if (progress < 1.0) {
                // Calculate jump height using sine curve for smooth up/down
                const jumpHeight = Math.sin(progress * Math.PI) * this.jumpAnimation.height;
                
                // Calculate forward movement
                const forwardMove = this.easeInOutQuad(progress) * this.jumpAnimation.forwardDistance;
                
                // Apply the transformations to the body
                if (this.body && this.originalPositions && this.originalPositions.body) {
                    this.body.position.y = this.originalPositions.body.y + jumpHeight;
                    this.body.position.z = this.originalPositions.body.z + forwardMove;
                    
                    // Apply tilt during jump
                    const tiltAngle = Math.sin(progress * Math.PI) * 0.2;
                    this.body.rotation.x = tiltAngle;
                    
                    // Debug logging for jump execution
                    if (progress === 0 || progress >= 0.5 || progress >= 0.99) {
                        console.log(`Jump progress: ${progress.toFixed(2)}, height: ${jumpHeight.toFixed(2)}`);
                    }
                }
                
                // Update head position
                if (this.head && this.originalPositions && this.originalPositions.head) {
                    this.head.position.y = this.originalPositions.head.y + jumpHeight;
                    this.head.position.z = this.originalPositions.head.z + forwardMove;
                }
                
                // Update tail position
                if (this.tail && this.originalPositions && this.originalPositions.tail) {
                    this.tail.position.y = this.originalPositions.tail.y + jumpHeight;
                    this.tail.position.z = this.originalPositions.tail.z + forwardMove;
                }
            } else {
                // Animation complete, reset positions
                this.resetPositions();
                this.jumpAnimation.active = false;
                console.log('Jump animation completed');
            }
        }
        
        // === SPIN ANIMATION ===
        if (this.spinAnimation && this.spinAnimation.active) {
            const elapsed = currentTime - this.spinAnimation.startTime;
            const progress = Math.min(elapsed / this.spinAnimation.duration, 1.0);
            
            if (progress < 1.0) {
                // Calculate rotation angle with eased progress
                const rotationsInRadians = this.spinAnimation.rotations * Math.PI * 2;
                const currentRotation = this.originalRotation + (rotationsInRadians * this.easeInOutQuad(progress));
                
                // Calculate bounce height using sine curve
                const bounceHeight = Math.sin(progress * Math.PI * 2) * this.spinAnimation.bounceHeight;
                
                // Apply rotation to body
                if (this.body && this.originalPositions && this.originalPositions.body) {
                    this.body.rotation.y = currentRotation;
                    this.body.position.y = this.originalPositions.body.y + bounceHeight;
                    
                    // Debug logging for spin execution
                    if (progress === 0 || progress >= 0.5 || progress >= 0.99) {
                        console.log(`Spin progress: ${progress.toFixed(2)}, rotation: ${(currentRotation % (Math.PI * 2)).toFixed(2)}`);
                    }
                }
                
                // Update head position for bounce
                if (this.head && this.originalPositions && this.originalPositions.head) {
                    this.head.position.y = this.originalPositions.head.y + bounceHeight;
                }
                
                // Update tail position for bounce
                if (this.tail && this.originalPositions && this.originalPositions.tail) {
                    this.tail.position.y = this.originalPositions.tail.y + bounceHeight;
                }
            } else {
                // Animation complete, reset positions and rotation
                this.resetPositions();
                if (this.body) {
                    this.body.rotation.y = this.originalRotation || 0;
                }
                this.spinAnimation.active = false;
                console.log('Spin animation completed');
            }
        }
    }
    
    /**
     * Reset positions to original values
     */
    resetPositions() {
        if (!this.originalPositions) return;
        
        if (this.body && this.originalPositions.body) {
            this.body.position.copy(this.originalPositions.body);
            this.body.rotation.x = 0; // Reset any tilt
        }
        
        if (this.head && this.originalPositions.head) {
            this.head.position.copy(this.originalPositions.head);
        }
        
        if (this.tail && this.originalPositions.tail) {
            this.tail.position.copy(this.originalPositions.tail);
        }
        
        console.log('Reset positions completed');
    }
} 