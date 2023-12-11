function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene and add a light
  var scene = new THREE.Scene();
  var earthAndLight = addEarth(scene);
  var earth = earthAndLight.earth;
  var pivot = earthAndLight.pivot;

  // setup effects
  //  渲染通道，链接后期通道和各种效果通道
  var renderPass = new THREE.RenderPass(scene, camera);
  //  电影通道，特效通道
  var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
  //  指定合成器使用电影通道后将内容渲染到屏幕上
  effectFilm.renderToScreen = true;


  //  效果合成器
  var composer = new THREE.EffectComposer(renderer);
  //  合成器添加效果
  //  添加渲染通道
  composer.addPass(renderPass);
  //  添加电影通道，由于电影通道指定了 effectFilm.renderToScreen = true ,内容就会渲染到屏幕上
  composer.addPass(effectFilm);

  // setup controls
  //  实例化 dat.gui 进行控制
  var gui = new dat.GUI();
  var controls = {};
  addFilmPassControls(gui, controls, effectFilm);
  
  // do the basic rendering
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    //  更新轨道控制球
    trackballControls.update(delta);
    //  旋转地球
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    // request next and render using composer
    // 逐帧渲染
    requestAnimationFrame(render);
    // 调用合成器渲染内容
    composer.render(delta);
  }
}
