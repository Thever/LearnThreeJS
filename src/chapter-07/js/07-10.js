function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  createSprites();
  render();

  var group;
  //  获取纹理
  function getTexture() {
    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/sprite-sheet.png");
    return texture;
  }

  function createSprites() {
    //  定义group
    group = new THREE.Object3D();
    //  生成精灵实例，添加到group
    var range = 200;
    for (var i = 0; i < 400; i++) {
      group.add(createSprite(10, false, 0.6, 0xffffff, i % 5, range));
    }
    //  场景添加group
    scene.add(group);
  }
  //  创建精灵
  function createSprite(size, transparent, opacity, color, spriteNumber, range) {
    //  声明精灵材质
    var spriteMaterial = new THREE.SpriteMaterial({
      opacity: opacity,
      color: color,
      transparent: transparent,
      map: getTexture()
    });

    // we have 1 row, with five sprites
    //  使用对应的材质图
    spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    spriteMaterial.depthTest = false;
    //  指定混合模式
    spriteMaterial.blending = THREE.AdditiveBlending;
    //  实例化精灵
    var sprite = new THREE.Sprite(spriteMaterial);
    //  缩放
    sprite.scale.set(size, size, size);
    //  随机调整精灵位置
    sprite.position.set(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2);
    //  返回精灵
    return sprite;
  }



  function render() {

    stats.update();
    //  group 按x轴旋转
    //  将精灵实例添加到group目的是为了方便统一操作，保持统一效果
    group.rotation.x +=0.01;

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}