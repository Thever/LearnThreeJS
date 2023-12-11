function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  initDefaultLighting(scene);  
  //  第一视角控制器
  var fpControls = new THREE.FirstPersonControls(camera);
  //  环视速度。默认为0.005。
  fpControls.lookSpeed = 0.4;
  //  移动速度。默认为1
  fpControls.movementSpeed = 20;
  //  是否能够垂直环视。默认为true。
  fpControls.lookVertical = true;
  //  垂直环视是否约束在[.verticalMin, .verticalMax]之间。默认值为false。
  fpControls.constrainVertical = true;
  //  你能够垂直环视角度的下限。范围在 0 到 Math.PI 弧度之间。默认为0。
  fpControls.verticalMin = 1.0;
  //  你能够垂直环视角度的上限。范围在 0 到 Math.PI 弧度之间。默认为Math.PI。
  fpControls.verticalMax = 2.0;
  //  设置坐标位置
  //  经度
  fpControls.lon = -150;
  //  维度
  fpControls.lat = 120;

  //  实例化 OBJLoader
  var loader = new THREE.OBJLoader();
  //  加载.obj模型
  loader.load("../../assets/models/city/city.obj", function (object) {
    //  随机设置颜色
    var scale = chroma.scale(['red', 'green', 'blue']);
    setRandomColors(object, scale);
    mesh = object ;
    scene.add(mesh);
  });

  render();
  function render() {
    stats.update();
    //  更新第一视角控制器
    fpControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
