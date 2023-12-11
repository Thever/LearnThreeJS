function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  initDefaultLighting(scene);  
  //  实例化飞行控制器
  var flyControls = new THREE.FlyControls(camera);
  //  移动速度
  flyControls.movementSpeed = 25;
  //  用于监听鼠标/触摸事件
  flyControls.domElement = document.querySelector("webgl-output");
  //  旋转速度。默认为0.005。
  flyControls.rollSpeed = Math.PI / 24;
  //  自动向前
  flyControls.autoForward = true;
  //  若该值设为true，你将只能通过执行拖拽交互来环视四周。默认为false。
  flyControls.dragToLook = false;

  var loader = new THREE.OBJLoader();
  loader.load("../../assets/models/city/city.obj", function (object) {
    //  随机调整颜色
    var scale = chroma.scale(['red', 'green', 'blue']);
    setRandomColors(object, scale);
    mesh = object ;
    scene.add(mesh);
  });

  render();
  function render() {
    stats.update();
    //  更新飞行控制器
    flyControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
