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
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -10;
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));
  //  实例化 DDSLoader
  var textureLoader = new THREE.DDSLoader();
  //  加载 dds 纹理文件
  var texture = textureLoader.load('../../assets/textures/dds/test-dxt1.dds');
  var gui = new dat.GUI();
  var controls = {};

  var polyhedron = new THREE.IcosahedronGeometry(8, 0);
  var polyhedronMesh = addGeometry(scene, polyhedron, 'polyhedron', texture, gui, controls);
  polyhedronMesh.position.x = 20;

  var sphere = new THREE.SphereGeometry(5, 20, 20)
  var sphereMesh = addGeometry(scene, sphere, 'sphere', texture, gui, controls);

  var cube = new THREE.BoxGeometry(10, 10, 10)
  var cubeMesh = addGeometry(scene, cube, 'cube', texture, gui, controls);
  cubeMesh.position.x = -20;

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    polyhedronMesh.rotation.x += 0.01;
    sphereMesh.rotation.y += 0.01;
    cubeMesh.rotation.z += 0.01;
  }
}
