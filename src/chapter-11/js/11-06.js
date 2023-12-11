function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();

  //  定义渲染数量
  var amount = 50;
  //  随机生成坐标的区间
  var xRange = 20;
  var yRange = 20;
  var zRange = 20;

  //  定义group
  var totalGroup = new THREE.Group();
  //  随机生成立方体
  for ( var i = 0 ; i < amount ; i++) {
    //  固定形状
    var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    //  随机颜色
    var material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
    //  合成物体
    var boxMesh = new THREE.Mesh(boxGeometry, material);

    //  指定范围内随机生成坐标位置
    var rX = Math.random() * xRange - xRange / 2;
    var rY = Math.random() * yRange - yRange / 2;
    var rZ = Math.random() * zRange - zRange / 2;

    //  最大旋转角度
    var totalRotation = 2*Math.PI;
    //  设置位置
    boxMesh.position.set(rX, rY, rZ);
    //  x,y,z轴随机旋转
    boxMesh.rotation.set(Math.random() * totalRotation,Math.random() * totalRotation,Math.random() * totalRotation)
    //  生成物体添加到group
    totalGroup.add(boxMesh);
  } 
  //  group内容添加到场景
  scene.add(totalGroup);
  
  //  渲染通道
  var renderPass = new THREE.RenderPass(scene, camera);
  //  ao环境通道
  var aoPass = new THREE.SSAOPass(scene, camera);
  //  指定渲染到屏幕
  aoPass.renderToScreen = true;

  //  实例化合成器
  var composer = new THREE.EffectComposer(renderer);
  //  添加渲染通道
  composer.addPass(renderPass);
  //  添加ao环境通道
  composer.addPass(aoPass);
  
  //  实例化 dat.gui,添加内容
  addShaderControl(new dat.GUI(), "SSAO", aoPass , { setEnabled: false, 
    floats: [
      { key: "radius", from: 1, to: 10, step: 0.1 },
      { key: "aoClamp", from: 0, to: 1, step: 0.01 },
      { key: "lumInfluence", from: 0, to: 2, step: 0.01 },
    ],
    booleans: [
      {key: "onlyAO"}
    ]
  })

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta()
    trackballControls.update(delta);
    requestAnimationFrame(render);
    //  group整体旋转
    totalGroup.rotation.x += 0.0001;
    totalGroup.rotation.y += 0.001;
    composer.render(delta);
  }
}
