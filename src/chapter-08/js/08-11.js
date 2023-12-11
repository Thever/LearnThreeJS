function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //  实例化 VTKLoader
  var loader = new THREE.VTKLoader();
  //  加载
  loader.load("../../assets/models/moai/moai_fixed.vtk", function (geometry) {
    //  声明网格法线材质
    var mat = new THREE.MeshNormalMaterial();
    //  形状居中
    geometry.center();
    //  计算顶点法线向量
    geometry.computeVertexNormals();
    //  形成网格模型
    var group = new THREE.Mesh(geometry, mat);
    //  模型缩放
    group.scale.set(25, 25, 25);
    //  场景渲染
    loaderScene.render(group, camera);
  });
}