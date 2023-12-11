function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;

  var step = 0;
  var spGroup;

  // setup the control gui
  var controls = new function () {
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return generatePoints()
      });
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'redraw');
  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})

  controls.redraw();
  var step = 0;
  render();

  function generatePoints() {
    //  如果存在生成的点就从场景中移除
    if (spGroup) scene.remove(spGroup)
    // add 10 random spheres
    //  随机生成点
    var points = [];
    for (var i = 0; i < 20; i++) {
      var randomX = -15 + Math.round(Math.random() * 30);
      var randomY = -15 + Math.round(Math.random() * 30);
      var randomZ = -15 + Math.round(Math.random() * 30);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }
    //  声明三维对象
    spGroup = new THREE.Object3D();
    //  声明材质
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false
    });
    //  便利生成点
    points.forEach(function (point) {
      //  球形
      var spGeom = new THREE.SphereGeometry(0.2);
      //  生成球体
      var spMesh = new THREE.Mesh(spGeom, material);
      //  球体使用生成的点的位置
      spMesh.position.copy(point);
      //  三维对象添加球体
      spGroup.add(spMesh);
    });
    // add the points as a group to the scene
    //  场景添加三维对象
    scene.add(spGroup);

    // use the same points to create a convexgeometry
    //  声明凸包几何体并传入点
    var convexGeometry = new THREE.ConvexGeometry(points);
    //  计算顶点法线向量
    convexGeometry.computeVertexNormals();
    //  计算面法相向量
    convexGeometry.computeFaceNormals();
    //  更新凸包几何体
    convexGeometry.normalsNeedUpdate = true;
    //  返回生成的凸包几何体
    return convexGeometry;
  }

  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.005
    controls.mesh.rotation.x = step
    controls.mesh.rotation.z = step

    if (spGroup) {
      spGroup.rotation.y = step
      spGroup.rotation.x = step
      spGroup.rotation.z = step
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}