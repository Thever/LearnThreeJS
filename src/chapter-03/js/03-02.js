function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  //  场景
  var scene = new THREE.Scene();

  //  创建立方体和球体
  var cubeAndSphere = addDefaultCubeAndSphere(scene);
  var cube = cubeAndSphere.cube;
  var sphere = cubeAndSphere.sphere;
  var plane = addGroundPlane(scene);
  

  // add subtle ambient lighting
  //  环境光
  var ambiColor = "#1c1c1c";
  var ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);

  // add spotlight for a bit of light
  //  聚光灯
  var spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 30, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  // add target and light
  //  创建三维物体
  var target = new THREE.Object3D();
  target.position = new THREE.Vector3(5, 0, 0);

  //  配置聚光灯
  var spotLight = new THREE.SpotLight("#ffffff");
  //  位置
  spotLight.position.set(-40, 60, -10);
  //  渲染阴影
  spotLight.castShadow = true;
  //  投影近点
  spotLight.shadow.camera.near = 1;
  //  投影远点
  spotLight.shadow.camera.far = 100;
  //  光源朝向
  spotLight.target = plane;
  //  光照距离
  spotLight.distance = 0;
  //  光束宽度
  spotLight.angle = 0.4;
  //  投影视场
  spotLight.shadow.camera.fov = 120;
  //  场景添加到聚光等
  scene.add(spotLight);

  //  实例化相机助手
  var debugCamera = new THREE.CameraHelper(spotLight.shadow.camera);
  //  实例化聚光灯助手
  var pp = new THREE.SpotLightHelper(spotLight)
  scene.add(pp)

  // add a small sphere simulating the pointlight
  //  添加小球
  var sphereLight = new THREE.SphereGeometry(0.2);
  var sphereLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xac6c25
  });
  var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;

  sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
  scene.add(sphereLightMesh);

  // for controlling the rendering
  var step = 0;
  var invert = 1;
  var phase = 0;

  //  实例化 dat.gui 
  var controls = setupControls();
  render();

  function render() {
    stats.update();
    // rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    // move the light simulation
    if (!controls.stopMovingLight) {
      if (phase > 2 * Math.PI) {
        invert = invert * -1;
        phase -= 2 * Math.PI;
      } else {
        phase += controls.rotationSpeed;
      }
      sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
      sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
      sphereLightMesh.position.y = 15;

      if (invert < 0) {
        var pivot = 14;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
      }

      spotLight.position.copy(sphereLightMesh.position);
    }

    pp.update();
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function setupControls() {
    var controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.ambientColor = ambiColor;
      this.pointColor = spotLight.color.getStyle();
      this.intensity = 1;
      this.distance = 0;
      this.angle = 0.1;
      this.shadowDebug = false;
      this.castShadow = true;
      this.target = "Plane";
      this.stopMovingLight = false;
      this.penumbra = 0;
    };

    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
      ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
      spotLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
      spotLight.angle = e;
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
      spotLight.intensity = e;
    });

    gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
      spotLight.penumbra = e;
    });

    gui.add(controls, 'distance', 0, 200).onChange(function (e) {
      spotLight.distance = e;
    });

    gui.add(controls, 'shadowDebug').onChange(function (e) {
      if (e) {
        scene.add(debugCamera);
      } else {
        scene.remove(debugCamera);
      }
    });

    gui.add(controls, 'castShadow').onChange(function (e) {
      spotLight.castShadow = e;
    });

    gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
      switch (e) {
        case "Plane":
          spotLight.target = plane;
          break;
        case "Sphere":
          spotLight.target = sphere;
          break;
        case "Cube":
          spotLight.target = cube;
          break;
      }

    });

    gui.add(controls, 'stopMovingLight').onChange(function (e) {
      stopMovingLight = e;
    });

    return controls;
  }

}