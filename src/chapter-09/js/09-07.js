function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  // Don't use the default lights, since that's a spotlight
  scene.add(new THREE.AmbientLight(0x222222));
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(50, 10, 0);
  scene.add(dirLight);

  //  实例化轨道控制器
  var orbitControls = new THREE.OrbitControls(camera);
  //  自动旋转
  orbitControls.autoRotate = true;
  //  材质贴图
  var planetTexture = new THREE.TextureLoader().load("../../assets/textures/mars/mars_1k_color.jpg");
  //  法相贴图
  var normalTexture = new THREE.TextureLoader().load("../../assets/textures/mars/mars_1k_normal.jpg");
  //  结合生成 Lambert网格材质
  var planetMaterial = new THREE.MeshLambertMaterial({map: planetTexture, normalMap: normalTexture});
  //  实例化球体后添加到场景
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 40, 40), planetMaterial))

  render();
  function render() {
    stats.update();
    //  更新轨道控制器
    orbitControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
