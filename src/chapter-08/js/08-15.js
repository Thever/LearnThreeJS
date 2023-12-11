function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  //  实例化AssimpJSONLoader
  var loader = new THREE.AssimpJSONLoader();
  //  加载json文件，获得模型
  loader.load("../../assets/models/spider/spider.obj.assimp.json", function (model) {
    //  模型缩放
    model.scale.set(0.4, 0.4, 0.4);
    //  场景渲染
    loaderScene.render(model, camera);
  });
}