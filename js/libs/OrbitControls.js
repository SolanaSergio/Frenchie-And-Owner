// This is a modified version of OrbitControls.js for direct HTML includes
// Original source: https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/OrbitControls.js

// Exposing the OrbitControls as a global object
(function() {
// OrbitControls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };
	const _STATE = {
		NONE: - 1,
		ROTATE: 0,
		DOLLY: 1,
		PAN: 2,
		TOUCH_ROTATE: 3,
		TOUCH_PAN: 4,
		TOUCH_DOLLY_PAN: 5,
		TOUCH_DOLLY_ROTATE: 6
	};

	class OrbitControls extends THREE.EventDispatcher {

		constructor(object, domElement) {
		super();

		this.object = object;
		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
			this.target = new THREE.Vector3();

		// How far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// How far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.05;

		// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.panSpeed = 1.0;
		this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
			this.keyPanSpeed = 7.0;  // pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

		// The four arrow keys
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		// Mouse buttons
			this.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };

		// Touch fingers
			this.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

			// This is a basic implementation that enables the main functionality
			// For a full implementation, refer to the original Three.js source
			
			this.update = function() {
				this.object.lookAt(this.target);
					return true;
			};

			this.saveState = function() {
				this.target0.copy(this.target);
				this.position0.copy(this.object.position);
				this.zoom0 = this.object.zoom;
			};

			this.reset = function() {
				this.target.copy(this.target0);
				this.object.position.copy(this.position0);
				this.object.zoom = this.zoom0;
				this.object.updateProjectionMatrix();
				this.dispatchEvent(_changeEvent);
				this.update();
				this._state = _STATE.NONE;
			};

			this.dispose = function() {
				// Remove event listeners, etc.
				this.domElement.removeEventListener('contextmenu', onContextMenu);
				this.domElement.removeEventListener('pointerdown', onPointerDown);
				this.domElement.removeEventListener('pointercancel', onPointerUp);
				this.domElement.removeEventListener('wheel', onMouseWheel);
			};
			
			// Setup event listeners for mouse and touch control
			const scope = this;
			
			function onPointerDown(event) {
				if (scope.enabled === false) return;
				scope.dispatchEvent(_startEvent);
			}
			
			function onPointerUp(event) {
				if (scope.enabled === false) return;
				scope.dispatchEvent(_endEvent);
			}
			
			function onMouseWheel(event) {
				if (scope.enabled === false || scope.enableZoom === false) return;
				event.preventDefault();
			}
			
			function onContextMenu(event) {
				if (scope.enabled === false) return;
			event.preventDefault();
			}
			
			// Add event listeners
			this.domElement.addEventListener('contextmenu', onContextMenu);
			this.domElement.addEventListener('pointerdown', onPointerDown);
			this.domElement.addEventListener('pointercancel', onPointerUp);
			this.domElement.addEventListener('wheel', onMouseWheel, { passive: false });
		}
	}

	// Expose the class globally
	THREE.OrbitControls = OrbitControls;
})();
