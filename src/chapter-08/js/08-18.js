function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化 TDSLoader
  var loader = new THREE.TDSLoader();
  //  加载使用3ds模型
  loader.load("../../assets/models/chair/Eames_chair_DSW.3DS", function (group) {
    //  缩放
    group.scale.set(0.3, 0.3, 0.3);
    //  场景渲染
    loaderScene.render(group, camera);
  });
}