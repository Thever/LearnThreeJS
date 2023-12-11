function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 40, 110));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  var controls = new function () {
    this.size = 10;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;

    this.sizeAttenuation = true;

    this.redraw = function () {
      var toRemove = [];
      //  实例点添加到移除数组
      scene.children.forEach(function (child) {
        if (child instanceof THREE.Points) {
          toRemove.push(child);
        }
      });
      //  移除实例点
      toRemove.forEach(function (child) {
        scene.remove(child)
      });
      //  创建点实例
      createPointInstances(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation,
        controls.color);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

  controls.redraw();

  render();
  //  创建点云
  function createPointCloud(name, texture, size, transparent, opacity, sizeAttenuation, color) {
    //  声明几何体
    var geom = new THREE.Geometry();
    //  声明颜色
    var color = new THREE.Color(color);
    //  设置颜色，h，s值使用换入颜色，随机修改l的值
    color.setHSL(color.getHSL().h,
      color.getHSL().s,
      (Math.random()) * color.getHSL().l);
    //  声明点材质
    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      map: texture,
      //  混合模式
      blending: THREE.AdditiveBlending,
      //  关闭材质对深度缓冲区的影响
      depthWrite: false,
      sizeAttenuation: sizeAttenuation,
      color: color
    });
    //  循环生成三维位置和运动速度
    var range = 40;
    for (var i = 0; i < 150; i++) {
      //  获取三维位置
      var particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        Math.random() * range - range / 2);
      //  获取运动的速度参数
      particle.velocityY = 0.1 + Math.random() / 5;
      particle.velocityX = (Math.random() - 0.5) / 3;
      particle.velocityZ = (Math.random() - 0.5) / 3;
      geom.vertices.push(particle);
    }
    //  生成点对象
    var system = new THREE.Points(geom, material);
    //  设置name
    system.name = name;
    //  返回点实例
    return system;
  }
  //  创建点实例
  function createPointInstances(size, transparent, opacity, sizeAttenuation, color) {
    //  实例化纹理加载器
    var loader = new THREE.TextureLoader();
    //  纹理图片资源
    var texture1 = loader.load("../../assets/textures/particles/snowflake1_t.png");
    var texture2 = loader.load("../../assets/textures/particles/snowflake2_t.png");
    var texture3 = loader.load("../../assets/textures/particles/snowflake3_t.png");
    var texture4 = loader.load("../../assets/textures/particles/snowflake5_t.png");
    //  场景添加对应的点信息
    scene.add(createPointCloud("system1", texture1, size, transparent, opacity, sizeAttenuation, color));
    scene.add(createPointCloud("system2", texture2, size, transparent, opacity, sizeAttenuation, color));
    scene.add(createPointCloud("system3", texture3, size, transparent, opacity, sizeAttenuation, color));
    scene.add(createPointCloud("system4", texture4, size, transparent, opacity, sizeAttenuation, color));
  }


  function render() {

    stats.update();
    //  便利场景下的内容
    scene.children.forEach(function (child) {
      //  如果内容为点对象实例
      if (child instanceof THREE.Points) {
        //  获取点实例下的顶点数组
        var vertices = child.geometry.vertices;
        //  循环顶点数组
        vertices.forEach(function (v) {
          //  调整原本的逻辑
          v.y = v.y - (v.velocityY);
          v.x = v.x - (v.velocityX);
          v.z = v.z - (v.velocityZ);
          //  兜底修改
          //  味道到底部了就将其放到顶部
          if (v.y <= 0) v.y = 60;
          //  x轴，z轴超出范围了就调整运动方向
          if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
          if (v.z <= -20 || v.z >= 20) v.velocityZ = v.velocityZ * -1;
        });
        //  通知three.js更新点实例的坐标信息
        child.geometry.verticesNeedUpdate = true;
      }
    });

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}