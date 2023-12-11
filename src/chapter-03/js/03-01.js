function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // add ambient lighting
  //  环境光
  var ambientLight = new THREE.AmbientLight("#606008", 1);
  scene.add(ambientLight);

  // add spotlight for the shadows
  //  聚光灯光源
  var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.position.set(-30, 40, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // add a simple scene
  //  在场景中创建房子和树
  addHouseAndTree(scene)

  // add controls
  //  实例化dat.gui来控制渲染属性
  var controls = setupControls();

  // call the render function
  render();

  function render() {
    stats.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function setupControls() {
    var controls = new function () {
      this.intensity = ambientLight.intensity;
      //  获取颜色
      this.ambientColor = ambientLight.color.getStyle();
      this.disableSpotlight = false;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function (e) {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    });
    //  展示颜色
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(controls.ambientColor);
      ambientLight.intensity = controls.intensity;
    });
    gui.add(controls, 'disableSpotlight').onChange(function (e) {
      spotLight.visible = !e;
    });

    return controls;
  }
}