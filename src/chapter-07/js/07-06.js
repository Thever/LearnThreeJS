function init() {

  var stats = initStats();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  var scene = new THREE.Scene();
  //  实例化WebGLRenderer
  var webGLRenderer = initRenderer();
  //  
  createSprites();
  render();
  //  创建精灵
  function createSprites() {
    //  声明精灵材质
    var material = new THREE.SpriteMaterial({
      //  使用canvas绘制的内容作为纹理
      map: createGhostTexture(),
      color: 0xffffff
    });
    //  生成内容
    var range = 500;
    for (var i = 0; i < 1500; i++) {
      //  实例化精灵
      var sprite = new THREE.Sprite(material);
      //  调整精灵位置
      sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() *
        range - range / 2);
      //  对精灵进行缩放
      sprite.scale.set(4, 4, 4);
      //  场景添加精灵
      scene.add(sprite);
    }
  }

  var step = 0;
  //  渲染更新
  function render() {
    stats.update();
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

}