/**
 * OwnerModel class
 * Handles creation and management of the Owner (Woman) 3D model
 */
class OwnerModel {
    /**
     * Constructor
     * @param {THREE.Scene} scene - The Three.js scene (optional)
     * @param {ModelLoader} modelLoader - The model loader utility (optional)
     */
    constructor(scene, modelLoader) {
        // Store scene reference if provided, otherwise use the global scene
        this.scene = scene || window.scene;
        this.modelLoader = modelLoader;
        
        // Human proportions - refined for feminine figure
        this.proportions = {
            height: 1.65,           // Total height (~5'5")
            shoulderWidth: 0.32,    // Narrower shoulders for feminine frame
            hipWidth: 0.36,         // Wider hips for feminine figure
            headSize: 0.16,         // Slightly smaller head
            neckLength: 0.08,       // Longer neck
            torsoLength: 0.52,      // Torso length
            armLength: 0.58,        // Slightly shorter arms
            legLength: 0.82,        // Longer legs
            footSize: 0.20,         // Smaller feet
            waistSize: 0.24,        // Narrower waist
            torsoHeight: 0.52       // Added torsoHeight
        };
        
        // Check that Three.js is available
        if (!window.THREE && typeof THREE === 'undefined') {
            console.error('THREE is not defined. Make sure Three.js is loaded before using OwnerModel.');
        }
        
        // Log successful initialization
        console.log('OwnerModel initialized');
        
        // Colors - enhanced for feminine appearance
        this.colors = {
            skin: 0xFFDBC5,         // Warmer skin tone
            eyes: 0x6B8E23,         // Olive green eyes
            hair: 0x4A2410,         // Dark brown hair
            lips: 0xDB7093,         // Pink lips
            nails: 0xFFCCCC,        // Light pink nails
            shirt: 0xE6CAE5,        // Soft lavender shirt
            pants: 0x4A4A4A,        // Dark gray pants
            shoes: 0x2B2117,        // Dark brown shoes
            jacket: 0xB19CD9,       // Light purple jacket
            accessories: 0xFFD700    // Gold accessories
        };
        
        // Model caching
        this.components = {};
    }
    
    /**
     * Load a specific component of the owner model
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
        console.log(`Creating owner component programmatically: ${component}`);
        return this.createComponent(component);
    }
    
    /**
     * Create a full, realistic human model
     * @returns {THREE.Group} - The complete model
     */
    createFullModel() {
        try {
            console.log("Creating enhanced owner model");
            const group = new THREE.Group();
            
            // Create body with improved shape
            const bodyGroup = this.createEnhancedBody();
            group.add(bodyGroup);
            
            // Position the model
            group.position.y = 0.02; // Slightly above ground to avoid z-fighting
            
            // Add name for easy reference
            group.name = 'dogOwner';
            
            // Setup animation system
            this.setupAnimationSystem(group);
            
            console.log("Enhanced owner model created successfully");
            return group;
        } catch (error) {
            console.error("Error creating owner model:", error);
            return this.createSimpleOwnerModel();
        }
    }
    
    /**
     * Create a simple owner model as fallback
     * @returns {THREE.Group} - Simple owner model
     */
    createSimpleOwnerModel() {
        console.log("Creating simple owner model as fallback");
        const group = new THREE.Group();
        group.name = 'ownerSimple';
        
        // Create torso (blue box)
        const torsoGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.2);
        const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 1.1;
        torso.castShadow = true;
        group.add(torso);
        
        // Create head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.2, 32, 16);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.6;
        head.castShadow = true;
        group.add(head);
        
        // Create arms (2 cylinders)
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(0.25, 1.1, 0);
        leftArm.rotation.z = -Math.PI / 6;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(-0.25, 1.1, 0);
        rightArm.rotation.z = Math.PI / 6;
        group.add(rightArm);
        
