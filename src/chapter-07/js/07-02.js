function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var clock = new THREE.Clock();
  var trackballControls = initTrackballControls(camera, renderer);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;

  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  createPoints();
  render();

  function createPoints() {
    //  声明几何体
    var geom = new THREE.Geometry();
    //  声明点材质
    var material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      color: 0xffffff
    });
    //  便利循环点
    for (var x = -15; x < 15; x++) {
      for (var y = -10; y < 10; y++) {
        //  获取位置，三维向量形式
        var particle = new THREE.Vector3(x * 4, y * 4, 0);
        //  添加顶点位置
        geom.vertices.push(particle);
        //  添加随机颜色
        geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
      }
    }
    //  实例化点对象，点对象渲染效果和精灵差不多，但是能节约性能
    var cloud = new THREE.Points(geom, material);
    //  添加到场景
    scene.add(cloud);
  }


  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}