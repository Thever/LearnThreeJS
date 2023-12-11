function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  // var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  // var renderer = new THREE.WebGLRenderer();

  // renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMapEnabled = false;

  // position and point the camera to the center of the scene
  // camera.position.x = -40;
  // camera.position.y = 40;
  // camera.position.z = 40;
  // camera.lookAt(scene.position);

  // add subtle ambient lighting
  //        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  //        scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  //  定义网格基类
  var group = new THREE.Mesh();
  // add all the rubik cube elements
  //  定义材质数组
  var mats = [];
  mats.push(new THREE.MeshBasicMaterial({
    color: 0x009e60
  }));
  // mats.push(new THREE.MeshBasicMaterial({
    // color: 0x009e60
  // }));
  mats.push(new THREE.MeshBasicMaterial({
    color: 0x0051ba
  }));
  // mats.push(new THREE.MeshBasicMaterial({
    // color: 0x0051ba
  // }));
  mats.push(new THREE.MeshBasicMaterial({
    color: 0xffd500
  }));
  // mats.push(new THREE.MeshBasicMaterial({
    // color: 0xffd500
  // }));
  mats.push(new THREE.MeshBasicMaterial({
    color: 0xff5800
  }));
  // mats.push(new THREE.MeshBasicMaterial({
    // color: 0xff5800
  // }));
  mats.push(new THREE.MeshBasicMaterial({
    color: 0xC41E3A
  }));
  // mats.push(new THREE.MeshBasicMaterial({
    // color: 0xC41E3A
  // }));
  mats.push(new THREE.MeshBasicMaterial({
    color: 0xffffff
  }));
  // mats.push(new THREE.MeshBasicMaterial({
    // color: 0xffffff
  // }));

  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      for (var z = 0; z < 3; z++) {
        //  定义立方缓冲几何体
        var cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
        //  生成立方体
        //  所有立方体的六个面颜色是一样的，拼在一起就形成了整体效果
        var cube = new THREE.Mesh(cubeGeom, mats);
        //  调整位置
        cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);
        //  添加到网格基类上
        group.add(cube);
      }
    }
  }

  //  使用三维向量的scale值，其实就是1，不应用外观
  // group.scale.copy(new THREE.Vector3(2,2,20))
  // call the render function
  //  scene添加group
  scene.add(group);
  var step = 0;

  var controls = new function () {
    this.rotationSpeed = 0.01;
    this.numberOfObjects = scene.children.length;
  };

  var gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);

  render();

  debugger;
  
  function render() {
    stats.update();
    //  group旋转
    group.rotation.y = step += controls.rotationSpeed;
    group.rotation.z = step -= controls.rotationSpeed;
    group.rotation.x = step += controls.rotationSpeed;
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}