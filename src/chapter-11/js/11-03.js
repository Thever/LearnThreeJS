function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var textureLoader = new THREE.TextureLoader();

  // create a scene and add a light
  var scene = new THREE.Scene();
  var earthAndLight = addEarth(scene);
  var earth = earthAndLight.earth;
  var pivot = earthAndLight.pivot;

  // setup effects
  //  渲染通道
  var renderPass = new THREE.RenderPass(scene, camera);
  //  着色通道
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  //  指定渲染到屏幕
  effectCopy.renderToScreen = true;

  // define the composers
  // 声明效果合成器
  var composer1 = new THREE.EffectComposer(renderer);
  //  故障通道
  var glitchPass = new THREE.GlitchPass();
  //  加渲染通道
  composer1.addPass(renderPass);
  //  加故障通道
  composer1.addPass(glitchPass);
  //  将物体渲染到屏幕
  composer1.addPass(effectCopy);

  // 声明效果合成器
  var composer2 = new THREE.EffectComposer(renderer);
  //  半色调通道
  var halftonePass = new THREE.HalftonePass();
  //  加渲染通道
  composer2.addPass(renderPass);
  //  加半色调通道
  composer2.addPass(halftonePass);
  //  将物体渲染到屏幕
  composer2.addPass(effectCopy);

  // 声明效果合成器
  var composer3 = new THREE.EffectComposer(renderer);
  //  边缘通道
  var outlinePass = new THREE.OutlinePass(new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera, [earth]);
  //  加渲染通道
  composer3.addPass(renderPass);
  //  加边缘通道
  composer3.addPass(outlinePass);
  //  将物体渲染到屏幕
  composer3.addPass(effectCopy);

  // 声明效果合成器
  var composer4 = new THREE.EffectComposer(renderer);
  //  虚幻绽放通道
  var unrealBloomPass = new THREE.UnrealBloomPass();
  //  加渲染通道
  composer4.addPass(renderPass);
  //  加虚拟绽放通道
  composer4.addPass(unrealBloomPass);
  //  将物体渲染到屏幕
  composer4.addPass(effectCopy);

  // setup controls
  // 实例化dat.gui控制
  var gui = new dat.GUI();
  var controls = {};

  addGlitchPassControls(gui, controls, glitchPass, function(gp) {composer1.passes[1] = gp});
  addHalftonePassControls(gui, controls, halftonePass, function(htp) {
    composer2 = new THREE.EffectComposer(renderer);
    composer2.addPass(renderPass);
    composer2.addPass(htp);
    composer2.addPass(effectCopy);
  });
  addOutlinePassControls(gui, controls, outlinePass);
  addUnrealBloomPassControls(gui, controls, unrealBloomPass, function(ub) {
    composer4 = new THREE.EffectComposer(renderer);
    composer4.addPass(renderPass);
    composer4.addPass(ub);
    composer4.addPass(effectCopy);
  });
  
  // do the rendering to different parts
  var width = window.innerWidth;
  var height = window.innerHeight;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    renderer.autoClear = false;
    renderer.clear();
    
    renderer.setViewport(0, 0, halfWidth, halfHeight);
    composer1.render(delta);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    composer2.render(delta);
    
    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    composer3.render(delta);
    
    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    composer4.render(delta);

    requestAnimationFrame(render);
  }
}
