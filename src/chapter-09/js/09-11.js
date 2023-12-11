function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 70, 70);
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  var mixer = new THREE.AnimationMixer();
  var clipAction
  var animationClip
  var mesh
  var controls
  var mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function() {mixer.stopAllAction()},
  }
  
  initDefaultLighting(scene);
  //  实例化 JSONLoader
  var loader = new THREE.JSONLoader();
  //  导入json
  loader.load('../../assets/models/hand/hand-8.json', function (result) {
    //  组成模型
    var mesh = new THREE.SkinnedMesh(result, new THREE.MeshNormalMaterial({skinning: true}));
    //  缩放
    mesh.scale.set(18, 18, 18)
    //  场景添加物体
    scene.add(mesh);

    // setup the mixer
    //  实例化动画播放器
    mixer = new THREE.AnimationMixer( mesh );
    //  获取动作帧
    animationClip = mesh.geometry.animations[0];
    //  动画播放器播放动作帧，返回动画行为
    clipAction = mixer.clipAction( animationClip ).play();
    //  获取绑定的 animationClip 对象    
    animationClip = clipAction.getClip();

    // add the animation controls
    //  实例化动画控制
    enableControls();
  });

  function enableControls() {
    //  实例化dat.gui
    var gui = new dat.GUI();
    //  声明折叠文件夹
    var mixerFolder = gui.addFolder("AnimationMixer")
    //  监控属性值
    mixerFolder.add(mixerControls, "time").listen()
    mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(mixerControls, "stopAllAction").listen()
    //  添加动画属性监控
    controls = addClipActionFolder("ClipAction 1", gui, clipAction, animationClip);
  }

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction && controls) {
      //  更新动画播放器
      mixer.update( delta );
      //  更新时间
      controls.time = mixer.time;
      //  更新有效时间缩放
      controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      //  更新有效重量
      controls.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}