        // Create legs (2 cylinders)
        const legGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.8, 8);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000088 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(0.1, 0.4, 0);
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(-0.1, 0.4, 0);
        group.add(rightLeg);
        
        return group;
    }
    
    /**
     * Create an enhanced body with better shape and proportions for a female character
     * @returns {THREE.Group} - The body group
     */
    createEnhancedBody() {
        const bodyGroup = new THREE.Group();
        bodyGroup.name = 'ownerBody';
        
        // Create torso with feminine proportions
        const torsoGeometry = new THREE.CylinderGeometry(
            this.proportions.shoulderWidth / 2.5,  // Narrower at top for feminine shoulders
            this.proportions.hipWidth / 2,         // Wider at bottom for hips
            this.proportions.torsoLength,
            12,
            4,                                     // More segments for better shape
            true                                   // Open-ended for better joining
        );
        
        // Torso material with skin color
        const torsoMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.shirt,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = this.proportions.legLength + this.proportions.torsoLength / 2;
        torso.castShadow = true;
        bodyGroup.add(torso);
        
        // Create neck
        const neckGeometry = new THREE.CylinderGeometry(
            this.proportions.headSize / 3.5,
            this.proportions.headSize / 3,
            this.proportions.neckLength,
            10
        );
        
        const neckMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.skin,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.y = this.proportions.legLength + this.proportions.torsoLength + this.proportions.neckLength / 2;
        neck.castShadow = true;
        bodyGroup.add(neck);
        
        // Add head
        const headGroup = this.createDetailedHead();
        headGroup.position.y = this.proportions.legLength + this.proportions.torsoLength + this.proportions.neckLength;
        bodyGroup.add(headGroup);
        
        // Create legs
        const legsGroup = this.createDetailedLegs();
        bodyGroup.add(legsGroup);
        
        // Create arms
        const armsGroup = this.createDetailedArms();
        armsGroup.position.y = this.proportions.legLength + this.proportions.torsoLength * 0.9;
        bodyGroup.add(armsGroup);
        
        return bodyGroup;
    }
    
    /**
     * Create a detailed head with realistic facial features
     * @returns {THREE.Group} - The head group
     */
    createDetailedHead() {
        const headGroup = new THREE.Group();
        headGroup.name = 'ownerHead';
        
        // Create head shape
        const headGeometry = new THREE.SphereGeometry(
            this.proportions.headSize,
            24,
            24
        );
        
        const headMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.skin,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.castShadow = true;
        headGroup.add(head);
        
        // Add face features
        const faceGroup = this.createDetailedFace();
        head.add(faceGroup);
        
        // Add hair
        const hairGroup = this.createDetailedHair();
        head.add(hairGroup);
        
        return headGroup;
    }
    
    /**
     * Add eyes to the head
     * @param {THREE.Group} headGroup - The head group
     */
    addEyes(headGroup) {
        // Create eye whites
        const eyeGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.12,
            12,
            12
        );
        
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.2,
            metalness: 0.1
        });
        
        // Left eye
        const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEye.position.set(
            -this.proportions.headSize * 0.3,
            this.proportions.headSize * 0.1,
            this.proportions.headSize * 0.75
        );
        leftEye.scale.z = 0.5;
        headGroup.add(leftEye);
        
        // Right eye
        const rightEye = leftEye.clone();
        rightEye.position.x = -leftEye.position.x;
        headGroup.add(rightEye);
        
        // Add irises
        const irisGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.06,
            12,
            12
        );
        
        const irisMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.eyes,
            roughness: 0.1,
            metalness: 0.2
        });
        
        // Left iris
        const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
        leftIris.position.z = this.proportions.headSize * 0.08;
        leftEye.add(leftIris);
        
        // Right iris
        const rightIris = leftIris.clone();
        rightEye.add(rightIris);
        
        // Add pupils
        const pupilGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.03,
            8,
            8
        );
        
        const pupilMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        
        // Left pupil
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.z = this.proportions.headSize * 0.03;
        leftIris.add(leftPupil);
        
        // Right pupil
        const rightPupil = leftPupil.clone();
        rightIris.add(rightPupil);
    }
    
    /**
     * Add nose to the head
     * @param {THREE.Group} headGroup - The head group
     */
    addNose(headGroup) {
        const noseGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.1,
            8,
            8
        );
        
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.skin,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(
            0,
            0,
            this.proportions.headSize * 0.85
        );
        nose.scale.set(0.6, 0.6, 0.6);
        headGroup.add(nose);
    }
    
    /**
     * Add mouth to the head
     * @param {THREE.Group} headGroup - The head group
     */
    addMouth(headGroup) {
        // Create lips
        const lipGeometry = new THREE.TorusGeometry(
            this.proportions.headSize * 0.15,
            this.proportions.headSize * 0.03,
            8,
            12,
            Math.PI
        );
        
        const lipMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.lips,
            roughness: 0.6,
            metalness: 0.1
        });
        
        const lips = new THREE.Mesh(lipGeometry, lipMaterial);
        lips.position.set(
            0,
            -this.proportions.headSize * 0.2,
            this.proportions.headSize * 0.75
        );
        lips.rotation.x = -Math.PI / 2;
        lips.rotation.z = Math.PI;
        headGroup.add(lips);
    }
    
    /**
     * Add ears to the head
     * @param {THREE.Group} headGroup - The head group
     */
    addEars(headGroup) {
        const earGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.15,
            8,
            8
        );
        
        const earMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.skin,
            roughness: 0.7,
            metalness: 0.1
        });
        
        // Left ear
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(
            -this.proportions.headSize * 0.8,
            0,
            0
        );
        leftEar.scale.set(0.4, 0.7, 0.5);
        headGroup.add(leftEar);
        
        // Right ear
        const rightEar = leftEar.clone();
        rightEar.position.x = -leftEar.position.x;
        headGroup.add(rightEar);
    }
    
    /**
     * Add hair to the head
     * @param {THREE.Group} headGroup - The head group
     */
    addHair(headGroup) {
        // Create hair cap
        const hairCapGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 1.05,
            16,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.hair,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const hairCap = new THREE.Mesh(hairCapGeometry, hairMaterial);
        hairCap.position.y = this.proportions.headSize * 0.1;
        headGroup.add(hairCap);
        
        // Add some hair strands for more realism
        const strandCount = 20;
        const strandGeometry = new THREE.CylinderGeometry(
            0.01,
            0.005,
            this.proportions.headSize * 0.7,
            4
        );
        
        for (let i = 0; i < strandCount; i++) {
            const strand = new THREE.Mesh(strandGeometry, hairMaterial);
            
            // Position around the head
            const angle = (i / strandCount) * Math.PI;
            const radius = this.proportions.headSize * 0.9;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            strand.position.set(x, 0, z);
            
            // Rotate to point outward from head
            strand.rotation.x = Math.PI / 2;
            strand.rotation.z = angle;
            
            // Add some randomness
            strand.rotation.x += (Math.random() - 0.5) * 0.5;
            strand.rotation.y += (Math.random() - 0.5) * 0.5;
            strand.rotation.z += (Math.random() - 0.5) * 0.5;
            
            hairCap.add(strand);
        }
    }
    
    /**
     * Add eyebrows to the head
     * @param {THREE.Group} headGroup - The head group
     */
    addEyebrows(headGroup) {
        const eyebrowGeometry = new THREE.BoxGeometry(
            this.proportions.headSize * 0.25,
            this.proportions.headSize * 0.03,
            this.proportions.headSize * 0.05
        );
        
        const eyebrowMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.hair,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Left eyebrow
        const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
        leftEyebrow.position.set(
            -this.proportions.headSize * 0.3,
            this.proportions.headSize * 0.35,
            this.proportions.headSize * 0.7
        );
        leftEyebrow.rotation.x = -Math.PI / 12;
        headGroup.add(leftEyebrow);
        
        // Right eyebrow
        const rightEyebrow = leftEyebrow.clone();
        rightEyebrow.position.x = -leftEyebrow.position.x;
        headGroup.add(rightEyebrow);
    }
    
    /**
     * Add clothing details to the model
     * @param {THREE.Group} model - The model group
     */
    addClothingDetails(model) {
        try {
            // Add shirt collar
            const collarGeometry = new THREE.TorusGeometry(
                this.proportions.headSize * 0.25,
                this.proportions.headSize * 0.05,
                8,
                16,
                Math.PI
            );
            
            const collarMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.shirt,
                roughness: 0.8,
                metalness: 0.1
            });
            
            const collar = new THREE.Mesh(collarGeometry, collarMaterial);
            collar.position.set(
                0,
                this.proportions.torsoLength + this.proportions.legLength + this.proportions.neckLength * 0.8,
                0.05
            );
            collar.rotation.x = Math.PI / 2;
            model.add(collar);
            
            // Add shirt buttons
            const buttonCount = 3;
            const buttonGeometry = new THREE.CylinderGeometry(
                this.proportions.headSize * 0.04,
                this.proportions.headSize * 0.04,
                this.proportions.headSize * 0.02,
                16
            );
            
            const buttonMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                roughness: 0.5,
                metalness: 0.3
            });
            
            for (let i = 0; i < buttonCount; i++) {
                const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
                button.position.set(
                    0,
                    this.proportions.torsoLength + this.proportions.legLength - i * this.proportions.torsoLength * 0.2,
                    this.proportions.shoulderWidth * 0.25
                );
                button.rotation.x = Math.PI / 2;
                model.add(button);
            }
            
            // Add belt
            const beltGeometry = new THREE.TorusGeometry(
                this.proportions.hipWidth / 2 + 0.01,
                0.02,
                8,
                24
            );
            
            const beltMaterial = new THREE.MeshStandardMaterial({
                color: 0x553311,
                roughness: 0.6,
                metalness: 0.4
            });
            
            const belt = new THREE.Mesh(beltGeometry, beltMaterial);
            belt.position.set(
                0,
                this.proportions.legLength + this.proportions.torsoLength * 0.3,
                0
            );
            belt.rotation.x = Math.PI / 2;
            model.add(belt);
            
            // Add belt buckle
            const buckleGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.01);
            const buckleMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.accessories,
                roughness: 0.3,
                metalness: 0.8
            });
            
            const buckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
            buckle.position.set(
                0,
                this.proportions.legLength + this.proportions.torsoLength * 0.3,
                this.proportions.hipWidth / 2 + 0.02
            );
            model.add(buckle);
        } catch (error) {
            console.error("Error adding clothing details:", error);
        }
    }
    
    /**
     * Add accessories to the model
     * @param {THREE.Group} model - The model group
     */
    addAccessories(model) {
        try {
            // Add wristwatch to left arm
            // Find left lower arm
            let leftLowerArm = null;
            model.traverse(object => {
                if (object.name === 'leftLowerArm') {
                    leftLowerArm = object;
                }
            });
            
            if (leftLowerArm) {
                // Create watch band
                const watchBandGeometry = new THREE.TorusGeometry(
                    0.04,
                    0.01,
                    8,
                    16
                );
                
                const watchBandMaterial = new THREE.MeshStandardMaterial({
                    color: 0x553311, // Brown leather
                    roughness: 0.7,
                    metalness: 0.2
                });
                
                const watchBand = new THREE.Mesh(watchBandGeometry, watchBandMaterial);
                watchBand.position.set(0, -this.proportions.armLength * 0.15, 0);
                watchBand.rotation.x = Math.PI / 2;
                leftLowerArm.add(watchBand);
                
                // Create watch face
                const watchFaceGeometry = new THREE.CylinderGeometry(
                    0.025,
                    0.025,
                    0.01,
                    16
                );
                
                const watchFaceMaterial = new THREE.MeshStandardMaterial({
                    color: 0xCCCCCC, // Silver
                    roughness: 0.3,
                    metalness: 0.8
                });
                
                const watchFace = new THREE.Mesh(watchFaceGeometry, watchFaceMaterial);
                watchFace.position.set(0, 0, 0);
                watchFace.rotation.x = Math.PI / 2;
                watchBand.add(watchFace);
            }
            
            // Add necklace
            // Find neck
            let neck = null;
            model.traverse(object => {
                if (object.name === 'ownerHead') {
                    neck = object.parent;
                }
            });
            
            if (neck) {
                // Create necklace chain
                const necklaceGeometry = new THREE.TorusGeometry(
                    this.proportions.headSize / 4,
                    0.005,
                    8,
                    16
                );
                
                const necklaceMaterial = new THREE.MeshStandardMaterial({
                    color: this.colors.accessories,
                    roughness: 0.3,
                    metalness: 0.9
                });
                
                const necklace = new THREE.Mesh(necklaceGeometry, necklaceMaterial);
                necklace.position.set(0, -this.proportions.neckLength / 2, 0.02);
                necklace.rotation.x = Math.PI / 2;
                neck.add(necklace);
                
                // Add pendant
                const pendantGeometry = new THREE.ConeGeometry(0.01, 0.02, 8);
                const pendant = new THREE.Mesh(pendantGeometry, necklaceMaterial);
                pendant.position.set(0, 0, this.proportions.headSize / 4);
                pendant.rotation.x = Math.PI / 2;
                necklace.add(pendant);
            }
        } catch (error) {
            console.error("Error adding accessories:", error);
        }
    }
    
    /**
     * Set up global animation system for the owner model
     * @param {THREE.Group} ownerModel - The complete owner model
     */
    setupAnimationSystem(ownerModel) {
        if (!ownerModel) return;
        
        console.log('Setting up enhanced animation system for owner model');
        
        // Store animation state
        ownerModel.userData.animations = {
            time: 0,
            breathing: {
                enabled: true,
                speed: 0.8,
                amplitude: 0.01
            },
            headMovement: {
                enabled: true,
                speed: 0.5,
                amplitude: 0.03
            },
            armSwing: {
                enabled: true,
                speed: 0.7,
                amplitude: 0.05
            },
            blinking: {
                enabled: true,
                interval: 5000, // ms
                duration: 150,  // ms
                lastBlink: 0
            },
            pettingDog: {
                active: false,
                startTime: 0,
                duration: 3000 // ms
            }
        };
        
        // Find all animatable components
        const body = ownerModel.getObjectByName('ownerBody');
        const head = ownerModel.getObjectByName('ownerHead');
        const leftArm = this.findComponentByName(ownerModel, 'leftUpperArm');
        const rightArm = this.findComponentByName(ownerModel, 'rightUpperArm');
        
        // Store references to components
        ownerModel.userData.components = {
            body: body,
            head: head,
            leftArm: leftArm,
            rightArm: rightArm
        };
        
        // Set up individual animations
        if (body) this.setupBreathingAnimation(body);
        if (head) this.setupHeadMovement(head);
        if (leftArm) this.setupArmMovement(leftArm, 'left');
        if (rightArm) this.setupArmMovement(rightArm, 'right');
        
        // Set up petting dog action
        this.setupPettingAction(ownerModel, rightArm);
        
        // Set up eye blinking if eyes exist
        const face = this.findComponentByName(head, 'ownerFace');
        if (face) {
            this.setupEyeBlinking(face, ownerModel.userData.animations.blinking);
        }
        
        // Create the main animation loop
        const animate = (time) => {
            time = time * 0.001; // Convert to seconds
            ownerModel.userData.animations.time = time;
            
            // Update all animations
            this.updateAnimations(ownerModel);
            
            // Continue animation loop
            requestAnimationFrame(animate);
        };
        
        // Start animation loop
        animate(0);
        
        console.log('Owner animation system setup complete');
    }
    
    /**
     * Find a component by name in the model hierarchy
     * @param {THREE.Object3D} parent - The parent object to search in
     * @param {string} name - The name to search for
     * @returns {THREE.Object3D|null} - The found component or null
     */
    findComponentByName(parent, name) {
        if (!parent) return null;
        
        if (parent.name === name) {
            return parent;
        }
        
        for (const child of parent.children) {
            const found = this.findComponentByName(child, name);
            if (found) return found;
        }
        
        return null;
    }
    
    /**
     * Update all animations for the owner model
     * @param {THREE.Group} ownerModel - The owner model to animate
     */
    updateAnimations(ownerModel) {
        if (!ownerModel || !ownerModel.userData || !ownerModel.userData.animations) return;
        
        const time = ownerModel.userData.animations.time;
        const components = ownerModel.userData.components;
        const animations = ownerModel.userData.animations;
        
        // Update breathing animation
        if (components.body && animations.breathing.enabled) {
            const breathingFactor = Math.sin(time * animations.breathing.speed) * 
                                   animations.breathing.amplitude + 1;
            
            if (components.body.userData.originalScale) {
                components.body.scale.set(
                    components.body.userData.originalScale.x,
                    components.body.userData.originalScale.y * breathingFactor,
                    components.body.userData.originalScale.z
                );
            }
        }
        
        // Update head movement
        if (components.head && animations.headMovement.enabled) {
            // Skip if petting action is active
            if (!animations.pettingDog.active) {
                if (components.head.userData.originalRotation) {
                    components.head.rotation.x = components.head.userData.originalRotation.x + 
                                               Math.sin(time * animations.headMovement.speed) * 
                                               animations.headMovement.amplitude;
                    
                    components.head.rotation.y = components.head.userData.originalRotation.y + 
                                               Math.sin(time * (animations.headMovement.speed * 1.3)) * 
                                               (animations.headMovement.amplitude * 0.7);
                }
            } else {
                // Look down at dog when petting
                components.head.rotation.x = components.head.userData.originalRotation.x + 0.3;
                components.head.rotation.y = components.head.userData.originalRotation.y - 0.2;
            }
        }
        
        // Update arm movements
        if (components.leftArm && animations.armSwing.enabled && !animations.pettingDog.active) {
            if (components.leftArm.userData.originalRotation) {
                components.leftArm.rotation.x = components.leftArm.userData.originalRotation.x + 
                                              Math.sin(time * animations.armSwing.speed) * 
                                              animations.armSwing.amplitude;
            }
        }
        
        if (components.rightArm && animations.armSwing.enabled) {
            if (!animations.pettingDog.active) {
                if (components.rightArm.userData.originalRotation) {
                    components.rightArm.rotation.x = components.rightArm.userData.originalRotation.x + 
                                                   Math.sin(time * animations.armSwing.speed + Math.PI) * 
                                                   animations.armSwing.amplitude;
                }
            } else {
                // Petting motion
                const petTime = (Date.now() - animations.pettingDog.startTime) / 1000;
                components.rightArm.rotation.x = -Math.PI / 4 + Math.sin(petTime * 4) * 0.3;
                components.rightArm.rotation.z = Math.PI / 6;
                
                // Check if petting duration is over
                if (Date.now() - animations.pettingDog.startTime > animations.pettingDog.duration) {
                    ownerModel.stopPetting();
                }
            }
        }
        
        // Update eye blinking
        if (animations.blinking.enabled) {
            const now = Date.now();
            const timeSinceLastBlink = now - animations.blinking.lastBlink;
            
            // Time to blink
            if (timeSinceLastBlink > animations.blinking.interval) {
                animations.blinking.lastBlink = now;
                
                // Find eyes in face
                const face = this.findComponentByName(components.head, 'ownerFace');
                if (face) {
                    // Trigger blink
                    this.blinkEyes(face, animations.blinking.duration);
                }
            }
        }
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
     * Set up arm movement animation
     * @param {THREE.Object3D} armGroup - The arm group to animate
     * @param {string} side - 'left' or 'right' arm
     */
    setupArmMovement(armGroup, side) {
        if (!armGroup) return;
        
        // Store the original rotation
        armGroup.userData.originalRotation = {
            x: armGroup.rotation.x,
            y: armGroup.rotation.y,
            z: armGroup.rotation.z
        };
    }
    
    /**
     * Set up petting action for the owner
     * @param {THREE.Group} ownerModel - The owner model
     * @param {THREE.Object3D} rightArm - The right arm object
     */
    setupPettingAction(ownerModel, rightArm) {
        if (!ownerModel) return;
        
        // Initialize userData if not exists
        if (!ownerModel.userData) ownerModel.userData = {};
        if (!ownerModel.userData.animations) ownerModel.userData.animations = {};
        
        // Add pet dog method directly to the model
        ownerModel.petDog = function(dogModel) {
            if (!dogModel) return;
            
            // Set petting action active
            if (!this.userData.animations.pettingDog) {
                this.userData.animations.pettingDog = {};
            }
            
            this.userData.animations.pettingDog.active = true;
            this.userData.animations.pettingDog.startTime = Date.now();
            
            // Find right arm components if not provided
            if (!rightArm) {
                rightArm = this.getObjectByName('rightUpperArm');
            }
            
            // Store original arm position for reset
            if (rightArm && !rightArm.userData.originalPosition) {
                rightArm.userData.originalPosition = {
                    rotation: {
                        x: rightArm.rotation.x,
                        y: rightArm.rotation.y,
                        z: rightArm.rotation.z
                    }
                };
            }
            
            // Trigger dog's pet response if available
            if (dogModel && typeof dogModel.respondToPetting === 'function') {
                dogModel.respondToPetting();
                console.log('Owner is petting the dog');
            } else {
                console.log('Dog model does not have respondToPetting method');
            }
        }.bind(ownerModel);

        // Add method to stop petting
        ownerModel.stopPetting = function() {
            if (this.userData && this.userData.animations) {
                this.userData.animations.pettingDog.active = false;
            }
            
            // Find right arm if not provided
            if (!rightArm) {
                rightArm = this.getObjectByName('rightUpperArm');
            }
            
            // Reset arm position
            if (rightArm && rightArm.userData.originalPosition) {
                rightArm.rotation.x = rightArm.userData.originalPosition.rotation.x;
                rightArm.rotation.y = rightArm.userData.originalPosition.rotation.y;
                rightArm.rotation.z = rightArm.userData.originalPosition.rotation.z;
            }
        }.bind(ownerModel);
    }
    
    /**
     * Set up eye blinking animation
     * @param {THREE.Group} faceGroup - The face group
     * @param {Object} blinkConfig - Blinking configuration
     */
    setupEyeBlinking(faceGroup, blinkConfig) {
        // Find eyes
        let leftEye = null;
        let rightEye = null;
        
        faceGroup.traverse((object) => {
            if (object.isMesh && object.position.x > 0 && 
                object.position.z > 0 && object.material.color.getHex() === 0xffffff) {
                leftEye = object;
            } else if (object.isMesh && object.position.x < 0 && 
                       object.position.z > 0 && object.material.color.getHex() === 0xffffff) {
                rightEye = object;
            }
        });
        
        if (!leftEye || !rightEye) return;
        
        // Create eyelids if they don't exist
        if (!faceGroup.getObjectByName('leftEyelid')) {
            const eyelidMaterial = new THREE.MeshStandardMaterial({
                color: this.colors.skin,
                roughness: 0.7,
                metalness: 0.1
            });
            
            // Left eyelid
            const leftEyelid = new THREE.Mesh(
                leftEye.geometry.clone(),
                eyelidMaterial
            );
            leftEyelid.name = 'leftEyelid';
            leftEyelid.position.copy(leftEye.position);
            leftEyelid.scale.copy(leftEye.scale);
            leftEyelid.position.z += 0.001; // Slightly in front of eye
            leftEyelid.visible = false; // Hidden by default
            faceGroup.add(leftEyelid);
            
            // Right eyelid
            const rightEyelid = new THREE.Mesh(
                rightEye.geometry.clone(),
                eyelidMaterial
            );
            rightEyelid.name = 'rightEyelid';
            rightEyelid.position.copy(rightEye.position);
            rightEyelid.scale.copy(rightEye.scale);
            rightEyelid.position.z += 0.001; // Slightly in front of eye
            rightEyelid.visible = false; // Hidden by default
            faceGroup.add(rightEyelid);
        }
    }
    
    /**
     * Trigger a blink animation
     * @param {THREE.Group} faceGroup - The face group
     * @param {number} duration - Blink duration in ms
     */
    blinkEyes(faceGroup, duration) {
        const leftEyelid = faceGroup.getObjectByName('leftEyelid');
        const rightEyelid = faceGroup.getObjectByName('rightEyelid');
        
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
     * Create a texture for clothing to add detail
     * @param {number} intensity - Wrinkle intensity (0-1)
     * @param {number} scale - Texture scale (0-1)
     * @returns {THREE.Texture} Generated texture
     */
    createClothingTexture(intensity = 0.2, scale = 0.1) {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Fill with base color
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);
        
        // Create fabric pattern
        const patternSize = Math.floor(size * scale);
        const halfPatternSize = patternSize / 2;
        
        // Draw horizontal threads
        for (let y = 0; y < size; y += patternSize) {
            for (let x = 0; x < size; x += 2) {
                const alpha = 0.1 + Math.random() * intensity * 0.2;
                ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
                ctx.fillRect(x, y, 1, halfPatternSize);
            }
        }
        
        // Draw vertical threads
        for (let x = 0; x < size; x += patternSize) {
            for (let y = 0; y < size; y += 2) {
                const alpha = 0.1 + Math.random() * intensity * 0.2;
                ctx.fillStyle = `rgba(180, 180, 180, ${alpha})`;
                ctx.fillRect(x, y, halfPatternSize, 1);
            }
        }
        
        // Add subtle color variations
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = 1 + Math.random() * 3;
            const alpha = Math.random() * intensity * 0.3;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 100, 100, ${alpha})`;
            ctx.fill();
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        
        return texture;
    }
    
    /**
     * Create detailed arms for the owner model
     * @returns {THREE.Group} - Arms group
     */
    createDetailedArms() {
        // Create a group to hold both arms
        const armsGroup = new THREE.Group();
        armsGroup.name = 'ownerArms';
        
        // Improved arm dimensions
        const upperArmLength = 0.28;
        const upperArmRadius = 0.04; // Increased thickness
        const forearmLength = 0.25;
        const forearmRadius = 0.035; // Increased thickness
        
        // Create upper arm geometry with proper dimensions
        const upperArmGeometry = new THREE.CylinderGeometry(
            upperArmRadius, upperArmRadius, upperArmLength, 12, 1);
        
        // Create forearm geometry with proper dimensions
        const forearmGeometry = new THREE.CylinderGeometry(
            forearmRadius, forearmRadius, forearmLength, 12, 1);
        
        // Skin-colored material for arms
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0xF5D0A9, // Light skin tone
            roughness: 0.7,
            metalness: 0.1
        });
        
        // Create LEFT arm components
        // Upper arm - positioned relative to shoulder (no offset)
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        leftUpperArm.name = 'leftUpperArm';
        // Position at shoulder joint - critical fix
        leftUpperArm.position.set(this.proportions.shoulderWidth / 2, 0, 0);
        // Rotate down and outward slightly
        leftUpperArm.rotation.z = Math.PI / 2 + 0.15;
        
        // Translate to align with shoulder
        // Move to half the length to align end with shoulder
        leftUpperArm.translateY(upperArmLength / 2);
        
        // Create forearm positioned at end of upper arm
        const leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        leftForearm.name = 'leftForearm';
        // Position at elbow
        leftForearm.position.copy(leftUpperArm.position);
        leftForearm.rotation.copy(leftUpperArm.rotation);
        // Translate down the arm to elbow position
        leftForearm.translateY(upperArmLength / 2 + forearmLength / 2 + 0.01); // Slight overlap at elbow
        
        // Create left hand
        const leftHand = this.createDetailedHands('left');
        leftHand.name = 'leftHand';
        leftHand.position.copy(leftForearm.position);
        leftHand.rotation.copy(leftForearm.rotation);
        // Position the hand at the end of the forearm
        leftHand.translateY(forearmLength / 2 + 0.02);
        // Rotate the hand to natural position
        leftHand.rotateX(Math.PI / 2);
        
        // Create RIGHT arm components with same approach
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        rightUpperArm.name = 'rightUpperArm';
        // Position at shoulder joint - critical fix
        rightUpperArm.position.set(-this.proportions.shoulderWidth / 2, 0, 0);
        // Rotate down and outward slightly
        rightUpperArm.rotation.z = -Math.PI / 2 - 0.15;
        
        // Translate to align with shoulder
        rightUpperArm.translateY(upperArmLength / 2);
        
        // Create forearm positioned at end of upper arm
        const rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        rightForearm.name = 'rightForearm';
        // Position at elbow
        rightForearm.position.copy(rightUpperArm.position);
        rightForearm.rotation.copy(rightUpperArm.rotation);
        // Translate down the arm to elbow position
        rightForearm.translateY(upperArmLength / 2 + forearmLength / 2 + 0.01); // Slight overlap at elbow
        
        // Create right hand
        const rightHand = this.createDetailedHands('right');
        rightHand.name = 'rightHand';
        rightHand.position.copy(rightForearm.position);
        rightHand.rotation.copy(rightForearm.rotation);
        // Position the hand at the end of the forearm
        rightHand.translateY(forearmLength / 2 + 0.02);
        // Rotate the hand to natural position
        rightHand.rotateX(Math.PI / 2);
        
        // Add arms and hands to group
        armsGroup.add(leftUpperArm);
        armsGroup.add(leftForearm);
        armsGroup.add(leftHand);
        armsGroup.add(rightUpperArm);
        armsGroup.add(rightForearm);
        armsGroup.add(rightHand);
        
        // Store references for animation
        armsGroup.userData = {
            leftUpperArm: leftUpperArm,
            leftForearm: leftForearm,
            leftHand: leftHand,
            rightUpperArm: rightUpperArm,
            rightForearm: rightForearm,
            rightHand: rightHand
        };
        
        return armsGroup;
    }
    
    /**
     * Create detailed hands with proper structure and positioning
     * @param {string} side - 'left' or 'right' side
     * @returns {THREE.Group} - Hand group
     */
    createDetailedHands(side = 'left') {
        const handGroup = new THREE.Group();
        handGroup.name = side + 'Hand';
        
        // Create main hand geometry with improved materials
        const handMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.skin,
            roughness: 0.6,  // Less rough for smoother skin appearance
            metalness: 0.1,
            side: THREE.DoubleSide // Ensure visibility from all angles
        });
        
        // Create palm with better proportions
        const palmGeometry = new THREE.BoxGeometry(0.07, 0.025, 0.09);
        palmGeometry.translate(0, -0.012, 0.045); // Offset to position correctly
        const palm = new THREE.Mesh(palmGeometry, handMaterial);
        palm.castShadow = true;
        handGroup.add(palm);
        
        // Create fingers with better visibility
        const createFinger = (length, width, xPos, zPos, angle = 0) => {
            const fingerGroup = new THREE.Group();
            
            // Create finger geometry - more cylindrical for realism
            const fingerGeometry = new THREE.CylinderGeometry(
                width / 2,  // Top radius
                width / 2,  // Bottom radius
                length,     // Height
                8,          // RadialSegments
                1,          // HeightSegments
                false       // OpenEnded
            );
            
            // Rotate to point forward
            fingerGeometry.rotateX(Math.PI / 2);
            
            const finger = new THREE.Mesh(fingerGeometry, handMaterial);
            finger.position.set(0, 0, length / 2);
            finger.castShadow = true;
            
            // Add to finger group
            fingerGroup.add(finger);
            
            // Position the finger group
            fingerGroup.position.set(xPos, 0, zPos);
            
            // Apply finger angle
            fingerGroup.rotation.x = angle;
            
            return fingerGroup;
        };
        
        // Create thumb with improved visibility
        const thumb = createFinger(0.055, 0.025, side === 'left' ? -0.035 : 0.035, 0.045, Math.PI / 4);
        handGroup.add(thumb);
        
        // Create index finger with improved visibility
        const indexFinger = createFinger(0.065, 0.02, side === 'left' ? -0.025 : 0.025, 0.085, 0);
        handGroup.add(indexFinger);
        
        // Create middle finger with improved visibility
        const middleFinger = createFinger(0.07, 0.02, 0, 0.085, 0);
        handGroup.add(middleFinger);
        
        // Create ring finger with improved visibility
        const ringFinger = createFinger(0.065, 0.02, side === 'left' ? 0.025 : -0.025, 0.085, 0);
        handGroup.add(ringFinger);
        
        // Create pinky finger with improved visibility
        const pinkyFinger = createFinger(0.055, 0.016, side === 'left' ? 0.035 : -0.035, 0.085, 0);
        handGroup.add(pinkyFinger);
        
        return handGroup;
    }
    
    /**
     * Create detailed hair
     * @returns {THREE.Group} - Hair group
     */
    createDetailedHair() {
        const hairGroup = new THREE.Group();
        hairGroup.name = 'ownerHair';
        
        // Hair geometry
        const hairGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 1.05,
            24,
            24,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );
        
        // Hair material
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.hair,
            roughness: 0.8,
            metalness: 0.1
        });
        
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = this.proportions.headSize * 0.1;
        hair.castShadow = true;
        hairGroup.add(hair);
        
        // Add some hair strands
        const strandGeometry = new THREE.CylinderGeometry(
            0.01,
            0.005,
            this.proportions.headSize * 0.6,
            6,
            1
        );
        
        // Create several strands
        for (let i = 0; i < 20; i++) {
            const strand = new THREE.Mesh(strandGeometry, hairMaterial);
            const angle = (i / 20) * Math.PI * 2;
            const radius = this.proportions.headSize * 0.8;
            
            strand.position.set(
                Math.cos(angle) * radius,
                this.proportions.headSize * 0.1,
                Math.sin(angle) * radius
            );
            
            strand.rotation.x = Math.PI / 2;
            strand.rotation.z = angle;
            hairGroup.add(strand);
        }
        
        return hairGroup;
    }
    
    /**
     * Create detailed face
     * @returns {THREE.Group} - Face group
     */
    createDetailedFace() {
        const faceGroup = new THREE.Group();
        faceGroup.name = 'ownerFace';
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.08,
            16,
            16
        );
        
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEye.position.set(
            this.proportions.headSize * 0.3,
            this.proportions.headSize * 0.1,
            this.proportions.headSize * 0.8
        );
        leftEye.scale.set(1, 0.5, 0.5);
        faceGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        rightEye.position.set(
            -this.proportions.headSize * 0.3,
            this.proportions.headSize * 0.1,
            this.proportions.headSize * 0.8
        );
        rightEye.scale.set(1, 0.5, 0.5);
        faceGroup.add(rightEye);
        
        // Iris
        const irisGeometry = new THREE.SphereGeometry(
            this.proportions.headSize * 0.04,
            16,
            16
        );
        
        const irisMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.eyes,
            roughness: 0.1,
            metalness: 0.2
        });
        
        const leftIris = new THREE.Mesh(irisGeometry, irisMaterial);
        leftIris.position.set(0, 0, this.proportions.headSize * 0.05);
        leftEye.add(leftIris);
        
        const rightIris = new THREE.Mesh(irisGeometry, irisMaterial);
        rightIris.position.set(0, 0, this.proportions.headSize * 0.05);
        rightEye.add(rightIris);
        
        // Nose
        const noseGeometry = new THREE.ConeGeometry(
            this.proportions.headSize * 0.08,
            this.proportions.headSize * 0.15,
            4,
            1
        );
        
        const noseMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.skin,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(
            0,
            -this.proportions.headSize * 0.1,
            this.proportions.headSize * 0.9
        );
        nose.rotation.x = -Math.PI / 2;
        faceGroup.add(nose);
        
        // Mouth
        const mouthGeometry = new THREE.BoxGeometry(
            this.proportions.headSize * 0.4,
            this.proportions.headSize * 0.05,
            this.proportions.headSize * 0.05
        );
        
        const mouthMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.lips,
            roughness: 0.6,
            metalness: 0.1
        });
        
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(
            0,
            -this.proportions.headSize * 0.4,
            this.proportions.headSize * 0.8
        );
        faceGroup.add(mouth);
        
        return faceGroup;
    }
    
    /**
     * Create detailed legs with proper feet
     * @returns {THREE.Group} - Legs group
     */
    createDetailedLegs() {
        const legsGroup = new THREE.Group();
        legsGroup.name = 'ownerLegs';
        
        // Create pants material
        const pantsMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.pants,
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Create thighs
        const thighGeometry = new THREE.CylinderGeometry(
            0.09,  // Top radius
            0.07,  // Bottom radius
            this.proportions.legLength * 0.5,
            10
        );
        
        // Left thigh
        const leftThigh = new THREE.Mesh(thighGeometry, pantsMaterial);
        leftThigh.position.set(
            this.proportions.hipWidth * 0.3,
            this.proportions.legLength * 0.75,
            0
        );
        leftThigh.castShadow = true;
        legsGroup.add(leftThigh);
        
        // Right thigh
        const rightThigh = leftThigh.clone();
        rightThigh.position.x = -this.proportions.hipWidth * 0.3;
        legsGroup.add(rightThigh);
        
        // Create calves
        const calfGeometry = new THREE.CylinderGeometry(
            0.07,  // Top radius
            0.05,  // Bottom radius
            this.proportions.legLength * 0.5,
            10
        );
        
        // Left calf
        const leftCalf = new THREE.Mesh(calfGeometry, pantsMaterial);
        leftCalf.position.set(
            0,
            -this.proportions.legLength * 0.5,
            0
        );
        leftCalf.castShadow = true;
        leftThigh.add(leftCalf);
        
        // Right calf
        const rightCalf = leftCalf.clone();
        rightThigh.add(rightCalf);
        
        // Add feet
        const leftFoot = this.createDetailedFeet('left');
        leftFoot.position.set(0, -this.proportions.legLength * 0.25, 0.05);
        leftCalf.add(leftFoot);
        
        const rightFoot = this.createDetailedFeet('right');
        rightFoot.position.set(0, -this.proportions.legLength * 0.25, 0.05);
        rightCalf.add(rightFoot);
        
        return legsGroup;
    }
    
    /**
     * Create detailed feet with shoes
     * @param {string} side - 'left' or 'right' foot
     * @returns {THREE.Group} - Foot group
     */
    createDetailedFeet(side = 'left') {
        const footGroup = new THREE.Group();
        footGroup.name = `owner${side.charAt(0).toUpperCase() + side.slice(1)}Foot`;
        
        // Shoe material
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.shoes,
            roughness: 0.7,
            metalness: 0.2
        });
        
        // Create shoe
        const shoeGeometry = new THREE.BoxGeometry(
            0.08,
            0.04,
            0.15
        );
        
        const shoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        shoe.position.z = 0.05;
        shoe.castShadow = true;
        
        // Tilt shoe to match foot angle
        shoe.rotation.x = Math.PI / 12;
        
        footGroup.add(shoe);
        
        // Add shoe details - heel
        const heelGeometry = new THREE.BoxGeometry(
            0.07,
            0.06,
            0.04
        );
        
        const heel = new THREE.Mesh(heelGeometry, shoeMaterial);
        heel.position.set(0, -0.02, -0.04);
        heel.castShadow = true;
        footGroup.add(heel);
        
        return footGroup;
    }
    
    /**
     * Create a component programmatically
     * @param {string} component - Component to create
     * @returns {THREE.Object3D} - The created component
     */
    createComponent(component) {
        console.log(`Creating owner component: ${component}`);
        let object;
        
        try {
            switch (component) {
                case 'full':
                    object = this.createFullModel();
                    break;
                case 'base':
                    object = this.createBaseModel();
                    break;
                case 'head':
                    object = this.createDetailedHead();
                    break;
                case 'body':
                    object = this.createEnhancedBody();
                    break;
                case 'face':
                    object = this.createDetailedFace();
                    break;
                case 'hands':
                    object = this.createDetailedHands();
                    break;
                case 'feet':
                    object = this.createDetailedFeet();
                    break;
                case 'hair':
                    object = this.createDetailedHair();
                    break;
                case 'clothing':
                    object = this.createDetailedClothing();
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
            console.error(`Error creating owner component ${component}:`, error);
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
        group.name = `ownerSimple_${component}`;
        
        // Create a simple colored box as placeholder
        const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const material = new THREE.MeshStandardMaterial({ color: this.colors.shirt });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
        
        return group;
    }
    
    /**
     * Create a base model
     * @returns {THREE.Group} - Base model group
     */
    createBaseModel() {
        const group = new THREE.Group();
        group.name = 'ownerBase';
        
        // Add body
        const bodyGroup = this.createEnhancedBody();
        group.add(bodyGroup);
        
        return group;
    }
    
    /**
     * Create detailed clothing
     * @returns {THREE.Group} - Clothing group
     */
    createDetailedClothing() {
        const clothingGroup = new THREE.Group();
        clothingGroup.name = 'ownerClothing';
        
        // Create fitted shirt/blouse
        const shirtGeometry = new THREE.CylinderGeometry(
            this.proportions.shoulderWidth / 2 + 0.02,
            this.proportions.waistSize / 2 + 0.01,
            this.proportions.torsoLength * 0.6,
            12,
            4
        );
        
        // Shirt material with subtle texture
        const shirtMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.shirt,
            roughness: 0.8,
            metalness: 0.1,
            map: this.createClothingTexture(0.3, 0.2)
        });
        
        const shirt = new THREE.Mesh(shirtGeometry, shirtMaterial);
        shirt.position.y = this.proportions.legLength + this.proportions.torsoLength * 0.65;
        shirt.castShadow = true;
        clothingGroup.add(shirt);
        
        // Create fitted pants
        const pantsGeometry = new THREE.CylinderGeometry(
            this.proportions.hipWidth / 2 + 0.01,
            this.proportions.hipWidth / 3,
            this.proportions.legLength * 0.9,
            12,
            4
        );
        
        const pantsMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.pants,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
        pants.position.y = this.proportions.legLength * 0.45;
        pants.castShadow = true;
        clothingGroup.add(pants);
        
        // Add jacket
        const jacketGeometry = new THREE.CylinderGeometry(
            this.proportions.shoulderWidth / 2 + 0.03,
            this.proportions.waistSize / 2 + 0.02,
            this.proportions.torsoLength * 0.4,
            12,
            2
        );
        
        const jacketMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.jacket,
            roughness: 0.6,
            metalness: 0.2
        });
        
        const jacket = new THREE.Mesh(jacketGeometry, jacketMaterial);
        jacket.position.y = this.proportions.legLength + this.proportions.torsoLength * 0.75;
        jacket.castShadow = true;
        clothingGroup.add(jacket);
        
        // Add belt
        const beltGeometry = new THREE.TorusGeometry(
            this.proportions.waistSize / 2 + 0.01,
            0.01,
            8,
            24
        );
        
        const beltMaterial = new THREE.MeshStandardMaterial({
            color: 0x2B2117, // Dark brown
            roughness: 0.6,
            metalness: 0.4
        });
        
        const belt = new THREE.Mesh(beltGeometry, beltMaterial);
        belt.position.y = this.proportions.legLength + this.proportions.torsoLength * 0.4;
        belt.rotation.x = Math.PI / 2;
        clothingGroup.add(belt);
        
        // Add necklace
        const necklaceGeometry = new THREE.TorusGeometry(
            this.proportions.neckLength * 0.8,
            0.003,
            8,
            16
        );
        
        const necklaceMaterial = new THREE.MeshStandardMaterial({
            color: this.colors.accessories,
            roughness: 0.3,
            metalness: 0.9
        });
        
        const necklace = new THREE.Mesh(necklaceGeometry, necklaceMaterial);
        necklace.position.y = this.proportions.legLength + this.proportions.torsoLength + this.proportions.neckLength * 0.8;
        necklace.rotation.x = Math.PI / 6;
        clothingGroup.add(necklace);
        
        // Add pendant to necklace
        const pendantGeometry = new THREE.ConeGeometry(0.01, 0.02, 8);
        const pendant = new THREE.Mesh(pendantGeometry, necklaceMaterial);
        pendant.position.set(0, -0.02, 0.02);
        pendant.rotation.x = -Math.PI / 6;
        necklace.add(pendant);
        
        return clothingGroup;
    }
} 