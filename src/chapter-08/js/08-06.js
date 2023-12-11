function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));
  //  实例化OBJLoader()
  var loader = new THREE.OBJLoader();
  //  加载obj模型文件
  loader.load('../../assets/models/pinecone/pinecone.obj', function (mesh) {
    //  获取obj模型文件形状
    //  设置网格Lambert材质
    var material = new THREE.MeshLambertMaterial({
      //  颜色
      color: 0x5C3A21
    });

    // loadedMesh is a group of meshes. For 
    // each mesh set the material, and compute the information 
    // three.js needs for rendering.
    //  遍历形状下的子类
    mesh.children.forEach(function (child) {
      console.log(`child`)
      console.log(child)
      //  更新材质
      child.material = material;
      //  重新计算顶点向量
      child.geometry.computeVertexNormals();
      //  重新计算面向量
      child.geometry.computeFaceNormals();
    });
    //  对形状进行整体缩放(相对于其子类而言)
    mesh.scale.set(120,120,120)

    // call the default render loop.
    //  渲染场景
    loaderScene.render(mesh, camera);
  });
}