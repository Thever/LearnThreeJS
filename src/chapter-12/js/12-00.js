function init() {
  //  指定物理引擎配置
  Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(10, 10, 10));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  //  使用 Physijs 物理引擎创建场景
  scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 / 60});
  //  设置重力，这里设置 y = -10 的重力
  scene.setGravity(new THREE.Vector3(0, -10, 0));

  initDefaultLighting(scene);

  
  //  物理引擎渲染场景
  scene.simulate();
  
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //  更新场景内容
    scene.simulate(undefined, 1);
  }
}

