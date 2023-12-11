function init() {

    var stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    //  渲染器开启阴影渲染
    renderer.shadowMap.enabled = true;

    // create the ground plane
    //  创建平面
    //  平面缓冲几何体
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    //  网格材质
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    //  组合形成物体
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //  接收阴影
    plane.receiveShadow = true;

    // rotate and position the plane
    //  进行旋转
    plane.rotation.x = -0.5 * Math.PI;
    //  设置位置
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    //  添加到场景
    scene.add(plane);

    // position and point the camera to the center of the scene
    //  相机调整
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    //  环境光
    var ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    // add spotlight for the shadows
    //  创建聚光灯光源
    var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI/4);
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.position.set(-40, 30, 30);
    //  点光源产生阴影
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    //  指定渲染容器
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    var step = 0;

    //  函数生成控制器对象，与立方体默认属性一致
    var controls = new function () {
        //  缩放
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        //  位置信息
        this.positionX = 0;
        this.positionY = 4;
        this.positionZ = 0;
        //  旋转信息
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;
        //  相对位置西悉尼
        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;
        //  是否渲染
        this.visible = true;

        this.translate = function () {
            //  旋转变换
            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);
            //  更新位置
            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;
        }
    };

    //  网格材质
    var material = new THREE.MeshLambertMaterial({color: 0x44ff44});
    //  立方缓冲几何体
    var geom = new THREE.BoxGeometry(5, 8, 3);

    //  使用多种材质渲染物体
    // var materials = [
    //   new THREE.MeshLambertMaterial({opacity: 0.8, color: 0x44ff44, transparent: true}),
    //   new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
    // ];

    // var cube = THREE.SceneUtils.createMultiMaterialObject(geom, materials);

    //  生成立方体
    var cube = new THREE.Mesh(geom, material);
    //  设置位置
    cube.position.y = 4;
    //  产生阴影
    cube.castShadow = true;
    //  场景添加立方体
    scene.add(cube);

    //  初始化dat.gui，控制属性变化
    var gui = new dat.GUI();

    guiScale = gui.addFolder('scale');
    guiScale.add(controls, 'scaleX', 0, 5);
    guiScale.add(controls, 'scaleY', 0, 5);
    guiScale.add(controls, 'scaleZ', 0, 5);

    guiPosition = gui.addFolder('position');
    var contX = guiPosition.add(controls, 'positionX', -10, 10);
    var contY = guiPosition.add(controls, 'positionY', -4, 20);
    var contZ = guiPosition.add(controls, 'positionZ', -10, 10);

    //  监听
    contX.listen();
    //  指定处理方法
    contX.onChange(function (value) {
        cube.position.x = controls.positionX;
        // cube.children[1].position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange(function (value) {
        cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange(function (value) {
        cube.position.z = controls.positionZ;
    });


    guiRotation = gui.addFolder('rotation');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    guiTranslate = gui.addFolder('translate');

    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    gui.add(controls, 'visible');

    //  初始化轨道球控制器
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();

    render();

    function render() {
        trackballControls.update(clock.getDelta());
        stats.update();
        //  将立方体是否显示与对应属性绑定
        cube.visible = controls.visible;

        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;

        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}