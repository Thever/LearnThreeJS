function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(10, 10, 10));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //  实例化 PDBLoader
  var loader = new THREE.PDBLoader();

  // also possible to use diamond.pdb
  // loader.load("../../assets/models/molecules/aspirin.pdb", function (geometries) {
  //  加载pdb模型，获取形状
  loader.load("../../assets/models/molecules/diamond.pdb", function (geometries) {
    //  声明三维物体
    var group = new THREE.Object3D();

    // create the atoms
    //  获取原子对象
    var geometryAtoms = geometries.geometryAtoms;
    //  遍历原子对象的位置
    for (i = 0; i < geometryAtoms.attributes.position.count; i++) {
      //  声明三维向量
      var startPosition = new THREE.Vector3();
      //  填充循环到的位置信息
      startPosition.x = geometryAtoms.attributes.position.getX(i);
      startPosition.y = geometryAtoms.attributes.position.getY(i);
      startPosition.z = geometryAtoms.attributes.position.getZ(i);
      //  声明颜色
      var color = new THREE.Color();
      //  填充循环到的颜色信息
      color.r = geometryAtoms.attributes.color.getX(i);
      color.g = geometryAtoms.attributes.color.getY(i);
      color.b = geometryAtoms.attributes.color.getZ(i);
      //  声明网格Phong材质，使用原子的颜色
      var material = new THREE.MeshPhongMaterial({
        color: color
      });
      //  声明球体形状
      var sphere = new THREE.SphereGeometry(0.2);
      //  结合球体形状和材质生成球体
      var mesh = new THREE.Mesh(sphere, material);
      //  将球体的位置设置为导入图形的位置
      mesh.position.copy(startPosition);
      //  三维物体中添加球体网格
      group.add(mesh);
    }

    // create the bindings
    //  获取原子间的连接线
    var geometryBonds = geometries.geometryBonds;
    //   遍历连接线
    for (var j = 0; j < geometryBonds.attributes.position.count; j += 2) {
      //  获取连接线的开始位置
      var startPosition = new THREE.Vector3();
      startPosition.x = geometryBonds.attributes.position.getX(j);
      startPosition.y = geometryBonds.attributes.position.getY(j);
      startPosition.z = geometryBonds.attributes.position.getZ(j);
      //  获取连接线的结束位置
      var endPosition = new THREE.Vector3();
      endPosition.x = geometryBonds.attributes.position.getX(j + 1);
      endPosition.y = geometryBonds.attributes.position.getY(j + 1);
      endPosition.z = geometryBonds.attributes.position.getZ(j + 1);

      // use the start and end to create a curve, and use the curve to draw
      // a tube, which connects the atoms
      //  使用连接线的开始和结束位置创建曲线
      var path = new THREE.CatmullRomCurve3([startPosition, endPosition]);
      //  使用曲线来创建管道几何体
      var tube = new THREE.TubeGeometry(path, 1, 0.04);
      //  定义网格Phong材质
      var material = new THREE.MeshPhongMaterial({
        color: 0xcccccc
      });
      //  结合形状和材质生成管道
      var mesh = new THREE.Mesh(tube, material);
      //  三维物体中添加管道
      group.add(mesh);
    }
    //  进行场景渲染
    loaderScene.render(group, camera);
  });
}