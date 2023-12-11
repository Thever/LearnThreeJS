function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(35, 35, 35));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 45, 0));

  // load the model
  //  实例化加载器
  var loader = new THREE.ColladaLoader();
  //  加载DAE文件
  loader.load("../../assets/models/medieval/Medieval_building.DAE", function (result) {
    //  获取场景
    var sceneGroup = result.scene;
    //  遍历场景下的子类
    sceneGroup.children.forEach(function (child) {
      //  如果是网格实例
      if (child instanceof THREE.Mesh) {
        //  接收阴影
        child.receiveShadow = true;
        //  渲染阴影
        child.castShadow = true;
      } else {
        // remove any lighting sources from the model
        //  否则移除
        sceneGroup.remove(child);
      }
    });

    // correctly scale and position the model
    //  场景旋转
    sceneGroup.rotation.z = 0.5 * Math.PI;
    //  场景缩放
    sceneGroup.scale.set(8, 8, 8);

    // call the default render loop.
    //  场景渲染
    loaderScene.render(sceneGroup, camera);
  });
}
