function init() {
  //  pysijs配置基础参数
  Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(10, 10, 10));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 / 60});
  scene.setGravity(new THREE.Vector3(0, -10, 0));

  initDefaultLighting(scene);
  //  声明材质
  ground_material = Physijs.createMaterial(new THREE.MeshStandardMaterial(), 0, 0);

  //  实例化柱子
  ground = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 100), ground_material, 0);
  ground.receiveShadow = true;

  scene.add(ground);
  //  物理引擎渲染
  scene.simulate();
  //  创建点串
  createPointToPoint(scene);
  //  渲染
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //  物理引擎更新
    scene.simulate(undefined, 1);
  }
}
//  创建点串
function createPointToPoint(scene) {
  var beads = [];
  var rangeMin = -10;
  var rangeMax = 10;
  var count = 20;
  var scale = chroma.scale(['red', 'yellow']);
  //  生成球体
  for (var i = 0 ; i < count ; i++) {
    //  球体形状
    var bead = new THREE.SphereGeometry(0.5);
    //  生成连续的点
    var physBead = new Physijs.SphereMesh(bead, Physijs.createMaterial(new THREE.MeshStandardMaterial({color: scale(Math.random()).hex()}), 0, 0)); 
    physBead.position.set(i * (-rangeMin + rangeMax)/count + rangeMin, 10, Math.random()/2);
    scene.add(physBead);
    if (i != 0) {
      //  限制移动位置，参数(链接对象1，链接对象2，约束的位置)
      var beadConstraint = new Physijs.PointConstraint(beads[i-1], physBead, physBead.position);
      scene.addConstraint(beadConstraint);
    }
    physBead.castShadow = true;
    beads.push(physBead);
  }
}