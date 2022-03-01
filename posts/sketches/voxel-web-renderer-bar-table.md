---
title: "Voxel Web Renderer Ft. Bar Table"
date: 2021-04-13
redirect_from: /posts/voxel-web-renderer-bar-table/
image: /assets/sketches/voxel-web-renderer-bar-table/bar-live-vaporwave-preview.png
thumb: /assets/sketches/voxel-web-renderer-bar-table/bar-live-vaporwave-preview-thumb.jpg
---

<script type="module">
    // latest version @ https://unpkg.com/three
    import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
    import { VOXLoader, VOXMesh } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/VOXLoader.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xadd5f7 );
    scene.background = new THREE.Color( 0xE33682 );
    const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(-3.02, -0.173, 2.86);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById("container").appendChild( renderer.domElement );

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    const group = new THREE.Group();
    const loader = new VOXLoader();
    loader.load('/assets/sketches/voxel-web-renderer-bar-table/08_Bar Table.vox', function ( chunks ) {
        for ( let i = 0; i < chunks.length; i ++ ) {
            const chunk = chunks[ i ];

            // displayPalette( chunk.palette );

            const mesh = new VOXMesh( chunk );
            // mesh.scale.setScalar( 0.0015 );
            mesh.scale.setScalar(0.1);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add( mesh );

        }

    } );
    scene.add(group);

    // controls
    let controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = .1;
    controls.maxDistance = 25;
    controls.target.set(0, -0.5, 0);
    // controls.autoRotate = true;

    // lights

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );
    scene.add( hemiLight );

    // const dirLight = new THREE.DirectionalLight( 0xF5F0C0, 0.9 );
    const dirLight = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
    // dirLight.position.set(-1, 1, -1);
    dirLight.position.set(-3.02, -0.173, 2.86);
    dirLight.castShadow = true;
    scene.add( dirLight );

    // const pointLight = new THREE.PointLight(0xff5555, 1);
    const pointLight = new THREE.PointLight(0xff00ff, 1);
    pointLight.position.set(-3, 1, -3);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    // scene.add( pointLightHelper );

    // const pointLight2 = new THREE.PointLight(0xF5F487, 1);
    // pointLight2.position.set(1, 0.5, -1);
    // pointLight2.castShadow = true;
    // scene.add(pointLight2);

    // const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, sphereSize );
    // scene.add( pointLightHelper2 );

    // handle resizing
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
        // console.log(camera.position);
    }
    window.addEventListener( 'resize', onWindowResize, false );

    const animate = function () {
        requestAnimationFrame( animate );

        controls.update()

        // scene.rotation.x += 0.01;
        // scene.rotation.y += 0.003;
        group.rotation.y -= 0.003;

        // postprocessing.composer.render( 0.1 );
        renderer.render( scene, camera );
    };

    animate();

</script>
