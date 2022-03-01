/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/three/examples/jsm/controls/OrbitControls.js":
/*!*******************************************************************!*\
  !*** ./node_modules/three/examples/jsm/controls/OrbitControls.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OrbitControls": () => (/* binding */ OrbitControls),
/* harmony export */   "MapControls": () => (/* binding */ MapControls)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");


// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class OrbitControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {

	constructor( object, domElement ) {

		super();

		if ( domElement === undefined ) console.warn( 'THREE.OrbitControls: The second parameter "domElement" is now mandatory.' );
		if ( domElement === document ) console.error( 'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

		this.object = object;
		this.domElement = domElement;
		this.domElement.style.touchAction = 'none'; // disable touch scroll

		// Set to false to disable this control
		this.enabled = true;

		// "target" sets the location of focus, where the object orbits around
		this.target = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();

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
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per orbit when fps is 60

		// The four arrow keys
		this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

		// Mouse buttons
		this.mouseButtons = { LEFT: three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.ROTATE, MIDDLE: three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.DOLLY, RIGHT: three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.PAN };

		// Touch fingers
		this.touches = { ONE: three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.ROTATE, TWO: three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.DOLLY_PAN };

		// for reset
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		// the target DOM element for key events
		this._domElementKeyEvents = null;

		//
		// public methods
		//

		this.getPolarAngle = function () {

			return spherical.phi;

		};

		this.getAzimuthalAngle = function () {

			return spherical.theta;

		};

		this.getDistance = function () {

			return this.object.position.distanceTo( this.target );

		};

		this.listenToKeyEvents = function ( domElement ) {

			domElement.addEventListener( 'keydown', onKeyDown );
			this._domElementKeyEvents = domElement;

		};

		this.saveState = function () {

			scope.target0.copy( scope.target );
			scope.position0.copy( scope.object.position );
			scope.zoom0 = scope.object.zoom;

		};

		this.reset = function () {

			scope.target.copy( scope.target0 );
			scope.object.position.copy( scope.position0 );
			scope.object.zoom = scope.zoom0;

			scope.object.updateProjectionMatrix();
			scope.dispatchEvent( _changeEvent );

			scope.update();

			state = STATE.NONE;

		};

		// this method is exposed, but perhaps it would be better if we can make it private...
		this.update = function () {

			const offset = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();

			// so camera.up is the orbit axis
			const quat = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion().setFromUnitVectors( object.up, new three__WEBPACK_IMPORTED_MODULE_0__.Vector3( 0, 1, 0 ) );
			const quatInverse = quat.clone().invert();

			const lastPosition = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();
			const lastQuaternion = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

			const twoPI = 2 * Math.PI;

			return function update() {

				const position = scope.object.position;

				offset.copy( position ).sub( scope.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis
				spherical.setFromVector3( offset );

				if ( scope.autoRotate && state === STATE.NONE ) {

					rotateLeft( getAutoRotationAngle() );

				}

				if ( scope.enableDamping ) {

					spherical.theta += sphericalDelta.theta * scope.dampingFactor;
					spherical.phi += sphericalDelta.phi * scope.dampingFactor;

				} else {

					spherical.theta += sphericalDelta.theta;
					spherical.phi += sphericalDelta.phi;

				}

				// restrict theta to be between desired limits

				let min = scope.minAzimuthAngle;
				let max = scope.maxAzimuthAngle;

				if ( isFinite( min ) && isFinite( max ) ) {

					if ( min < - Math.PI ) min += twoPI; else if ( min > Math.PI ) min -= twoPI;

					if ( max < - Math.PI ) max += twoPI; else if ( max > Math.PI ) max -= twoPI;

					if ( min <= max ) {

						spherical.theta = Math.max( min, Math.min( max, spherical.theta ) );

					} else {

						spherical.theta = ( spherical.theta > ( min + max ) / 2 ) ?
							Math.max( min, spherical.theta ) :
							Math.min( max, spherical.theta );

					}

				}

				// restrict phi to be between desired limits
				spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

				spherical.makeSafe();


				spherical.radius *= scale;

				// restrict radius to be between desired limits
				spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

				// move target to panned location

				if ( scope.enableDamping === true ) {

					scope.target.addScaledVector( panOffset, scope.dampingFactor );

				} else {

					scope.target.add( panOffset );

				}

				offset.setFromSpherical( spherical );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( scope.target ).add( offset );

				scope.object.lookAt( scope.target );

				if ( scope.enableDamping === true ) {

					sphericalDelta.theta *= ( 1 - scope.dampingFactor );
					sphericalDelta.phi *= ( 1 - scope.dampingFactor );

					panOffset.multiplyScalar( 1 - scope.dampingFactor );

				} else {

					sphericalDelta.set( 0, 0, 0 );

					panOffset.set( 0, 0, 0 );

				}

				scale = 1;

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					lastPosition.distanceToSquared( scope.object.position ) > EPS ||
					8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

					scope.dispatchEvent( _changeEvent );

					lastPosition.copy( scope.object.position );
					lastQuaternion.copy( scope.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

		this.dispose = function () {

			scope.domElement.removeEventListener( 'contextmenu', onContextMenu );

			scope.domElement.removeEventListener( 'pointerdown', onPointerDown );
			scope.domElement.removeEventListener( 'pointercancel', onPointerCancel );
			scope.domElement.removeEventListener( 'wheel', onMouseWheel );

			scope.domElement.removeEventListener( 'pointermove', onPointerMove );
			scope.domElement.removeEventListener( 'pointerup', onPointerUp );


			if ( scope._domElementKeyEvents !== null ) {

				scope._domElementKeyEvents.removeEventListener( 'keydown', onKeyDown );

			}

			//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

		};

		//
		// internals
		//

		const scope = this;

		const STATE = {
			NONE: - 1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		};

		let state = STATE.NONE;

		const EPS = 0.000001;

		// current position in spherical coordinates
		const spherical = new three__WEBPACK_IMPORTED_MODULE_0__.Spherical();
		const sphericalDelta = new three__WEBPACK_IMPORTED_MODULE_0__.Spherical();

		let scale = 1;
		const panOffset = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();
		let zoomChanged = false;

		const rotateStart = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
		const rotateEnd = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
		const rotateDelta = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();

		const panStart = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
		const panEnd = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
		const panDelta = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();

		const dollyStart = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
		const dollyEnd = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
		const dollyDelta = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();

		const pointers = [];
		const pointerPositions = {};

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function rotateLeft( angle ) {

			sphericalDelta.theta -= angle;

		}

		function rotateUp( angle ) {

			sphericalDelta.phi -= angle;

		}

		const panLeft = function () {

			const v = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();

			return function panLeft( distance, objectMatrix ) {

				v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		const panUp = function () {

			const v = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();

			return function panUp( distance, objectMatrix ) {

				if ( scope.screenSpacePanning === true ) {

					v.setFromMatrixColumn( objectMatrix, 1 );

				} else {

					v.setFromMatrixColumn( objectMatrix, 0 );
					v.crossVectors( scope.object.up, v );

				}

				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// deltaX and deltaY are in pixels; right and down are positive
		const pan = function () {

			const offset = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3();

			return function pan( deltaX, deltaY ) {

				const element = scope.domElement;

				if ( scope.object.isPerspectiveCamera ) {

					// perspective
					const position = scope.object.position;
					offset.copy( position ).sub( scope.target );
					let targetDistance = offset.length();

					// half of the fov is center to top of screen
					targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

					// we use only clientHeight here so aspect ratio does not distort speed
					panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
					panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

				} else if ( scope.object.isOrthographicCamera ) {

					// orthographic
					panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
					panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

				} else {

					// camera neither orthographic nor perspective
					console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
					scope.enablePan = false;

				}

			};

		}();

		function dollyOut( dollyScale ) {

			if ( scope.object.isPerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object.isOrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		function dollyIn( dollyScale ) {

			if ( scope.object.isPerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object.isOrthographicCamera ) {

				scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
				scope.enableZoom = false;

			}

		}

		//
		// event callbacks - update the object state
		//

		function handleMouseDownRotate( event ) {

			rotateStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownDolly( event ) {

			dollyStart.set( event.clientX, event.clientY );

		}

		function handleMouseDownPan( event ) {

			panStart.set( event.clientX, event.clientY );

		}

		function handleMouseMoveRotate( event ) {

			rotateEnd.set( event.clientX, event.clientY );

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

			const element = scope.domElement;

			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

			rotateStart.copy( rotateEnd );

			scope.update();

		}

		function handleMouseMoveDolly( event ) {

			dollyEnd.set( event.clientX, event.clientY );

			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {

				dollyOut( getZoomScale() );

			} else if ( dollyDelta.y < 0 ) {

				dollyIn( getZoomScale() );

			}

			dollyStart.copy( dollyEnd );

			scope.update();

		}

		function handleMouseMovePan( event ) {

			panEnd.set( event.clientX, event.clientY );

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

			scope.update();

		}

		function handleMouseUp( /*event*/ ) {

			// no-op

		}

		function handleMouseWheel( event ) {

			if ( event.deltaY < 0 ) {

				dollyIn( getZoomScale() );

			} else if ( event.deltaY > 0 ) {

				dollyOut( getZoomScale() );

			}

			scope.update();

		}

		function handleKeyDown( event ) {

			let needsUpdate = false;

			switch ( event.code ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					needsUpdate = true;
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					needsUpdate = true;
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					needsUpdate = true;
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					needsUpdate = true;
					break;

			}

			if ( needsUpdate ) {

				// prevent the browser from scrolling on cursor keys
				event.preventDefault();

				scope.update();

			}


		}

		function handleTouchStartRotate() {

			if ( pointers.length === 1 ) {

				rotateStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				rotateStart.set( x, y );

			}

		}

		function handleTouchStartPan() {

			if ( pointers.length === 1 ) {

				panStart.set( pointers[ 0 ].pageX, pointers[ 0 ].pageY );

			} else {

				const x = 0.5 * ( pointers[ 0 ].pageX + pointers[ 1 ].pageX );
				const y = 0.5 * ( pointers[ 0 ].pageY + pointers[ 1 ].pageY );

				panStart.set( x, y );

			}

		}

		function handleTouchStartDolly() {

			const dx = pointers[ 0 ].pageX - pointers[ 1 ].pageX;
			const dy = pointers[ 0 ].pageY - pointers[ 1 ].pageY;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyStart.set( 0, distance );

		}

		function handleTouchStartDollyPan() {

			if ( scope.enableZoom ) handleTouchStartDolly();

			if ( scope.enablePan ) handleTouchStartPan();

		}

		function handleTouchStartDollyRotate() {

			if ( scope.enableZoom ) handleTouchStartDolly();

			if ( scope.enableRotate ) handleTouchStartRotate();

		}

		function handleTouchMoveRotate( event ) {

			if ( pointers.length == 1 ) {

				rotateEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				rotateEnd.set( x, y );

			}

			rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

			const element = scope.domElement;

			rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

			rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

			rotateStart.copy( rotateEnd );

		}

		function handleTouchMovePan( event ) {

			if ( pointers.length === 1 ) {

				panEnd.set( event.pageX, event.pageY );

			} else {

				const position = getSecondPointerPosition( event );

				const x = 0.5 * ( event.pageX + position.x );
				const y = 0.5 * ( event.pageY + position.y );

				panEnd.set( x, y );

			}

			panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

			pan( panDelta.x, panDelta.y );

			panStart.copy( panEnd );

		}

		function handleTouchMoveDolly( event ) {

			const position = getSecondPointerPosition( event );

			const dx = event.pageX - position.x;
			const dy = event.pageY - position.y;

			const distance = Math.sqrt( dx * dx + dy * dy );

			dollyEnd.set( 0, distance );

			dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

			dollyOut( dollyDelta.y );

			dollyStart.copy( dollyEnd );

		}

		function handleTouchMoveDollyPan( event ) {

			if ( scope.enableZoom ) handleTouchMoveDolly( event );

			if ( scope.enablePan ) handleTouchMovePan( event );

		}

		function handleTouchMoveDollyRotate( event ) {

			if ( scope.enableZoom ) handleTouchMoveDolly( event );

			if ( scope.enableRotate ) handleTouchMoveRotate( event );

		}

		function handleTouchEnd( /*event*/ ) {

			// no-op

		}

		//
		// event handlers - FSM: listen for events and reset state
		//

		function onPointerDown( event ) {

			if ( scope.enabled === false ) return;

			if ( pointers.length === 0 ) {

				scope.domElement.setPointerCapture( event.pointerId );

				scope.domElement.addEventListener( 'pointermove', onPointerMove );
				scope.domElement.addEventListener( 'pointerup', onPointerUp );

			}

			//

			addPointer( event );

			if ( event.pointerType === 'touch' ) {

				onTouchStart( event );

			} else {

				onMouseDown( event );

			}

		}

		function onPointerMove( event ) {

			if ( scope.enabled === false ) return;

			if ( event.pointerType === 'touch' ) {

				onTouchMove( event );

			} else {

				onMouseMove( event );

			}

		}

		function onPointerUp( event ) {

			if ( scope.enabled === false ) return;

			if ( event.pointerType === 'touch' ) {

				onTouchEnd();

			} else {

				onMouseUp( event );

			}

			removePointer( event );

			//

			if ( pointers.length === 0 ) {

				scope.domElement.releasePointerCapture( event.pointerId );

				scope.domElement.removeEventListener( 'pointermove', onPointerMove );
				scope.domElement.removeEventListener( 'pointerup', onPointerUp );

			}

		}

		function onPointerCancel( event ) {

			removePointer( event );

		}

		function onMouseDown( event ) {

			let mouseAction;

			switch ( event.button ) {

				case 0:

					mouseAction = scope.mouseButtons.LEFT;
					break;

				case 1:

					mouseAction = scope.mouseButtons.MIDDLE;
					break;

				case 2:

					mouseAction = scope.mouseButtons.RIGHT;
					break;

				default:

					mouseAction = - 1;

			}

			switch ( mouseAction ) {

				case three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.DOLLY:

					if ( scope.enableZoom === false ) return;

					handleMouseDownDolly( event );

					state = STATE.DOLLY;

					break;

				case three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.ROTATE:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					} else {

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					}

					break;

				case three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.PAN:

					if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

					} else {

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( _startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			switch ( state ) {

				case STATE.ROTATE:

					if ( scope.enableRotate === false ) return;

					handleMouseMoveRotate( event );

					break;

				case STATE.DOLLY:

					if ( scope.enableZoom === false ) return;

					handleMouseMoveDolly( event );

					break;

				case STATE.PAN:

					if ( scope.enablePan === false ) return;

					handleMouseMovePan( event );

					break;

			}

		}

		function onMouseUp( event ) {

			handleMouseUp( event );

			scope.dispatchEvent( _endEvent );

			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

			event.preventDefault();

			scope.dispatchEvent( _startEvent );

			handleMouseWheel( event );

			scope.dispatchEvent( _endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enablePan === false ) return;

			handleKeyDown( event );

		}

		function onTouchStart( event ) {

			trackPointer( event );

			switch ( pointers.length ) {

				case 1:

					switch ( scope.touches.ONE ) {

						case three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.ROTATE:

							if ( scope.enableRotate === false ) return;

							handleTouchStartRotate();

							state = STATE.TOUCH_ROTATE;

							break;

						case three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.PAN:

							if ( scope.enablePan === false ) return;

							handleTouchStartPan();

							state = STATE.TOUCH_PAN;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				case 2:

					switch ( scope.touches.TWO ) {

						case three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.DOLLY_PAN:

							if ( scope.enableZoom === false && scope.enablePan === false ) return;

							handleTouchStartDollyPan();

							state = STATE.TOUCH_DOLLY_PAN;

							break;

						case three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.DOLLY_ROTATE:

							if ( scope.enableZoom === false && scope.enableRotate === false ) return;

							handleTouchStartDollyRotate();

							state = STATE.TOUCH_DOLLY_ROTATE;

							break;

						default:

							state = STATE.NONE;

					}

					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) {

				scope.dispatchEvent( _startEvent );

			}

		}

		function onTouchMove( event ) {

			trackPointer( event );

			switch ( state ) {

				case STATE.TOUCH_ROTATE:

					if ( scope.enableRotate === false ) return;

					handleTouchMoveRotate( event );

					scope.update();

					break;

				case STATE.TOUCH_PAN:

					if ( scope.enablePan === false ) return;

					handleTouchMovePan( event );

					scope.update();

					break;

				case STATE.TOUCH_DOLLY_PAN:

					if ( scope.enableZoom === false && scope.enablePan === false ) return;

					handleTouchMoveDollyPan( event );

					scope.update();

					break;

				case STATE.TOUCH_DOLLY_ROTATE:

					if ( scope.enableZoom === false && scope.enableRotate === false ) return;

					handleTouchMoveDollyRotate( event );

					scope.update();

					break;

				default:

					state = STATE.NONE;

			}

		}

		function onTouchEnd( event ) {

			handleTouchEnd( event );

			scope.dispatchEvent( _endEvent );

			state = STATE.NONE;

		}

		function onContextMenu( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

		}

		function addPointer( event ) {

			pointers.push( event );

		}

		function removePointer( event ) {

			delete pointerPositions[ event.pointerId ];

			for ( let i = 0; i < pointers.length; i ++ ) {

				if ( pointers[ i ].pointerId == event.pointerId ) {

					pointers.splice( i, 1 );
					return;

				}

			}

		}

		function trackPointer( event ) {

			let position = pointerPositions[ event.pointerId ];

			if ( position === undefined ) {

				position = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();
				pointerPositions[ event.pointerId ] = position;

			}

			position.set( event.pageX, event.pageY );

		}

		function getSecondPointerPosition( event ) {

			const pointer = ( event.pointerId === pointers[ 0 ].pointerId ) ? pointers[ 1 ] : pointers[ 0 ];

			return pointerPositions[ pointer.pointerId ];

		}

		//

		scope.domElement.addEventListener( 'contextmenu', onContextMenu );

		scope.domElement.addEventListener( 'pointerdown', onPointerDown );
		scope.domElement.addEventListener( 'pointercancel', onPointerCancel );
		scope.domElement.addEventListener( 'wheel', onMouseWheel, { passive: false } );

		// force an update at start

		this.update();

	}

}


// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls, another set of touch behavior
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move

class MapControls extends OrbitControls {

	constructor( object, domElement ) {

		super( object, domElement );

		this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

		this.mouseButtons.LEFT = three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.PAN;
		this.mouseButtons.RIGHT = three__WEBPACK_IMPORTED_MODULE_0__.MOUSE.ROTATE;

		this.touches.ONE = three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.PAN;
		this.touches.TWO = three__WEBPACK_IMPORTED_MODULE_0__.TOUCH.DOLLY_ROTATE;

	}

}




/***/ }),

/***/ "./node_modules/three/examples/jsm/libs/dat.gui.module.js":
/*!****************************************************************!*\
  !*** ./node_modules/three/examples/jsm/libs/dat.gui.module.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "color": () => (/* binding */ color),
/* harmony export */   "controllers": () => (/* binding */ controllers),
/* harmony export */   "dom": () => (/* binding */ dom$1),
/* harmony export */   "gui": () => (/* binding */ gui),
/* harmony export */   "GUI": () => (/* binding */ GUI$1),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function ___$insertStyle( css ) {

	if ( ! css ) {

		return;

	}
	if ( typeof window === 'undefined' ) {

		return;

	}

	var style = document.createElement( 'style' );

	style.setAttribute( 'type', 'text/css' );
	style.innerHTML = css;
	document.head.appendChild( style );

	return css;

}

function colorToString( color, forceCSSHex ) {

	var colorFormat = color.__state.conversionName.toString();
	var r = Math.round( color.r );
	var g = Math.round( color.g );
	var b = Math.round( color.b );
	var a = color.a;
	var h = Math.round( color.h );
	var s = color.s.toFixed( 1 );
	var v = color.v.toFixed( 1 );
	if ( forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX' ) {

		var str = color.hex.toString( 16 );
		while ( str.length < 6 ) {

			str = '0' + str;

		}
		return '#' + str;

	} else if ( colorFormat === 'CSS_RGB' ) {

		return 'rgb(' + r + ',' + g + ',' + b + ')';

	} else if ( colorFormat === 'CSS_RGBA' ) {

		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

	} else if ( colorFormat === 'HEX' ) {

		return '0x' + color.hex.toString( 16 );

	} else if ( colorFormat === 'RGB_ARRAY' ) {

		return '[' + r + ',' + g + ',' + b + ']';

	} else if ( colorFormat === 'RGBA_ARRAY' ) {

		return '[' + r + ',' + g + ',' + b + ',' + a + ']';

	} else if ( colorFormat === 'RGB_OBJ' ) {

		return '{r:' + r + ',g:' + g + ',b:' + b + '}';

	} else if ( colorFormat === 'RGBA_OBJ' ) {

		return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';

	} else if ( colorFormat === 'HSV_OBJ' ) {

		return '{h:' + h + ',s:' + s + ',v:' + v + '}';

	} else if ( colorFormat === 'HSVA_OBJ' ) {

		return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';

	}
	return 'unknown format';

}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
	BREAK: {},
	extend: function extend( target ) {

		this.each( ARR_SLICE.call( arguments, 1 ), function ( obj ) {

			var keys = this.isObject( obj ) ? Object.keys( obj ) : [];
			keys.forEach( function ( key ) {

				if ( ! this.isUndefined( obj[ key ] ) ) {

					target[ key ] = obj[ key ];

				}

			}.bind( this ) );

		}, this );
		return target;

	},
	defaults: function defaults( target ) {

		this.each( ARR_SLICE.call( arguments, 1 ), function ( obj ) {

			var keys = this.isObject( obj ) ? Object.keys( obj ) : [];
			keys.forEach( function ( key ) {

				if ( this.isUndefined( target[ key ] ) ) {

					target[ key ] = obj[ key ];

				}

			}.bind( this ) );

		}, this );
		return target;

	},
	compose: function compose() {

		var toCall = ARR_SLICE.call( arguments );
		return function () {

			var args = ARR_SLICE.call( arguments );
			for ( var i = toCall.length - 1; i >= 0; i -- ) {

				args = [ toCall[ i ].apply( this, args ) ];

			}
			return args[ 0 ];

		};

	},
	each: function each( obj, itr, scope ) {

		if ( ! obj ) {

			return;

		}
		if ( ARR_EACH && obj.forEach && obj.forEach === ARR_EACH ) {

			obj.forEach( itr, scope );

		} else if ( obj.length === obj.length + 0 ) {

			var key = void 0;
			var l = void 0;
			for ( key = 0, l = obj.length; key < l; key ++ ) {

				if ( key in obj && itr.call( scope, obj[ key ], key ) === this.BREAK ) {

					return;

				}

			}

		} else {

			for ( var _key in obj ) {

				if ( itr.call( scope, obj[ _key ], _key ) === this.BREAK ) {

					return;

				}

			}

		}

	},
	defer: function defer( fnc ) {

		setTimeout( fnc, 0 );

	},
	debounce: function debounce( func, threshold, callImmediately ) {

		var timeout = void 0;
		return function () {

			var obj = this;
			var args = arguments;
			function delayed() {

				timeout = null;
				if ( ! callImmediately ) func.apply( obj, args );

			}
			var callNow = callImmediately || ! timeout;
			clearTimeout( timeout );
			timeout = setTimeout( delayed, threshold );
			if ( callNow ) {

				func.apply( obj, args );

			}

		};

	},
	toArray: function toArray( obj ) {

		if ( obj.toArray ) return obj.toArray();
		return ARR_SLICE.call( obj );

	},
	isUndefined: function isUndefined( obj ) {

		return obj === undefined;

	},
	isNull: function isNull( obj ) {

		return obj === null;

	},
	isNaN: function ( _isNaN ) {

		function isNaN() {

			return _isNaN.apply( this, arguments );

		}
		isNaN.toString = function () {

			return _isNaN.toString();

		};
		return isNaN;

	}( function ( obj ) {

		return isNaN( obj );

	} ),
	isArray: Array.isArray || function ( obj ) {

		return obj.constructor === Array;

	},
	isObject: function isObject( obj ) {

		return obj === Object( obj );

	},
	isNumber: function isNumber( obj ) {

		return obj === obj + 0;

	},
	isString: function isString( obj ) {

		return obj === obj + '';

	},
	isBoolean: function isBoolean( obj ) {

		return obj === false || obj === true;

	},
	isFunction: function isFunction( obj ) {

		return obj instanceof Function;

	}
};

var INTERPRETATIONS = [
	{
		litmus: Common.isString,
		conversions: {
			THREE_CHAR_HEX: {
				read: function read( original ) {

					var test = original.match( /^#([A-F0-9])([A-F0-9])([A-F0-9])$/i );
					if ( test === null ) {

						return false;

					}
					return {
						space: 'HEX',
						hex: parseInt( '0x' + test[ 1 ].toString() + test[ 1 ].toString() + test[ 2 ].toString() + test[ 2 ].toString() + test[ 3 ].toString() + test[ 3 ].toString(), 0 )
					};

				},
				write: colorToString
			},
			SIX_CHAR_HEX: {
				read: function read( original ) {

					var test = original.match( /^#([A-F0-9]{6})$/i );
					if ( test === null ) {

						return false;

					}
					return {
						space: 'HEX',
						hex: parseInt( '0x' + test[ 1 ].toString(), 0 )
					};

				},
				write: colorToString
			},
			CSS_RGB: {
				read: function read( original ) {

					var test = original.match( /^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/ );
					if ( test === null ) {

						return false;

					}
					return {
						space: 'RGB',
						r: parseFloat( test[ 1 ] ),
						g: parseFloat( test[ 2 ] ),
						b: parseFloat( test[ 3 ] )
					};

				},
				write: colorToString
			},
			CSS_RGBA: {
				read: function read( original ) {

					var test = original.match( /^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/ );
					if ( test === null ) {

						return false;

					}
					return {
						space: 'RGB',
						r: parseFloat( test[ 1 ] ),
						g: parseFloat( test[ 2 ] ),
						b: parseFloat( test[ 3 ] ),
						a: parseFloat( test[ 4 ] )
					};

				},
				write: colorToString
			}
		}
	},
	{
		litmus: Common.isNumber,
		conversions: {
			HEX: {
				read: function read( original ) {

					return {
						space: 'HEX',
						hex: original,
						conversionName: 'HEX'
					};

				},
				write: function write( color ) {

					return color.hex;

				}
			}
		}
	},
	{
		litmus: Common.isArray,
		conversions: {
			RGB_ARRAY: {
				read: function read( original ) {

					if ( original.length !== 3 ) {

						return false;

					}
					return {
						space: 'RGB',
						r: original[ 0 ],
						g: original[ 1 ],
						b: original[ 2 ]
					};

				},
				write: function write( color ) {

					return [ color.r, color.g, color.b ];

				}
			},
			RGBA_ARRAY: {
				read: function read( original ) {

					if ( original.length !== 4 ) return false;
					return {
						space: 'RGB',
						r: original[ 0 ],
						g: original[ 1 ],
						b: original[ 2 ],
						a: original[ 3 ]
					};

				},
				write: function write( color ) {

					return [ color.r, color.g, color.b, color.a ];

				}
			}
		}
	},
	{
		litmus: Common.isObject,
		conversions: {
			RGBA_OBJ: {
				read: function read( original ) {

					if ( Common.isNumber( original.r ) && Common.isNumber( original.g ) && Common.isNumber( original.b ) && Common.isNumber( original.a ) ) {

						return {
							space: 'RGB',
							r: original.r,
							g: original.g,
							b: original.b,
							a: original.a
						};

					}
					return false;

				},
				write: function write( color ) {

					return {
						r: color.r,
						g: color.g,
						b: color.b,
						a: color.a
					};

				}
			},
			RGB_OBJ: {
				read: function read( original ) {

					if ( Common.isNumber( original.r ) && Common.isNumber( original.g ) && Common.isNumber( original.b ) ) {

						return {
							space: 'RGB',
							r: original.r,
							g: original.g,
							b: original.b
						};

					}
					return false;

				},
				write: function write( color ) {

					return {
						r: color.r,
						g: color.g,
						b: color.b
					};

				}
			},
			HSVA_OBJ: {
				read: function read( original ) {

					if ( Common.isNumber( original.h ) && Common.isNumber( original.s ) && Common.isNumber( original.v ) && Common.isNumber( original.a ) ) {

						return {
							space: 'HSV',
							h: original.h,
							s: original.s,
							v: original.v,
							a: original.a
						};

					}
					return false;

				},
				write: function write( color ) {

					return {
						h: color.h,
						s: color.s,
						v: color.v,
						a: color.a
					};

				}
			},
			HSV_OBJ: {
				read: function read( original ) {

					if ( Common.isNumber( original.h ) && Common.isNumber( original.s ) && Common.isNumber( original.v ) ) {

						return {
							space: 'HSV',
							h: original.h,
							s: original.s,
							v: original.v
						};

					}
					return false;

				},
				write: function write( color ) {

					return {
						h: color.h,
						s: color.s,
						v: color.v
					};

				}
			}
		}
	} ];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {

	toReturn = false;
	var original = arguments.length > 1 ? Common.toArray( arguments ) : arguments[ 0 ];
	Common.each( INTERPRETATIONS, function ( family ) {

		if ( family.litmus( original ) ) {

			Common.each( family.conversions, function ( conversion, conversionName ) {

				result = conversion.read( original );
				if ( toReturn === false && result !== false ) {

					toReturn = result;
					result.conversionName = conversionName;
					result.conversion = conversion;
					return Common.BREAK;

				}

			} );
			return Common.BREAK;

		}

	} );
	return toReturn;

};

var tmpComponent = void 0;
var ColorMath = {
	hsv_to_rgb: function hsv_to_rgb( h, s, v ) {

		var hi = Math.floor( h / 60 ) % 6;
		var f = h / 60 - Math.floor( h / 60 );
		var p = v * ( 1.0 - s );
		var q = v * ( 1.0 - f * s );
		var t = v * ( 1.0 - ( 1.0 - f ) * s );
		var c = [[ v, t, p ], [ q, v, p ], [ p, v, t ], [ p, q, v ], [ t, p, v ], [ v, p, q ]][ hi ];
		return {
			r: c[ 0 ] * 255,
			g: c[ 1 ] * 255,
			b: c[ 2 ] * 255
		};

	},
	rgb_to_hsv: function rgb_to_hsv( r, g, b ) {

		var min = Math.min( r, g, b );
		var max = Math.max( r, g, b );
		var delta = max - min;
		var h = void 0;
		var s = void 0;
		if ( max !== 0 ) {

			s = delta / max;

		} else {

			return {
				h: NaN,
				s: 0,
				v: 0
			};

		}
		if ( r === max ) {

			h = ( g - b ) / delta;

		} else if ( g === max ) {

			h = 2 + ( b - r ) / delta;

		} else {

			h = 4 + ( r - g ) / delta;

		}
		h /= 6;
		if ( h < 0 ) {

			h += 1;

		}
		return {
			h: h * 360,
			s: s,
			v: max / 255
		};

	},
	rgb_to_hex: function rgb_to_hex( r, g, b ) {

		var hex = this.hex_with_component( 0, 2, r );
		hex = this.hex_with_component( hex, 1, g );
		hex = this.hex_with_component( hex, 0, b );
		return hex;

	},
	component_from_hex: function component_from_hex( hex, componentIndex ) {

		return hex >> componentIndex * 8 & 0xFF;

	},
	hex_with_component: function hex_with_component( hex, componentIndex, value ) {

		return value << ( tmpComponent = componentIndex * 8 ) | hex & ~ ( 0xFF << tmpComponent );

	}
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function ( obj ) {

	return typeof obj;

} : function ( obj ) {

	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;

};











var classCallCheck = function ( instance, Constructor ) {

	if ( ! ( instance instanceof Constructor ) ) {

		throw new TypeError( "Cannot call a class as a function" );

	}

};

var createClass = function () {

	function defineProperties( target, props ) {

		for ( var i = 0; i < props.length; i ++ ) {

			var descriptor = props[ i ];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ( "value" in descriptor ) descriptor.writable = true;
			Object.defineProperty( target, descriptor.key, descriptor );

		}

	}

	return function ( Constructor, protoProps, staticProps ) {

		if ( protoProps ) defineProperties( Constructor.prototype, protoProps );
		if ( staticProps ) defineProperties( Constructor, staticProps );
		return Constructor;

	};

}();







var get = function get( object, property, receiver ) {

	if ( object === null ) object = Function.prototype;
	var desc = Object.getOwnPropertyDescriptor( object, property );

	if ( desc === undefined ) {

		var parent = Object.getPrototypeOf( object );

		if ( parent === null ) {

			return undefined;

		} else {

			return get( parent, property, receiver );

		}

	} else if ( "value" in desc ) {

		return desc.value;

	} else {

		var getter = desc.get;

		if ( getter === undefined ) {

			return undefined;

		}

		return getter.call( receiver );

	}

};

var inherits = function ( subClass, superClass ) {

	if ( typeof superClass !== "function" && superClass !== null ) {

		throw new TypeError( "Super expression must either be null or a function, not " + typeof superClass );

	}

	subClass.prototype = Object.create( superClass && superClass.prototype, {
		constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		}
	} );
	if ( superClass ) Object.setPrototypeOf ? Object.setPrototypeOf( subClass, superClass ) : subClass.__proto__ = superClass;

};











var possibleConstructorReturn = function ( self, call ) {

	if ( ! self ) {

		throw new ReferenceError( "this hasn't been initialised - super() hasn't been called" );

	}

	return call && ( typeof call === "object" || typeof call === "function" ) ? call : self;

};

var Color = function () {

	function Color() {

		classCallCheck( this, Color );
		this.__state = interpret.apply( this, arguments );
		if ( this.__state === false ) {

			throw new Error( 'Failed to interpret color arguments' );

		}
		this.__state.a = this.__state.a || 1;

	}
	createClass( Color, [ {
		key: 'toString',
		value: function toString() {

			return colorToString( this );

		}
	}, {
		key: 'toHexString',
		value: function toHexString() {

			return colorToString( this, true );

		}
	}, {
		key: 'toOriginal',
		value: function toOriginal() {

			return this.__state.conversion.write( this );

		}
	} ] );
	return Color;

}();
function defineRGBComponent( target, component, componentHexIndex ) {

	Object.defineProperty( target, component, {
		get: function get$$1() {

			if ( this.__state.space === 'RGB' ) {

				return this.__state[ component ];

			}
			Color.recalculateRGB( this, component, componentHexIndex );
			return this.__state[ component ];

		},
		set: function set$$1( v ) {

			if ( this.__state.space !== 'RGB' ) {

				Color.recalculateRGB( this, component, componentHexIndex );
				this.__state.space = 'RGB';

			}
			this.__state[ component ] = v;

		}
	} );

}
function defineHSVComponent( target, component ) {

	Object.defineProperty( target, component, {
		get: function get$$1() {

			if ( this.__state.space === 'HSV' ) {

				return this.__state[ component ];

			}
			Color.recalculateHSV( this );
			return this.__state[ component ];

		},
		set: function set$$1( v ) {

			if ( this.__state.space !== 'HSV' ) {

				Color.recalculateHSV( this );
				this.__state.space = 'HSV';

			}
			this.__state[ component ] = v;

		}
	} );

}
Color.recalculateRGB = function ( color, component, componentHexIndex ) {

	if ( color.__state.space === 'HEX' ) {

		color.__state[ component ] = ColorMath.component_from_hex( color.__state.hex, componentHexIndex );

	} else if ( color.__state.space === 'HSV' ) {

		Common.extend( color.__state, ColorMath.hsv_to_rgb( color.__state.h, color.__state.s, color.__state.v ) );

	} else {

		throw new Error( 'Corrupted color state' );

	}

};
Color.recalculateHSV = function ( color ) {

	var result = ColorMath.rgb_to_hsv( color.r, color.g, color.b );
	Common.extend( color.__state, {
		s: result.s,
		v: result.v
	} );
	if ( ! Common.isNaN( result.h ) ) {

		color.__state.h = result.h;

	} else if ( Common.isUndefined( color.__state.h ) ) {

		color.__state.h = 0;

	}

};
Color.COMPONENTS = [ 'r', 'g', 'b', 'h', 's', 'v', 'hex', 'a' ];
defineRGBComponent( Color.prototype, 'r', 2 );
defineRGBComponent( Color.prototype, 'g', 1 );
defineRGBComponent( Color.prototype, 'b', 0 );
defineHSVComponent( Color.prototype, 'h' );
defineHSVComponent( Color.prototype, 's' );
defineHSVComponent( Color.prototype, 'v' );
Object.defineProperty( Color.prototype, 'a', {
	get: function get$$1() {

		return this.__state.a;

	},
	set: function set$$1( v ) {

		this.__state.a = v;

	}
} );
Object.defineProperty( Color.prototype, 'hex', {
	get: function get$$1() {

		if ( this.__state.space !== 'HEX' ) {

			this.__state.hex = ColorMath.rgb_to_hex( this.r, this.g, this.b );
			this.__state.space = 'HEX';

		}
		return this.__state.hex;

	},
	set: function set$$1( v ) {

		this.__state.space = 'HEX';
		this.__state.hex = v;

	}
} );

var Controller = function () {

	function Controller( object, property ) {

		classCallCheck( this, Controller );
		this.initialValue = object[ property ];
		this.domElement = document.createElement( 'div' );
		this.object = object;
		this.property = property;
		this.__onChange = undefined;
		this.__onFinishChange = undefined;

	}
	createClass( Controller, [ {
		key: 'onChange',
		value: function onChange( fnc ) {

			this.__onChange = fnc;
			return this;

		}
	}, {
		key: 'onFinishChange',
		value: function onFinishChange( fnc ) {

			this.__onFinishChange = fnc;
			return this;

		}
	}, {
		key: 'setValue',
		value: function setValue( newValue ) {

			this.object[ this.property ] = newValue;
			if ( this.__onChange ) {

				this.__onChange.call( this, newValue );

			}
			this.updateDisplay();
			return this;

		}
	}, {
		key: 'getValue',
		value: function getValue() {

			return this.object[ this.property ];

		}
	}, {
		key: 'updateDisplay',
		value: function updateDisplay() {

			return this;

		}
	}, {
		key: 'isModified',
		value: function isModified() {

			return this.initialValue !== this.getValue();

		}
	} ] );
	return Controller;

}();

var EVENT_MAP = {
	HTMLEvents: [ 'change' ],
	MouseEvents: [ 'click', 'mousemove', 'mousedown', 'mouseup', 'mouseover' ],
	KeyboardEvents: [ 'keydown' ]
};
var EVENT_MAP_INV = {};
Common.each( EVENT_MAP, function ( v, k ) {

	Common.each( v, function ( e ) {

		EVENT_MAP_INV[ e ] = k;

	} );

} );
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels( val ) {

	if ( val === '0' || Common.isUndefined( val ) ) {

		return 0;

	}
	var match = val.match( CSS_VALUE_PIXELS );
	if ( ! Common.isNull( match ) ) {

		return parseFloat( match[ 1 ] );

	}
	return 0;

}
var dom = {
	makeSelectable: function makeSelectable( elem, selectable ) {

		if ( elem === undefined || elem.style === undefined ) return;
		elem.onselectstart = selectable ? function () {

			return false;

		} : function () {};
		elem.style.MozUserSelect = selectable ? 'auto' : 'none';
		elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
		elem.unselectable = selectable ? 'on' : 'off';

	},
	makeFullscreen: function makeFullscreen( elem, hor, vert ) {

		var vertical = vert;
		var horizontal = hor;
		if ( Common.isUndefined( horizontal ) ) {

			horizontal = true;

		}
		if ( Common.isUndefined( vertical ) ) {

			vertical = true;

		}
		elem.style.position = 'absolute';
		if ( horizontal ) {

			elem.style.left = 0;
			elem.style.right = 0;

		}
		if ( vertical ) {

			elem.style.top = 0;
			elem.style.bottom = 0;

		}

	},
	fakeEvent: function fakeEvent( elem, eventType, pars, aux ) {

		var params = pars || {};
		var className = EVENT_MAP_INV[ eventType ];
		if ( ! className ) {

			throw new Error( 'Event type ' + eventType + ' not supported.' );

		}
		var evt = document.createEvent( className );
		switch ( className ) {

			case 'MouseEvents':
			{

				var clientX = params.x || params.clientX || 0;
				var clientY = params.y || params.clientY || 0;
				evt.initMouseEvent( eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
					0,
					clientX,
					clientY,
					false, false, false, false, 0, null );
				break;

			}
			case 'KeyboardEvents':
			{

				var init = evt.initKeyboardEvent || evt.initKeyEvent;
				Common.defaults( params, {
					cancelable: true,
					ctrlKey: false,
					altKey: false,
					shiftKey: false,
					metaKey: false,
					keyCode: undefined,
					charCode: undefined
				} );
				init( eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode );
				break;

			}
			default:
			{

				evt.initEvent( eventType, params.bubbles || false, params.cancelable || true );
				break;

			}

		}
		Common.defaults( evt, aux );
		elem.dispatchEvent( evt );

	},
	bind: function bind( elem, event, func, newBool ) {

		var bool = newBool || false;
		if ( elem.addEventListener ) {

			elem.addEventListener( event, func, bool );

		} else if ( elem.attachEvent ) {

			elem.attachEvent( 'on' + event, func );

		}
		return dom;

	},
	unbind: function unbind( elem, event, func, newBool ) {

		var bool = newBool || false;
		if ( elem.removeEventListener ) {

			elem.removeEventListener( event, func, bool );

		} else if ( elem.detachEvent ) {

			elem.detachEvent( 'on' + event, func );

		}
		return dom;

	},
	addClass: function addClass( elem, className ) {

		if ( elem.className === undefined ) {

			elem.className = className;

		} else if ( elem.className !== className ) {

			var classes = elem.className.split( / +/ );
			if ( classes.indexOf( className ) === - 1 ) {

				classes.push( className );
				elem.className = classes.join( ' ' ).replace( /^\s+/, '' ).replace( /\s+$/, '' );

			}

		}
		return dom;

	},
	removeClass: function removeClass( elem, className ) {

		if ( className ) {

			if ( elem.className === className ) {

				elem.removeAttribute( 'class' );

			} else {

				var classes = elem.className.split( / +/ );
				var index = classes.indexOf( className );
				if ( index !== - 1 ) {

					classes.splice( index, 1 );
					elem.className = classes.join( ' ' );

				}

			}

		} else {

			elem.className = undefined;

		}
		return dom;

	},
	hasClass: function hasClass( elem, className ) {

		return new RegExp( '(?:^|\\s+)' + className + '(?:\\s+|$)' ).test( elem.className ) || false;

	},
	getWidth: function getWidth( elem ) {

		var style = getComputedStyle( elem );
		return cssValueToPixels( style[ 'border-left-width' ] ) + cssValueToPixels( style[ 'border-right-width' ] ) + cssValueToPixels( style[ 'padding-left' ] ) + cssValueToPixels( style[ 'padding-right' ] ) + cssValueToPixels( style.width );

	},
	getHeight: function getHeight( elem ) {

		var style = getComputedStyle( elem );
		return cssValueToPixels( style[ 'border-top-width' ] ) + cssValueToPixels( style[ 'border-bottom-width' ] ) + cssValueToPixels( style[ 'padding-top' ] ) + cssValueToPixels( style[ 'padding-bottom' ] ) + cssValueToPixels( style.height );

	},
	getOffset: function getOffset( el ) {

		var elem = el;
		var offset = { left: 0, top: 0 };
		if ( elem.offsetParent ) {

			do {

				offset.left += elem.offsetLeft;
				offset.top += elem.offsetTop;
				elem = elem.offsetParent;

			} while ( elem );

		}
		return offset;

	},
	isActive: function isActive( elem ) {

		return elem === document.activeElement && ( elem.type || elem.href );

	}
};

var BooleanController = function ( _Controller ) {

	inherits( BooleanController, _Controller );
	function BooleanController( object, property ) {

		classCallCheck( this, BooleanController );
		var _this2 = possibleConstructorReturn( this, ( BooleanController.__proto__ || Object.getPrototypeOf( BooleanController ) ).call( this, object, property ) );
		var _this = _this2;
		_this2.__prev = _this2.getValue();
		_this2.__checkbox = document.createElement( 'input' );
		_this2.__checkbox.setAttribute( 'type', 'checkbox' );
		function onChange() {

			_this.setValue( ! _this.__prev );

		}
		dom.bind( _this2.__checkbox, 'change', onChange, false );
		_this2.domElement.appendChild( _this2.__checkbox );
		_this2.updateDisplay();
		return _this2;

	}
	createClass( BooleanController, [ {
		key: 'setValue',
		value: function setValue( v ) {

			var toReturn = get( BooleanController.prototype.__proto__ || Object.getPrototypeOf( BooleanController.prototype ), 'setValue', this ).call( this, v );
			if ( this.__onFinishChange ) {

				this.__onFinishChange.call( this, this.getValue() );

			}
			this.__prev = this.getValue();
			return toReturn;

		}
	}, {
		key: 'updateDisplay',
		value: function updateDisplay() {

			if ( this.getValue() === true ) {

				this.__checkbox.setAttribute( 'checked', 'checked' );
				this.__checkbox.checked = true;
				this.__prev = true;

			} else {

				this.__checkbox.checked = false;
				this.__prev = false;

			}
			return get( BooleanController.prototype.__proto__ || Object.getPrototypeOf( BooleanController.prototype ), 'updateDisplay', this ).call( this );

		}
	} ] );
	return BooleanController;

}( Controller );

var OptionController = function ( _Controller ) {

	inherits( OptionController, _Controller );
	function OptionController( object, property, opts ) {

		classCallCheck( this, OptionController );
		var _this2 = possibleConstructorReturn( this, ( OptionController.__proto__ || Object.getPrototypeOf( OptionController ) ).call( this, object, property ) );
		var options = opts;
		var _this = _this2;
		_this2.__select = document.createElement( 'select' );
		if ( Common.isArray( options ) ) {

			var map = {};
			Common.each( options, function ( element ) {

				map[ element ] = element;

			} );
			options = map;

		}
		Common.each( options, function ( value, key ) {

			var opt = document.createElement( 'option' );
			opt.innerHTML = key;
			opt.setAttribute( 'value', value );
			_this.__select.appendChild( opt );

		} );
		_this2.updateDisplay();
		dom.bind( _this2.__select, 'change', function () {

			var desiredValue = this.options[ this.selectedIndex ].value;
			_this.setValue( desiredValue );

		} );
		_this2.domElement.appendChild( _this2.__select );
		return _this2;

	}
	createClass( OptionController, [ {
		key: 'setValue',
		value: function setValue( v ) {

			var toReturn = get( OptionController.prototype.__proto__ || Object.getPrototypeOf( OptionController.prototype ), 'setValue', this ).call( this, v );
			if ( this.__onFinishChange ) {

				this.__onFinishChange.call( this, this.getValue() );

			}
			return toReturn;

		}
	}, {
		key: 'updateDisplay',
		value: function updateDisplay() {

			if ( dom.isActive( this.__select ) ) return this;
			this.__select.value = this.getValue();
			return get( OptionController.prototype.__proto__ || Object.getPrototypeOf( OptionController.prototype ), 'updateDisplay', this ).call( this );

		}
	} ] );
	return OptionController;

}( Controller );

var StringController = function ( _Controller ) {

	inherits( StringController, _Controller );
	function StringController( object, property ) {

		classCallCheck( this, StringController );
		var _this2 = possibleConstructorReturn( this, ( StringController.__proto__ || Object.getPrototypeOf( StringController ) ).call( this, object, property ) );
		var _this = _this2;
		function onChange() {

			_this.setValue( _this.__input.value );

		}
		function onBlur() {

			if ( _this.__onFinishChange ) {

				_this.__onFinishChange.call( _this, _this.getValue() );

			}

		}
		_this2.__input = document.createElement( 'input' );
		_this2.__input.setAttribute( 'type', 'text' );
		dom.bind( _this2.__input, 'keyup', onChange );
		dom.bind( _this2.__input, 'change', onChange );
		dom.bind( _this2.__input, 'blur', onBlur );
		dom.bind( _this2.__input, 'keydown', function ( e ) {

			if ( e.keyCode === 13 ) {

				this.blur();

			}

		} );
		_this2.updateDisplay();
		_this2.domElement.appendChild( _this2.__input );
		return _this2;

	}
	createClass( StringController, [ {
		key: 'updateDisplay',
		value: function updateDisplay() {

			if ( ! dom.isActive( this.__input ) ) {

				this.__input.value = this.getValue();

			}
			return get( StringController.prototype.__proto__ || Object.getPrototypeOf( StringController.prototype ), 'updateDisplay', this ).call( this );

		}
	} ] );
	return StringController;

}( Controller );

function numDecimals( x ) {

	var _x = x.toString();
	if ( _x.indexOf( '.' ) > - 1 ) {

		return _x.length - _x.indexOf( '.' ) - 1;

	}
	return 0;

}
var NumberController = function ( _Controller ) {

	inherits( NumberController, _Controller );
	function NumberController( object, property, params ) {

		classCallCheck( this, NumberController );
		var _this = possibleConstructorReturn( this, ( NumberController.__proto__ || Object.getPrototypeOf( NumberController ) ).call( this, object, property ) );
		var _params = params || {};
		_this.__min = _params.min;
		_this.__max = _params.max;
		_this.__step = _params.step;
		if ( Common.isUndefined( _this.__step ) ) {

			if ( _this.initialValue === 0 ) {

				_this.__impliedStep = 1;

			} else {

				_this.__impliedStep = Math.pow( 10, Math.floor( Math.log( Math.abs( _this.initialValue ) ) / Math.LN10 ) ) / 10;

			}

		} else {

			_this.__impliedStep = _this.__step;

		}
		_this.__precision = numDecimals( _this.__impliedStep );
		return _this;

	}
	createClass( NumberController, [ {
		key: 'setValue',
		value: function setValue( v ) {

			var _v = v;
			if ( this.__min !== undefined && _v < this.__min ) {

				_v = this.__min;

			} else if ( this.__max !== undefined && _v > this.__max ) {

				_v = this.__max;

			}
			if ( this.__step !== undefined && _v % this.__step !== 0 ) {

				_v = Math.round( _v / this.__step ) * this.__step;

			}
			return get( NumberController.prototype.__proto__ || Object.getPrototypeOf( NumberController.prototype ), 'setValue', this ).call( this, _v );

		}
	}, {
		key: 'min',
		value: function min( minValue ) {

			this.__min = minValue;
			return this;

		}
	}, {
		key: 'max',
		value: function max( maxValue ) {

			this.__max = maxValue;
			return this;

		}
	}, {
		key: 'step',
		value: function step( stepValue ) {

			this.__step = stepValue;
			this.__impliedStep = stepValue;
			this.__precision = numDecimals( stepValue );
			return this;

		}
	} ] );
	return NumberController;

}( Controller );

function roundToDecimal( value, decimals ) {

	var tenTo = Math.pow( 10, decimals );
	return Math.round( value * tenTo ) / tenTo;

}
var NumberControllerBox = function ( _NumberController ) {

	inherits( NumberControllerBox, _NumberController );
	function NumberControllerBox( object, property, params ) {

		classCallCheck( this, NumberControllerBox );
		var _this2 = possibleConstructorReturn( this, ( NumberControllerBox.__proto__ || Object.getPrototypeOf( NumberControllerBox ) ).call( this, object, property, params ) );
		_this2.__truncationSuspended = false;
		var _this = _this2;
		var prevY = void 0;
		function onChange() {

			var attempted = parseFloat( _this.__input.value );
			if ( ! Common.isNaN( attempted ) ) {

				_this.setValue( attempted );

			}

		}
		function onFinish() {

			if ( _this.__onFinishChange ) {

				_this.__onFinishChange.call( _this, _this.getValue() );

			}

		}
		function onBlur() {

			onFinish();

		}
		function onMouseDrag( e ) {

			var diff = prevY - e.clientY;
			_this.setValue( _this.getValue() + diff * _this.__impliedStep );
			prevY = e.clientY;

		}
		function onMouseUp() {

			dom.unbind( window, 'mousemove', onMouseDrag );
			dom.unbind( window, 'mouseup', onMouseUp );
			onFinish();

		}
		function onMouseDown( e ) {

			dom.bind( window, 'mousemove', onMouseDrag );
			dom.bind( window, 'mouseup', onMouseUp );
			prevY = e.clientY;

		}
		_this2.__input = document.createElement( 'input' );
		_this2.__input.setAttribute( 'type', 'text' );
		dom.bind( _this2.__input, 'change', onChange );
		dom.bind( _this2.__input, 'blur', onBlur );
		dom.bind( _this2.__input, 'mousedown', onMouseDown );
		dom.bind( _this2.__input, 'keydown', function ( e ) {

			if ( e.keyCode === 13 ) {

				_this.__truncationSuspended = true;
				this.blur();
				_this.__truncationSuspended = false;
				onFinish();

			}

		} );
		_this2.updateDisplay();
		_this2.domElement.appendChild( _this2.__input );
		return _this2;

	}
	createClass( NumberControllerBox, [ {
		key: 'updateDisplay',
		value: function updateDisplay() {

			this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal( this.getValue(), this.__precision );
			return get( NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf( NumberControllerBox.prototype ), 'updateDisplay', this ).call( this );

		}
	} ] );
	return NumberControllerBox;

}( NumberController );

function map( v, i1, i2, o1, o2 ) {

	return o1 + ( o2 - o1 ) * ( ( v - i1 ) / ( i2 - i1 ) );

}
var NumberControllerSlider = function ( _NumberController ) {

	inherits( NumberControllerSlider, _NumberController );
	function NumberControllerSlider( object, property, min, max, step ) {

		classCallCheck( this, NumberControllerSlider );
		var _this2 = possibleConstructorReturn( this, ( NumberControllerSlider.__proto__ || Object.getPrototypeOf( NumberControllerSlider ) ).call( this, object, property, { min: min, max: max, step: step } ) );
		var _this = _this2;
		_this2.__background = document.createElement( 'div' );
		_this2.__foreground = document.createElement( 'div' );
		dom.bind( _this2.__background, 'mousedown', onMouseDown );
		dom.bind( _this2.__background, 'touchstart', onTouchStart );
		dom.addClass( _this2.__background, 'slider' );
		dom.addClass( _this2.__foreground, 'slider-fg' );
		function onMouseDown( e ) {

			document.activeElement.blur();
			dom.bind( window, 'mousemove', onMouseDrag );
			dom.bind( window, 'mouseup', onMouseUp );
			onMouseDrag( e );

		}
		function onMouseDrag( e ) {

			e.preventDefault();
			var bgRect = _this.__background.getBoundingClientRect();
			_this.setValue( map( e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max ) );
			return false;

		}
		function onMouseUp() {

			dom.unbind( window, 'mousemove', onMouseDrag );
			dom.unbind( window, 'mouseup', onMouseUp );
			if ( _this.__onFinishChange ) {

				_this.__onFinishChange.call( _this, _this.getValue() );

			}

		}
		function onTouchStart( e ) {

			if ( e.touches.length !== 1 ) {

				return;

			}
			dom.bind( window, 'touchmove', onTouchMove );
			dom.bind( window, 'touchend', onTouchEnd );
			onTouchMove( e );

		}
		function onTouchMove( e ) {

			var clientX = e.touches[ 0 ].clientX;
			var bgRect = _this.__background.getBoundingClientRect();
			_this.setValue( map( clientX, bgRect.left, bgRect.right, _this.__min, _this.__max ) );

		}
		function onTouchEnd() {

			dom.unbind( window, 'touchmove', onTouchMove );
			dom.unbind( window, 'touchend', onTouchEnd );
			if ( _this.__onFinishChange ) {

				_this.__onFinishChange.call( _this, _this.getValue() );

			}

		}
		_this2.updateDisplay();
		_this2.__background.appendChild( _this2.__foreground );
		_this2.domElement.appendChild( _this2.__background );
		return _this2;

	}
	createClass( NumberControllerSlider, [ {
		key: 'updateDisplay',
		value: function updateDisplay() {

			var pct = ( this.getValue() - this.__min ) / ( this.__max - this.__min );
			this.__foreground.style.width = pct * 100 + '%';
			return get( NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf( NumberControllerSlider.prototype ), 'updateDisplay', this ).call( this );

		}
	} ] );
	return NumberControllerSlider;

}( NumberController );

var FunctionController = function ( _Controller ) {

	inherits( FunctionController, _Controller );
	function FunctionController( object, property, text ) {

		classCallCheck( this, FunctionController );
		var _this2 = possibleConstructorReturn( this, ( FunctionController.__proto__ || Object.getPrototypeOf( FunctionController ) ).call( this, object, property ) );
		var _this = _this2;
		_this2.__button = document.createElement( 'div' );
		_this2.__button.innerHTML = text === undefined ? 'Fire' : text;
		dom.bind( _this2.__button, 'click', function ( e ) {

			e.preventDefault();
			_this.fire();
			return false;

		} );
		dom.addClass( _this2.__button, 'button' );
		_this2.domElement.appendChild( _this2.__button );
		return _this2;

	}
	createClass( FunctionController, [ {
		key: 'fire',
		value: function fire() {

			if ( this.__onChange ) {

				this.__onChange.call( this );

			}
			this.getValue().call( this.object );
			if ( this.__onFinishChange ) {

				this.__onFinishChange.call( this, this.getValue() );

			}

		}
	} ] );
	return FunctionController;

}( Controller );

var ColorController = function ( _Controller ) {

	inherits( ColorController, _Controller );
	function ColorController( object, property ) {

		classCallCheck( this, ColorController );
		var _this2 = possibleConstructorReturn( this, ( ColorController.__proto__ || Object.getPrototypeOf( ColorController ) ).call( this, object, property ) );
		_this2.__color = new Color( _this2.getValue() );
		_this2.__temp = new Color( 0 );
		var _this = _this2;
		_this2.domElement = document.createElement( 'div' );
		dom.makeSelectable( _this2.domElement, false );
		_this2.__selector = document.createElement( 'div' );
		_this2.__selector.className = 'selector';
		_this2.__saturation_field = document.createElement( 'div' );
		_this2.__saturation_field.className = 'saturation-field';
		_this2.__field_knob = document.createElement( 'div' );
		_this2.__field_knob.className = 'field-knob';
		_this2.__field_knob_border = '2px solid ';
		_this2.__hue_knob = document.createElement( 'div' );
		_this2.__hue_knob.className = 'hue-knob';
		_this2.__hue_field = document.createElement( 'div' );
		_this2.__hue_field.className = 'hue-field';
		_this2.__input = document.createElement( 'input' );
		_this2.__input.type = 'text';
		_this2.__input_textShadow = '0 1px 1px ';
		dom.bind( _this2.__input, 'keydown', function ( e ) {

			if ( e.keyCode === 13 ) {

				onBlur.call( this );

			}

		} );
		dom.bind( _this2.__input, 'blur', onBlur );
		dom.bind( _this2.__selector, 'mousedown', function () {

			dom.addClass( this, 'drag' ).bind( window, 'mouseup', function () {

				dom.removeClass( _this.__selector, 'drag' );

			} );

		} );
		dom.bind( _this2.__selector, 'touchstart', function () {

			dom.addClass( this, 'drag' ).bind( window, 'touchend', function () {

				dom.removeClass( _this.__selector, 'drag' );

			} );

		} );
		var valueField = document.createElement( 'div' );
		Common.extend( _this2.__selector.style, {
			width: '122px',
			height: '102px',
			padding: '3px',
			backgroundColor: '#222',
			boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
		} );
		Common.extend( _this2.__field_knob.style, {
			position: 'absolute',
			width: '12px',
			height: '12px',
			border: _this2.__field_knob_border + ( _this2.__color.v < 0.5 ? '#fff' : '#000' ),
			boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
			borderRadius: '12px',
			zIndex: 1
		} );
		Common.extend( _this2.__hue_knob.style, {
			position: 'absolute',
			width: '15px',
			height: '2px',
			borderRight: '4px solid #fff',
			zIndex: 1
		} );
		Common.extend( _this2.__saturation_field.style, {
			width: '100px',
			height: '100px',
			border: '1px solid #555',
			marginRight: '3px',
			display: 'inline-block',
			cursor: 'pointer'
		} );
		Common.extend( valueField.style, {
			width: '100%',
			height: '100%',
			background: 'none'
		} );
		linearGradient( valueField, 'top', 'rgba(0,0,0,0)', '#000' );
		Common.extend( _this2.__hue_field.style, {
			width: '15px',
			height: '100px',
			border: '1px solid #555',
			cursor: 'ns-resize',
			position: 'absolute',
			top: '3px',
			right: '3px'
		} );
		hueGradient( _this2.__hue_field );
		Common.extend( _this2.__input.style, {
			outline: 'none',
			textAlign: 'center',
			color: '#fff',
			border: 0,
			fontWeight: 'bold',
			textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
		} );
		dom.bind( _this2.__saturation_field, 'mousedown', fieldDown );
		dom.bind( _this2.__saturation_field, 'touchstart', fieldDown );
		dom.bind( _this2.__field_knob, 'mousedown', fieldDown );
		dom.bind( _this2.__field_knob, 'touchstart', fieldDown );
		dom.bind( _this2.__hue_field, 'mousedown', fieldDownH );
		dom.bind( _this2.__hue_field, 'touchstart', fieldDownH );
		function fieldDown( e ) {

			setSV( e );
			dom.bind( window, 'mousemove', setSV );
			dom.bind( window, 'touchmove', setSV );
			dom.bind( window, 'mouseup', fieldUpSV );
			dom.bind( window, 'touchend', fieldUpSV );

		}
		function fieldDownH( e ) {

			setH( e );
			dom.bind( window, 'mousemove', setH );
			dom.bind( window, 'touchmove', setH );
			dom.bind( window, 'mouseup', fieldUpH );
			dom.bind( window, 'touchend', fieldUpH );

		}
		function fieldUpSV() {

			dom.unbind( window, 'mousemove', setSV );
			dom.unbind( window, 'touchmove', setSV );
			dom.unbind( window, 'mouseup', fieldUpSV );
			dom.unbind( window, 'touchend', fieldUpSV );
			onFinish();

		}
		function fieldUpH() {

			dom.unbind( window, 'mousemove', setH );
			dom.unbind( window, 'touchmove', setH );
			dom.unbind( window, 'mouseup', fieldUpH );
			dom.unbind( window, 'touchend', fieldUpH );
			onFinish();

		}
		function onBlur() {

			var i = interpret( this.value );
			if ( i !== false ) {

				_this.__color.__state = i;
				_this.setValue( _this.__color.toOriginal() );

			} else {

				this.value = _this.__color.toString();

			}

		}
		function onFinish() {

			if ( _this.__onFinishChange ) {

				_this.__onFinishChange.call( _this, _this.__color.toOriginal() );

			}

		}
		_this2.__saturation_field.appendChild( valueField );
		_this2.__selector.appendChild( _this2.__field_knob );
		_this2.__selector.appendChild( _this2.__saturation_field );
		_this2.__selector.appendChild( _this2.__hue_field );
		_this2.__hue_field.appendChild( _this2.__hue_knob );
		_this2.domElement.appendChild( _this2.__input );
		_this2.domElement.appendChild( _this2.__selector );
		_this2.updateDisplay();
		function setSV( e ) {

			if ( e.type.indexOf( 'touch' ) === - 1 ) {

				e.preventDefault();

			}
			var fieldRect = _this.__saturation_field.getBoundingClientRect();
			var _ref = e.touches && e.touches[ 0 ] || e,
				clientX = _ref.clientX,
				clientY = _ref.clientY;
			var s = ( clientX - fieldRect.left ) / ( fieldRect.right - fieldRect.left );
			var v = 1 - ( clientY - fieldRect.top ) / ( fieldRect.bottom - fieldRect.top );
			if ( v > 1 ) {

				v = 1;

			} else if ( v < 0 ) {

				v = 0;

			}
			if ( s > 1 ) {

				s = 1;

			} else if ( s < 0 ) {

				s = 0;

			}
			_this.__color.v = v;
			_this.__color.s = s;
			_this.setValue( _this.__color.toOriginal() );
			return false;

		}
		function setH( e ) {

			if ( e.type.indexOf( 'touch' ) === - 1 ) {

				e.preventDefault();

			}
			var fieldRect = _this.__hue_field.getBoundingClientRect();
			var _ref2 = e.touches && e.touches[ 0 ] || e,
				clientY = _ref2.clientY;
			var h = 1 - ( clientY - fieldRect.top ) / ( fieldRect.bottom - fieldRect.top );
			if ( h > 1 ) {

				h = 1;

			} else if ( h < 0 ) {

				h = 0;

			}
			_this.__color.h = h * 360;
			_this.setValue( _this.__color.toOriginal() );
			return false;

		}
		return _this2;

	}
	createClass( ColorController, [ {
		key: 'updateDisplay',
		value: function updateDisplay() {

			var i = interpret( this.getValue() );
			if ( i !== false ) {

				var mismatch = false;
				Common.each( Color.COMPONENTS, function ( component ) {

					if ( ! Common.isUndefined( i[ component ] ) && ! Common.isUndefined( this.__color.__state[ component ] ) && i[ component ] !== this.__color.__state[ component ] ) {

						mismatch = true;
						return {};

					}

				}, this );
				if ( mismatch ) {

					Common.extend( this.__color.__state, i );

				}

			}
			Common.extend( this.__temp.__state, this.__color.__state );
			this.__temp.a = 1;
			var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
			var _flip = 255 - flip;
			Common.extend( this.__field_knob.style, {
				marginLeft: 100 * this.__color.s - 7 + 'px',
				marginTop: 100 * ( 1 - this.__color.v ) - 7 + 'px',
				backgroundColor: this.__temp.toHexString(),
				border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
			} );
			this.__hue_knob.style.marginTop = ( 1 - this.__color.h / 360 ) * 100 + 'px';
			this.__temp.s = 1;
			this.__temp.v = 1;
			linearGradient( this.__saturation_field, 'left', '#fff', this.__temp.toHexString() );
			this.__input.value = this.__color.toString();
			Common.extend( this.__input.style, {
				backgroundColor: this.__color.toHexString(),
				color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
				textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
			} );

		}
	} ] );
	return ColorController;

}( Controller );
var vendors = [ '-moz-', '-o-', '-webkit-', '-ms-', '' ];
function linearGradient( elem, x, a, b ) {

	elem.style.background = '';
	Common.each( vendors, function ( vendor ) {

		elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';

	} );

}
function hueGradient( elem ) {

	elem.style.background = '';
	elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
	elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
	elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';

}

var css = {
	load: function load( url, indoc ) {

		var doc = indoc || document;
		var link = doc.createElement( 'link' );
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = url;
		doc.getElementsByTagName( 'head' )[ 0 ].appendChild( link );

	},
	inject: function inject( cssContent, indoc ) {

		var doc = indoc || document;
		var injected = document.createElement( 'style' );
		injected.type = 'text/css';
		injected.innerHTML = cssContent;
		var head = doc.getElementsByTagName( 'head' )[ 0 ];
		try {

			head.appendChild( injected );

		} catch ( e ) {
		}

	}
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory( object, property ) {

	var initialValue = object[ property ];
	if ( Common.isArray( arguments[ 2 ] ) || Common.isObject( arguments[ 2 ] ) ) {

		return new OptionController( object, property, arguments[ 2 ] );

	}
	if ( Common.isNumber( initialValue ) ) {

		if ( Common.isNumber( arguments[ 2 ] ) && Common.isNumber( arguments[ 3 ] ) ) {

			if ( Common.isNumber( arguments[ 4 ] ) ) {

				return new NumberControllerSlider( object, property, arguments[ 2 ], arguments[ 3 ], arguments[ 4 ] );

			}
			return new NumberControllerSlider( object, property, arguments[ 2 ], arguments[ 3 ] );

		}
		if ( Common.isNumber( arguments[ 4 ] ) ) {

			return new NumberControllerBox( object, property, { min: arguments[ 2 ], max: arguments[ 3 ], step: arguments[ 4 ] } );

		}
		return new NumberControllerBox( object, property, { min: arguments[ 2 ], max: arguments[ 3 ] } );

	}
	if ( Common.isString( initialValue ) ) {

		return new StringController( object, property );

	}
	if ( Common.isFunction( initialValue ) ) {

		return new FunctionController( object, property, '' );

	}
	if ( Common.isBoolean( initialValue ) ) {

		return new BooleanController( object, property );

	}
	return null;

};

function requestAnimationFrame( callback ) {

	setTimeout( callback, 1000 / 60 );

}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {

	function CenteredDiv() {

		classCallCheck( this, CenteredDiv );
		this.backgroundElement = document.createElement( 'div' );
		Common.extend( this.backgroundElement.style, {
			backgroundColor: 'rgba(0,0,0,0.8)',
			top: 0,
			left: 0,
			display: 'none',
			zIndex: '1000',
			opacity: 0,
			WebkitTransition: 'opacity 0.2s linear',
			transition: 'opacity 0.2s linear'
		} );
		dom.makeFullscreen( this.backgroundElement );
		this.backgroundElement.style.position = 'fixed';
		this.domElement = document.createElement( 'div' );
		Common.extend( this.domElement.style, {
			position: 'fixed',
			display: 'none',
			zIndex: '1001',
			opacity: 0,
			WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
			transition: 'transform 0.2s ease-out, opacity 0.2s linear'
		} );
		document.body.appendChild( this.backgroundElement );
		document.body.appendChild( this.domElement );
		var _this = this;
		dom.bind( this.backgroundElement, 'click', function () {

			_this.hide();

		} );

	}
	createClass( CenteredDiv, [ {
		key: 'show',
		value: function show() {

			var _this = this;
			this.backgroundElement.style.display = 'block';
			this.domElement.style.display = 'block';
			this.domElement.style.opacity = 0;
			this.domElement.style.webkitTransform = 'scale(1.1)';
			this.layout();
			Common.defer( function () {

				_this.backgroundElement.style.opacity = 1;
				_this.domElement.style.opacity = 1;
				_this.domElement.style.webkitTransform = 'scale(1)';

			} );

		}
	}, {
		key: 'hide',
		value: function hide() {

			var _this = this;
			var hide = function hide() {

				_this.domElement.style.display = 'none';
				_this.backgroundElement.style.display = 'none';
				dom.unbind( _this.domElement, 'webkitTransitionEnd', hide );
				dom.unbind( _this.domElement, 'transitionend', hide );
				dom.unbind( _this.domElement, 'oTransitionEnd', hide );

			};
			dom.bind( this.domElement, 'webkitTransitionEnd', hide );
			dom.bind( this.domElement, 'transitionend', hide );
			dom.bind( this.domElement, 'oTransitionEnd', hide );
			this.backgroundElement.style.opacity = 0;
			this.domElement.style.opacity = 0;
			this.domElement.style.webkitTransform = 'scale(1.1)';

		}
	}, {
		key: 'layout',
		value: function layout() {

			this.domElement.style.left = window.innerWidth / 2 - dom.getWidth( this.domElement ) / 2 + 'px';
			this.domElement.style.top = window.innerHeight / 2 - dom.getHeight( this.domElement ) / 2 + 'px';

		}
	} ] );
	return CenteredDiv;

}();

var styleSheet = ___$insertStyle( ".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n" );

css.inject( styleSheet );
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {

	try {

		return !! window.localStorage;

	} catch ( e ) {

		return false;

	}

}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI( pars ) {

	var _this = this;
	var params = pars || {};
	this.domElement = document.createElement( 'div' );
	this.__ul = document.createElement( 'ul' );
	this.domElement.appendChild( this.__ul );
	dom.addClass( this.domElement, CSS_NAMESPACE );
	this.__folders = {};
	this.__controllers = [];
	this.__rememberedObjects = [];
	this.__rememberedObjectIndecesToControllers = [];
	this.__listening = [];
	params = Common.defaults( params, {
		closeOnTop: false,
		autoPlace: true,
		width: GUI.DEFAULT_WIDTH
	} );
	params = Common.defaults( params, {
		resizable: params.autoPlace,
		hideable: params.autoPlace
	} );
	if ( ! Common.isUndefined( params.load ) ) {

		if ( params.preset ) {

			params.load.preset = params.preset;

		}

	} else {

		params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

	}
	if ( Common.isUndefined( params.parent ) && params.hideable ) {

		hideableGuis.push( this );

	}
	params.resizable = Common.isUndefined( params.parent ) && params.resizable;
	if ( params.autoPlace && Common.isUndefined( params.scrollable ) ) {

		params.scrollable = true;

	}
	var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem( getLocalStorageHash( this, 'isLocal' ) ) === 'true';
	var saveToLocalStorage = void 0;
	var titleRow = void 0;
	Object.defineProperties( this,
		{
			parent: {
				get: function get$$1() {

					return params.parent;

				}
			},
			scrollable: {
				get: function get$$1() {

					return params.scrollable;

				}
			},
			autoPlace: {
				get: function get$$1() {

					return params.autoPlace;

				}
			},
			closeOnTop: {
				get: function get$$1() {

					return params.closeOnTop;

				}
			},
			preset: {
				get: function get$$1() {

					if ( _this.parent ) {

						return _this.getRoot().preset;

					}
					return params.load.preset;

				},
				set: function set$$1( v ) {

					if ( _this.parent ) {

						_this.getRoot().preset = v;

					} else {

						params.load.preset = v;

					}
					setPresetSelectIndex( this );
					_this.revert();

				}
			},
			width: {
				get: function get$$1() {

					return params.width;

				},
				set: function set$$1( v ) {

					params.width = v;
					setWidth( _this, v );

				}
			},
			name: {
				get: function get$$1() {

					return params.name;

				},
				set: function set$$1( v ) {

					params.name = v;
					if ( titleRow ) {

						titleRow.innerHTML = params.name;

					}

				}
			},
			closed: {
				get: function get$$1() {

					return params.closed;

				},
				set: function set$$1( v ) {

					params.closed = v;
					if ( params.closed ) {

						dom.addClass( _this.__ul, GUI.CLASS_CLOSED );

					} else {

						dom.removeClass( _this.__ul, GUI.CLASS_CLOSED );

					}
					this.onResize();
					if ( _this.__closeButton ) {

						_this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;

					}

				}
			},
			load: {
				get: function get$$1() {

					return params.load;

				}
			},
			useLocalStorage: {
				get: function get$$1() {

					return useLocalStorage;

				},
				set: function set$$1( bool ) {

					if ( SUPPORTS_LOCAL_STORAGE ) {

						useLocalStorage = bool;
						if ( bool ) {

							dom.bind( window, 'unload', saveToLocalStorage );

						} else {

							dom.unbind( window, 'unload', saveToLocalStorage );

						}
						localStorage.setItem( getLocalStorageHash( _this, 'isLocal' ), bool );

					}

				}
			}
		} );
	if ( Common.isUndefined( params.parent ) ) {

		this.closed = params.closed || false;
		dom.addClass( this.domElement, GUI.CLASS_MAIN );
		dom.makeSelectable( this.domElement, false );
		if ( SUPPORTS_LOCAL_STORAGE ) {

			if ( useLocalStorage ) {

				_this.useLocalStorage = true;
				var savedGui = localStorage.getItem( getLocalStorageHash( this, 'gui' ) );
				if ( savedGui ) {

					params.load = JSON.parse( savedGui );

				}

			}

		}
		this.__closeButton = document.createElement( 'div' );
		this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
		dom.addClass( this.__closeButton, GUI.CLASS_CLOSE_BUTTON );
		if ( params.closeOnTop ) {

			dom.addClass( this.__closeButton, GUI.CLASS_CLOSE_TOP );
			this.domElement.insertBefore( this.__closeButton, this.domElement.childNodes[ 0 ] );

		} else {

			dom.addClass( this.__closeButton, GUI.CLASS_CLOSE_BOTTOM );
			this.domElement.appendChild( this.__closeButton );

		}
		dom.bind( this.__closeButton, 'click', function () {

			_this.closed = ! _this.closed;

		} );

	} else {

		if ( params.closed === undefined ) {

			params.closed = true;

		}
		var titleRowName = document.createTextNode( params.name );
		dom.addClass( titleRowName, 'controller-name' );
		titleRow = addRow( _this, titleRowName );
		var onClickTitle = function onClickTitle( e ) {

			e.preventDefault();
			_this.closed = ! _this.closed;
			return false;

		};
		dom.addClass( this.__ul, GUI.CLASS_CLOSED );
		dom.addClass( titleRow, 'title' );
		dom.bind( titleRow, 'click', onClickTitle );
		if ( ! params.closed ) {

			this.closed = false;

		}

	}
	if ( params.autoPlace ) {

		if ( Common.isUndefined( params.parent ) ) {

			if ( autoPlaceVirgin ) {

				autoPlaceContainer = document.createElement( 'div' );
				dom.addClass( autoPlaceContainer, CSS_NAMESPACE );
				dom.addClass( autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER );
				document.body.appendChild( autoPlaceContainer );
				autoPlaceVirgin = false;

			}
			autoPlaceContainer.appendChild( this.domElement );
			dom.addClass( this.domElement, GUI.CLASS_AUTO_PLACE );

		}
		if ( ! this.parent ) {

			setWidth( _this, params.width );

		}

	}
	this.__resizeHandler = function () {

		_this.onResizeDebounced();

	};
	dom.bind( window, 'resize', this.__resizeHandler );
	dom.bind( this.__ul, 'webkitTransitionEnd', this.__resizeHandler );
	dom.bind( this.__ul, 'transitionend', this.__resizeHandler );
	dom.bind( this.__ul, 'oTransitionEnd', this.__resizeHandler );
	this.onResize();
	if ( params.resizable ) {

		addResizeHandle( this );

	}
	saveToLocalStorage = function saveToLocalStorage() {

		if ( SUPPORTS_LOCAL_STORAGE && localStorage.getItem( getLocalStorageHash( _this, 'isLocal' ) ) === 'true' ) {

			localStorage.setItem( getLocalStorageHash( _this, 'gui' ), JSON.stringify( _this.getSaveObject() ) );

		}

	};
	this.saveToLocalStorageIfPossible = saveToLocalStorage;
	function resetWidth() {

		var root = _this.getRoot();
		root.width += 1;
		Common.defer( function () {

			root.width -= 1;

		} );

	}
	if ( ! params.parent ) {

		resetWidth();

	}

};
GUI.toggleHide = function () {

	hide = ! hide;
	Common.each( hideableGuis, function ( gui ) {

		gui.domElement.style.display = hide ? 'none' : '';

	} );

};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function ( e ) {

	if ( document.activeElement.type !== 'text' && ( e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE ) ) {

		GUI.toggleHide();

	}

};
dom.bind( window, 'keydown', GUI._keydownHandler, false );
Common.extend( GUI.prototype,
	{
		add: function add( object, property ) {

			return _add( this, object, property, {
				factoryArgs: Array.prototype.slice.call( arguments, 2 )
			} );

		},
		addColor: function addColor( object, property ) {

			return _add( this, object, property, {
				color: true
			} );

		},
		remove: function remove( controller ) {

			this.__ul.removeChild( controller.__li );
			this.__controllers.splice( this.__controllers.indexOf( controller ), 1 );
			var _this = this;
			Common.defer( function () {

				_this.onResize();

			} );

		},
		destroy: function destroy() {

			if ( this.parent ) {

				throw new Error( 'Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.' );

			}
			if ( this.autoPlace ) {

				autoPlaceContainer.removeChild( this.domElement );

			}
			var _this = this;
			Common.each( this.__folders, function ( subfolder ) {

				_this.removeFolder( subfolder );

			} );
			dom.unbind( window, 'keydown', GUI._keydownHandler, false );
			removeListeners( this );

		},
		addFolder: function addFolder( name ) {

			if ( this.__folders[ name ] !== undefined ) {

				throw new Error( 'You already have a folder in this GUI by the' + ' name "' + name + '"' );

			}
			var newGuiParams = { name: name, parent: this };
			newGuiParams.autoPlace = this.autoPlace;
			if ( this.load &&
    this.load.folders &&
    this.load.folders[ name ] ) {

				newGuiParams.closed = this.load.folders[ name ].closed;
				newGuiParams.load = this.load.folders[ name ];

			}
			var gui = new GUI( newGuiParams );
			this.__folders[ name ] = gui;
			var li = addRow( this, gui.domElement );
			dom.addClass( li, 'folder' );
			return gui;

		},
		removeFolder: function removeFolder( folder ) {

			this.__ul.removeChild( folder.domElement.parentElement );
			delete this.__folders[ folder.name ];
			if ( this.load &&
    this.load.folders &&
    this.load.folders[ folder.name ] ) {

				delete this.load.folders[ folder.name ];

			}
			removeListeners( folder );
			var _this = this;
			Common.each( folder.__folders, function ( subfolder ) {

				folder.removeFolder( subfolder );

			} );
			Common.defer( function () {

				_this.onResize();

			} );

		},
		open: function open() {

			this.closed = false;

		},
		close: function close() {

			this.closed = true;

		},
		hide: function hide() {

			this.domElement.style.display = 'none';

		},
		show: function show() {

			this.domElement.style.display = '';

		},
		onResize: function onResize() {

			var root = this.getRoot();
			if ( root.scrollable ) {

				var top = dom.getOffset( root.__ul ).top;
				var h = 0;
				Common.each( root.__ul.childNodes, function ( node ) {

					if ( ! ( root.autoPlace && node === root.__save_row ) ) {

						h += dom.getHeight( node );

					}

				} );
				if ( window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h ) {

					dom.addClass( root.domElement, GUI.CLASS_TOO_TALL );
					root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';

				} else {

					dom.removeClass( root.domElement, GUI.CLASS_TOO_TALL );
					root.__ul.style.height = 'auto';

				}

			}
			if ( root.__resize_handle ) {

				Common.defer( function () {

					root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';

				} );

			}
			if ( root.__closeButton ) {

				root.__closeButton.style.width = root.width + 'px';

			}

		},
		onResizeDebounced: Common.debounce( function () {

			this.onResize();

		}, 50 ),
		remember: function remember() {

			if ( Common.isUndefined( SAVE_DIALOGUE ) ) {

				SAVE_DIALOGUE = new CenteredDiv();
				SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;

			}
			if ( this.parent ) {

				throw new Error( 'You can only call remember on a top level GUI.' );

			}
			var _this = this;
			Common.each( Array.prototype.slice.call( arguments ), function ( object ) {

				if ( _this.__rememberedObjects.length === 0 ) {

					addSaveMenu( _this );

				}
				if ( _this.__rememberedObjects.indexOf( object ) === - 1 ) {

					_this.__rememberedObjects.push( object );

				}

			} );
			if ( this.autoPlace ) {

				setWidth( this, this.width );

			}

		},
		getRoot: function getRoot() {

			var gui = this;
			while ( gui.parent ) {

				gui = gui.parent;

			}
			return gui;

		},
		getSaveObject: function getSaveObject() {

			var toReturn = this.load;
			toReturn.closed = this.closed;
			if ( this.__rememberedObjects.length > 0 ) {

				toReturn.preset = this.preset;
				if ( ! toReturn.remembered ) {

					toReturn.remembered = {};

				}
				toReturn.remembered[ this.preset ] = getCurrentPreset( this );

			}
			toReturn.folders = {};
			Common.each( this.__folders, function ( element, key ) {

				toReturn.folders[ key ] = element.getSaveObject();

			} );
			return toReturn;

		},
		save: function save() {

			if ( ! this.load.remembered ) {

				this.load.remembered = {};

			}
			this.load.remembered[ this.preset ] = getCurrentPreset( this );
			markPresetModified( this, false );
			this.saveToLocalStorageIfPossible();

		},
		saveAs: function saveAs( presetName ) {

			if ( ! this.load.remembered ) {

				this.load.remembered = {};
				this.load.remembered[ DEFAULT_DEFAULT_PRESET_NAME ] = getCurrentPreset( this, true );

			}
			this.load.remembered[ presetName ] = getCurrentPreset( this );
			this.preset = presetName;
			addPresetOption( this, presetName, true );
			this.saveToLocalStorageIfPossible();

		},
		revert: function revert( gui ) {

			Common.each( this.__controllers, function ( controller ) {

				if ( ! this.getRoot().load.remembered ) {

					controller.setValue( controller.initialValue );

				} else {

					recallSavedValue( gui || this.getRoot(), controller );

				}
				if ( controller.__onFinishChange ) {

					controller.__onFinishChange.call( controller, controller.getValue() );

				}

			}, this );
			Common.each( this.__folders, function ( folder ) {

				folder.revert( folder );

			} );
			if ( ! gui ) {

				markPresetModified( this.getRoot(), false );

			}

		},
		listen: function listen( controller ) {

			var init = this.__listening.length === 0;
			this.__listening.push( controller );
			if ( init ) {

				updateDisplays( this.__listening );

			}

		},
		updateDisplay: function updateDisplay() {

			Common.each( this.__controllers, function ( controller ) {

				controller.updateDisplay();

			} );
			Common.each( this.__folders, function ( folder ) {

				folder.updateDisplay();

			} );

		}
	} );
function addRow( gui, newDom, liBefore ) {

	var li = document.createElement( 'li' );
	if ( newDom ) {

		li.appendChild( newDom );

	}
	if ( liBefore ) {

		gui.__ul.insertBefore( li, liBefore );

	} else {

		gui.__ul.appendChild( li );

	}
	gui.onResize();
	return li;

}
function removeListeners( gui ) {

	dom.unbind( window, 'resize', gui.__resizeHandler );
	if ( gui.saveToLocalStorageIfPossible ) {

		dom.unbind( window, 'unload', gui.saveToLocalStorageIfPossible );

	}

}
function markPresetModified( gui, modified ) {

	var opt = gui.__preset_select[ gui.__preset_select.selectedIndex ];
	if ( modified ) {

		opt.innerHTML = opt.value + '*';

	} else {

		opt.innerHTML = opt.value;

	}

}
function augmentController( gui, li, controller ) {

	controller.__li = li;
	controller.__gui = gui;
	Common.extend( controller, {
		options: function options( _options ) {

			if ( arguments.length > 1 ) {

				var nextSibling = controller.__li.nextElementSibling;
				controller.remove();
				return _add( gui, controller.object, controller.property, {
					before: nextSibling,
					factoryArgs: [ Common.toArray( arguments ) ]
				} );

			}
			if ( Common.isArray( _options ) || Common.isObject( _options ) ) {

				var _nextSibling = controller.__li.nextElementSibling;
				controller.remove();
				return _add( gui, controller.object, controller.property, {
					before: _nextSibling,
					factoryArgs: [ _options ]
				} );

			}

		},
		name: function name( _name ) {

			controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
			return controller;

		},
		listen: function listen() {

			controller.__gui.listen( controller );
			return controller;

		},
		remove: function remove() {

			controller.__gui.remove( controller );
			return controller;

		}
	} );
	if ( controller instanceof NumberControllerSlider ) {

		var box = new NumberControllerBox( controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step } );
		Common.each( [ 'updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max' ], function ( method ) {

			var pc = controller[ method ];
			var pb = box[ method ];
			controller[ method ] = box[ method ] = function () {

				var args = Array.prototype.slice.call( arguments );
				pb.apply( box, args );
				return pc.apply( controller, args );

			};

		} );
		dom.addClass( li, 'has-slider' );
		controller.domElement.insertBefore( box.domElement, controller.domElement.firstElementChild );

	} else if ( controller instanceof NumberControllerBox ) {

		var r = function r( returned ) {

			if ( Common.isNumber( controller.__min ) && Common.isNumber( controller.__max ) ) {

				var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
				var wasListening = controller.__gui.__listening.indexOf( controller ) > - 1;
				controller.remove();
				var newController = _add( gui, controller.object, controller.property, {
					before: controller.__li.nextElementSibling,
					factoryArgs: [ controller.__min, controller.__max, controller.__step ]
				} );
				newController.name( oldName );
				if ( wasListening ) newController.listen();
				return newController;

			}
			return returned;

		};
		controller.min = Common.compose( r, controller.min );
		controller.max = Common.compose( r, controller.max );

	} else if ( controller instanceof BooleanController ) {

		dom.bind( li, 'click', function () {

			dom.fakeEvent( controller.__checkbox, 'click' );

		} );
		dom.bind( controller.__checkbox, 'click', function ( e ) {

			e.stopPropagation();

		} );

	} else if ( controller instanceof FunctionController ) {

		dom.bind( li, 'click', function () {

			dom.fakeEvent( controller.__button, 'click' );

		} );
		dom.bind( li, 'mouseover', function () {

			dom.addClass( controller.__button, 'hover' );

		} );
		dom.bind( li, 'mouseout', function () {

			dom.removeClass( controller.__button, 'hover' );

		} );

	} else if ( controller instanceof ColorController ) {

		dom.addClass( li, 'color' );
		controller.updateDisplay = Common.compose( function ( val ) {

			li.style.borderLeftColor = controller.__color.toString();
			return val;

		}, controller.updateDisplay );
		controller.updateDisplay();

	}
	controller.setValue = Common.compose( function ( val ) {

		if ( gui.getRoot().__preset_select && controller.isModified() ) {

			markPresetModified( gui.getRoot(), true );

		}
		return val;

	}, controller.setValue );

}
function recallSavedValue( gui, controller ) {

	var root = gui.getRoot();
	var matchedIndex = root.__rememberedObjects.indexOf( controller.object );
	if ( matchedIndex !== - 1 ) {

		var controllerMap = root.__rememberedObjectIndecesToControllers[ matchedIndex ];
		if ( controllerMap === undefined ) {

			controllerMap = {};
			root.__rememberedObjectIndecesToControllers[ matchedIndex ] = controllerMap;

		}
		controllerMap[ controller.property ] = controller;
		if ( root.load && root.load.remembered ) {

			var presetMap = root.load.remembered;
			var preset = void 0;
			if ( presetMap[ gui.preset ] ) {

				preset = presetMap[ gui.preset ];

			} else if ( presetMap[ DEFAULT_DEFAULT_PRESET_NAME ] ) {

				preset = presetMap[ DEFAULT_DEFAULT_PRESET_NAME ];

			} else {

				return;

			}
			if ( preset[ matchedIndex ] && preset[ matchedIndex ][ controller.property ] !== undefined ) {

				var value = preset[ matchedIndex ][ controller.property ];
				controller.initialValue = value;
				controller.setValue( value );

			}

		}

	}

}
function _add( gui, object, property, params ) {

	if ( object[ property ] === undefined ) {

		throw new Error( 'Object "' + object + '" has no property "' + property + '"' );

	}
	var controller = void 0;
	if ( params.color ) {

		controller = new ColorController( object, property );

	} else {

		var factoryArgs = [ object, property ].concat( params.factoryArgs );
		controller = ControllerFactory.apply( gui, factoryArgs );

	}
	if ( params.before instanceof Controller ) {

		params.before = params.before.__li;

	}
	recallSavedValue( gui, controller );
	dom.addClass( controller.domElement, 'c' );
	var name = document.createElement( 'span' );
	dom.addClass( name, 'property-name' );
	name.innerHTML = controller.property;
	var container = document.createElement( 'div' );
	container.appendChild( name );
	container.appendChild( controller.domElement );
	var li = addRow( gui, container, params.before );
	dom.addClass( li, GUI.CLASS_CONTROLLER_ROW );
	if ( controller instanceof ColorController ) {

		dom.addClass( li, 'color' );

	} else {

		dom.addClass( li, _typeof( controller.getValue() ) );

	}
	augmentController( gui, li, controller );
	gui.__controllers.push( controller );
	return controller;

}
function getLocalStorageHash( gui, key ) {

	return document.location.href + '.' + key;

}
function addPresetOption( gui, name, setSelected ) {

	var opt = document.createElement( 'option' );
	opt.innerHTML = name;
	opt.value = name;
	gui.__preset_select.appendChild( opt );
	if ( setSelected ) {

		gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;

	}

}
function showHideExplain( gui, explain ) {

	explain.style.display = gui.useLocalStorage ? 'block' : 'none';

}
function addSaveMenu( gui ) {

	var div = gui.__save_row = document.createElement( 'li' );
	dom.addClass( gui.domElement, 'has-save' );
	gui.__ul.insertBefore( div, gui.__ul.firstChild );
	dom.addClass( div, 'save-row' );
	var gears = document.createElement( 'span' );
	gears.innerHTML = '&nbsp;';
	dom.addClass( gears, 'button gears' );
	var button = document.createElement( 'span' );
	button.innerHTML = 'Save';
	dom.addClass( button, 'button' );
	dom.addClass( button, 'save' );
	var button2 = document.createElement( 'span' );
	button2.innerHTML = 'New';
	dom.addClass( button2, 'button' );
	dom.addClass( button2, 'save-as' );
	var button3 = document.createElement( 'span' );
	button3.innerHTML = 'Revert';
	dom.addClass( button3, 'button' );
	dom.addClass( button3, 'revert' );
	var select = gui.__preset_select = document.createElement( 'select' );
	if ( gui.load && gui.load.remembered ) {

		Common.each( gui.load.remembered, function ( value, key ) {

			addPresetOption( gui, key, key === gui.preset );

		} );

	} else {

		addPresetOption( gui, DEFAULT_DEFAULT_PRESET_NAME, false );

	}
	dom.bind( select, 'change', function () {

		for ( var index = 0; index < gui.__preset_select.length; index ++ ) {

			gui.__preset_select[ index ].innerHTML = gui.__preset_select[ index ].value;

		}
		gui.preset = this.value;

	} );
	div.appendChild( select );
	div.appendChild( gears );
	div.appendChild( button );
	div.appendChild( button2 );
	div.appendChild( button3 );
	if ( SUPPORTS_LOCAL_STORAGE ) {

		var explain = document.getElementById( 'dg-local-explain' );
		var localStorageCheckBox = document.getElementById( 'dg-local-storage' );
		var saveLocally = document.getElementById( 'dg-save-locally' );
		saveLocally.style.display = 'block';
		if ( localStorage.getItem( getLocalStorageHash( gui, 'isLocal' ) ) === 'true' ) {

			localStorageCheckBox.setAttribute( 'checked', 'checked' );

		}
		showHideExplain( gui, explain );
		dom.bind( localStorageCheckBox, 'change', function () {

			gui.useLocalStorage = ! gui.useLocalStorage;
			showHideExplain( gui, explain );

		} );

	}
	var newConstructorTextArea = document.getElementById( 'dg-new-constructor' );
	dom.bind( newConstructorTextArea, 'keydown', function ( e ) {

		if ( e.metaKey && ( e.which === 67 || e.keyCode === 67 ) ) {

			SAVE_DIALOGUE.hide();

		}

	} );
	dom.bind( gears, 'click', function () {

		newConstructorTextArea.innerHTML = JSON.stringify( gui.getSaveObject(), undefined, 2 );
		SAVE_DIALOGUE.show();
		newConstructorTextArea.focus();
		newConstructorTextArea.select();

	} );
	dom.bind( button, 'click', function () {

		gui.save();

	} );
	dom.bind( button2, 'click', function () {

		var presetName = prompt( 'Enter a new preset name.' );
		if ( presetName ) {

			gui.saveAs( presetName );

		}

	} );
	dom.bind( button3, 'click', function () {

		gui.revert();

	} );

}
function addResizeHandle( gui ) {

	var pmouseX = void 0;
	gui.__resize_handle = document.createElement( 'div' );
	Common.extend( gui.__resize_handle.style, {
		width: '6px',
		marginLeft: '-3px',
		height: '200px',
		cursor: 'ew-resize',
		position: 'absolute'
	} );
	function drag( e ) {

		e.preventDefault();
		gui.width += pmouseX - e.clientX;
		gui.onResize();
		pmouseX = e.clientX;
		return false;

	}
	function dragStop() {

		dom.removeClass( gui.__closeButton, GUI.CLASS_DRAG );
		dom.unbind( window, 'mousemove', drag );
		dom.unbind( window, 'mouseup', dragStop );

	}
	function dragStart( e ) {

		e.preventDefault();
		pmouseX = e.clientX;
		dom.addClass( gui.__closeButton, GUI.CLASS_DRAG );
		dom.bind( window, 'mousemove', drag );
		dom.bind( window, 'mouseup', dragStop );
		return false;

	}
	dom.bind( gui.__resize_handle, 'mousedown', dragStart );
	dom.bind( gui.__closeButton, 'mousedown', dragStart );
	gui.domElement.insertBefore( gui.__resize_handle, gui.domElement.firstElementChild );

}
function setWidth( gui, w ) {

	gui.domElement.style.width = w + 'px';
	if ( gui.__save_row && gui.autoPlace ) {

		gui.__save_row.style.width = w + 'px';

	}
	if ( gui.__closeButton ) {

		gui.__closeButton.style.width = w + 'px';

	}

}
function getCurrentPreset( gui, useInitialValues ) {

	var toReturn = {};
	Common.each( gui.__rememberedObjects, function ( val, index ) {

		var savedValues = {};
		var controllerMap = gui.__rememberedObjectIndecesToControllers[ index ];
		Common.each( controllerMap, function ( controller, property ) {

			savedValues[ property ] = useInitialValues ? controller.initialValue : controller.getValue();

		} );
		toReturn[ index ] = savedValues;

	} );
	return toReturn;

}
function setPresetSelectIndex( gui ) {

	for ( var index = 0; index < gui.__preset_select.length; index ++ ) {

		if ( gui.__preset_select[ index ].value === gui.preset ) {

			gui.__preset_select.selectedIndex = index;

		}

	}

}
function updateDisplays( controllerArray ) {

	if ( controllerArray.length !== 0 ) {

		requestAnimationFrame$1.call( window, function () {

			updateDisplays( controllerArray );

		} );

	}
	Common.each( controllerArray, function ( c ) {

		c.updateDisplay();

	} );

}

var color = {
	Color: Color,
	math: ColorMath,
	interpret: interpret
};
var controllers = {
	Controller: Controller,
	BooleanController: BooleanController,
	OptionController: OptionController,
	StringController: StringController,
	NumberController: NumberController,
	NumberControllerBox: NumberControllerBox,
	NumberControllerSlider: NumberControllerSlider,
	FunctionController: FunctionController,
	ColorController: ColorController
};
var dom$1 = { dom: dom };
var gui = { GUI: GUI };
var GUI$1 = GUI;
var index = {
	color: color,
	controllers: controllers,
	dom: dom$1,
	gui: gui,
	GUI: GUI$1
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);


/***/ }),

/***/ "./node_modules/three/examples/jsm/libs/stats.module.js":
/*!**************************************************************!*\
  !*** ./node_modules/three/examples/jsm/libs/stats.module.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time >= prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
		TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
		GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
		GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Stats);


/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/***/ ((module) => {

module.exports = THREE;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************************!*\
  !*** ./src/06-instance-experiments/index.ts ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_libs_stats_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/libs/stats.module */ "./node_modules/three/examples/jsm/libs/stats.module.js");
/* harmony import */ var three_examples_jsm_libs_dat_gui_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/libs/dat.gui.module */ "./node_modules/three/examples/jsm/libs/dat.gui.module.js");




function main() {
    // setup
    const canvas = document.querySelector('#c');
    const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({
        canvas: canvas,
        // antialias: true,
    });
    renderer.autoClear = false; // don't think this helps anything relevant...
    const scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
    scene.background = new three__WEBPACK_IMPORTED_MODULE_0__.Color(0xffffff);
    let camera;
    {
        const fov = 75;
        const aspect = 2; // the canvas default
        const near = 0.1;
        const far = 1000;
        camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(fov, aspect, near, far);
    }
    camera.position.set(-7, 20, -10);
    let controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls(camera, renderer.domElement);
    controls.target.set(5, 8, 5);
    // stuff setup later
    let instancedMesh;
    let instancedMeshes = [];
    // stats
    let stats = (0,three_examples_jsm_libs_stats_module__WEBPACK_IMPORTED_MODULE_2__.default)();
    stats.dom.id = 'stats';
    let statsContainer = document.querySelector(".stats-container");
    if (statsContainer) {
        statsContainer.appendChild(stats.dom);
    }
    // stuff gui will modify
    let params = { 'lightIntensity': 1.2 };
    let light;
    // GUI
    let gui = new three_examples_jsm_libs_dat_gui_module__WEBPACK_IMPORTED_MODULE_3__.GUI({ autoPlace: false });
    gui.domElement.id = 'gui';
    let guiContainer = document.querySelector(".gui-container");
    if (guiContainer) {
        guiContainer.appendChild(gui.domElement);
    }
    let curKind = 'cube';
    // @ts-ignore
    gui.add(params, 'lightIntensity', 0, 10).onChange(function (value) {
        light.intensity = value;
    });
    // build the scene
    {
        // ground
        {
            const groundGeom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(50, 50);
            const groundMat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshPhongMaterial({ color: 0xeeeeee });
            const groundMesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(groundGeom, groundMat);
            // by default, it lives in the XY plane. we're using Y-up, so make it live in
            // the XZ plane.
            groundMesh.rotation.x = -Math.PI / 2;
            scene.add(groundMesh);
        }
        // ambient light
        {
            const ambientLight = new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight('white', 0.25);
            scene.add(ambientLight);
        }
        // main light
        {
            const color = 0x887777;
            const intensity = 1.2;
            light = new three__WEBPACK_IMPORTED_MODULE_0__.DirectionalLight(color, intensity);
            light.position.set(0, 10, -10);
            scene.add(light);
        }
        // sphere
        {
            // const geom = new THREE.SphereGeometry(2, 20, 20);
            // const mat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
            // const sphere = new THREE.Mesh(geom, mat);
            // sphere.position.setY(3);
            // scene.add(sphere);
        }
        function arrangeInstances(kind, mesh, n, size) {
            const matrix = new three__WEBPACK_IMPORTED_MODULE_0__.Matrix4();
            const cubeRoot = Math.ceil(Math.cbrt(n));
            const squareRoot = Math.ceil(Math.sqrt(n));
            const spacing = 2.0;
            for (let i = 0; i < n; i++) {
                if (kind == 'cube') {
                    matrix.setPosition((i % cubeRoot) * spacing * size, Math.floor(i / cubeRoot) % cubeRoot * spacing * size, Math.floor(i / (cubeRoot * cubeRoot)) * spacing * size);
                }
                else if (kind == 'plane') {
                    matrix.setPosition((i % squareRoot) * spacing * size, Math.floor(i / squareRoot) % squareRoot * spacing * size, 0);
                }
                else {
                    console.error("Unknown arrangement kind:", kind);
                    return;
                }
                instancedMesh.setMatrixAt(i, matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
        }
        // instance settings
        const n = 800000;
        const size = 0.1;
        // let planeGroup = new THREE.Group(), cubeGroup = new THREE.Group();
        // instances: single container
        if (true) {
            const geom = new three__WEBPACK_IMPORTED_MODULE_0__.BoxGeometry(size, size, size);
            // change material here
            // const mat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
            // mat.shininess = 80;
            const mat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshLambertMaterial({ color: 0xff0000 });
            // const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            instancedMesh = new three__WEBPACK_IMPORTED_MODULE_0__.InstancedMesh(geom, mat, n);
            arrangeInstances(curKind, instancedMesh, n, size);
            scene.add(instancedMesh);
            instancedMesh.frustumCulled;
        }
        const nContainers = 100;
        // instances: multiple containers
        if (false) {}
        function editorGUIClick(kind) {
            if (curKind == kind) {
                return;
            }
            arrangeInstances(kind, instancedMesh, n, size);
            curKind = kind;
        }
        // actual editing GUI
        let editingGUIContainer = document.querySelector(".editing-gui-container");
        if (editingGUIContainer) {
            let editingGUI = document.createElement("div");
            editingGUI.id = "editing-gui";
            let worklist = [
                ['light-gray', 'plane'],
                ['light-gray', 'cube'],
            ];
            for (let [color, kind] of worklist) {
                let button = document.createElement("button");
                button.className = `h3 w4 ba bw2 b--white bg-${color} br4 pointer shadow-5 ml3`;
                button.innerText = kind;
                button.onclick = editorGUIClick.bind(button, kind);
                editingGUI.appendChild(button);
            }
            editingGUIContainer.appendChild(editingGUI);
        }
        // for console access
        Object.assign(window, {
            mesh: instancedMesh,
            meshes: instancedMeshes,
            camera: camera,
            renderer: renderer,
        });
    }
    // render helper: resizing if needed
    function maybeResize() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
    }
    const updateMatrix = new three__WEBPACK_IMPORTED_MODULE_0__.Matrix4();
    function update() {
        // single instanced mesh
        // instancedMesh.instanceMatrix.needsUpdate = true;
        // multiple instanced meshes
        let nToUpdate = 0;
        for (let i = 0; i < nToUpdate; i++) {
            updateMatrix.setPosition(Math.random() * -1, Math.random(), Math.random() * -1);
            instancedMeshes[i].setMatrixAt(42, updateMatrix);
            instancedMeshes[i].instanceMatrix.needsUpdate = true;
        }
    }
    function render(time_ms) {
        stats.begin();
        // logic
        update();
        // infrastructure updates & render
        maybeResize();
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        stats.end();
    }
    // kick off
    requestAnimationFrame(render);
}
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYmZvcmJlcy0zanMtZXhwZXJpbWVudHMvLi9ub2RlX21vZHVsZXMvdGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vbWJmb3JiZXMtM2pzLWV4cGVyaW1lbnRzLy4vbm9kZV9tb2R1bGVzL3RocmVlL2V4YW1wbGVzL2pzbS9saWJzL2RhdC5ndWkubW9kdWxlLmpzIiwid2VicGFjazovL21iZm9yYmVzLTNqcy1leHBlcmltZW50cy8uL25vZGVfbW9kdWxlcy90aHJlZS9leGFtcGxlcy9qc20vbGlicy9zdGF0cy5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vbWJmb3JiZXMtM2pzLWV4cGVyaW1lbnRzL2V4dGVybmFsIFwiVEhSRUVcIiIsIndlYnBhY2s6Ly9tYmZvcmJlcy0zanMtZXhwZXJpbWVudHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWJmb3JiZXMtM2pzLWV4cGVyaW1lbnRzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL21iZm9yYmVzLTNqcy1leHBlcmltZW50cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWJmb3JiZXMtM2pzLWV4cGVyaW1lbnRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWJmb3JiZXMtM2pzLWV4cGVyaW1lbnRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWJmb3JiZXMtM2pzLWV4cGVyaW1lbnRzLy4vc3JjLzA2LWluc3RhbmNlLWV4cGVyaW1lbnRzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCLHFC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QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOzs7QUFHQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxJQUFJOztBQUVKO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLG9FQUFvRTs7QUFFcEU7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxJQUFJOztBQUVKOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLElBQUk7O0FBRUo7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxTQUFTLDhDQUFXOztBQUVwQjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxTQUFTLCtDQUFZOztBQUVyQjs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxNQUFNOztBQUVOOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLFNBQVMsNENBQVM7O0FBRWxCOztBQUVBOztBQUVBOztBQUVBOztBQUVBLE1BQU07O0FBRU47O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsV0FBVywrQ0FBWTs7QUFFdkI7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsV0FBVyw0Q0FBUzs7QUFFcEI7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsV0FBVyxrREFBZTs7QUFFMUI7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsV0FBVyxxREFBa0I7O0FBRTdCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLG1CQUFtQixxQkFBcUI7O0FBRXhDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsbUJBQW1CLDBDQUFPO0FBQzFCOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSw2REFBNkQsaUJBQWlCOztBQUU5RTs7QUFFQTs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsa0NBQWtDOztBQUVsQywyQkFBMkIsNENBQVM7QUFDcEMsNEJBQTRCLCtDQUFZOztBQUV4QyxxQkFBcUIsNENBQVM7QUFDOUIscUJBQXFCLHFEQUFrQjs7QUFFdkM7O0FBRUE7O0FBRXNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzd3Q3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7O0FBRUY7O0FBRUEsRUFBRTs7QUFFRjs7QUFFQSxFQUFFOztBQUVGOztBQUVBLEVBQUU7O0FBRUY7O0FBRUEsRUFBRTs7QUFFRjs7QUFFQSxFQUFFOztBQUVGLFdBQVcsb0NBQW9DOztBQUUvQyxFQUFFOztBQUVGLFdBQVcsZ0RBQWdEOztBQUUzRCxFQUFFOztBQUVGLFdBQVcsb0NBQW9DOztBQUUvQyxFQUFFOztBQUVGLFdBQVcsZ0RBQWdEOztBQUUzRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLElBQUk7O0FBRUosR0FBRztBQUNIOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLElBQUk7O0FBRUosR0FBRztBQUNIOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbUNBQW1DLFFBQVE7O0FBRTNDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7O0FBRTFDOztBQUVBOztBQUVBOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7O0FBRUY7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBLDZDQUE2QyxFQUFFO0FBQy9DOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDs7QUFFQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxJQUFJO0FBQ0o7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxrQkFBa0Isa0JBQWtCOztBQUVwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOzs7Ozs7OztBQVFEOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQTs7QUFFQSxFQUFFOztBQUVGOztBQUVBLEVBQUU7O0FBRUY7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBOztBQUVBOztBQUVBOztBQUVBLEVBQUU7O0FBRUY7O0FBRUEsRUFBRTs7QUFFRjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7O0FBRUY7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0EsRUFBRTtBQUNGOztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsRUFBRTs7QUFFRixDQUFDO0FBQ0Q7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsRUFBRTtBQUNGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSTs7QUFFSjtBQUNBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJOztBQUVKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxJQUFJOztBQUVKOztBQUVBOztBQUVBLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjs7QUFFQSxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVLQUF1SyxpQ0FBaUM7QUFDeE07QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxFQUFFO0FBQ0Y7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLEdBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVBOztBQUVBLElBQUk7O0FBRUosR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBLElBQUk7O0FBRUosR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQTtBQUNBOztB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QUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTs7QUFFQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxNQUFNOztBQUVOOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsT0FBTzs7QUFFUDs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVILEVBQUU7O0FBRUY7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJOztBQUVKLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSixHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSixHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBSTtBQUNKO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLElBQUk7QUFDSjs7QUFFQTs7QUFFQSxJQUFJOztBQUVKLEdBQUc7QUFDSDs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUEsR0FBRztBQUNIOztBQUVBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLElBQUk7QUFDSjs7QUFFQTs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxJQUFJO0FBQ0o7O0FBRUEsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxJQUFJO0FBQ0o7O0FBRUE7O0FBRUEsSUFBSTtBQUNKOztBQUVBOztBQUVBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRztBQUNIOztBQUVBOztBQUVBOztBQUVBLElBQUk7QUFDSjs7QUFFQTs7QUFFQSxJQUFJOztBQUVKO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxFQUFFOztBQUVGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLEVBQUU7O0FBRUY7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTtBQUNGOztBQUVBLDhFQUE4RSx3RUFBd0U7QUFDdEo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSxFQUFFOztBQUVGOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTs7QUFFRjs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSCxFQUFFOztBQUVGOztBQUVBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSCxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsSUFBSTs7QUFFSjs7QUFFQSxJQUFJOztBQUVKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLEVBQUU7O0FBRUY7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxFQUFFOztBQUVGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxHQUFHOztBQUVILEVBQUU7O0FBRUY7O0FBRUE7QUFDQTs7QUFFQSxzQkFBc0Isb0NBQW9DOztBQUUxRDs7QUFFQTtBQUNBOztBQUVBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRTtBQUNGOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLEVBQUU7QUFDRjs7QUFFQTs7QUFFQSxFQUFFOztBQUVGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRztBQUNIOztBQUVBLEVBQUU7QUFDRjs7QUFFQTtBQUNBOztBQUVBLHFCQUFxQixvQ0FBb0M7O0FBRXpEOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBOztBQUVBLEVBQUU7O0FBRUY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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VCxrQ0FBa0M7UUFDbEMsV0FBVyxFQUFFO1FBQ2IsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBR2xCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRy9CLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsV0FBVztJQUNYLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiIwNi1pbnN0YW5jZS1leHBlcmltZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEV2ZW50RGlzcGF0Y2hlcixcblx0TU9VU0UsXG5cdFF1YXRlcm5pb24sXG5cdFNwaGVyaWNhbCxcblx0VE9VQ0gsXG5cdFZlY3RvcjIsXG5cdFZlY3RvcjNcbn0gZnJvbSAndGhyZWUnO1xuXG4vLyBUaGlzIHNldCBvZiBjb250cm9scyBwZXJmb3JtcyBvcmJpdGluZywgZG9sbHlpbmcgKHpvb21pbmcpLCBhbmQgcGFubmluZy5cbi8vIFVubGlrZSBUcmFja2JhbGxDb250cm9scywgaXQgbWFpbnRhaW5zIHRoZSBcInVwXCIgZGlyZWN0aW9uIG9iamVjdC51cCAoK1kgYnkgZGVmYXVsdCkuXG4vL1xuLy8gICAgT3JiaXQgLSBsZWZ0IG1vdXNlIC8gdG91Y2g6IG9uZS1maW5nZXIgbW92ZVxuLy8gICAgWm9vbSAtIG1pZGRsZSBtb3VzZSwgb3IgbW91c2V3aGVlbCAvIHRvdWNoOiB0d28tZmluZ2VyIHNwcmVhZCBvciBzcXVpc2hcbi8vICAgIFBhbiAtIHJpZ2h0IG1vdXNlLCBvciBsZWZ0IG1vdXNlICsgY3RybC9tZXRhL3NoaWZ0S2V5LCBvciBhcnJvdyBrZXlzIC8gdG91Y2g6IHR3by1maW5nZXIgbW92ZVxuXG5jb25zdCBfY2hhbmdlRXZlbnQgPSB7IHR5cGU6ICdjaGFuZ2UnIH07XG5jb25zdCBfc3RhcnRFdmVudCA9IHsgdHlwZTogJ3N0YXJ0JyB9O1xuY29uc3QgX2VuZEV2ZW50ID0geyB0eXBlOiAnZW5kJyB9O1xuXG5jbGFzcyBPcmJpdENvbnRyb2xzIGV4dGVuZHMgRXZlbnREaXNwYXRjaGVyIHtcblxuXHRjb25zdHJ1Y3Rvciggb2JqZWN0LCBkb21FbGVtZW50ICkge1xuXG5cdFx0c3VwZXIoKTtcblxuXHRcdGlmICggZG9tRWxlbWVudCA9PT0gdW5kZWZpbmVkICkgY29uc29sZS53YXJuKCAnVEhSRUUuT3JiaXRDb250cm9sczogVGhlIHNlY29uZCBwYXJhbWV0ZXIgXCJkb21FbGVtZW50XCIgaXMgbm93IG1hbmRhdG9yeS4nICk7XG5cdFx0aWYgKCBkb21FbGVtZW50ID09PSBkb2N1bWVudCApIGNvbnNvbGUuZXJyb3IoICdUSFJFRS5PcmJpdENvbnRyb2xzOiBcImRvY3VtZW50XCIgc2hvdWxkIG5vdCBiZSB1c2VkIGFzIHRoZSB0YXJnZXQgXCJkb21FbGVtZW50XCIuIFBsZWFzZSB1c2UgXCJyZW5kZXJlci5kb21FbGVtZW50XCIgaW5zdGVhZC4nICk7XG5cblx0XHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0XHR0aGlzLmRvbUVsZW1lbnQgPSBkb21FbGVtZW50O1xuXHRcdHRoaXMuZG9tRWxlbWVudC5zdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJzsgLy8gZGlzYWJsZSB0b3VjaCBzY3JvbGxcblxuXHRcdC8vIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHRoaXMgY29udHJvbFxuXHRcdHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cblx0XHQvLyBcInRhcmdldFwiIHNldHMgdGhlIGxvY2F0aW9uIG9mIGZvY3VzLCB3aGVyZSB0aGUgb2JqZWN0IG9yYml0cyBhcm91bmRcblx0XHR0aGlzLnRhcmdldCA9IG5ldyBWZWN0b3IzKCk7XG5cblx0XHQvLyBIb3cgZmFyIHlvdSBjYW4gZG9sbHkgaW4gYW5kIG91dCAoIFBlcnNwZWN0aXZlQ2FtZXJhIG9ubHkgKVxuXHRcdHRoaXMubWluRGlzdGFuY2UgPSAwO1xuXHRcdHRoaXMubWF4RGlzdGFuY2UgPSBJbmZpbml0eTtcblxuXHRcdC8vIEhvdyBmYXIgeW91IGNhbiB6b29tIGluIGFuZCBvdXQgKCBPcnRob2dyYXBoaWNDYW1lcmEgb25seSApXG5cdFx0dGhpcy5taW5ab29tID0gMDtcblx0XHR0aGlzLm1heFpvb20gPSBJbmZpbml0eTtcblxuXHRcdC8vIEhvdyBmYXIgeW91IGNhbiBvcmJpdCB2ZXJ0aWNhbGx5LCB1cHBlciBhbmQgbG93ZXIgbGltaXRzLlxuXHRcdC8vIFJhbmdlIGlzIDAgdG8gTWF0aC5QSSByYWRpYW5zLlxuXHRcdHRoaXMubWluUG9sYXJBbmdsZSA9IDA7IC8vIHJhZGlhbnNcblx0XHR0aGlzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJOyAvLyByYWRpYW5zXG5cblx0XHQvLyBIb3cgZmFyIHlvdSBjYW4gb3JiaXQgaG9yaXpvbnRhbGx5LCB1cHBlciBhbmQgbG93ZXIgbGltaXRzLlxuXHRcdC8vIElmIHNldCwgdGhlIGludGVydmFsIFsgbWluLCBtYXggXSBtdXN0IGJlIGEgc3ViLWludGVydmFsIG9mIFsgLSAyIFBJLCAyIFBJIF0sIHdpdGggKCBtYXggLSBtaW4gPCAyIFBJIClcblx0XHR0aGlzLm1pbkF6aW11dGhBbmdsZSA9IC0gSW5maW5pdHk7IC8vIHJhZGlhbnNcblx0XHR0aGlzLm1heEF6aW11dGhBbmdsZSA9IEluZmluaXR5OyAvLyByYWRpYW5zXG5cblx0XHQvLyBTZXQgdG8gdHJ1ZSB0byBlbmFibGUgZGFtcGluZyAoaW5lcnRpYSlcblx0XHQvLyBJZiBkYW1waW5nIGlzIGVuYWJsZWQsIHlvdSBtdXN0IGNhbGwgY29udHJvbHMudXBkYXRlKCkgaW4geW91ciBhbmltYXRpb24gbG9vcFxuXHRcdHRoaXMuZW5hYmxlRGFtcGluZyA9IGZhbHNlO1xuXHRcdHRoaXMuZGFtcGluZ0ZhY3RvciA9IDAuMDU7XG5cblx0XHQvLyBUaGlzIG9wdGlvbiBhY3R1YWxseSBlbmFibGVzIGRvbGx5aW5nIGluIGFuZCBvdXQ7IGxlZnQgYXMgXCJ6b29tXCIgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuXHRcdC8vIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHpvb21pbmdcblx0XHR0aGlzLmVuYWJsZVpvb20gPSB0cnVlO1xuXHRcdHRoaXMuem9vbVNwZWVkID0gMS4wO1xuXG5cdFx0Ly8gU2V0IHRvIGZhbHNlIHRvIGRpc2FibGUgcm90YXRpbmdcblx0XHR0aGlzLmVuYWJsZVJvdGF0ZSA9IHRydWU7XG5cdFx0dGhpcy5yb3RhdGVTcGVlZCA9IDEuMDtcblxuXHRcdC8vIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHBhbm5pbmdcblx0XHR0aGlzLmVuYWJsZVBhbiA9IHRydWU7XG5cdFx0dGhpcy5wYW5TcGVlZCA9IDEuMDtcblx0XHR0aGlzLnNjcmVlblNwYWNlUGFubmluZyA9IHRydWU7IC8vIGlmIGZhbHNlLCBwYW4gb3J0aG9nb25hbCB0byB3b3JsZC1zcGFjZSBkaXJlY3Rpb24gY2FtZXJhLnVwXG5cdFx0dGhpcy5rZXlQYW5TcGVlZCA9IDcuMDtcdC8vIHBpeGVscyBtb3ZlZCBwZXIgYXJyb3cga2V5IHB1c2hcblxuXHRcdC8vIFNldCB0byB0cnVlIHRvIGF1dG9tYXRpY2FsbHkgcm90YXRlIGFyb3VuZCB0aGUgdGFyZ2V0XG5cdFx0Ly8gSWYgYXV0by1yb3RhdGUgaXMgZW5hYmxlZCwgeW91IG11c3QgY2FsbCBjb250cm9scy51cGRhdGUoKSBpbiB5b3VyIGFuaW1hdGlvbiBsb29wXG5cdFx0dGhpcy5hdXRvUm90YXRlID0gZmFsc2U7XG5cdFx0dGhpcy5hdXRvUm90YXRlU3BlZWQgPSAyLjA7IC8vIDMwIHNlY29uZHMgcGVyIG9yYml0IHdoZW4gZnBzIGlzIDYwXG5cblx0XHQvLyBUaGUgZm91ciBhcnJvdyBrZXlzXG5cdFx0dGhpcy5rZXlzID0geyBMRUZUOiAnQXJyb3dMZWZ0JywgVVA6ICdBcnJvd1VwJywgUklHSFQ6ICdBcnJvd1JpZ2h0JywgQk9UVE9NOiAnQXJyb3dEb3duJyB9O1xuXG5cdFx0Ly8gTW91c2UgYnV0dG9uc1xuXHRcdHRoaXMubW91c2VCdXR0b25zID0geyBMRUZUOiBNT1VTRS5ST1RBVEUsIE1JRERMRTogTU9VU0UuRE9MTFksIFJJR0hUOiBNT1VTRS5QQU4gfTtcblxuXHRcdC8vIFRvdWNoIGZpbmdlcnNcblx0XHR0aGlzLnRvdWNoZXMgPSB7IE9ORTogVE9VQ0guUk9UQVRFLCBUV086IFRPVUNILkRPTExZX1BBTiB9O1xuXG5cdFx0Ly8gZm9yIHJlc2V0XG5cdFx0dGhpcy50YXJnZXQwID0gdGhpcy50YXJnZXQuY2xvbmUoKTtcblx0XHR0aGlzLnBvc2l0aW9uMCA9IHRoaXMub2JqZWN0LnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0dGhpcy56b29tMCA9IHRoaXMub2JqZWN0Lnpvb207XG5cblx0XHQvLyB0aGUgdGFyZ2V0IERPTSBlbGVtZW50IGZvciBrZXkgZXZlbnRzXG5cdFx0dGhpcy5fZG9tRWxlbWVudEtleUV2ZW50cyA9IG51bGw7XG5cblx0XHQvL1xuXHRcdC8vIHB1YmxpYyBtZXRob2RzXG5cdFx0Ly9cblxuXHRcdHRoaXMuZ2V0UG9sYXJBbmdsZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIHNwaGVyaWNhbC5waGk7XG5cblx0XHR9O1xuXG5cdFx0dGhpcy5nZXRBemltdXRoYWxBbmdsZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIHNwaGVyaWNhbC50aGV0YTtcblxuXHRcdH07XG5cblx0XHR0aGlzLmdldERpc3RhbmNlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5vYmplY3QucG9zaXRpb24uZGlzdGFuY2VUbyggdGhpcy50YXJnZXQgKTtcblxuXHRcdH07XG5cblx0XHR0aGlzLmxpc3RlblRvS2V5RXZlbnRzID0gZnVuY3Rpb24gKCBkb21FbGVtZW50ICkge1xuXG5cdFx0XHRkb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgb25LZXlEb3duICk7XG5cdFx0XHR0aGlzLl9kb21FbGVtZW50S2V5RXZlbnRzID0gZG9tRWxlbWVudDtcblxuXHRcdH07XG5cblx0XHR0aGlzLnNhdmVTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c2NvcGUudGFyZ2V0MC5jb3B5KCBzY29wZS50YXJnZXQgKTtcblx0XHRcdHNjb3BlLnBvc2l0aW9uMC5jb3B5KCBzY29wZS5vYmplY3QucG9zaXRpb24gKTtcblx0XHRcdHNjb3BlLnpvb20wID0gc2NvcGUub2JqZWN0Lnpvb207XG5cblx0XHR9O1xuXG5cdFx0dGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0c2NvcGUudGFyZ2V0LmNvcHkoIHNjb3BlLnRhcmdldDAgKTtcblx0XHRcdHNjb3BlLm9iamVjdC5wb3NpdGlvbi5jb3B5KCBzY29wZS5wb3NpdGlvbjAgKTtcblx0XHRcdHNjb3BlLm9iamVjdC56b29tID0gc2NvcGUuem9vbTA7XG5cblx0XHRcdHNjb3BlLm9iamVjdC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cdFx0XHRzY29wZS5kaXNwYXRjaEV2ZW50KCBfY2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0c2NvcGUudXBkYXRlKCk7XG5cblx0XHRcdHN0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdH07XG5cblx0XHQvLyB0aGlzIG1ldGhvZCBpcyBleHBvc2VkLCBidXQgcGVyaGFwcyBpdCB3b3VsZCBiZSBiZXR0ZXIgaWYgd2UgY2FuIG1ha2UgaXQgcHJpdmF0ZS4uLlxuXHRcdHRoaXMudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRjb25zdCBvZmZzZXQgPSBuZXcgVmVjdG9yMygpO1xuXG5cdFx0XHQvLyBzbyBjYW1lcmEudXAgaXMgdGhlIG9yYml0IGF4aXNcblx0XHRcdGNvbnN0IHF1YXQgPSBuZXcgUXVhdGVybmlvbigpLnNldEZyb21Vbml0VmVjdG9ycyggb2JqZWN0LnVwLCBuZXcgVmVjdG9yMyggMCwgMSwgMCApICk7XG5cdFx0XHRjb25zdCBxdWF0SW52ZXJzZSA9IHF1YXQuY2xvbmUoKS5pbnZlcnQoKTtcblxuXHRcdFx0Y29uc3QgbGFzdFBvc2l0aW9uID0gbmV3IFZlY3RvcjMoKTtcblx0XHRcdGNvbnN0IGxhc3RRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTtcblxuXHRcdFx0Y29uc3QgdHdvUEkgPSAyICogTWF0aC5QSTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcblxuXHRcdFx0XHRjb25zdCBwb3NpdGlvbiA9IHNjb3BlLm9iamVjdC5wb3NpdGlvbjtcblxuXHRcdFx0XHRvZmZzZXQuY29weSggcG9zaXRpb24gKS5zdWIoIHNjb3BlLnRhcmdldCApO1xuXG5cdFx0XHRcdC8vIHJvdGF0ZSBvZmZzZXQgdG8gXCJ5LWF4aXMtaXMtdXBcIiBzcGFjZVxuXHRcdFx0XHRvZmZzZXQuYXBwbHlRdWF0ZXJuaW9uKCBxdWF0ICk7XG5cblx0XHRcdFx0Ly8gYW5nbGUgZnJvbSB6LWF4aXMgYXJvdW5kIHktYXhpc1xuXHRcdFx0XHRzcGhlcmljYWwuc2V0RnJvbVZlY3RvcjMoIG9mZnNldCApO1xuXG5cdFx0XHRcdGlmICggc2NvcGUuYXV0b1JvdGF0ZSAmJiBzdGF0ZSA9PT0gU1RBVEUuTk9ORSApIHtcblxuXHRcdFx0XHRcdHJvdGF0ZUxlZnQoIGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCkgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzY29wZS5lbmFibGVEYW1waW5nICkge1xuXG5cdFx0XHRcdFx0c3BoZXJpY2FsLnRoZXRhICs9IHNwaGVyaWNhbERlbHRhLnRoZXRhICogc2NvcGUuZGFtcGluZ0ZhY3Rvcjtcblx0XHRcdFx0XHRzcGhlcmljYWwucGhpICs9IHNwaGVyaWNhbERlbHRhLnBoaSAqIHNjb3BlLmRhbXBpbmdGYWN0b3I7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdHNwaGVyaWNhbC50aGV0YSArPSBzcGhlcmljYWxEZWx0YS50aGV0YTtcblx0XHRcdFx0XHRzcGhlcmljYWwucGhpICs9IHNwaGVyaWNhbERlbHRhLnBoaTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVzdHJpY3QgdGhldGEgdG8gYmUgYmV0d2VlbiBkZXNpcmVkIGxpbWl0c1xuXG5cdFx0XHRcdGxldCBtaW4gPSBzY29wZS5taW5BemltdXRoQW5nbGU7XG5cdFx0XHRcdGxldCBtYXggPSBzY29wZS5tYXhBemltdXRoQW5nbGU7XG5cblx0XHRcdFx0aWYgKCBpc0Zpbml0ZSggbWluICkgJiYgaXNGaW5pdGUoIG1heCApICkge1xuXG5cdFx0XHRcdFx0aWYgKCBtaW4gPCAtIE1hdGguUEkgKSBtaW4gKz0gdHdvUEk7IGVsc2UgaWYgKCBtaW4gPiBNYXRoLlBJICkgbWluIC09IHR3b1BJO1xuXG5cdFx0XHRcdFx0aWYgKCBtYXggPCAtIE1hdGguUEkgKSBtYXggKz0gdHdvUEk7IGVsc2UgaWYgKCBtYXggPiBNYXRoLlBJICkgbWF4IC09IHR3b1BJO1xuXG5cdFx0XHRcdFx0aWYgKCBtaW4gPD0gbWF4ICkge1xuXG5cdFx0XHRcdFx0XHRzcGhlcmljYWwudGhldGEgPSBNYXRoLm1heCggbWluLCBNYXRoLm1pbiggbWF4LCBzcGhlcmljYWwudGhldGEgKSApO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0c3BoZXJpY2FsLnRoZXRhID0gKCBzcGhlcmljYWwudGhldGEgPiAoIG1pbiArIG1heCApIC8gMiApID9cblx0XHRcdFx0XHRcdFx0TWF0aC5tYXgoIG1pbiwgc3BoZXJpY2FsLnRoZXRhICkgOlxuXHRcdFx0XHRcdFx0XHRNYXRoLm1pbiggbWF4LCBzcGhlcmljYWwudGhldGEgKTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gcmVzdHJpY3QgcGhpIHRvIGJlIGJldHdlZW4gZGVzaXJlZCBsaW1pdHNcblx0XHRcdFx0c3BoZXJpY2FsLnBoaSA9IE1hdGgubWF4KCBzY29wZS5taW5Qb2xhckFuZ2xlLCBNYXRoLm1pbiggc2NvcGUubWF4UG9sYXJBbmdsZSwgc3BoZXJpY2FsLnBoaSApICk7XG5cblx0XHRcdFx0c3BoZXJpY2FsLm1ha2VTYWZlKCk7XG5cblxuXHRcdFx0XHRzcGhlcmljYWwucmFkaXVzICo9IHNjYWxlO1xuXG5cdFx0XHRcdC8vIHJlc3RyaWN0IHJhZGl1cyB0byBiZSBiZXR3ZWVuIGRlc2lyZWQgbGltaXRzXG5cdFx0XHRcdHNwaGVyaWNhbC5yYWRpdXMgPSBNYXRoLm1heCggc2NvcGUubWluRGlzdGFuY2UsIE1hdGgubWluKCBzY29wZS5tYXhEaXN0YW5jZSwgc3BoZXJpY2FsLnJhZGl1cyApICk7XG5cblx0XHRcdFx0Ly8gbW92ZSB0YXJnZXQgdG8gcGFubmVkIGxvY2F0aW9uXG5cblx0XHRcdFx0aWYgKCBzY29wZS5lbmFibGVEYW1waW5nID09PSB0cnVlICkge1xuXG5cdFx0XHRcdFx0c2NvcGUudGFyZ2V0LmFkZFNjYWxlZFZlY3RvciggcGFuT2Zmc2V0LCBzY29wZS5kYW1waW5nRmFjdG9yICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdHNjb3BlLnRhcmdldC5hZGQoIHBhbk9mZnNldCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvZmZzZXQuc2V0RnJvbVNwaGVyaWNhbCggc3BoZXJpY2FsICk7XG5cblx0XHRcdFx0Ly8gcm90YXRlIG9mZnNldCBiYWNrIHRvIFwiY2FtZXJhLXVwLXZlY3Rvci1pcy11cFwiIHNwYWNlXG5cdFx0XHRcdG9mZnNldC5hcHBseVF1YXRlcm5pb24oIHF1YXRJbnZlcnNlICk7XG5cblx0XHRcdFx0cG9zaXRpb24uY29weSggc2NvcGUudGFyZ2V0ICkuYWRkKCBvZmZzZXQgKTtcblxuXHRcdFx0XHRzY29wZS5vYmplY3QubG9va0F0KCBzY29wZS50YXJnZXQgKTtcblxuXHRcdFx0XHRpZiAoIHNjb3BlLmVuYWJsZURhbXBpbmcgPT09IHRydWUgKSB7XG5cblx0XHRcdFx0XHRzcGhlcmljYWxEZWx0YS50aGV0YSAqPSAoIDEgLSBzY29wZS5kYW1waW5nRmFjdG9yICk7XG5cdFx0XHRcdFx0c3BoZXJpY2FsRGVsdGEucGhpICo9ICggMSAtIHNjb3BlLmRhbXBpbmdGYWN0b3IgKTtcblxuXHRcdFx0XHRcdHBhbk9mZnNldC5tdWx0aXBseVNjYWxhciggMSAtIHNjb3BlLmRhbXBpbmdGYWN0b3IgKTtcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0c3BoZXJpY2FsRGVsdGEuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdFx0XHRwYW5PZmZzZXQuc2V0KCAwLCAwLCAwICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNjYWxlID0gMTtcblxuXHRcdFx0XHQvLyB1cGRhdGUgY29uZGl0aW9uIGlzOlxuXHRcdFx0XHQvLyBtaW4oY2FtZXJhIGRpc3BsYWNlbWVudCwgY2FtZXJhIHJvdGF0aW9uIGluIHJhZGlhbnMpXjIgPiBFUFNcblx0XHRcdFx0Ly8gdXNpbmcgc21hbGwtYW5nbGUgYXBwcm94aW1hdGlvbiBjb3MoeC8yKSA9IDEgLSB4XjIgLyA4XG5cblx0XHRcdFx0aWYgKCB6b29tQ2hhbmdlZCB8fFxuXHRcdFx0XHRcdGxhc3RQb3NpdGlvbi5kaXN0YW5jZVRvU3F1YXJlZCggc2NvcGUub2JqZWN0LnBvc2l0aW9uICkgPiBFUFMgfHxcblx0XHRcdFx0XHQ4ICogKCAxIC0gbGFzdFF1YXRlcm5pb24uZG90KCBzY29wZS5vYmplY3QucXVhdGVybmlvbiApICkgPiBFUFMgKSB7XG5cblx0XHRcdFx0XHRzY29wZS5kaXNwYXRjaEV2ZW50KCBfY2hhbmdlRXZlbnQgKTtcblxuXHRcdFx0XHRcdGxhc3RQb3NpdGlvbi5jb3B5KCBzY29wZS5vYmplY3QucG9zaXRpb24gKTtcblx0XHRcdFx0XHRsYXN0UXVhdGVybmlvbi5jb3B5KCBzY29wZS5vYmplY3QucXVhdGVybmlvbiApO1xuXHRcdFx0XHRcdHpvb21DaGFuZ2VkID0gZmFsc2U7XG5cblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHR9O1xuXG5cdFx0fSgpO1xuXG5cdFx0dGhpcy5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRzY29wZS5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjb250ZXh0bWVudScsIG9uQ29udGV4dE1lbnUgKTtcblxuXHRcdFx0c2NvcGUuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAncG9pbnRlcmRvd24nLCBvblBvaW50ZXJEb3duICk7XG5cdFx0XHRzY29wZS5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVyY2FuY2VsJywgb25Qb2ludGVyQ2FuY2VsICk7XG5cdFx0XHRzY29wZS5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd3aGVlbCcsIG9uTW91c2VXaGVlbCApO1xuXG5cdFx0XHRzY29wZS5kb21FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVybW92ZScsIG9uUG9pbnRlck1vdmUgKTtcblx0XHRcdHNjb3BlLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwICk7XG5cblxuXHRcdFx0aWYgKCBzY29wZS5fZG9tRWxlbWVudEtleUV2ZW50cyAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRzY29wZS5fZG9tRWxlbWVudEtleUV2ZW50cy5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIG9uS2V5RG93biApO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vc2NvcGUuZGlzcGF0Y2hFdmVudCggeyB0eXBlOiAnZGlzcG9zZScgfSApOyAvLyBzaG91bGQgdGhpcyBiZSBhZGRlZCBoZXJlP1xuXG5cdFx0fTtcblxuXHRcdC8vXG5cdFx0Ly8gaW50ZXJuYWxzXG5cdFx0Ly9cblxuXHRcdGNvbnN0IHNjb3BlID0gdGhpcztcblxuXHRcdGNvbnN0IFNUQVRFID0ge1xuXHRcdFx0Tk9ORTogLSAxLFxuXHRcdFx0Uk9UQVRFOiAwLFxuXHRcdFx0RE9MTFk6IDEsXG5cdFx0XHRQQU46IDIsXG5cdFx0XHRUT1VDSF9ST1RBVEU6IDMsXG5cdFx0XHRUT1VDSF9QQU46IDQsXG5cdFx0XHRUT1VDSF9ET0xMWV9QQU46IDUsXG5cdFx0XHRUT1VDSF9ET0xMWV9ST1RBVEU6IDZcblx0XHR9O1xuXG5cdFx0bGV0IHN0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdGNvbnN0IEVQUyA9IDAuMDAwMDAxO1xuXG5cdFx0Ly8gY3VycmVudCBwb3NpdGlvbiBpbiBzcGhlcmljYWwgY29vcmRpbmF0ZXNcblx0XHRjb25zdCBzcGhlcmljYWwgPSBuZXcgU3BoZXJpY2FsKCk7XG5cdFx0Y29uc3Qgc3BoZXJpY2FsRGVsdGEgPSBuZXcgU3BoZXJpY2FsKCk7XG5cblx0XHRsZXQgc2NhbGUgPSAxO1xuXHRcdGNvbnN0IHBhbk9mZnNldCA9IG5ldyBWZWN0b3IzKCk7XG5cdFx0bGV0IHpvb21DaGFuZ2VkID0gZmFsc2U7XG5cblx0XHRjb25zdCByb3RhdGVTdGFydCA9IG5ldyBWZWN0b3IyKCk7XG5cdFx0Y29uc3Qgcm90YXRlRW5kID0gbmV3IFZlY3RvcjIoKTtcblx0XHRjb25zdCByb3RhdGVEZWx0YSA9IG5ldyBWZWN0b3IyKCk7XG5cblx0XHRjb25zdCBwYW5TdGFydCA9IG5ldyBWZWN0b3IyKCk7XG5cdFx0Y29uc3QgcGFuRW5kID0gbmV3IFZlY3RvcjIoKTtcblx0XHRjb25zdCBwYW5EZWx0YSA9IG5ldyBWZWN0b3IyKCk7XG5cblx0XHRjb25zdCBkb2xseVN0YXJ0ID0gbmV3IFZlY3RvcjIoKTtcblx0XHRjb25zdCBkb2xseUVuZCA9IG5ldyBWZWN0b3IyKCk7XG5cdFx0Y29uc3QgZG9sbHlEZWx0YSA9IG5ldyBWZWN0b3IyKCk7XG5cblx0XHRjb25zdCBwb2ludGVycyA9IFtdO1xuXHRcdGNvbnN0IHBvaW50ZXJQb3NpdGlvbnMgPSB7fTtcblxuXHRcdGZ1bmN0aW9uIGdldEF1dG9Sb3RhdGlvbkFuZ2xlKCkge1xuXG5cdFx0XHRyZXR1cm4gMiAqIE1hdGguUEkgLyA2MCAvIDYwICogc2NvcGUuYXV0b1JvdGF0ZVNwZWVkO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0Wm9vbVNjYWxlKCkge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5wb3coIDAuOTUsIHNjb3BlLnpvb21TcGVlZCApO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcm90YXRlTGVmdCggYW5nbGUgKSB7XG5cblx0XHRcdHNwaGVyaWNhbERlbHRhLnRoZXRhIC09IGFuZ2xlO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcm90YXRlVXAoIGFuZ2xlICkge1xuXG5cdFx0XHRzcGhlcmljYWxEZWx0YS5waGkgLT0gYW5nbGU7XG5cblx0XHR9XG5cblx0XHRjb25zdCBwYW5MZWZ0ID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRjb25zdCB2ID0gbmV3IFZlY3RvcjMoKTtcblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIHBhbkxlZnQoIGRpc3RhbmNlLCBvYmplY3RNYXRyaXggKSB7XG5cblx0XHRcdFx0di5zZXRGcm9tTWF0cml4Q29sdW1uKCBvYmplY3RNYXRyaXgsIDAgKTsgLy8gZ2V0IFggY29sdW1uIG9mIG9iamVjdE1hdHJpeFxuXHRcdFx0XHR2Lm11bHRpcGx5U2NhbGFyKCAtIGRpc3RhbmNlICk7XG5cblx0XHRcdFx0cGFuT2Zmc2V0LmFkZCggdiApO1xuXG5cdFx0XHR9O1xuXG5cdFx0fSgpO1xuXG5cdFx0Y29uc3QgcGFuVXAgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGNvbnN0IHYgPSBuZXcgVmVjdG9yMygpO1xuXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gcGFuVXAoIGRpc3RhbmNlLCBvYmplY3RNYXRyaXggKSB7XG5cblx0XHRcdFx0aWYgKCBzY29wZS5zY3JlZW5TcGFjZVBhbm5pbmcgPT09IHRydWUgKSB7XG5cblx0XHRcdFx0XHR2LnNldEZyb21NYXRyaXhDb2x1bW4oIG9iamVjdE1hdHJpeCwgMSApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHR2LnNldEZyb21NYXRyaXhDb2x1bW4oIG9iamVjdE1hdHJpeCwgMCApO1xuXHRcdFx0XHRcdHYuY3Jvc3NWZWN0b3JzKCBzY29wZS5vYmplY3QudXAsIHYgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0di5tdWx0aXBseVNjYWxhciggZGlzdGFuY2UgKTtcblxuXHRcdFx0XHRwYW5PZmZzZXQuYWRkKCB2ICk7XG5cblx0XHRcdH07XG5cblx0XHR9KCk7XG5cblx0XHQvLyBkZWx0YVggYW5kIGRlbHRhWSBhcmUgaW4gcGl4ZWxzOyByaWdodCBhbmQgZG93biBhcmUgcG9zaXRpdmVcblx0XHRjb25zdCBwYW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGNvbnN0IG9mZnNldCA9IG5ldyBWZWN0b3IzKCk7XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiBwYW4oIGRlbHRhWCwgZGVsdGFZICkge1xuXG5cdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50O1xuXG5cdFx0XHRcdGlmICggc2NvcGUub2JqZWN0LmlzUGVyc3BlY3RpdmVDYW1lcmEgKSB7XG5cblx0XHRcdFx0XHQvLyBwZXJzcGVjdGl2ZVxuXHRcdFx0XHRcdGNvbnN0IHBvc2l0aW9uID0gc2NvcGUub2JqZWN0LnBvc2l0aW9uO1xuXHRcdFx0XHRcdG9mZnNldC5jb3B5KCBwb3NpdGlvbiApLnN1Yiggc2NvcGUudGFyZ2V0ICk7XG5cdFx0XHRcdFx0bGV0IHRhcmdldERpc3RhbmNlID0gb2Zmc2V0Lmxlbmd0aCgpO1xuXG5cdFx0XHRcdFx0Ly8gaGFsZiBvZiB0aGUgZm92IGlzIGNlbnRlciB0byB0b3Agb2Ygc2NyZWVuXG5cdFx0XHRcdFx0dGFyZ2V0RGlzdGFuY2UgKj0gTWF0aC50YW4oICggc2NvcGUub2JqZWN0LmZvdiAvIDIgKSAqIE1hdGguUEkgLyAxODAuMCApO1xuXG5cdFx0XHRcdFx0Ly8gd2UgdXNlIG9ubHkgY2xpZW50SGVpZ2h0IGhlcmUgc28gYXNwZWN0IHJhdGlvIGRvZXMgbm90IGRpc3RvcnQgc3BlZWRcblx0XHRcdFx0XHRwYW5MZWZ0KCAyICogZGVsdGFYICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCwgc2NvcGUub2JqZWN0Lm1hdHJpeCApO1xuXHRcdFx0XHRcdHBhblVwKCAyICogZGVsdGFZICogdGFyZ2V0RGlzdGFuY2UgLyBlbGVtZW50LmNsaWVudEhlaWdodCwgc2NvcGUub2JqZWN0Lm1hdHJpeCApO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHNjb3BlLm9iamVjdC5pc09ydGhvZ3JhcGhpY0NhbWVyYSApIHtcblxuXHRcdFx0XHRcdC8vIG9ydGhvZ3JhcGhpY1xuXHRcdFx0XHRcdHBhbkxlZnQoIGRlbHRhWCAqICggc2NvcGUub2JqZWN0LnJpZ2h0IC0gc2NvcGUub2JqZWN0LmxlZnQgKSAvIHNjb3BlLm9iamVjdC56b29tIC8gZWxlbWVudC5jbGllbnRXaWR0aCwgc2NvcGUub2JqZWN0Lm1hdHJpeCApO1xuXHRcdFx0XHRcdHBhblVwKCBkZWx0YVkgKiAoIHNjb3BlLm9iamVjdC50b3AgLSBzY29wZS5vYmplY3QuYm90dG9tICkgLyBzY29wZS5vYmplY3Quem9vbSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0LCBzY29wZS5vYmplY3QubWF0cml4ICk7XG5cblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIGNhbWVyYSBuZWl0aGVyIG9ydGhvZ3JhcGhpYyBub3IgcGVyc3BlY3RpdmVcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oICdXQVJOSU5HOiBPcmJpdENvbnRyb2xzLmpzIGVuY291bnRlcmVkIGFuIHVua25vd24gY2FtZXJhIHR5cGUgLSBwYW4gZGlzYWJsZWQuJyApO1xuXHRcdFx0XHRcdHNjb3BlLmVuYWJsZVBhbiA9IGZhbHNlO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fTtcblxuXHRcdH0oKTtcblxuXHRcdGZ1bmN0aW9uIGRvbGx5T3V0KCBkb2xseVNjYWxlICkge1xuXG5cdFx0XHRpZiAoIHNjb3BlLm9iamVjdC5pc1BlcnNwZWN0aXZlQ2FtZXJhICkge1xuXG5cdFx0XHRcdHNjYWxlIC89IGRvbGx5U2NhbGU7XG5cblx0XHRcdH0gZWxzZSBpZiAoIHNjb3BlLm9iamVjdC5pc09ydGhvZ3JhcGhpY0NhbWVyYSApIHtcblxuXHRcdFx0XHRzY29wZS5vYmplY3Quem9vbSA9IE1hdGgubWF4KCBzY29wZS5taW5ab29tLCBNYXRoLm1pbiggc2NvcGUubWF4Wm9vbSwgc2NvcGUub2JqZWN0Lnpvb20gKiBkb2xseVNjYWxlICkgKTtcblx0XHRcdFx0c2NvcGUub2JqZWN0LnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblx0XHRcdFx0em9vbUNoYW5nZWQgPSB0cnVlO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGNvbnNvbGUud2FybiggJ1dBUk5JTkc6IE9yYml0Q29udHJvbHMuanMgZW5jb3VudGVyZWQgYW4gdW5rbm93biBjYW1lcmEgdHlwZSAtIGRvbGx5L3pvb20gZGlzYWJsZWQuJyApO1xuXHRcdFx0XHRzY29wZS5lbmFibGVab29tID0gZmFsc2U7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGRvbGx5SW4oIGRvbGx5U2NhbGUgKSB7XG5cblx0XHRcdGlmICggc2NvcGUub2JqZWN0LmlzUGVyc3BlY3RpdmVDYW1lcmEgKSB7XG5cblx0XHRcdFx0c2NhbGUgKj0gZG9sbHlTY2FsZTtcblxuXHRcdFx0fSBlbHNlIGlmICggc2NvcGUub2JqZWN0LmlzT3J0aG9ncmFwaGljQ2FtZXJhICkge1xuXG5cdFx0XHRcdHNjb3BlLm9iamVjdC56b29tID0gTWF0aC5tYXgoIHNjb3BlLm1pblpvb20sIE1hdGgubWluKCBzY29wZS5tYXhab29tLCBzY29wZS5vYmplY3Quem9vbSAvIGRvbGx5U2NhbGUgKSApO1xuXHRcdFx0XHRzY29wZS5vYmplY3QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXHRcdFx0XHR6b29tQ2hhbmdlZCA9IHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Y29uc29sZS53YXJuKCAnV0FSTklORzogT3JiaXRDb250cm9scy5qcyBlbmNvdW50ZXJlZCBhbiB1bmtub3duIGNhbWVyYSB0eXBlIC0gZG9sbHkvem9vbSBkaXNhYmxlZC4nICk7XG5cdFx0XHRcdHNjb3BlLmVuYWJsZVpvb20gPSBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly9cblx0XHQvLyBldmVudCBjYWxsYmFja3MgLSB1cGRhdGUgdGhlIG9iamVjdCBzdGF0ZVxuXHRcdC8vXG5cblx0XHRmdW5jdGlvbiBoYW5kbGVNb3VzZURvd25Sb3RhdGUoIGV2ZW50ICkge1xuXG5cdFx0XHRyb3RhdGVTdGFydC5zZXQoIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93bkRvbGx5KCBldmVudCApIHtcblxuXHRcdFx0ZG9sbHlTdGFydC5zZXQoIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93blBhbiggZXZlbnQgKSB7XG5cblx0XHRcdHBhblN0YXJ0LnNldCggZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSApO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlTW91c2VNb3ZlUm90YXRlKCBldmVudCApIHtcblxuXHRcdFx0cm90YXRlRW5kLnNldCggZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSApO1xuXG5cdFx0XHRyb3RhdGVEZWx0YS5zdWJWZWN0b3JzKCByb3RhdGVFbmQsIHJvdGF0ZVN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIHNjb3BlLnJvdGF0ZVNwZWVkICk7XG5cblx0XHRcdGNvbnN0IGVsZW1lbnQgPSBzY29wZS5kb21FbGVtZW50O1xuXG5cdFx0XHRyb3RhdGVMZWZ0KCAyICogTWF0aC5QSSAqIHJvdGF0ZURlbHRhLnggLyBlbGVtZW50LmNsaWVudEhlaWdodCApOyAvLyB5ZXMsIGhlaWdodFxuXG5cdFx0XHRyb3RhdGVVcCggMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS55IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKTtcblxuXHRcdFx0cm90YXRlU3RhcnQuY29weSggcm90YXRlRW5kICk7XG5cblx0XHRcdHNjb3BlLnVwZGF0ZSgpO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlTW91c2VNb3ZlRG9sbHkoIGV2ZW50ICkge1xuXG5cdFx0XHRkb2xseUVuZC5zZXQoIGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkgKTtcblxuXHRcdFx0ZG9sbHlEZWx0YS5zdWJWZWN0b3JzKCBkb2xseUVuZCwgZG9sbHlTdGFydCApO1xuXG5cdFx0XHRpZiAoIGRvbGx5RGVsdGEueSA+IDAgKSB7XG5cblx0XHRcdFx0ZG9sbHlPdXQoIGdldFpvb21TY2FsZSgpICk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIGRvbGx5RGVsdGEueSA8IDAgKSB7XG5cblx0XHRcdFx0ZG9sbHlJbiggZ2V0Wm9vbVNjYWxlKCkgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRkb2xseVN0YXJ0LmNvcHkoIGRvbGx5RW5kICk7XG5cblx0XHRcdHNjb3BlLnVwZGF0ZSgpO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlTW91c2VNb3ZlUGFuKCBldmVudCApIHtcblxuXHRcdFx0cGFuRW5kLnNldCggZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSApO1xuXG5cdFx0XHRwYW5EZWx0YS5zdWJWZWN0b3JzKCBwYW5FbmQsIHBhblN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIHNjb3BlLnBhblNwZWVkICk7XG5cblx0XHRcdHBhbiggcGFuRGVsdGEueCwgcGFuRGVsdGEueSApO1xuXG5cdFx0XHRwYW5TdGFydC5jb3B5KCBwYW5FbmQgKTtcblxuXHRcdFx0c2NvcGUudXBkYXRlKCk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVNb3VzZVVwKCAvKmV2ZW50Ki8gKSB7XG5cblx0XHRcdC8vIG5vLW9wXG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVNb3VzZVdoZWVsKCBldmVudCApIHtcblxuXHRcdFx0aWYgKCBldmVudC5kZWx0YVkgPCAwICkge1xuXG5cdFx0XHRcdGRvbGx5SW4oIGdldFpvb21TY2FsZSgpICk7XG5cblx0XHRcdH0gZWxzZSBpZiAoIGV2ZW50LmRlbHRhWSA+IDAgKSB7XG5cblx0XHRcdFx0ZG9sbHlPdXQoIGdldFpvb21TY2FsZSgpICk7XG5cblx0XHRcdH1cblxuXHRcdFx0c2NvcGUudXBkYXRlKCk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVLZXlEb3duKCBldmVudCApIHtcblxuXHRcdFx0bGV0IG5lZWRzVXBkYXRlID0gZmFsc2U7XG5cblx0XHRcdHN3aXRjaCAoIGV2ZW50LmNvZGUgKSB7XG5cblx0XHRcdFx0Y2FzZSBzY29wZS5rZXlzLlVQOlxuXHRcdFx0XHRcdHBhbiggMCwgc2NvcGUua2V5UGFuU3BlZWQgKTtcblx0XHRcdFx0XHRuZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBzY29wZS5rZXlzLkJPVFRPTTpcblx0XHRcdFx0XHRwYW4oIDAsIC0gc2NvcGUua2V5UGFuU3BlZWQgKTtcblx0XHRcdFx0XHRuZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBzY29wZS5rZXlzLkxFRlQ6XG5cdFx0XHRcdFx0cGFuKCBzY29wZS5rZXlQYW5TcGVlZCwgMCApO1xuXHRcdFx0XHRcdG5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIHNjb3BlLmtleXMuUklHSFQ6XG5cdFx0XHRcdFx0cGFuKCAtIHNjb3BlLmtleVBhblNwZWVkLCAwICk7XG5cdFx0XHRcdFx0bmVlZHNVcGRhdGUgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggbmVlZHNVcGRhdGUgKSB7XG5cblx0XHRcdFx0Ly8gcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIHNjcm9sbGluZyBvbiBjdXJzb3Iga2V5c1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdHNjb3BlLnVwZGF0ZSgpO1xuXG5cdFx0XHR9XG5cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnRSb3RhdGUoKSB7XG5cblx0XHRcdGlmICggcG9pbnRlcnMubGVuZ3RoID09PSAxICkge1xuXG5cdFx0XHRcdHJvdGF0ZVN0YXJ0LnNldCggcG9pbnRlcnNbIDAgXS5wYWdlWCwgcG9pbnRlcnNbIDAgXS5wYWdlWSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGNvbnN0IHggPSAwLjUgKiAoIHBvaW50ZXJzWyAwIF0ucGFnZVggKyBwb2ludGVyc1sgMSBdLnBhZ2VYICk7XG5cdFx0XHRcdGNvbnN0IHkgPSAwLjUgKiAoIHBvaW50ZXJzWyAwIF0ucGFnZVkgKyBwb2ludGVyc1sgMSBdLnBhZ2VZICk7XG5cblx0XHRcdFx0cm90YXRlU3RhcnQuc2V0KCB4LCB5ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnRQYW4oKSB7XG5cblx0XHRcdGlmICggcG9pbnRlcnMubGVuZ3RoID09PSAxICkge1xuXG5cdFx0XHRcdHBhblN0YXJ0LnNldCggcG9pbnRlcnNbIDAgXS5wYWdlWCwgcG9pbnRlcnNbIDAgXS5wYWdlWSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGNvbnN0IHggPSAwLjUgKiAoIHBvaW50ZXJzWyAwIF0ucGFnZVggKyBwb2ludGVyc1sgMSBdLnBhZ2VYICk7XG5cdFx0XHRcdGNvbnN0IHkgPSAwLjUgKiAoIHBvaW50ZXJzWyAwIF0ucGFnZVkgKyBwb2ludGVyc1sgMSBdLnBhZ2VZICk7XG5cblx0XHRcdFx0cGFuU3RhcnQuc2V0KCB4LCB5ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnREb2xseSgpIHtcblxuXHRcdFx0Y29uc3QgZHggPSBwb2ludGVyc1sgMCBdLnBhZ2VYIC0gcG9pbnRlcnNbIDEgXS5wYWdlWDtcblx0XHRcdGNvbnN0IGR5ID0gcG9pbnRlcnNbIDAgXS5wYWdlWSAtIHBvaW50ZXJzWyAxIF0ucGFnZVk7XG5cblx0XHRcdGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRkb2xseVN0YXJ0LnNldCggMCwgZGlzdGFuY2UgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVRvdWNoU3RhcnREb2xseVBhbigpIHtcblxuXHRcdFx0aWYgKCBzY29wZS5lbmFibGVab29tICkgaGFuZGxlVG91Y2hTdGFydERvbGx5KCk7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlUGFuICkgaGFuZGxlVG91Y2hTdGFydFBhbigpO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydERvbGx5Um90YXRlKCkge1xuXG5cdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVpvb20gKSBoYW5kbGVUb3VjaFN0YXJ0RG9sbHkoKTtcblxuXHRcdFx0aWYgKCBzY29wZS5lbmFibGVSb3RhdGUgKSBoYW5kbGVUb3VjaFN0YXJ0Um90YXRlKCk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVUb3VjaE1vdmVSb3RhdGUoIGV2ZW50ICkge1xuXG5cdFx0XHRpZiAoIHBvaW50ZXJzLmxlbmd0aCA9PSAxICkge1xuXG5cdFx0XHRcdHJvdGF0ZUVuZC5zZXQoIGV2ZW50LnBhZ2VYLCBldmVudC5wYWdlWSApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGNvbnN0IHBvc2l0aW9uID0gZ2V0U2Vjb25kUG9pbnRlclBvc2l0aW9uKCBldmVudCApO1xuXG5cdFx0XHRcdGNvbnN0IHggPSAwLjUgKiAoIGV2ZW50LnBhZ2VYICsgcG9zaXRpb24ueCApO1xuXHRcdFx0XHRjb25zdCB5ID0gMC41ICogKCBldmVudC5wYWdlWSArIHBvc2l0aW9uLnkgKTtcblxuXHRcdFx0XHRyb3RhdGVFbmQuc2V0KCB4LCB5ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cm90YXRlRGVsdGEuc3ViVmVjdG9ycyggcm90YXRlRW5kLCByb3RhdGVTdGFydCApLm11bHRpcGx5U2NhbGFyKCBzY29wZS5yb3RhdGVTcGVlZCApO1xuXG5cdFx0XHRjb25zdCBlbGVtZW50ID0gc2NvcGUuZG9tRWxlbWVudDtcblxuXHRcdFx0cm90YXRlTGVmdCggMiAqIE1hdGguUEkgKiByb3RhdGVEZWx0YS54IC8gZWxlbWVudC5jbGllbnRIZWlnaHQgKTsgLy8geWVzLCBoZWlnaHRcblxuXHRcdFx0cm90YXRlVXAoIDIgKiBNYXRoLlBJICogcm90YXRlRGVsdGEueSAvIGVsZW1lbnQuY2xpZW50SGVpZ2h0ICk7XG5cblx0XHRcdHJvdGF0ZVN0YXJ0LmNvcHkoIHJvdGF0ZUVuZCApO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlVG91Y2hNb3ZlUGFuKCBldmVudCApIHtcblxuXHRcdFx0aWYgKCBwb2ludGVycy5sZW5ndGggPT09IDEgKSB7XG5cblx0XHRcdFx0cGFuRW5kLnNldCggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Y29uc3QgcG9zaXRpb24gPSBnZXRTZWNvbmRQb2ludGVyUG9zaXRpb24oIGV2ZW50ICk7XG5cblx0XHRcdFx0Y29uc3QgeCA9IDAuNSAqICggZXZlbnQucGFnZVggKyBwb3NpdGlvbi54ICk7XG5cdFx0XHRcdGNvbnN0IHkgPSAwLjUgKiAoIGV2ZW50LnBhZ2VZICsgcG9zaXRpb24ueSApO1xuXG5cdFx0XHRcdHBhbkVuZC5zZXQoIHgsIHkgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRwYW5EZWx0YS5zdWJWZWN0b3JzKCBwYW5FbmQsIHBhblN0YXJ0ICkubXVsdGlwbHlTY2FsYXIoIHNjb3BlLnBhblNwZWVkICk7XG5cblx0XHRcdHBhbiggcGFuRGVsdGEueCwgcGFuRGVsdGEueSApO1xuXG5cdFx0XHRwYW5TdGFydC5jb3B5KCBwYW5FbmQgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZURvbGx5KCBldmVudCApIHtcblxuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSBnZXRTZWNvbmRQb2ludGVyUG9zaXRpb24oIGV2ZW50ICk7XG5cblx0XHRcdGNvbnN0IGR4ID0gZXZlbnQucGFnZVggLSBwb3NpdGlvbi54O1xuXHRcdFx0Y29uc3QgZHkgPSBldmVudC5wYWdlWSAtIHBvc2l0aW9uLnk7XG5cblx0XHRcdGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KCBkeCAqIGR4ICsgZHkgKiBkeSApO1xuXG5cdFx0XHRkb2xseUVuZC5zZXQoIDAsIGRpc3RhbmNlICk7XG5cblx0XHRcdGRvbGx5RGVsdGEuc2V0KCAwLCBNYXRoLnBvdyggZG9sbHlFbmQueSAvIGRvbGx5U3RhcnQueSwgc2NvcGUuem9vbVNwZWVkICkgKTtcblxuXHRcdFx0ZG9sbHlPdXQoIGRvbGx5RGVsdGEueSApO1xuXG5cdFx0XHRkb2xseVN0YXJ0LmNvcHkoIGRvbGx5RW5kICk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBoYW5kbGVUb3VjaE1vdmVEb2xseVBhbiggZXZlbnQgKSB7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlWm9vbSApIGhhbmRsZVRvdWNoTW92ZURvbGx5KCBldmVudCApO1xuXG5cdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVBhbiApIGhhbmRsZVRvdWNoTW92ZVBhbiggZXZlbnQgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZURvbGx5Um90YXRlKCBldmVudCApIHtcblxuXHRcdFx0aWYgKCBzY29wZS5lbmFibGVab29tICkgaGFuZGxlVG91Y2hNb3ZlRG9sbHkoIGV2ZW50ICk7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlUm90YXRlICkgaGFuZGxlVG91Y2hNb3ZlUm90YXRlKCBldmVudCApO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaGFuZGxlVG91Y2hFbmQoIC8qZXZlbnQqLyApIHtcblxuXHRcdFx0Ly8gbm8tb3BcblxuXHRcdH1cblxuXHRcdC8vXG5cdFx0Ly8gZXZlbnQgaGFuZGxlcnMgLSBGU006IGxpc3RlbiBmb3IgZXZlbnRzIGFuZCByZXNldCBzdGF0ZVxuXHRcdC8vXG5cblx0XHRmdW5jdGlvbiBvblBvaW50ZXJEb3duKCBldmVudCApIHtcblxuXHRcdFx0aWYgKCBzY29wZS5lbmFibGVkID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0aWYgKCBwb2ludGVycy5sZW5ndGggPT09IDAgKSB7XG5cblx0XHRcdFx0c2NvcGUuZG9tRWxlbWVudC5zZXRQb2ludGVyQ2FwdHVyZSggZXZlbnQucG9pbnRlcklkICk7XG5cblx0XHRcdFx0c2NvcGUuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAncG9pbnRlcm1vdmUnLCBvblBvaW50ZXJNb3ZlICk7XG5cdFx0XHRcdHNjb3BlLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwICk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly9cblxuXHRcdFx0YWRkUG9pbnRlciggZXZlbnQgKTtcblxuXHRcdFx0aWYgKCBldmVudC5wb2ludGVyVHlwZSA9PT0gJ3RvdWNoJyApIHtcblxuXHRcdFx0XHRvblRvdWNoU3RhcnQoIGV2ZW50ICk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0b25Nb3VzZURvd24oIGV2ZW50ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uUG9pbnRlck1vdmUoIGV2ZW50ICkge1xuXG5cdFx0XHRpZiAoIHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0XHRpZiAoIGV2ZW50LnBvaW50ZXJUeXBlID09PSAndG91Y2gnICkge1xuXG5cdFx0XHRcdG9uVG91Y2hNb3ZlKCBldmVudCApO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdG9uTW91c2VNb3ZlKCBldmVudCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvblBvaW50ZXJVcCggZXZlbnQgKSB7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdGlmICggZXZlbnQucG9pbnRlclR5cGUgPT09ICd0b3VjaCcgKSB7XG5cblx0XHRcdFx0b25Ub3VjaEVuZCgpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdG9uTW91c2VVcCggZXZlbnQgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRyZW1vdmVQb2ludGVyKCBldmVudCApO1xuXG5cdFx0XHQvL1xuXG5cdFx0XHRpZiAoIHBvaW50ZXJzLmxlbmd0aCA9PT0gMCApIHtcblxuXHRcdFx0XHRzY29wZS5kb21FbGVtZW50LnJlbGVhc2VQb2ludGVyQ2FwdHVyZSggZXZlbnQucG9pbnRlcklkICk7XG5cblx0XHRcdFx0c2NvcGUuZG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAncG9pbnRlcm1vdmUnLCBvblBvaW50ZXJNb3ZlICk7XG5cdFx0XHRcdHNjb3BlLmRvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uUG9pbnRlckNhbmNlbCggZXZlbnQgKSB7XG5cblx0XHRcdHJlbW92ZVBvaW50ZXIoIGV2ZW50ICk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdXNlRG93biggZXZlbnQgKSB7XG5cblx0XHRcdGxldCBtb3VzZUFjdGlvbjtcblxuXHRcdFx0c3dpdGNoICggZXZlbnQuYnV0dG9uICkge1xuXG5cdFx0XHRcdGNhc2UgMDpcblxuXHRcdFx0XHRcdG1vdXNlQWN0aW9uID0gc2NvcGUubW91c2VCdXR0b25zLkxFRlQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAxOlxuXG5cdFx0XHRcdFx0bW91c2VBY3Rpb24gPSBzY29wZS5tb3VzZUJ1dHRvbnMuTUlERExFO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMjpcblxuXHRcdFx0XHRcdG1vdXNlQWN0aW9uID0gc2NvcGUubW91c2VCdXR0b25zLlJJR0hUO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdFx0XHRtb3VzZUFjdGlvbiA9IC0gMTtcblxuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2ggKCBtb3VzZUFjdGlvbiApIHtcblxuXHRcdFx0XHRjYXNlIE1PVVNFLkRPTExZOlxuXG5cdFx0XHRcdFx0aWYgKCBzY29wZS5lbmFibGVab29tID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdGhhbmRsZU1vdXNlRG93bkRvbGx5KCBldmVudCApO1xuXG5cdFx0XHRcdFx0c3RhdGUgPSBTVEFURS5ET0xMWTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgTU9VU0UuUk9UQVRFOlxuXG5cdFx0XHRcdFx0aWYgKCBldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdFx0aGFuZGxlTW91c2VEb3duUGFuKCBldmVudCApO1xuXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLlBBTjtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlUm90YXRlID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdFx0aGFuZGxlTW91c2VEb3duUm90YXRlKCBldmVudCApO1xuXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLlJPVEFURTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgTU9VU0UuUEFOOlxuXG5cdFx0XHRcdFx0aWYgKCBldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlUm90YXRlID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdFx0aGFuZGxlTW91c2VEb3duUm90YXRlKCBldmVudCApO1xuXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLlJPVEFURTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdFx0aGFuZGxlTW91c2VEb3duUGFuKCBldmVudCApO1xuXG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLlBBTjtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKCBzdGF0ZSAhPT0gU1RBVEUuTk9ORSApIHtcblxuXHRcdFx0XHRzY29wZS5kaXNwYXRjaEV2ZW50KCBfc3RhcnRFdmVudCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdXNlTW92ZSggZXZlbnQgKSB7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdHN3aXRjaCAoIHN0YXRlICkge1xuXG5cdFx0XHRcdGNhc2UgU1RBVEUuUk9UQVRFOlxuXG5cdFx0XHRcdFx0aWYgKCBzY29wZS5lbmFibGVSb3RhdGUgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlUm90YXRlKCBldmVudCApO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBTVEFURS5ET0xMWTpcblxuXHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlWm9vbSA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdFx0XHRoYW5kbGVNb3VzZU1vdmVEb2xseSggZXZlbnQgKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgU1RBVEUuUEFOOlxuXG5cdFx0XHRcdFx0aWYgKCBzY29wZS5lbmFibGVQYW4gPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0aGFuZGxlTW91c2VNb3ZlUGFuKCBldmVudCApO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uTW91c2VVcCggZXZlbnQgKSB7XG5cblx0XHRcdGhhbmRsZU1vdXNlVXAoIGV2ZW50ICk7XG5cblx0XHRcdHNjb3BlLmRpc3BhdGNoRXZlbnQoIF9lbmRFdmVudCApO1xuXG5cdFx0XHRzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBvbk1vdXNlV2hlZWwoIGV2ZW50ICkge1xuXG5cdFx0XHRpZiAoIHNjb3BlLmVuYWJsZWQgPT09IGZhbHNlIHx8IHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlIHx8ICggc3RhdGUgIT09IFNUQVRFLk5PTkUgJiYgc3RhdGUgIT09IFNUQVRFLlJPVEFURSApICkgcmV0dXJuO1xuXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRzY29wZS5kaXNwYXRjaEV2ZW50KCBfc3RhcnRFdmVudCApO1xuXG5cdFx0XHRoYW5kbGVNb3VzZVdoZWVsKCBldmVudCApO1xuXG5cdFx0XHRzY29wZS5kaXNwYXRjaEV2ZW50KCBfZW5kRXZlbnQgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uS2V5RG93biggZXZlbnQgKSB7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgfHwgc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0aGFuZGxlS2V5RG93biggZXZlbnQgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIG9uVG91Y2hTdGFydCggZXZlbnQgKSB7XG5cblx0XHRcdHRyYWNrUG9pbnRlciggZXZlbnQgKTtcblxuXHRcdFx0c3dpdGNoICggcG9pbnRlcnMubGVuZ3RoICkge1xuXG5cdFx0XHRcdGNhc2UgMTpcblxuXHRcdFx0XHRcdHN3aXRjaCAoIHNjb3BlLnRvdWNoZXMuT05FICkge1xuXG5cdFx0XHRcdFx0XHRjYXNlIFRPVUNILlJPVEFURTpcblxuXHRcdFx0XHRcdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdFx0XHRcdFx0aGFuZGxlVG91Y2hTdGFydFJvdGF0ZSgpO1xuXG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gU1RBVEUuVE9VQ0hfUk9UQVRFO1xuXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRjYXNlIFRPVUNILlBBTjpcblxuXHRcdFx0XHRcdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVBhbiA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdFx0XHRcdFx0aGFuZGxlVG91Y2hTdGFydFBhbigpO1xuXG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gU1RBVEUuVE9VQ0hfUEFOO1xuXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMjpcblxuXHRcdFx0XHRcdHN3aXRjaCAoIHNjb3BlLnRvdWNoZXMuVFdPICkge1xuXG5cdFx0XHRcdFx0XHRjYXNlIFRPVUNILkRPTExZX1BBTjpcblxuXHRcdFx0XHRcdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlICYmIHNjb3BlLmVuYWJsZVBhbiA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdFx0XHRcdFx0aGFuZGxlVG91Y2hTdGFydERvbGx5UGFuKCk7XG5cblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBTVEFURS5UT1VDSF9ET0xMWV9QQU47XG5cblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdGNhc2UgVE9VQ0guRE9MTFlfUk9UQVRFOlxuXG5cdFx0XHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlWm9vbSA9PT0gZmFsc2UgJiYgc2NvcGUuZW5hYmxlUm90YXRlID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdFx0XHRoYW5kbGVUb3VjaFN0YXJ0RG9sbHlSb3RhdGUoKTtcblxuXHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLlRPVUNIX0RPTExZX1JPVEFURTtcblxuXHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0XHRcdFx0XHRzdGF0ZSA9IFNUQVRFLk5PTkU7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXG5cdFx0XHRcdFx0c3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0XHR9XG5cblx0XHRcdGlmICggc3RhdGUgIT09IFNUQVRFLk5PTkUgKSB7XG5cblx0XHRcdFx0c2NvcGUuZGlzcGF0Y2hFdmVudCggX3N0YXJ0RXZlbnQgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Ub3VjaE1vdmUoIGV2ZW50ICkge1xuXG5cdFx0XHR0cmFja1BvaW50ZXIoIGV2ZW50ICk7XG5cblx0XHRcdHN3aXRjaCAoIHN0YXRlICkge1xuXG5cdFx0XHRcdGNhc2UgU1RBVEUuVE9VQ0hfUk9UQVRFOlxuXG5cdFx0XHRcdFx0aWYgKCBzY29wZS5lbmFibGVSb3RhdGUgPT09IGZhbHNlICkgcmV0dXJuO1xuXG5cdFx0XHRcdFx0aGFuZGxlVG91Y2hNb3ZlUm90YXRlKCBldmVudCApO1xuXG5cdFx0XHRcdFx0c2NvcGUudXBkYXRlKCk7XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFNUQVRFLlRPVUNIX1BBTjpcblxuXHRcdFx0XHRcdGlmICggc2NvcGUuZW5hYmxlUGFuID09PSBmYWxzZSApIHJldHVybjtcblxuXHRcdFx0XHRcdGhhbmRsZVRvdWNoTW92ZVBhbiggZXZlbnQgKTtcblxuXHRcdFx0XHRcdHNjb3BlLnVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBTVEFURS5UT1VDSF9ET0xMWV9QQU46XG5cblx0XHRcdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlICYmIHNjb3BlLmVuYWJsZVBhbiA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdFx0XHRoYW5kbGVUb3VjaE1vdmVEb2xseVBhbiggZXZlbnQgKTtcblxuXHRcdFx0XHRcdHNjb3BlLnVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBTVEFURS5UT1VDSF9ET0xMWV9ST1RBVEU6XG5cblx0XHRcdFx0XHRpZiAoIHNjb3BlLmVuYWJsZVpvb20gPT09IGZhbHNlICYmIHNjb3BlLmVuYWJsZVJvdGF0ZSA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdFx0XHRoYW5kbGVUb3VjaE1vdmVEb2xseVJvdGF0ZSggZXZlbnQgKTtcblxuXHRcdFx0XHRcdHNjb3BlLnVwZGF0ZSgpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblxuXHRcdFx0XHRcdHN0YXRlID0gU1RBVEUuTk9ORTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Ub3VjaEVuZCggZXZlbnQgKSB7XG5cblx0XHRcdGhhbmRsZVRvdWNoRW5kKCBldmVudCApO1xuXG5cdFx0XHRzY29wZS5kaXNwYXRjaEV2ZW50KCBfZW5kRXZlbnQgKTtcblxuXHRcdFx0c3RhdGUgPSBTVEFURS5OT05FO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gb25Db250ZXh0TWVudSggZXZlbnQgKSB7XG5cblx0XHRcdGlmICggc2NvcGUuZW5hYmxlZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBhZGRQb2ludGVyKCBldmVudCApIHtcblxuXHRcdFx0cG9pbnRlcnMucHVzaCggZXZlbnQgKTtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZVBvaW50ZXIoIGV2ZW50ICkge1xuXG5cdFx0XHRkZWxldGUgcG9pbnRlclBvc2l0aW9uc1sgZXZlbnQucG9pbnRlcklkIF07XG5cblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IHBvaW50ZXJzLmxlbmd0aDsgaSArKyApIHtcblxuXHRcdFx0XHRpZiAoIHBvaW50ZXJzWyBpIF0ucG9pbnRlcklkID09IGV2ZW50LnBvaW50ZXJJZCApIHtcblxuXHRcdFx0XHRcdHBvaW50ZXJzLnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyYWNrUG9pbnRlciggZXZlbnQgKSB7XG5cblx0XHRcdGxldCBwb3NpdGlvbiA9IHBvaW50ZXJQb3NpdGlvbnNbIGV2ZW50LnBvaW50ZXJJZCBdO1xuXG5cdFx0XHRpZiAoIHBvc2l0aW9uID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0cG9zaXRpb24gPSBuZXcgVmVjdG9yMigpO1xuXHRcdFx0XHRwb2ludGVyUG9zaXRpb25zWyBldmVudC5wb2ludGVySWQgXSA9IHBvc2l0aW9uO1xuXG5cdFx0XHR9XG5cblx0XHRcdHBvc2l0aW9uLnNldCggZXZlbnQucGFnZVgsIGV2ZW50LnBhZ2VZICk7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRTZWNvbmRQb2ludGVyUG9zaXRpb24oIGV2ZW50ICkge1xuXG5cdFx0XHRjb25zdCBwb2ludGVyID0gKCBldmVudC5wb2ludGVySWQgPT09IHBvaW50ZXJzWyAwIF0ucG9pbnRlcklkICkgPyBwb2ludGVyc1sgMSBdIDogcG9pbnRlcnNbIDAgXTtcblxuXHRcdFx0cmV0dXJuIHBvaW50ZXJQb3NpdGlvbnNbIHBvaW50ZXIucG9pbnRlcklkIF07XG5cblx0XHR9XG5cblx0XHQvL1xuXG5cdFx0c2NvcGUuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnY29udGV4dG1lbnUnLCBvbkNvbnRleHRNZW51ICk7XG5cblx0XHRzY29wZS5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdwb2ludGVyZG93bicsIG9uUG9pbnRlckRvd24gKTtcblx0XHRzY29wZS5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdwb2ludGVyY2FuY2VsJywgb25Qb2ludGVyQ2FuY2VsICk7XG5cdFx0c2NvcGUuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnd2hlZWwnLCBvbk1vdXNlV2hlZWwsIHsgcGFzc2l2ZTogZmFsc2UgfSApO1xuXG5cdFx0Ly8gZm9yY2UgYW4gdXBkYXRlIGF0IHN0YXJ0XG5cblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdH1cblxufVxuXG5cbi8vIFRoaXMgc2V0IG9mIGNvbnRyb2xzIHBlcmZvcm1zIG9yYml0aW5nLCBkb2xseWluZyAoem9vbWluZyksIGFuZCBwYW5uaW5nLlxuLy8gVW5saWtlIFRyYWNrYmFsbENvbnRyb2xzLCBpdCBtYWludGFpbnMgdGhlIFwidXBcIiBkaXJlY3Rpb24gb2JqZWN0LnVwICgrWSBieSBkZWZhdWx0KS5cbi8vIFRoaXMgaXMgdmVyeSBzaW1pbGFyIHRvIE9yYml0Q29udHJvbHMsIGFub3RoZXIgc2V0IG9mIHRvdWNoIGJlaGF2aW9yXG4vL1xuLy8gICAgT3JiaXQgLSByaWdodCBtb3VzZSwgb3IgbGVmdCBtb3VzZSArIGN0cmwvbWV0YS9zaGlmdEtleSAvIHRvdWNoOiB0d28tZmluZ2VyIHJvdGF0ZVxuLy8gICAgWm9vbSAtIG1pZGRsZSBtb3VzZSwgb3IgbW91c2V3aGVlbCAvIHRvdWNoOiB0d28tZmluZ2VyIHNwcmVhZCBvciBzcXVpc2hcbi8vICAgIFBhbiAtIGxlZnQgbW91c2UsIG9yIGFycm93IGtleXMgLyB0b3VjaDogb25lLWZpbmdlciBtb3ZlXG5cbmNsYXNzIE1hcENvbnRyb2xzIGV4dGVuZHMgT3JiaXRDb250cm9scyB7XG5cblx0Y29uc3RydWN0b3IoIG9iamVjdCwgZG9tRWxlbWVudCApIHtcblxuXHRcdHN1cGVyKCBvYmplY3QsIGRvbUVsZW1lbnQgKTtcblxuXHRcdHRoaXMuc2NyZWVuU3BhY2VQYW5uaW5nID0gZmFsc2U7IC8vIHBhbiBvcnRob2dvbmFsIHRvIHdvcmxkLXNwYWNlIGRpcmVjdGlvbiBjYW1lcmEudXBcblxuXHRcdHRoaXMubW91c2VCdXR0b25zLkxFRlQgPSBNT1VTRS5QQU47XG5cdFx0dGhpcy5tb3VzZUJ1dHRvbnMuUklHSFQgPSBNT1VTRS5ST1RBVEU7XG5cblx0XHR0aGlzLnRvdWNoZXMuT05FID0gVE9VQ0guUEFOO1xuXHRcdHRoaXMudG91Y2hlcy5UV08gPSBUT1VDSC5ET0xMWV9ST1RBVEU7XG5cblx0fVxuXG59XG5cbmV4cG9ydCB7IE9yYml0Q29udHJvbHMsIE1hcENvbnRyb2xzIH07XG4iLCIvKipcbiAqIGRhdC1ndWkgSmF2YVNjcmlwdCBDb250cm9sbGVyIExpYnJhcnlcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9kYXQtZ3VpXG4gKlxuICogQ29weXJpZ2h0IDIwMTEgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBDcmVhdGl2ZSBMYWJcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKi9cblxuZnVuY3Rpb24gX19fJGluc2VydFN0eWxlKCBjc3MgKSB7XG5cblx0aWYgKCAhIGNzcyApIHtcblxuXHRcdHJldHVybjtcblxuXHR9XG5cdGlmICggdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG5cblx0XHRyZXR1cm47XG5cblx0fVxuXG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzdHlsZScgKTtcblxuXHRzdHlsZS5zZXRBdHRyaWJ1dGUoICd0eXBlJywgJ3RleHQvY3NzJyApO1xuXHRzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG5cdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoIHN0eWxlICk7XG5cblx0cmV0dXJuIGNzcztcblxufVxuXG5mdW5jdGlvbiBjb2xvclRvU3RyaW5nKCBjb2xvciwgZm9yY2VDU1NIZXggKSB7XG5cblx0dmFyIGNvbG9yRm9ybWF0ID0gY29sb3IuX19zdGF0ZS5jb252ZXJzaW9uTmFtZS50b1N0cmluZygpO1xuXHR2YXIgciA9IE1hdGgucm91bmQoIGNvbG9yLnIgKTtcblx0dmFyIGcgPSBNYXRoLnJvdW5kKCBjb2xvci5nICk7XG5cdHZhciBiID0gTWF0aC5yb3VuZCggY29sb3IuYiApO1xuXHR2YXIgYSA9IGNvbG9yLmE7XG5cdHZhciBoID0gTWF0aC5yb3VuZCggY29sb3IuaCApO1xuXHR2YXIgcyA9IGNvbG9yLnMudG9GaXhlZCggMSApO1xuXHR2YXIgdiA9IGNvbG9yLnYudG9GaXhlZCggMSApO1xuXHRpZiAoIGZvcmNlQ1NTSGV4IHx8IGNvbG9yRm9ybWF0ID09PSAnVEhSRUVfQ0hBUl9IRVgnIHx8IGNvbG9yRm9ybWF0ID09PSAnU0lYX0NIQVJfSEVYJyApIHtcblxuXHRcdHZhciBzdHIgPSBjb2xvci5oZXgudG9TdHJpbmcoIDE2ICk7XG5cdFx0d2hpbGUgKCBzdHIubGVuZ3RoIDwgNiApIHtcblxuXHRcdFx0c3RyID0gJzAnICsgc3RyO1xuXG5cdFx0fVxuXHRcdHJldHVybiAnIycgKyBzdHI7XG5cblx0fSBlbHNlIGlmICggY29sb3JGb3JtYXQgPT09ICdDU1NfUkdCJyApIHtcblxuXHRcdHJldHVybiAncmdiKCcgKyByICsgJywnICsgZyArICcsJyArIGIgKyAnKSc7XG5cblx0fSBlbHNlIGlmICggY29sb3JGb3JtYXQgPT09ICdDU1NfUkdCQScgKSB7XG5cblx0XHRyZXR1cm4gJ3JnYmEoJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcsJyArIGEgKyAnKSc7XG5cblx0fSBlbHNlIGlmICggY29sb3JGb3JtYXQgPT09ICdIRVgnICkge1xuXG5cdFx0cmV0dXJuICcweCcgKyBjb2xvci5oZXgudG9TdHJpbmcoIDE2ICk7XG5cblx0fSBlbHNlIGlmICggY29sb3JGb3JtYXQgPT09ICdSR0JfQVJSQVknICkge1xuXG5cdFx0cmV0dXJuICdbJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICddJztcblxuXHR9IGVsc2UgaWYgKCBjb2xvckZvcm1hdCA9PT0gJ1JHQkFfQVJSQVknICkge1xuXG5cdFx0cmV0dXJuICdbJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcsJyArIGEgKyAnXSc7XG5cblx0fSBlbHNlIGlmICggY29sb3JGb3JtYXQgPT09ICdSR0JfT0JKJyApIHtcblxuXHRcdHJldHVybiAne3I6JyArIHIgKyAnLGc6JyArIGcgKyAnLGI6JyArIGIgKyAnfSc7XG5cblx0fSBlbHNlIGlmICggY29sb3JGb3JtYXQgPT09ICdSR0JBX09CSicgKSB7XG5cblx0XHRyZXR1cm4gJ3tyOicgKyByICsgJyxnOicgKyBnICsgJyxiOicgKyBiICsgJyxhOicgKyBhICsgJ30nO1xuXG5cdH0gZWxzZSBpZiAoIGNvbG9yRm9ybWF0ID09PSAnSFNWX09CSicgKSB7XG5cblx0XHRyZXR1cm4gJ3toOicgKyBoICsgJyxzOicgKyBzICsgJyx2OicgKyB2ICsgJ30nO1xuXG5cdH0gZWxzZSBpZiAoIGNvbG9yRm9ybWF0ID09PSAnSFNWQV9PQkonICkge1xuXG5cdFx0cmV0dXJuICd7aDonICsgaCArICcsczonICsgcyArICcsdjonICsgdiArICcsYTonICsgYSArICd9JztcblxuXHR9XG5cdHJldHVybiAndW5rbm93biBmb3JtYXQnO1xuXG59XG5cbnZhciBBUlJfRUFDSCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xudmFyIEFSUl9TTElDRSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBDb21tb24gPSB7XG5cdEJSRUFLOiB7fSxcblx0ZXh0ZW5kOiBmdW5jdGlvbiBleHRlbmQoIHRhcmdldCApIHtcblxuXHRcdHRoaXMuZWFjaCggQVJSX1NMSUNFLmNhbGwoIGFyZ3VtZW50cywgMSApLCBmdW5jdGlvbiAoIG9iaiApIHtcblxuXHRcdFx0dmFyIGtleXMgPSB0aGlzLmlzT2JqZWN0KCBvYmogKSA/IE9iamVjdC5rZXlzKCBvYmogKSA6IFtdO1xuXHRcdFx0a2V5cy5mb3JFYWNoKCBmdW5jdGlvbiAoIGtleSApIHtcblxuXHRcdFx0XHRpZiAoICEgdGhpcy5pc1VuZGVmaW5lZCggb2JqWyBrZXkgXSApICkge1xuXG5cdFx0XHRcdFx0dGFyZ2V0WyBrZXkgXSA9IG9ialsga2V5IF07XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdFx0fSwgdGhpcyApO1xuXHRcdHJldHVybiB0YXJnZXQ7XG5cblx0fSxcblx0ZGVmYXVsdHM6IGZ1bmN0aW9uIGRlZmF1bHRzKCB0YXJnZXQgKSB7XG5cblx0XHR0aGlzLmVhY2goIEFSUl9TTElDRS5jYWxsKCBhcmd1bWVudHMsIDEgKSwgZnVuY3Rpb24gKCBvYmogKSB7XG5cblx0XHRcdHZhciBrZXlzID0gdGhpcy5pc09iamVjdCggb2JqICkgPyBPYmplY3Qua2V5cyggb2JqICkgOiBbXTtcblx0XHRcdGtleXMuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXkgKSB7XG5cblx0XHRcdFx0aWYgKCB0aGlzLmlzVW5kZWZpbmVkKCB0YXJnZXRbIGtleSBdICkgKSB7XG5cblx0XHRcdFx0XHR0YXJnZXRbIGtleSBdID0gb2JqWyBrZXkgXTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH0uYmluZCggdGhpcyApICk7XG5cblx0XHR9LCB0aGlzICk7XG5cdFx0cmV0dXJuIHRhcmdldDtcblxuXHR9LFxuXHRjb21wb3NlOiBmdW5jdGlvbiBjb21wb3NlKCkge1xuXG5cdFx0dmFyIHRvQ2FsbCA9IEFSUl9TTElDRS5jYWxsKCBhcmd1bWVudHMgKTtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgYXJncyA9IEFSUl9TTElDRS5jYWxsKCBhcmd1bWVudHMgKTtcblx0XHRcdGZvciAoIHZhciBpID0gdG9DYWxsLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtLSApIHtcblxuXHRcdFx0XHRhcmdzID0gWyB0b0NhbGxbIGkgXS5hcHBseSggdGhpcywgYXJncyApIF07XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBhcmdzWyAwIF07XG5cblx0XHR9O1xuXG5cdH0sXG5cdGVhY2g6IGZ1bmN0aW9uIGVhY2goIG9iaiwgaXRyLCBzY29wZSApIHtcblxuXHRcdGlmICggISBvYmogKSB7XG5cblx0XHRcdHJldHVybjtcblxuXHRcdH1cblx0XHRpZiAoIEFSUl9FQUNIICYmIG9iai5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBBUlJfRUFDSCApIHtcblxuXHRcdFx0b2JqLmZvckVhY2goIGl0ciwgc2NvcGUgKTtcblxuXHRcdH0gZWxzZSBpZiAoIG9iai5sZW5ndGggPT09IG9iai5sZW5ndGggKyAwICkge1xuXG5cdFx0XHR2YXIga2V5ID0gdm9pZCAwO1xuXHRcdFx0dmFyIGwgPSB2b2lkIDA7XG5cdFx0XHRmb3IgKCBrZXkgPSAwLCBsID0gb2JqLmxlbmd0aDsga2V5IDwgbDsga2V5ICsrICkge1xuXG5cdFx0XHRcdGlmICgga2V5IGluIG9iaiAmJiBpdHIuY2FsbCggc2NvcGUsIG9ialsga2V5IF0sIGtleSApID09PSB0aGlzLkJSRUFLICkge1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Zm9yICggdmFyIF9rZXkgaW4gb2JqICkge1xuXG5cdFx0XHRcdGlmICggaXRyLmNhbGwoIHNjb3BlLCBvYmpbIF9rZXkgXSwgX2tleSApID09PSB0aGlzLkJSRUFLICkge1xuXG5cdFx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH0sXG5cdGRlZmVyOiBmdW5jdGlvbiBkZWZlciggZm5jICkge1xuXG5cdFx0c2V0VGltZW91dCggZm5jLCAwICk7XG5cblx0fSxcblx0ZGVib3VuY2U6IGZ1bmN0aW9uIGRlYm91bmNlKCBmdW5jLCB0aHJlc2hvbGQsIGNhbGxJbW1lZGlhdGVseSApIHtcblxuXHRcdHZhciB0aW1lb3V0ID0gdm9pZCAwO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHZhciBvYmogPSB0aGlzO1xuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRmdW5jdGlvbiBkZWxheWVkKCkge1xuXG5cdFx0XHRcdHRpbWVvdXQgPSBudWxsO1xuXHRcdFx0XHRpZiAoICEgY2FsbEltbWVkaWF0ZWx5ICkgZnVuYy5hcHBseSggb2JqLCBhcmdzICk7XG5cblx0XHRcdH1cblx0XHRcdHZhciBjYWxsTm93ID0gY2FsbEltbWVkaWF0ZWx5IHx8ICEgdGltZW91dDtcblx0XHRcdGNsZWFyVGltZW91dCggdGltZW91dCApO1xuXHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoIGRlbGF5ZWQsIHRocmVzaG9sZCApO1xuXHRcdFx0aWYgKCBjYWxsTm93ICkge1xuXG5cdFx0XHRcdGZ1bmMuYXBwbHkoIG9iaiwgYXJncyApO1xuXG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdH0sXG5cdHRvQXJyYXk6IGZ1bmN0aW9uIHRvQXJyYXkoIG9iaiApIHtcblxuXHRcdGlmICggb2JqLnRvQXJyYXkgKSByZXR1cm4gb2JqLnRvQXJyYXkoKTtcblx0XHRyZXR1cm4gQVJSX1NMSUNFLmNhbGwoIG9iaiApO1xuXG5cdH0sXG5cdGlzVW5kZWZpbmVkOiBmdW5jdGlvbiBpc1VuZGVmaW5lZCggb2JqICkge1xuXG5cdFx0cmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuXG5cdH0sXG5cdGlzTnVsbDogZnVuY3Rpb24gaXNOdWxsKCBvYmogKSB7XG5cblx0XHRyZXR1cm4gb2JqID09PSBudWxsO1xuXG5cdH0sXG5cdGlzTmFOOiBmdW5jdGlvbiAoIF9pc05hTiApIHtcblxuXHRcdGZ1bmN0aW9uIGlzTmFOKCkge1xuXG5cdFx0XHRyZXR1cm4gX2lzTmFOLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuXHRcdH1cblx0XHRpc05hTi50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIF9pc05hTi50b1N0cmluZygpO1xuXG5cdFx0fTtcblx0XHRyZXR1cm4gaXNOYU47XG5cblx0fSggZnVuY3Rpb24gKCBvYmogKSB7XG5cblx0XHRyZXR1cm4gaXNOYU4oIG9iaiApO1xuXG5cdH0gKSxcblx0aXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoIG9iaiApIHtcblxuXHRcdHJldHVybiBvYmouY29uc3RydWN0b3IgPT09IEFycmF5O1xuXG5cdH0sXG5cdGlzT2JqZWN0OiBmdW5jdGlvbiBpc09iamVjdCggb2JqICkge1xuXG5cdFx0cmV0dXJuIG9iaiA9PT0gT2JqZWN0KCBvYmogKTtcblxuXHR9LFxuXHRpc051bWJlcjogZnVuY3Rpb24gaXNOdW1iZXIoIG9iaiApIHtcblxuXHRcdHJldHVybiBvYmogPT09IG9iaiArIDA7XG5cblx0fSxcblx0aXNTdHJpbmc6IGZ1bmN0aW9uIGlzU3RyaW5nKCBvYmogKSB7XG5cblx0XHRyZXR1cm4gb2JqID09PSBvYmogKyAnJztcblxuXHR9LFxuXHRpc0Jvb2xlYW46IGZ1bmN0aW9uIGlzQm9vbGVhbiggb2JqICkge1xuXG5cdFx0cmV0dXJuIG9iaiA9PT0gZmFsc2UgfHwgb2JqID09PSB0cnVlO1xuXG5cdH0sXG5cdGlzRnVuY3Rpb246IGZ1bmN0aW9uIGlzRnVuY3Rpb24oIG9iaiApIHtcblxuXHRcdHJldHVybiBvYmogaW5zdGFuY2VvZiBGdW5jdGlvbjtcblxuXHR9XG59O1xuXG52YXIgSU5URVJQUkVUQVRJT05TID0gW1xuXHR7XG5cdFx0bGl0bXVzOiBDb21tb24uaXNTdHJpbmcsXG5cdFx0Y29udmVyc2lvbnM6IHtcblx0XHRcdFRIUkVFX0NIQVJfSEVYOiB7XG5cdFx0XHRcdHJlYWQ6IGZ1bmN0aW9uIHJlYWQoIG9yaWdpbmFsICkge1xuXG5cdFx0XHRcdFx0dmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCggL14jKFtBLUYwLTldKShbQS1GMC05XSkoW0EtRjAtOV0pJC9pICk7XG5cdFx0XHRcdFx0aWYgKCB0ZXN0ID09PSBudWxsICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHNwYWNlOiAnSEVYJyxcblx0XHRcdFx0XHRcdGhleDogcGFyc2VJbnQoICcweCcgKyB0ZXN0WyAxIF0udG9TdHJpbmcoKSArIHRlc3RbIDEgXS50b1N0cmluZygpICsgdGVzdFsgMiBdLnRvU3RyaW5nKCkgKyB0ZXN0WyAyIF0udG9TdHJpbmcoKSArIHRlc3RbIDMgXS50b1N0cmluZygpICsgdGVzdFsgMyBdLnRvU3RyaW5nKCksIDAgKVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0d3JpdGU6IGNvbG9yVG9TdHJpbmdcblx0XHRcdH0sXG5cdFx0XHRTSVhfQ0hBUl9IRVg6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHR2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKCAvXiMoW0EtRjAtOV17Nn0pJC9pICk7XG5cdFx0XHRcdFx0aWYgKCB0ZXN0ID09PSBudWxsICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHNwYWNlOiAnSEVYJyxcblx0XHRcdFx0XHRcdGhleDogcGFyc2VJbnQoICcweCcgKyB0ZXN0WyAxIF0udG9TdHJpbmcoKSwgMCApXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHR3cml0ZTogY29sb3JUb1N0cmluZ1xuXHRcdFx0fSxcblx0XHRcdENTU19SR0I6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHR2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKCAvXnJnYlxcKFxccyooLispXFxzKixcXHMqKC4rKVxccyosXFxzKiguKylcXHMqXFwpLyApO1xuXHRcdFx0XHRcdGlmICggdGVzdCA9PT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRzcGFjZTogJ1JHQicsXG5cdFx0XHRcdFx0XHRyOiBwYXJzZUZsb2F0KCB0ZXN0WyAxIF0gKSxcblx0XHRcdFx0XHRcdGc6IHBhcnNlRmxvYXQoIHRlc3RbIDIgXSApLFxuXHRcdFx0XHRcdFx0YjogcGFyc2VGbG9hdCggdGVzdFsgMyBdIClcblx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHdyaXRlOiBjb2xvclRvU3RyaW5nXG5cdFx0XHR9LFxuXHRcdFx0Q1NTX1JHQkE6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHR2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKCAvXnJnYmFcXChcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKixcXHMqKC4rKVxccypcXCkvICk7XG5cdFx0XHRcdFx0aWYgKCB0ZXN0ID09PSBudWxsICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHNwYWNlOiAnUkdCJyxcblx0XHRcdFx0XHRcdHI6IHBhcnNlRmxvYXQoIHRlc3RbIDEgXSApLFxuXHRcdFx0XHRcdFx0ZzogcGFyc2VGbG9hdCggdGVzdFsgMiBdICksXG5cdFx0XHRcdFx0XHRiOiBwYXJzZUZsb2F0KCB0ZXN0WyAzIF0gKSxcblx0XHRcdFx0XHRcdGE6IHBhcnNlRmxvYXQoIHRlc3RbIDQgXSApXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHR3cml0ZTogY29sb3JUb1N0cmluZ1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0e1xuXHRcdGxpdG11czogQ29tbW9uLmlzTnVtYmVyLFxuXHRcdGNvbnZlcnNpb25zOiB7XG5cdFx0XHRIRVg6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0c3BhY2U6ICdIRVgnLFxuXHRcdFx0XHRcdFx0aGV4OiBvcmlnaW5hbCxcblx0XHRcdFx0XHRcdGNvbnZlcnNpb25OYW1lOiAnSEVYJ1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0d3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCBjb2xvciApIHtcblxuXHRcdFx0XHRcdHJldHVybiBjb2xvci5oZXg7XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0e1xuXHRcdGxpdG11czogQ29tbW9uLmlzQXJyYXksXG5cdFx0Y29udmVyc2lvbnM6IHtcblx0XHRcdFJHQl9BUlJBWToge1xuXHRcdFx0XHRyZWFkOiBmdW5jdGlvbiByZWFkKCBvcmlnaW5hbCApIHtcblxuXHRcdFx0XHRcdGlmICggb3JpZ2luYWwubGVuZ3RoICE9PSAzICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdHNwYWNlOiAnUkdCJyxcblx0XHRcdFx0XHRcdHI6IG9yaWdpbmFsWyAwIF0sXG5cdFx0XHRcdFx0XHRnOiBvcmlnaW5hbFsgMSBdLFxuXHRcdFx0XHRcdFx0Yjogb3JpZ2luYWxbIDIgXVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0d3JpdGU6IGZ1bmN0aW9uIHdyaXRlKCBjb2xvciApIHtcblxuXHRcdFx0XHRcdHJldHVybiBbIGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIgXTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0UkdCQV9BUlJBWToge1xuXHRcdFx0XHRyZWFkOiBmdW5jdGlvbiByZWFkKCBvcmlnaW5hbCApIHtcblxuXHRcdFx0XHRcdGlmICggb3JpZ2luYWwubGVuZ3RoICE9PSA0ICkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRzcGFjZTogJ1JHQicsXG5cdFx0XHRcdFx0XHRyOiBvcmlnaW5hbFsgMCBdLFxuXHRcdFx0XHRcdFx0Zzogb3JpZ2luYWxbIDEgXSxcblx0XHRcdFx0XHRcdGI6IG9yaWdpbmFsWyAyIF0sXG5cdFx0XHRcdFx0XHRhOiBvcmlnaW5hbFsgMyBdXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHR3cml0ZTogZnVuY3Rpb24gd3JpdGUoIGNvbG9yICkge1xuXG5cdFx0XHRcdFx0cmV0dXJuIFsgY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYSBdO1xuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdHtcblx0XHRsaXRtdXM6IENvbW1vbi5pc09iamVjdCxcblx0XHRjb252ZXJzaW9uczoge1xuXHRcdFx0UkdCQV9PQko6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHRpZiAoIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuciApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuZyApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuYiApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuYSApICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRzcGFjZTogJ1JHQicsXG5cdFx0XHRcdFx0XHRcdHI6IG9yaWdpbmFsLnIsXG5cdFx0XHRcdFx0XHRcdGc6IG9yaWdpbmFsLmcsXG5cdFx0XHRcdFx0XHRcdGI6IG9yaWdpbmFsLmIsXG5cdFx0XHRcdFx0XHRcdGE6IG9yaWdpbmFsLmFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHdyaXRlOiBmdW5jdGlvbiB3cml0ZSggY29sb3IgKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0cjogY29sb3Iucixcblx0XHRcdFx0XHRcdGc6IGNvbG9yLmcsXG5cdFx0XHRcdFx0XHRiOiBjb2xvci5iLFxuXHRcdFx0XHRcdFx0YTogY29sb3IuYVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFJHQl9PQko6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHRpZiAoIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuciApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuZyApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuYiApICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRzcGFjZTogJ1JHQicsXG5cdFx0XHRcdFx0XHRcdHI6IG9yaWdpbmFsLnIsXG5cdFx0XHRcdFx0XHRcdGc6IG9yaWdpbmFsLmcsXG5cdFx0XHRcdFx0XHRcdGI6IG9yaWdpbmFsLmJcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHdyaXRlOiBmdW5jdGlvbiB3cml0ZSggY29sb3IgKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0cjogY29sb3Iucixcblx0XHRcdFx0XHRcdGc6IGNvbG9yLmcsXG5cdFx0XHRcdFx0XHRiOiBjb2xvci5iXG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0SFNWQV9PQko6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHRpZiAoIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuaCApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwucyApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwudiApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuYSApICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRzcGFjZTogJ0hTVicsXG5cdFx0XHRcdFx0XHRcdGg6IG9yaWdpbmFsLmgsXG5cdFx0XHRcdFx0XHRcdHM6IG9yaWdpbmFsLnMsXG5cdFx0XHRcdFx0XHRcdHY6IG9yaWdpbmFsLnYsXG5cdFx0XHRcdFx0XHRcdGE6IG9yaWdpbmFsLmFcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHdyaXRlOiBmdW5jdGlvbiB3cml0ZSggY29sb3IgKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0aDogY29sb3IuaCxcblx0XHRcdFx0XHRcdHM6IGNvbG9yLnMsXG5cdFx0XHRcdFx0XHR2OiBjb2xvci52LFxuXHRcdFx0XHRcdFx0YTogY29sb3IuYVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdEhTVl9PQko6IHtcblx0XHRcdFx0cmVhZDogZnVuY3Rpb24gcmVhZCggb3JpZ2luYWwgKSB7XG5cblx0XHRcdFx0XHRpZiAoIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwuaCApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwucyApICYmIENvbW1vbi5pc051bWJlciggb3JpZ2luYWwudiApICkge1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHRzcGFjZTogJ0hTVicsXG5cdFx0XHRcdFx0XHRcdGg6IG9yaWdpbmFsLmgsXG5cdFx0XHRcdFx0XHRcdHM6IG9yaWdpbmFsLnMsXG5cdFx0XHRcdFx0XHRcdHY6IG9yaWdpbmFsLnZcblx0XHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHdyaXRlOiBmdW5jdGlvbiB3cml0ZSggY29sb3IgKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0aDogY29sb3IuaCxcblx0XHRcdFx0XHRcdHM6IGNvbG9yLnMsXG5cdFx0XHRcdFx0XHR2OiBjb2xvci52XG5cdFx0XHRcdFx0fTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9IF07XG52YXIgcmVzdWx0ID0gdm9pZCAwO1xudmFyIHRvUmV0dXJuID0gdm9pZCAwO1xudmFyIGludGVycHJldCA9IGZ1bmN0aW9uIGludGVycHJldCgpIHtcblxuXHR0b1JldHVybiA9IGZhbHNlO1xuXHR2YXIgb3JpZ2luYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IENvbW1vbi50b0FycmF5KCBhcmd1bWVudHMgKSA6IGFyZ3VtZW50c1sgMCBdO1xuXHRDb21tb24uZWFjaCggSU5URVJQUkVUQVRJT05TLCBmdW5jdGlvbiAoIGZhbWlseSApIHtcblxuXHRcdGlmICggZmFtaWx5LmxpdG11cyggb3JpZ2luYWwgKSApIHtcblxuXHRcdFx0Q29tbW9uLmVhY2goIGZhbWlseS5jb252ZXJzaW9ucywgZnVuY3Rpb24gKCBjb252ZXJzaW9uLCBjb252ZXJzaW9uTmFtZSApIHtcblxuXHRcdFx0XHRyZXN1bHQgPSBjb252ZXJzaW9uLnJlYWQoIG9yaWdpbmFsICk7XG5cdFx0XHRcdGlmICggdG9SZXR1cm4gPT09IGZhbHNlICYmIHJlc3VsdCAhPT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0XHR0b1JldHVybiA9IHJlc3VsdDtcblx0XHRcdFx0XHRyZXN1bHQuY29udmVyc2lvbk5hbWUgPSBjb252ZXJzaW9uTmFtZTtcblx0XHRcdFx0XHRyZXN1bHQuY29udmVyc2lvbiA9IGNvbnZlcnNpb247XG5cdFx0XHRcdFx0cmV0dXJuIENvbW1vbi5CUkVBSztcblxuXHRcdFx0XHR9XG5cblx0XHRcdH0gKTtcblx0XHRcdHJldHVybiBDb21tb24uQlJFQUs7XG5cblx0XHR9XG5cblx0fSApO1xuXHRyZXR1cm4gdG9SZXR1cm47XG5cbn07XG5cbnZhciB0bXBDb21wb25lbnQgPSB2b2lkIDA7XG52YXIgQ29sb3JNYXRoID0ge1xuXHRoc3ZfdG9fcmdiOiBmdW5jdGlvbiBoc3ZfdG9fcmdiKCBoLCBzLCB2ICkge1xuXG5cdFx0dmFyIGhpID0gTWF0aC5mbG9vciggaCAvIDYwICkgJSA2O1xuXHRcdHZhciBmID0gaCAvIDYwIC0gTWF0aC5mbG9vciggaCAvIDYwICk7XG5cdFx0dmFyIHAgPSB2ICogKCAxLjAgLSBzICk7XG5cdFx0dmFyIHEgPSB2ICogKCAxLjAgLSBmICogcyApO1xuXHRcdHZhciB0ID0gdiAqICggMS4wIC0gKCAxLjAgLSBmICkgKiBzICk7XG5cdFx0dmFyIGMgPSBbWyB2LCB0LCBwIF0sIFsgcSwgdiwgcCBdLCBbIHAsIHYsIHQgXSwgWyBwLCBxLCB2IF0sIFsgdCwgcCwgdiBdLCBbIHYsIHAsIHEgXV1bIGhpIF07XG5cdFx0cmV0dXJuIHtcblx0XHRcdHI6IGNbIDAgXSAqIDI1NSxcblx0XHRcdGc6IGNbIDEgXSAqIDI1NSxcblx0XHRcdGI6IGNbIDIgXSAqIDI1NVxuXHRcdH07XG5cblx0fSxcblx0cmdiX3RvX2hzdjogZnVuY3Rpb24gcmdiX3RvX2hzdiggciwgZywgYiApIHtcblxuXHRcdHZhciBtaW4gPSBNYXRoLm1pbiggciwgZywgYiApO1xuXHRcdHZhciBtYXggPSBNYXRoLm1heCggciwgZywgYiApO1xuXHRcdHZhciBkZWx0YSA9IG1heCAtIG1pbjtcblx0XHR2YXIgaCA9IHZvaWQgMDtcblx0XHR2YXIgcyA9IHZvaWQgMDtcblx0XHRpZiAoIG1heCAhPT0gMCApIHtcblxuXHRcdFx0cyA9IGRlbHRhIC8gbWF4O1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aDogTmFOLFxuXHRcdFx0XHRzOiAwLFxuXHRcdFx0XHR2OiAwXG5cdFx0XHR9O1xuXG5cdFx0fVxuXHRcdGlmICggciA9PT0gbWF4ICkge1xuXG5cdFx0XHRoID0gKCBnIC0gYiApIC8gZGVsdGE7XG5cblx0XHR9IGVsc2UgaWYgKCBnID09PSBtYXggKSB7XG5cblx0XHRcdGggPSAyICsgKCBiIC0gciApIC8gZGVsdGE7XG5cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRoID0gNCArICggciAtIGcgKSAvIGRlbHRhO1xuXG5cdFx0fVxuXHRcdGggLz0gNjtcblx0XHRpZiAoIGggPCAwICkge1xuXG5cdFx0XHRoICs9IDE7XG5cblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdGg6IGggKiAzNjAsXG5cdFx0XHRzOiBzLFxuXHRcdFx0djogbWF4IC8gMjU1XG5cdFx0fTtcblxuXHR9LFxuXHRyZ2JfdG9faGV4OiBmdW5jdGlvbiByZ2JfdG9faGV4KCByLCBnLCBiICkge1xuXG5cdFx0dmFyIGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KCAwLCAyLCByICk7XG5cdFx0aGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoIGhleCwgMSwgZyApO1xuXHRcdGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KCBoZXgsIDAsIGIgKTtcblx0XHRyZXR1cm4gaGV4O1xuXG5cdH0sXG5cdGNvbXBvbmVudF9mcm9tX2hleDogZnVuY3Rpb24gY29tcG9uZW50X2Zyb21faGV4KCBoZXgsIGNvbXBvbmVudEluZGV4ICkge1xuXG5cdFx0cmV0dXJuIGhleCA+PiBjb21wb25lbnRJbmRleCAqIDggJiAweEZGO1xuXG5cdH0sXG5cdGhleF93aXRoX2NvbXBvbmVudDogZnVuY3Rpb24gaGV4X3dpdGhfY29tcG9uZW50KCBoZXgsIGNvbXBvbmVudEluZGV4LCB2YWx1ZSApIHtcblxuXHRcdHJldHVybiB2YWx1ZSA8PCAoIHRtcENvbXBvbmVudCA9IGNvbXBvbmVudEluZGV4ICogOCApIHwgaGV4ICYgfiAoIDB4RkYgPDwgdG1wQ29tcG9uZW50ICk7XG5cblx0fVxufTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uICggb2JqICkge1xuXG5cdHJldHVybiB0eXBlb2Ygb2JqO1xuXG59IDogZnVuY3Rpb24gKCBvYmogKSB7XG5cblx0cmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG5cbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKCBpbnN0YW5jZSwgQ29uc3RydWN0b3IgKSB7XG5cblx0aWYgKCAhICggaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvciApICkge1xuXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvciggXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIiApO1xuXG5cdH1cblxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuXG5cdGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoIHRhcmdldCwgcHJvcHMgKSB7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkgKysgKSB7XG5cblx0XHRcdHZhciBkZXNjcmlwdG9yID0gcHJvcHNbIGkgXTtcblx0XHRcdGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcblx0XHRcdGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcblx0XHRcdGlmICggXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IgKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggdGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvciApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gKCBDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMgKSB7XG5cblx0XHRpZiAoIHByb3RvUHJvcHMgKSBkZWZpbmVQcm9wZXJ0aWVzKCBDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMgKTtcblx0XHRpZiAoIHN0YXRpY1Byb3BzICkgZGVmaW5lUHJvcGVydGllcyggQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzICk7XG5cdFx0cmV0dXJuIENvbnN0cnVjdG9yO1xuXG5cdH07XG5cbn0oKTtcblxuXG5cblxuXG5cblxudmFyIGdldCA9IGZ1bmN0aW9uIGdldCggb2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIgKSB7XG5cblx0aWYgKCBvYmplY3QgPT09IG51bGwgKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cdHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciggb2JqZWN0LCBwcm9wZXJ0eSApO1xuXG5cdGlmICggZGVzYyA9PT0gdW5kZWZpbmVkICkge1xuXG5cdFx0dmFyIHBhcmVudCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiggb2JqZWN0ICk7XG5cblx0XHRpZiAoIHBhcmVudCA9PT0gbnVsbCApIHtcblxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHJldHVybiBnZXQoIHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyICk7XG5cblx0XHR9XG5cblx0fSBlbHNlIGlmICggXCJ2YWx1ZVwiIGluIGRlc2MgKSB7XG5cblx0XHRyZXR1cm4gZGVzYy52YWx1ZTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0dmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG5cdFx0aWYgKCBnZXR0ZXIgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblxuXHRcdH1cblxuXHRcdHJldHVybiBnZXR0ZXIuY2FsbCggcmVjZWl2ZXIgKTtcblxuXHR9XG5cbn07XG5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uICggc3ViQ2xhc3MsIHN1cGVyQ2xhc3MgKSB7XG5cblx0aWYgKCB0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwgKSB7XG5cblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCBcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyApO1xuXG5cdH1cblxuXHRzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG5cdFx0Y29uc3RydWN0b3I6IHtcblx0XHRcdHZhbHVlOiBzdWJDbGFzcyxcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHRjb25maWd1cmFibGU6IHRydWVcblx0XHR9XG5cdH0gKTtcblx0aWYgKCBzdXBlckNsYXNzICkgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKCBzdWJDbGFzcywgc3VwZXJDbGFzcyApIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcblxufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiA9IGZ1bmN0aW9uICggc2VsZiwgY2FsbCApIHtcblxuXHRpZiAoICEgc2VsZiApIHtcblxuXHRcdHRocm93IG5ldyBSZWZlcmVuY2VFcnJvciggXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIiApO1xuXG5cdH1cblxuXHRyZXR1cm4gY2FsbCAmJiAoIHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIgKSA/IGNhbGwgOiBzZWxmO1xuXG59O1xuXG52YXIgQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG5cblx0ZnVuY3Rpb24gQ29sb3IoKSB7XG5cblx0XHRjbGFzc0NhbGxDaGVjayggdGhpcywgQ29sb3IgKTtcblx0XHR0aGlzLl9fc3RhdGUgPSBpbnRlcnByZXQuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXHRcdGlmICggdGhpcy5fX3N0YXRlID09PSBmYWxzZSApIHtcblxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCAnRmFpbGVkIHRvIGludGVycHJldCBjb2xvciBhcmd1bWVudHMnICk7XG5cblx0XHR9XG5cdFx0dGhpcy5fX3N0YXRlLmEgPSB0aGlzLl9fc3RhdGUuYSB8fCAxO1xuXG5cdH1cblx0Y3JlYXRlQ2xhc3MoIENvbG9yLCBbIHtcblx0XHRrZXk6ICd0b1N0cmluZycsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXG5cdFx0XHRyZXR1cm4gY29sb3JUb1N0cmluZyggdGhpcyApO1xuXG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAndG9IZXhTdHJpbmcnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiB0b0hleFN0cmluZygpIHtcblxuXHRcdFx0cmV0dXJuIGNvbG9yVG9TdHJpbmcoIHRoaXMsIHRydWUgKTtcblxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3RvT3JpZ2luYWwnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiB0b09yaWdpbmFsKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fX3N0YXRlLmNvbnZlcnNpb24ud3JpdGUoIHRoaXMgKTtcblxuXHRcdH1cblx0fSBdICk7XG5cdHJldHVybiBDb2xvcjtcblxufSgpO1xuZnVuY3Rpb24gZGVmaW5lUkdCQ29tcG9uZW50KCB0YXJnZXQsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXggKSB7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCB0YXJnZXQsIGNvbXBvbmVudCwge1xuXHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXG5cdFx0XHRpZiAoIHRoaXMuX19zdGF0ZS5zcGFjZSA9PT0gJ1JHQicgKSB7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuX19zdGF0ZVsgY29tcG9uZW50IF07XG5cblx0XHRcdH1cblx0XHRcdENvbG9yLnJlY2FsY3VsYXRlUkdCKCB0aGlzLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4ICk7XG5cdFx0XHRyZXR1cm4gdGhpcy5fX3N0YXRlWyBjb21wb25lbnQgXTtcblxuXHRcdH0sXG5cdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEoIHYgKSB7XG5cblx0XHRcdGlmICggdGhpcy5fX3N0YXRlLnNwYWNlICE9PSAnUkdCJyApIHtcblxuXHRcdFx0XHRDb2xvci5yZWNhbGN1bGF0ZVJHQiggdGhpcywgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCApO1xuXHRcdFx0XHR0aGlzLl9fc3RhdGUuc3BhY2UgPSAnUkdCJztcblxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fX3N0YXRlWyBjb21wb25lbnQgXSA9IHY7XG5cblx0XHR9XG5cdH0gKTtcblxufVxuZnVuY3Rpb24gZGVmaW5lSFNWQ29tcG9uZW50KCB0YXJnZXQsIGNvbXBvbmVudCApIHtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIHRhcmdldCwgY29tcG9uZW50LCB7XG5cdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cblx0XHRcdGlmICggdGhpcy5fX3N0YXRlLnNwYWNlID09PSAnSFNWJyApIHtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fX3N0YXRlWyBjb21wb25lbnQgXTtcblxuXHRcdFx0fVxuXHRcdFx0Q29sb3IucmVjYWxjdWxhdGVIU1YoIHRoaXMgKTtcblx0XHRcdHJldHVybiB0aGlzLl9fc3RhdGVbIGNvbXBvbmVudCBdO1xuXG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIHNldCQkMSggdiApIHtcblxuXHRcdFx0aWYgKCB0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdIU1YnICkge1xuXG5cdFx0XHRcdENvbG9yLnJlY2FsY3VsYXRlSFNWKCB0aGlzICk7XG5cdFx0XHRcdHRoaXMuX19zdGF0ZS5zcGFjZSA9ICdIU1YnO1xuXG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9fc3RhdGVbIGNvbXBvbmVudCBdID0gdjtcblxuXHRcdH1cblx0fSApO1xuXG59XG5Db2xvci5yZWNhbGN1bGF0ZVJHQiA9IGZ1bmN0aW9uICggY29sb3IsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXggKSB7XG5cblx0aWYgKCBjb2xvci5fX3N0YXRlLnNwYWNlID09PSAnSEVYJyApIHtcblxuXHRcdGNvbG9yLl9fc3RhdGVbIGNvbXBvbmVudCBdID0gQ29sb3JNYXRoLmNvbXBvbmVudF9mcm9tX2hleCggY29sb3IuX19zdGF0ZS5oZXgsIGNvbXBvbmVudEhleEluZGV4ICk7XG5cblx0fSBlbHNlIGlmICggY29sb3IuX19zdGF0ZS5zcGFjZSA9PT0gJ0hTVicgKSB7XG5cblx0XHRDb21tb24uZXh0ZW5kKCBjb2xvci5fX3N0YXRlLCBDb2xvck1hdGguaHN2X3RvX3JnYiggY29sb3IuX19zdGF0ZS5oLCBjb2xvci5fX3N0YXRlLnMsIGNvbG9yLl9fc3RhdGUudiApICk7XG5cblx0fSBlbHNlIHtcblxuXHRcdHRocm93IG5ldyBFcnJvciggJ0NvcnJ1cHRlZCBjb2xvciBzdGF0ZScgKTtcblxuXHR9XG5cbn07XG5Db2xvci5yZWNhbGN1bGF0ZUhTViA9IGZ1bmN0aW9uICggY29sb3IgKSB7XG5cblx0dmFyIHJlc3VsdCA9IENvbG9yTWF0aC5yZ2JfdG9faHN2KCBjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iICk7XG5cdENvbW1vbi5leHRlbmQoIGNvbG9yLl9fc3RhdGUsIHtcblx0XHRzOiByZXN1bHQucyxcblx0XHR2OiByZXN1bHQudlxuXHR9ICk7XG5cdGlmICggISBDb21tb24uaXNOYU4oIHJlc3VsdC5oICkgKSB7XG5cblx0XHRjb2xvci5fX3N0YXRlLmggPSByZXN1bHQuaDtcblxuXHR9IGVsc2UgaWYgKCBDb21tb24uaXNVbmRlZmluZWQoIGNvbG9yLl9fc3RhdGUuaCApICkge1xuXG5cdFx0Y29sb3IuX19zdGF0ZS5oID0gMDtcblxuXHR9XG5cbn07XG5Db2xvci5DT01QT05FTlRTID0gWyAncicsICdnJywgJ2InLCAnaCcsICdzJywgJ3YnLCAnaGV4JywgJ2EnIF07XG5kZWZpbmVSR0JDb21wb25lbnQoIENvbG9yLnByb3RvdHlwZSwgJ3InLCAyICk7XG5kZWZpbmVSR0JDb21wb25lbnQoIENvbG9yLnByb3RvdHlwZSwgJ2cnLCAxICk7XG5kZWZpbmVSR0JDb21wb25lbnQoIENvbG9yLnByb3RvdHlwZSwgJ2InLCAwICk7XG5kZWZpbmVIU1ZDb21wb25lbnQoIENvbG9yLnByb3RvdHlwZSwgJ2gnICk7XG5kZWZpbmVIU1ZDb21wb25lbnQoIENvbG9yLnByb3RvdHlwZSwgJ3MnICk7XG5kZWZpbmVIU1ZDb21wb25lbnQoIENvbG9yLnByb3RvdHlwZSwgJ3YnICk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIENvbG9yLnByb3RvdHlwZSwgJ2EnLCB7XG5cdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXG5cdFx0cmV0dXJuIHRoaXMuX19zdGF0ZS5hO1xuXG5cdH0sXG5cdHNldDogZnVuY3Rpb24gc2V0JCQxKCB2ICkge1xuXG5cdFx0dGhpcy5fX3N0YXRlLmEgPSB2O1xuXG5cdH1cbn0gKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSggQ29sb3IucHJvdG90eXBlLCAnaGV4Jywge1xuXHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblxuXHRcdGlmICggdGhpcy5fX3N0YXRlLnNwYWNlICE9PSAnSEVYJyApIHtcblxuXHRcdFx0dGhpcy5fX3N0YXRlLmhleCA9IENvbG9yTWF0aC5yZ2JfdG9faGV4KCB0aGlzLnIsIHRoaXMuZywgdGhpcy5iICk7XG5cdFx0XHR0aGlzLl9fc3RhdGUuc3BhY2UgPSAnSEVYJztcblxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fX3N0YXRlLmhleDtcblxuXHR9LFxuXHRzZXQ6IGZ1bmN0aW9uIHNldCQkMSggdiApIHtcblxuXHRcdHRoaXMuX19zdGF0ZS5zcGFjZSA9ICdIRVgnO1xuXHRcdHRoaXMuX19zdGF0ZS5oZXggPSB2O1xuXG5cdH1cbn0gKTtcblxudmFyIENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG5cblx0ZnVuY3Rpb24gQ29udHJvbGxlciggb2JqZWN0LCBwcm9wZXJ0eSApIHtcblxuXHRcdGNsYXNzQ2FsbENoZWNrKCB0aGlzLCBDb250cm9sbGVyICk7XG5cdFx0dGhpcy5pbml0aWFsVmFsdWUgPSBvYmplY3RbIHByb3BlcnR5IF07XG5cdFx0dGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHR0aGlzLm9iamVjdCA9IG9iamVjdDtcblx0XHR0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG5cdFx0dGhpcy5fX29uQ2hhbmdlID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuX19vbkZpbmlzaENoYW5nZSA9IHVuZGVmaW5lZDtcblxuXHR9XG5cdGNyZWF0ZUNsYXNzKCBDb250cm9sbGVyLCBbIHtcblx0XHRrZXk6ICdvbkNoYW5nZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG9uQ2hhbmdlKCBmbmMgKSB7XG5cblx0XHRcdHRoaXMuX19vbkNoYW5nZSA9IGZuYztcblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnb25GaW5pc2hDaGFuZ2UnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBvbkZpbmlzaENoYW5nZSggZm5jICkge1xuXG5cdFx0XHR0aGlzLl9fb25GaW5pc2hDaGFuZ2UgPSBmbmM7XG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3NldFZhbHVlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUoIG5ld1ZhbHVlICkge1xuXG5cdFx0XHR0aGlzLm9iamVjdFsgdGhpcy5wcm9wZXJ0eSBdID0gbmV3VmFsdWU7XG5cdFx0XHRpZiAoIHRoaXMuX19vbkNoYW5nZSApIHtcblxuXHRcdFx0XHR0aGlzLl9fb25DaGFuZ2UuY2FsbCggdGhpcywgbmV3VmFsdWUgKTtcblxuXHRcdFx0fVxuXHRcdFx0dGhpcy51cGRhdGVEaXNwbGF5KCk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2dldFZhbHVlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLm9iamVjdFsgdGhpcy5wcm9wZXJ0eSBdO1xuXG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAndXBkYXRlRGlzcGxheScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnaXNNb2RpZmllZCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGlzTW9kaWZpZWQoKSB7XG5cblx0XHRcdHJldHVybiB0aGlzLmluaXRpYWxWYWx1ZSAhPT0gdGhpcy5nZXRWYWx1ZSgpO1xuXG5cdFx0fVxuXHR9IF0gKTtcblx0cmV0dXJuIENvbnRyb2xsZXI7XG5cbn0oKTtcblxudmFyIEVWRU5UX01BUCA9IHtcblx0SFRNTEV2ZW50czogWyAnY2hhbmdlJyBdLFxuXHRNb3VzZUV2ZW50czogWyAnY2xpY2snLCAnbW91c2Vtb3ZlJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ21vdXNlb3ZlcicgXSxcblx0S2V5Ym9hcmRFdmVudHM6IFsgJ2tleWRvd24nIF1cbn07XG52YXIgRVZFTlRfTUFQX0lOViA9IHt9O1xuQ29tbW9uLmVhY2goIEVWRU5UX01BUCwgZnVuY3Rpb24gKCB2LCBrICkge1xuXG5cdENvbW1vbi5lYWNoKCB2LCBmdW5jdGlvbiAoIGUgKSB7XG5cblx0XHRFVkVOVF9NQVBfSU5WWyBlIF0gPSBrO1xuXG5cdH0gKTtcblxufSApO1xudmFyIENTU19WQUxVRV9QSVhFTFMgPSAvKFxcZCsoXFwuXFxkKyk/KXB4LztcbmZ1bmN0aW9uIGNzc1ZhbHVlVG9QaXhlbHMoIHZhbCApIHtcblxuXHRpZiAoIHZhbCA9PT0gJzAnIHx8IENvbW1vbi5pc1VuZGVmaW5lZCggdmFsICkgKSB7XG5cblx0XHRyZXR1cm4gMDtcblxuXHR9XG5cdHZhciBtYXRjaCA9IHZhbC5tYXRjaCggQ1NTX1ZBTFVFX1BJWEVMUyApO1xuXHRpZiAoICEgQ29tbW9uLmlzTnVsbCggbWF0Y2ggKSApIHtcblxuXHRcdHJldHVybiBwYXJzZUZsb2F0KCBtYXRjaFsgMSBdICk7XG5cblx0fVxuXHRyZXR1cm4gMDtcblxufVxudmFyIGRvbSA9IHtcblx0bWFrZVNlbGVjdGFibGU6IGZ1bmN0aW9uIG1ha2VTZWxlY3RhYmxlKCBlbGVtLCBzZWxlY3RhYmxlICkge1xuXG5cdFx0aWYgKCBlbGVtID09PSB1bmRlZmluZWQgfHwgZWxlbS5zdHlsZSA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xuXHRcdGVsZW0ub25zZWxlY3RzdGFydCA9IHNlbGVjdGFibGUgPyBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdH0gOiBmdW5jdGlvbiAoKSB7fTtcblx0XHRlbGVtLnN0eWxlLk1velVzZXJTZWxlY3QgPSBzZWxlY3RhYmxlID8gJ2F1dG8nIDogJ25vbmUnO1xuXHRcdGVsZW0uc3R5bGUuS2h0bWxVc2VyU2VsZWN0ID0gc2VsZWN0YWJsZSA/ICdhdXRvJyA6ICdub25lJztcblx0XHRlbGVtLnVuc2VsZWN0YWJsZSA9IHNlbGVjdGFibGUgPyAnb24nIDogJ29mZic7XG5cblx0fSxcblx0bWFrZUZ1bGxzY3JlZW46IGZ1bmN0aW9uIG1ha2VGdWxsc2NyZWVuKCBlbGVtLCBob3IsIHZlcnQgKSB7XG5cblx0XHR2YXIgdmVydGljYWwgPSB2ZXJ0O1xuXHRcdHZhciBob3Jpem9udGFsID0gaG9yO1xuXHRcdGlmICggQ29tbW9uLmlzVW5kZWZpbmVkKCBob3Jpem9udGFsICkgKSB7XG5cblx0XHRcdGhvcml6b250YWwgPSB0cnVlO1xuXG5cdFx0fVxuXHRcdGlmICggQ29tbW9uLmlzVW5kZWZpbmVkKCB2ZXJ0aWNhbCApICkge1xuXG5cdFx0XHR2ZXJ0aWNhbCA9IHRydWU7XG5cblx0XHR9XG5cdFx0ZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0aWYgKCBob3Jpem9udGFsICkge1xuXG5cdFx0XHRlbGVtLnN0eWxlLmxlZnQgPSAwO1xuXHRcdFx0ZWxlbS5zdHlsZS5yaWdodCA9IDA7XG5cblx0XHR9XG5cdFx0aWYgKCB2ZXJ0aWNhbCApIHtcblxuXHRcdFx0ZWxlbS5zdHlsZS50b3AgPSAwO1xuXHRcdFx0ZWxlbS5zdHlsZS5ib3R0b20gPSAwO1xuXG5cdFx0fVxuXG5cdH0sXG5cdGZha2VFdmVudDogZnVuY3Rpb24gZmFrZUV2ZW50KCBlbGVtLCBldmVudFR5cGUsIHBhcnMsIGF1eCApIHtcblxuXHRcdHZhciBwYXJhbXMgPSBwYXJzIHx8IHt9O1xuXHRcdHZhciBjbGFzc05hbWUgPSBFVkVOVF9NQVBfSU5WWyBldmVudFR5cGUgXTtcblx0XHRpZiAoICEgY2xhc3NOYW1lICkge1xuXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoICdFdmVudCB0eXBlICcgKyBldmVudFR5cGUgKyAnIG5vdCBzdXBwb3J0ZWQuJyApO1xuXG5cdFx0fVxuXHRcdHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggY2xhc3NOYW1lICk7XG5cdFx0c3dpdGNoICggY2xhc3NOYW1lICkge1xuXG5cdFx0XHRjYXNlICdNb3VzZUV2ZW50cyc6XG5cdFx0XHR7XG5cblx0XHRcdFx0dmFyIGNsaWVudFggPSBwYXJhbXMueCB8fCBwYXJhbXMuY2xpZW50WCB8fCAwO1xuXHRcdFx0XHR2YXIgY2xpZW50WSA9IHBhcmFtcy55IHx8IHBhcmFtcy5jbGllbnRZIHx8IDA7XG5cdFx0XHRcdGV2dC5pbml0TW91c2VFdmVudCggZXZlbnRUeXBlLCBwYXJhbXMuYnViYmxlcyB8fCBmYWxzZSwgcGFyYW1zLmNhbmNlbGFibGUgfHwgdHJ1ZSwgd2luZG93LCBwYXJhbXMuY2xpY2tDb3VudCB8fCAxLCAwLFxuXHRcdFx0XHRcdDAsXG5cdFx0XHRcdFx0Y2xpZW50WCxcblx0XHRcdFx0XHRjbGllbnRZLFxuXHRcdFx0XHRcdGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsICk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cdFx0XHRjYXNlICdLZXlib2FyZEV2ZW50cyc6XG5cdFx0XHR7XG5cblx0XHRcdFx0dmFyIGluaXQgPSBldnQuaW5pdEtleWJvYXJkRXZlbnQgfHwgZXZ0LmluaXRLZXlFdmVudDtcblx0XHRcdFx0Q29tbW9uLmRlZmF1bHRzKCBwYXJhbXMsIHtcblx0XHRcdFx0XHRjYW5jZWxhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdGN0cmxLZXk6IGZhbHNlLFxuXHRcdFx0XHRcdGFsdEtleTogZmFsc2UsXG5cdFx0XHRcdFx0c2hpZnRLZXk6IGZhbHNlLFxuXHRcdFx0XHRcdG1ldGFLZXk6IGZhbHNlLFxuXHRcdFx0XHRcdGtleUNvZGU6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRjaGFyQ29kZTogdW5kZWZpbmVkXG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0aW5pdCggZXZlbnRUeXBlLCBwYXJhbXMuYnViYmxlcyB8fCBmYWxzZSwgcGFyYW1zLmNhbmNlbGFibGUsIHdpbmRvdywgcGFyYW1zLmN0cmxLZXksIHBhcmFtcy5hbHRLZXksIHBhcmFtcy5zaGlmdEtleSwgcGFyYW1zLm1ldGFLZXksIHBhcmFtcy5rZXlDb2RlLCBwYXJhbXMuY2hhckNvZGUgKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdH1cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHR7XG5cblx0XHRcdFx0ZXZ0LmluaXRFdmVudCggZXZlbnRUeXBlLCBwYXJhbXMuYnViYmxlcyB8fCBmYWxzZSwgcGFyYW1zLmNhbmNlbGFibGUgfHwgdHJ1ZSApO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdENvbW1vbi5kZWZhdWx0cyggZXZ0LCBhdXggKTtcblx0XHRlbGVtLmRpc3BhdGNoRXZlbnQoIGV2dCApO1xuXG5cdH0sXG5cdGJpbmQ6IGZ1bmN0aW9uIGJpbmQoIGVsZW0sIGV2ZW50LCBmdW5jLCBuZXdCb29sICkge1xuXG5cdFx0dmFyIGJvb2wgPSBuZXdCb29sIHx8IGZhbHNlO1xuXHRcdGlmICggZWxlbS5hZGRFdmVudExpc3RlbmVyICkge1xuXG5cdFx0XHRlbGVtLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50LCBmdW5jLCBib29sICk7XG5cblx0XHR9IGVsc2UgaWYgKCBlbGVtLmF0dGFjaEV2ZW50ICkge1xuXG5cdFx0XHRlbGVtLmF0dGFjaEV2ZW50KCAnb24nICsgZXZlbnQsIGZ1bmMgKTtcblxuXHRcdH1cblx0XHRyZXR1cm4gZG9tO1xuXG5cdH0sXG5cdHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKCBlbGVtLCBldmVudCwgZnVuYywgbmV3Qm9vbCApIHtcblxuXHRcdHZhciBib29sID0gbmV3Qm9vbCB8fCBmYWxzZTtcblx0XHRpZiAoIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lciApIHtcblxuXHRcdFx0ZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudCwgZnVuYywgYm9vbCApO1xuXG5cdFx0fSBlbHNlIGlmICggZWxlbS5kZXRhY2hFdmVudCApIHtcblxuXHRcdFx0ZWxlbS5kZXRhY2hFdmVudCggJ29uJyArIGV2ZW50LCBmdW5jICk7XG5cblx0XHR9XG5cdFx0cmV0dXJuIGRvbTtcblxuXHR9LFxuXHRhZGRDbGFzczogZnVuY3Rpb24gYWRkQ2xhc3MoIGVsZW0sIGNsYXNzTmFtZSApIHtcblxuXHRcdGlmICggZWxlbS5jbGFzc05hbWUgPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdFx0ZWxlbS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cblx0XHR9IGVsc2UgaWYgKCBlbGVtLmNsYXNzTmFtZSAhPT0gY2xhc3NOYW1lICkge1xuXG5cdFx0XHR2YXIgY2xhc3NlcyA9IGVsZW0uY2xhc3NOYW1lLnNwbGl0KCAvICsvICk7XG5cdFx0XHRpZiAoIGNsYXNzZXMuaW5kZXhPZiggY2xhc3NOYW1lICkgPT09IC0gMSApIHtcblxuXHRcdFx0XHRjbGFzc2VzLnB1c2goIGNsYXNzTmFtZSApO1xuXHRcdFx0XHRlbGVtLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbiggJyAnICkucmVwbGFjZSggL15cXHMrLywgJycgKS5yZXBsYWNlKCAvXFxzKyQvLCAnJyApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0cmV0dXJuIGRvbTtcblxuXHR9LFxuXHRyZW1vdmVDbGFzczogZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoIGVsZW0sIGNsYXNzTmFtZSApIHtcblxuXHRcdGlmICggY2xhc3NOYW1lICkge1xuXG5cdFx0XHRpZiAoIGVsZW0uY2xhc3NOYW1lID09PSBjbGFzc05hbWUgKSB7XG5cblx0XHRcdFx0ZWxlbS5yZW1vdmVBdHRyaWJ1dGUoICdjbGFzcycgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHR2YXIgY2xhc3NlcyA9IGVsZW0uY2xhc3NOYW1lLnNwbGl0KCAvICsvICk7XG5cdFx0XHRcdHZhciBpbmRleCA9IGNsYXNzZXMuaW5kZXhPZiggY2xhc3NOYW1lICk7XG5cdFx0XHRcdGlmICggaW5kZXggIT09IC0gMSApIHtcblxuXHRcdFx0XHRcdGNsYXNzZXMuc3BsaWNlKCBpbmRleCwgMSApO1xuXHRcdFx0XHRcdGVsZW0uY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCAnICcgKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGVsZW0uY2xhc3NOYW1lID0gdW5kZWZpbmVkO1xuXG5cdFx0fVxuXHRcdHJldHVybiBkb207XG5cblx0fSxcblx0aGFzQ2xhc3M6IGZ1bmN0aW9uIGhhc0NsYXNzKCBlbGVtLCBjbGFzc05hbWUgKSB7XG5cblx0XHRyZXR1cm4gbmV3IFJlZ0V4cCggJyg/Ol58XFxcXHMrKScgKyBjbGFzc05hbWUgKyAnKD86XFxcXHMrfCQpJyApLnRlc3QoIGVsZW0uY2xhc3NOYW1lICkgfHwgZmFsc2U7XG5cblx0fSxcblx0Z2V0V2lkdGg6IGZ1bmN0aW9uIGdldFdpZHRoKCBlbGVtICkge1xuXG5cdFx0dmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbSApO1xuXHRcdHJldHVybiBjc3NWYWx1ZVRvUGl4ZWxzKCBzdHlsZVsgJ2JvcmRlci1sZWZ0LXdpZHRoJyBdICkgKyBjc3NWYWx1ZVRvUGl4ZWxzKCBzdHlsZVsgJ2JvcmRlci1yaWdodC13aWR0aCcgXSApICsgY3NzVmFsdWVUb1BpeGVscyggc3R5bGVbICdwYWRkaW5nLWxlZnQnIF0gKSArIGNzc1ZhbHVlVG9QaXhlbHMoIHN0eWxlWyAncGFkZGluZy1yaWdodCcgXSApICsgY3NzVmFsdWVUb1BpeGVscyggc3R5bGUud2lkdGggKTtcblxuXHR9LFxuXHRnZXRIZWlnaHQ6IGZ1bmN0aW9uIGdldEhlaWdodCggZWxlbSApIHtcblxuXHRcdHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoIGVsZW0gKTtcblx0XHRyZXR1cm4gY3NzVmFsdWVUb1BpeGVscyggc3R5bGVbICdib3JkZXItdG9wLXdpZHRoJyBdICkgKyBjc3NWYWx1ZVRvUGl4ZWxzKCBzdHlsZVsgJ2JvcmRlci1ib3R0b20td2lkdGgnIF0gKSArIGNzc1ZhbHVlVG9QaXhlbHMoIHN0eWxlWyAncGFkZGluZy10b3AnIF0gKSArIGNzc1ZhbHVlVG9QaXhlbHMoIHN0eWxlWyAncGFkZGluZy1ib3R0b20nIF0gKSArIGNzc1ZhbHVlVG9QaXhlbHMoIHN0eWxlLmhlaWdodCApO1xuXG5cdH0sXG5cdGdldE9mZnNldDogZnVuY3Rpb24gZ2V0T2Zmc2V0KCBlbCApIHtcblxuXHRcdHZhciBlbGVtID0gZWw7XG5cdFx0dmFyIG9mZnNldCA9IHsgbGVmdDogMCwgdG9wOiAwIH07XG5cdFx0aWYgKCBlbGVtLm9mZnNldFBhcmVudCApIHtcblxuXHRcdFx0ZG8ge1xuXG5cdFx0XHRcdG9mZnNldC5sZWZ0ICs9IGVsZW0ub2Zmc2V0TGVmdDtcblx0XHRcdFx0b2Zmc2V0LnRvcCArPSBlbGVtLm9mZnNldFRvcDtcblx0XHRcdFx0ZWxlbSA9IGVsZW0ub2Zmc2V0UGFyZW50O1xuXG5cdFx0XHR9IHdoaWxlICggZWxlbSApO1xuXG5cdFx0fVxuXHRcdHJldHVybiBvZmZzZXQ7XG5cblx0fSxcblx0aXNBY3RpdmU6IGZ1bmN0aW9uIGlzQWN0aXZlKCBlbGVtICkge1xuXG5cdFx0cmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgKCBlbGVtLnR5cGUgfHwgZWxlbS5ocmVmICk7XG5cblx0fVxufTtcblxudmFyIEJvb2xlYW5Db250cm9sbGVyID0gZnVuY3Rpb24gKCBfQ29udHJvbGxlciApIHtcblxuXHRpbmhlcml0cyggQm9vbGVhbkNvbnRyb2xsZXIsIF9Db250cm9sbGVyICk7XG5cdGZ1bmN0aW9uIEJvb2xlYW5Db250cm9sbGVyKCBvYmplY3QsIHByb3BlcnR5ICkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIEJvb2xlYW5Db250cm9sbGVyICk7XG5cdFx0dmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oIHRoaXMsICggQm9vbGVhbkNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZiggQm9vbGVhbkNvbnRyb2xsZXIgKSApLmNhbGwoIHRoaXMsIG9iamVjdCwgcHJvcGVydHkgKSApO1xuXHRcdHZhciBfdGhpcyA9IF90aGlzMjtcblx0XHRfdGhpczIuX19wcmV2ID0gX3RoaXMyLmdldFZhbHVlKCk7XG5cdFx0X3RoaXMyLl9fY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICk7XG5cdFx0X3RoaXMyLl9fY2hlY2tib3guc2V0QXR0cmlidXRlKCAndHlwZScsICdjaGVja2JveCcgKTtcblx0XHRmdW5jdGlvbiBvbkNoYW5nZSgpIHtcblxuXHRcdFx0X3RoaXMuc2V0VmFsdWUoICEgX3RoaXMuX19wcmV2ICk7XG5cblx0XHR9XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2NoZWNrYm94LCAnY2hhbmdlJywgb25DaGFuZ2UsIGZhbHNlICk7XG5cdFx0X3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoIF90aGlzMi5fX2NoZWNrYm94ICk7XG5cdFx0X3RoaXMyLnVwZGF0ZURpc3BsYXkoKTtcblx0XHRyZXR1cm4gX3RoaXMyO1xuXG5cdH1cblx0Y3JlYXRlQ2xhc3MoIEJvb2xlYW5Db250cm9sbGVyLCBbIHtcblx0XHRrZXk6ICdzZXRWYWx1ZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKCB2ICkge1xuXG5cdFx0XHR2YXIgdG9SZXR1cm4gPSBnZXQoIEJvb2xlYW5Db250cm9sbGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKCBCb29sZWFuQ29udHJvbGxlci5wcm90b3R5cGUgKSwgJ3NldFZhbHVlJywgdGhpcyApLmNhbGwoIHRoaXMsIHYgKTtcblx0XHRcdGlmICggdGhpcy5fX29uRmluaXNoQ2hhbmdlICkge1xuXG5cdFx0XHRcdHRoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKCB0aGlzLCB0aGlzLmdldFZhbHVlKCkgKTtcblxuXHRcdFx0fVxuXHRcdFx0dGhpcy5fX3ByZXYgPSB0aGlzLmdldFZhbHVlKCk7XG5cdFx0XHRyZXR1cm4gdG9SZXR1cm47XG5cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICd1cGRhdGVEaXNwbGF5Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcblxuXHRcdFx0aWYgKCB0aGlzLmdldFZhbHVlKCkgPT09IHRydWUgKSB7XG5cblx0XHRcdFx0dGhpcy5fX2NoZWNrYm94LnNldEF0dHJpYnV0ZSggJ2NoZWNrZWQnLCAnY2hlY2tlZCcgKTtcblx0XHRcdFx0dGhpcy5fX2NoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9fcHJldiA9IHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0dGhpcy5fX2NoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5fX3ByZXYgPSBmYWxzZTtcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGdldCggQm9vbGVhbkNvbnRyb2xsZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIEJvb2xlYW5Db250cm9sbGVyLnByb3RvdHlwZSApLCAndXBkYXRlRGlzcGxheScsIHRoaXMgKS5jYWxsKCB0aGlzICk7XG5cblx0XHR9XG5cdH0gXSApO1xuXHRyZXR1cm4gQm9vbGVhbkNvbnRyb2xsZXI7XG5cbn0oIENvbnRyb2xsZXIgKTtcblxudmFyIE9wdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoIF9Db250cm9sbGVyICkge1xuXG5cdGluaGVyaXRzKCBPcHRpb25Db250cm9sbGVyLCBfQ29udHJvbGxlciApO1xuXHRmdW5jdGlvbiBPcHRpb25Db250cm9sbGVyKCBvYmplY3QsIHByb3BlcnR5LCBvcHRzICkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIE9wdGlvbkNvbnRyb2xsZXIgKTtcblx0XHR2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiggdGhpcywgKCBPcHRpb25Db250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIE9wdGlvbkNvbnRyb2xsZXIgKSApLmNhbGwoIHRoaXMsIG9iamVjdCwgcHJvcGVydHkgKSApO1xuXHRcdHZhciBvcHRpb25zID0gb3B0cztcblx0XHR2YXIgX3RoaXMgPSBfdGhpczI7XG5cdFx0X3RoaXMyLl9fc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3NlbGVjdCcgKTtcblx0XHRpZiAoIENvbW1vbi5pc0FycmF5KCBvcHRpb25zICkgKSB7XG5cblx0XHRcdHZhciBtYXAgPSB7fTtcblx0XHRcdENvbW1vbi5lYWNoKCBvcHRpb25zLCBmdW5jdGlvbiAoIGVsZW1lbnQgKSB7XG5cblx0XHRcdFx0bWFwWyBlbGVtZW50IF0gPSBlbGVtZW50O1xuXG5cdFx0XHR9ICk7XG5cdFx0XHRvcHRpb25zID0gbWFwO1xuXG5cdFx0fVxuXHRcdENvbW1vbi5lYWNoKCBvcHRpb25zLCBmdW5jdGlvbiAoIHZhbHVlLCBrZXkgKSB7XG5cblx0XHRcdHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnb3B0aW9uJyApO1xuXHRcdFx0b3B0LmlubmVySFRNTCA9IGtleTtcblx0XHRcdG9wdC5zZXRBdHRyaWJ1dGUoICd2YWx1ZScsIHZhbHVlICk7XG5cdFx0XHRfdGhpcy5fX3NlbGVjdC5hcHBlbmRDaGlsZCggb3B0ICk7XG5cblx0XHR9ICk7XG5cdFx0X3RoaXMyLnVwZGF0ZURpc3BsYXkoKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9fc2VsZWN0LCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHR2YXIgZGVzaXJlZFZhbHVlID0gdGhpcy5vcHRpb25zWyB0aGlzLnNlbGVjdGVkSW5kZXggXS52YWx1ZTtcblx0XHRcdF90aGlzLnNldFZhbHVlKCBkZXNpcmVkVmFsdWUgKTtcblxuXHRcdH0gKTtcblx0XHRfdGhpczIuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCggX3RoaXMyLl9fc2VsZWN0ICk7XG5cdFx0cmV0dXJuIF90aGlzMjtcblxuXHR9XG5cdGNyZWF0ZUNsYXNzKCBPcHRpb25Db250cm9sbGVyLCBbIHtcblx0XHRrZXk6ICdzZXRWYWx1ZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKCB2ICkge1xuXG5cdFx0XHR2YXIgdG9SZXR1cm4gPSBnZXQoIE9wdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIE9wdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlICksICdzZXRWYWx1ZScsIHRoaXMgKS5jYWxsKCB0aGlzLCB2ICk7XG5cdFx0XHRpZiAoIHRoaXMuX19vbkZpbmlzaENoYW5nZSApIHtcblxuXHRcdFx0XHR0aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbCggdGhpcywgdGhpcy5nZXRWYWx1ZSgpICk7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiB0b1JldHVybjtcblxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ3VwZGF0ZURpc3BsYXknLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuXG5cdFx0XHRpZiAoIGRvbS5pc0FjdGl2ZSggdGhpcy5fX3NlbGVjdCApICkgcmV0dXJuIHRoaXM7XG5cdFx0XHR0aGlzLl9fc2VsZWN0LnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuXHRcdFx0cmV0dXJuIGdldCggT3B0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZiggT3B0aW9uQ29udHJvbGxlci5wcm90b3R5cGUgKSwgJ3VwZGF0ZURpc3BsYXknLCB0aGlzICkuY2FsbCggdGhpcyApO1xuXG5cdFx0fVxuXHR9IF0gKTtcblx0cmV0dXJuIE9wdGlvbkNvbnRyb2xsZXI7XG5cbn0oIENvbnRyb2xsZXIgKTtcblxudmFyIFN0cmluZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoIF9Db250cm9sbGVyICkge1xuXG5cdGluaGVyaXRzKCBTdHJpbmdDb250cm9sbGVyLCBfQ29udHJvbGxlciApO1xuXHRmdW5jdGlvbiBTdHJpbmdDb250cm9sbGVyKCBvYmplY3QsIHByb3BlcnR5ICkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIFN0cmluZ0NvbnRyb2xsZXIgKTtcblx0XHR2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiggdGhpcywgKCBTdHJpbmdDb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIFN0cmluZ0NvbnRyb2xsZXIgKSApLmNhbGwoIHRoaXMsIG9iamVjdCwgcHJvcGVydHkgKSApO1xuXHRcdHZhciBfdGhpcyA9IF90aGlzMjtcblx0XHRmdW5jdGlvbiBvbkNoYW5nZSgpIHtcblxuXHRcdFx0X3RoaXMuc2V0VmFsdWUoIF90aGlzLl9faW5wdXQudmFsdWUgKTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvbkJsdXIoKSB7XG5cblx0XHRcdGlmICggX3RoaXMuX19vbkZpbmlzaENoYW5nZSApIHtcblxuXHRcdFx0XHRfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoIF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblx0XHRfdGhpczIuX19pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKTtcblx0XHRfdGhpczIuX19pbnB1dC5zZXRBdHRyaWJ1dGUoICd0eXBlJywgJ3RleHQnICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2lucHV0LCAna2V5dXAnLCBvbkNoYW5nZSApO1xuXHRcdGRvbS5iaW5kKCBfdGhpczIuX19pbnB1dCwgJ2NoYW5nZScsIG9uQ2hhbmdlICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2lucHV0LCAnYmx1cicsIG9uQmx1ciApO1xuXHRcdGRvbS5iaW5kKCBfdGhpczIuX19pbnB1dCwgJ2tleWRvd24nLCBmdW5jdGlvbiAoIGUgKSB7XG5cblx0XHRcdGlmICggZS5rZXlDb2RlID09PSAxMyApIHtcblxuXHRcdFx0XHR0aGlzLmJsdXIoKTtcblxuXHRcdFx0fVxuXG5cdFx0fSApO1xuXHRcdF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG5cdFx0X3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoIF90aGlzMi5fX2lucHV0ICk7XG5cdFx0cmV0dXJuIF90aGlzMjtcblxuXHR9XG5cdGNyZWF0ZUNsYXNzKCBTdHJpbmdDb250cm9sbGVyLCBbIHtcblx0XHRrZXk6ICd1cGRhdGVEaXNwbGF5Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcblxuXHRcdFx0aWYgKCAhIGRvbS5pc0FjdGl2ZSggdGhpcy5fX2lucHV0ICkgKSB7XG5cblx0XHRcdFx0dGhpcy5fX2lucHV0LnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZ2V0KCBTdHJpbmdDb250cm9sbGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKCBTdHJpbmdDb250cm9sbGVyLnByb3RvdHlwZSApLCAndXBkYXRlRGlzcGxheScsIHRoaXMgKS5jYWxsKCB0aGlzICk7XG5cblx0XHR9XG5cdH0gXSApO1xuXHRyZXR1cm4gU3RyaW5nQ29udHJvbGxlcjtcblxufSggQ29udHJvbGxlciApO1xuXG5mdW5jdGlvbiBudW1EZWNpbWFscyggeCApIHtcblxuXHR2YXIgX3ggPSB4LnRvU3RyaW5nKCk7XG5cdGlmICggX3guaW5kZXhPZiggJy4nICkgPiAtIDEgKSB7XG5cblx0XHRyZXR1cm4gX3gubGVuZ3RoIC0gX3guaW5kZXhPZiggJy4nICkgLSAxO1xuXG5cdH1cblx0cmV0dXJuIDA7XG5cbn1cbnZhciBOdW1iZXJDb250cm9sbGVyID0gZnVuY3Rpb24gKCBfQ29udHJvbGxlciApIHtcblxuXHRpbmhlcml0cyggTnVtYmVyQ29udHJvbGxlciwgX0NvbnRyb2xsZXIgKTtcblx0ZnVuY3Rpb24gTnVtYmVyQ29udHJvbGxlciggb2JqZWN0LCBwcm9wZXJ0eSwgcGFyYW1zICkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIE51bWJlckNvbnRyb2xsZXIgKTtcblx0XHR2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKCB0aGlzLCAoIE51bWJlckNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZiggTnVtYmVyQ29udHJvbGxlciApICkuY2FsbCggdGhpcywgb2JqZWN0LCBwcm9wZXJ0eSApICk7XG5cdFx0dmFyIF9wYXJhbXMgPSBwYXJhbXMgfHwge307XG5cdFx0X3RoaXMuX19taW4gPSBfcGFyYW1zLm1pbjtcblx0XHRfdGhpcy5fX21heCA9IF9wYXJhbXMubWF4O1xuXHRcdF90aGlzLl9fc3RlcCA9IF9wYXJhbXMuc3RlcDtcblx0XHRpZiAoIENvbW1vbi5pc1VuZGVmaW5lZCggX3RoaXMuX19zdGVwICkgKSB7XG5cblx0XHRcdGlmICggX3RoaXMuaW5pdGlhbFZhbHVlID09PSAwICkge1xuXG5cdFx0XHRcdF90aGlzLl9faW1wbGllZFN0ZXAgPSAxO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdF90aGlzLl9faW1wbGllZFN0ZXAgPSBNYXRoLnBvdyggMTAsIE1hdGguZmxvb3IoIE1hdGgubG9nKCBNYXRoLmFicyggX3RoaXMuaW5pdGlhbFZhbHVlICkgKSAvIE1hdGguTE4xMCApICkgLyAxMDtcblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0X3RoaXMuX19pbXBsaWVkU3RlcCA9IF90aGlzLl9fc3RlcDtcblxuXHRcdH1cblx0XHRfdGhpcy5fX3ByZWNpc2lvbiA9IG51bURlY2ltYWxzKCBfdGhpcy5fX2ltcGxpZWRTdGVwICk7XG5cdFx0cmV0dXJuIF90aGlzO1xuXG5cdH1cblx0Y3JlYXRlQ2xhc3MoIE51bWJlckNvbnRyb2xsZXIsIFsge1xuXHRcdGtleTogJ3NldFZhbHVlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUoIHYgKSB7XG5cblx0XHRcdHZhciBfdiA9IHY7XG5cdFx0XHRpZiAoIHRoaXMuX19taW4gIT09IHVuZGVmaW5lZCAmJiBfdiA8IHRoaXMuX19taW4gKSB7XG5cblx0XHRcdFx0X3YgPSB0aGlzLl9fbWluO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCB0aGlzLl9fbWF4ICE9PSB1bmRlZmluZWQgJiYgX3YgPiB0aGlzLl9fbWF4ICkge1xuXG5cdFx0XHRcdF92ID0gdGhpcy5fX21heDtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKCB0aGlzLl9fc3RlcCAhPT0gdW5kZWZpbmVkICYmIF92ICUgdGhpcy5fX3N0ZXAgIT09IDAgKSB7XG5cblx0XHRcdFx0X3YgPSBNYXRoLnJvdW5kKCBfdiAvIHRoaXMuX19zdGVwICkgKiB0aGlzLl9fc3RlcDtcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGdldCggTnVtYmVyQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZiggTnVtYmVyQ29udHJvbGxlci5wcm90b3R5cGUgKSwgJ3NldFZhbHVlJywgdGhpcyApLmNhbGwoIHRoaXMsIF92ICk7XG5cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6ICdtaW4nLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBtaW4oIG1pblZhbHVlICkge1xuXG5cdFx0XHR0aGlzLl9fbWluID0gbWluVmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ21heCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIG1heCggbWF4VmFsdWUgKSB7XG5cblx0XHRcdHRoaXMuX19tYXggPSBtYXhWYWx1ZTtcblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnc3RlcCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHN0ZXAoIHN0ZXBWYWx1ZSApIHtcblxuXHRcdFx0dGhpcy5fX3N0ZXAgPSBzdGVwVmFsdWU7XG5cdFx0XHR0aGlzLl9faW1wbGllZFN0ZXAgPSBzdGVwVmFsdWU7XG5cdFx0XHR0aGlzLl9fcHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0ZXBWYWx1ZSApO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cblx0XHR9XG5cdH0gXSApO1xuXHRyZXR1cm4gTnVtYmVyQ29udHJvbGxlcjtcblxufSggQ29udHJvbGxlciApO1xuXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCggdmFsdWUsIGRlY2ltYWxzICkge1xuXG5cdHZhciB0ZW5UbyA9IE1hdGgucG93KCAxMCwgZGVjaW1hbHMgKTtcblx0cmV0dXJuIE1hdGgucm91bmQoIHZhbHVlICogdGVuVG8gKSAvIHRlblRvO1xuXG59XG52YXIgTnVtYmVyQ29udHJvbGxlckJveCA9IGZ1bmN0aW9uICggX051bWJlckNvbnRyb2xsZXIgKSB7XG5cblx0aW5oZXJpdHMoIE51bWJlckNvbnRyb2xsZXJCb3gsIF9OdW1iZXJDb250cm9sbGVyICk7XG5cdGZ1bmN0aW9uIE51bWJlckNvbnRyb2xsZXJCb3goIG9iamVjdCwgcHJvcGVydHksIHBhcmFtcyApIHtcblxuXHRcdGNsYXNzQ2FsbENoZWNrKCB0aGlzLCBOdW1iZXJDb250cm9sbGVyQm94ICk7XG5cdFx0dmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oIHRoaXMsICggTnVtYmVyQ29udHJvbGxlckJveC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKCBOdW1iZXJDb250cm9sbGVyQm94ICkgKS5jYWxsKCB0aGlzLCBvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMgKSApO1xuXHRcdF90aGlzMi5fX3RydW5jYXRpb25TdXNwZW5kZWQgPSBmYWxzZTtcblx0XHR2YXIgX3RoaXMgPSBfdGhpczI7XG5cdFx0dmFyIHByZXZZID0gdm9pZCAwO1xuXHRcdGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuXG5cdFx0XHR2YXIgYXR0ZW1wdGVkID0gcGFyc2VGbG9hdCggX3RoaXMuX19pbnB1dC52YWx1ZSApO1xuXHRcdFx0aWYgKCAhIENvbW1vbi5pc05hTiggYXR0ZW1wdGVkICkgKSB7XG5cblx0XHRcdFx0X3RoaXMuc2V0VmFsdWUoIGF0dGVtcHRlZCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb25GaW5pc2goKSB7XG5cblx0XHRcdGlmICggX3RoaXMuX19vbkZpbmlzaENoYW5nZSApIHtcblxuXHRcdFx0XHRfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoIF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvbkJsdXIoKSB7XG5cblx0XHRcdG9uRmluaXNoKCk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb25Nb3VzZURyYWcoIGUgKSB7XG5cblx0XHRcdHZhciBkaWZmID0gcHJldlkgLSBlLmNsaWVudFk7XG5cdFx0XHRfdGhpcy5zZXRWYWx1ZSggX3RoaXMuZ2V0VmFsdWUoKSArIGRpZmYgKiBfdGhpcy5fX2ltcGxpZWRTdGVwICk7XG5cdFx0XHRwcmV2WSA9IGUuY2xpZW50WTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvbk1vdXNlVXAoKSB7XG5cblx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnICk7XG5cdFx0XHRkb20udW5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwICk7XG5cdFx0XHRvbkZpbmlzaCgpO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG9uTW91c2VEb3duKCBlICkge1xuXG5cdFx0XHRkb20uYmluZCggd2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcgKTtcblx0XHRcdGRvbS5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwICk7XG5cdFx0XHRwcmV2WSA9IGUuY2xpZW50WTtcblxuXHRcdH1cblx0XHRfdGhpczIuX19pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpbnB1dCcgKTtcblx0XHRfdGhpczIuX19pbnB1dC5zZXRBdHRyaWJ1dGUoICd0eXBlJywgJ3RleHQnICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2lucHV0LCAnY2hhbmdlJywgb25DaGFuZ2UgKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9faW5wdXQsICdibHVyJywgb25CbHVyICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2lucHV0LCAnbW91c2Vkb3duJywgb25Nb3VzZURvd24gKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9faW5wdXQsICdrZXlkb3duJywgZnVuY3Rpb24gKCBlICkge1xuXG5cdFx0XHRpZiAoIGUua2V5Q29kZSA9PT0gMTMgKSB7XG5cblx0XHRcdFx0X3RoaXMuX190cnVuY2F0aW9uU3VzcGVuZGVkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5ibHVyKCk7XG5cdFx0XHRcdF90aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA9IGZhbHNlO1xuXHRcdFx0XHRvbkZpbmlzaCgpO1xuXG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cdFx0X3RoaXMyLnVwZGF0ZURpc3BsYXkoKTtcblx0XHRfdGhpczIuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCggX3RoaXMyLl9faW5wdXQgKTtcblx0XHRyZXR1cm4gX3RoaXMyO1xuXG5cdH1cblx0Y3JlYXRlQ2xhc3MoIE51bWJlckNvbnRyb2xsZXJCb3gsIFsge1xuXHRcdGtleTogJ3VwZGF0ZURpc3BsYXknLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuXG5cdFx0XHR0aGlzLl9faW5wdXQudmFsdWUgPSB0aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA/IHRoaXMuZ2V0VmFsdWUoKSA6IHJvdW5kVG9EZWNpbWFsKCB0aGlzLmdldFZhbHVlKCksIHRoaXMuX19wcmVjaXNpb24gKTtcblx0XHRcdHJldHVybiBnZXQoIE51bWJlckNvbnRyb2xsZXJCb3gucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIE51bWJlckNvbnRyb2xsZXJCb3gucHJvdG90eXBlICksICd1cGRhdGVEaXNwbGF5JywgdGhpcyApLmNhbGwoIHRoaXMgKTtcblxuXHRcdH1cblx0fSBdICk7XG5cdHJldHVybiBOdW1iZXJDb250cm9sbGVyQm94O1xuXG59KCBOdW1iZXJDb250cm9sbGVyICk7XG5cbmZ1bmN0aW9uIG1hcCggdiwgaTEsIGkyLCBvMSwgbzIgKSB7XG5cblx0cmV0dXJuIG8xICsgKCBvMiAtIG8xICkgKiAoICggdiAtIGkxICkgLyAoIGkyIC0gaTEgKSApO1xuXG59XG52YXIgTnVtYmVyQ29udHJvbGxlclNsaWRlciA9IGZ1bmN0aW9uICggX051bWJlckNvbnRyb2xsZXIgKSB7XG5cblx0aW5oZXJpdHMoIE51bWJlckNvbnRyb2xsZXJTbGlkZXIsIF9OdW1iZXJDb250cm9sbGVyICk7XG5cdGZ1bmN0aW9uIE51bWJlckNvbnRyb2xsZXJTbGlkZXIoIG9iamVjdCwgcHJvcGVydHksIG1pbiwgbWF4LCBzdGVwICkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIE51bWJlckNvbnRyb2xsZXJTbGlkZXIgKTtcblx0XHR2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiggdGhpcywgKCBOdW1iZXJDb250cm9sbGVyU2xpZGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIE51bWJlckNvbnRyb2xsZXJTbGlkZXIgKSApLmNhbGwoIHRoaXMsIG9iamVjdCwgcHJvcGVydHksIHsgbWluOiBtaW4sIG1heDogbWF4LCBzdGVwOiBzdGVwIH0gKSApO1xuXHRcdHZhciBfdGhpcyA9IF90aGlzMjtcblx0XHRfdGhpczIuX19iYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRfdGhpczIuX19mb3JlZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9fYmFja2dyb3VuZCwgJ21vdXNlZG93bicsIG9uTW91c2VEb3duICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2JhY2tncm91bmQsICd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0ICk7XG5cdFx0ZG9tLmFkZENsYXNzKCBfdGhpczIuX19iYWNrZ3JvdW5kLCAnc2xpZGVyJyApO1xuXHRcdGRvbS5hZGRDbGFzcyggX3RoaXMyLl9fZm9yZWdyb3VuZCwgJ3NsaWRlci1mZycgKTtcblx0XHRmdW5jdGlvbiBvbk1vdXNlRG93biggZSApIHtcblxuXHRcdFx0ZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cdFx0XHRkb20uYmluZCggd2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcgKTtcblx0XHRcdGRvbS5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwICk7XG5cdFx0XHRvbk1vdXNlRHJhZyggZSApO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG9uTW91c2VEcmFnKCBlICkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR2YXIgYmdSZWN0ID0gX3RoaXMuX19iYWNrZ3JvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdFx0X3RoaXMuc2V0VmFsdWUoIG1hcCggZS5jbGllbnRYLCBiZ1JlY3QubGVmdCwgYmdSZWN0LnJpZ2h0LCBfdGhpcy5fX21pbiwgX3RoaXMuX19tYXggKSApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcblxuXHRcdFx0ZG9tLnVuYmluZCggd2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcgKTtcblx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXAgKTtcblx0XHRcdGlmICggX3RoaXMuX19vbkZpbmlzaENoYW5nZSApIHtcblxuXHRcdFx0XHRfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoIF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvblRvdWNoU3RhcnQoIGUgKSB7XG5cblx0XHRcdGlmICggZS50b3VjaGVzLmxlbmd0aCAhPT0gMSApIHtcblxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdH1cblx0XHRcdGRvbS5iaW5kKCB3aW5kb3csICd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSApO1xuXHRcdFx0ZG9tLmJpbmQoIHdpbmRvdywgJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCApO1xuXHRcdFx0b25Ub3VjaE1vdmUoIGUgKTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBvblRvdWNoTW92ZSggZSApIHtcblxuXHRcdFx0dmFyIGNsaWVudFggPSBlLnRvdWNoZXNbIDAgXS5jbGllbnRYO1xuXHRcdFx0dmFyIGJnUmVjdCA9IF90aGlzLl9fYmFja2dyb3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdF90aGlzLnNldFZhbHVlKCBtYXAoIGNsaWVudFgsIGJnUmVjdC5sZWZ0LCBiZ1JlY3QucmlnaHQsIF90aGlzLl9fbWluLCBfdGhpcy5fX21heCApICk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb25Ub3VjaEVuZCgpIHtcblxuXHRcdFx0ZG9tLnVuYmluZCggd2luZG93LCAndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUgKTtcblx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCApO1xuXHRcdFx0aWYgKCBfdGhpcy5fX29uRmluaXNoQ2hhbmdlICkge1xuXG5cdFx0XHRcdF90aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbCggX3RoaXMsIF90aGlzLmdldFZhbHVlKCkgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG5cdFx0X3RoaXMyLl9fYmFja2dyb3VuZC5hcHBlbmRDaGlsZCggX3RoaXMyLl9fZm9yZWdyb3VuZCApO1xuXHRcdF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKCBfdGhpczIuX19iYWNrZ3JvdW5kICk7XG5cdFx0cmV0dXJuIF90aGlzMjtcblxuXHR9XG5cdGNyZWF0ZUNsYXNzKCBOdW1iZXJDb250cm9sbGVyU2xpZGVyLCBbIHtcblx0XHRrZXk6ICd1cGRhdGVEaXNwbGF5Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcblxuXHRcdFx0dmFyIHBjdCA9ICggdGhpcy5nZXRWYWx1ZSgpIC0gdGhpcy5fX21pbiApIC8gKCB0aGlzLl9fbWF4IC0gdGhpcy5fX21pbiApO1xuXHRcdFx0dGhpcy5fX2ZvcmVncm91bmQuc3R5bGUud2lkdGggPSBwY3QgKiAxMDAgKyAnJSc7XG5cdFx0XHRyZXR1cm4gZ2V0KCBOdW1iZXJDb250cm9sbGVyU2xpZGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKCBOdW1iZXJDb250cm9sbGVyU2xpZGVyLnByb3RvdHlwZSApLCAndXBkYXRlRGlzcGxheScsIHRoaXMgKS5jYWxsKCB0aGlzICk7XG5cblx0XHR9XG5cdH0gXSApO1xuXHRyZXR1cm4gTnVtYmVyQ29udHJvbGxlclNsaWRlcjtcblxufSggTnVtYmVyQ29udHJvbGxlciApO1xuXG52YXIgRnVuY3Rpb25Db250cm9sbGVyID0gZnVuY3Rpb24gKCBfQ29udHJvbGxlciApIHtcblxuXHRpbmhlcml0cyggRnVuY3Rpb25Db250cm9sbGVyLCBfQ29udHJvbGxlciApO1xuXHRmdW5jdGlvbiBGdW5jdGlvbkNvbnRyb2xsZXIoIG9iamVjdCwgcHJvcGVydHksIHRleHQgKSB7XG5cblx0XHRjbGFzc0NhbGxDaGVjayggdGhpcywgRnVuY3Rpb25Db250cm9sbGVyICk7XG5cdFx0dmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oIHRoaXMsICggRnVuY3Rpb25Db250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoIEZ1bmN0aW9uQ29udHJvbGxlciApICkuY2FsbCggdGhpcywgb2JqZWN0LCBwcm9wZXJ0eSApICk7XG5cdFx0dmFyIF90aGlzID0gX3RoaXMyO1xuXHRcdF90aGlzMi5fX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0X3RoaXMyLl9fYnV0dG9uLmlubmVySFRNTCA9IHRleHQgPT09IHVuZGVmaW5lZCA/ICdGaXJlJyA6IHRleHQ7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2J1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKCBlICkge1xuXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRfdGhpcy5maXJlKCk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR9ICk7XG5cdFx0ZG9tLmFkZENsYXNzKCBfdGhpczIuX19idXR0b24sICdidXR0b24nICk7XG5cdFx0X3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoIF90aGlzMi5fX2J1dHRvbiApO1xuXHRcdHJldHVybiBfdGhpczI7XG5cblx0fVxuXHRjcmVhdGVDbGFzcyggRnVuY3Rpb25Db250cm9sbGVyLCBbIHtcblx0XHRrZXk6ICdmaXJlJyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gZmlyZSgpIHtcblxuXHRcdFx0aWYgKCB0aGlzLl9fb25DaGFuZ2UgKSB7XG5cblx0XHRcdFx0dGhpcy5fX29uQ2hhbmdlLmNhbGwoIHRoaXMgKTtcblxuXHRcdFx0fVxuXHRcdFx0dGhpcy5nZXRWYWx1ZSgpLmNhbGwoIHRoaXMub2JqZWN0ICk7XG5cdFx0XHRpZiAoIHRoaXMuX19vbkZpbmlzaENoYW5nZSApIHtcblxuXHRcdFx0XHR0aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbCggdGhpcywgdGhpcy5nZXRWYWx1ZSgpICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblx0fSBdICk7XG5cdHJldHVybiBGdW5jdGlvbkNvbnRyb2xsZXI7XG5cbn0oIENvbnRyb2xsZXIgKTtcblxudmFyIENvbG9yQ29udHJvbGxlciA9IGZ1bmN0aW9uICggX0NvbnRyb2xsZXIgKSB7XG5cblx0aW5oZXJpdHMoIENvbG9yQ29udHJvbGxlciwgX0NvbnRyb2xsZXIgKTtcblx0ZnVuY3Rpb24gQ29sb3JDb250cm9sbGVyKCBvYmplY3QsIHByb3BlcnR5ICkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIENvbG9yQ29udHJvbGxlciApO1xuXHRcdHZhciBfdGhpczIgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKCB0aGlzLCAoIENvbG9yQ29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKCBDb2xvckNvbnRyb2xsZXIgKSApLmNhbGwoIHRoaXMsIG9iamVjdCwgcHJvcGVydHkgKSApO1xuXHRcdF90aGlzMi5fX2NvbG9yID0gbmV3IENvbG9yKCBfdGhpczIuZ2V0VmFsdWUoKSApO1xuXHRcdF90aGlzMi5fX3RlbXAgPSBuZXcgQ29sb3IoIDAgKTtcblx0XHR2YXIgX3RoaXMgPSBfdGhpczI7XG5cdFx0X3RoaXMyLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRvbS5tYWtlU2VsZWN0YWJsZSggX3RoaXMyLmRvbUVsZW1lbnQsIGZhbHNlICk7XG5cdFx0X3RoaXMyLl9fc2VsZWN0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdF90aGlzMi5fX3NlbGVjdG9yLmNsYXNzTmFtZSA9ICdzZWxlY3Rvcic7XG5cdFx0X3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0X3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZC5jbGFzc05hbWUgPSAnc2F0dXJhdGlvbi1maWVsZCc7XG5cdFx0X3RoaXMyLl9fZmllbGRfa25vYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0X3RoaXMyLl9fZmllbGRfa25vYi5jbGFzc05hbWUgPSAnZmllbGQta25vYic7XG5cdFx0X3RoaXMyLl9fZmllbGRfa25vYl9ib3JkZXIgPSAnMnB4IHNvbGlkICc7XG5cdFx0X3RoaXMyLl9faHVlX2tub2IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdF90aGlzMi5fX2h1ZV9rbm9iLmNsYXNzTmFtZSA9ICdodWUta25vYic7XG5cdFx0X3RoaXMyLl9faHVlX2ZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRfdGhpczIuX19odWVfZmllbGQuY2xhc3NOYW1lID0gJ2h1ZS1maWVsZCc7XG5cdFx0X3RoaXMyLl9faW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICk7XG5cdFx0X3RoaXMyLl9faW5wdXQudHlwZSA9ICd0ZXh0Jztcblx0XHRfdGhpczIuX19pbnB1dF90ZXh0U2hhZG93ID0gJzAgMXB4IDFweCAnO1xuXHRcdGRvbS5iaW5kKCBfdGhpczIuX19pbnB1dCwgJ2tleWRvd24nLCBmdW5jdGlvbiAoIGUgKSB7XG5cblx0XHRcdGlmICggZS5rZXlDb2RlID09PSAxMyApIHtcblxuXHRcdFx0XHRvbkJsdXIuY2FsbCggdGhpcyApO1xuXG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2lucHV0LCAnYmx1cicsIG9uQmx1ciApO1xuXHRcdGRvbS5iaW5kKCBfdGhpczIuX19zZWxlY3RvciwgJ21vdXNlZG93bicsIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0ZG9tLmFkZENsYXNzKCB0aGlzLCAnZHJhZycgKS5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyggX3RoaXMuX19zZWxlY3RvciwgJ2RyYWcnICk7XG5cblx0XHRcdH0gKTtcblxuXHRcdH0gKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9fc2VsZWN0b3IsICd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRkb20uYWRkQ2xhc3MoIHRoaXMsICdkcmFnJyApLmJpbmQoIHdpbmRvdywgJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyggX3RoaXMuX19zZWxlY3RvciwgJ2RyYWcnICk7XG5cblx0XHRcdH0gKTtcblxuXHRcdH0gKTtcblx0XHR2YXIgdmFsdWVGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0Q29tbW9uLmV4dGVuZCggX3RoaXMyLl9fc2VsZWN0b3Iuc3R5bGUsIHtcblx0XHRcdHdpZHRoOiAnMTIycHgnLFxuXHRcdFx0aGVpZ2h0OiAnMTAycHgnLFxuXHRcdFx0cGFkZGluZzogJzNweCcsXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjMjIyJyxcblx0XHRcdGJveFNoYWRvdzogJzBweCAxcHggM3B4IHJnYmEoMCwwLDAsMC4zKSdcblx0XHR9ICk7XG5cdFx0Q29tbW9uLmV4dGVuZCggX3RoaXMyLl9fZmllbGRfa25vYi5zdHlsZSwge1xuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHR3aWR0aDogJzEycHgnLFxuXHRcdFx0aGVpZ2h0OiAnMTJweCcsXG5cdFx0XHRib3JkZXI6IF90aGlzMi5fX2ZpZWxkX2tub2JfYm9yZGVyICsgKCBfdGhpczIuX19jb2xvci52IDwgMC41ID8gJyNmZmYnIDogJyMwMDAnICksXG5cdFx0XHRib3hTaGFkb3c6ICcwcHggMXB4IDNweCByZ2JhKDAsMCwwLDAuNSknLFxuXHRcdFx0Ym9yZGVyUmFkaXVzOiAnMTJweCcsXG5cdFx0XHR6SW5kZXg6IDFcblx0XHR9ICk7XG5cdFx0Q29tbW9uLmV4dGVuZCggX3RoaXMyLl9faHVlX2tub2Iuc3R5bGUsIHtcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0d2lkdGg6ICcxNXB4Jyxcblx0XHRcdGhlaWdodDogJzJweCcsXG5cdFx0XHRib3JkZXJSaWdodDogJzRweCBzb2xpZCAjZmZmJyxcblx0XHRcdHpJbmRleDogMVxuXHRcdH0gKTtcblx0XHRDb21tb24uZXh0ZW5kKCBfdGhpczIuX19zYXR1cmF0aW9uX2ZpZWxkLnN0eWxlLCB7XG5cdFx0XHR3aWR0aDogJzEwMHB4Jyxcblx0XHRcdGhlaWdodDogJzEwMHB4Jyxcblx0XHRcdGJvcmRlcjogJzFweCBzb2xpZCAjNTU1Jyxcblx0XHRcdG1hcmdpblJpZ2h0OiAnM3B4Jyxcblx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0Y3Vyc29yOiAncG9pbnRlcidcblx0XHR9ICk7XG5cdFx0Q29tbW9uLmV4dGVuZCggdmFsdWVGaWVsZC5zdHlsZSwge1xuXHRcdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdFx0YmFja2dyb3VuZDogJ25vbmUnXG5cdFx0fSApO1xuXHRcdGxpbmVhckdyYWRpZW50KCB2YWx1ZUZpZWxkLCAndG9wJywgJ3JnYmEoMCwwLDAsMCknLCAnIzAwMCcgKTtcblx0XHRDb21tb24uZXh0ZW5kKCBfdGhpczIuX19odWVfZmllbGQuc3R5bGUsIHtcblx0XHRcdHdpZHRoOiAnMTVweCcsXG5cdFx0XHRoZWlnaHQ6ICcxMDBweCcsXG5cdFx0XHRib3JkZXI6ICcxcHggc29saWQgIzU1NScsXG5cdFx0XHRjdXJzb3I6ICducy1yZXNpemUnLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHR0b3A6ICczcHgnLFxuXHRcdFx0cmlnaHQ6ICczcHgnXG5cdFx0fSApO1xuXHRcdGh1ZUdyYWRpZW50KCBfdGhpczIuX19odWVfZmllbGQgKTtcblx0XHRDb21tb24uZXh0ZW5kKCBfdGhpczIuX19pbnB1dC5zdHlsZSwge1xuXHRcdFx0b3V0bGluZTogJ25vbmUnLFxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJyxcblx0XHRcdGNvbG9yOiAnI2ZmZicsXG5cdFx0XHRib3JkZXI6IDAsXG5cdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXG5cdFx0XHR0ZXh0U2hhZG93OiBfdGhpczIuX19pbnB1dF90ZXh0U2hhZG93ICsgJ3JnYmEoMCwwLDAsMC43KSdcblx0XHR9ICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX3NhdHVyYXRpb25fZmllbGQsICdtb3VzZWRvd24nLCBmaWVsZERvd24gKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZCwgJ3RvdWNoc3RhcnQnLCBmaWVsZERvd24gKTtcblx0XHRkb20uYmluZCggX3RoaXMyLl9fZmllbGRfa25vYiwgJ21vdXNlZG93bicsIGZpZWxkRG93biApO1xuXHRcdGRvbS5iaW5kKCBfdGhpczIuX19maWVsZF9rbm9iLCAndG91Y2hzdGFydCcsIGZpZWxkRG93biApO1xuXHRcdGRvbS5iaW5kKCBfdGhpczIuX19odWVfZmllbGQsICdtb3VzZWRvd24nLCBmaWVsZERvd25IICk7XG5cdFx0ZG9tLmJpbmQoIF90aGlzMi5fX2h1ZV9maWVsZCwgJ3RvdWNoc3RhcnQnLCBmaWVsZERvd25IICk7XG5cdFx0ZnVuY3Rpb24gZmllbGREb3duKCBlICkge1xuXG5cdFx0XHRzZXRTViggZSApO1xuXHRcdFx0ZG9tLmJpbmQoIHdpbmRvdywgJ21vdXNlbW92ZScsIHNldFNWICk7XG5cdFx0XHRkb20uYmluZCggd2luZG93LCAndG91Y2htb3ZlJywgc2V0U1YgKTtcblx0XHRcdGRvbS5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgZmllbGRVcFNWICk7XG5cdFx0XHRkb20uYmluZCggd2luZG93LCAndG91Y2hlbmQnLCBmaWVsZFVwU1YgKTtcblxuXHRcdH1cblx0XHRmdW5jdGlvbiBmaWVsZERvd25IKCBlICkge1xuXG5cdFx0XHRzZXRIKCBlICk7XG5cdFx0XHRkb20uYmluZCggd2luZG93LCAnbW91c2Vtb3ZlJywgc2V0SCApO1xuXHRcdFx0ZG9tLmJpbmQoIHdpbmRvdywgJ3RvdWNobW92ZScsIHNldEggKTtcblx0XHRcdGRvbS5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgZmllbGRVcEggKTtcblx0XHRcdGRvbS5iaW5kKCB3aW5kb3csICd0b3VjaGVuZCcsIGZpZWxkVXBIICk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gZmllbGRVcFNWKCkge1xuXG5cdFx0XHRkb20udW5iaW5kKCB3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRTViApO1xuXHRcdFx0ZG9tLnVuYmluZCggd2luZG93LCAndG91Y2htb3ZlJywgc2V0U1YgKTtcblx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ21vdXNldXAnLCBmaWVsZFVwU1YgKTtcblx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ3RvdWNoZW5kJywgZmllbGRVcFNWICk7XG5cdFx0XHRvbkZpbmlzaCgpO1xuXG5cdFx0fVxuXHRcdGZ1bmN0aW9uIGZpZWxkVXBIKCkge1xuXG5cdFx0XHRkb20udW5iaW5kKCB3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRIICk7XG5cdFx0XHRkb20udW5iaW5kKCB3aW5kb3csICd0b3VjaG1vdmUnLCBzZXRIICk7XG5cdFx0XHRkb20udW5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgZmllbGRVcEggKTtcblx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ3RvdWNoZW5kJywgZmllbGRVcEggKTtcblx0XHRcdG9uRmluaXNoKCk7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb25CbHVyKCkge1xuXG5cdFx0XHR2YXIgaSA9IGludGVycHJldCggdGhpcy52YWx1ZSApO1xuXHRcdFx0aWYgKCBpICE9PSBmYWxzZSApIHtcblxuXHRcdFx0XHRfdGhpcy5fX2NvbG9yLl9fc3RhdGUgPSBpO1xuXHRcdFx0XHRfdGhpcy5zZXRWYWx1ZSggX3RoaXMuX19jb2xvci50b09yaWdpbmFsKCkgKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHR0aGlzLnZhbHVlID0gX3RoaXMuX19jb2xvci50b1N0cmluZygpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gb25GaW5pc2goKSB7XG5cblx0XHRcdGlmICggX3RoaXMuX19vbkZpbmlzaENoYW5nZSApIHtcblxuXHRcdFx0XHRfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoIF90aGlzLCBfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0X3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZC5hcHBlbmRDaGlsZCggdmFsdWVGaWVsZCApO1xuXHRcdF90aGlzMi5fX3NlbGVjdG9yLmFwcGVuZENoaWxkKCBfdGhpczIuX19maWVsZF9rbm9iICk7XG5cdFx0X3RoaXMyLl9fc2VsZWN0b3IuYXBwZW5kQ2hpbGQoIF90aGlzMi5fX3NhdHVyYXRpb25fZmllbGQgKTtcblx0XHRfdGhpczIuX19zZWxlY3Rvci5hcHBlbmRDaGlsZCggX3RoaXMyLl9faHVlX2ZpZWxkICk7XG5cdFx0X3RoaXMyLl9faHVlX2ZpZWxkLmFwcGVuZENoaWxkKCBfdGhpczIuX19odWVfa25vYiApO1xuXHRcdF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKCBfdGhpczIuX19pbnB1dCApO1xuXHRcdF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKCBfdGhpczIuX19zZWxlY3RvciApO1xuXHRcdF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG5cdFx0ZnVuY3Rpb24gc2V0U1YoIGUgKSB7XG5cblx0XHRcdGlmICggZS50eXBlLmluZGV4T2YoICd0b3VjaCcgKSA9PT0gLSAxICkge1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0fVxuXHRcdFx0dmFyIGZpZWxkUmVjdCA9IF90aGlzLl9fc2F0dXJhdGlvbl9maWVsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdHZhciBfcmVmID0gZS50b3VjaGVzICYmIGUudG91Y2hlc1sgMCBdIHx8IGUsXG5cdFx0XHRcdGNsaWVudFggPSBfcmVmLmNsaWVudFgsXG5cdFx0XHRcdGNsaWVudFkgPSBfcmVmLmNsaWVudFk7XG5cdFx0XHR2YXIgcyA9ICggY2xpZW50WCAtIGZpZWxkUmVjdC5sZWZ0ICkgLyAoIGZpZWxkUmVjdC5yaWdodCAtIGZpZWxkUmVjdC5sZWZ0ICk7XG5cdFx0XHR2YXIgdiA9IDEgLSAoIGNsaWVudFkgLSBmaWVsZFJlY3QudG9wICkgLyAoIGZpZWxkUmVjdC5ib3R0b20gLSBmaWVsZFJlY3QudG9wICk7XG5cdFx0XHRpZiAoIHYgPiAxICkge1xuXG5cdFx0XHRcdHYgPSAxO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCB2IDwgMCApIHtcblxuXHRcdFx0XHR2ID0gMDtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKCBzID4gMSApIHtcblxuXHRcdFx0XHRzID0gMTtcblxuXHRcdFx0fSBlbHNlIGlmICggcyA8IDAgKSB7XG5cblx0XHRcdFx0cyA9IDA7XG5cblx0XHRcdH1cblx0XHRcdF90aGlzLl9fY29sb3IudiA9IHY7XG5cdFx0XHRfdGhpcy5fX2NvbG9yLnMgPSBzO1xuXHRcdFx0X3RoaXMuc2V0VmFsdWUoIF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHR9XG5cdFx0ZnVuY3Rpb24gc2V0SCggZSApIHtcblxuXHRcdFx0aWYgKCBlLnR5cGUuaW5kZXhPZiggJ3RvdWNoJyApID09PSAtIDEgKSB7XG5cblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR9XG5cdFx0XHR2YXIgZmllbGRSZWN0ID0gX3RoaXMuX19odWVfZmllbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0XHR2YXIgX3JlZjIgPSBlLnRvdWNoZXMgJiYgZS50b3VjaGVzWyAwIF0gfHwgZSxcblx0XHRcdFx0Y2xpZW50WSA9IF9yZWYyLmNsaWVudFk7XG5cdFx0XHR2YXIgaCA9IDEgLSAoIGNsaWVudFkgLSBmaWVsZFJlY3QudG9wICkgLyAoIGZpZWxkUmVjdC5ib3R0b20gLSBmaWVsZFJlY3QudG9wICk7XG5cdFx0XHRpZiAoIGggPiAxICkge1xuXG5cdFx0XHRcdGggPSAxO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCBoIDwgMCApIHtcblxuXHRcdFx0XHRoID0gMDtcblxuXHRcdFx0fVxuXHRcdFx0X3RoaXMuX19jb2xvci5oID0gaCAqIDM2MDtcblx0XHRcdF90aGlzLnNldFZhbHVlKCBfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSApO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0fVxuXHRcdHJldHVybiBfdGhpczI7XG5cblx0fVxuXHRjcmVhdGVDbGFzcyggQ29sb3JDb250cm9sbGVyLCBbIHtcblx0XHRrZXk6ICd1cGRhdGVEaXNwbGF5Jyxcblx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcblxuXHRcdFx0dmFyIGkgPSBpbnRlcnByZXQoIHRoaXMuZ2V0VmFsdWUoKSApO1xuXHRcdFx0aWYgKCBpICE9PSBmYWxzZSApIHtcblxuXHRcdFx0XHR2YXIgbWlzbWF0Y2ggPSBmYWxzZTtcblx0XHRcdFx0Q29tbW9uLmVhY2goIENvbG9yLkNPTVBPTkVOVFMsIGZ1bmN0aW9uICggY29tcG9uZW50ICkge1xuXG5cdFx0XHRcdFx0aWYgKCAhIENvbW1vbi5pc1VuZGVmaW5lZCggaVsgY29tcG9uZW50IF0gKSAmJiAhIENvbW1vbi5pc1VuZGVmaW5lZCggdGhpcy5fX2NvbG9yLl9fc3RhdGVbIGNvbXBvbmVudCBdICkgJiYgaVsgY29tcG9uZW50IF0gIT09IHRoaXMuX19jb2xvci5fX3N0YXRlWyBjb21wb25lbnQgXSApIHtcblxuXHRcdFx0XHRcdFx0bWlzbWF0Y2ggPSB0cnVlO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHt9O1xuXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sIHRoaXMgKTtcblx0XHRcdFx0aWYgKCBtaXNtYXRjaCApIHtcblxuXHRcdFx0XHRcdENvbW1vbi5leHRlbmQoIHRoaXMuX19jb2xvci5fX3N0YXRlLCBpICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRDb21tb24uZXh0ZW5kKCB0aGlzLl9fdGVtcC5fX3N0YXRlLCB0aGlzLl9fY29sb3IuX19zdGF0ZSApO1xuXHRcdFx0dGhpcy5fX3RlbXAuYSA9IDE7XG5cdFx0XHR2YXIgZmxpcCA9IHRoaXMuX19jb2xvci52IDwgMC41IHx8IHRoaXMuX19jb2xvci5zID4gMC41ID8gMjU1IDogMDtcblx0XHRcdHZhciBfZmxpcCA9IDI1NSAtIGZsaXA7XG5cdFx0XHRDb21tb24uZXh0ZW5kKCB0aGlzLl9fZmllbGRfa25vYi5zdHlsZSwge1xuXHRcdFx0XHRtYXJnaW5MZWZ0OiAxMDAgKiB0aGlzLl9fY29sb3IucyAtIDcgKyAncHgnLFxuXHRcdFx0XHRtYXJnaW5Ub3A6IDEwMCAqICggMSAtIHRoaXMuX19jb2xvci52ICkgLSA3ICsgJ3B4Jyxcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiB0aGlzLl9fdGVtcC50b0hleFN0cmluZygpLFxuXHRcdFx0XHRib3JkZXI6IHRoaXMuX19maWVsZF9rbm9iX2JvcmRlciArICdyZ2IoJyArIGZsaXAgKyAnLCcgKyBmbGlwICsgJywnICsgZmxpcCArICcpJ1xuXHRcdFx0fSApO1xuXHRcdFx0dGhpcy5fX2h1ZV9rbm9iLnN0eWxlLm1hcmdpblRvcCA9ICggMSAtIHRoaXMuX19jb2xvci5oIC8gMzYwICkgKiAxMDAgKyAncHgnO1xuXHRcdFx0dGhpcy5fX3RlbXAucyA9IDE7XG5cdFx0XHR0aGlzLl9fdGVtcC52ID0gMTtcblx0XHRcdGxpbmVhckdyYWRpZW50KCB0aGlzLl9fc2F0dXJhdGlvbl9maWVsZCwgJ2xlZnQnLCAnI2ZmZicsIHRoaXMuX190ZW1wLnRvSGV4U3RyaW5nKCkgKTtcblx0XHRcdHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuX19jb2xvci50b1N0cmluZygpO1xuXHRcdFx0Q29tbW9uLmV4dGVuZCggdGhpcy5fX2lucHV0LnN0eWxlLCB7XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogdGhpcy5fX2NvbG9yLnRvSGV4U3RyaW5nKCksXG5cdFx0XHRcdGNvbG9yOiAncmdiKCcgKyBmbGlwICsgJywnICsgZmxpcCArICcsJyArIGZsaXAgKyAnKScsXG5cdFx0XHRcdHRleHRTaGFkb3c6IHRoaXMuX19pbnB1dF90ZXh0U2hhZG93ICsgJ3JnYmEoJyArIF9mbGlwICsgJywnICsgX2ZsaXAgKyAnLCcgKyBfZmxpcCArICcsLjcpJ1xuXHRcdFx0fSApO1xuXG5cdFx0fVxuXHR9IF0gKTtcblx0cmV0dXJuIENvbG9yQ29udHJvbGxlcjtcblxufSggQ29udHJvbGxlciApO1xudmFyIHZlbmRvcnMgPSBbICctbW96LScsICctby0nLCAnLXdlYmtpdC0nLCAnLW1zLScsICcnIF07XG5mdW5jdGlvbiBsaW5lYXJHcmFkaWVudCggZWxlbSwgeCwgYSwgYiApIHtcblxuXHRlbGVtLnN0eWxlLmJhY2tncm91bmQgPSAnJztcblx0Q29tbW9uLmVhY2goIHZlbmRvcnMsIGZ1bmN0aW9uICggdmVuZG9yICkge1xuXG5cdFx0ZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAnICsgdmVuZG9yICsgJ2xpbmVhci1ncmFkaWVudCgnICsgeCArICcsICcgKyBhICsgJyAwJSwgJyArIGIgKyAnIDEwMCUpOyAnO1xuXG5cdH0gKTtcblxufVxuZnVuY3Rpb24gaHVlR3JhZGllbnQoIGVsZW0gKSB7XG5cblx0ZWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG5cdGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwgI2ZmMDBmZiAxNyUsICMwMDAwZmYgMzQlLCAjMDBmZmZmIDUwJSwgIzAwZmYwMCA2NyUsICNmZmZmMDAgODQlLCAjZmYwMDAwIDEwMCUpOyc7XG5cdGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOyc7XG5cdGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnO1xuXHRlbGVtLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6IC1tcy1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOyc7XG5cdGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnO1xuXG59XG5cbnZhciBjc3MgPSB7XG5cdGxvYWQ6IGZ1bmN0aW9uIGxvYWQoIHVybCwgaW5kb2MgKSB7XG5cblx0XHR2YXIgZG9jID0gaW5kb2MgfHwgZG9jdW1lbnQ7XG5cdFx0dmFyIGxpbmsgPSBkb2MuY3JlYXRlRWxlbWVudCggJ2xpbmsnICk7XG5cdFx0bGluay50eXBlID0gJ3RleHQvY3NzJztcblx0XHRsaW5rLnJlbCA9ICdzdHlsZXNoZWV0Jztcblx0XHRsaW5rLmhyZWYgPSB1cmw7XG5cdFx0ZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaGVhZCcgKVsgMCBdLmFwcGVuZENoaWxkKCBsaW5rICk7XG5cblx0fSxcblx0aW5qZWN0OiBmdW5jdGlvbiBpbmplY3QoIGNzc0NvbnRlbnQsIGluZG9jICkge1xuXG5cdFx0dmFyIGRvYyA9IGluZG9jIHx8IGRvY3VtZW50O1xuXHRcdHZhciBpbmplY3RlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzdHlsZScgKTtcblx0XHRpbmplY3RlZC50eXBlID0gJ3RleHQvY3NzJztcblx0XHRpbmplY3RlZC5pbm5lckhUTUwgPSBjc3NDb250ZW50O1xuXHRcdHZhciBoZWFkID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaGVhZCcgKVsgMCBdO1xuXHRcdHRyeSB7XG5cblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQoIGluamVjdGVkICk7XG5cblx0XHR9IGNhdGNoICggZSApIHtcblx0XHR9XG5cblx0fVxufTtcblxudmFyIHNhdmVEaWFsb2dDb250ZW50cyA9IFwiPGRpdiBpZD1cXFwiZGctc2F2ZVxcXCIgY2xhc3M9XFxcImRnIGRpYWxvZ3VlXFxcIj5cXG5cXG4gIEhlcmUncyB0aGUgbmV3IGxvYWQgcGFyYW1ldGVyIGZvciB5b3VyIDxjb2RlPkdVSTwvY29kZT4ncyBjb25zdHJ1Y3RvcjpcXG5cXG4gIDx0ZXh0YXJlYSBpZD1cXFwiZGctbmV3LWNvbnN0cnVjdG9yXFxcIj48L3RleHRhcmVhPlxcblxcbiAgPGRpdiBpZD1cXFwiZGctc2F2ZS1sb2NhbGx5XFxcIj5cXG5cXG4gICAgPGlucHV0IGlkPVxcXCJkZy1sb2NhbC1zdG9yYWdlXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIvPiBBdXRvbWF0aWNhbGx5IHNhdmVcXG4gICAgdmFsdWVzIHRvIDxjb2RlPmxvY2FsU3RvcmFnZTwvY29kZT4gb24gZXhpdC5cXG5cXG4gICAgPGRpdiBpZD1cXFwiZGctbG9jYWwtZXhwbGFpblxcXCI+VGhlIHZhbHVlcyBzYXZlZCB0byA8Y29kZT5sb2NhbFN0b3JhZ2U8L2NvZGU+IHdpbGxcXG4gICAgICBvdmVycmlkZSB0aG9zZSBwYXNzZWQgdG8gPGNvZGU+ZGF0LkdVSTwvY29kZT4ncyBjb25zdHJ1Y3Rvci4gVGhpcyBtYWtlcyBpdFxcbiAgICAgIGVhc2llciB0byB3b3JrIGluY3JlbWVudGFsbHksIGJ1dCA8Y29kZT5sb2NhbFN0b3JhZ2U8L2NvZGU+IGlzIGZyYWdpbGUsXFxuICAgICAgYW5kIHlvdXIgZnJpZW5kcyBtYXkgbm90IHNlZSB0aGUgc2FtZSB2YWx1ZXMgeW91IGRvLlxcblxcbiAgICA8L2Rpdj5cXG5cXG4gIDwvZGl2PlxcblxcbjwvZGl2PlwiO1xuXG52YXIgQ29udHJvbGxlckZhY3RvcnkgPSBmdW5jdGlvbiBDb250cm9sbGVyRmFjdG9yeSggb2JqZWN0LCBwcm9wZXJ0eSApIHtcblxuXHR2YXIgaW5pdGlhbFZhbHVlID0gb2JqZWN0WyBwcm9wZXJ0eSBdO1xuXHRpZiAoIENvbW1vbi5pc0FycmF5KCBhcmd1bWVudHNbIDIgXSApIHx8IENvbW1vbi5pc09iamVjdCggYXJndW1lbnRzWyAyIF0gKSApIHtcblxuXHRcdHJldHVybiBuZXcgT3B0aW9uQ29udHJvbGxlciggb2JqZWN0LCBwcm9wZXJ0eSwgYXJndW1lbnRzWyAyIF0gKTtcblxuXHR9XG5cdGlmICggQ29tbW9uLmlzTnVtYmVyKCBpbml0aWFsVmFsdWUgKSApIHtcblxuXHRcdGlmICggQ29tbW9uLmlzTnVtYmVyKCBhcmd1bWVudHNbIDIgXSApICYmIENvbW1vbi5pc051bWJlciggYXJndW1lbnRzWyAzIF0gKSApIHtcblxuXHRcdFx0aWYgKCBDb21tb24uaXNOdW1iZXIoIGFyZ3VtZW50c1sgNCBdICkgKSB7XG5cblx0XHRcdFx0cmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5LCBhcmd1bWVudHNbIDIgXSwgYXJndW1lbnRzWyAzIF0sIGFyZ3VtZW50c1sgNCBdICk7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBuZXcgTnVtYmVyQ29udHJvbGxlclNsaWRlciggb2JqZWN0LCBwcm9wZXJ0eSwgYXJndW1lbnRzWyAyIF0sIGFyZ3VtZW50c1sgMyBdICk7XG5cblx0XHR9XG5cdFx0aWYgKCBDb21tb24uaXNOdW1iZXIoIGFyZ3VtZW50c1sgNCBdICkgKSB7XG5cblx0XHRcdHJldHVybiBuZXcgTnVtYmVyQ29udHJvbGxlckJveCggb2JqZWN0LCBwcm9wZXJ0eSwgeyBtaW46IGFyZ3VtZW50c1sgMiBdLCBtYXg6IGFyZ3VtZW50c1sgMyBdLCBzdGVwOiBhcmd1bWVudHNbIDQgXSB9ICk7XG5cblx0XHR9XG5cdFx0cmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyQm94KCBvYmplY3QsIHByb3BlcnR5LCB7IG1pbjogYXJndW1lbnRzWyAyIF0sIG1heDogYXJndW1lbnRzWyAzIF0gfSApO1xuXG5cdH1cblx0aWYgKCBDb21tb24uaXNTdHJpbmcoIGluaXRpYWxWYWx1ZSApICkge1xuXG5cdFx0cmV0dXJuIG5ldyBTdHJpbmdDb250cm9sbGVyKCBvYmplY3QsIHByb3BlcnR5ICk7XG5cblx0fVxuXHRpZiAoIENvbW1vbi5pc0Z1bmN0aW9uKCBpbml0aWFsVmFsdWUgKSApIHtcblxuXHRcdHJldHVybiBuZXcgRnVuY3Rpb25Db250cm9sbGVyKCBvYmplY3QsIHByb3BlcnR5LCAnJyApO1xuXG5cdH1cblx0aWYgKCBDb21tb24uaXNCb29sZWFuKCBpbml0aWFsVmFsdWUgKSApIHtcblxuXHRcdHJldHVybiBuZXcgQm9vbGVhbkNvbnRyb2xsZXIoIG9iamVjdCwgcHJvcGVydHkgKTtcblxuXHR9XG5cdHJldHVybiBudWxsO1xuXG59O1xuXG5mdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGNhbGxiYWNrICkge1xuXG5cdHNldFRpbWVvdXQoIGNhbGxiYWNrLCAxMDAwIC8gNjAgKTtcblxufVxudmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSQxID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxudmFyIENlbnRlcmVkRGl2ID0gZnVuY3Rpb24gKCkge1xuXG5cdGZ1bmN0aW9uIENlbnRlcmVkRGl2KCkge1xuXG5cdFx0Y2xhc3NDYWxsQ2hlY2soIHRoaXMsIENlbnRlcmVkRGl2ICk7XG5cdFx0dGhpcy5iYWNrZ3JvdW5kRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0Q29tbW9uLmV4dGVuZCggdGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZSwge1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwLjgpJyxcblx0XHRcdHRvcDogMCxcblx0XHRcdGxlZnQ6IDAsXG5cdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHR6SW5kZXg6ICcxMDAwJyxcblx0XHRcdG9wYWNpdHk6IDAsXG5cdFx0XHRXZWJraXRUcmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzIGxpbmVhcicsXG5cdFx0XHR0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzIGxpbmVhcidcblx0XHR9ICk7XG5cdFx0ZG9tLm1ha2VGdWxsc2NyZWVuKCB0aGlzLmJhY2tncm91bmRFbGVtZW50ICk7XG5cdFx0dGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG5cdFx0dGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRDb21tb24uZXh0ZW5kKCB0aGlzLmRvbUVsZW1lbnQuc3R5bGUsIHtcblx0XHRcdHBvc2l0aW9uOiAnZml4ZWQnLFxuXHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0ekluZGV4OiAnMTAwMScsXG5cdFx0XHRvcGFjaXR5OiAwLFxuXHRcdFx0V2Via2l0VHJhbnNpdGlvbjogJy13ZWJraXQtdHJhbnNmb3JtIDAuMnMgZWFzZS1vdXQsIG9wYWNpdHkgMC4ycyBsaW5lYXInLFxuXHRcdFx0dHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnMgbGluZWFyJ1xuXHRcdH0gKTtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0aGlzLmJhY2tncm91bmRFbGVtZW50ICk7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggdGhpcy5kb21FbGVtZW50ICk7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRkb20uYmluZCggdGhpcy5iYWNrZ3JvdW5kRWxlbWVudCwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRfdGhpcy5oaWRlKCk7XG5cblx0XHR9ICk7XG5cblx0fVxuXHRjcmVhdGVDbGFzcyggQ2VudGVyZWREaXYsIFsge1xuXHRcdGtleTogJ3Nob3cnLFxuXHRcdHZhbHVlOiBmdW5jdGlvbiBzaG93KCkge1xuXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0dGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdHRoaXMuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdHRoaXMuZG9tRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcblx0XHRcdHRoaXMuZG9tRWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMS4xKSc7XG5cdFx0XHR0aGlzLmxheW91dCgpO1xuXHRcdFx0Q29tbW9uLmRlZmVyKCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0X3RoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XG5cdFx0XHRcdF90aGlzLmRvbUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XG5cdFx0XHRcdF90aGlzLmRvbUVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEpJztcblxuXHRcdFx0fSApO1xuXG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiAnaGlkZScsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGhpZGUoKSB7XG5cblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgaGlkZSA9IGZ1bmN0aW9uIGhpZGUoKSB7XG5cblx0XHRcdFx0X3RoaXMuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRfdGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdFx0XHRkb20udW5iaW5kKCBfdGhpcy5kb21FbGVtZW50LCAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGhpZGUgKTtcblx0XHRcdFx0ZG9tLnVuYmluZCggX3RoaXMuZG9tRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnLCBoaWRlICk7XG5cdFx0XHRcdGRvbS51bmJpbmQoIF90aGlzLmRvbUVsZW1lbnQsICdvVHJhbnNpdGlvbkVuZCcsIGhpZGUgKTtcblxuXHRcdFx0fTtcblx0XHRcdGRvbS5iaW5kKCB0aGlzLmRvbUVsZW1lbnQsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgaGlkZSApO1xuXHRcdFx0ZG9tLmJpbmQoIHRoaXMuZG9tRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnLCBoaWRlICk7XG5cdFx0XHRkb20uYmluZCggdGhpcy5kb21FbGVtZW50LCAnb1RyYW5zaXRpb25FbmQnLCBoaWRlICk7XG5cdFx0XHR0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuXHRcdFx0dGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuXHRcdFx0dGhpcy5kb21FbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgxLjEpJztcblxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogJ2xheW91dCcsXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGxheW91dCgpIHtcblxuXHRcdFx0dGhpcy5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSBkb20uZ2V0V2lkdGgoIHRoaXMuZG9tRWxlbWVudCApIC8gMiArICdweCc7XG5cdFx0XHR0aGlzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC8gMiAtIGRvbS5nZXRIZWlnaHQoIHRoaXMuZG9tRWxlbWVudCApIC8gMiArICdweCc7XG5cblx0XHR9XG5cdH0gXSApO1xuXHRyZXR1cm4gQ2VudGVyZWREaXY7XG5cbn0oKTtcblxudmFyIHN0eWxlU2hlZXQgPSBfX18kaW5zZXJ0U3R5bGUoIFwiLmRnIHVse2xpc3Qtc3R5bGU6bm9uZTttYXJnaW46MDtwYWRkaW5nOjA7d2lkdGg6MTAwJTtjbGVhcjpib3RofS5kZy5hY3twb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6MDt6LWluZGV4OjB9LmRnOm5vdCguYWMpIC5tYWlue292ZXJmbG93OmhpZGRlbn0uZGcubWFpbnstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyOy1vLXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyOy1tb3otdHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXJ9LmRnLm1haW4udGFsbGVyLXRoYW4td2luZG93e292ZXJmbG93LXk6YXV0b30uZGcubWFpbi50YWxsZXItdGhhbi13aW5kb3cgLmNsb3NlLWJ1dHRvbntvcGFjaXR5OjE7bWFyZ2luLXRvcDotMXB4O2JvcmRlci10b3A6MXB4IHNvbGlkICMyYzJjMmN9LmRnLm1haW4gdWwuY2xvc2VkIC5jbG9zZS1idXR0b257b3BhY2l0eToxICFpbXBvcnRhbnR9LmRnLm1haW46aG92ZXIgLmNsb3NlLWJ1dHRvbiwuZGcubWFpbiAuY2xvc2UtYnV0dG9uLmRyYWd7b3BhY2l0eToxfS5kZy5tYWluIC5jbG9zZS1idXR0b257LXdlYmtpdC10cmFuc2l0aW9uOm9wYWNpdHkgLjFzIGxpbmVhcjstby10cmFuc2l0aW9uOm9wYWNpdHkgLjFzIGxpbmVhcjstbW96LXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyO3RyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyO2JvcmRlcjowO2xpbmUtaGVpZ2h0OjE5cHg7aGVpZ2h0OjIwcHg7Y3Vyc29yOnBvaW50ZXI7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZC1jb2xvcjojMDAwfS5kZy5tYWluIC5jbG9zZS1idXR0b24uY2xvc2UtdG9we3Bvc2l0aW9uOnJlbGF0aXZlfS5kZy5tYWluIC5jbG9zZS1idXR0b24uY2xvc2UtYm90dG9te3Bvc2l0aW9uOmFic29sdXRlfS5kZy5tYWluIC5jbG9zZS1idXR0b246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojMTExfS5kZy5he2Zsb2F0OnJpZ2h0O21hcmdpbi1yaWdodDoxNXB4O292ZXJmbG93LXk6dmlzaWJsZX0uZGcuYS5oYXMtc2F2ZT51bC5jbG9zZS10b3B7bWFyZ2luLXRvcDowfS5kZy5hLmhhcy1zYXZlPnVsLmNsb3NlLWJvdHRvbXttYXJnaW4tdG9wOjI3cHh9LmRnLmEuaGFzLXNhdmU+dWwuY2xvc2Vke21hcmdpbi10b3A6MH0uZGcuYSAuc2F2ZS1yb3d7dG9wOjA7ei1pbmRleDoxMDAyfS5kZy5hIC5zYXZlLXJvdy5jbG9zZS10b3B7cG9zaXRpb246cmVsYXRpdmV9LmRnLmEgLnNhdmUtcm93LmNsb3NlLWJvdHRvbXtwb3NpdGlvbjpmaXhlZH0uZGcgbGl7LXdlYmtpdC10cmFuc2l0aW9uOmhlaWdodCAuMXMgZWFzZS1vdXQ7LW8tdHJhbnNpdGlvbjpoZWlnaHQgLjFzIGVhc2Utb3V0Oy1tb3otdHJhbnNpdGlvbjpoZWlnaHQgLjFzIGVhc2Utb3V0O3RyYW5zaXRpb246aGVpZ2h0IC4xcyBlYXNlLW91dDstd2Via2l0LXRyYW5zaXRpb246b3ZlcmZsb3cgLjFzIGxpbmVhcjstby10cmFuc2l0aW9uOm92ZXJmbG93IC4xcyBsaW5lYXI7LW1vei10cmFuc2l0aW9uOm92ZXJmbG93IC4xcyBsaW5lYXI7dHJhbnNpdGlvbjpvdmVyZmxvdyAuMXMgbGluZWFyfS5kZyBsaTpub3QoLmZvbGRlcil7Y3Vyc29yOmF1dG87aGVpZ2h0OjI3cHg7bGluZS1oZWlnaHQ6MjdweDtwYWRkaW5nOjAgNHB4IDAgNXB4fS5kZyBsaS5mb2xkZXJ7cGFkZGluZzowO2JvcmRlci1sZWZ0OjRweCBzb2xpZCByZ2JhKDAsMCwwLDApfS5kZyBsaS50aXRsZXtjdXJzb3I6cG9pbnRlcjttYXJnaW4tbGVmdDotNHB4fS5kZyAuY2xvc2VkIGxpOm5vdCgudGl0bGUpLC5kZyAuY2xvc2VkIHVsIGxpLC5kZyAuY2xvc2VkIHVsIGxpPip7aGVpZ2h0OjA7b3ZlcmZsb3c6aGlkZGVuO2JvcmRlcjowfS5kZyAuY3J7Y2xlYXI6Ym90aDtwYWRkaW5nLWxlZnQ6M3B4O2hlaWdodDoyN3B4O292ZXJmbG93OmhpZGRlbn0uZGcgLnByb3BlcnR5LW5hbWV7Y3Vyc29yOmRlZmF1bHQ7ZmxvYXQ6bGVmdDtjbGVhcjpsZWZ0O3dpZHRoOjQwJTtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30uZGcgLmN7ZmxvYXQ6bGVmdDt3aWR0aDo2MCU7cG9zaXRpb246cmVsYXRpdmV9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF17Ym9yZGVyOjA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzozcHg7d2lkdGg6MTAwJTtmbG9hdDpyaWdodH0uZGcgLmhhcy1zbGlkZXIgaW5wdXRbdHlwZT10ZXh0XXt3aWR0aDozMCU7bWFyZ2luLWxlZnQ6MH0uZGcgLnNsaWRlcntmbG9hdDpsZWZ0O3dpZHRoOjY2JTttYXJnaW4tbGVmdDotNXB4O21hcmdpbi1yaWdodDowO2hlaWdodDoxOXB4O21hcmdpbi10b3A6NHB4fS5kZyAuc2xpZGVyLWZne2hlaWdodDoxMDAlfS5kZyAuYyBpbnB1dFt0eXBlPWNoZWNrYm94XXttYXJnaW4tdG9wOjdweH0uZGcgLmMgc2VsZWN0e21hcmdpbi10b3A6NXB4fS5kZyAuY3IuZnVuY3Rpb24sLmRnIC5jci5mdW5jdGlvbiAucHJvcGVydHktbmFtZSwuZGcgLmNyLmZ1bmN0aW9uICosLmRnIC5jci5ib29sZWFuLC5kZyAuY3IuYm9vbGVhbiAqe2N1cnNvcjpwb2ludGVyfS5kZyAuY3IuY29sb3J7b3ZlcmZsb3c6dmlzaWJsZX0uZGcgLnNlbGVjdG9ye2Rpc3BsYXk6bm9uZTtwb3NpdGlvbjphYnNvbHV0ZTttYXJnaW4tbGVmdDotOXB4O21hcmdpbi10b3A6MjNweDt6LWluZGV4OjEwfS5kZyAuYzpob3ZlciAuc2VsZWN0b3IsLmRnIC5zZWxlY3Rvci5kcmFne2Rpc3BsYXk6YmxvY2t9LmRnIGxpLnNhdmUtcm93e3BhZGRpbmc6MH0uZGcgbGkuc2F2ZS1yb3cgLmJ1dHRvbntkaXNwbGF5OmlubGluZS1ibG9jaztwYWRkaW5nOjBweCA2cHh9LmRnLmRpYWxvZ3Vle2JhY2tncm91bmQtY29sb3I6IzIyMjt3aWR0aDo0NjBweDtwYWRkaW5nOjE1cHg7Zm9udC1zaXplOjEzcHg7bGluZS1oZWlnaHQ6MTVweH0jZGctbmV3LWNvbnN0cnVjdG9ye3BhZGRpbmc6MTBweDtjb2xvcjojMjIyO2ZvbnQtZmFtaWx5Ok1vbmFjbywgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB4O2JvcmRlcjowO3Jlc2l6ZTpub25lO2JveC1zaGFkb3c6aW5zZXQgMXB4IDFweCAxcHggIzg4ODt3b3JkLXdyYXA6YnJlYWstd29yZDttYXJnaW46MTJweCAwO2Rpc3BsYXk6YmxvY2s7d2lkdGg6NDQwcHg7b3ZlcmZsb3cteTpzY3JvbGw7aGVpZ2h0OjEwMHB4O3Bvc2l0aW9uOnJlbGF0aXZlfSNkZy1sb2NhbC1leHBsYWlue2Rpc3BsYXk6bm9uZTtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxN3B4O2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQtY29sb3I6IzMzMztwYWRkaW5nOjhweDttYXJnaW4tdG9wOjEwcHh9I2RnLWxvY2FsLWV4cGxhaW4gY29kZXtmb250LXNpemU6MTBweH0jZGF0LWd1aS1zYXZlLWxvY2FsbHl7ZGlzcGxheTpub25lfS5kZ3tjb2xvcjojZWVlO2ZvbnQ6MTFweCAnTHVjaWRhIEdyYW5kZScsIHNhbnMtc2VyaWY7dGV4dC1zaGFkb3c6MCAtMXB4IDAgIzExMX0uZGcubWFpbjo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6NXB4O2JhY2tncm91bmQ6IzFhMWExYX0uZGcubWFpbjo6LXdlYmtpdC1zY3JvbGxiYXItY29ybmVye2hlaWdodDowO2Rpc3BsYXk6bm9uZX0uZGcubWFpbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWJ7Ym9yZGVyLXJhZGl1czo1cHg7YmFja2dyb3VuZDojNjc2NzY3fS5kZyBsaTpub3QoLmZvbGRlcil7YmFja2dyb3VuZDojMWExYTFhO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMyYzJjMmN9LmRnIGxpLnNhdmUtcm93e2xpbmUtaGVpZ2h0OjI1cHg7YmFja2dyb3VuZDojZGFkNWNiO2JvcmRlcjowfS5kZyBsaS5zYXZlLXJvdyBzZWxlY3R7bWFyZ2luLWxlZnQ6NXB4O3dpZHRoOjEwOHB4fS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9ue21hcmdpbi1sZWZ0OjVweDttYXJnaW4tdG9wOjFweDtib3JkZXItcmFkaXVzOjJweDtmb250LXNpemU6OXB4O2xpbmUtaGVpZ2h0OjdweDtwYWRkaW5nOjRweCA0cHggNXB4IDRweDtiYWNrZ3JvdW5kOiNjNWJkYWQ7Y29sb3I6I2ZmZjt0ZXh0LXNoYWRvdzowIDFweCAwICNiMGE1OGY7Ym94LXNoYWRvdzowIC0xcHggMCAjYjBhNThmO2N1cnNvcjpwb2ludGVyfS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9uLmdlYXJze2JhY2tncm91bmQ6I2M1YmRhZCB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBc0FBQUFOQ0FZQUFBQi85WlE3QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUFRSkpSRUZVZU5waVlLQVUvUC8vUHdHSUMvQXBDQUJpQlNBVytJOEFDbEFjZ0t4UTRUOWhvTUFFVXJ4eDJRU0dONitlZ0RYKy92V1Q0ZTdOODJBTVlvUEF4L2V2d1dvWW9TWWJBQ1gyczdLeEN4emNzZXpEaDNldkZvREVCWVRFRXF5Y2dnV0F6QTlBdVVTUVFnZVlQYTlmUHY2L1lXbS9BY3g1SVBiN3R5L2Z3K1FaYmx3Njd2RHM4UjBZSHlRaGdPYngreUFKa0JxbUc1ZFBQRGgxYVBPR1IvZXVnVzBHNHZsSW9USWZ5RmNBK1Fla2hoSEpoUGRReGJpQUlndU1CVFFaclBENzEwOE02cm9XWURGUWlJQUF2NkFvdy8xYkZ3WGdpcytmMkxVQXlud29JYU5jejhYTngzRGw3TUVKVURHUXB4OWd0UThZQ3VlQitEMjZPRUNBQVFEYWR0N2U0NkQ0MlFBQUFBQkpSVTVFcmtKZ2dnPT0pIDJweCAxcHggbm8tcmVwZWF0O2hlaWdodDo3cHg7d2lkdGg6OHB4fS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9uOmhvdmVye2JhY2tncm91bmQtY29sb3I6I2JhYjE5ZTtib3gtc2hhZG93OjAgLTFweCAwICNiMGE1OGZ9LmRnIGxpLmZvbGRlcntib3JkZXItYm90dG9tOjB9LmRnIGxpLnRpdGxle3BhZGRpbmctbGVmdDoxNnB4O2JhY2tncm91bmQ6IzAwMCB1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQlFBRkFKRUFBUC8vLy9QejgvLy8vLy8vL3lINUJBRUFBQUlBTEFBQUFBQUZBQVVBQUFJSWxJK2hLZ0Z4b0NnQU93PT0pIDZweCAxMHB4IG5vLXJlcGVhdDtjdXJzb3I6cG9pbnRlcjtib3JkZXItYm90dG9tOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMil9LmRnIC5jbG9zZWQgbGkudGl0bGV7YmFja2dyb3VuZC1pbWFnZTp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQlFBRkFKRUFBUC8vLy9QejgvLy8vLy8vL3lINUJBRUFBQUlBTEFBQUFBQUZBQVVBQUFJSWxHSVdxTUNiV0FFQU93PT0pfS5kZyAuY3IuYm9vbGVhbntib3JkZXItbGVmdDozcHggc29saWQgIzgwNjc4N30uZGcgLmNyLmNvbG9ye2JvcmRlci1sZWZ0OjNweCBzb2xpZH0uZGcgLmNyLmZ1bmN0aW9ue2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjZTYxZDVmfS5kZyAuY3IubnVtYmVye2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjMkZBMUQ2fS5kZyAuY3IubnVtYmVyIGlucHV0W3R5cGU9dGV4dF17Y29sb3I6IzJGQTFENn0uZGcgLmNyLnN0cmluZ3tib3JkZXItbGVmdDozcHggc29saWQgIzFlZDM2Zn0uZGcgLmNyLnN0cmluZyBpbnB1dFt0eXBlPXRleHRde2NvbG9yOiMxZWQzNmZ9LmRnIC5jci5mdW5jdGlvbjpob3ZlciwuZGcgLmNyLmJvb2xlYW46aG92ZXJ7YmFja2dyb3VuZDojMTExfS5kZyAuYyBpbnB1dFt0eXBlPXRleHRde2JhY2tncm91bmQ6IzMwMzAzMDtvdXRsaW5lOm5vbmV9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF06aG92ZXJ7YmFja2dyb3VuZDojM2MzYzNjfS5kZyAuYyBpbnB1dFt0eXBlPXRleHRdOmZvY3Vze2JhY2tncm91bmQ6IzQ5NDk0OTtjb2xvcjojZmZmfS5kZyAuYyAuc2xpZGVye2JhY2tncm91bmQ6IzMwMzAzMDtjdXJzb3I6ZXctcmVzaXplfS5kZyAuYyAuc2xpZGVyLWZne2JhY2tncm91bmQ6IzJGQTFENjttYXgtd2lkdGg6MTAwJX0uZGcgLmMgLnNsaWRlcjpob3ZlcntiYWNrZ3JvdW5kOiMzYzNjM2N9LmRnIC5jIC5zbGlkZXI6aG92ZXIgLnNsaWRlci1mZ3tiYWNrZ3JvdW5kOiM0NGFiZGF9XFxuXCIgKTtcblxuY3NzLmluamVjdCggc3R5bGVTaGVldCApO1xudmFyIENTU19OQU1FU1BBQ0UgPSAnZGcnO1xudmFyIEhJREVfS0VZX0NPREUgPSA3MjtcbnZhciBDTE9TRV9CVVRUT05fSEVJR0hUID0gMjA7XG52YXIgREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FID0gJ0RlZmF1bHQnO1xudmFyIFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgPSBmdW5jdGlvbiAoKSB7XG5cblx0dHJ5IHtcblxuXHRcdHJldHVybiAhISB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG5cdH0gY2F0Y2ggKCBlICkge1xuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblxufSgpO1xudmFyIFNBVkVfRElBTE9HVUUgPSB2b2lkIDA7XG52YXIgYXV0b1BsYWNlVmlyZ2luID0gdHJ1ZTtcbnZhciBhdXRvUGxhY2VDb250YWluZXIgPSB2b2lkIDA7XG52YXIgaGlkZSA9IGZhbHNlO1xudmFyIGhpZGVhYmxlR3VpcyA9IFtdO1xudmFyIEdVSSA9IGZ1bmN0aW9uIEdVSSggcGFycyApIHtcblxuXHR2YXIgX3RoaXMgPSB0aGlzO1xuXHR2YXIgcGFyYW1zID0gcGFycyB8fCB7fTtcblx0dGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0dGhpcy5fX3VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3VsJyApO1xuXHR0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoIHRoaXMuX191bCApO1xuXHRkb20uYWRkQ2xhc3MoIHRoaXMuZG9tRWxlbWVudCwgQ1NTX05BTUVTUEFDRSApO1xuXHR0aGlzLl9fZm9sZGVycyA9IHt9O1xuXHR0aGlzLl9fY29udHJvbGxlcnMgPSBbXTtcblx0dGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzID0gW107XG5cdHRoaXMuX19yZW1lbWJlcmVkT2JqZWN0SW5kZWNlc1RvQ29udHJvbGxlcnMgPSBbXTtcblx0dGhpcy5fX2xpc3RlbmluZyA9IFtdO1xuXHRwYXJhbXMgPSBDb21tb24uZGVmYXVsdHMoIHBhcmFtcywge1xuXHRcdGNsb3NlT25Ub3A6IGZhbHNlLFxuXHRcdGF1dG9QbGFjZTogdHJ1ZSxcblx0XHR3aWR0aDogR1VJLkRFRkFVTFRfV0lEVEhcblx0fSApO1xuXHRwYXJhbXMgPSBDb21tb24uZGVmYXVsdHMoIHBhcmFtcywge1xuXHRcdHJlc2l6YWJsZTogcGFyYW1zLmF1dG9QbGFjZSxcblx0XHRoaWRlYWJsZTogcGFyYW1zLmF1dG9QbGFjZVxuXHR9ICk7XG5cdGlmICggISBDb21tb24uaXNVbmRlZmluZWQoIHBhcmFtcy5sb2FkICkgKSB7XG5cblx0XHRpZiAoIHBhcmFtcy5wcmVzZXQgKSB7XG5cblx0XHRcdHBhcmFtcy5sb2FkLnByZXNldCA9IHBhcmFtcy5wcmVzZXQ7XG5cblx0XHR9XG5cblx0fSBlbHNlIHtcblxuXHRcdHBhcmFtcy5sb2FkID0geyBwcmVzZXQ6IERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSB9O1xuXG5cdH1cblx0aWYgKCBDb21tb24uaXNVbmRlZmluZWQoIHBhcmFtcy5wYXJlbnQgKSAmJiBwYXJhbXMuaGlkZWFibGUgKSB7XG5cblx0XHRoaWRlYWJsZUd1aXMucHVzaCggdGhpcyApO1xuXG5cdH1cblx0cGFyYW1zLnJlc2l6YWJsZSA9IENvbW1vbi5pc1VuZGVmaW5lZCggcGFyYW1zLnBhcmVudCApICYmIHBhcmFtcy5yZXNpemFibGU7XG5cdGlmICggcGFyYW1zLmF1dG9QbGFjZSAmJiBDb21tb24uaXNVbmRlZmluZWQoIHBhcmFtcy5zY3JvbGxhYmxlICkgKSB7XG5cblx0XHRwYXJhbXMuc2Nyb2xsYWJsZSA9IHRydWU7XG5cblx0fVxuXHR2YXIgdXNlTG9jYWxTdG9yYWdlID0gU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSggZ2V0TG9jYWxTdG9yYWdlSGFzaCggdGhpcywgJ2lzTG9jYWwnICkgKSA9PT0gJ3RydWUnO1xuXHR2YXIgc2F2ZVRvTG9jYWxTdG9yYWdlID0gdm9pZCAwO1xuXHR2YXIgdGl0bGVSb3cgPSB2b2lkIDA7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCB0aGlzLFxuXHRcdHtcblx0XHRcdHBhcmVudDoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblxuXHRcdFx0XHRcdHJldHVybiBwYXJhbXMucGFyZW50O1xuXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzY3JvbGxhYmxlOiB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmFtcy5zY3JvbGxhYmxlO1xuXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRhdXRvUGxhY2U6IHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gcGFyYW1zLmF1dG9QbGFjZTtcblxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0Y2xvc2VPblRvcDoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblxuXHRcdFx0XHRcdHJldHVybiBwYXJhbXMuY2xvc2VPblRvcDtcblxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0cHJlc2V0OiB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXG5cdFx0XHRcdFx0aWYgKCBfdGhpcy5wYXJlbnQgKSB7XG5cblx0XHRcdFx0XHRcdHJldHVybiBfdGhpcy5nZXRSb290KCkucHJlc2V0O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBwYXJhbXMubG9hZC5wcmVzZXQ7XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEoIHYgKSB7XG5cblx0XHRcdFx0XHRpZiAoIF90aGlzLnBhcmVudCApIHtcblxuXHRcdFx0XHRcdFx0X3RoaXMuZ2V0Um9vdCgpLnByZXNldCA9IHY7XG5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRwYXJhbXMubG9hZC5wcmVzZXQgPSB2O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHNldFByZXNldFNlbGVjdEluZGV4KCB0aGlzICk7XG5cdFx0XHRcdFx0X3RoaXMucmV2ZXJ0KCk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHdpZHRoOiB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuXG5cdFx0XHRcdFx0cmV0dXJuIHBhcmFtcy53aWR0aDtcblxuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldCQkMSggdiApIHtcblxuXHRcdFx0XHRcdHBhcmFtcy53aWR0aCA9IHY7XG5cdFx0XHRcdFx0c2V0V2lkdGgoIF90aGlzLCB2ICk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdG5hbWU6IHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gcGFyYW1zLm5hbWU7XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEoIHYgKSB7XG5cblx0XHRcdFx0XHRwYXJhbXMubmFtZSA9IHY7XG5cdFx0XHRcdFx0aWYgKCB0aXRsZVJvdyApIHtcblxuXHRcdFx0XHRcdFx0dGl0bGVSb3cuaW5uZXJIVE1MID0gcGFyYW1zLm5hbWU7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNsb3NlZDoge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblxuXHRcdFx0XHRcdHJldHVybiBwYXJhbXMuY2xvc2VkO1xuXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldDogZnVuY3Rpb24gc2V0JCQxKCB2ICkge1xuXG5cdFx0XHRcdFx0cGFyYW1zLmNsb3NlZCA9IHY7XG5cdFx0XHRcdFx0aWYgKCBwYXJhbXMuY2xvc2VkICkge1xuXG5cdFx0XHRcdFx0XHRkb20uYWRkQ2xhc3MoIF90aGlzLl9fdWwsIEdVSS5DTEFTU19DTE9TRUQgKTtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdGRvbS5yZW1vdmVDbGFzcyggX3RoaXMuX191bCwgR1VJLkNMQVNTX0NMT1NFRCApO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMub25SZXNpemUoKTtcblx0XHRcdFx0XHRpZiAoIF90aGlzLl9fY2xvc2VCdXR0b24gKSB7XG5cblx0XHRcdFx0XHRcdF90aGlzLl9fY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gdiA/IEdVSS5URVhUX09QRU4gOiBHVUkuVEVYVF9DTE9TRUQ7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGxvYWQ6IHtcblx0XHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG5cblx0XHRcdFx0XHRyZXR1cm4gcGFyYW1zLmxvYWQ7XG5cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHVzZUxvY2FsU3RvcmFnZToge1xuXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcblxuXHRcdFx0XHRcdHJldHVybiB1c2VMb2NhbFN0b3JhZ2U7XG5cblx0XHRcdFx0fSxcblx0XHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQkJDEoIGJvb2wgKSB7XG5cblx0XHRcdFx0XHRpZiAoIFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgKSB7XG5cblx0XHRcdFx0XHRcdHVzZUxvY2FsU3RvcmFnZSA9IGJvb2w7XG5cdFx0XHRcdFx0XHRpZiAoIGJvb2wgKSB7XG5cblx0XHRcdFx0XHRcdFx0ZG9tLmJpbmQoIHdpbmRvdywgJ3VubG9hZCcsIHNhdmVUb0xvY2FsU3RvcmFnZSApO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ3VubG9hZCcsIHNhdmVUb0xvY2FsU3RvcmFnZSApO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggZ2V0TG9jYWxTdG9yYWdlSGFzaCggX3RoaXMsICdpc0xvY2FsJyApLCBib29sICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0aWYgKCBDb21tb24uaXNVbmRlZmluZWQoIHBhcmFtcy5wYXJlbnQgKSApIHtcblxuXHRcdHRoaXMuY2xvc2VkID0gcGFyYW1zLmNsb3NlZCB8fCBmYWxzZTtcblx0XHRkb20uYWRkQ2xhc3MoIHRoaXMuZG9tRWxlbWVudCwgR1VJLkNMQVNTX01BSU4gKTtcblx0XHRkb20ubWFrZVNlbGVjdGFibGUoIHRoaXMuZG9tRWxlbWVudCwgZmFsc2UgKTtcblx0XHRpZiAoIFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgKSB7XG5cblx0XHRcdGlmICggdXNlTG9jYWxTdG9yYWdlICkge1xuXG5cdFx0XHRcdF90aGlzLnVzZUxvY2FsU3RvcmFnZSA9IHRydWU7XG5cdFx0XHRcdHZhciBzYXZlZEd1aSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBnZXRMb2NhbFN0b3JhZ2VIYXNoKCB0aGlzLCAnZ3VpJyApICk7XG5cdFx0XHRcdGlmICggc2F2ZWRHdWkgKSB7XG5cblx0XHRcdFx0XHRwYXJhbXMubG9hZCA9IEpTT04ucGFyc2UoIHNhdmVkR3VpICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0dGhpcy5fX2Nsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHR0aGlzLl9fY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gR1VJLlRFWFRfQ0xPU0VEO1xuXHRcdGRvbS5hZGRDbGFzcyggdGhpcy5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfQ0xPU0VfQlVUVE9OICk7XG5cdFx0aWYgKCBwYXJhbXMuY2xvc2VPblRvcCApIHtcblxuXHRcdFx0ZG9tLmFkZENsYXNzKCB0aGlzLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19DTE9TRV9UT1AgKTtcblx0XHRcdHRoaXMuZG9tRWxlbWVudC5pbnNlcnRCZWZvcmUoIHRoaXMuX19jbG9zZUJ1dHRvbiwgdGhpcy5kb21FbGVtZW50LmNoaWxkTm9kZXNbIDAgXSApO1xuXG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0ZG9tLmFkZENsYXNzKCB0aGlzLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19DTE9TRV9CT1RUT00gKTtcblx0XHRcdHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCggdGhpcy5fX2Nsb3NlQnV0dG9uICk7XG5cblx0XHR9XG5cdFx0ZG9tLmJpbmQoIHRoaXMuX19jbG9zZUJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRfdGhpcy5jbG9zZWQgPSAhIF90aGlzLmNsb3NlZDtcblxuXHRcdH0gKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0aWYgKCBwYXJhbXMuY2xvc2VkID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdHBhcmFtcy5jbG9zZWQgPSB0cnVlO1xuXG5cdFx0fVxuXHRcdHZhciB0aXRsZVJvd05hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggcGFyYW1zLm5hbWUgKTtcblx0XHRkb20uYWRkQ2xhc3MoIHRpdGxlUm93TmFtZSwgJ2NvbnRyb2xsZXItbmFtZScgKTtcblx0XHR0aXRsZVJvdyA9IGFkZFJvdyggX3RoaXMsIHRpdGxlUm93TmFtZSApO1xuXHRcdHZhciBvbkNsaWNrVGl0bGUgPSBmdW5jdGlvbiBvbkNsaWNrVGl0bGUoIGUgKSB7XG5cblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdF90aGlzLmNsb3NlZCA9ICEgX3RoaXMuY2xvc2VkO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0fTtcblx0XHRkb20uYWRkQ2xhc3MoIHRoaXMuX191bCwgR1VJLkNMQVNTX0NMT1NFRCApO1xuXHRcdGRvbS5hZGRDbGFzcyggdGl0bGVSb3csICd0aXRsZScgKTtcblx0XHRkb20uYmluZCggdGl0bGVSb3csICdjbGljaycsIG9uQ2xpY2tUaXRsZSApO1xuXHRcdGlmICggISBwYXJhbXMuY2xvc2VkICkge1xuXG5cdFx0XHR0aGlzLmNsb3NlZCA9IGZhbHNlO1xuXG5cdFx0fVxuXG5cdH1cblx0aWYgKCBwYXJhbXMuYXV0b1BsYWNlICkge1xuXG5cdFx0aWYgKCBDb21tb24uaXNVbmRlZmluZWQoIHBhcmFtcy5wYXJlbnQgKSApIHtcblxuXHRcdFx0aWYgKCBhdXRvUGxhY2VWaXJnaW4gKSB7XG5cblx0XHRcdFx0YXV0b1BsYWNlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRcdFx0ZG9tLmFkZENsYXNzKCBhdXRvUGxhY2VDb250YWluZXIsIENTU19OQU1FU1BBQ0UgKTtcblx0XHRcdFx0ZG9tLmFkZENsYXNzKCBhdXRvUGxhY2VDb250YWluZXIsIEdVSS5DTEFTU19BVVRPX1BMQUNFX0NPTlRBSU5FUiApO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBhdXRvUGxhY2VDb250YWluZXIgKTtcblx0XHRcdFx0YXV0b1BsYWNlVmlyZ2luID0gZmFsc2U7XG5cblx0XHRcdH1cblx0XHRcdGF1dG9QbGFjZUNvbnRhaW5lci5hcHBlbmRDaGlsZCggdGhpcy5kb21FbGVtZW50ICk7XG5cdFx0XHRkb20uYWRkQ2xhc3MoIHRoaXMuZG9tRWxlbWVudCwgR1VJLkNMQVNTX0FVVE9fUExBQ0UgKTtcblxuXHRcdH1cblx0XHRpZiAoICEgdGhpcy5wYXJlbnQgKSB7XG5cblx0XHRcdHNldFdpZHRoKCBfdGhpcywgcGFyYW1zLndpZHRoICk7XG5cblx0XHR9XG5cblx0fVxuXHR0aGlzLl9fcmVzaXplSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdF90aGlzLm9uUmVzaXplRGVib3VuY2VkKCk7XG5cblx0fTtcblx0ZG9tLmJpbmQoIHdpbmRvdywgJ3Jlc2l6ZScsIHRoaXMuX19yZXNpemVIYW5kbGVyICk7XG5cdGRvbS5iaW5kKCB0aGlzLl9fdWwsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgdGhpcy5fX3Jlc2l6ZUhhbmRsZXIgKTtcblx0ZG9tLmJpbmQoIHRoaXMuX191bCwgJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9fcmVzaXplSGFuZGxlciApO1xuXHRkb20uYmluZCggdGhpcy5fX3VsLCAnb1RyYW5zaXRpb25FbmQnLCB0aGlzLl9fcmVzaXplSGFuZGxlciApO1xuXHR0aGlzLm9uUmVzaXplKCk7XG5cdGlmICggcGFyYW1zLnJlc2l6YWJsZSApIHtcblxuXHRcdGFkZFJlc2l6ZUhhbmRsZSggdGhpcyApO1xuXG5cdH1cblx0c2F2ZVRvTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24gc2F2ZVRvTG9jYWxTdG9yYWdlKCkge1xuXG5cdFx0aWYgKCBTVVBQT1JUU19MT0NBTF9TVE9SQUdFICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBnZXRMb2NhbFN0b3JhZ2VIYXNoKCBfdGhpcywgJ2lzTG9jYWwnICkgKSA9PT0gJ3RydWUnICkge1xuXG5cdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSggZ2V0TG9jYWxTdG9yYWdlSGFzaCggX3RoaXMsICdndWknICksIEpTT04uc3RyaW5naWZ5KCBfdGhpcy5nZXRTYXZlT2JqZWN0KCkgKSApO1xuXG5cdFx0fVxuXG5cdH07XG5cdHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlSWZQb3NzaWJsZSA9IHNhdmVUb0xvY2FsU3RvcmFnZTtcblx0ZnVuY3Rpb24gcmVzZXRXaWR0aCgpIHtcblxuXHRcdHZhciByb290ID0gX3RoaXMuZ2V0Um9vdCgpO1xuXHRcdHJvb3Qud2lkdGggKz0gMTtcblx0XHRDb21tb24uZGVmZXIoIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cm9vdC53aWR0aCAtPSAxO1xuXG5cdFx0fSApO1xuXG5cdH1cblx0aWYgKCAhIHBhcmFtcy5wYXJlbnQgKSB7XG5cblx0XHRyZXNldFdpZHRoKCk7XG5cblx0fVxuXG59O1xuR1VJLnRvZ2dsZUhpZGUgPSBmdW5jdGlvbiAoKSB7XG5cblx0aGlkZSA9ICEgaGlkZTtcblx0Q29tbW9uLmVhY2goIGhpZGVhYmxlR3VpcywgZnVuY3Rpb24gKCBndWkgKSB7XG5cblx0XHRndWkuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gaGlkZSA/ICdub25lJyA6ICcnO1xuXG5cdH0gKTtcblxufTtcbkdVSS5DTEFTU19BVVRPX1BMQUNFID0gJ2EnO1xuR1VJLkNMQVNTX0FVVE9fUExBQ0VfQ09OVEFJTkVSID0gJ2FjJztcbkdVSS5DTEFTU19NQUlOID0gJ21haW4nO1xuR1VJLkNMQVNTX0NPTlRST0xMRVJfUk9XID0gJ2NyJztcbkdVSS5DTEFTU19UT09fVEFMTCA9ICd0YWxsZXItdGhhbi13aW5kb3cnO1xuR1VJLkNMQVNTX0NMT1NFRCA9ICdjbG9zZWQnO1xuR1VJLkNMQVNTX0NMT1NFX0JVVFRPTiA9ICdjbG9zZS1idXR0b24nO1xuR1VJLkNMQVNTX0NMT1NFX1RPUCA9ICdjbG9zZS10b3AnO1xuR1VJLkNMQVNTX0NMT1NFX0JPVFRPTSA9ICdjbG9zZS1ib3R0b20nO1xuR1VJLkNMQVNTX0RSQUcgPSAnZHJhZyc7XG5HVUkuREVGQVVMVF9XSURUSCA9IDI0NTtcbkdVSS5URVhUX0NMT1NFRCA9ICdDbG9zZSBDb250cm9scyc7XG5HVUkuVEVYVF9PUEVOID0gJ09wZW4gQ29udHJvbHMnO1xuR1VJLl9rZXlkb3duSGFuZGxlciA9IGZ1bmN0aW9uICggZSApIHtcblxuXHRpZiAoIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudHlwZSAhPT0gJ3RleHQnICYmICggZS53aGljaCA9PT0gSElERV9LRVlfQ09ERSB8fCBlLmtleUNvZGUgPT09IEhJREVfS0VZX0NPREUgKSApIHtcblxuXHRcdEdVSS50b2dnbGVIaWRlKCk7XG5cblx0fVxuXG59O1xuZG9tLmJpbmQoIHdpbmRvdywgJ2tleWRvd24nLCBHVUkuX2tleWRvd25IYW5kbGVyLCBmYWxzZSApO1xuQ29tbW9uLmV4dGVuZCggR1VJLnByb3RvdHlwZSxcblx0e1xuXHRcdGFkZDogZnVuY3Rpb24gYWRkKCBvYmplY3QsIHByb3BlcnR5ICkge1xuXG5cdFx0XHRyZXR1cm4gX2FkZCggdGhpcywgb2JqZWN0LCBwcm9wZXJ0eSwge1xuXHRcdFx0XHRmYWN0b3J5QXJnczogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMiApXG5cdFx0XHR9ICk7XG5cblx0XHR9LFxuXHRcdGFkZENvbG9yOiBmdW5jdGlvbiBhZGRDb2xvciggb2JqZWN0LCBwcm9wZXJ0eSApIHtcblxuXHRcdFx0cmV0dXJuIF9hZGQoIHRoaXMsIG9iamVjdCwgcHJvcGVydHksIHtcblx0XHRcdFx0Y29sb3I6IHRydWVcblx0XHRcdH0gKTtcblxuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoIGNvbnRyb2xsZXIgKSB7XG5cblx0XHRcdHRoaXMuX191bC5yZW1vdmVDaGlsZCggY29udHJvbGxlci5fX2xpICk7XG5cdFx0XHR0aGlzLl9fY29udHJvbGxlcnMuc3BsaWNlKCB0aGlzLl9fY29udHJvbGxlcnMuaW5kZXhPZiggY29udHJvbGxlciApLCAxICk7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0Q29tbW9uLmRlZmVyKCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0X3RoaXMub25SZXNpemUoKTtcblxuXHRcdFx0fSApO1xuXG5cdFx0fSxcblx0XHRkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuXG5cdFx0XHRpZiAoIHRoaXMucGFyZW50ICkge1xuXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ09ubHkgdGhlIHJvb3QgR1VJIHNob3VsZCBiZSByZW1vdmVkIHdpdGggLmRlc3Ryb3koKS4gJyArICdGb3Igc3ViZm9sZGVycywgdXNlIGd1aS5yZW1vdmVGb2xkZXIoZm9sZGVyKSBpbnN0ZWFkLicgKTtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKCB0aGlzLmF1dG9QbGFjZSApIHtcblxuXHRcdFx0XHRhdXRvUGxhY2VDb250YWluZXIucmVtb3ZlQ2hpbGQoIHRoaXMuZG9tRWxlbWVudCApO1xuXG5cdFx0XHR9XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0Q29tbW9uLmVhY2goIHRoaXMuX19mb2xkZXJzLCBmdW5jdGlvbiAoIHN1YmZvbGRlciApIHtcblxuXHRcdFx0XHRfdGhpcy5yZW1vdmVGb2xkZXIoIHN1YmZvbGRlciApO1xuXG5cdFx0XHR9ICk7XG5cdFx0XHRkb20udW5iaW5kKCB3aW5kb3csICdrZXlkb3duJywgR1VJLl9rZXlkb3duSGFuZGxlciwgZmFsc2UgKTtcblx0XHRcdHJlbW92ZUxpc3RlbmVycyggdGhpcyApO1xuXG5cdFx0fSxcblx0XHRhZGRGb2xkZXI6IGZ1bmN0aW9uIGFkZEZvbGRlciggbmFtZSApIHtcblxuXHRcdFx0aWYgKCB0aGlzLl9fZm9sZGVyc1sgbmFtZSBdICE9PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCAnWW91IGFscmVhZHkgaGF2ZSBhIGZvbGRlciBpbiB0aGlzIEdVSSBieSB0aGUnICsgJyBuYW1lIFwiJyArIG5hbWUgKyAnXCInICk7XG5cblx0XHRcdH1cblx0XHRcdHZhciBuZXdHdWlQYXJhbXMgPSB7IG5hbWU6IG5hbWUsIHBhcmVudDogdGhpcyB9O1xuXHRcdFx0bmV3R3VpUGFyYW1zLmF1dG9QbGFjZSA9IHRoaXMuYXV0b1BsYWNlO1xuXHRcdFx0aWYgKCB0aGlzLmxvYWQgJiZcbiAgICB0aGlzLmxvYWQuZm9sZGVycyAmJlxuICAgIHRoaXMubG9hZC5mb2xkZXJzWyBuYW1lIF0gKSB7XG5cblx0XHRcdFx0bmV3R3VpUGFyYW1zLmNsb3NlZCA9IHRoaXMubG9hZC5mb2xkZXJzWyBuYW1lIF0uY2xvc2VkO1xuXHRcdFx0XHRuZXdHdWlQYXJhbXMubG9hZCA9IHRoaXMubG9hZC5mb2xkZXJzWyBuYW1lIF07XG5cblx0XHRcdH1cblx0XHRcdHZhciBndWkgPSBuZXcgR1VJKCBuZXdHdWlQYXJhbXMgKTtcblx0XHRcdHRoaXMuX19mb2xkZXJzWyBuYW1lIF0gPSBndWk7XG5cdFx0XHR2YXIgbGkgPSBhZGRSb3coIHRoaXMsIGd1aS5kb21FbGVtZW50ICk7XG5cdFx0XHRkb20uYWRkQ2xhc3MoIGxpLCAnZm9sZGVyJyApO1xuXHRcdFx0cmV0dXJuIGd1aTtcblxuXHRcdH0sXG5cdFx0cmVtb3ZlRm9sZGVyOiBmdW5jdGlvbiByZW1vdmVGb2xkZXIoIGZvbGRlciApIHtcblxuXHRcdFx0dGhpcy5fX3VsLnJlbW92ZUNoaWxkKCBmb2xkZXIuZG9tRWxlbWVudC5wYXJlbnRFbGVtZW50ICk7XG5cdFx0XHRkZWxldGUgdGhpcy5fX2ZvbGRlcnNbIGZvbGRlci5uYW1lIF07XG5cdFx0XHRpZiAoIHRoaXMubG9hZCAmJlxuICAgIHRoaXMubG9hZC5mb2xkZXJzICYmXG4gICAgdGhpcy5sb2FkLmZvbGRlcnNbIGZvbGRlci5uYW1lIF0gKSB7XG5cblx0XHRcdFx0ZGVsZXRlIHRoaXMubG9hZC5mb2xkZXJzWyBmb2xkZXIubmFtZSBdO1xuXG5cdFx0XHR9XG5cdFx0XHRyZW1vdmVMaXN0ZW5lcnMoIGZvbGRlciApO1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdENvbW1vbi5lYWNoKCBmb2xkZXIuX19mb2xkZXJzLCBmdW5jdGlvbiAoIHN1YmZvbGRlciApIHtcblxuXHRcdFx0XHRmb2xkZXIucmVtb3ZlRm9sZGVyKCBzdWJmb2xkZXIgKTtcblxuXHRcdFx0fSApO1xuXHRcdFx0Q29tbW9uLmRlZmVyKCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0X3RoaXMub25SZXNpemUoKTtcblxuXHRcdFx0fSApO1xuXG5cdFx0fSxcblx0XHRvcGVuOiBmdW5jdGlvbiBvcGVuKCkge1xuXG5cdFx0XHR0aGlzLmNsb3NlZCA9IGZhbHNlO1xuXG5cdFx0fSxcblx0XHRjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG5cblx0XHRcdHRoaXMuY2xvc2VkID0gdHJ1ZTtcblxuXHRcdH0sXG5cdFx0aGlkZTogZnVuY3Rpb24gaGlkZSgpIHtcblxuXHRcdFx0dGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHR9LFxuXHRcdHNob3c6IGZ1bmN0aW9uIHNob3coKSB7XG5cblx0XHRcdHRoaXMuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG5cblx0XHR9LFxuXHRcdG9uUmVzaXplOiBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcblxuXHRcdFx0dmFyIHJvb3QgPSB0aGlzLmdldFJvb3QoKTtcblx0XHRcdGlmICggcm9vdC5zY3JvbGxhYmxlICkge1xuXG5cdFx0XHRcdHZhciB0b3AgPSBkb20uZ2V0T2Zmc2V0KCByb290Ll9fdWwgKS50b3A7XG5cdFx0XHRcdHZhciBoID0gMDtcblx0XHRcdFx0Q29tbW9uLmVhY2goIHJvb3QuX191bC5jaGlsZE5vZGVzLCBmdW5jdGlvbiAoIG5vZGUgKSB7XG5cblx0XHRcdFx0XHRpZiAoICEgKCByb290LmF1dG9QbGFjZSAmJiBub2RlID09PSByb290Ll9fc2F2ZV9yb3cgKSApIHtcblxuXHRcdFx0XHRcdFx0aCArPSBkb20uZ2V0SGVpZ2h0KCBub2RlICk7XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSApO1xuXHRcdFx0XHRpZiAoIHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcCAtIENMT1NFX0JVVFRPTl9IRUlHSFQgPCBoICkge1xuXG5cdFx0XHRcdFx0ZG9tLmFkZENsYXNzKCByb290LmRvbUVsZW1lbnQsIEdVSS5DTEFTU19UT09fVEFMTCApO1xuXHRcdFx0XHRcdHJvb3QuX191bC5zdHlsZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0b3AgLSBDTE9TRV9CVVRUT05fSEVJR0hUICsgJ3B4JztcblxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0ZG9tLnJlbW92ZUNsYXNzKCByb290LmRvbUVsZW1lbnQsIEdVSS5DTEFTU19UT09fVEFMTCApO1xuXHRcdFx0XHRcdHJvb3QuX191bC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHRpZiAoIHJvb3QuX19yZXNpemVfaGFuZGxlICkge1xuXG5cdFx0XHRcdENvbW1vbi5kZWZlciggZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0cm9vdC5fX3Jlc2l6ZV9oYW5kbGUuc3R5bGUuaGVpZ2h0ID0gcm9vdC5fX3VsLm9mZnNldEhlaWdodCArICdweCc7XG5cblx0XHRcdFx0fSApO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAoIHJvb3QuX19jbG9zZUJ1dHRvbiApIHtcblxuXHRcdFx0XHRyb290Ll9fY2xvc2VCdXR0b24uc3R5bGUud2lkdGggPSByb290LndpZHRoICsgJ3B4JztcblxuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHRvblJlc2l6ZURlYm91bmNlZDogQ29tbW9uLmRlYm91bmNlKCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdHRoaXMub25SZXNpemUoKTtcblxuXHRcdH0sIDUwICksXG5cdFx0cmVtZW1iZXI6IGZ1bmN0aW9uIHJlbWVtYmVyKCkge1xuXG5cdFx0XHRpZiAoIENvbW1vbi5pc1VuZGVmaW5lZCggU0FWRV9ESUFMT0dVRSApICkge1xuXG5cdFx0XHRcdFNBVkVfRElBTE9HVUUgPSBuZXcgQ2VudGVyZWREaXYoKTtcblx0XHRcdFx0U0FWRV9ESUFMT0dVRS5kb21FbGVtZW50LmlubmVySFRNTCA9IHNhdmVEaWFsb2dDb250ZW50cztcblxuXHRcdFx0fVxuXHRcdFx0aWYgKCB0aGlzLnBhcmVudCApIHtcblxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoICdZb3UgY2FuIG9ubHkgY2FsbCByZW1lbWJlciBvbiBhIHRvcCBsZXZlbCBHVUkuJyApO1xuXG5cdFx0XHR9XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFx0Q29tbW9uLmVhY2goIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSwgZnVuY3Rpb24gKCBvYmplY3QgKSB7XG5cblx0XHRcdFx0aWYgKCBfdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzLmxlbmd0aCA9PT0gMCApIHtcblxuXHRcdFx0XHRcdGFkZFNhdmVNZW51KCBfdGhpcyApO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCBfdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzLmluZGV4T2YoIG9iamVjdCApID09PSAtIDEgKSB7XG5cblx0XHRcdFx0XHRfdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzLnB1c2goIG9iamVjdCApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSApO1xuXHRcdFx0aWYgKCB0aGlzLmF1dG9QbGFjZSApIHtcblxuXHRcdFx0XHRzZXRXaWR0aCggdGhpcywgdGhpcy53aWR0aCApO1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXHRcdGdldFJvb3Q6IGZ1bmN0aW9uIGdldFJvb3QoKSB7XG5cblx0XHRcdHZhciBndWkgPSB0aGlzO1xuXHRcdFx0d2hpbGUgKCBndWkucGFyZW50ICkge1xuXG5cdFx0XHRcdGd1aSA9IGd1aS5wYXJlbnQ7XG5cblx0XHRcdH1cblx0XHRcdHJldHVybiBndWk7XG5cblx0XHR9LFxuXHRcdGdldFNhdmVPYmplY3Q6IGZ1bmN0aW9uIGdldFNhdmVPYmplY3QoKSB7XG5cblx0XHRcdHZhciB0b1JldHVybiA9IHRoaXMubG9hZDtcblx0XHRcdHRvUmV0dXJuLmNsb3NlZCA9IHRoaXMuY2xvc2VkO1xuXHRcdFx0aWYgKCB0aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMubGVuZ3RoID4gMCApIHtcblxuXHRcdFx0XHR0b1JldHVybi5wcmVzZXQgPSB0aGlzLnByZXNldDtcblx0XHRcdFx0aWYgKCAhIHRvUmV0dXJuLnJlbWVtYmVyZWQgKSB7XG5cblx0XHRcdFx0XHR0b1JldHVybi5yZW1lbWJlcmVkID0ge307XG5cblx0XHRcdFx0fVxuXHRcdFx0XHR0b1JldHVybi5yZW1lbWJlcmVkWyB0aGlzLnByZXNldCBdID0gZ2V0Q3VycmVudFByZXNldCggdGhpcyApO1xuXG5cdFx0XHR9XG5cdFx0XHR0b1JldHVybi5mb2xkZXJzID0ge307XG5cdFx0XHRDb21tb24uZWFjaCggdGhpcy5fX2ZvbGRlcnMsIGZ1bmN0aW9uICggZWxlbWVudCwga2V5ICkge1xuXG5cdFx0XHRcdHRvUmV0dXJuLmZvbGRlcnNbIGtleSBdID0gZWxlbWVudC5nZXRTYXZlT2JqZWN0KCk7XG5cblx0XHRcdH0gKTtcblx0XHRcdHJldHVybiB0b1JldHVybjtcblxuXHRcdH0sXG5cdFx0c2F2ZTogZnVuY3Rpb24gc2F2ZSgpIHtcblxuXHRcdFx0aWYgKCAhIHRoaXMubG9hZC5yZW1lbWJlcmVkICkge1xuXG5cdFx0XHRcdHRoaXMubG9hZC5yZW1lbWJlcmVkID0ge307XG5cblx0XHRcdH1cblx0XHRcdHRoaXMubG9hZC5yZW1lbWJlcmVkWyB0aGlzLnByZXNldCBdID0gZ2V0Q3VycmVudFByZXNldCggdGhpcyApO1xuXHRcdFx0bWFya1ByZXNldE1vZGlmaWVkKCB0aGlzLCBmYWxzZSApO1xuXHRcdFx0dGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2VJZlBvc3NpYmxlKCk7XG5cblx0XHR9LFxuXHRcdHNhdmVBczogZnVuY3Rpb24gc2F2ZUFzKCBwcmVzZXROYW1lICkge1xuXG5cdFx0XHRpZiAoICEgdGhpcy5sb2FkLnJlbWVtYmVyZWQgKSB7XG5cblx0XHRcdFx0dGhpcy5sb2FkLnJlbWVtYmVyZWQgPSB7fTtcblx0XHRcdFx0dGhpcy5sb2FkLnJlbWVtYmVyZWRbIERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSBdID0gZ2V0Q3VycmVudFByZXNldCggdGhpcywgdHJ1ZSApO1xuXG5cdFx0XHR9XG5cdFx0XHR0aGlzLmxvYWQucmVtZW1iZXJlZFsgcHJlc2V0TmFtZSBdID0gZ2V0Q3VycmVudFByZXNldCggdGhpcyApO1xuXHRcdFx0dGhpcy5wcmVzZXQgPSBwcmVzZXROYW1lO1xuXHRcdFx0YWRkUHJlc2V0T3B0aW9uKCB0aGlzLCBwcmVzZXROYW1lLCB0cnVlICk7XG5cdFx0XHR0aGlzLnNhdmVUb0xvY2FsU3RvcmFnZUlmUG9zc2libGUoKTtcblxuXHRcdH0sXG5cdFx0cmV2ZXJ0OiBmdW5jdGlvbiByZXZlcnQoIGd1aSApIHtcblxuXHRcdFx0Q29tbW9uLmVhY2goIHRoaXMuX19jb250cm9sbGVycywgZnVuY3Rpb24gKCBjb250cm9sbGVyICkge1xuXG5cdFx0XHRcdGlmICggISB0aGlzLmdldFJvb3QoKS5sb2FkLnJlbWVtYmVyZWQgKSB7XG5cblx0XHRcdFx0XHRjb250cm9sbGVyLnNldFZhbHVlKCBjb250cm9sbGVyLmluaXRpYWxWYWx1ZSApO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRyZWNhbGxTYXZlZFZhbHVlKCBndWkgfHwgdGhpcy5nZXRSb290KCksIGNvbnRyb2xsZXIgKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggY29udHJvbGxlci5fX29uRmluaXNoQ2hhbmdlICkge1xuXG5cdFx0XHRcdFx0Y29udHJvbGxlci5fX29uRmluaXNoQ2hhbmdlLmNhbGwoIGNvbnRyb2xsZXIsIGNvbnRyb2xsZXIuZ2V0VmFsdWUoKSApO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSwgdGhpcyApO1xuXHRcdFx0Q29tbW9uLmVhY2goIHRoaXMuX19mb2xkZXJzLCBmdW5jdGlvbiAoIGZvbGRlciApIHtcblxuXHRcdFx0XHRmb2xkZXIucmV2ZXJ0KCBmb2xkZXIgKTtcblxuXHRcdFx0fSApO1xuXHRcdFx0aWYgKCAhIGd1aSApIHtcblxuXHRcdFx0XHRtYXJrUHJlc2V0TW9kaWZpZWQoIHRoaXMuZ2V0Um9vdCgpLCBmYWxzZSApO1xuXG5cdFx0XHR9XG5cblx0XHR9LFxuXHRcdGxpc3RlbjogZnVuY3Rpb24gbGlzdGVuKCBjb250cm9sbGVyICkge1xuXG5cdFx0XHR2YXIgaW5pdCA9IHRoaXMuX19saXN0ZW5pbmcubGVuZ3RoID09PSAwO1xuXHRcdFx0dGhpcy5fX2xpc3RlbmluZy5wdXNoKCBjb250cm9sbGVyICk7XG5cdFx0XHRpZiAoIGluaXQgKSB7XG5cblx0XHRcdFx0dXBkYXRlRGlzcGxheXMoIHRoaXMuX19saXN0ZW5pbmcgKTtcblxuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHR1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuXG5cdFx0XHRDb21tb24uZWFjaCggdGhpcy5fX2NvbnRyb2xsZXJzLCBmdW5jdGlvbiAoIGNvbnRyb2xsZXIgKSB7XG5cblx0XHRcdFx0Y29udHJvbGxlci51cGRhdGVEaXNwbGF5KCk7XG5cblx0XHRcdH0gKTtcblx0XHRcdENvbW1vbi5lYWNoKCB0aGlzLl9fZm9sZGVycywgZnVuY3Rpb24gKCBmb2xkZXIgKSB7XG5cblx0XHRcdFx0Zm9sZGVyLnVwZGF0ZURpc3BsYXkoKTtcblxuXHRcdFx0fSApO1xuXG5cdFx0fVxuXHR9ICk7XG5mdW5jdGlvbiBhZGRSb3coIGd1aSwgbmV3RG9tLCBsaUJlZm9yZSApIHtcblxuXHR2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnbGknICk7XG5cdGlmICggbmV3RG9tICkge1xuXG5cdFx0bGkuYXBwZW5kQ2hpbGQoIG5ld0RvbSApO1xuXG5cdH1cblx0aWYgKCBsaUJlZm9yZSApIHtcblxuXHRcdGd1aS5fX3VsLmluc2VydEJlZm9yZSggbGksIGxpQmVmb3JlICk7XG5cblx0fSBlbHNlIHtcblxuXHRcdGd1aS5fX3VsLmFwcGVuZENoaWxkKCBsaSApO1xuXG5cdH1cblx0Z3VpLm9uUmVzaXplKCk7XG5cdHJldHVybiBsaTtcblxufVxuZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCBndWkgKSB7XG5cblx0ZG9tLnVuYmluZCggd2luZG93LCAncmVzaXplJywgZ3VpLl9fcmVzaXplSGFuZGxlciApO1xuXHRpZiAoIGd1aS5zYXZlVG9Mb2NhbFN0b3JhZ2VJZlBvc3NpYmxlICkge1xuXG5cdFx0ZG9tLnVuYmluZCggd2luZG93LCAndW5sb2FkJywgZ3VpLnNhdmVUb0xvY2FsU3RvcmFnZUlmUG9zc2libGUgKTtcblxuXHR9XG5cbn1cbmZ1bmN0aW9uIG1hcmtQcmVzZXRNb2RpZmllZCggZ3VpLCBtb2RpZmllZCApIHtcblxuXHR2YXIgb3B0ID0gZ3VpLl9fcHJlc2V0X3NlbGVjdFsgZ3VpLl9fcHJlc2V0X3NlbGVjdC5zZWxlY3RlZEluZGV4IF07XG5cdGlmICggbW9kaWZpZWQgKSB7XG5cblx0XHRvcHQuaW5uZXJIVE1MID0gb3B0LnZhbHVlICsgJyonO1xuXG5cdH0gZWxzZSB7XG5cblx0XHRvcHQuaW5uZXJIVE1MID0gb3B0LnZhbHVlO1xuXG5cdH1cblxufVxuZnVuY3Rpb24gYXVnbWVudENvbnRyb2xsZXIoIGd1aSwgbGksIGNvbnRyb2xsZXIgKSB7XG5cblx0Y29udHJvbGxlci5fX2xpID0gbGk7XG5cdGNvbnRyb2xsZXIuX19ndWkgPSBndWk7XG5cdENvbW1vbi5leHRlbmQoIGNvbnRyb2xsZXIsIHtcblx0XHRvcHRpb25zOiBmdW5jdGlvbiBvcHRpb25zKCBfb3B0aW9ucyApIHtcblxuXHRcdFx0aWYgKCBhcmd1bWVudHMubGVuZ3RoID4gMSApIHtcblxuXHRcdFx0XHR2YXIgbmV4dFNpYmxpbmcgPSBjb250cm9sbGVyLl9fbGkubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRjb250cm9sbGVyLnJlbW92ZSgpO1xuXHRcdFx0XHRyZXR1cm4gX2FkZCggZ3VpLCBjb250cm9sbGVyLm9iamVjdCwgY29udHJvbGxlci5wcm9wZXJ0eSwge1xuXHRcdFx0XHRcdGJlZm9yZTogbmV4dFNpYmxpbmcsXG5cdFx0XHRcdFx0ZmFjdG9yeUFyZ3M6IFsgQ29tbW9uLnRvQXJyYXkoIGFyZ3VtZW50cyApIF1cblx0XHRcdFx0fSApO1xuXG5cdFx0XHR9XG5cdFx0XHRpZiAoIENvbW1vbi5pc0FycmF5KCBfb3B0aW9ucyApIHx8IENvbW1vbi5pc09iamVjdCggX29wdGlvbnMgKSApIHtcblxuXHRcdFx0XHR2YXIgX25leHRTaWJsaW5nID0gY29udHJvbGxlci5fX2xpLm5leHRFbGVtZW50U2libGluZztcblx0XHRcdFx0Y29udHJvbGxlci5yZW1vdmUoKTtcblx0XHRcdFx0cmV0dXJuIF9hZGQoIGd1aSwgY29udHJvbGxlci5vYmplY3QsIGNvbnRyb2xsZXIucHJvcGVydHksIHtcblx0XHRcdFx0XHRiZWZvcmU6IF9uZXh0U2libGluZyxcblx0XHRcdFx0XHRmYWN0b3J5QXJnczogWyBfb3B0aW9ucyBdXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHRuYW1lOiBmdW5jdGlvbiBuYW1lKCBfbmFtZSApIHtcblxuXHRcdFx0Y29udHJvbGxlci5fX2xpLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IF9uYW1lO1xuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cblx0XHR9LFxuXHRcdGxpc3RlbjogZnVuY3Rpb24gbGlzdGVuKCkge1xuXG5cdFx0XHRjb250cm9sbGVyLl9fZ3VpLmxpc3RlbiggY29udHJvbGxlciApO1xuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cblx0XHR9LFxuXHRcdHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuXG5cdFx0XHRjb250cm9sbGVyLl9fZ3VpLnJlbW92ZSggY29udHJvbGxlciApO1xuXHRcdFx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cblx0XHR9XG5cdH0gKTtcblx0aWYgKCBjb250cm9sbGVyIGluc3RhbmNlb2YgTnVtYmVyQ29udHJvbGxlclNsaWRlciApIHtcblxuXHRcdHZhciBib3ggPSBuZXcgTnVtYmVyQ29udHJvbGxlckJveCggY29udHJvbGxlci5vYmplY3QsIGNvbnRyb2xsZXIucHJvcGVydHksIHsgbWluOiBjb250cm9sbGVyLl9fbWluLCBtYXg6IGNvbnRyb2xsZXIuX19tYXgsIHN0ZXA6IGNvbnRyb2xsZXIuX19zdGVwIH0gKTtcblx0XHRDb21tb24uZWFjaCggWyAndXBkYXRlRGlzcGxheScsICdvbkNoYW5nZScsICdvbkZpbmlzaENoYW5nZScsICdzdGVwJywgJ21pbicsICdtYXgnIF0sIGZ1bmN0aW9uICggbWV0aG9kICkge1xuXG5cdFx0XHR2YXIgcGMgPSBjb250cm9sbGVyWyBtZXRob2QgXTtcblx0XHRcdHZhciBwYiA9IGJveFsgbWV0aG9kIF07XG5cdFx0XHRjb250cm9sbGVyWyBtZXRob2QgXSA9IGJveFsgbWV0aG9kIF0gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICk7XG5cdFx0XHRcdHBiLmFwcGx5KCBib3gsIGFyZ3MgKTtcblx0XHRcdFx0cmV0dXJuIHBjLmFwcGx5KCBjb250cm9sbGVyLCBhcmdzICk7XG5cblx0XHRcdH07XG5cblx0XHR9ICk7XG5cdFx0ZG9tLmFkZENsYXNzKCBsaSwgJ2hhcy1zbGlkZXInICk7XG5cdFx0Y29udHJvbGxlci5kb21FbGVtZW50Lmluc2VydEJlZm9yZSggYm94LmRvbUVsZW1lbnQsIGNvbnRyb2xsZXIuZG9tRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCApO1xuXG5cdH0gZWxzZSBpZiAoIGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBOdW1iZXJDb250cm9sbGVyQm94ICkge1xuXG5cdFx0dmFyIHIgPSBmdW5jdGlvbiByKCByZXR1cm5lZCApIHtcblxuXHRcdFx0aWYgKCBDb21tb24uaXNOdW1iZXIoIGNvbnRyb2xsZXIuX19taW4gKSAmJiBDb21tb24uaXNOdW1iZXIoIGNvbnRyb2xsZXIuX19tYXggKSApIHtcblxuXHRcdFx0XHR2YXIgb2xkTmFtZSA9IGNvbnRyb2xsZXIuX19saS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUw7XG5cdFx0XHRcdHZhciB3YXNMaXN0ZW5pbmcgPSBjb250cm9sbGVyLl9fZ3VpLl9fbGlzdGVuaW5nLmluZGV4T2YoIGNvbnRyb2xsZXIgKSA+IC0gMTtcblx0XHRcdFx0Y29udHJvbGxlci5yZW1vdmUoKTtcblx0XHRcdFx0dmFyIG5ld0NvbnRyb2xsZXIgPSBfYWRkKCBndWksIGNvbnRyb2xsZXIub2JqZWN0LCBjb250cm9sbGVyLnByb3BlcnR5LCB7XG5cdFx0XHRcdFx0YmVmb3JlOiBjb250cm9sbGVyLl9fbGkubmV4dEVsZW1lbnRTaWJsaW5nLFxuXHRcdFx0XHRcdGZhY3RvcnlBcmdzOiBbIGNvbnRyb2xsZXIuX19taW4sIGNvbnRyb2xsZXIuX19tYXgsIGNvbnRyb2xsZXIuX19zdGVwIF1cblx0XHRcdFx0fSApO1xuXHRcdFx0XHRuZXdDb250cm9sbGVyLm5hbWUoIG9sZE5hbWUgKTtcblx0XHRcdFx0aWYgKCB3YXNMaXN0ZW5pbmcgKSBuZXdDb250cm9sbGVyLmxpc3RlbigpO1xuXHRcdFx0XHRyZXR1cm4gbmV3Q29udHJvbGxlcjtcblxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJldHVybmVkO1xuXG5cdFx0fTtcblx0XHRjb250cm9sbGVyLm1pbiA9IENvbW1vbi5jb21wb3NlKCByLCBjb250cm9sbGVyLm1pbiApO1xuXHRcdGNvbnRyb2xsZXIubWF4ID0gQ29tbW9uLmNvbXBvc2UoIHIsIGNvbnRyb2xsZXIubWF4ICk7XG5cblx0fSBlbHNlIGlmICggY29udHJvbGxlciBpbnN0YW5jZW9mIEJvb2xlYW5Db250cm9sbGVyICkge1xuXG5cdFx0ZG9tLmJpbmQoIGxpLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGRvbS5mYWtlRXZlbnQoIGNvbnRyb2xsZXIuX19jaGVja2JveCwgJ2NsaWNrJyApO1xuXG5cdFx0fSApO1xuXHRcdGRvbS5iaW5kKCBjb250cm9sbGVyLl9fY2hlY2tib3gsICdjbGljaycsIGZ1bmN0aW9uICggZSApIHtcblxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdH0gKTtcblxuXHR9IGVsc2UgaWYgKCBjb250cm9sbGVyIGluc3RhbmNlb2YgRnVuY3Rpb25Db250cm9sbGVyICkge1xuXG5cdFx0ZG9tLmJpbmQoIGxpLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGRvbS5mYWtlRXZlbnQoIGNvbnRyb2xsZXIuX19idXR0b24sICdjbGljaycgKTtcblxuXHRcdH0gKTtcblx0XHRkb20uYmluZCggbGksICdtb3VzZW92ZXInLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdGRvbS5hZGRDbGFzcyggY29udHJvbGxlci5fX2J1dHRvbiwgJ2hvdmVyJyApO1xuXG5cdFx0fSApO1xuXHRcdGRvbS5iaW5kKCBsaSwgJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRkb20ucmVtb3ZlQ2xhc3MoIGNvbnRyb2xsZXIuX19idXR0b24sICdob3ZlcicgKTtcblxuXHRcdH0gKTtcblxuXHR9IGVsc2UgaWYgKCBjb250cm9sbGVyIGluc3RhbmNlb2YgQ29sb3JDb250cm9sbGVyICkge1xuXG5cdFx0ZG9tLmFkZENsYXNzKCBsaSwgJ2NvbG9yJyApO1xuXHRcdGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSA9IENvbW1vbi5jb21wb3NlKCBmdW5jdGlvbiAoIHZhbCApIHtcblxuXHRcdFx0bGkuc3R5bGUuYm9yZGVyTGVmdENvbG9yID0gY29udHJvbGxlci5fX2NvbG9yLnRvU3RyaW5nKCk7XG5cdFx0XHRyZXR1cm4gdmFsO1xuXG5cdFx0fSwgY29udHJvbGxlci51cGRhdGVEaXNwbGF5ICk7XG5cdFx0Y29udHJvbGxlci51cGRhdGVEaXNwbGF5KCk7XG5cblx0fVxuXHRjb250cm9sbGVyLnNldFZhbHVlID0gQ29tbW9uLmNvbXBvc2UoIGZ1bmN0aW9uICggdmFsICkge1xuXG5cdFx0aWYgKCBndWkuZ2V0Um9vdCgpLl9fcHJlc2V0X3NlbGVjdCAmJiBjb250cm9sbGVyLmlzTW9kaWZpZWQoKSApIHtcblxuXHRcdFx0bWFya1ByZXNldE1vZGlmaWVkKCBndWkuZ2V0Um9vdCgpLCB0cnVlICk7XG5cblx0XHR9XG5cdFx0cmV0dXJuIHZhbDtcblxuXHR9LCBjb250cm9sbGVyLnNldFZhbHVlICk7XG5cbn1cbmZ1bmN0aW9uIHJlY2FsbFNhdmVkVmFsdWUoIGd1aSwgY29udHJvbGxlciApIHtcblxuXHR2YXIgcm9vdCA9IGd1aS5nZXRSb290KCk7XG5cdHZhciBtYXRjaGVkSW5kZXggPSByb290Ll9fcmVtZW1iZXJlZE9iamVjdHMuaW5kZXhPZiggY29udHJvbGxlci5vYmplY3QgKTtcblx0aWYgKCBtYXRjaGVkSW5kZXggIT09IC0gMSApIHtcblxuXHRcdHZhciBjb250cm9sbGVyTWFwID0gcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1sgbWF0Y2hlZEluZGV4IF07XG5cdFx0aWYgKCBjb250cm9sbGVyTWFwID09PSB1bmRlZmluZWQgKSB7XG5cblx0XHRcdGNvbnRyb2xsZXJNYXAgPSB7fTtcblx0XHRcdHJvb3QuX19yZW1lbWJlcmVkT2JqZWN0SW5kZWNlc1RvQ29udHJvbGxlcnNbIG1hdGNoZWRJbmRleCBdID0gY29udHJvbGxlck1hcDtcblxuXHRcdH1cblx0XHRjb250cm9sbGVyTWFwWyBjb250cm9sbGVyLnByb3BlcnR5IF0gPSBjb250cm9sbGVyO1xuXHRcdGlmICggcm9vdC5sb2FkICYmIHJvb3QubG9hZC5yZW1lbWJlcmVkICkge1xuXG5cdFx0XHR2YXIgcHJlc2V0TWFwID0gcm9vdC5sb2FkLnJlbWVtYmVyZWQ7XG5cdFx0XHR2YXIgcHJlc2V0ID0gdm9pZCAwO1xuXHRcdFx0aWYgKCBwcmVzZXRNYXBbIGd1aS5wcmVzZXQgXSApIHtcblxuXHRcdFx0XHRwcmVzZXQgPSBwcmVzZXRNYXBbIGd1aS5wcmVzZXQgXTtcblxuXHRcdFx0fSBlbHNlIGlmICggcHJlc2V0TWFwWyBERUZBVUxUX0RFRkFVTFRfUFJFU0VUX05BTUUgXSApIHtcblxuXHRcdFx0XHRwcmVzZXQgPSBwcmVzZXRNYXBbIERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSBdO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0fVxuXHRcdFx0aWYgKCBwcmVzZXRbIG1hdGNoZWRJbmRleCBdICYmIHByZXNldFsgbWF0Y2hlZEluZGV4IF1bIGNvbnRyb2xsZXIucHJvcGVydHkgXSAhPT0gdW5kZWZpbmVkICkge1xuXG5cdFx0XHRcdHZhciB2YWx1ZSA9IHByZXNldFsgbWF0Y2hlZEluZGV4IF1bIGNvbnRyb2xsZXIucHJvcGVydHkgXTtcblx0XHRcdFx0Y29udHJvbGxlci5pbml0aWFsVmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0Y29udHJvbGxlci5zZXRWYWx1ZSggdmFsdWUgKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxufVxuZnVuY3Rpb24gX2FkZCggZ3VpLCBvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMgKSB7XG5cblx0aWYgKCBvYmplY3RbIHByb3BlcnR5IF0gPT09IHVuZGVmaW5lZCApIHtcblxuXHRcdHRocm93IG5ldyBFcnJvciggJ09iamVjdCBcIicgKyBvYmplY3QgKyAnXCIgaGFzIG5vIHByb3BlcnR5IFwiJyArIHByb3BlcnR5ICsgJ1wiJyApO1xuXG5cdH1cblx0dmFyIGNvbnRyb2xsZXIgPSB2b2lkIDA7XG5cdGlmICggcGFyYW1zLmNvbG9yICkge1xuXG5cdFx0Y29udHJvbGxlciA9IG5ldyBDb2xvckNvbnRyb2xsZXIoIG9iamVjdCwgcHJvcGVydHkgKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0dmFyIGZhY3RvcnlBcmdzID0gWyBvYmplY3QsIHByb3BlcnR5IF0uY29uY2F0KCBwYXJhbXMuZmFjdG9yeUFyZ3MgKTtcblx0XHRjb250cm9sbGVyID0gQ29udHJvbGxlckZhY3RvcnkuYXBwbHkoIGd1aSwgZmFjdG9yeUFyZ3MgKTtcblxuXHR9XG5cdGlmICggcGFyYW1zLmJlZm9yZSBpbnN0YW5jZW9mIENvbnRyb2xsZXIgKSB7XG5cblx0XHRwYXJhbXMuYmVmb3JlID0gcGFyYW1zLmJlZm9yZS5fX2xpO1xuXG5cdH1cblx0cmVjYWxsU2F2ZWRWYWx1ZSggZ3VpLCBjb250cm9sbGVyICk7XG5cdGRvbS5hZGRDbGFzcyggY29udHJvbGxlci5kb21FbGVtZW50LCAnYycgKTtcblx0dmFyIG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcblx0ZG9tLmFkZENsYXNzKCBuYW1lLCAncHJvcGVydHktbmFtZScgKTtcblx0bmFtZS5pbm5lckhUTUwgPSBjb250cm9sbGVyLnByb3BlcnR5O1xuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCBuYW1lICk7XG5cdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggY29udHJvbGxlci5kb21FbGVtZW50ICk7XG5cdHZhciBsaSA9IGFkZFJvdyggZ3VpLCBjb250YWluZXIsIHBhcmFtcy5iZWZvcmUgKTtcblx0ZG9tLmFkZENsYXNzKCBsaSwgR1VJLkNMQVNTX0NPTlRST0xMRVJfUk9XICk7XG5cdGlmICggY29udHJvbGxlciBpbnN0YW5jZW9mIENvbG9yQ29udHJvbGxlciApIHtcblxuXHRcdGRvbS5hZGRDbGFzcyggbGksICdjb2xvcicgKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0ZG9tLmFkZENsYXNzKCBsaSwgX3R5cGVvZiggY29udHJvbGxlci5nZXRWYWx1ZSgpICkgKTtcblxuXHR9XG5cdGF1Z21lbnRDb250cm9sbGVyKCBndWksIGxpLCBjb250cm9sbGVyICk7XG5cdGd1aS5fX2NvbnRyb2xsZXJzLnB1c2goIGNvbnRyb2xsZXIgKTtcblx0cmV0dXJuIGNvbnRyb2xsZXI7XG5cbn1cbmZ1bmN0aW9uIGdldExvY2FsU3RvcmFnZUhhc2goIGd1aSwga2V5ICkge1xuXG5cdHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmICsgJy4nICsga2V5O1xuXG59XG5mdW5jdGlvbiBhZGRQcmVzZXRPcHRpb24oIGd1aSwgbmFtZSwgc2V0U2VsZWN0ZWQgKSB7XG5cblx0dmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdvcHRpb24nICk7XG5cdG9wdC5pbm5lckhUTUwgPSBuYW1lO1xuXHRvcHQudmFsdWUgPSBuYW1lO1xuXHRndWkuX19wcmVzZXRfc2VsZWN0LmFwcGVuZENoaWxkKCBvcHQgKTtcblx0aWYgKCBzZXRTZWxlY3RlZCApIHtcblxuXHRcdGd1aS5fX3ByZXNldF9zZWxlY3Quc2VsZWN0ZWRJbmRleCA9IGd1aS5fX3ByZXNldF9zZWxlY3QubGVuZ3RoIC0gMTtcblxuXHR9XG5cbn1cbmZ1bmN0aW9uIHNob3dIaWRlRXhwbGFpbiggZ3VpLCBleHBsYWluICkge1xuXG5cdGV4cGxhaW4uc3R5bGUuZGlzcGxheSA9IGd1aS51c2VMb2NhbFN0b3JhZ2UgPyAnYmxvY2snIDogJ25vbmUnO1xuXG59XG5mdW5jdGlvbiBhZGRTYXZlTWVudSggZ3VpICkge1xuXG5cdHZhciBkaXYgPSBndWkuX19zYXZlX3JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdsaScgKTtcblx0ZG9tLmFkZENsYXNzKCBndWkuZG9tRWxlbWVudCwgJ2hhcy1zYXZlJyApO1xuXHRndWkuX191bC5pbnNlcnRCZWZvcmUoIGRpdiwgZ3VpLl9fdWwuZmlyc3RDaGlsZCApO1xuXHRkb20uYWRkQ2xhc3MoIGRpdiwgJ3NhdmUtcm93JyApO1xuXHR2YXIgZ2VhcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcblx0Z2VhcnMuaW5uZXJIVE1MID0gJyZuYnNwOyc7XG5cdGRvbS5hZGRDbGFzcyggZ2VhcnMsICdidXR0b24gZ2VhcnMnICk7XG5cdHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcblx0YnV0dG9uLmlubmVySFRNTCA9ICdTYXZlJztcblx0ZG9tLmFkZENsYXNzKCBidXR0b24sICdidXR0b24nICk7XG5cdGRvbS5hZGRDbGFzcyggYnV0dG9uLCAnc2F2ZScgKTtcblx0dmFyIGJ1dHRvbjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcblx0YnV0dG9uMi5pbm5lckhUTUwgPSAnTmV3Jztcblx0ZG9tLmFkZENsYXNzKCBidXR0b24yLCAnYnV0dG9uJyApO1xuXHRkb20uYWRkQ2xhc3MoIGJ1dHRvbjIsICdzYXZlLWFzJyApO1xuXHR2YXIgYnV0dG9uMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuXHRidXR0b24zLmlubmVySFRNTCA9ICdSZXZlcnQnO1xuXHRkb20uYWRkQ2xhc3MoIGJ1dHRvbjMsICdidXR0b24nICk7XG5cdGRvbS5hZGRDbGFzcyggYnV0dG9uMywgJ3JldmVydCcgKTtcblx0dmFyIHNlbGVjdCA9IGd1aS5fX3ByZXNldF9zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc2VsZWN0JyApO1xuXHRpZiAoIGd1aS5sb2FkICYmIGd1aS5sb2FkLnJlbWVtYmVyZWQgKSB7XG5cblx0XHRDb21tb24uZWFjaCggZ3VpLmxvYWQucmVtZW1iZXJlZCwgZnVuY3Rpb24gKCB2YWx1ZSwga2V5ICkge1xuXG5cdFx0XHRhZGRQcmVzZXRPcHRpb24oIGd1aSwga2V5LCBrZXkgPT09IGd1aS5wcmVzZXQgKTtcblxuXHRcdH0gKTtcblxuXHR9IGVsc2Uge1xuXG5cdFx0YWRkUHJlc2V0T3B0aW9uKCBndWksIERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSwgZmFsc2UgKTtcblxuXHR9XG5cdGRvbS5iaW5kKCBzZWxlY3QsICdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IGd1aS5fX3ByZXNldF9zZWxlY3QubGVuZ3RoOyBpbmRleCArKyApIHtcblxuXHRcdFx0Z3VpLl9fcHJlc2V0X3NlbGVjdFsgaW5kZXggXS5pbm5lckhUTUwgPSBndWkuX19wcmVzZXRfc2VsZWN0WyBpbmRleCBdLnZhbHVlO1xuXG5cdFx0fVxuXHRcdGd1aS5wcmVzZXQgPSB0aGlzLnZhbHVlO1xuXG5cdH0gKTtcblx0ZGl2LmFwcGVuZENoaWxkKCBzZWxlY3QgKTtcblx0ZGl2LmFwcGVuZENoaWxkKCBnZWFycyApO1xuXHRkaXYuYXBwZW5kQ2hpbGQoIGJ1dHRvbiApO1xuXHRkaXYuYXBwZW5kQ2hpbGQoIGJ1dHRvbjIgKTtcblx0ZGl2LmFwcGVuZENoaWxkKCBidXR0b24zICk7XG5cdGlmICggU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSApIHtcblxuXHRcdHZhciBleHBsYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdkZy1sb2NhbC1leHBsYWluJyApO1xuXHRcdHZhciBsb2NhbFN0b3JhZ2VDaGVja0JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnZGctbG9jYWwtc3RvcmFnZScgKTtcblx0XHR2YXIgc2F2ZUxvY2FsbHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2RnLXNhdmUtbG9jYWxseScgKTtcblx0XHRzYXZlTG9jYWxseS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRpZiAoIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCBnZXRMb2NhbFN0b3JhZ2VIYXNoKCBndWksICdpc0xvY2FsJyApICkgPT09ICd0cnVlJyApIHtcblxuXHRcdFx0bG9jYWxTdG9yYWdlQ2hlY2tCb3guc2V0QXR0cmlidXRlKCAnY2hlY2tlZCcsICdjaGVja2VkJyApO1xuXG5cdFx0fVxuXHRcdHNob3dIaWRlRXhwbGFpbiggZ3VpLCBleHBsYWluICk7XG5cdFx0ZG9tLmJpbmQoIGxvY2FsU3RvcmFnZUNoZWNrQm94LCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRndWkudXNlTG9jYWxTdG9yYWdlID0gISBndWkudXNlTG9jYWxTdG9yYWdlO1xuXHRcdFx0c2hvd0hpZGVFeHBsYWluKCBndWksIGV4cGxhaW4gKTtcblxuXHRcdH0gKTtcblxuXHR9XG5cdHZhciBuZXdDb25zdHJ1Y3RvclRleHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdkZy1uZXctY29uc3RydWN0b3InICk7XG5cdGRvbS5iaW5kKCBuZXdDb25zdHJ1Y3RvclRleHRBcmVhLCAna2V5ZG93bicsIGZ1bmN0aW9uICggZSApIHtcblxuXHRcdGlmICggZS5tZXRhS2V5ICYmICggZS53aGljaCA9PT0gNjcgfHwgZS5rZXlDb2RlID09PSA2NyApICkge1xuXG5cdFx0XHRTQVZFX0RJQUxPR1VFLmhpZGUoKTtcblxuXHRcdH1cblxuXHR9ICk7XG5cdGRvbS5iaW5kKCBnZWFycywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0bmV3Q29uc3RydWN0b3JUZXh0QXJlYS5pbm5lckhUTUwgPSBKU09OLnN0cmluZ2lmeSggZ3VpLmdldFNhdmVPYmplY3QoKSwgdW5kZWZpbmVkLCAyICk7XG5cdFx0U0FWRV9ESUFMT0dVRS5zaG93KCk7XG5cdFx0bmV3Q29uc3RydWN0b3JUZXh0QXJlYS5mb2N1cygpO1xuXHRcdG5ld0NvbnN0cnVjdG9yVGV4dEFyZWEuc2VsZWN0KCk7XG5cblx0fSApO1xuXHRkb20uYmluZCggYnV0dG9uLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRndWkuc2F2ZSgpO1xuXG5cdH0gKTtcblx0ZG9tLmJpbmQoIGJ1dHRvbjIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBwcmVzZXROYW1lID0gcHJvbXB0KCAnRW50ZXIgYSBuZXcgcHJlc2V0IG5hbWUuJyApO1xuXHRcdGlmICggcHJlc2V0TmFtZSApIHtcblxuXHRcdFx0Z3VpLnNhdmVBcyggcHJlc2V0TmFtZSApO1xuXG5cdFx0fVxuXG5cdH0gKTtcblx0ZG9tLmJpbmQoIGJ1dHRvbjMsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuXHRcdGd1aS5yZXZlcnQoKTtcblxuXHR9ICk7XG5cbn1cbmZ1bmN0aW9uIGFkZFJlc2l6ZUhhbmRsZSggZ3VpICkge1xuXG5cdHZhciBwbW91c2VYID0gdm9pZCAwO1xuXHRndWkuX19yZXNpemVfaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0Q29tbW9uLmV4dGVuZCggZ3VpLl9fcmVzaXplX2hhbmRsZS5zdHlsZSwge1xuXHRcdHdpZHRoOiAnNnB4Jyxcblx0XHRtYXJnaW5MZWZ0OiAnLTNweCcsXG5cdFx0aGVpZ2h0OiAnMjAwcHgnLFxuXHRcdGN1cnNvcjogJ2V3LXJlc2l6ZScsXG5cdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0fSApO1xuXHRmdW5jdGlvbiBkcmFnKCBlICkge1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGd1aS53aWR0aCArPSBwbW91c2VYIC0gZS5jbGllbnRYO1xuXHRcdGd1aS5vblJlc2l6ZSgpO1xuXHRcdHBtb3VzZVggPSBlLmNsaWVudFg7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblx0ZnVuY3Rpb24gZHJhZ1N0b3AoKSB7XG5cblx0XHRkb20ucmVtb3ZlQ2xhc3MoIGd1aS5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfRFJBRyApO1xuXHRcdGRvbS51bmJpbmQoIHdpbmRvdywgJ21vdXNlbW92ZScsIGRyYWcgKTtcblx0XHRkb20udW5iaW5kKCB3aW5kb3csICdtb3VzZXVwJywgZHJhZ1N0b3AgKTtcblxuXHR9XG5cdGZ1bmN0aW9uIGRyYWdTdGFydCggZSApIHtcblxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRwbW91c2VYID0gZS5jbGllbnRYO1xuXHRcdGRvbS5hZGRDbGFzcyggZ3VpLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19EUkFHICk7XG5cdFx0ZG9tLmJpbmQoIHdpbmRvdywgJ21vdXNlbW92ZScsIGRyYWcgKTtcblx0XHRkb20uYmluZCggd2luZG93LCAnbW91c2V1cCcsIGRyYWdTdG9wICk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblx0ZG9tLmJpbmQoIGd1aS5fX3Jlc2l6ZV9oYW5kbGUsICdtb3VzZWRvd24nLCBkcmFnU3RhcnQgKTtcblx0ZG9tLmJpbmQoIGd1aS5fX2Nsb3NlQnV0dG9uLCAnbW91c2Vkb3duJywgZHJhZ1N0YXJ0ICk7XG5cdGd1aS5kb21FbGVtZW50Lmluc2VydEJlZm9yZSggZ3VpLl9fcmVzaXplX2hhbmRsZSwgZ3VpLmRvbUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQgKTtcblxufVxuZnVuY3Rpb24gc2V0V2lkdGgoIGd1aSwgdyApIHtcblxuXHRndWkuZG9tRWxlbWVudC5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuXHRpZiAoIGd1aS5fX3NhdmVfcm93ICYmIGd1aS5hdXRvUGxhY2UgKSB7XG5cblx0XHRndWkuX19zYXZlX3Jvdy5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuXG5cdH1cblx0aWYgKCBndWkuX19jbG9zZUJ1dHRvbiApIHtcblxuXHRcdGd1aS5fX2Nsb3NlQnV0dG9uLnN0eWxlLndpZHRoID0gdyArICdweCc7XG5cblx0fVxuXG59XG5mdW5jdGlvbiBnZXRDdXJyZW50UHJlc2V0KCBndWksIHVzZUluaXRpYWxWYWx1ZXMgKSB7XG5cblx0dmFyIHRvUmV0dXJuID0ge307XG5cdENvbW1vbi5lYWNoKCBndWkuX19yZW1lbWJlcmVkT2JqZWN0cywgZnVuY3Rpb24gKCB2YWwsIGluZGV4ICkge1xuXG5cdFx0dmFyIHNhdmVkVmFsdWVzID0ge307XG5cdFx0dmFyIGNvbnRyb2xsZXJNYXAgPSBndWkuX19yZW1lbWJlcmVkT2JqZWN0SW5kZWNlc1RvQ29udHJvbGxlcnNbIGluZGV4IF07XG5cdFx0Q29tbW9uLmVhY2goIGNvbnRyb2xsZXJNYXAsIGZ1bmN0aW9uICggY29udHJvbGxlciwgcHJvcGVydHkgKSB7XG5cblx0XHRcdHNhdmVkVmFsdWVzWyBwcm9wZXJ0eSBdID0gdXNlSW5pdGlhbFZhbHVlcyA/IGNvbnRyb2xsZXIuaW5pdGlhbFZhbHVlIDogY29udHJvbGxlci5nZXRWYWx1ZSgpO1xuXG5cdFx0fSApO1xuXHRcdHRvUmV0dXJuWyBpbmRleCBdID0gc2F2ZWRWYWx1ZXM7XG5cblx0fSApO1xuXHRyZXR1cm4gdG9SZXR1cm47XG5cbn1cbmZ1bmN0aW9uIHNldFByZXNldFNlbGVjdEluZGV4KCBndWkgKSB7XG5cblx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCBndWkuX19wcmVzZXRfc2VsZWN0Lmxlbmd0aDsgaW5kZXggKysgKSB7XG5cblx0XHRpZiAoIGd1aS5fX3ByZXNldF9zZWxlY3RbIGluZGV4IF0udmFsdWUgPT09IGd1aS5wcmVzZXQgKSB7XG5cblx0XHRcdGd1aS5fX3ByZXNldF9zZWxlY3Quc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xuXG5cdFx0fVxuXG5cdH1cblxufVxuZnVuY3Rpb24gdXBkYXRlRGlzcGxheXMoIGNvbnRyb2xsZXJBcnJheSApIHtcblxuXHRpZiAoIGNvbnRyb2xsZXJBcnJheS5sZW5ndGggIT09IDAgKSB7XG5cblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUkMS5jYWxsKCB3aW5kb3csIGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dXBkYXRlRGlzcGxheXMoIGNvbnRyb2xsZXJBcnJheSApO1xuXG5cdFx0fSApO1xuXG5cdH1cblx0Q29tbW9uLmVhY2goIGNvbnRyb2xsZXJBcnJheSwgZnVuY3Rpb24gKCBjICkge1xuXG5cdFx0Yy51cGRhdGVEaXNwbGF5KCk7XG5cblx0fSApO1xuXG59XG5cbnZhciBjb2xvciA9IHtcblx0Q29sb3I6IENvbG9yLFxuXHRtYXRoOiBDb2xvck1hdGgsXG5cdGludGVycHJldDogaW50ZXJwcmV0XG59O1xudmFyIGNvbnRyb2xsZXJzID0ge1xuXHRDb250cm9sbGVyOiBDb250cm9sbGVyLFxuXHRCb29sZWFuQ29udHJvbGxlcjogQm9vbGVhbkNvbnRyb2xsZXIsXG5cdE9wdGlvbkNvbnRyb2xsZXI6IE9wdGlvbkNvbnRyb2xsZXIsXG5cdFN0cmluZ0NvbnRyb2xsZXI6IFN0cmluZ0NvbnRyb2xsZXIsXG5cdE51bWJlckNvbnRyb2xsZXI6IE51bWJlckNvbnRyb2xsZXIsXG5cdE51bWJlckNvbnRyb2xsZXJCb3g6IE51bWJlckNvbnRyb2xsZXJCb3gsXG5cdE51bWJlckNvbnRyb2xsZXJTbGlkZXI6IE51bWJlckNvbnRyb2xsZXJTbGlkZXIsXG5cdEZ1bmN0aW9uQ29udHJvbGxlcjogRnVuY3Rpb25Db250cm9sbGVyLFxuXHRDb2xvckNvbnRyb2xsZXI6IENvbG9yQ29udHJvbGxlclxufTtcbnZhciBkb20kMSA9IHsgZG9tOiBkb20gfTtcbnZhciBndWkgPSB7IEdVSTogR1VJIH07XG52YXIgR1VJJDEgPSBHVUk7XG52YXIgaW5kZXggPSB7XG5cdGNvbG9yOiBjb2xvcixcblx0Y29udHJvbGxlcnM6IGNvbnRyb2xsZXJzLFxuXHRkb206IGRvbSQxLFxuXHRndWk6IGd1aSxcblx0R1VJOiBHVUkkMVxufTtcblxuZXhwb3J0IHsgY29sb3IsIGNvbnRyb2xsZXJzLCBkb20kMSBhcyBkb20sIGd1aSwgR1VJJDEgYXMgR1VJIH07XG5leHBvcnQgZGVmYXVsdCBpbmRleDtcbiIsInZhciBTdGF0cyA9IGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgbW9kZSA9IDA7XG5cblx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdGNvbnRhaW5lci5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtjdXJzb3I6cG9pbnRlcjtvcGFjaXR5OjAuOTt6LWluZGV4OjEwMDAwJztcblx0Y29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHNob3dQYW5lbCggKysgbW9kZSAlIGNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggKTtcblxuXHR9LCBmYWxzZSApO1xuXG5cdC8vXG5cblx0ZnVuY3Rpb24gYWRkUGFuZWwoIHBhbmVsICkge1xuXG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCBwYW5lbC5kb20gKTtcblx0XHRyZXR1cm4gcGFuZWw7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHNob3dQYW5lbCggaWQgKSB7XG5cblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBjb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoOyBpICsrICkge1xuXG5cdFx0XHRjb250YWluZXIuY2hpbGRyZW5bIGkgXS5zdHlsZS5kaXNwbGF5ID0gaSA9PT0gaWQgPyAnYmxvY2snIDogJ25vbmUnO1xuXG5cdFx0fVxuXG5cdFx0bW9kZSA9IGlkO1xuXG5cdH1cblxuXHQvL1xuXG5cdHZhciBiZWdpblRpbWUgPSAoIHBlcmZvcm1hbmNlIHx8IERhdGUgKS5ub3coKSwgcHJldlRpbWUgPSBiZWdpblRpbWUsIGZyYW1lcyA9IDA7XG5cblx0dmFyIGZwc1BhbmVsID0gYWRkUGFuZWwoIG5ldyBTdGF0cy5QYW5lbCggJ0ZQUycsICcjMGZmJywgJyMwMDInICkgKTtcblx0dmFyIG1zUGFuZWwgPSBhZGRQYW5lbCggbmV3IFN0YXRzLlBhbmVsKCAnTVMnLCAnIzBmMCcsICcjMDIwJyApICk7XG5cblx0aWYgKCBzZWxmLnBlcmZvcm1hbmNlICYmIHNlbGYucGVyZm9ybWFuY2UubWVtb3J5ICkge1xuXG5cdFx0dmFyIG1lbVBhbmVsID0gYWRkUGFuZWwoIG5ldyBTdGF0cy5QYW5lbCggJ01CJywgJyNmMDgnLCAnIzIwMScgKSApO1xuXG5cdH1cblxuXHRzaG93UGFuZWwoIDAgKTtcblxuXHRyZXR1cm4ge1xuXG5cdFx0UkVWSVNJT046IDE2LFxuXG5cdFx0ZG9tOiBjb250YWluZXIsXG5cblx0XHRhZGRQYW5lbDogYWRkUGFuZWwsXG5cdFx0c2hvd1BhbmVsOiBzaG93UGFuZWwsXG5cblx0XHRiZWdpbjogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRiZWdpblRpbWUgPSAoIHBlcmZvcm1hbmNlIHx8IERhdGUgKS5ub3coKTtcblxuXHRcdH0sXG5cblx0XHRlbmQ6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0ZnJhbWVzICsrO1xuXG5cdFx0XHR2YXIgdGltZSA9ICggcGVyZm9ybWFuY2UgfHwgRGF0ZSApLm5vdygpO1xuXG5cdFx0XHRtc1BhbmVsLnVwZGF0ZSggdGltZSAtIGJlZ2luVGltZSwgMjAwICk7XG5cblx0XHRcdGlmICggdGltZSA+PSBwcmV2VGltZSArIDEwMDAgKSB7XG5cblx0XHRcdFx0ZnBzUGFuZWwudXBkYXRlKCAoIGZyYW1lcyAqIDEwMDAgKSAvICggdGltZSAtIHByZXZUaW1lICksIDEwMCApO1xuXG5cdFx0XHRcdHByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0ZnJhbWVzID0gMDtcblxuXHRcdFx0XHRpZiAoIG1lbVBhbmVsICkge1xuXG5cdFx0XHRcdFx0dmFyIG1lbW9yeSA9IHBlcmZvcm1hbmNlLm1lbW9yeTtcblx0XHRcdFx0XHRtZW1QYW5lbC51cGRhdGUoIG1lbW9yeS51c2VkSlNIZWFwU2l6ZSAvIDEwNDg1NzYsIG1lbW9yeS5qc0hlYXBTaXplTGltaXQgLyAxMDQ4NTc2ICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aW1lO1xuXG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRiZWdpblRpbWUgPSB0aGlzLmVuZCgpO1xuXG5cdFx0fSxcblxuXHRcdC8vIEJhY2t3YXJkcyBDb21wYXRpYmlsaXR5XG5cblx0XHRkb21FbGVtZW50OiBjb250YWluZXIsXG5cdFx0c2V0TW9kZTogc2hvd1BhbmVsXG5cblx0fTtcblxufTtcblxuU3RhdHMuUGFuZWwgPSBmdW5jdGlvbiAoIG5hbWUsIGZnLCBiZyApIHtcblxuXHR2YXIgbWluID0gSW5maW5pdHksIG1heCA9IDAsIHJvdW5kID0gTWF0aC5yb3VuZDtcblx0dmFyIFBSID0gcm91bmQoIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDEgKTtcblxuXHR2YXIgV0lEVEggPSA4MCAqIFBSLCBIRUlHSFQgPSA0OCAqIFBSLFxuXHRcdFRFWFRfWCA9IDMgKiBQUiwgVEVYVF9ZID0gMiAqIFBSLFxuXHRcdEdSQVBIX1ggPSAzICogUFIsIEdSQVBIX1kgPSAxNSAqIFBSLFxuXHRcdEdSQVBIX1dJRFRIID0gNzQgKiBQUiwgR1JBUEhfSEVJR0hUID0gMzAgKiBQUjtcblxuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKTtcblx0Y2FudmFzLndpZHRoID0gV0lEVEg7XG5cdGNhbnZhcy5oZWlnaHQgPSBIRUlHSFQ7XG5cdGNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gJ3dpZHRoOjgwcHg7aGVpZ2h0OjQ4cHgnO1xuXG5cdHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcblx0Y29udGV4dC5mb250ID0gJ2JvbGQgJyArICggOSAqIFBSICkgKyAncHggSGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWYnO1xuXHRjb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuXG5cdGNvbnRleHQuZmlsbFN0eWxlID0gYmc7XG5cdGNvbnRleHQuZmlsbFJlY3QoIDAsIDAsIFdJRFRILCBIRUlHSFQgKTtcblxuXHRjb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xuXHRjb250ZXh0LmZpbGxUZXh0KCBuYW1lLCBURVhUX1gsIFRFWFRfWSApO1xuXHRjb250ZXh0LmZpbGxSZWN0KCBHUkFQSF9YLCBHUkFQSF9ZLCBHUkFQSF9XSURUSCwgR1JBUEhfSEVJR0hUICk7XG5cblx0Y29udGV4dC5maWxsU3R5bGUgPSBiZztcblx0Y29udGV4dC5nbG9iYWxBbHBoYSA9IDAuOTtcblx0Y29udGV4dC5maWxsUmVjdCggR1JBUEhfWCwgR1JBUEhfWSwgR1JBUEhfV0lEVEgsIEdSQVBIX0hFSUdIVCApO1xuXG5cdHJldHVybiB7XG5cblx0XHRkb206IGNhbnZhcyxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKCB2YWx1ZSwgbWF4VmFsdWUgKSB7XG5cblx0XHRcdG1pbiA9IE1hdGgubWluKCBtaW4sIHZhbHVlICk7XG5cdFx0XHRtYXggPSBNYXRoLm1heCggbWF4LCB2YWx1ZSApO1xuXG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IGJnO1xuXHRcdFx0Y29udGV4dC5nbG9iYWxBbHBoYSA9IDE7XG5cdFx0XHRjb250ZXh0LmZpbGxSZWN0KCAwLCAwLCBXSURUSCwgR1JBUEhfWSApO1xuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBmZztcblx0XHRcdGNvbnRleHQuZmlsbFRleHQoIHJvdW5kKCB2YWx1ZSApICsgJyAnICsgbmFtZSArICcgKCcgKyByb3VuZCggbWluICkgKyAnLScgKyByb3VuZCggbWF4ICkgKyAnKScsIFRFWFRfWCwgVEVYVF9ZICk7XG5cblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKCBjYW52YXMsIEdSQVBIX1ggKyBQUiwgR1JBUEhfWSwgR1JBUEhfV0lEVEggLSBQUiwgR1JBUEhfSEVJR0hULCBHUkFQSF9YLCBHUkFQSF9ZLCBHUkFQSF9XSURUSCAtIFBSLCBHUkFQSF9IRUlHSFQgKTtcblxuXHRcdFx0Y29udGV4dC5maWxsUmVjdCggR1JBUEhfWCArIEdSQVBIX1dJRFRIIC0gUFIsIEdSQVBIX1ksIFBSLCBHUkFQSF9IRUlHSFQgKTtcblxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSBiZztcblx0XHRcdGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAwLjk7XG5cdFx0XHRjb250ZXh0LmZpbGxSZWN0KCBHUkFQSF9YICsgR1JBUEhfV0lEVEggLSBQUiwgR1JBUEhfWSwgUFIsIHJvdW5kKCAoIDEgLSAoIHZhbHVlIC8gbWF4VmFsdWUgKSApICogR1JBUEhfSEVJR0hUICkgKTtcblxuXHRcdH1cblxuXHR9O1xuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTdGF0cztcbiIsIm1vZHVsZS5leHBvcnRzID0gVEhSRUU7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiXG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCJcbmltcG9ydCBTdGF0cyBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2xpYnMvc3RhdHMubW9kdWxlXCJcbmltcG9ydCB7IEdVSSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbGlicy9kYXQuZ3VpLm1vZHVsZVwiXG5cblxuZnVuY3Rpb24gbWFpbigpIHtcbiAgICAvLyBzZXR1cFxuICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYycpO1xuICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgICBjYW52YXM6IGNhbnZhcyxcbiAgICAgICAgLy8gYW50aWFsaWFzOiB0cnVlLFxuICAgIH0pO1xuICAgIHJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlOyAvLyBkb24ndCB0aGluayB0aGlzIGhlbHBzIGFueXRoaW5nIHJlbGV2YW50Li4uXG4gICAgY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKDB4ZmZmZmZmKTtcbiAgICBsZXQgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgICB7XG4gICAgICAgIGNvbnN0IGZvdiA9IDc1O1xuICAgICAgICBjb25zdCBhc3BlY3QgPSAyOyAgLy8gdGhlIGNhbnZhcyBkZWZhdWx0XG4gICAgICAgIGNvbnN0IG5lYXIgPSAwLjE7XG4gICAgICAgIGNvbnN0IGZhciA9IDEwMDA7XG4gICAgICAgIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShmb3YsIGFzcGVjdCwgbmVhciwgZmFyKTtcbiAgICB9XG5cbiAgICBjYW1lcmEucG9zaXRpb24uc2V0KC03LCAyMCwgLTEwKVxuICAgIGxldCBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgY29udHJvbHMudGFyZ2V0LnNldCg1LCA4LCA1KVxuXG4gICAgLy8gc3R1ZmYgc2V0dXAgbGF0ZXJcbiAgICBsZXQgaW5zdGFuY2VkTWVzaDogVEhSRUUuSW5zdGFuY2VkTWVzaFxuICAgIGxldCBpbnN0YW5jZWRNZXNoZXM6IFRIUkVFLkluc3RhbmNlZE1lc2hbXSA9IFtdXG5cbiAgICAvLyBzdGF0c1xuICAgIGxldCBzdGF0cyA9IFN0YXRzKCk7XG4gICAgc3RhdHMuZG9tLmlkID0gJ3N0YXRzJztcbiAgICBsZXQgc3RhdHNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXRzLWNvbnRhaW5lclwiKTtcbiAgICBpZiAoc3RhdHNDb250YWluZXIpIHtcbiAgICAgICAgc3RhdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcbiAgICB9XG4gICAgLy8gc3R1ZmYgZ3VpIHdpbGwgbW9kaWZ5XG4gICAgbGV0IHBhcmFtcyA9IHsgJ2xpZ2h0SW50ZW5zaXR5JzogMS4yIH1cbiAgICBsZXQgbGlnaHQ6IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQ7XG5cbiAgICAvLyBHVUlcbiAgICBsZXQgZ3VpID0gbmV3IEdVSSh7IGF1dG9QbGFjZTogZmFsc2UgfSk7XG4gICAgZ3VpLmRvbUVsZW1lbnQuaWQgPSAnZ3VpJztcbiAgICBsZXQgZ3VpQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ndWktY29udGFpbmVyXCIpO1xuICAgIGlmIChndWlDb250YWluZXIpIHtcbiAgICAgICAgZ3VpQ29udGFpbmVyLmFwcGVuZENoaWxkKGd1aS5kb21FbGVtZW50KTtcbiAgICB9XG4gICAgbGV0IGN1cktpbmQgPSAnY3ViZSc7XG5cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBndWkuYWRkKHBhcmFtcywgJ2xpZ2h0SW50ZW5zaXR5JywgMCwgMTApLm9uQ2hhbmdlKGZ1bmN0aW9uICh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIGxpZ2h0LmludGVuc2l0eSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgLy8gYnVpbGQgdGhlIHNjZW5lXG4gICAge1xuICAgICAgICAvLyBncm91bmRcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgZ3JvdW5kR2VvbSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDUwLCA1MCk7XG4gICAgICAgICAgICBjb25zdCBncm91bmRNYXQgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhlZWVlZWUgfSk7XG4gICAgICAgICAgICBjb25zdCBncm91bmRNZXNoID0gbmV3IFRIUkVFLk1lc2goZ3JvdW5kR2VvbSwgZ3JvdW5kTWF0KTtcbiAgICAgICAgICAgIC8vIGJ5IGRlZmF1bHQsIGl0IGxpdmVzIGluIHRoZSBYWSBwbGFuZS4gd2UncmUgdXNpbmcgWS11cCwgc28gbWFrZSBpdCBsaXZlIGluXG4gICAgICAgICAgICAvLyB0aGUgWFogcGxhbmUuXG4gICAgICAgICAgICBncm91bmRNZXNoLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICAgICAgICBzY2VuZS5hZGQoZ3JvdW5kTWVzaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbWJpZW50IGxpZ2h0XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoJ3doaXRlJywgMC4yNSk7XG4gICAgICAgICAgICBzY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1haW4gbGlnaHRcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSAweDg4Nzc3NztcbiAgICAgICAgICAgIGNvbnN0IGludGVuc2l0eSA9IDEuMjtcbiAgICAgICAgICAgIGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoY29sb3IsIGludGVuc2l0eSk7XG4gICAgICAgICAgICBsaWdodC5wb3NpdGlvbi5zZXQoMCwgMTAsIC0xMCk7XG4gICAgICAgICAgICBzY2VuZS5hZGQobGlnaHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3BoZXJlXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIGNvbnN0IGdlb20gPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMiwgMjAsIDIwKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IG1hdCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweGVlZWVlZSB9KTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHNwaGVyZSA9IG5ldyBUSFJFRS5NZXNoKGdlb20sIG1hdCk7XG4gICAgICAgICAgICAvLyBzcGhlcmUucG9zaXRpb24uc2V0WSgzKTtcbiAgICAgICAgICAgIC8vIHNjZW5lLmFkZChzcGhlcmUpO1xuICAgICAgICB9XG5cblxuICAgICAgICBmdW5jdGlvbiBhcnJhbmdlSW5zdGFuY2VzKGtpbmQ6IHN0cmluZywgbWVzaDogVEhSRUUuSW5zdGFuY2VkTWVzaCwgbjogbnVtYmVyLCBzaXplOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XG4gICAgICAgICAgICBjb25zdCBjdWJlUm9vdCA9IE1hdGguY2VpbChNYXRoLmNicnQobikpO1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlUm9vdCA9IE1hdGguY2VpbChNYXRoLnNxcnQobikpO1xuICAgICAgICAgICAgY29uc3Qgc3BhY2luZyA9IDIuMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoa2luZCA9PSAnY3ViZScpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4LnNldFBvc2l0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGkgJSBjdWJlUm9vdCkgKiBzcGFjaW5nICogc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoaSAvIGN1YmVSb290KSAlIGN1YmVSb290ICogc3BhY2luZyAqIHNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGkgLyAoY3ViZVJvb3QgKiBjdWJlUm9vdCkpICogc3BhY2luZyAqIHNpemVcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtpbmQgPT0gJ3BsYW5lJykge1xuICAgICAgICAgICAgICAgICAgICBtYXRyaXguc2V0UG9zaXRpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAoaSAlIHNxdWFyZVJvb3QpICogc3BhY2luZyAqIHNpemUsXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGkgLyBzcXVhcmVSb290KSAlIHNxdWFyZVJvb3QgKiBzcGFjaW5nICogc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlVua25vd24gYXJyYW5nZW1lbnQga2luZDpcIiwga2luZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VkTWVzaC5zZXRNYXRyaXhBdChpLCBtYXRyaXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5zdGFuY2VkTWVzaC5pbnN0YW5jZU1hdHJpeC5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbnN0YW5jZSBzZXR0aW5nc1xuICAgICAgICBjb25zdCBuID0gODAwMDAwXG4gICAgICAgIGNvbnN0IHNpemUgPSAwLjE7XG5cbiAgICAgICAgLy8gbGV0IHBsYW5lR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKSwgY3ViZUdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICAgIC8vIGluc3RhbmNlczogc2luZ2xlIGNvbnRhaW5lclxuICAgICAgICBpZiAodHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgZ2VvbSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShzaXplLCBzaXplLCBzaXplKTtcblxuICAgICAgICAgICAgLy8gY2hhbmdlIG1hdGVyaWFsIGhlcmVcbiAgICAgICAgICAgIC8vIGNvbnN0IG1hdCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCB9KTtcbiAgICAgICAgICAgIC8vIG1hdC5zaGluaW5lc3MgPSA4MDtcbiAgICAgICAgICAgIGNvbnN0IG1hdCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwIH0pO1xuICAgICAgICAgICAgLy8gY29uc3QgbWF0ID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4ZmYwMDAwIH0pO1xuXG4gICAgICAgICAgICBpbnN0YW5jZWRNZXNoID0gbmV3IFRIUkVFLkluc3RhbmNlZE1lc2goZ2VvbSwgbWF0LCBuKTtcbiAgICAgICAgICAgIGFycmFuZ2VJbnN0YW5jZXMoY3VyS2luZCwgaW5zdGFuY2VkTWVzaCwgbiwgc2l6ZSk7XG5cbiAgICAgICAgICAgIHNjZW5lLmFkZChpbnN0YW5jZWRNZXNoKVxuICAgICAgICAgICAgaW5zdGFuY2VkTWVzaC5mcnVzdHVtQ3VsbGVkXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuQ29udGFpbmVycyA9IDEwMFxuICAgICAgICAvLyBpbnN0YW5jZXM6IG11bHRpcGxlIGNvbnRhaW5lcnNcbiAgICAgICAgaWYgKGZhbHNlKSB7XG4gICAgICAgICAgICBjb25zdCBjdWJlUm9vdCA9IE1hdGguY2VpbChNYXRoLmNicnQobikpO1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlUm9vdCA9IE1hdGguY2VpbChNYXRoLnNxcnQobikpO1xuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IDAuMTtcbiAgICAgICAgICAgIGNvbnN0IHNwYWNpbmcgPSAyLjA7XG4gICAgICAgICAgICBsZXQgblBlckNvbnRhaW5lciA9IE1hdGguY2VpbChuIC8gbkNvbnRhaW5lcnMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuQ29udGFpbmVyczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VvbSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeShzaXplLCBzaXplLCBzaXplKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXQgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHhmZjAwMDAgfSk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VkTWVzaGVzLnB1c2gobmV3IFRIUkVFLkluc3RhbmNlZE1lc2goZ2VvbSwgbWF0LCBuUGVyQ29udGFpbmVyKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICAgICAgICAgICAgbGV0IGNvbnRhaW5lckkgPSAwLCBjb250YWluZXJJZHggPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyBidWlsZCBhcyBjdWJlXG4gICAgICAgICAgICAgICAgbWF0cml4LnNldFBvc2l0aW9uKFxuICAgICAgICAgICAgICAgICAgICAoaSAlIGN1YmVSb290KSAqIHNwYWNpbmcgKiBzaXplLFxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGkgLyBjdWJlUm9vdCkgJSBjdWJlUm9vdCAqIHNwYWNpbmcgKiBzaXplLFxuICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGkgLyAoY3ViZVJvb3QgKiBjdWJlUm9vdCkpICogc3BhY2luZyAqIHNpemVcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VkTWVzaGVzW2NvbnRhaW5lcklkeF0uc2V0TWF0cml4QXQoY29udGFpbmVySSwgbWF0cml4KTtcbiAgICAgICAgICAgICAgICBjb250YWluZXJJKys7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5lckkgPj0gblBlckNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJJZHgrKztcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVySSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuQ29udGFpbmVyczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VkTWVzaGVzW2ldLmluc3RhbmNlTWF0cml4Lm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzY2VuZS5hZGQoaW5zdGFuY2VkTWVzaGVzW2ldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZWRpdG9yR1VJQ2xpY2soa2luZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgICAgICBpZiAoY3VyS2luZCA9PSBraW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhcnJhbmdlSW5zdGFuY2VzKGtpbmQsIGluc3RhbmNlZE1lc2gsIG4sIHNpemUpO1xuICAgICAgICAgICAgY3VyS2luZCA9IGtpbmQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhY3R1YWwgZWRpdGluZyBHVUlcbiAgICAgICAgbGV0IGVkaXRpbmdHVUlDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVkaXRpbmctZ3VpLWNvbnRhaW5lclwiKTtcbiAgICAgICAgaWYgKGVkaXRpbmdHVUlDb250YWluZXIpIHtcbiAgICAgICAgICAgIGxldCBlZGl0aW5nR1VJID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGVkaXRpbmdHVUkuaWQgPSBcImVkaXRpbmctZ3VpXCI7XG4gICAgICAgICAgICBsZXQgd29ya2xpc3QgPSBbXG4gICAgICAgICAgICAgICAgWydsaWdodC1ncmF5JywgJ3BsYW5lJ10sXG4gICAgICAgICAgICAgICAgWydsaWdodC1ncmF5JywgJ2N1YmUnXSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBmb3IgKGxldCBbY29sb3IsIGtpbmRdIG9mIHdvcmtsaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTmFtZSA9IGBoMyB3NCBiYSBidzIgYi0td2hpdGUgYmctJHtjb2xvcn0gYnI0IHBvaW50ZXIgc2hhZG93LTUgbWwzYDtcbiAgICAgICAgICAgICAgICBidXR0b24uaW5uZXJUZXh0ID0ga2luZDtcbiAgICAgICAgICAgICAgICBidXR0b24ub25jbGljayA9IGVkaXRvckdVSUNsaWNrLmJpbmQoYnV0dG9uLCBraW5kKTtcbiAgICAgICAgICAgICAgICBlZGl0aW5nR1VJLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlZGl0aW5nR1VJQ29udGFpbmVyLmFwcGVuZENoaWxkKGVkaXRpbmdHVUkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9yIGNvbnNvbGUgYWNjZXNzXG4gICAgICAgIE9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gICAgICAgICAgICBtZXNoOiBpbnN0YW5jZWRNZXNoLFxuICAgICAgICAgICAgbWVzaGVzOiBpbnN0YW5jZWRNZXNoZXMsXG4gICAgICAgICAgICBjYW1lcmE6IGNhbWVyYSxcbiAgICAgICAgICAgIHJlbmRlcmVyOiByZW5kZXJlcixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIGhlbHBlcjogcmVzaXppbmcgaWYgbmVlZGVkXG4gICAgZnVuY3Rpb24gbWF5YmVSZXNpemUoKSB7XG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gY2FudmFzLmNsaWVudFdpZHRoO1xuICAgICAgICBjb25zdCBoZWlnaHQgPSBjYW52YXMuY2xpZW50SGVpZ2h0O1xuICAgICAgICBjb25zdCBuZWVkUmVzaXplID0gY2FudmFzLndpZHRoICE9PSB3aWR0aCB8fCBjYW52YXMuaGVpZ2h0ICE9PSBoZWlnaHQ7XG4gICAgICAgIGlmIChuZWVkUmVzaXplKSB7XG4gICAgICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQsIGZhbHNlKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgICAgICAgICBjYW1lcmEuYXNwZWN0ID0gY2FudmFzLmNsaWVudFdpZHRoIC8gY2FudmFzLmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGVNYXRyaXggPSBuZXcgVEhSRUUuTWF0cml4NCgpO1xuICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgLy8gc2luZ2xlIGluc3RhbmNlZCBtZXNoXG4gICAgICAgIC8vIGluc3RhbmNlZE1lc2guaW5zdGFuY2VNYXRyaXgubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICAgIC8vIG11bHRpcGxlIGluc3RhbmNlZCBtZXNoZXNcbiAgICAgICAgbGV0IG5Ub1VwZGF0ZSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgblRvVXBkYXRlOyBpKyspIHtcbiAgICAgICAgICAgIHVwZGF0ZU1hdHJpeC5zZXRQb3NpdGlvbihNYXRoLnJhbmRvbSgpICogLTEsIE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkgKiAtMSlcbiAgICAgICAgICAgIGluc3RhbmNlZE1lc2hlc1tpXS5zZXRNYXRyaXhBdCg0MiwgdXBkYXRlTWF0cml4KVxuICAgICAgICAgICAgaW5zdGFuY2VkTWVzaGVzW2ldLmluc3RhbmNlTWF0cml4Lm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlcih0aW1lX21zOiBudW1iZXIpIHtcbiAgICAgICAgc3RhdHMuYmVnaW4oKVxuXG4gICAgICAgIC8vIGxvZ2ljXG4gICAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICAgIC8vIGluZnJhc3RydWN0dXJlIHVwZGF0ZXMgJiByZW5kZXJcbiAgICAgICAgbWF5YmVSZXNpemUoKVxuICAgICAgICBjb250cm9scy51cGRhdGUoKTtcblxuXG4gICAgICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcblxuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHN0YXRzLmVuZCgpO1xuICAgIH1cblxuICAgIC8vIGtpY2sgb2ZmXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG59XG5cbm1haW4oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=