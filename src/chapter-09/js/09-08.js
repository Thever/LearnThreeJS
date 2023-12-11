function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 15, 70);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  //  实例化 AnimationMixer , 动画播放器
  var mixer = new THREE.AnimationMixer();
  var clipAction
  var frameMesh
  var mesh
  
  initDefaultLighting(scene);
  //  实例化 JSONLoader
  var loader = new THREE.JSONLoader();
  //  加载.js 模型文件
  loader.load('../../assets/models/horse/horse.js', function (geometry, mat) {
      // console.log(`加载模型文件成功`)
      // console.log({ geometry, mat })
      //  geometry.morphNormals 包含了 faceNormals, vertexNormals
      //  geometry.morphTargets 包含了 name, vertices
      //  改模型文件包含的变形动画信息需要在建模的时候需要生成
      //  图形计算顶点法线
      geometry.computeVertexNormals();
      //  图形计算变形法线(让模型看起来更光滑)
      geometry.computeMorphNormals();

      var mat = new THREE.MeshLambertMaterial({
        //  定义材质是否使用morphTargets。默认值为false。
        //  开启后更光滑
        morphTargets: true, 
        //  顶点颜色，可以为物体的每一个顶点指定特有颜色。是否使用顶点着色。默认值为THREE.NoColors。 其他选项有THREE.VertexColors 和 THREE.FaceColors。
        //  THREE.NoColors 无颜色
        //  THREE.VertexColors 顶点颜色
        //  THREE.FaceColors。 面颜色
        vertexColors: THREE.FaceColors
      });
      //  组成物体
      mesh = new THREE.Mesh(geometry, mat);
      //  缩放
      mesh.scale.set(0.15,0.15,0.15);
      //  调整位置
      mesh.translateY(-10);
      mesh.translateX(10);
      //  实例化动画播放器，加载物体
      mixer = new THREE.AnimationMixer( mesh );
      // or create a custom clip from the set of morphtargets
      //  或者从变形动画中获取一个动作帧
      // var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 );
      //  获取形状的第一个动作帧
      animationClip = geometry.animations[0] 
      //  动画播放器播放动作帧，返回动画行为
      clipAction = mixer.clipAction( animationClip ).play();    
      //  设置动画重复播放
      clipAction.setLoop(THREE.LoopRepeat);
      //  场景添加物体
      scene.add(mesh)

      // enable the controls
      enableControls()
  })
  //  控制器内容
  var controls = {
    //  动作帧
    keyframe: 0,
    //  时间
    time: 0,
    //  时间缩放
    timeScale: 1,
    //  重复模式
    repetitions: Infinity,
    //  停用播放器所欲预定动作
    stopAllAction: function() {mixer.stopAllAction()},

    // warp
    //  过度开始帧
    warpStartTimeScale: 1,
    //  过度结束帧
    warpEndTimeScale: 1,
    //  过度的秒数
    warpDurationInSeconds: 2,
    //  过度方法
    warp: function() {clipAction.warp(controls.warpStartTimeScale, controls.warpEndTimeScale, controls.warpDurationInSeconds)},
    //  weight变更时间
    fadeDurationInSeconds: 2,
    //  weight从0到1
    fadeIn: function() {clipAction.fadeIn(controls.fadeDurationInSeconds)},
    //  weight从1到0
    fadeOut: function() {clipAction.fadeOut(controls.fadeDurationInSeconds)},
    //  有效重量，为0动画完全不印象宿主模型，为1为完全印象
    effectiveWeight: 0,
    //  有效时间缩放，为0时停止播放动画，也可以理解成动画播放速度
    effectiveTimeScale: 0
  }
  // control which keyframe to show
  //  实例化 dat.gui,并控制
  function enableControls() {
    var gui = new dat.GUI();
    var mixerFolder = gui.addFolder("AnimationMixer")
    mixerFolder.add(controls, "time").listen()
    mixerFolder.add(controls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(controls, "stopAllAction").listen()
    var actionFolder = gui.addFolder("AnimationAction")
    actionFolder.add(clipAction, "clampWhenFinished").listen();
    actionFolder.add(clipAction, "enabled").listen();
    actionFolder.add(clipAction, "paused").listen();
    //  THREE.LoopOnce  动画只播放依次
    //  THREE.LoopRepeat  动画重复播放
    //  THREE.LoopPingPong  动画正向反向播放
    actionFolder.add(clipAction, "loop", { LoopRepeat: THREE.LoopRepeat, LoopOnce: THREE.LoopOnce, LoopPingPong: THREE.LoopPingPong }).onChange(function(e) {
      if (e == THREE.LoopOnce || e == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(e), undefined);
        console.log(clipAction)
      } else {
        clipAction.setLoop(parseInt(e), controls.repetitions);
      }
    });
    actionFolder.add(controls, "repetitions", 0, 100).listen().onChange(function(e) {
      if (clipAction.loop == THREE.LoopOnce || clipAction.loop == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(clipAction.loop), undefined);
      } else {
        clipAction.setLoop(parseInt(e), controls.repetitions);
      }
    });
    actionFolder.add(clipAction, "time", 0, animationClip.duration, 0.001).listen()
    actionFolder.add(clipAction, "timeScale", 0, 5, 0.1).listen()
    actionFolder.add(clipAction, "weight", 0, 1, 0.01).listen()
    actionFolder.add(controls, "effectiveWeight", 0, 1, 0.01).listen()
    actionFolder.add(controls, "effectiveTimeScale", 0, 5, 0.01).listen()
    actionFolder.add(clipAction, "zeroSlopeAtEnd").listen()
    actionFolder.add(clipAction, "zeroSlopeAtStart").listen()
    actionFolder.add(clipAction, "stop")
    actionFolder.add(clipAction, "play")
    actionFolder.add(clipAction, "reset")
    actionFolder.add(controls, "warpStartTimeScale", 0, 10, 0.01)
    actionFolder.add(controls, "warpEndTimeScale", 0, 10, 0.01)
    actionFolder.add(controls, "warpDurationInSeconds", 0, 10, 0.01)
    actionFolder.add(controls, "warp")
    actionFolder.add(controls, "fadeDurationInSeconds", 0, 10, 0.01)
    actionFolder.add(controls, "fadeIn")
    actionFolder.add(controls, "fadeOut")
    //  截取动作帧
    gui.add(controls, "keyframe", 0, 15).step(1).onChange(function (frame) { showFrame(frame);});
  }

  //  截取动作帧
  function showFrame(frame) {
    //  如果场景添加了模型
    if (mesh) {
      //  移除原本的动作帧克隆体
      scene.remove(frameMesh);
      //  获取当前动作帧的顶点
      var newVertices = mesh.geometry.morphTargets[frame].vertices
      //  克隆当前物体
      frameMesh = mesh.clone();
      //  克隆体的顶点信息使用动作帧的顶点信息
      frameMesh.geometry.vertices = newVertices;
      //  克隆体调整位置
      frameMesh.translateX(-30);
      frameMesh.translateZ(-10);
      //  场景添加克隆体
      scene.add(frameMesh)
    }
  }

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
    //  存在动画播放器和动作切片
    if (mixer && clipAction) {
      //  更新动画播放器
      mixer.update( delta );
      //  更新播放时间
      controls.time = mixer.time;
      //  更新有效时间缩放
      controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      //  更新有效重量
      controls.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}