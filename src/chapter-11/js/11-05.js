function init() {


  // for the bokeh effect

  // 1. add a cubemap
  // 2. render a torusknot in the middle.
  // 3. render a sphere to the right and the left halfway
  // 4. render a wall of cubes at a distance

    // use the defaults
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera(new THREE.Vector3(0, 20, 40));
    camera.far = 300;
    camera.updateProjectionMatrix();
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
  
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // and add some simple default lights
    var scene = new THREE.Scene();
    initDefaultLighting(scene);
    //  加地面
    var groundPlane = addLargeGroundPlane(scene, true)
    groundPlane.position.y = -8;
    //  实例化dat.gui控制
    var gui = new dat.GUI();
    var controls = {
      normalScaleX: 1,
      normalScaleY: 1
    };
    //  实例化纹理加载器
    var textureLoader = new THREE.TextureLoader();
    //  六面材质贴图资源
    var urls = [
        '../../assets/textures/cubemap/flowers/right.png',
        '../../assets/textures/cubemap/flowers/left.png',
        '../../assets/textures/cubemap/flowers/top.png',
        '../../assets/textures/cubemap/flowers/bottom.png',
        '../../assets/textures/cubemap/flowers/front.png',
        '../../assets/textures/cubemap/flowers/back.png'
    ];
    //  实例化立方体纹理加载器
    var cubeLoader = new THREE.CubeTextureLoader();
    //  球体纹理
    var sphereMaterial = new THREE.MeshStandardMaterial({
        //  加载六面环境纹理贴图
        envMap: cubeLoader.load(urls),
        color: 0xffffff,
        metalness: 1,
        roughness: 0.3,
    });
    //  法线贴图
    sphereMaterial.normalMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg");
    //  ao环境贴图
    sphereMaterial.aoMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg");
    //  光照贴图
    sphereMaterial.shininessMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg");
    //  球形
    var sphere = new THREE.SphereGeometry(5, 50, 50)
    //  实例化球形
    var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);
    //  调整位置
    sphere1.position.x = 0;
    
    //  盒子材质1
    var boxMaterial1 = new THREE.MeshStandardMaterial({color: 0x0066ff});
    //  盒子形状1
    var m1 = new THREE.BoxGeometry(10, 10, 10);
    //  实例化盒子1
    var m1m = addGeometryWithMaterial(scene, m1, 'm1', gui, controls, boxMaterial1);
    //  调整位置
    m1m.position.z = -40;
    m1m.position.x = -35;
    m1m.rotation.y = 1;

    //  盒子材质2
    var m2 = new THREE.BoxGeometry(10, 10, 10);
    //  盒子形状2
    var boxMaterial2 = new THREE.MeshStandardMaterial({color: 0xff6600});
    //  实例化盒子2
    var m2m = addGeometryWithMaterial(scene, m2, 'm2', gui, controls, boxMaterial2);
    //  调整位置
    m2m.position.z = -40;
    m2m.position.x = 35;
    m2m.rotation.y = -1;

    //  盒子空间宽度
    var totalWidth = 220;
    //  盒子数量
    var nBoxes = 10;
    //  生成盒子
    for (var i = 0 ; i < nBoxes ; i++) {
      var box = new THREE.BoxGeometry(10, 10, 10);
      var mat = new THREE.MeshStandardMaterial({color: 0x66ff00});
      var mesh = new THREE.Mesh(box, mat);
      mesh.position.z = -120;
      mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i;
      mesh.rotation.y = i;
      scene.add(mesh);
    }
    //  配置参数
    var params = {
      focus:  10,
      aspect: camera.aspect,
      aperture: 0.0002,
      maxblur: 1,
    };

    //  渲染通道
    var renderPass = new THREE.RenderPass(scene, camera);
    //  景深通道
    var bokehPass = new THREE.BokehPass(scene, camera, params)
    //  渲染到屏幕
    bokehPass.renderToScreen = true;
  
    //  实例化合成器
    var composer = new THREE.EffectComposer(renderer);
    //  加渲染通道
    composer.addPass(renderPass);
    //  加景深通道，并渲染到屏幕
    composer.addPass(bokehPass);

    //  dat.gui 控制器添加控制内容
    addShaderControl(gui, "Bokeh", bokehPass.materialBokeh , { floats: [
      { key: "focus", from: 10, to: 200, step: 0.01 },
      { key: "aperture", from: 0, to: 0.0005, step: 0.000001 },
      { key: "maxblur", from: 0, to: 1, step: 0.1 },
    ]}, false)
  
    render();
    function render() {
      stats.update();
      var delta = clock.getDelta()
      trackballControls.update(delta);
      requestAnimationFrame(render);
      composer.render(delta);
      //  球体渲染
      sphere1.rotation.y -= 0.01;
    }
  }
  