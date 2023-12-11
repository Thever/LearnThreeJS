function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  //  添加聚光灯
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)

  // call the render function
  var step = 0.03;

  var sphere;
  var cube;
  var group;
  var bboxMesh;
  var arrow;

  // setup the control gui
  // 控制项参数
  var controls = new function () {
    // we need the first child, since it's a multimaterial
    //  立方体位置
    this.cubePosX = 0;
    this.cubePosY = 3;
    this.cubePosZ = 10;
    //  球体位置
    this.spherePosX = 10;
    this.spherePosY = 5;
    this.spherePosZ = 0;
    //  group位置
    this.groupPosX = 10;
    this.groupPosY = 5;
    this.groupPosZ = 0;
    //  是否在group中
    this.grouping = false;
    //  是否旋转
    this.rotate = false;
    //  各个对象默认的缩放比例
    this.groupScale = 1;
    this.cubeScale = 1;
    this.sphereScale = 1;

    //  重绘方法
    this.redraw = function () {
      // remove the old plane
      //  移除group内容
      scene.remove(group);

      // create a new one
      //  重新获取球体和立方体实例
      sphere = createMesh(new THREE.SphereGeometry(5, 10, 10));
      cube = createMesh(new THREE.BoxGeometry(6, 6, 6));
      //  调整球体位置和缩放
      sphere.position.set(controls.spherePosX, controls.spherePosY, controls.spherePosZ);
      sphere.scale.set(controls.sphereScale, controls.sphereScale, controls.sphereScale);
      //  调整立方体位置和缩放
      cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ);
      cube.scale.set(controls.cubeScale, controls.cubeScale, controls.cubeScale);

      // also create a group, only used for rotating
      //  重新声明 group 组
      group = new THREE.Group();
      //  设置group位置
      group.position.set(controls.groupPosX, controls.groupPosY, controls.groupPosZ);
      //  设置group缩放
      group.scale.set(controls.groupScale, controls.groupScale, controls.groupScale);
      //  group添加球体和立方体  
      group.add(sphere);
      group.add(cube);

      //  场景添加gourp
      scene.add(group);
      //  获取group包围盒
      controls.positionBoundingBox();
      //  存在箭头就移除
      if (arrow) scene.remove(arrow)
      //  创建三维箭头方向
      arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), group.position, 10, 0x0000ff);
      //  场景添加箭头
      scene.add(arrow);
    };

    this.positionBoundingBox = function () {
      //  场景移除立方体 bboxMesh
      scene.remove(bboxMesh);
      //  获取包围盒信息
      var box = setFromObject(group);
      //  获取需要的长宽高
      var width = box.max.x - box.min.x;
      var height = box.max.y - box.min.y;
      var depth = box.max.z - box.min.z;
      //  生成立方体形状
      var bbox = new THREE.BoxGeometry(width, height, depth);
      //  实例化立方体 bboxMesh
      bboxMesh = new THREE.Mesh(bbox, new THREE.MeshBasicMaterial({
        //  颜色
        color: 0x000000,
        //  顶点颜色
        vertexColors: THREE.VertexColors,
        //  线框宽度
        wireframeLinewidth: 2,
        //  渲染为线框
        wireframe: true
      }));
      //  场景添加 bboxMesh
      // scene.add(bboxMesh);
      //  调整立方体 bboxMesh 位置
      bboxMesh.position.x = ((box.min.x + box.max.x) / 2);
      bboxMesh.position.y = ((box.min.y + box.max.y) / 2);
      bboxMesh.position.z = ((box.min.z + box.max.z) / 2);
    }
  };
  //  实例化dat.gui进行控制
  var gui = new dat.GUI();
  var sphereFolder = gui.addFolder("sphere");
  sphereFolder.add(controls, "spherePosX", -20, 20).onChange(function (e) {
    sphere.position.x = e;
    controls.positionBoundingBox()
    controls.redraw();
  });
  sphereFolder.add(controls, "spherePosZ", -20, 20).onChange(function (e) {
    sphere.position.z = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  sphereFolder.add(controls, "spherePosY", -20, 20).onChange(function (e) {
    sphere.position.y = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  sphereFolder.add(controls, "sphereScale", 0, 3).onChange(function (e) {
    sphere.scale.set(e, e, e);
    controls.positionBoundingBox();
    controls.redraw();
  });

  var cubeFolder = gui.addFolder("cube");
  cubeFolder.add(controls, "cubePosX", -20, 20).onChange(function (e) {
    cube.position.x = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  cubeFolder.add(controls, "cubePosZ", -20, 20).onChange(function (e) {
    cube.position.z = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  cubeFolder.add(controls, "cubePosY", -20, 20).onChange(function (e) {
    cube.position.y = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  cubeFolder.add(controls, "cubeScale", 0, 3).onChange(function (e) {
    cube.scale.set(e, e, e);
    controls.positionBoundingBox();
    controls.redraw();
  });

  var cubeFolder = gui.addFolder("group");
  cubeFolder.add(controls, "groupPosX", -20, 20).onChange(function (e) {
    group.position.x = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  cubeFolder.add(controls, "groupPosZ", -20, 20).onChange(function (e) {
    group.position.z = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  cubeFolder.add(controls, "groupPosY", -20, 20).onChange(function (e) {
    group.position.y = e;
    controls.positionBoundingBox();
    controls.redraw();
  });
  cubeFolder.add(controls, "groupScale", 0, 3).onChange(function (e) {
    group.scale.set(e, e, e);
    controls.positionBoundingBox();
    controls.redraw();
  });

  gui.add(controls, "grouping");
  gui.add(controls, "rotate");
  //  重新绘制
  controls.redraw();
  //  渲染
  render();
  //  传入形状渲染物体
  function createMesh(geom) {

    // assign two materials
    //  使用网格法线材质
    var meshMaterial = new THREE.MeshNormalMaterial();
    //  指定双面渲染
    meshMaterial.side = THREE.DoubleSide;

    // create a multimaterial
    //  渲染物体
    var plane = new THREE.Mesh(geom, meshMaterial);
    //  返回物体
    return plane;
  }

  function render() {
    stats.update();

    //  是group而且旋转
    if (controls.grouping && controls.rotate) {
      //  group组旋转
      group.rotation.y += step;
    }
    //  旋转但是不存在group
    if (controls.rotate && !controls.grouping) {
      //  球体旋转
      sphere.rotation.y += step;
      //  立方体旋转
      cube.rotation.y += step;
    }

    //        controls.positionBoundingBox();
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

  // http://jsfiddle.net/MREL4/
  //  获取包围盒信息，也就是获取group的相关信息
  function setFromObject(object) {
    //  实例化轴对齐包围盒
    var box = new THREE.Box3();
    //  实例化三维向量
    var v1 = new THREE.Vector3();
    //  传入的对象更新矩阵世界
    object.updateMatrixWorld(true);
    //  清空包围盒
    box.makeEmpty();
    //  传入对象便利子内容
    object.traverse(function (node) {
      //  子内容存在且顶点存在
      if (node.geometry !== undefined && node.geometry.vertices !== undefined) {
        //  获取子内容顶点
        var vertices = node.geometry.vertices;
        //  便利顶点内容
        for (var i = 0, il = vertices.length; i < il; i++) {
          // 三维向量获取顶点位置
          v1.copy(vertices[i]);
          // 将该向量乘以四阶矩阵 node.matrixWorld 世界矩阵（第四个维度隐式地为1），并按角度进行划分。
          v1.applyMatrix4(node.matrixWorld);
          // 指定需要在包围盒中的点
          box.expandByPoint(v1);
        }
      }
    });
    //  返回对齐包围盒
    return box;
  }
}