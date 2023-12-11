function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  addLargeGroundPlane(scene);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-0, 30, 60);
  spotLight.castShadow = true;
  spotLight.intensity = 0.6;
  scene.add(spotLight);

  // call the render function
  var step = 0;
  //  网格标准材质
  var material = new THREE.MeshStandardMaterial({color: 0x7777ff})
  var controls = new function () {
    //  颜色
    this.color = material.color.getStyle();
    //  发光色
    this.emissive = material.emissive.getStyle();
  };

  var gui = new dat.GUI();
  
  addBasicMaterialSettings(gui, controls, material);
  addMeshSelection(gui, controls, material, scene);
  var spGui = gui.addFolder("THREE.MeshStandardMaterial");
  spGui.addColor(controls, 'color').onChange(function (e) {
    material.color.setStyle(e)
  });
  spGui.addColor(controls, 'emissive').onChange(function (e) {
    material.emissive = new THREE.Color(e);
  });
  //  金属感程度
  spGui.add(material, 'metalness', 0, 1, 0.01);
  //  粗糙程度
  spGui.add(material, 'roughness', 0, 1, 0.01);
  //  是否渲染为线框
  spGui.add(material, 'wireframe');
  //  线框宽度
  spGui.add(material, 'wireframeLinewidth', 0, 20);

  camera.lookAt(controls.selected.position);
  render();

  function render() {
    stats.update();

    if (controls.selected) controls.selected.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}