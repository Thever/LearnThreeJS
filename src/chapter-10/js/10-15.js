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
  var textureLoader = new THREE.TextureLoader();
  var groundPlane = addLargeGroundPlane(scene, true)
  groundPlane.position.y = -8;

  initDefaultLighting(scene);
  var spotLight = scene.getObjectByName("spotLight");
  spotLight.intensity = 0.1;
  scene.remove(scene.getObjectByName("ambientLight"))

  var gui = new dat.GUI();
  var controls = {
    lightIntensity: 0.1
  };

  var cubeMaterial = new THREE.MeshStandardMaterial({
      //  材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。
      emissive: 0xffffff,
      //  设置放射（发光）贴图。默认值为null。放射贴图颜色由放射颜色和强度所调节。 如果你有一个放射贴图，请务必将放射颜色设置为黑色以外的其他颜色。
      emissiveMap: textureLoader.load("../../assets/textures/emissive/lava.png"),
      //  法线贴图
      normalMap: textureLoader.load("../../assets/textures/emissive/lava-normals.png"),
      //  金属贴图
      metalnessMap: textureLoader.load("../../assets/textures/emissive/lava-smoothness.png"),
      //  金属度
      metalness: 1,
      //  粗糙度
      roughness: 0.4,
      //  法线贴图对材质的影响程度。典型范围是0-1。默认值是Vector2设置为（1,1）。
      normalScale: new THREE.Vector2(4,4)
  });

  var cube = new THREE.BoxGeometry(16, 16, 16)
  var cube1 = addGeometryWithMaterial(scene, cube, 'cube', gui, controls, cubeMaterial);
  cube1.rotation.y = 1/3*Math.PI;
  cube1.position.x = -12;

  var sphere = new THREE.SphereGeometry(9, 50, 50)
  var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, cubeMaterial.clone());
  sphere1.rotation.y = 1/6*Math.PI;
  sphere1.position.x = 15;

  gui.add(controls, "lightIntensity", 0, 1, 0.01).onChange(function(e) {
    spotLight.intensity = e
  });
  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube1.rotation.y += 0.01;
    sphere1.rotation.y -= 0.01;
  }
}
