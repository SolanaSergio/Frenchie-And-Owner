/**
 * ParkSceneCreator class
 * Creates a realistic park environment for the 3D scene
 */
class ParkSceneCreator {
    /**
     * Constructor
     * @param {THREE.Scene} scene - The Three.js scene
     */
    constructor(scene) {
        this.scene = scene;
        this.elements = {
            ground: null,
            trees: [],
            bushes: [],
            benches: [],
            pathway: null,
            skyDome: null,
            pond: null,
            flowers: [],
            particles: null,
            waterSound: null
        };
        
        // Default configuration
        this.config = {
            groundSize: 20,
            treesCount: 8,
            bushesCount: 12,
            flowersCount: 20,
            addBenches: true,
            addPathway: true,
            addPond: true,
            skyBox: true,
            enableParticles: true,
            enhancedLighting: true,
            grassDetail: 'medium',
            ambientOcclusion: false
        };
        
        // Create a group for park elements (for compatibility with the utils version)
        this.parkElements = new THREE.Group();
        this.scene.add(this.parkElements);
        
        // Initialize textures
        this.textures = {};
        this.loadTextures();
    }
    
    /**
     * Create a complete park environment (compatibility method for utils version)
     * @param {Object} options - Configuration options for the park
     * @returns {THREE.Group} - The park elements group
     */
    createParkScene(options = {}) {
        console.log("Creating park environment using createParkScene method");
        
        // Call the main createScene method with the provided options
        return this.createScene(options);
    }
    
    /**
     * Load all required textures
     */
    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        
        // Load grass texture
        this.textures.grass = {
            color: textureLoader.load('textures/grass_color.jpg', this.handleTextureLoaded.bind(this)),
            normal: textureLoader.load('textures/grass_normal.jpg', this.handleTextureLoaded.bind(this)),
            roughness: textureLoader.load('textures/grass_roughness.jpg', this.handleTextureLoaded.bind(this)),
            displacement: textureLoader.load('textures/grass_displacement.jpg', this.handleTextureLoaded.bind(this))
        };
        
        // Load bark texture
        this.textures.bark = {
            color: textureLoader.load('textures/bark_color.jpg', this.handleTextureLoaded.bind(this)),
            normal: textureLoader.load('textures/bark_normal.jpg', this.handleTextureLoaded.bind(this)),
            roughness: textureLoader.load('textures/bark_roughness.jpg', this.handleTextureLoaded.bind(this))
        };
        
        // Load stone texture for pathway
        this.textures.stone = {
            color: textureLoader.load('textures/stone_color.jpg', this.handleTextureLoaded.bind(this)),
            normal: textureLoader.load('textures/stone_normal.jpg', this.handleTextureLoaded.bind(this)),
            roughness: textureLoader.load('textures/stone_roughness.jpg', this.handleTextureLoaded.bind(this))
        };
        
        // Load wood texture for benches
        this.textures.wood = {
            color: textureLoader.load('textures/wood_color.jpg', this.handleTextureLoaded.bind(this)),
            normal: textureLoader.load('textures/wood_normal.jpg', this.handleTextureLoaded.bind(this)),
            roughness: textureLoader.load('textures/wood_roughness.jpg', this.handleTextureLoaded.bind(this))
        };
        
