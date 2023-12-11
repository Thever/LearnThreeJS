function init() {
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();
    var scene = new THREE.Scene();

    var projector = new THREE.Projector();
    // document.getElementById("webgl-output")
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);    

    initDefaultLighting(scene);

    var groundPlane = addGroundPlane(scene)
    groundPlane.position.y = 0;

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshStandardMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);

    var cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
    var cylinderMaterial = new THREE.MeshStandardMaterial({color: 0x77ff77});
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder
        .position
        .set(0, 0, 1);

    scene.add(cylinder);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    // call the render function
    var step = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;
        //  是否显示投射光线
        this.showRay = false;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'scalingSpeed', 0, 0.5);
    gui.add(controls, 'showRay').onChange(function (e) {
        if (tube) scene.remove(tube)
    });

    renderScene();
    var step = 0;
    var scalingStep = 0;

    function renderScene() {
        stats.update();

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // scale the cylinder
        scalingStep += controls.scalingSpeed;
        var scaleX = Math.abs(Math.sin(scalingStep / 4));
        var scaleY = Math.abs(Math.cos(scalingStep / 5));
        var scaleZ = Math.abs(Math.sin(scalingStep / 7));
        cylinder
            .scale
            .set(scaleX, scaleY, scaleZ);

        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    var projector = new THREE.Projector();
    var tube;
    //  鼠标点击处理
    function onDocumentMouseDown(event) {
        //  获取鼠标点击点位置，转换成三维向量
        var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        //  再将三维向量转换成转换成three场景中坐标
        vector = vector.unproject(camera);
        //  声明光线投射，从摄像机位置出发，照向鼠标位置，至少从当前鼠标位置开始照射
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        //  指定光线投射检测的物体为球体，圆柱体和立方体
        var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);
        //  光线投射到指定物体上了
        if (intersects.length > 0) {
            console.log(intersects[0]);
            //  照射到得物体允许透明
            intersects[0].object.material.transparent = true;
            //  透明度为0.1
            intersects[0].object.material.opacity = 0.1;
        }
    }
    //  鼠标移动处理
    function onDocumentMouseMove(event) {
        //  开启了展示镭射
        if (controls.showRay) {
            //  将鼠标移动位置转换成三维向量
            var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
            //  再将三维向量转换成转换成three场景中坐标
            vector = vector.unproject(camera);
            //  声明光线投射，从摄像机位置出发，照向鼠标位置，至少从当前鼠标位置开始照射
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            //  指定光线投射检测的物体为球体，圆柱体和立方体
            var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);
            //  光线投射到指定物体上了
            if (intersects.length > 0) {
                //  点矢量容器
                var points = [];
                //  传入相机位置
                points.push(new THREE.Vector3(-30, 39.8, 30));
                //  传入投射到的第一个物体的点位置
                points.push(intersects[0].point);
                //  声明基础材质
                var mat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.6});
                //  声明管道几何体(其实展现效果为一束光线)
                var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 0.001);
                //  如果有，就删除就得管道几何体
                if (tube) 
                    scene.remove(tube);
                //  如果展示镭射
                if (controls.showRay) {
                    //  形成网格体
                    tube = new THREE.Mesh(tubeGeometry, mat);
                    //  添加到
                    scene.add(tube);
                }
            }
        }
    }
}