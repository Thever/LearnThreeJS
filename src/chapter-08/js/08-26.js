function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);
  //  实例化 SVGLoader
  var loader = new THREE.SVGLoader();

  // you can use slicer to convert the model
  //  加载svg图片
  loader.load("../../assets/models/tiger/tiger.svg", function (paths) {
    //  定义
    var group = new THREE.Group();
    //  设置乘标量为0.1，也就是原来放大100倍，现在只放大10
    group.scale.multiplyScalar( 0.1 );
    //  y轴缩放调整
    group.scale.y *= -1;
    //  遍历路径
    for ( var i = 0; i < paths.length; i ++ ) {
      //  获取路径对象
      var path = paths[ i ];
      //  设置对应基础材质
      var material = new THREE.MeshBasicMaterial( {
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: false
      } );
      //  根据路径生成形状
      var shapes = path.toShapes( true );
      //  遍历形状
      for ( var j = 0; j < shapes.length; j ++ ) {
        //  获取形状
        var shape = shapes[ j ];
        //  生成形状缓冲几何体
        var geometry = new THREE.ShapeBufferGeometry( shape );
        //  生成几何体
        var mesh = new THREE.Mesh( geometry, material );
        //  添加到group中
        group.add( mesh );
      }
    }
    console.log(group);
    loaderScene.render(group, camera);
  });


}