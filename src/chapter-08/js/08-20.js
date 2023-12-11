function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化 AMFLoader
  var loader = new THREE.AMFLoader();
  //  加载 amf 文件
  loader.load("../../assets/models/gimbal/Gimbal_snowflake_star_small_hole_6mm.amf", function (group) {
    //  缩放
    group.scale.set(0.4, 0.4, 0.4);
    //  加载场景
    loaderScene.render(group, camera);
  });
}