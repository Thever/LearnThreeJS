function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 15, 70);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  //  实例化动画播放器
  var mixer = new THREE.AnimationMixer();
  var clipAction
  var clipAction2
  var frameMesh
  var mesh
  
  initDefaultLighting(scene);

  function setupModel() {
    // initial cube
    //  
    var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    var cubeMaterial = new THREE.MeshLambertMaterial({
      //  定义材质是否使用morphTargets。默认值为false。
      //  morphTargets， 变形目标，也就是使用动画
      //  启用后生成的物体会生成morphNormals，morphTargets属性对象
      morphTargets: true, 
      color: 0xff0000
    });

    // define morphtargets, we'll use the vertices from these geometries
    //  定义变形目标，获取需要的变形顶点位置
    //  变长
    var cubeTarget1 = new THREE.BoxGeometry(2, 20, 2);
    //  变高
    var cubeTarget2 = new THREE.BoxGeometry(40, 2, 2);

    // define morphtargets and compute the morphnormal
    // console.log(`cubeGeometry`)
    // console.log(cubeGeometry)
    //  指定物体变形对象的name和顶点信息
    cubeGeometry.morphTargets[0] = {name: 't1', vertices: cubeGeometry.vertices};
    cubeGeometry.morphTargets[1] = {name: 't2', vertices: cubeTarget2.vertices};
    cubeGeometry.morphTargets[2] = {name: 't3', vertices: cubeTarget1.vertices};
    //  图形计算变形法线(让模型看起来更光滑)
    cubeGeometry.computeMorphNormals();
    // console.log(`cubeGeometry`)
    // console.log(cubeGeometry)

    //  结合形状和材质，生成物体
    var mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    // 调整位置
    mesh.position.x = 0;
    mesh.position.y = 3;
    mesh.position.z = 0;

    // add the cube to the scene
    // 场景添加物体
    scene.add(mesh);
    // 变量接收实例化的动画播放器
    mixer = new THREE.AnimationMixer( mesh );
    //  创建从第0帧位置到第1帧位置的动作帧
    //  .CreateFromMorphTargetSequence ( name : String, morphTargetSequence : Array, fps : Number, noLoop : Boolean ) : AnimationClip
    //  返回一个由几何体变形目标数组(morph targets array)得到的新动画剪辑，接收名称和帧率参数。
    //  说明: 帧率是必须参数, 但是动画速度可能会在AnimationAction中被animationAction.setDuration方法重写。
    animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence('first', [cubeGeometry.morphTargets[0], cubeGeometry.morphTargets[1]], 1);
    //  创建从第0帧位置到第2帧位置的动作帧
    animationClip2 = THREE.AnimationClip.CreateFromMorphTargetSequence('second', [cubeGeometry.morphTargets[0], cubeGeometry.morphTargets[2]], 1);
    //  播放器播放动作帧返回动画行为用于控制
    //  .clipAction (clip : AnimationClip, optionalRoot : Object3D) : AnimationAction
    //  返回所传入的剪辑参数的AnimationAction, 根对象参数可选，默认值为混合器的默认根对象。第一个参数可以是动画剪辑(AnimationClip)对象或者动画剪辑的名称。
    //  如果不存在符合传入的剪辑和根对象这两个参数的动作, 该方法将会创建一个。传入相同的参数多次调用将会返回同一个剪辑实例。
    clipAction = mixer.clipAction( animationClip ).play();  
    clipAction2 = mixer.clipAction( animationClip2 ).play();
    //  动画行为设置循环播放
    clipAction.setLoop(THREE.LoopRepeat);
    clipAction2.setLoop(THREE.LoopRepeat);
    // enable the controls
    //  添加控制属性
    enableControls()
  }

  // control which keyframe to show
  var controls1
  var controls2
  var mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function() {mixer.stopAllAction()},
  }

  function enableControls() {
    var gui = new dat.GUI();
    var mixerFolder = gui.addFolder("AnimationMixer")
    mixerFolder.add(mixerControls, "time").listen()
    mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(mixerControls, "stopAllAction").listen()
    
    controls1 = addClipActionFolder("ClipAction 1", gui, clipAction, animationClip);
    controls2 = addClipActionFolder("ClipAction 2", gui, clipAction2, animationClip2);
  }

  setupModel();  
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
    //  存在播放器和动画控制实例
    if (mixer && clipAction) {
      //  更新动画
      mixer.update( delta );
      //  更新时间
      controls1.time = mixer.time;
      //  更新有效时间缩放
      controls1.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      //  更新有效重量
      controls1.effectiveWeight = clipAction.getEffectiveWeight();

      controls2.time = mixer.time;
      controls2.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls2.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}
