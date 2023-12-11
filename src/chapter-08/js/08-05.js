function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  //  实例化 JSON 加载器
  var loader = new THREE.JSONLoader();
  //  加载 json 模型
  loader.load('../../assets/models/house/house.json', function (geometry, mat) {
    //  获取加载资料，实例成网格对象
    var mesh = new THREE.Mesh(geometry, mat[0]);
    //  渲染阴影
    mesh.castShadow = true;
    //  接收阴影
    mesh.receiveShadow = true;

    // call the default render loop.
    //  渲染场景
    loaderScene.render(mesh, camera);
  });
}