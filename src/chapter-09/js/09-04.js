function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  initDefaultLighting(scene);  

  var trackballControls = new THREE.TrackballControls(camera);
  //  旋转速度
  trackballControls.rotateSpeed = 1.0;
  //  缩放的速度
  trackballControls.zoomSpeed = 1.0;
  //  平移速度
  trackballControls.panSpeed = 1.0;

  //  实例化 OBJLoader
  var loader = new THREE.OBJLoader();
  //  导入 obj 模型文件
  loader.load("../../assets/models/city/city.obj", function (object) {
    //  chroma.js 获取要转换的颜色
    var scale = chroma.scale(['red', 'green', 'blue']);
    //  对象上的 红绿蓝色 随机调整为其他颜色
    setRandomColors(object, scale);
    //  获取颜色调整后的对象
    mesh = object ;
    //  场景添加对象
    scene.add(mesh);
  });

  render();
  function render() {
    stats.update();
    //  更新轨道球
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
