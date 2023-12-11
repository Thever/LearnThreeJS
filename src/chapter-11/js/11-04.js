function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var textureLoader = new THREE.TextureLoader();
  renderer.autoClear = false;

  // create the scenes
  //  地球场景
  var sceneEarth = new THREE.Scene();
  //  火星场景
  var sceneMars = new THREE.Scene();
  //  背景场景
  var sceneBG = new THREE.Scene();

  // create all the scenes we'll be rendering.
  //  指定背景场景背景
  sceneBG.background = textureLoader.load("../../assets/textures/bg/starry-deep-outer-space-galaxy.jpg");
  //  地球场景添加地球
  var earthAndLight = addEarth(sceneEarth);
  sceneEarth.translateX(-16);
  sceneEarth.scale.set(1.2, 1.2, 1.2);
  //  火星场景添加火星
  var marsAndLight = addMars(sceneMars);
  sceneMars.translateX(12);
  sceneMars.translateY(6);
  sceneMars.scale.set(0.2, 0.2, 0.2);

  // setup passes. First the main renderpasses. Note that
  // only the bgRenderpass clears the screen.
  //  背景渲染通道
  var bgRenderPass = new THREE.RenderPass(sceneBG, camera);
  //  地球渲染通道
  var earthRenderPass = new THREE.RenderPass(sceneEarth, camera);
  //  关闭自动清理
  earthRenderPass.clear = false;
  //  火星渲染通道
  var marsRenderPass = new THREE.RenderPass(sceneMars, camera);
  //  关闭自动清理
  marsRenderPass.clear = false;

  // setup the mask
  //  清空纹理缓存通道
  var clearMask = new THREE.ClearMaskPass();
  //  地球掩码通道
  var earthMask = new THREE.MaskPass(sceneEarth, camera);
  //  地球掩码通道
  var marsMask = new THREE.MaskPass(sceneMars, camera);

  // setup some effects to apply
  //  创建后期渲染效果
  //  深褐色通道
  var effectSepia = new THREE.ShaderPass(THREE.SepiaShader);
  //  更改值
  effectSepia.uniforms['amount'].value = 0.8;
  //  着色器通道
  var effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
  //  更改值
  effectColorify.uniforms['color'].value.setRGB(0.5, 0.5, 1);
  //  复制渲染效果
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  //  指定渲染到屏幕
  effectCopy.renderToScreen = true;
  
  //  效果合成器
  var composer = new THREE.EffectComposer(renderer);
  //  开启模板缓存
  composer.renderTarget1.stencilBuffer = true;
  composer.renderTarget2.stencilBuffer = true;
  //  加背景渲染通道
  composer.addPass(bgRenderPass);
  //  加地球渲染通道
  composer.addPass(earthRenderPass);
  //  加火星渲染通道
  composer.addPass(marsRenderPass);
  //  加火星遮罩
  composer.addPass(marsMask);
  //  加着色器遮罩
  composer.addPass(effectColorify);
  //  加清除遮罩
  composer.addPass(clearMask);
  //  加地球遮罩
  composer.addPass(earthMask);
  //  加深褐色通道
  composer.addPass(effectSepia);
  //  加清除遮罩
  composer.addPass(clearMask);
  //  渲染到屏幕
  composer.addPass(effectCopy);

  // setup controls
  // 实例化控制器
  var gui = new dat.GUI();
  var controls = {};
  addSepiaShaderControls(gui, controls, effectSepia);
  addColorifyShaderControls(gui, controls, effectColorify);
  
  // do the basic rendering
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    //  旋转
    earthAndLight.earth.rotation.y += 0.001;
    earthAndLight.pivot.rotation.y += -0.0003;
    marsAndLight.mars.rotation.y += -0.001;
    marsAndLight.pivot.rotation.y += +0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    //  合成器渲染
    composer.render(delta);
  }
}
