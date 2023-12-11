function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化 PRWMLoader
  var loader = new THREE.PRWMLoader();
  //  加载 prwm 模型文件
  loader.load("../../assets/models/cerberus/cerberus.be.prwm", function (geometry) {
    //  形状计算顶点法向量
    geometry.computeVertexNormals();
    //  形状计算边界球
    geometry.computeBoundingSphere();
    //  形状计算边界盒
    geometry.computeBoundingBox();

    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    mesh.scale.set(30,30,30)
    loaderScene.render(mesh, camera);
  });


}