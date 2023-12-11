function init() {
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // 创建场景
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    //  设置透视相机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    //  实例化渲染器
    var renderer = new THREE.WebGLRenderer();
    // renderer.setClearColor(new THREE.Color(0x000000));
    //  设置背景色
    renderer.setClearColor(new THREE.Color(0xff0000));
    //  设置背景尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);

    // show axes in the screen
    //  实例化轨道辅助器
    var axes = new THREE.AxesHelper(20);
    //  添加到场景
    scene.add(axes);

    // create the ground plane
    //  创建平面
    //  创建平面缓冲几何体
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    //  声明基础网格材质
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xAAAAAA
    });
    //  结合形状和材质生成平面
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    //  从原点方向向x轴正方向看去，逆时针旋转90度
    plane.rotation.x = -0.5 * Math.PI;
    //  调整平面在x轴的位置
    plane.position.set(15, 0, 0);

    // add the plane to the scene
    // 平面添加到场景
    scene.add(plane);

    // create a cube
    //  创建立方体
    //  声明立方缓冲几何体
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    //  使用基础网格材质
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        //  渲染为线框
        wireframe: true
    });
    //  组合生成立方体
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    //  调整位置
    cube.position.set(-4, 3, 0);

    // add the cube to the scene
    //  添加到场景
    scene.add(cube);

    // create a sphere
    //  创建球体
    //  声明球缓冲几何体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    //  使用基础网格材质
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777FF,
        wireframe: true
    });
    //  生成球体
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    //  调整为位置
    sphere.position.set(20, 4, 2);

    // add the sphere to the scene
    //  添加到场景
    scene.add(sphere);

    // position and point the camera to the center of the scene
    //  调整相机位置
    camera.position.set(-30, 40, 30);
    //  调整相机看向场景
    camera.lookAt(scene.position);

    // add the output of the renderer to the html element
    //  将渲染内容放到到 #webgl-output下
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // render the scene
    //  渲染场景
    renderer.render(scene, camera);
}