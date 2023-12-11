function init() {

  // use the defaults
  var stats = initStats();
  //  实例化webGL渲染器
  var renderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 40, 110));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  var system1;
  var cloud;
  //  控制内容
  var controls = new function () {
    this.size = 3;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;

    this.sizeAttenuation = true;

    this.redraw = function () {
      scene.remove(scene.getObjectByName("particles1"));

      createPointCloud(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation,
        controls.color);
    };
  };
  //  实例化dat.gui
  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

  controls.redraw();
  render();

  function createPointCloud(size, transparent, opacity, sizeAttenuation, color) {
    //  纹理加载器加载图片纹理
    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/raindrop-3.png");
    //  声明几何体
    var geom = new THREE.Geometry();
    //  声明点材质
    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      //  使用图片纹理
      map: texture,
      //  指定混合模式
      blending: THREE.AdditiveBlending,
      //  true为近大远小，false为一样大
      sizeAttenuation: sizeAttenuation,
      color: color
    });

    //  循环生成对象
    var range = 40;
    for (var i = 0; i < 1500; i++) {
      //  生成位置
      var particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        // Math.random() * range - range / 2
        1 + (i/100)
      )
      //  生成运动速度
      //  垂直移动的速度
      particle.velocityY = 0.1 + Math.random() / 5;
      //  水平移动的速度
      particle.velocityX = (Math.random() - 0.5) / 3;
      //  添加到几何体位置信息中
      geom.vertices.push(particle);
    }
    //  结合位置信息和材质生成点对象
    cloud = new THREE.Points(geom, material);
    //  启动自动排序
    cloud.sortParticles = true;
    //  添加name后边后续操作
    cloud.name = "particles1"
    //  场景中添加点对象
    scene.add(cloud);
  }

  function render() {
    stats.update();
    //  获取点示例下的顶点
    var vertices = cloud.geometry.vertices;
    //  循环顶点，修改位置
    vertices.forEach(function (v) {
      //  调整y轴位置
      v.y = v.y - (v.velocityY);
      //  调整x轴位置
      v.x = v.x - (v.velocityX);
      //  y轴位置在底部将其放到顶部位置
      if (v.y <= 0) v.y = 60;
      //  x轴位置在边界，调整其运动方向，让其在可视域范围内
      if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
    });
    //  更新属性
    cloud.geometry.verticesNeedUpdate = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}