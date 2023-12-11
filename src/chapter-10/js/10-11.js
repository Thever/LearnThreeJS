function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));  
  var loaderScene = new BaseLoaderScene(camera, false);
  var sun = new THREE.DirectionalLight(0xffffff);
  sun.position.set(300, 100, 100);

  loaderScene.scene.add(sun)

  // AOMAP depends on the presence of an ambientlight
  loaderScene.scene.add(new THREE.AmbientLight(0xffffff, 0.2))

  var loader = new THREE.JSONLoader();
  var textureLoader = new THREE.TextureLoader();
  var gui = new dat.GUI();
  var controls = {
    aoMapIntenisty: 1
  };

  loader.load("../../assets/models/baymax/bm.json", function (geometry) {

    geometry.computeFaceNormals();
    geometry.computeVertexNormals(false);
    geometry.normalsNeedUpdate = true;
    geometry.faceVertexUvs.push(geometry.faceVertexUvs[0]);

    var material = new THREE.MeshStandardMaterial({
      //  该纹理的红色通道用作环境遮挡贴图。默认值为null。aoMap需要第二组UV。
      aoMap: textureLoader.load("../../assets/models/baymax/ambient.png"),
      //  环境遮挡效果的强度。默认值为1。零是不遮挡效果。
      aoMapIntensity: 2,
      color: 0xffffff,
      metalness: 0,
      roughness: 1
    });

    // var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(20, 20, 20);
    mesh.translateY(-50);

    gui.add(controls, "aoMapIntenisty", 0, 5, 0.01).onChange(function(e) {mesh.material.aoMapIntensity = e})
    
    // call the default render loop.
    loaderScene.render(mesh, camera);
  });
}