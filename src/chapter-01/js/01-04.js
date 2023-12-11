function init() {
    //  实例化统计帧数模块
    var stats = initStats();

    // default setup
    //  默认初始化配置
    //  实例化场景
    var scene = new THREE.Scene();
    //  实例化相机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //  实例化渲染器
    var renderer = new THREE.WebGLRenderer();

    //  设置背景色
    renderer.setClearColor(new THREE.Color(0x000000));
    //  设置渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
    //  允许渲染器产品阴影
    renderer.shadowMap.enabled = true;

    // create the ground plane
    //  创建平面
    //  定义平面形状
    var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    //  定义平面材质
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    //  组合生成平面
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //  允许平面接收阴影并渲染
    plane.receiveShadow = true;

    // rotate and position the plane
    //  平面旋转
    plane.rotation.x = -0.5 * Math.PI;
    //  调整平面的位置
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    //  场景添加平面
    scene.add(plane);

    // create a cube
    //  创建立方体
    //  创建立方体形状
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    //  创建立方体材质
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    //  形状材质组合生成立方体
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    //  允许立方体产生阴影
    cube.castShadow = true;

    // position the cube
    //  调整立方体位置
    cube.position.x = -4;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    //  场景添加立方体
    scene.add(cube);

    //  创建球体
    //  定义球体形状
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    //  定义球体材质
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    //  形状和材质结合生成球体
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    //  调整球体位置
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    //  允许球体产生阴影
    sphere.castShadow = true;

    // add the sphere to the scene
    //  场景添加球体
    scene.add(sphere);

    // position and point the camera to the center of the scene
    //  调整相机位置
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    //  相机朝向场景
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    //  声明环境光
    var ambienLight = new THREE.AmbientLight(0x353535);
    //  场景添加环境光
    scene.add(ambienLight);

    // add spotlight for the shadows
    //  创建聚光灯光源
    var spotLight = new THREE.SpotLight(0xffffff);
    //  设置点光源位置
    spotLight.position.set(-10, 20, -5);
    //  允许点光源光照产生阴影
    spotLight.castShadow = true;
    //  场景添加点光源
    scene.add(spotLight);

    // add the output of the renderer to the html element
    //  指定将渲染器渲染内容，渲染到 #webgl-output 中
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    //  计数器
    var step = 0;
    //  调用渲染函数
    renderScene();

    function renderScene() {
        //  更新帧数相关信息
        stats.update();

        // rotate the cube around its axes
        //  让立方体旋转起来
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        cube.rotation.z += 0.02;

        // bounce the sphere up and down
        //  让小球跳动起来
        step += 0.04;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        // render using requestAnimationFrame
        //  下一帧渲染继续调用 renderScene 方法，也就是调用本身
        requestAnimationFrame(renderScene);
        //  渲染器重新渲染
        renderer.render(scene, camera);
    }
}