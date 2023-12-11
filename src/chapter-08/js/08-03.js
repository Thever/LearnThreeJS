function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(0, 40, 50));

  //  实例化圆环缓冲扭结几何体
  var knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3));
  // add the sphere to the scene
  //  添加到场景
  scene.add(knot);

  // call the render function
  var step = 0;
  var loadedMesh;

  // setup the control gui
  //  控制项配置
  var controls = new function () {

    // we need the first child, since it's a multimaterial
    // 圆环的半径，默认值为1。
    this.radius = knot.geometry.parameters.radius;
    // 管道的半径，默认值为0.4。
    this.tube = 0.3;
    //  管道的分段数量，默认值为64。
    this.radialSegments = knot.geometry.parameters.radialSegments;
    //  横截面分段数量，默认值为8。
    this.tubularSegments = knot.geometry.parameters.tubularSegments;
    //  这个值决定了几何体将绕着其旋转对称轴旋转多少次，默认值是2。
    this.p = knot.geometry.parameters.p;
    //  这个值决定了几何体将绕着其内部圆环旋转多少次，默认值是3。
    this.q = knot.geometry.parameters.q;
    //  重绘方法
    this.redraw = function () {
      // remove the old plane
      //  移除旧的圆环缓冲扭结几何体
      scene.remove(knot);
      // create a new one
      //  根据参数创建圆环缓冲扭结几何体实例
      knot = createMesh(new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(
        controls.radialSegments), Math.round(controls.tubularSegments), Math.round(
        controls.p), Math.round(controls.q)));
      // add it to the scene.
      //  添加到场景
      scene.add(knot);
    };

    this.save = function () {
      //  将圆环缓冲扭结几何体信息转换成json
      var result = knot.toJSON();
      //  存储到本地localStorage
      localStorage.setItem("json", JSON.stringify(result));
      //  查看生成的json
      console.log(localStorage.getItem("json"));
    };

    this.load = function () {
      //  场景移除loadedMesh
      scene.remove(loadedMesh);
      //  获取存储的信息
      var json = localStorage.getItem("json");
      //  如果有存储的信息
      if (json) {
        //  转换信息格式
        var loadedGeometry = JSON.parse(json);
        //  实例化 ObjectLoader 加载器
        var loader = new THREE.ObjectLoader();
        //  加载器解析 json, 获取物体
        loadedMesh = loader.parse(loadedGeometry);
        //  调整物体位置
        loadedMesh.position.x -= 40;
        //  添加到场景
        scene.add(loadedMesh);
      }
    }
  };

  var gui = new dat.GUI();
  var ioGui = gui.addFolder('Save & Load');
  ioGui.add(controls, 'save').onChange(controls.save);
  ioGui.add(controls, 'load').onChange(controls.load);
  var meshGui = gui.addFolder('mesh');
  meshGui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  meshGui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
  meshGui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
  meshGui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
  meshGui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
  meshGui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
  // meshGui.add(controls, 'scale', 0, 5).onChange(controls.redraw);


  render();
  //  创建网格体并返回
  function createMesh(geom) {

    // assign two materials
    //  定义材质
    var meshMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: true,
      wireframeLinewidth: 2,
      color: 0xaaaaaa
    });
    meshMaterial.side = THREE.DoubleSide;

    // create a multimaterial
    //  根据传入网格形状生成物体
    var mesh = new THREE.Mesh(geom, meshMaterial);
    //  调整位置
    mesh.position.set(20, 0, 0)
    //  返回生成的物体
    return mesh;
  }

  function render() {
    stats.update();
    //  调整y轴旋转参数
    knot.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}