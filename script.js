// Check if WebXR is supported
if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
            initXR();
        } else {
            console.log('WebXR not supported.');
        }
    });
} else {
    console.log('WebXR not available.');
}

function initXR() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -0.5);
    scene.add(cube);

    // AR button
    const xrButton = document.createElement('button');
    xrButton.style.display = 'none';
    xrButton.style.position = 'absolute';
    xrButton.style.bottom = '20px';
    xrButton.style.left = '50%';
    xrButton.style.transform = 'translateX(-50%)';
    xrButton.style.padding = '10px 20px';
    xrButton.style.background = 'rgba(0,0,0,0.6)';
    xrButton.style.color = 'white';
    xrButton.style.fontSize = '20px';
    xrButton.style.border = 'none';
    xrButton.style.cursor = 'pointer';
    document.body.appendChild(xrButton);

    navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] }).then((session) => {
        renderer.xr.setSession(session);
        xrButton.style.display = 'none';
    });

    const controller = renderer.xr.getController(0);
    scene.add(controller);

    const raycaster = new THREE.Raycaster();
    const tempMatrix = new THREE.Matrix4();

    controller.addEventListener('selectstart', () => {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const frame = renderer.xr.getFrame();
        const viewerPose = frame.getViewerPose(referenceSpace);
        if (viewerPose) {
            const ray = new XRRay(viewerPose.transform);
            const hitTestResults = frame.getHitTestResults(ray);
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const hitPose = hit.getPose(referenceSpace);
                cube.position.set(hitPose.transform.position.x, hitPose.transform.position.y, hitPose.transform.position.z);
                scene.add(cube);
            }
        }
    });

    function animate() {
        renderer.setAnimationLoop(render);
    }

    function render() {
        renderer.render(scene, camera);
    }

    animate();
}
