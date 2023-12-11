function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);

  //  当前版本的加载器被暴露到了 THREE 属性上，可以直接调用
  //  指定加载模块路径
  THREE.DRACOLoader.setDecoderPath('../../libs/other/draco/');
  //  指定加载模块路径的类型(后缀名)
	THREE.DRACOLoader.setDecoderConfig({type: 'js'});
  //  实例化 DRACOLoader
  var loader = new THREE.DRACOLoader();
  //  加载 drc 模型
  loader.load("../../assets/models/bunny/bunny.drc", function (geometry) {
    //  形状计算顶点向量
    geometry.computeVertexNormals();
    //  形状计算外边界球
    geometry.computeBoundingSphere();
    //  形状计算外边界盒
    geometry.computeBoundingBox();
    //  结合网格法线向量生成物体
    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    //  缩放
    mesh.scale.set(150, 150, 150)
    //  场景渲染
    loaderScene.render(mesh, camera);
  });


}