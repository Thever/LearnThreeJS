function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {

    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.amount = 2;
    this.bevelThickness = 2;
    this.bevelSize = 0.5;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
    this.bevelEnabled = true;
    this.curveSegments = 12;
    this.steps = 1;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        var options = {
          // int，曲线上点的数量，默认值是12
          amount: controls.amount,
          //   float，设置原始形状上斜角的厚度。默认值为0.2。
          bevelThickness: controls.bevelThickness,
          //  float。斜角与原始形状轮廓之间的延伸距离，默认值为bevelThickness-0.1。
          bevelSize: controls.bevelSize,
          //  int。斜角的分段层数，默认值为3。
          bevelSegments: controls.bevelSegments,
          //  bool，对挤出的形状应用是否斜角，默认值为true。
          bevelEnabled: controls.bevelEnabled,
          // int，曲线上点的数量，默认值是12。
          curveSegments: controls.curveSegments,
          // int，用于沿着挤出样条的深度细分的点的数量
          steps: controls.steps
        };
        //  挤压缓冲几何体(形状或者一个包含形状的数组，配置项)
        var geom = new THREE.ExtrudeGeometry(drawShape(), options)
        geom.applyMatrix(new THREE.Matrix4().makeScale(0.05,0.05,0.05));
        geom.center();

        return geom
      });
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'amount', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
  gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
  gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
  gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);


  // add a material section, so we can switch between materials
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)
  
  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})

  function drawShape() {
    //  获取svg路径
    var svgString = document.querySelector("#batman-path").getAttribute("d");
    //  将路径转换为西南工作
    var shape = transformSVGPathExposed(svgString);
    //  return the shape
    //  返回形状
    return shape;
  }

  

  var step = 0;
  controls.redraw();
  render();
  
  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.005
    controls.mesh.rotation.x = step
    controls.mesh.rotation.z = step

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}