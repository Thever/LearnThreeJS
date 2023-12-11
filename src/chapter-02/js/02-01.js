function init() {
    //  实例化帧数插件
    var stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    //  创建场景
    var scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    //  创建相机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    // create a render and set the size
    //  创建渲染器
    var renderer = new THREE.WebGLRenderer();

    //  设置背景色
    renderer.setClearColor(new THREE.Color(0x000000));
    //  调整渲染器宽高
    renderer.setSize(window.innerWidth, window.innerHeight);
    //  允许渲染器渲染阴影
    renderer.shadowMap.enabled = true;

    // create the ground plane
    // 平面缓冲几何体，参数为x轴上长度，y轴上高度，宽度分段数，高度分段数
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    //  网格材质
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    //  生成平面
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //  平面接收阴影
    plane.receiveShadow = true;

    // rotate and position the plane
    //  旋转平面
    plane.rotation.x = -0.5 * Math.PI;
    //  调整平面位置
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    //  场景添加平面
    scene.add(plane);

    // position and point the camera to the center of the scene
    //  调整相机位置
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    //  相机朝向场景
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    //  添加环境光
    var ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    //  创建聚光灯光源
    var spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
    //  调整点光源位置
    spotLight.position.set(-40, 60, -10);
    //  点光源照射产生阴影
    spotLight.castShadow = true;
    //  场景添加点光源
    scene.add(spotLight);

    // add the output of the renderer to the html element
    //  指定渲染内容渲染到 #webgl-output
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    var step = 0;

    var controls = new function () {
        //  旋转速度
        this.rotationSpeed = 0.02;
        //  显示场景下的子类数量
        this.numberOfObjects = scene.children.length;

        //  移除立方体
        this.removeCube = function () {
            //  获取场景下所有的子类
            var allChildren = scene.children;
            //  获取最后一个添加的子类
            var lastObject = allChildren[allChildren.length - 1];
            //  判断最后一个是不是网格，因为子类可能时相机和光源
            if (lastObject instanceof THREE.Mesh) {
                //  如果是网格实例就移除
                scene.remove(lastObject);
                //  更新显示的数量
                this.numberOfObjects = scene.children.length;
            }
        };

        //  添加立方体
        this.addCube = function () {
            //  随机生成尺寸
            var cubeSize = Math.ceil((Math.random() * 3));
            //  随机生成形状大小
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            //  生成随机色材质
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            //  生成立方体
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            //  允许立方体产生阴影
            cube.castShadow = true;
            //  设置产生的立方体的唯一标识name
            //  方便后期使用 Three.Scene.getObjectByName(name) 来获取对象
            //  当然你也可以直接便利 scene.children 来获取内容
            cube.name = "cube-" + scene.children.length;


            // position the cube randomly in the scene
            //  随机设置生成的立方的位置
            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            // add the cube to the scene
            //  将生成的立方体添加到场景
            scene.add(cube);
            //  更新显示的数量
            this.numberOfObjects = scene.children.length;
        };
        //  输出当前场景下的子类
        this.outputObjects = function () {
            console.log(scene.children);
            //  查看最新添加的立方体的信息
            if(scene.children.length > 3)
                let getName = "cube-" + (scene.children.length - 1)
                console.log(scene.getObjectByName(getName))
            } else {
                console.log(`当前没有添加立方体`)
            }
        }
    };

    //  实例化dat.gui
    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    //  调用方法
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    //  监听值
    gui.add(controls, 'numberOfObjects').listen();

    // attach them here, since appendChild needs to be called first
    //  实例化轨迹球控制器，指定参数
    var trackballControls = initTrackballControls(camera, renderer);
    //  导入时钟模块
    var clock = new THREE.Clock();
    //  渲染调用
    render();
    
    function render() {
        //  传入渲染间隔时间，更新轨道求控制器
        trackballControls.update(clock.getDelta());
        //  更新帧数插件
        stats.update();

        // rotate the cubes around its axes
        //  遍历scene下的内容
        scene.traverse(function (e) {
            //  如果是 mesh 网格，并且部位平面
            if (e instanceof THREE.Mesh && e != plane) {
                //  就让其旋转
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        // render using requestAnimationFrame
        //  下一帧渲染调用本身
        requestAnimationFrame(render);
        //  渲染内容
        renderer.render(scene, camera);
    }
}