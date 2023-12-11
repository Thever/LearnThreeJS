function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera, false);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  //  实例化BabylonLoader
  var loader = new THREE.BabylonLoader();
  var group = new THREE.Object3D();
  //  加载babylon文件，获得场景全部内容
  loader.load("../../assets/models/skull/skull.babylon", function (loadedScene) {

      // babylon loader contains a complete scene.
      //  .babylon文件包含了场景的全部内容
      console.log(loadedScene)
      console.log(loadedScene.children[1].material = new THREE.MeshLambertMaterial());
      //  渲染场景
      loaderScene.render(loadedScene, camera);

  });
}