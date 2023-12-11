function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化 PlayCanvasLoader
  var loader = new THREE.PlayCanvasLoader();
  //  导入json文件
  loader.load("../../assets/models/statue/Statue_1.json", function (group) {
    //  缩放
    group.scale.set(1, 1, 1);
    //  指定网格法线材质
    var material = new THREE.MeshNormalMaterial();
    //  指定双面渲染
    material.side = THREE.DoubleSide;
    //  json生成子类添加材质形成物体
    setMaterialGroup(material, group);
    //  进行场景渲染
    loaderScene.render(group, camera);
  });


}