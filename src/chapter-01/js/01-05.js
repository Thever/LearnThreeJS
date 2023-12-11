function init() {
    //  实例化统计帧数模块
    var stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    // add the sphere to the scene
    scene.add(sphere);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-10, 20, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    //  计数器
    var step = 0;

    //  定义一个函数，主要携带参数控制旋转和跳动速度
    var controls = new function () {
        //  旋转速度
        this.rotationSpeed = 0.02;
        //  跳动速度
        this.bouncingSpeed = 0.03;
    };

    //  实例化dat.gui模块
    var gui = new dat.GUI();
    //  添加控制项
    //  控制 controls 下的 rotationSpeed 属性，最小值0， 最大值0.5
    //  这种写法应该时为了js拼接获取属性值 controls[rotationSpeed]
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    //  控制 controls 下的 bouncingSpeed 属性，最小值0， 最大值0.5
    gui.add(controls, 'bouncingSpeed', 0, 0.5);


    // attach them here, since appendChild needs to be called first
    //  实例化轨迹球控制器，指定参数
    var trackballControls = initTrackballControls(camera, renderer);
    //  引入时钟模块
    var clock = new THREE.Clock();

    render();

    function render() {
        // update the stats and the controls
        //  传入渲染间隔时间，更新轨道球控制器
        trackballControls.update(clock.getDelta());
        //  更新统计帧模块
        stats.update();
        
        // rotate the cube around its axes
        //  立方体按设置的属性值旋转
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        //  小球按设定的属性值跳动
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // render using requestAnimationFrame
        //  下一帧渲染再次调用本方法
        requestAnimationFrame(render);
        //  渲染器渲染场景
        renderer.render(scene, camera);
    }
}