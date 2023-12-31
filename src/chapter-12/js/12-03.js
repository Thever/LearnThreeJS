function init() {
  //  配置 physijs
  Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(50, 120, 220));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var scene = new Physijs.Scene;
  initDefaultLighting(scene, new THREE.Vector3(0, 50, 120));
  scene.add(new THREE.AmbientLight(0x0393939));
  //  添加物体容器
  var meshes = [];
  //  控制调整实例
  var controls = {
    //  添加球体
    addSphereMesh: function () {
        var sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(3, 20), getMaterial());
        setPosAndShade(sphere);
        meshes.push(sphere);
        scene.add(sphere);
    },
    //  添加立方体
    addBoxMesh: function() {
        var cube = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 2, 6), getMaterial());
        setPosAndShade(cube);
        meshes.push(cube);
        scene.add(cube);
    },
    //  添加圆柱体
    addCylinderMesh: function () {
        var cylinder = new Physijs.CylinderMesh(new THREE.CylinderGeometry(2, 2, 6), getMaterial());
        setPosAndShade(cylinder);
        meshes.push(cylinder);
        scene.add(cylinder);
    },
    //  添加圆锥体
    addConeMesh: function () {
        var cone = new Physijs.ConeMesh(new THREE.CylinderGeometry(0, 3, 7, 20, 10), getMaterial());
        setPosAndShade(cone);
        meshes.push(cone);
        scene.add(cone);
    },
    //  添加平面
    addPlaneMesh: function () {
        var plane = new Physijs.PlaneMesh(new THREE.PlaneGeometry(5, 5, 10, 10), getMaterial());
        setPosAndShade(plane);
        meshes.push(plane);
        scene.add(plane);
    },
    //  添加胶囊
    addCapsuleMesh: function () {
        var merged = new THREE.Geometry();
        var cyl = new THREE.CylinderGeometry(2, 2, 6);
        var top = new THREE.SphereGeometry(2);
        var bot = new THREE.SphereGeometry(2);

        var matrix = new THREE.Matrix4();
        matrix.makeTranslation(0, 3, 0);
        top.applyMatrix(matrix);

        var matrix = new THREE.Matrix4();
        matrix.makeTranslation(0, -3, 0);
        bot.applyMatrix(matrix);

        // merge to create a capsule
        merged.merge(top);
        merged.merge(bot);
        merged.merge(cyl);

        // create a physijs capsule mesh
        var capsule = new Physijs.CapsuleMesh(merged, getMaterial());
        setPosAndShade(capsule);

        meshes.push(capsule);
        scene.add(capsule);
    },
    //  添加图面提
    addConvexMesh: function () {
        var convex = new Physijs.ConvexMesh(new THREE.TorusKnotGeometry(3.5, 2.3, 64, 8, 2, 3, 10), getMaterial());
        setPosAndShade(convex);
        meshes.push(convex);
        scene.add(convex);
    },
    //  清除物体
    clearMeshes: function () {
        meshes.forEach(function (e) { scene.remove(e); });
        meshes = [];
    }
  };
  //  实例化dat.gui
  var gui = new dat.GUI();
  gui.add(controls, 'addPlaneMesh');
  gui.add(controls, 'addBoxMesh');
  gui.add(controls, 'addSphereMesh');
  gui.add(controls, 'addCylinderMesh');
  gui.add(controls, 'addConeMesh');
  gui.add(controls, 'addCapsuleMesh');
  gui.add(controls, 'addConvexMesh');
  gui.add(controls, 'clearMeshes');

  // setup the heightmap
  //  初始化平面
  var date = new Date();
  var pn = new Perlin('rnd' + date.getTime());
  var map = createHeightMap(pn);
  scene.add(map);
  //  渲染场景
  scene.simulate();
  render();

  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    //  更新渲染
    scene.simulate(undefined, 1);
  }
}
//  获取材质
function getMaterial() {
  var scale = chroma.scale(['blue', 'white', 'red', 'yellow']);
  return Physijs.createMaterial(new THREE.MeshPhongMaterial({color: scale(Math.random()).hex()}), 0.5, 0.7);
}
//  创建不规则面
function createHeightMap(pn) {

  var ground_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({map: THREE.ImageUtils.loadTexture('../../assets/textures/ground/grasslight-big.jpg')}), 0.3, 0.8);
  var ground_geometry = new THREE.PlaneGeometry(220, 200, 100, 100);
  for (var i = 0; i < ground_geometry.vertices.length; i++) {
      var vertex = ground_geometry.vertices[i];
      var value = pn.noise(vertex.x / 12, vertex.y / 12, 0);
      vertex.z = value * 13;
  }
  ground_geometry.computeFaceNormals();
  ground_geometry.computeVertexNormals();

  var ground = new Physijs.HeightfieldMesh(ground_geometry, ground_material, 0, 100, 100);
  ground.rotation.x = Math.PI / -2;
  ground.rotation.y = 0.5;
  ground.receiveShadow = true;

  return ground;
}
//  随机设置位置和旋转角度
function setPosAndShade(obj) {
  obj.position.set(Math.random() * 20 - 45, 40, Math.random() * 20 - 5);
  obj.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
  obj.castShadow = true;
}