function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // load and render the model
  //  实例化 CTMLoader
  var loader = new THREE.CTMLoader();
  //  加载ctm模型文件，获取形状
  loader.load("../../assets/models/wheel/auditt_wheel.ctm", function (geometry) {
    //  声明材质
    var mat = new THREE.MeshLambertMaterial({
      color: 0xff8888
    });
    //  形成网格模型
    var group = new THREE.Mesh(geometry, mat);
    //  模型缩放
    group.scale.set(70, 70, 70);

    // call the default render loop.
    //  场景渲染
    loaderScene.render(group, camera);
  }, {});
}