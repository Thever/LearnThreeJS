function init() {

  var stats = initStats();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  var scene = new THREE.Scene();
  //  初始化webGL渲染器
  var webGLRenderer = initRenderer();

  var cloud;

  var controls = new function () {
    this.size = 15;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;
    this.rotate = true;
    //  true近大远小，false一样大
    this.sizeAttenuation = true;

    this.redraw = function () {
      //  通过name移除原本绘制内容
      if (scene.getObjectByName("points")) {
        scene.remove(scene.getObjectByName("points"));
      }
      createPoints(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation,
        controls.color);
    };
  };

  //  实例化dat
  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
  gui.add(controls, 'rotate');
  controls.redraw();

  render();

  function createPoints(size, transparent, opacity, sizeAttenuation, color) {
    //  声明几何形，用来存储点位置
    var geom = new THREE.Geometry();
    //  声明点材质
    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      //  将canvas绘制的内容作为材质使用
      map: createGhostTexture(),
      sizeAttenuation: sizeAttenuation,
      color: color
    });
    //  循环生成点位置
    var range = 500;
    for (var i = 0; i < 5000; i++) {
      var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2,
        Math.random() * range - range / 2);
      //  几何体中添加对应位置信息
      geom.vertices.push(particle);
    }
    //  结合点三维位置和材质，生成点对象
    cloud = new THREE.Points(geom, material);
    //  声明name方便后续操作
    cloud.name = 'points';
    //  场景中添加点
    scene.add(cloud);
  }

  var step = 0;

  function render() {
    stats.update();
    //  让内容旋转
    if (controls.rotate) {
      step += 0.01;
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}