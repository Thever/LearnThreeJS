function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  initDefaultLighting(scene);

  var gui = new dat.GUI();
  var controls = {
    normalScaleX: 1,
    normalScaleY: 1
  };

  var urls = [
      '../../assets/textures/cubemap/colloseum/right.png',
      '../../assets/textures/cubemap/colloseum/left.png',
      '../../assets/textures/cubemap/colloseum/top.png',
      '../../assets/textures/cubemap/colloseum/bottom.png',
      '../../assets/textures/cubemap/colloseum/front.png',
      '../../assets/textures/cubemap/colloseum/back.png'
  ];
  //  实例化 CubeTextureLoader
  var cubeLoader = new THREE.CubeTextureLoader();
  var textureLoader = new THREE.TextureLoader();
  //  加载纹理图片
  var cubeMap = cubeLoader.load(urls);
  scene.background = cubeMap;

  var cubeMaterial = new THREE.MeshStandardMaterial({
      //  环境纹理
      envMap: cubeMap,
      color: 0xffffff,
      metalness: 1,
      roughness: 0,
  });
  //  获取环境纹理
  var sphereMaterial = cubeMaterial.clone();
  //  法线贴图
  sphereMaterial.normalMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg");
  //  ao贴图
  sphereMaterial.aoMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg");
  //  光照贴图
  sphereMaterial.shininessMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg");
  //  实例化立方体相机拍摄内容
  var cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
  scene.add(cubeCamera);

  var cube = new THREE.CubeGeometry(26, 22, 12)
  //  定义cube1使用立方体配置
  var cube1 = addGeometryWithMaterial(scene, cube, 'cube', gui, controls, cubeMaterial);
  //  调整位置
  cube1.position.x = -15;
  //  旋转
  cube1.rotation.y = -1/3*Math.PI;
  //  立方体相机使用cube1位置，目的为了将立方体相机放在cube中心位置，好拍摄6个面，将结果作为为例赋值给立方体
  cubeCamera.position.copy(cube1.position);
  //  将立方体相机获得的结果作为立方体的环境纹理，
  cubeMaterial.envMap = cubeCamera.renderTarget;

  //  实例化球体
  var sphere = new THREE.SphereGeometry(5, 50, 50)
  var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);
  sphere1.position.x = 15;

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    //  隐藏cube1
    cube1.visible = false;
    //  更新立方体相机
    cubeCamera.updateCubeMap(renderer, scene);
    //  隐藏cube1
    cube1.visible = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    cube1.rotation.y += 0.01;
    sphere1.rotation.y -= 0.01;
  }
  
}
