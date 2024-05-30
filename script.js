document.getElementById('message').textContent = 'Checking WebXR support...';

if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
            document.getElementById('message').textContent = 'WebXR supported. Click to start AR.';
            const button = document.createElement('button');
            button.style.position = 'absolute';
            button.style.bottom = '20px';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.textContent = 'Start AR';
            button.onclick = () => {
                button.remove();
                startAR();
            };
            document.body.appendChild(button);
        } else {
            document.getElementById('message').textContent = 'WebXR not supported.';
        }
    });
} else {
    document.getElementById('message').textContent = 'WebXR not available.';
}

function startAR() {
    document.getElementById('message').textContent = 'Starting AR session...';

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

    navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] }).then((session) => {
        renderer.xr.setSession(session);
        document.getElementById('message').textContent = 'AR session started.';

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
    }).catch((error) => {
        document.getElementById('message').textContent = 'Failed to start AR session: ' + error.message;
    });
}
