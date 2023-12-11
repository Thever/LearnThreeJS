function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化 ThreeMFLoader
  var loader = new THREE.ThreeMFLoader();
  //  加载3mf文件
  loader.load("../../assets/models/gears/dodeca_chain_loop.3mf", function (group) {
    //  缩放
    group.scale.set(0.1, 0.1, 0.1);
    //  场景渲染
    loaderScene.render(group, camera);
  });
}