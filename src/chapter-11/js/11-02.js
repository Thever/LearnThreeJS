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
  //  渲染通道，从零开始渲染
  var renderPass = new THREE.RenderPass(scene, camera);
  //  着色通道
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  //  指定合成器使用电影通道后将内容渲染到屏幕上
  effectCopy.renderToScreen = true;


  //  实例化合成器,作为默认场景效果输出
  var composer = new THREE.EffectComposer(renderer);
  //  添加渲染通道
  composer.addPass(renderPass);
  //  添加作色通道，将内容直接渲染到屏幕上
  composer.addPass(effectCopy);

  // reuse the rendered scene from the composer
  // 将默认渲染效果用 TexturePass 处理作为变量，让其他合成器使用
  var renderedScene = new THREE.TexturePass(composer.renderTarget2); 

  // define the composers
  //  电影合成器
  var effectFilmComposer = new THREE.EffectComposer(renderer);
  //  电影通道
  var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
  //  渲染到屏幕  
  effectFilm.renderToScreen = true;
  //  渲染变量内容
  effectFilmComposer.addPass(renderedScene);
  //  添加电影效果
  effectFilmComposer.addPass(effectFilm);

  //  爆炸合成器
  var bloomComposer = new THREE.EffectComposer(renderer);
  //  爆炸通道
  var bloomPass = new THREE.BloomPass();    
  //  渲染变量结果
  bloomComposer.addPass(renderedScene);
  //  添加爆炸通道
  bloomComposer.addPass(bloomPass);
  //  渲染到屏幕上
  bloomComposer.addPass(effectCopy);

  //  点合成器
  var dotScreenComposer = new THREE.EffectComposer(renderer);
  //  点屏幕通道
  var dotScreenPass = new THREE.DotScreenPass();   
  //  渲染变量内容
  dotScreenComposer.addPass(renderedScene);
  //  加点屏幕点效果
  dotScreenComposer.addPass(dotScreenPass);
  //  渲染到屏幕上
  dotScreenComposer.addPass(effectCopy);

  // setup controls
  // 实例化 dat.gui()
  var gui = new dat.GUI();
  var controls = {};
  
  addFilmPassControls(gui, controls, effectFilm);
  addDotScreenPassControls(gui, controls, dotScreenPass);
  addBloomPassControls(gui, controls, bloomPass, function(updated) {bloomComposer.passes[1] = updated;});
  
  // do the basic rendering, since we render to multiple parts of the screen
  // determine the 
  var width = window.innerWidth;
  var height = window.innerHeight;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    //  旋转
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;
    //  关闭自动清理
    renderer.autoClear = false;
    //  清除内容
    renderer.clear();
    
    //  调整视图
    renderer.setViewport(0, 0, halfWidth, halfHeight);
    //  重新渲染
    effectFilmComposer.render(delta);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    bloomComposer.render(delta);
    
    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    dotScreenComposer.render(delta);
    
    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    composer.render(delta);

    requestAnimationFrame(render);
  }
}