        // Use placeholder textures if real ones aren't available
        this.setupPlaceholderTextures();
    }
    
    /**
     * Setup placeholder textures in case real textures fail to load
     */
    setupPlaceholderTextures() {
        // Create a grass color texture
        const grassCanvas = document.createElement('canvas');
        grassCanvas.width = 256;
        grassCanvas.height = 256;
        const grassCtx = grassCanvas.getContext('2d');
        grassCtx.fillStyle = '#4a8c3d';
        grassCtx.fillRect(0, 0, 256, 256);
        
        // Add some variation
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = 1 + Math.random() * 2;
            grassCtx.fillStyle = Math.random() > 0.5 ? '#3a7c2d' : '#5a9c4d';
            grassCtx.fillRect(x, y, size, size);
        }
        
        this.textures.grassPlaceholder = new THREE.CanvasTexture(grassCanvas);
        this.textures.grassPlaceholder.wrapS = THREE.RepeatWrapping;
        this.textures.grassPlaceholder.wrapT = THREE.RepeatWrapping;
        this.textures.grassPlaceholder.repeat.set(10, 10);
        
        // Create a bark color texture
        const barkCanvas = document.createElement('canvas');
        barkCanvas.width = 256;
        barkCanvas.height = 256;
        const barkCtx = barkCanvas.getContext('2d');
        barkCtx.fillStyle = '#8B4513';
        barkCtx.fillRect(0, 0, 256, 256);
        
        // Add some variation
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = 1 + Math.random() * 3;
            barkCtx.fillStyle = Math.random() > 0.5 ? '#7B3503' : '#9B5523';
            barkCtx.fillRect(x, y, size, size * 3);
        }
        
        this.textures.barkPlaceholder = new THREE.CanvasTexture(barkCanvas);
        this.textures.barkPlaceholder.wrapS = THREE.RepeatWrapping;
        this.textures.barkPlaceholder.wrapT = THREE.RepeatWrapping;
        this.textures.barkPlaceholder.repeat.set(2, 2);
        
        // Create a stone color texture
        const stoneCanvas = document.createElement('canvas');
        stoneCanvas.width = 256;
        stoneCanvas.height = 256;
        const stoneCtx = stoneCanvas.getContext('2d');
        stoneCtx.fillStyle = '#888888';
        stoneCtx.fillRect(0, 0, 256, 256);
        
        // Add some variation
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const size = 1 + Math.random() * 4;
            stoneCtx.fillStyle = Math.random() > 0.5 ? '#777777' : '#999999';
            stoneCtx.fillRect(x, y, size, size);
        }
        
        this.textures.stonePlaceholder = new THREE.CanvasTexture(stoneCanvas);
        this.textures.stonePlaceholder.wrapS = THREE.RepeatWrapping;
        this.textures.stonePlaceholder.wrapT = THREE.RepeatWrapping;
        this.textures.stonePlaceholder.repeat.set(5, 5);
        
        // Create a wood color texture
        const woodCanvas = document.createElement('canvas');
        woodCanvas.width = 256;
        woodCanvas.height = 256;
        const woodCtx = woodCanvas.getContext('2d');
        woodCtx.fillStyle = '#C19A6B';
        woodCtx.fillRect(0, 0, 256, 256);
        
        // Add some wood grain
        for (let i = 0; i < 20; i++) {
            const y = Math.random() * 256;
            woodCtx.fillStyle = Math.random() > 0.5 ? '#B18A5B' : '#D1AA7B';
            woodCtx.fillRect(0, y, 256, 2 + Math.random() * 5);
        }
        
        this.textures.woodPlaceholder = new THREE.CanvasTexture(woodCanvas);
        this.textures.woodPlaceholder.wrapS = THREE.RepeatWrapping;
        this.textures.woodPlaceholder.wrapT = THREE.RepeatWrapping;
        this.textures.woodPlaceholder.repeat.set(1, 1);
    }
    
    /**
     * Handle texture loading completion
     */
    handleTextureLoaded(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        console.log('Texture loaded:', texture.source.data.src);
    }
    
    /**
     * Create the complete park scene
     * @param {Object} config - Optional configuration object
     */
    createScene(config = {}) {
        // Merge provided config with defaults
        this.config = { ...this.config, ...config };
        
        console.log('Creating park scene with config:', this.config);
        
        // Create sky first so it's in the background
        this.createSky();
        
        // Ensure textures are loaded before proceeding
        this.ensureTexturesLoaded();
        
        // Create ground
        this.createGround();
        
        // Create pond if enabled
        if (this.config.addPond) {
            this.createPond();
        }
        
        // Create pathway if enabled
        if (this.config.addPathway) {
            this.createPathway();
        }
        
        // Add trees
        this.addTrees();
        
        // Add bushes
        this.addBushes();
        
        // Add flowers
        this.addFlowers();
        
        // Add benches if enabled
        if (this.config.addBenches) {
            this.addBenches();
        }
        
        // Add ambient particles (dust, pollen, etc.)
        if (this.config.enableParticles) {
            this.createAmbientParticles();
        }
        
        // Setup lighting
        this.setupLighting();
        
        console.log('Park scene created successfully');
        return this.elements;
    }
    
    /**
     * Ensure textures are loaded before proceeding
     * If real textures fail to load, use placeholder textures
     */
    ensureTexturesLoaded() {
        // Check if grass textures are loaded
        if (!this.textures.grass || !this.textures.grass.color.image) {
            console.warn('Grass textures not loaded, using placeholders');
            this.textures.grass = {
                color: this.textures.grassPlaceholder,
                normal: this.textures.grassPlaceholder,
                roughness: this.textures.grassPlaceholder,
                displacement: this.textures.grassPlaceholder
            };
        }
        
        // Check if bark textures are loaded
        if (!this.textures.bark || !this.textures.bark.color.image) {
            console.warn('Bark textures not loaded, using placeholders');
            this.textures.bark = {
                color: this.textures.barkPlaceholder,
                normal: this.textures.barkPlaceholder,
                roughness: this.textures.barkPlaceholder
            };
        }
        
        // Check if stone textures are loaded
        if (!this.textures.stone || !this.textures.stone.color.image) {
            console.warn('Stone textures not loaded, using placeholders');
            this.textures.stone = {
                color: this.textures.stonePlaceholder,
                normal: this.textures.stonePlaceholder,
                roughness: this.textures.stonePlaceholder
            };
        }
        
        // Check if wood textures are loaded
        if (!this.textures.wood || !this.textures.wood.color.image) {
            console.warn('Wood textures not loaded, using placeholders');
            this.textures.wood = {
                color: this.textures.woodPlaceholder,
                normal: this.textures.woodPlaceholder,
                roughness: this.textures.woodPlaceholder
            };
        }
        
        // Set proper texture parameters
        Object.values(this.textures).forEach(textureSet => {
            if (textureSet && typeof textureSet === 'object') {
                Object.values(textureSet).forEach(texture => {
                    if (texture && texture.isTexture) {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(10, 10);
                    }
                });
            }
        });
    }
    
    /**
     * Create enhanced ground with better textures and details
     */
    createGround() {
        console.log('Creating enhanced ground');
        
        // Create ground geometry
        const groundGeometry = new THREE.PlaneGeometry(
            this.config.groundSize,
            this.config.groundSize,
            32, 32
        );
        
        // Rotate to be horizontal
        groundGeometry.rotateX(-Math.PI / 2);
        
        // Create material with grass texture
        let groundMaterial;
        
        if (this.textures.grass && this.textures.grass.color) {
            // Use loaded textures
            groundMaterial = new THREE.MeshStandardMaterial({
                map: this.textures.grass.color,
                normalMap: this.textures.grass.normal,
                roughnessMap: this.textures.grass.roughness,
                displacementMap: this.textures.grass.displacement,
            displacementScale: 0.1,
            roughness: 0.8,
                metalness: 0.1
            });
            
            // Set texture repeat based on ground size
            const repeatFactor = this.config.groundSize / 5;
            groundMaterial.map.repeat.set(repeatFactor, repeatFactor);
            groundMaterial.normalMap.repeat.set(repeatFactor, repeatFactor);
            groundMaterial.roughnessMap.repeat.set(repeatFactor, repeatFactor);
            groundMaterial.displacementMap.repeat.set(repeatFactor, repeatFactor);
            
            // Enable texture repeat
            groundMaterial.map.wrapS = groundMaterial.map.wrapT = THREE.RepeatWrapping;
            groundMaterial.normalMap.wrapS = groundMaterial.normalMap.wrapT = THREE.RepeatWrapping;
            groundMaterial.roughnessMap.wrapS = groundMaterial.roughnessMap.wrapT = THREE.RepeatWrapping;
            groundMaterial.displacementMap.wrapS = groundMaterial.displacementMap.wrapT = THREE.RepeatWrapping;
        } else {
            // Fallback to basic material
            groundMaterial = new THREE.MeshStandardMaterial({
                color: 0x4a8c3d,
                roughness: 0.9,
                metalness: 0.1
            });
        }
        
        // Create ground mesh
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.receiveShadow = true;
        ground.name = 'parkGround';
        
        // Add to scene
        this.scene.add(ground);
        this.elements.ground = ground;
        
        // Add subtle ground variations for more realism
        this.addGroundVariations();
        
        console.log('Ground created');
    }
    
    /**
     * Add subtle variations to the ground for more realism
     */
    addGroundVariations() {
        // Add small bumps and variations to make the ground less flat
        const bumpCount = 30;
        
        for (let i = 0; i < bumpCount; i++) {
            const bumpSize = 0.5 + Math.random() * 1.5;
            const bumpHeight = 0.05 + Math.random() * 0.1;
            
            const bumpGeometry = new THREE.SphereGeometry(bumpSize, 8, 6);
            const bumpMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a7c2d,
                roughness: 0.9,
                metalness: 0.1
            });
            
            const bump = new THREE.Mesh(bumpGeometry, bumpMaterial);
            
            // Position randomly on the ground
            const posX = (Math.random() - 0.5) * this.config.groundSize * 0.8;
            const posZ = (Math.random() - 0.5) * this.config.groundSize * 0.8;
            
            bump.position.set(posX, -bumpSize + bumpHeight, posZ);
            this.scene.add(bump);
        }
    }
    
    /**
     * Create an enhanced pond with realistic water effects
     */
    createPond() {
        console.log('Creating enhanced pond');
        
        // Create pond geometry - slightly irregular oval shape
        const pondRadius = 2.0; // Reduced size
        const pondSegments = 32;
        const pondGeometry = new THREE.CircleGeometry(pondRadius, pondSegments);
        
        // Make the pond shape more irregular/natural
        const vertices = pondGeometry.attributes.position.array;
        for (let i = 3; i < vertices.length; i += 3) {
            const distortionFactor = 0.15;
            vertices[i] *= 1 + (Math.random() - 0.5) * distortionFactor;
            vertices[i + 2] *= 0.8 + (Math.random() - 0.5) * distortionFactor;
        }
        
        // Create water material with realistic effects
        const waterMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0077be,
            roughness: 0.1,
            metalness: 0.2,
            transparent: true,
            opacity: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.5
        });
        
        // Create pond mesh
        const pond = new THREE.Mesh(pondGeometry, waterMaterial);
        pond.rotation.x = -Math.PI / 2;
        pond.position.y = 0.05; // Slightly above ground to avoid z-fighting
        pond.position.z = -4; // Moved further back in the scene
        pond.position.x = -3; // Moved to the left side of the scene
        pond.receiveShadow = true;
        pond.name = 'pond';
        
        // Add to scene
        this.scene.add(pond);
        this.elements.pond = pond;
        
        // Add pond border/edge
        this.createPondEdge(pondRadius, pondSegments);
        
        // Add water animation
        this.animateWater(pond);
        
        // Add water lilies and reeds for more realism
        this.addWaterPlants(pond, pondRadius);
        
        // Add subtle water ripple effect
        this.addWaterRipples(pond);
        
        // Add ambient water sound if available
        this.addWaterSound(pond);
        
        console.log('Enhanced pond created successfully');
        return pond;
    }
    
    /**
     * Create a natural-looking edge around the pond
     * @param {number} pondRadius - The radius of the pond
     * @param {number} segments - The number of segments in the pond geometry
     */
    createPondEdge(pondRadius, segments) {
        // Create a slightly larger ring for the pond edge
        const edgeOuterRadius = pondRadius * 1.2;
        const edgeInnerRadius = pondRadius * 1.0;
        const edgeGeometry = new THREE.RingGeometry(edgeInnerRadius, edgeOuterRadius, segments);
        
        // Make the edge irregular like the pond
        const vertices = edgeGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const distortionFactor = 0.1;
            vertices[i] *= 1 + (Math.random() - 0.5) * distortionFactor;
            vertices[i + 1] *= 1 + (Math.random() - 0.5) * distortionFactor;
        }
        
        // Create material for the edge
        const edgeMaterial = new THREE.MeshStandardMaterial({
            color: 0x5c4033, // Brown color for dirt/mud
            roughness: 0.9,
            metalness: 0.1
        });
        
        // Create edge mesh
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.rotation.x = -Math.PI / 2;
        edge.position.y = 0.06; // Slightly above the pond
        edge.position.z = -4; // Match pond position
        edge.position.x = -3; // Match pond position
        edge.receiveShadow = true;
        
        // Add to scene
        this.scene.add(edge);
        
        // Add some rocks around the pond
        this.addRocksAroundPond(pondRadius);
    }
    
    /**
     * Add decorative rocks around the pond
     * @param {number} pondRadius - The radius of the pond
     */
    addRocksAroundPond(pondRadius) {
        const rockCount = 12;
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.9,
            metalness: 0.2
        });
        
        for (let i = 0; i < rockCount; i++) {
            // Create rock with random size
            const rockSize = 0.1 + Math.random() * 0.2;
            const rockGeometry = new THREE.DodecahedronGeometry(rockSize, 1);
            
            // Distort the rock shape for more natural look
            const vertices = rockGeometry.attributes.position.array;
            for (let j = 0; j < vertices.length; j += 3) {
                vertices[j] *= 0.8 + Math.random() * 0.4;
                vertices[j + 1] *= 0.8 + Math.random() * 0.4;
                vertices[j + 2] *= 0.8 + Math.random() * 0.4;
            }
            
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            // Position around the pond
            const angle = (i / rockCount) * Math.PI * 2;
            const distance = pondRadius * (1.1 + Math.random() * 0.2);
            const x = Math.cos(angle) * distance - 3; // Adjust for pond position
            const z = Math.sin(angle) * distance - 4; // Adjust for pond position
            
            rock.position.set(x, rockSize * 0.5, z);
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            rock.castShadow = true;
            rock.receiveShadow = true;
            
            this.scene.add(rock);
        }
    }
    
    /**
     * Animate the water in the pond
     * @param {THREE.Mesh} pond - The pond mesh to animate
     */
    animateWater(pond) {
        // Create animation function
        const animate = () => {
            // Subtle wave effect by modifying vertices
            const time = Date.now() * 0.001;
            const vertices = pond.geometry.attributes.position.array;
            
            for (let i = 0; i < vertices.length; i += 3) {
                // Skip the center vertex
                if (i > 3) {
                    vertices[i + 2] = Math.sin(time + i * 0.1) * 0.05;
                }
            }
            
            pond.geometry.attributes.position.needsUpdate = true;
            
            // Continue animation
            requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }
    
    /**
     * Add flowers to the scene for more color and detail
     */
    addFlowers() {
        console.log('Adding flowers to the scene');
        
        const flowerColors = [
            0xFFFF00, // Yellow
            0xFF5555, // Red
            0xFF55FF, // Pink
            0x5555FF, // Blue
            0xFFFFFF  // White
        ];
        
        for (let i = 0; i < this.config.flowersCount; i++) {
            // Create flower group
            const flowerGroup = new THREE.Group();
            
            // Create stem
            const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
            const stemMaterial = new THREE.MeshStandardMaterial({
                color: 0x00AA00,
                roughness: 0.8,
                metalness: 0.1
            });
            
            const stem = new THREE.Mesh(stemGeometry, stemMaterial);
            stem.position.y = 0.15;
            flowerGroup.add(stem);
            
            // Create flower head
            const petalColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
            const flowerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const flowerMaterial = new THREE.MeshStandardMaterial({
                color: petalColor,
                roughness: 0.7,
                metalness: 0.1
            });
            
            // Flatten sphere to make it more like a flower
            flowerGeometry.scale(1, 0.3, 1);
            
            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
            flower.position.y = 0.3;
            flowerGroup.add(flower);
            
            // Create center of flower
            const centerGeometry = new THREE.SphereGeometry(0.04, 8, 8);
            const centerMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFFF00,
                roughness: 0.5,
                metalness: 0.2
            });
            
            const center = new THREE.Mesh(centerGeometry, centerMaterial);
            center.position.y = 0.32;
            flowerGroup.add(center);
            
            // Position flower randomly on the ground
            const posX = (Math.random() - 0.5) * this.config.groundSize * 0.8;
            const posZ = (Math.random() - 0.5) * this.config.groundSize * 0.8;
            
            // Avoid placing flowers in the pond
            const distanceFromPond = Math.sqrt(posX * posX + (posZ + 1) * (posZ + 1));
            if (distanceFromPond < 3) {
                i--; // Try again
                continue;
            }
            
            flowerGroup.position.set(posX, 0, posZ);
            
            // Add slight random rotation
            flowerGroup.rotation.y = Math.random() * Math.PI * 2;
            
            this.scene.add(flowerGroup);
            this.elements.flowers.push(flowerGroup);
        }
        
        console.log(`Added ${this.config.flowersCount} flowers`);
    }
    
    /**
     * Create ambient particles for atmosphere (pollen, dust, etc.)
     */
    createAmbientParticles() {
        console.log('Creating ambient particles');
        
        // Create particle geometry
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        // Set random positions within the scene bounds
        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * this.config.groundSize;
            particlePositions[i + 1] = Math.random() * 3; // Height up to 3 units
            particlePositions[i + 2] = (Math.random() - 0.5) * this.config.groundSize;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        // Create particle material
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.05,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        
        // Create particle system
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'ambientParticles';
        
        this.scene.add(particles);
        this.elements.particles = particles;
        
        // Animate particles
        this.animateParticles(particles);
        
        console.log('Ambient particles created');
    }
    
    /**
     * Animate particles for a gentle floating effect
     * @param {THREE.Points} particles - The particle system to animate
     */
    animateParticles(particles) {
        // Create animation function
        const animate = () => {
            const time = Date.now() * 0.0005;
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Gentle floating motion
                positions[i] += Math.sin(time + i) * 0.003;
                positions[i + 1] += Math.cos(time + i) * 0.002;
                positions[i + 2] += Math.sin(time + i * 0.5) * 0.003;
                
                // Reset particles that go too high
                if (positions[i + 1] > 3) {
                    positions[i + 1] = 0;
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Continue animation
            requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    }
    
    /**
     * Setup enhanced lighting for the scene
     */
    setupLighting() {
        console.log('Setting up enhanced lighting');
        
        // Remove any existing lights
        this.scene.children.forEach(child => {
            if (child.isLight) {
                this.scene.remove(child);
            }
        });
        
        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xFFFFCC, 1);
        sunLight.position.set(5, 10, 7);
        sunLight.castShadow = true;
        
        // Improve shadow quality
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        
        // Set shadow camera bounds
        const shadowSize = 15;
        sunLight.shadow.camera.left = -shadowSize;
        sunLight.shadow.camera.right = shadowSize;
        sunLight.shadow.camera.top = shadowSize;
        sunLight.shadow.camera.bottom = -shadowSize;
        
        this.scene.add(sunLight);
        
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x88AACC, 0.5);
        this.scene.add(ambientLight);
        
        // Hemisphere light for better sky/ground color blend
        const hemisphereLight = new THREE.HemisphereLight(0x88CCFF, 0x66AA44, 0.6);
        this.scene.add(hemisphereLight);
        
        console.log('Enhanced lighting setup complete');
    }
    
    /**
     * Create the sky backdrop
     */
    createSky() {
        // Create sky dome with gradient
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },  // Blue sky
                bottomColor: { value: new THREE.Color(0xffffff) },  // White horizon
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });

        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        this.elements.skyDome = sky;

        // Create clouds
        const cloudCount = 20;
        const clouds = new THREE.Group();
        clouds.name = 'clouds';
        
        for (let i = 0; i < cloudCount; i++) {
            const cloudGroup = new THREE.Group();
            const puffCount = 5 + Math.floor(Math.random() * 5);
            
            for (let j = 0; j < puffCount; j++) {
                const puffGeometry = new THREE.SphereGeometry(
                    2 + Math.random() * 2,
                    16,
                    16
                );
                
                const puffMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    roughness: 1,
                    metalness: 0,
                    transparent: true,
                    opacity: 0.9
                });
                
                const puff = new THREE.Mesh(puffGeometry, puffMaterial);
                
                // Position puffs to form cloud shape
                puff.position.set(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 4
                );
                
                cloudGroup.add(puff);
            }
            
            // Position cloud in sky
            cloudGroup.position.set(
                (Math.random() - 0.5) * 200,
                30 + Math.random() * 20,
                (Math.random() - 0.5) * 200
            );
            
            // Add movement data
            cloudGroup.userData = {
                speed: 0.1 + Math.random() * 0.2,
                originalX: cloudGroup.position.x,
                verticalOffset: Math.random() * Math.PI * 2 // Random starting phase for vertical movement
            };
            
            clouds.add(cloudGroup);
        }
        
        this.scene.add(clouds);
        
        // Animate clouds
        const animateClouds = () => {
            clouds.children.forEach(cloud => {
                // Horizontal movement
                cloud.position.x += cloud.userData.speed;
                
                // Reset cloud position when it moves too far
                if (cloud.position.x > 150) {
                    cloud.position.x = -150;
                }
                
                // Vertical movement - gentle floating
                cloud.userData.verticalOffset += 0.001;
                cloud.position.y += Math.sin(cloud.userData.verticalOffset) * 0.02;
            });
            
            requestAnimationFrame(animateClouds);
        };
        
        animateClouds();
        
        console.log('Sky and clouds created successfully');
    }
    
    /**
     * Create trees around the perimeter
     */
    addTrees() {
        const count = this.config.treesCount;
        const groundSize = this.config.groundSize;
        const perimeter = groundSize * 0.8; // Place trees near the edge
        
        console.log(`Creating ${count} trees on ground perimeter`);
        
        for (let i = 0; i < count; i++) {
            // Calculate position around the perimeter
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * perimeter;
            const z = Math.sin(angle) * perimeter;
            
            // Add some randomness to position while keeping trees grounded
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetZ = (Math.random() - 0.5) * 2;
            
            const tree = this.createTree();
            
            // CRITICAL: Ensure tree is positioned exactly at ground level (y=0)
            // This ensures the bottom of the trunk is at ground level
            tree.position.set(x + offsetX, 0, z + offsetZ);
            
            // Debug check to ensure bottom of tree is at ground level
            console.log(`Tree ${i+1} positioned at (${tree.position.x.toFixed(2)}, ${tree.position.y.toFixed(2)}, ${tree.position.z.toFixed(2)})`);
            
            // Random rotation and slightly varied scale
            tree.rotation.y = Math.random() * Math.PI * 2;
            const scale = 0.8 + Math.random() * 0.4;
            tree.scale.set(scale, scale, scale);
            
            this.scene.add(tree);
            this.elements.trees.push(tree);
        }
        
        console.log(`${count} trees created and properly grounded`);
        return this.elements.trees;
    }
    
    /**
     * Create a single tree
     */
    createTree() {
        const group = new THREE.Group();
        group.name = 'tree';
        
        // Create trunk starting from ground level
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        
        const trunkMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.bark?.color || this.textures.barkPlaceholder,
            normalMap: this.textures.bark?.normal,
            roughnessMap: this.textures.bark?.roughness,
            roughness: 0.9,
            metalness: 0.1,
            color: 0x8B4513
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        // Position trunk with bottom exactly at y=0 (ground level)
        // Trunk height is 2, so y=1 places the center at 1 and bottom at 0
        trunk.position.y = 1; 
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        group.add(trunk);
        
        // Create foliage (multiple cones stacked) positioned relative to trunk
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2E8B57,
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Bottom cone (largest)
        const foliage1 = new THREE.Mesh(
            new THREE.ConeGeometry(1.2, 1.5, 8),
            foliageMaterial
        );
        foliage1.position.y = 2.25; // Position relative to trunk top (trunk is 2 units tall)
        foliage1.castShadow = true;
        group.add(foliage1);
        
        // Middle cone
        const foliage2 = new THREE.Mesh(
            new THREE.ConeGeometry(0.9, 1.2, 8),
            foliageMaterial
        );
        foliage2.position.y = 3.1; // Position relative to trunk
        foliage2.castShadow = true;
        group.add(foliage2);
        
        // Top cone (smallest)
        const foliage3 = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 1, 8),
            foliageMaterial
        );
        foliage3.position.y = 3.9; // Position relative to trunk
        foliage3.castShadow = true;
        group.add(foliage3);
        
        return group;
    }
    
    /**
     * Create bushes scattered throughout the scene
     */
    addBushes() {
        const count = this.config.bushesCount;
        const groundSize = this.config.groundSize;
        const innerRadius = groundSize * 0.2; // Keep center clear
        const outerRadius = groundSize * 0.7; // Don't place at the very edge
        
        for (let i = 0; i < count; i++) {
            // Calculate random position within the allowed area
            const angle = Math.random() * Math.PI * 2;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const bush = this.createBush();
            bush.position.set(x, 0, z);
            
            // Random rotation and scale
            bush.rotation.y = Math.random() * Math.PI * 2;
            const scale = 0.6 + Math.random() * 0.4;
            bush.scale.set(scale, scale, scale);
            
            this.scene.add(bush);
            this.elements.bushes.push(bush);
        }
        
        console.log(`${count} bushes created`);
        return this.elements.bushes;
    }
    
    /**
     * Create a single bush
     */
    createBush() {
        const group = new THREE.Group();
        group.name = 'bush';
        
        // Create multiple overlapping spheres for a bush-like appearance
        const bushMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Main sphere
        const mainSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 8, 8),
            bushMaterial
        );
        mainSphere.position.y = 0.5;
        mainSphere.castShadow = true;
        mainSphere.receiveShadow = true;
        group.add(mainSphere);
        
        // Add smaller spheres around the main one
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const x = Math.cos(angle) * 0.3;
            const z = Math.sin(angle) * 0.3;
            
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 8, 8),
                bushMaterial
            );
            sphere.position.set(x, 0.5 + (Math.random() - 0.5) * 0.3, z);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            group.add(sphere);
        }
        
        return group;
    }
    
    /**
     * Create a stone pathway
     */
    createPathway() {
        const groundSize = this.config.groundSize;
        
        // Create a curved path
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-groundSize * 0.4, 0.01, groundSize * 0.3),
            new THREE.Vector3(0, 0.01, -groundSize * 0.1),
            new THREE.Vector3(groundSize * 0.4, 0.01, groundSize * 0.3)
        );
        
        // Create geometry from the curve
        const points = curve.getPoints(50);
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create a visible line for debugging
        const pathLine = new THREE.Line(
            pathGeometry,
            new THREE.LineBasicMaterial({ color: 0x000000 })
        );
        
        // Create the actual pathway (extruded shape)
        const pathShape = new THREE.Shape();
        pathShape.moveTo(-1, 0);
        pathShape.lineTo(1, 0);
        
        const extrudeSettings = {
            steps: 50,
            bevelEnabled: false,
            extrudePath: curve
        };
        
        const pathwayGeometry = new THREE.ExtrudeGeometry(pathShape, extrudeSettings);
        const pathwayMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.stone?.color || this.textures.stonePlaceholder,
            normalMap: this.textures.stone?.normal,
            roughnessMap: this.textures.stone?.roughness,
            roughness: 0.9,
            metalness: 0.1,
            color: 0x999999
        });
        
        const pathway = new THREE.Mesh(pathwayGeometry, pathwayMaterial);
        pathway.rotation.x = Math.PI / 2;
        pathway.receiveShadow = true;
        pathway.name = 'pathway';
        
        this.scene.add(pathway);
        this.elements.pathway = pathway;
        
        console.log('Pathway created');
        return pathway;
    }
    
    /**
     * Create benches along the pathway
     */
    addBenches() {
        if (!this.elements.pathway) {
            console.warn('Cannot create benches without a pathway');
            return [];
        }
        
        // Create 3 benches along the pathway
        const benchPositions = [
            { x: -this.config.groundSize * 0.3, z: this.config.groundSize * 0.25, rotation: Math.PI * 0.25 },
            { x: 0, z: -this.config.groundSize * 0.05, rotation: Math.PI * 1.5 },
            { x: this.config.groundSize * 0.3, z: this.config.groundSize * 0.25, rotation: -Math.PI * 0.25 }
        ];
        
        benchPositions.forEach((pos, index) => {
            const bench = this.createBench();
            bench.position.set(pos.x, 0, pos.z);
            bench.rotation.y = pos.rotation;
            
            this.scene.add(bench);
            this.elements.benches.push(bench);
        });
        
        console.log(`${benchPositions.length} benches created`);
        return this.elements.benches;
    }
    
    /**
     * Create a single bench
     */
    createBench() {
        const group = new THREE.Group();
        group.name = 'bench';
        
        // Create materials
        const woodMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.wood?.color || this.textures.woodPlaceholder,
            normalMap: this.textures.wood?.normal,
            roughnessMap: this.textures.wood?.roughness,
            roughness: 0.9,
            metalness: 0.1,
            color: 0xA0522D
        });
        
        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.5,
            metalness: 0.8
        });
        
        // Create seat
        const seatGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.5);
        const seat = new THREE.Mesh(seatGeometry, woodMaterial);
        seat.position.y = 0.5;
        seat.castShadow = true;
        seat.receiveShadow = true;
        group.add(seat);
        
        // Create backrest
        const backrestGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.1);
        const backrest = new THREE.Mesh(backrestGeometry, woodMaterial);
        backrest.position.set(0, 0.75, -0.2);
        backrest.castShadow = true;
        backrest.receiveShadow = true;
        group.add(backrest);
        
        // Create legs (4)
        const legGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        
        // Front legs
        const frontLeftLeg = new THREE.Mesh(legGeometry, metalMaterial);
        frontLeftLeg.position.set(0.6, 0.25, 0.15);
        frontLeftLeg.castShadow = true;
        frontLeftLeg.receiveShadow = true;
        group.add(frontLeftLeg);
        
        const frontRightLeg = new THREE.Mesh(legGeometry, metalMaterial);
        frontRightLeg.position.set(-0.6, 0.25, 0.15);
        frontRightLeg.castShadow = true;
        frontRightLeg.receiveShadow = true;
        group.add(frontRightLeg);
        
        // Back legs
        const backLeftLeg = new THREE.Mesh(legGeometry, metalMaterial);
        backLeftLeg.position.set(0.6, 0.25, -0.15);
        backLeftLeg.castShadow = true;
        backLeftLeg.receiveShadow = true;
        group.add(backLeftLeg);
        
        const backRightLeg = new THREE.Mesh(legGeometry, metalMaterial);
        backRightLeg.position.set(-0.6, 0.25, -0.15);
        backRightLeg.castShadow = true;
        backRightLeg.receiveShadow = true;
        group.add(backRightLeg);
        
        // Create backrest supports
        const supportGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        
        const leftSupport = new THREE.Mesh(supportGeometry, metalMaterial);
        leftSupport.position.set(0.6, 0.75, -0.15);
        leftSupport.castShadow = true;
        leftSupport.receiveShadow = true;
        group.add(leftSupport);
        
        const rightSupport = new THREE.Mesh(supportGeometry, metalMaterial);
        rightSupport.position.set(-0.6, 0.75, -0.15);
        rightSupport.castShadow = true;
        rightSupport.receiveShadow = true;
        group.add(rightSupport);
        
        return group;
    }
    
    /**
     * Add water plants like lilies and reeds to the pond
     * @param {THREE.Mesh} pond - The pond mesh
     * @param {number} pondRadius - The radius of the pond
     */
    addWaterPlants(pond, pondRadius) {
        // Add water lilies
        const lilyCount = 5;
        const lilyPadGeometry = new THREE.CircleGeometry(0.3, 8);
        const lilyPadMaterial = new THREE.MeshStandardMaterial({
            color: 0x2D5F3E,
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < lilyCount; i++) {
            // Create lily pad
            const lilyPad = new THREE.Mesh(lilyPadGeometry, lilyPadMaterial);
            
            // Position randomly within the pond
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * (pondRadius * 0.7);
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance - 1; // Adjust for pond position
            
            lilyPad.position.set(x, 0.07, z); // Slightly above water
            lilyPad.rotation.x = -Math.PI / 2;
            lilyPad.rotation.z = Math.random() * Math.PI * 2;
            
            // Add some variation to the shape
            lilyPad.scale.x = 0.8 + Math.random() * 0.4;
            lilyPad.scale.z = 0.8 + Math.random() * 0.4;
            
            this.scene.add(lilyPad);
            
            // Add lily flower to some pads
            if (Math.random() > 0.5) {
                const flowerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const flowerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    roughness: 0.5,
                    metalness: 0.1
                });
                
                const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
                flower.position.set(x, 0.12, z);
                flower.scale.y = 0.5; // Flatten slightly
                
                // Add yellow center
                const centerGeometry = new THREE.SphereGeometry(0.04, 8, 8);
                const centerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFF00,
                    roughness: 0.5,
                    metalness: 0.1
                });
                
                const center = new THREE.Mesh(centerGeometry, centerMaterial);
                center.position.y = 0.05;
                flower.add(center);
                
                this.scene.add(flower);
            }
        }
        
        // Add reeds around the edge
        const reedCount = 12;
        const reedMaterial = new THREE.MeshStandardMaterial({
            color: 0x567D46,
            roughness: 0.8,
            metalness: 0.1
        });
        
        for (let i = 0; i < reedCount; i++) {
            // Create a group for each reed cluster
            const reedGroup = new THREE.Group();
            
            // Position around the pond edge
            const angle = (i / reedCount) * Math.PI * 2;
            const distance = pondRadius * (0.9 + Math.random() * 0.2);
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance - 1; // Adjust for pond position
            
            reedGroup.position.set(x, 0, z);
            
            // Add 2-4 reeds per cluster
            const reedsPerCluster = 2 + Math.floor(Math.random() * 3);
            
            for (let j = 0; j < reedsPerCluster; j++) {
                const height = 0.5 + Math.random() * 0.5;
                const reedGeometry = new THREE.CylinderGeometry(0.01, 0.005, height, 4);
                
                const reed = new THREE.Mesh(reedGeometry, reedMaterial);
                
                // Position within the cluster
                const clusterRadius = 0.1;
                const clusterAngle = Math.random() * Math.PI * 2;
                const offsetX = Math.cos(clusterAngle) * clusterRadius * Math.random();
                const offsetZ = Math.sin(clusterAngle) * clusterRadius * Math.random();
                
                reed.position.set(offsetX, height / 2, offsetZ);
                
                // Random slight tilt
                reed.rotation.x = (Math.random() - 0.5) * 0.2;
                reed.rotation.z = (Math.random() - 0.5) * 0.2;
                
                reedGroup.add(reed);
            }
            
            this.scene.add(reedGroup);
        }
    }
    
    /**
     * Add subtle water ripple effect to the pond
     * @param {THREE.Mesh} pond - The pond mesh
     */
    addWaterRipples(pond) {
        // Create ripple texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create ripple animation
        const rippleTexture = new THREE.CanvasTexture(canvas);
        rippleTexture.wrapS = THREE.RepeatWrapping;
        rippleTexture.wrapT = THREE.RepeatWrapping;
        
        // Apply to pond material
        pond.material.normalMap = rippleTexture;
        pond.material.normalScale = new THREE.Vector2(0.1, 0.1);
        
        // Animate ripples
        const animateRipples = () => {
            const time = Date.now() * 0.001;
            
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw ripples
            for (let i = 0; i < 5; i++) {
                const x = canvas.width / 2 + Math.cos(time * 0.5 + i) * canvas.width * 0.3;
                const y = canvas.height / 2 + Math.sin(time * 0.7 + i) * canvas.height * 0.3;
                const radius = (50 + Math.sin(time * 2 + i) * 20) * (1 + i * 0.5);
                const lineWidth = 5 + Math.sin(time + i) * 2;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }
            
            // Update texture
            rippleTexture.needsUpdate = true;
            
            // Continue animation
            requestAnimationFrame(animateRipples);
        };
        
        animateRipples();
    }
    
    /**
     * Add ambient water sound to the pond
     * @param {THREE.Mesh} pond - The pond mesh
     */
    addWaterSound(pond) {
        // Check if Audio API is available
        if (typeof Audio === 'undefined') {
            console.warn('Audio API not available, skipping water sound');
            return;
        }
        
        try {
            // Create audio element
            const waterSound = new Audio('sounds/water_ambient.mp3');
            
            // Handle missing sound file
            waterSound.onerror = () => {
                console.warn('Water sound file not found, creating placeholder silence');
                // Create a silent audio context as a placeholder
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const silentOscillator = audioContext.createOscillator();
                silentOscillator.frequency.value = 0; // Silent
                silentOscillator.connect(audioContext.destination);
                // Don't actually start it to keep it silent
            };
            
            // Set properties
            waterSound.loop = true;
            waterSound.volume = 0.2;
            
            // Play sound (will be triggered by user interaction)
            document.addEventListener('click', () => {
                waterSound.play().catch(error => {
                    console.warn('Could not play water sound:', error);
                });
            }, { once: true });
            
            // Store reference
            this.elements.waterSound = waterSound;
            
            console.log('Water sound added');
        } catch (error) {
            console.warn('Error adding water sound:', error);
        }
    }
    
    /**
     * Add ambient sounds to the scene
     */
    addAmbientSounds() {
        try {
            console.log('Adding ambient sounds to park scene');
            
            // Create an audio listener
            const listener = new THREE.AudioListener();
            this.camera.add(listener);
            
            // Create water sound
            this.createWaterSound(listener);
            
            // Create bird sounds
            this.createBirdSounds(listener);
            
            console.log('Ambient sounds added successfully');
        } catch (error) {
            console.error('Error adding ambient sounds:', error);
        }
    }
    
    /**
     * Create water ambient sound
     * @param {THREE.AudioListener} listener - The audio listener
     */
    createWaterSound(listener) {
        try {
            // Create a positional audio source for water
            const waterSound = new THREE.PositionalAudio(listener);
            
            // Load water sound
            const audioLoader = new THREE.AudioLoader();
            
            // Check if the file exists first
            this.checkFileExists('/sounds/water_ambient.mp3')
                .then(exists => {
                    if (exists) {
                        // Load the actual file
                        audioLoader.load('/sounds/water_ambient.mp3', buffer => {
                            waterSound.setBuffer(buffer);
                            waterSound.setRefDistance(5);
                            waterSound.setLoop(true);
                            waterSound.setVolume(0.5);
                            waterSound.play();
                            
                            // Add sound to pond
                            const pond = this.scene.getObjectByName('pond');
                            if (pond) {
                                pond.add(waterSound);
                                console.log('Water ambient sound added to pond');
                            }
                        });
                    } else {
                        // Create a fallback sound using Web Audio API
                        console.log('Water sound file not found, creating fallback sound');
                        this.createFallbackWaterSound(listener);
                    }
                })
                .catch(error => {
                    console.error('Error checking for sound file:', error);
                    // Create fallback sound on error
                    this.createFallbackWaterSound(listener);
                });
        } catch (error) {
            console.error('Error creating water sound:', error);
        }
    }
    
    /**
     * Create bird ambient sounds
     * @param {THREE.AudioListener} listener - The audio listener
     */
    createBirdSounds(listener) {
        try {
            // Create a positional audio source for birds
            const birdSound = new THREE.PositionalAudio(listener);
            
            // Create a fallback bird sound using Web Audio API
            const audioContext = listener.context;
            
            // Create oscillators for bird chirps
            const createBirdChirp = () => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                // Random frequency for variety
                const baseFreq = 2000 + Math.random() * 1000;
                oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(
                    baseFreq * 1.5, 
                    audioContext.currentTime + 0.1
                );
                
                // Short duration
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
                
                oscillator.connect(gainNode);
                gainNode.connect(birdSound.gain);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            };
            
            // Schedule random bird chirps
            const scheduleBirdSounds = () => {
                createBirdChirp();
                
                // Schedule next chirp
                setTimeout(() => {
                    scheduleBirdSounds();
                }, 2000 + Math.random() * 5000);
            };
            
            // Start bird sounds
            scheduleBirdSounds();
            
            // Add sound to a tree
            const trees = [];
            this.scene.traverse(object => {
                if (object.name && object.name.includes('tree')) {
                    trees.push(object);
                }
            });
            
            if (trees.length > 0) {
                // Pick a random tree
                const randomTree = trees[Math.floor(Math.random() * trees.length)];
                randomTree.add(birdSound);
                console.log('Bird ambient sounds added to tree');
            }
        } catch (error) {
            console.error('Error creating bird sounds:', error);
        }
    }
    
    /**
     * Create a fallback water sound using Web Audio API
     * @param {THREE.AudioListener} listener - The audio listener
     */
    createFallbackWaterSound(listener) {
        try {
            // Create a positional audio source
            const waterSound = new THREE.PositionalAudio(listener);
            
            // Get audio context
            const audioContext = listener.context;
            
            // Create noise for water sound
            const bufferSize = 2 * audioContext.sampleRate;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            
            // Fill buffer with noise
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            // Create noise source
            const whiteNoise = audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            
            // Create filter for water-like sound
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            filter.Q.value = 0.9;
            
            // Create gain node for volume control
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0.05;
            
            // Connect nodes
            whiteNoise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(waterSound.gain);
            
            // Start noise
            whiteNoise.start();
            
            // Add sound to pond
            const pond = this.scene.getObjectByName('pond');
            if (pond) {
                pond.add(waterSound);
                console.log('Fallback water sound added to pond');
            }
        } catch (error) {
            console.error('Error creating fallback water sound:', error);
        }
    }
    
    /**
     * Check if a file exists
     * @param {string} url - The URL to check
     * @returns {Promise<boolean>} - Promise resolving to true if file exists
     */
    checkFileExists(url) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    resolve(xhr.status === 200);
                }
            };
            xhr.send();
        });
    }
}

// Make it available globally
window.ParkSceneCreator = ParkSceneCreator; 