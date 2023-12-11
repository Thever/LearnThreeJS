function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(0, 40, 50));

  camera.lookAt(scene.position);

  // call the render function
  var step = 0;
  //  定义立方体网格法线材质
  var cubeMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5
  });
  //  定义控制项
  var controls = new function () {
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.rotationSpeed = 0.02;
    //  是否合并
    this.combined = false;

    //  渲染物体的数量
    this.numberOfObjects = 500;
    //  重绘方法
    this.redraw = function () {
      //  移除内容数组
      var toRemove = [];
      //  遍历场景中的子类
      scene.traverse(function (e) {
        //  如果是网格实例就添加到移除数组中
        if (e instanceof THREE.Mesh) toRemove.push(e);
      });
      //  移除数组中的网格实例
      toRemove.forEach(function (e) {
        scene.remove(e)
      });

      // add a large number of cubes
      //  启用联合属性添加
      if (controls.combined) {
        //  声明几何体
        var geometry = new THREE.Geometry();
        //  根据数量循环添加
        for (var i = 0; i < controls.numberOfObjects; i++) {
          //  获取立方体实例
          var cubeMesh = addcube();
          //  立方体实例更新矩阵
          cubeMesh.updateMatrix();
          //  几何体合并立方体实例
          geometry.merge(cubeMesh.geometry, cubeMesh.matrix);
        }
        //  场景添加几何体结果(效率高)
        scene.add(new THREE.Mesh(geometry, cubeMaterial));
      } else {
        //  便利数量生成立方体
        for (var i = 0; i < controls.numberOfObjects; i++) {
          //  场景单独添加立方体(效率低)
          scene.add(controls.addCube());
        }
      }
    };

    //  指定生成立方体方法
    this.addCube = addcube;
    //  打印场景下的子类
    this.outputObjects = function () {
      console.log(scene.children);
    }
  };

  //  实例化dat.gui()
  var gui = new dat.GUI();

  gui.add(controls, 'numberOfObjects', 0, 20000);
  gui.add(controls, 'combined').onChange(controls.redraw);
  gui.add(controls, 'redraw');

  //  重绘
  controls.redraw();
  //  渲染
  render();
  //  旋转值
  var rotation = 0;
  //  生成立方体返回
  function addcube() {
    //  立方体长宽高
    var cubeSize = 1.0;
    //  声明立方体形状
    var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    //  实例化立方体
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    //  立方体生成应用
    cube.castShadow = true;

    // position the cube randomly in the scene
    //  添加随机位置
    cube.position.x = -60 + Math.round((Math.random() * 100));
    cube.position.y = Math.round((Math.random() * 10));
    cube.position.z = -150 + Math.round((Math.random() * 175));

    // add the cube to the scene
    // 返回立方体
    return cube;
  }

  function render() {
    //  更新旋转值
    rotation += 0.005;

    stats.update();

    //  调整相机位置
    camera.position.x = Math.sin(rotation) * 50;
    // camera.position.y = Math.sin(rotation) * 40;
    camera.position.z = Math.cos(rotation) * 50;
    //  确保相机朝向场景
    camera.lookAt(scene.position);

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}