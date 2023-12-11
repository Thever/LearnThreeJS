function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));  
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  // load the model: model from http://www.thingiverse.com/thing:69709
  //  实例化 STLLoader 
  var loader = new THREE.STLLoader();
  //  加载资源模型，获取形状
  loader.load("../../assets/models/head/SolidHead_2_lowPoly_42k.stl", function (geometry) {
    //  声明材质
    var mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.5,
    });
    //  生成网格模型
    var group = new THREE.Mesh(geometry, mat);
    //  调整位置
    group.rotation.x = -0.5 * Math.PI;
    //  缩放
    group.scale.set(0.3, 0.3, 0.3);

    // call the default render loop.
    loaderScene.render(group, camera);
  });
}