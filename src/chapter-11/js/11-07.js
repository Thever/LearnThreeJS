function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var textureLoader = new THREE.TextureLoader();

  // create a scene and add a light
  //  实例化场景
  var scene = new THREE.Scene();
  //  指定场景背景图
  scene.background = textureLoader.load("../../assets/textures/bg/starry-deep-outer-space-galaxy.jpg");
  //  添加地球
  var earthAndLight = addEarth(scene);
  var earth = earthAndLight.earth;
  var pivot = earthAndLight.pivot;

  // setup effects
  // 初始化各种后期通道
  //  渲染通道
  var renderPass = new THREE.RenderPass(scene, camera);
  //  自定义着色器，使用纹理复制
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  //  复制纹理指定渲染到屏幕
  effectCopy.renderToScreen = true;
  //  漂白着色器
  var bleachByPassFilter = new THREE.ShaderPass(THREE.BleachBypassShader);
  //  亮度对比度着色器
  var brightnessContrastShader = new THREE.ShaderPass(THREE.BrightnessContrastShader)
  //  颜色化着色器
  var colorifyShader = new THREE.ShaderPass(THREE.ColorifyShader);
  //  颜色修正着色器
  var colorCorrectionShader = new THREE.ShaderPass(THREE.ColorCorrectionShader);
  //  FreiChen着色器，非现实主义渲染、梦幻般的视觉效果等
  var freiChenShader = new THREE.ShaderPass(THREE.FreiChenShader);
  //  伽马校正着色器
  var gammaCorrectionShader = new THREE.ShaderPass(THREE.GammaCorrectionShader);
  //  色调饱和度着色器
  var hueSaturationShader = new THREE.ShaderPass(THREE.HueSaturationShader);
  //  万花筒着色器
  var kaleidoShader = new THREE.ShaderPass(THREE.KaleidoShader);
  //  亮度高通滤波着色器
  var luminosityHighPassShader = new THREE.ShaderPass(THREE.LuminosityHighPassShader);
  //  材质颜色着色器
  var luminosityShader = new THREE.ShaderPass(THREE.LuminosityShader);
  //  镜面着色器
  var mirrorShader = new THREE.ShaderPass(THREE.MirrorShader);
  //  像素着色器
  var pixelShader = new THREE.ShaderPass(THREE.PixelShader);
  //  指定值为二维向量
  pixelShader.uniforms.resolution.value = new THREE.Vector2(256, 256);
  //  色彩偏移着色器
  var rgbShiftShader = new THREE.ShaderPass(THREE.RGBShiftShader);
  //  乌贼墨着色器
  var sepiaShader = new THREE.ShaderPass(THREE.SepiaShader);
  //  Sobel 算子着色器
  var sobelOperatorShader = new THREE.ShaderPass(THREE.SobelOperatorShader);
  //  将值指定为二维向量
  sobelOperatorShader.uniforms.resolution.value = new THREE.Vector2(256, 256);
  //  镜头渐晕着色器
  var vignetteShader = new THREE.ShaderPass(THREE.VignetteShader);
  
  //  实例化合成器，并加载后期通道
  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bleachByPassFilter);
  composer.addPass(brightnessContrastShader);
  composer.addPass(colorifyShader);
  composer.addPass(colorCorrectionShader);
  composer.addPass(freiChenShader);
  composer.addPass(gammaCorrectionShader);
  composer.addPass(hueSaturationShader);
  composer.addPass(kaleidoShader);
  composer.addPass(luminosityHighPassShader);
  composer.addPass(luminosityShader);
  composer.addPass(mirrorShader);
  composer.addPass(pixelShader);
  composer.addPass(rgbShiftShader);
  composer.addPass(sepiaShader);
  composer.addPass(sobelOperatorShader);
  composer.addPass(vignetteShader);
  composer.addPass(effectCopy);

  // setup controls
  // 实例化 dat.gui
  var gui = new dat.GUI();
  var controls = {};

  addShaderControl(gui, "BleachBypass", bleachByPassFilter, { floats: [{ key: "opacity", from: 0, to: 2, step: 0.01 }]})
  addShaderControl(gui, "BrightnessContrast", brightnessContrastShader, { floats: [ { key: "brightness", from: 0, to: 1, step: 0.01 }, { key: "contrast", from: 0, to: 1, step: 0.01 } ] })
  addShaderControl(gui, "Colorify", colorifyShader, { colors: [ {key: "color"}] });
  addShaderControl(gui, "ColorCorrection", colorCorrectionShader, {
    vector3: [
      { key: "powRGB", from: {x: 0, y: 0, z:0}, to: {x:5, y:5, z:5}, step: {x:0.01, y:0.01, z:0.01}},
      { key: "mulRGB", from: {x: 0, y: 0, z:0}, to: {x:5, y:5, z:5}, step: {x:0.01, y:0.01, z:0.01}},
      { key: "addRGB", from: {x: 0, y: 0, z:0}, to: {x:1, y:1, z:1}, step: {x:0.01, y:0.01, z:0.01}}
    ]
  });
  addShaderControl(gui, "FreiChen", freiChenShader, { vector2: [{ key: "aspect", from: {x: 128, y:128}, to: {x: 1024, y: 1024}, step:{x:1, y:1}}]})
  addShaderControl(gui, "GammaCorrection", gammaCorrectionShader, {});
  addShaderControl(gui, "HueSaturation", hueSaturationShader, { floats: [{ key: "hue", from: -1, to: 1, step: 0.01 }, { key: "saturation", from: -1, to: 1, step: 0.01 }]})
  addShaderControl(gui, "Kaleido", kaleidoShader, { floats: [{ key: "sides", from: 0, to: 20, step: 1 }, { key: "angle", from: 0, to: 6.28, step: 0.01 }]})
  addShaderControl(gui, "LuminosityHighPass", luminosityHighPassShader, {colors: [ {key: "defaultColor"}], floats: [{ key: "luminosityThreshold", from: 0, to: 2, step: 0.01 }, { key: "smoothWidth", from: 0, to: 2, step: 0.01 },  { key: "defaultOpacity", from: 0, to: 1, step: 0.01 }]});
  addShaderControl(gui, "Luminosity", luminosityShader, {});
  addShaderControl(gui, "Mirror", mirrorShader, { floats: [{ key: "side", from: 0, to: 3, step: 1 }]})
  addShaderControl(gui, "Pixel", pixelShader, { vector2: [{ key: "resolution", from: {x: 2, y:2}, to: {x: 512, y: 512}, step:{x:1, y:1}}], floats: [{ key: "pixelSize", from: 0, to: 10, step: 1 }]})
  addShaderControl(gui, "rgbShift", rgbShiftShader, { floats: [{key: "angle", from: 0, to: 6.28, step: 0.001}, { key: "amount", from: 0, to: 0.5, step: 0.001 }]})
  addShaderControl(gui, "sepia", sepiaShader, { floats: [{ key: "amount", from: 0, to: 10, step: 0.01 }]})
  addShaderControl(gui, "sobelOperator", sobelOperatorShader, {  vector2: [{ key: "resolution", from: {x: 2, y:2}, to: {x: 512, y: 512}, step:{x:1, y:1}}]})
  addShaderControl(gui, "vignette", vignetteShader, { floats: [{ key: "offset", from: 0, to: 10, step: 0.01 }, { key: "darkness", from: 0, to: 10, step: 0.01 }]})

  // do the basic rendering
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    //  地球旋转
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
