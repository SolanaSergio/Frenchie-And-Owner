/**
 * Debug utility for diagnosing THREE.js rendering issues
 * Add this script to your page to get a detailed diagnosis
 */
(function() {
    // Wait for DOMContentLoaded
    if (document.readyState !== 'loading') {
        initDebug();
    } else {
        document.addEventListener('DOMContentLoaded', initDebug);
    }
    
    // Store logs
    const logs = [];
    
    function initDebug() {
        console.log('Debug utility loaded');
        
        // Create debug panel
        const debugPanel = document.createElement('div');
        debugPanel.style.position = 'fixed';
        debugPanel.style.bottom = '10px';
        debugPanel.style.right = '10px';
        debugPanel.style.width = '400px';
        debugPanel.style.maxHeight = '300px';
        debugPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        debugPanel.style.color = 'white';
        debugPanel.style.padding = '10px';
        debugPanel.style.fontFamily = 'monospace';
        debugPanel.style.fontSize = '12px';
        debugPanel.style.overflow = 'auto';
        debugPanel.style.zIndex = '10000';
        debugPanel.style.border = '1px solid #555';
        debugPanel.style.borderRadius = '5px';
        
        // Add header
        const header = document.createElement('div');
        header.textContent = 'THREE.js Diagnostic Tool';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '14px';
        header.style.marginBottom = '10px';
        header.style.borderBottom = '1px solid #555';
        header.style.paddingBottom = '5px';
        debugPanel.appendChild(header);
        
        // Add info container
        const infoContainer = document.createElement('div');
        infoContainer.id = 'debug-info';
        debugPanel.appendChild(infoContainer);
        
        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        debugPanel.appendChild(buttonContainer);
        
        // Add action buttons
        const checkButton = createButton('Run Diagnostics');
        checkButton.onclick = runDiagnostics;
        buttonContainer.appendChild(checkButton);
        
        const fixButton = createButton('Apply Fixes');
        fixButton.onclick = applyFixes;
        buttonContainer.appendChild(fixButton);
        
        const traceButton = createButton('Trace Render Call');
        traceButton.onclick = traceRenderingProcess;
        buttonContainer.appendChild(traceButton);
        
        const downloadButton = createButton('Download Logs');
        downloadButton.onclick = downloadLogs;
        buttonContainer.appendChild(downloadButton);
        
        const hideButton = createButton('Hide Panel');
        hideButton.onclick = () => { debugPanel.style.display = 'none'; };
        buttonContainer.appendChild(hideButton);
        
        document.body.appendChild(debugPanel);
        
        // Create logger
        window.logger = {
            log: function(message, type = 'info') {
                const timestamp = new Date().toISOString();
                const formattedMsg = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
                logs.push(formattedMsg);
                
                // Also log to console
                if (type === 'error') {
                    console.error(message);
                } else if (type === 'warning') {
                    console.warn(message);
                } else {
                    console.log(message);
                }
                
                return formattedMsg;
            },
            
            error: function(message) {
                return this.log(message, 'error');
            },
            
            warn: function(message) {
                return this.log(message, 'warning');
            },
            
            success: function(message) {
                return this.log(message, 'success');
            }
        };
        
        // Run initial diagnostics
        setTimeout(runDiagnostics, 1000);
        
        // Auto-hide loading screen after timeout
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                loadingScreen.style.display = 'none';
                window.logger.warn('Loading screen automatically hidden after timeout');
            }
        }, 5000);
    }
    
    function createButton(text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.margin = '5px';
        button.style.padding = '5px 10px';
        button.style.background = '#4c84af';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        return button;
    }
    
    function runDiagnostics() {
        const infoContainer = document.getElementById('debug-info');
        infoContainer.innerHTML = '';
        
        addInfo(infoContainer, 'Running diagnostics...');
        window.logger.log('Running diagnostics...');
        
        // Force hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            window.logger.log('Loading screen hidden for diagnostics');
        }
        
        // Check if THREE.js is loaded
        const threeLoaded = typeof THREE !== 'undefined';
        addInfo(infoContainer, `THREE.js loaded: ${threeLoaded}`, threeLoaded ? 'green' : 'red');
        window.logger.log(`THREE.js loaded: ${threeLoaded}`, threeLoaded ? 'success' : 'error');
        
        if (!threeLoaded) {
            addInfo(infoContainer, 'THREE.js library not found. Check script includes.', 'red');
            window.logger.error('THREE.js library not found. Check script includes.');
            return;
        }
        
        // Check THREE.js version
        addInfo(infoContainer, `THREE.js version: ${THREE.REVISION || 'unknown'}`);
        window.logger.log(`THREE.js version: ${THREE.REVISION || 'unknown'}`);
        
        // Check if canvas is in DOM
        const canvases = document.querySelectorAll('canvas');
        addInfo(infoContainer, `Canvas elements found: ${canvases.length}`, canvases.length > 0 ? 'green' : 'red');
        window.logger.log(`Canvas elements found: ${canvases.length}`, canvases.length > 0 ? 'success' : 'error');
        
        if (canvases.length === 0) {
            addInfo(infoContainer, 'No canvas elements found in DOM. WebGL renderer may not be initialized.', 'red');
            window.logger.error('No canvas elements found in DOM. WebGL renderer may not be initialized.');
            
            // Check container
            const container = document.getElementById('container');
            if (container) {
                addInfo(infoContainer, 'Container found but has no canvas children', 'orange');
                window.logger.warn('Container found but has no canvas children');
            } else {
                addInfo(infoContainer, 'Container element not found in DOM', 'red');
                window.logger.error('Container element not found in DOM');
            }
        } else {
            // Check canvas visibility
            for (let i = 0; i < canvases.length; i++) {
                const canvas = canvases[i];
                const style = window.getComputedStyle(canvas);
                const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
                
                addInfo(infoContainer, `Canvas ${i+1} visible: ${isVisible}`, isVisible ? 'green' : 'red');
                window.logger.log(`Canvas ${i+1} visible: ${isVisible}`, isVisible ? 'success' : 'error');
                
                if (!isVisible) {
                    addInfo(infoContainer, `Canvas ${i+1} style: display=${style.display}, visibility=${style.visibility}, opacity=${style.opacity}`, 'orange');
                    window.logger.warn(`Canvas ${i+1} style: display=${style.display}, visibility=${style.visibility}, opacity=${style.opacity}`);
                }
                
                // Check canvas size
                addInfo(infoContainer, `Canvas ${i+1} size: ${canvas.width} x ${canvas.height}`);
                window.logger.log(`Canvas ${i+1} size: ${canvas.width} x ${canvas.height}`);
                
                if (canvas.width === 0 || canvas.height === 0) {
                    addInfo(infoContainer, `Canvas ${i+1} has zero dimension`, 'red');
                    window.logger.error(`Canvas ${i+1} has zero dimension`);
                }
                
                // Check if canvas is attached to DOM
                const isAttached = document.body.contains(canvas);
                addInfo(infoContainer, `Canvas ${i+1} attached to DOM: ${isAttached}`, isAttached ? 'green' : 'red');
                window.logger.log(`Canvas ${i+1} attached to DOM: ${isAttached}`, isAttached ? 'success' : 'error');
                
                // Check z-index and positioning
                addInfo(infoContainer, `Canvas ${i+1} z-index: ${style.zIndex}, position: ${style.position}`);
                window.logger.log(`Canvas ${i+1} z-index: ${style.zIndex}, position: ${style.position}`);
                
                // Check if canvas parent is visible
                const parent = canvas.parentElement;
                if (parent) {
                    const parentStyle = window.getComputedStyle(parent);
                    const isParentVisible = parentStyle.display !== 'none' && parentStyle.visibility !== 'hidden' && parseFloat(parentStyle.opacity) > 0;
                    
                    addInfo(infoContainer, `Canvas ${i+1} parent visible: ${isParentVisible}`, isParentVisible ? 'green' : 'red');
                    window.logger.log(`Canvas ${i+1} parent visible: ${isParentVisible}`, isParentVisible ? 'success' : 'error');
                    
                    if (!isParentVisible) {
                        addInfo(infoContainer, `Canvas ${i+1} parent style: display=${parentStyle.display}, visibility=${parentStyle.visibility}, opacity=${parentStyle.opacity}`, 'orange');
                        window.logger.warn(`Canvas ${i+1} parent style: display=${parentStyle.display}, visibility=${parentStyle.visibility}, opacity=${parentStyle.opacity}`);
                    }
                }
            }
        }
        
        // Check for WebGL support
        let webglSupported = false;
        try {
            const canvas = document.createElement('canvas');
            webglSupported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            webglSupported = false;
        }
        addInfo(infoContainer, `WebGL supported: ${webglSupported}`, webglSupported ? 'green' : 'red');
        window.logger.log(`WebGL supported: ${webglSupported}`, webglSupported ? 'success' : 'error');
        
        // Check for THREE.js scene, camera, renderer in global scope
        if (window.scene) {
            addInfo(infoContainer, 'Scene found in global scope', 'green');
            window.logger.success('Scene found in global scope');
            
            // Check scene children
            addInfo(infoContainer, `Scene children count: ${window.scene.children.length}`);
            window.logger.log(`Scene children count: ${window.scene.children.length}`);
            
            // Log types of children
            const childTypes = {};
            window.scene.traverse(obj => {
                const type = obj.type || 'Unknown';
                childTypes[type] = (childTypes[type] || 0) + 1;
            });
            
            for (const type in childTypes) {
                addInfo(infoContainer, `- ${type}: ${childTypes[type]}`);
                window.logger.log(`- ${type}: ${childTypes[type]}`);
            }
            
            // Check background
            addInfo(infoContainer, `Scene background: ${window.scene.background ? 'Set' : 'Not set'}`);
            window.logger.log(`Scene background: ${window.scene.background ? 'Set' : 'Not set'}`);
        } else {
            addInfo(infoContainer, 'Scene not found in global scope', 'red');
            window.logger.error('Scene not found in global scope');
        }
        
        if (window.camera) {
            addInfo(infoContainer, 'Camera found in global scope', 'green');
            window.logger.success('Camera found in global scope');
            
            addInfo(infoContainer, `Camera position: (${window.camera.position.x.toFixed(2)}, ${window.camera.position.y.toFixed(2)}, ${window.camera.position.z.toFixed(2)})`);
            window.logger.log(`Camera position: (${window.camera.position.x.toFixed(2)}, ${window.camera.position.y.toFixed(2)}, ${window.camera.position.z.toFixed(2)})`);
        } else {
            addInfo(infoContainer, 'Camera not found in global scope', 'red');
            window.logger.error('Camera not found in global scope');
        }
        
        if (window.renderer) {
            addInfo(infoContainer, 'Renderer found in global scope', 'green');
            window.logger.success('Renderer found in global scope');
            
            addInfo(infoContainer, `Shadows enabled: ${window.renderer.shadowMap ? window.renderer.shadowMap.enabled : 'unknown'}`);
            window.logger.log(`Shadows enabled: ${window.renderer.shadowMap ? window.renderer.shadowMap.enabled : 'unknown'}`);
            
            // Check if renderer has a domElement
            if (window.renderer.domElement) {
                addInfo(infoContainer, 'Renderer has domElement', 'green');
                window.logger.success('Renderer has domElement');
                
                // Check if domElement is attached to DOM
                const isAttached = document.body.contains(window.renderer.domElement);
                addInfo(infoContainer, `Renderer domElement attached to DOM: ${isAttached}`, isAttached ? 'green' : 'red');
                window.logger.log(`Renderer domElement attached to DOM: ${isAttached}`, isAttached ? 'success' : 'error');
            } else {
                addInfo(infoContainer, 'Renderer domElement is missing', 'red');
                window.logger.error('Renderer domElement is missing');
            }
        } else {
            addInfo(infoContainer, 'Renderer not found in global scope', 'red');
            window.logger.error('Renderer not found in global scope');
        }
        
        // Check for animation function
        if (typeof window.animate === 'function') {
            addInfo(infoContainer, 'Global animate function found', 'green');
            window.logger.success('Global animate function found');
        } else {
            addInfo(infoContainer, 'No global animate function found', 'orange');
            window.logger.warn('No global animate function found');
        }
        
        addInfo(infoContainer, 'Diagnostics complete');
        window.logger.success('Diagnostics complete');
    }
    
    function applyFixes() {
        const infoContainer = document.getElementById('debug-info');
        infoContainer.innerHTML = '';
        addInfo(infoContainer, 'Applying fixes...');
        window.logger.log('Applying fixes...');
        
        // Force hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            addInfo(infoContainer, 'Loading screen hidden', 'green');
            window.logger.success('Loading screen hidden');
        }
        
        // Find container element
        let container = document.getElementById('container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'container';
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            document.body.appendChild(container);
            
            addInfo(infoContainer, 'Container created and added to DOM', 'green');
            window.logger.success('Container created and added to DOM');
        } else {
            // Make sure container is visible
            container.style.display = 'block';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            container.style.zIndex = '0';
            
            addInfo(infoContainer, 'Container visibility ensured', 'green');
            window.logger.success('Container visibility ensured');
        }
        
        // Create a test scene with direct DOM manipulation
        const testCanvas = document.createElement('canvas');
        testCanvas.width = window.innerWidth;
        testCanvas.height = window.innerHeight;
        testCanvas.style.position = 'absolute';
        testCanvas.style.top = '0';
        testCanvas.style.left = '0';
        testCanvas.style.zIndex = '1';
        container.appendChild(testCanvas);
        
        try {
            // Create minimal Three.js scene
            const renderer = new THREE.WebGLRenderer({ canvas: testCanvas, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            window.debugRenderer = renderer;
            
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            window.debugScene = scene;
            
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 1, 3);
            window.debugCamera = camera;
            
            // Add ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            // Add directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 2, 3);
            scene.add(directionalLight);
            
            // Add a ground plane
            const groundGeometry = new THREE.PlaneGeometry(10, 10);
            const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x91e396 });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.01;
            scene.add(ground);
            
            // Add a cube
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            
            // Add a sphere
            const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.x = 2;
            scene.add(sphere);
            
            // Add a cylinder
            const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            cylinder.position.x = -2;
            scene.add(cylinder);
            
            // Animation function
            function animate() {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                
                sphere.rotation.y += 0.02;
                
                cylinder.rotation.z += 0.01;
                
                renderer.render(scene, camera);
                window.testAnimationId = requestAnimationFrame(animate);
            }
            
            // Start animation
            animate();
            
            // Expose variables to window for debugging
            window.debugCube = cube;
            window.debugSphere = sphere;
            window.debugCylinder = cylinder;
            
            addInfo(infoContainer, 'Successfully created test scene with 3D objects', 'green');
            window.logger.success('Successfully created test scene with 3D objects');
            addInfo(infoContainer, 'If you can see the shapes, THREE.js is working correctly.');
            window.logger.log('If you can see the shapes, THREE.js is working correctly.');
            
            // Add button to remove test scene
            const removeButton = createButton('Remove Test Scene');
            removeButton.onclick = () => {
                if (window.testAnimationId) {
                    cancelAnimationFrame(window.testAnimationId);
                }
                if (testCanvas && testCanvas.parentNode) {
                    testCanvas.parentNode.removeChild(testCanvas);
                }
                addInfo(infoContainer, 'Test scene removed', 'orange');
                window.logger.warn('Test scene removed');
            };
            infoContainer.appendChild(removeButton);
        } catch (e) {
            addInfo(infoContainer, `Error creating test scene: ${e.message}`, 'red');
            window.logger.error(`Error creating test scene: ${e.message}`);
            console.error(e);
        }
    }
    
    function traceRenderingProcess() {
        const infoContainer = document.getElementById('debug-info');
        infoContainer.innerHTML = '';
        addInfo(infoContainer, 'Tracing rendering process...');
        window.logger.log('Tracing rendering process...');
        
        // Check if we have the core THREE.js objects in global scope
        if (!window.scene || !window.camera || !window.renderer) {
            addInfo(infoContainer, 'Cannot trace rendering: missing scene, camera, or renderer', 'red');
            window.logger.error('Cannot trace rendering: missing scene, camera, or renderer');
            return;
        }
        
        try {
            // Monitor the renderer's render method
            const originalRender = window.renderer.render;
            window.renderer.render = function(scene, camera) {
                window.logger.log('Render called with scene and camera');
                addInfo(infoContainer, 'Render method called!', 'green');
                
                // Check the scene and camera
                if (!scene) {
                    window.logger.error('Scene is null or undefined in render call');
                    addInfo(infoContainer, 'Scene is null in render call', 'red');
                }
                
                if (!camera) {
                    window.logger.error('Camera is null or undefined in render call');
                    addInfo(infoContainer, 'Camera is null in render call', 'red');
                }
                
                // Check if scene has objects
                if (scene && scene.children && scene.children.length === 0) {
                    window.logger.warn('Scene has no children');
                    addInfo(infoContainer, 'Scene has no objects to render', 'orange');
                }
                
                // Apply the original render method
                return originalRender.apply(this, arguments);
            };
            
            // Make sure the animation function is called
            if (typeof window.animate === 'function') {
                window.animate();
                window.logger.log('Called animate() function');
                addInfo(infoContainer, 'Called animate() function', 'green');
            } else {
                window.logger.warn('No animate function found to call');
                addInfo(infoContainer, 'No animate function found to call', 'orange');
            }
            
            // Restore the original render method after a short time
            setTimeout(() => {
                window.renderer.render = originalRender;
                window.logger.log('Restored original render method');
                addInfo(infoContainer, 'Trace complete. Restored original render method.', 'green');
            }, 5000);
            
        } catch (e) {
            window.logger.error(`Error tracing rendering: ${e.message}`);
            addInfo(infoContainer, `Error tracing rendering: ${e.message}`, 'red');
            console.error(e);
        }
    }
    
    function downloadLogs() {
        const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `three-js-debug-${new Date().toISOString().replace(/:/g, '-')}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const infoContainer = document.getElementById('debug-info');
        addInfo(infoContainer, 'Debug logs downloaded', 'green');
    }
    
    function addInfo(container, text, color) {
        const info = document.createElement('div');
        info.textContent = text;
        info.style.marginBottom = '5px';
        
        if (color) {
            if (color === 'red') {
                info.style.color = '#ff5555';
            } else if (color === 'green') {
                info.style.color = '#55ff55';
            } else if (color === 'orange') {
                info.style.color = '#ffaa55';
            }
        }
        
        container.appendChild(info);
    }
})(); 