function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  //  实例化VRMLLoader
  var loader = new THREE.VRMLLoader();
  //  加载wrl模型文件，获得模型
  loader.load("../../assets/models/tree/tree.wrl", function (model) {
      //  模型缩放
      model.scale.set(10, 10, 10);
      //  场景渲染
      loaderScene.render(model, camera);
  });
}