function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化GCodeLoader
  var loader = new THREE.GCodeLoader();

  // you can use slicer to convert the model
  //  加载.gcode 模型
  loader.load("../../assets/models/benchy/benchy.gcode", function (object) {
    //  场景渲染对象
    loaderScene.render(object, camera);
  });


}