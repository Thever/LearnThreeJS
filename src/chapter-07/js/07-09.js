function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var stats = initStats();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  //  默认场景
  var scene = new THREE.Scene();
  //  正交场景
  var sceneOrtho = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  //  默认相机
  var camera = initCamera(new THREE.Vector3(0, 0, 50));
  //  正交相机
  var cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);
  //  网格法线材质
  var material = new THREE.MeshNormalMaterial();
  //  球体形状
  var geom = new THREE.SphereGeometry(15, 20, 20);
  //  生成球体
  var mesh = new THREE.Mesh(geom, material);
  //  场景添加到球体
  scene.add(mesh);
  //  获取材质纹理
  var getTexture = function () {
    //  纹理加载器加载图片获取纹理
    //  图片宽度 512 * 128, 实际是由5个不同的图片水平拼接而成
    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/sprite-sheet.png");
    //  返回纹理
    return texture;
  };

  var controls = new function () {
    this.size = 150;
    this.sprite = 0;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;
    this.rotateSystem = true;
    //  重新绘制
    this.redraw = function () {
      //  正交场景中移除所有的精灵实例
      sceneOrtho.children.forEach(function (child) {
        if (child instanceof THREE.Sprite) sceneOrtho.remove(child);
      });
      //  创建经理
      createSprite(controls.size, controls.transparent, controls.opacity, controls.color, controls.sprite);
    };
  };
  //  实例化dat.gui
  var gui = new dat.GUI();
  gui.add(controls, 'sprite', 0, 4).step(1).onChange(controls.redraw);
  gui.add(controls, 'size', 0, 300).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);

  //  重新绘制
  controls.redraw();
  //  渲染内容
  render();
  //  创建精灵
  function createSprite(size, transparent, opacity, color, spriteNumber) {
    //  声明点精灵材质
    var spriteMaterial = new THREE.SpriteMaterial({
      opacity: opacity,
      color: color,
      transparent: transparent,
      //  使用图片材质
      map: getTexture()
    });

    // we have 1 row, with five sprites
    //  设置使用纹理图片的偏移量
    spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
    //  设置使用纹理的缩放大小
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    //  指定渲染模式
    spriteMaterial.blending = THREE.AdditiveBlending;
    // make sure the object is always rendered at the front
    //  关闭深度测试让其时钟在最前位置
    spriteMaterial.depthTest = false;
    
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, size);
    sprite.position.set(100, 50, -10);
    sprite.velocityX = 5;

    sceneOrtho.add(sprite);
  }


  var step = 0;

  function render() {

    stats.update();
    //  透视相机上下移动
    camera.position.y = Math.sin(step += 0.01) * 20;
    //  正交场景遍历子类
    sceneOrtho.children.forEach(function (e) {
      //  如果是精灵实例
      if (e instanceof THREE.Sprite) {
        // move the sprite along the bottom
        //  调整x轴的坐标位置
        e.position.x = e.position.x + e.velocityX;
        //  兜底逻辑
        //  精灵位置超出水平右侧
        if (e.position.x > window.innerWidth) {
          //  更改运动方向为向坐运动
          e.velocityX = -5;
          //  更改使用的图片
          controls.sprite += 1;
          e.material.map.offset.set(1 / 5 * (controls.sprite % 4), 0);
        }
        //  精灵位置在水平左侧
        if (e.position.x < 0) {
          //  更改运动方向向右运动
          e.velocityX = 5;
        }
      }
    });


    requestAnimationFrame(render);

    webGLRenderer.render(scene, camera);
    //  关闭自动清理，让场景中保留球体
    //  autoClear,定义渲染器是否在渲染每一帧之前自动清除其输出。
    webGLRenderer.autoClear = false;
    webGLRenderer.render(sceneOrtho, cameraOrtho);

  }
}