function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var scene = new THREE.Scene();

  camera.position.set(20, 0, 150);

  var cloud;

  var controls = new function () {
    this.size = 4;
    this.transparent = true;
    this.opacity = 0.6;
    this.vertexColors = true;
    this.color = 0xffffff;
    this.vertexColor = 0x00ff00;
    this.sizeAttenuation = true;
    this.rotate = true;

    this.redraw = function () {

      console.log(controls.color)

      if (scene.getObjectByName("particles")) {
        scene.remove(scene.getObjectByName("particles"));
      }
      createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors,
        controls.sizeAttenuation, controls.color, controls.vertexColor);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.add(controls, 'vertexColors').onChange(controls.redraw);
  
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.addColor(controls, 'vertexColor').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
  gui.add(controls, 'rotate');

  controls.redraw();
  render();

  function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, colorValue, vertexColorValue) {
    //  几何体
    var geom = new THREE.Geometry();
    //  点材质
    var material = new THREE.PointsMaterial({
      //  点大小
      size: size,
      //  是否透明
      transparent: transparent,
      //  透明度
      opacity: opacity,
      //  顶点颜色
      vertexColors: vertexColors,
      //  启用点大小透视
      sizeAttenuation: sizeAttenuation,
      //  点颜色
      color: new THREE.Color(colorValue)
    });

    //  循环生成点大小
    var range = 500;
    for (var i = 0; i < 15000; i++) {
      //  随机生成点位置
      var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2,
        Math.random() * range - range / 2);
      //  点位置添加到集合体中
      geom.vertices.push(particle);
      //  使用传入的顶点颜色
      var color = new THREE.Color(vertexColorValue);
      //  转换颜色
      var asHSL = {};
      color.getHSL(asHSL);
      color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
      geom.colors.push(color);
    }
    //  生成点
    cloud = new THREE.Points(geom, material);
    //  设置name,便于获取
    cloud.name = "particles";
    //  场景中添加点
    scene.add(cloud);
  }

  var step = 0;

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    if (controls.rotate) {
      step += 0.01;
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}