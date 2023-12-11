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


  // the points group
  var spGroup;

  // setup the control gui
  var controls = new function () {
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.segments = 12;
    this.phiStart = 0;
    this.phiLength = 2 * Math.PI;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return generatePoints(controls.segments, controls.phiStart, controls.phiLength);
      });
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);
  gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);

  // add a material section, so we can switch between materials
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})
  gui.add(controls, 'redraw');


  function generatePoints(segments, phiStart, phiLength) {
    //  场景中存在车削缓冲几何体就删除
    if (spGroup) scene.remove(spGroup)

    var points = [];
    var height = 5;
    var count = 30;
    //  生成连续变化的点
    for (var i = 0; i < count; i++) {
      points.push(new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, (i - count) +
        count / 2));
    }
    //  声明三维物体
    spGroup = new THREE.Object3D();
    //  声明材质
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false
    });
    //  便利生成的点
    points.forEach(function (point) {
      //  声明球体
      var spGeom = new THREE.SphereGeometry(0.2);
      var spMesh = new THREE.Mesh(spGeom, material);
      spMesh.position.set(point.x, point.y, 0);
      //  添加到三维物体中
      spGroup.add(spMesh);
    });
    // add the points as a group to the scene
    //  场景添加三维物体
    scene.add(spGroup);

    // use the same points to create a LatheGeometry
    //  车削缓冲几何体(横切面二维向量数组，生成的车削几何体圆周分段的数量，弧度表示的起始角度， 车削部分的弧度（0-2PI）范围)
    var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    return latheGeometry;
  }

  var step = 0;
  controls.redraw();
  render();
  
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

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}