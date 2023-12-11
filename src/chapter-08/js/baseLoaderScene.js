/**
 * Simple base class, which setups a simple scene which is used to 
 * demonstrate the different loaders. This create a scene, three
 * lights, and slowly rotates the model, around the z-axis
 */
function BaseLoaderScene(providedCamera, shouldAddLights, shouldRotate, updateMesh) {
  //  this的新只想
  self = this;

  // setup some default elements
  //  初始化默认配置
  this.scene = new THREE.Scene();
  // 实例化统计帧数模块
  this.stats = initStats();
  //  实例化Clock模块
  this.clock = new THREE.Clock();
  //  内部相机指向为传入的相机对象
  this.camera = providedCamera;
  //  设置是否添加灯光
  this.withLights = (shouldAddLights !== undefined) ? shouldAddLights : true;
  //  设置是否旋转
  this.shouldRotate = (shouldRotate !== undefined) ? shouldRotate : true;
  //  是否更新网格
  this.updateMesh = updateMesh

  // initialize basic renderer
  this.renderer = initRenderer({
    //  开启抗锯齿
    antialias: true
  });
  //  初始化轨道球
  this.trackballControls = initTrackballControls(this.camera, this.renderer);

  /**
   * Start the render loop of the provided object
   * 
   * @param {Three.Object3D} mesh render this mesh or object
   * @param {*} camera render using the provided camera settings
   */
  //  修改渲染器属性
  this.render = function (mesh, camera) {
    //  场景添加网格体
    self.scene.add(mesh);
    //  指定渲染器相机
    self.camera = camera;
    //  指定网格体
    self.mesh = mesh;
    //  渲染
    self._render();
  }

  /**
   * Interal function, called continously to render the scene
   */
  //  渲染方法
  this._render = function () {
    //  更新帧数信息
    self.stats.update();
    //  逐帧渲染
    requestAnimationFrame(self._render);
    //  更新轨道球控制器
    self.trackballControls.update(self.clock.getDelta());
    //  更新网格体
    if (updateMesh) this.updateMesh(self.mesh)
    //  需要旋转
    if (shouldRotate) {
      //  就旋转
      self.mesh.rotation.z += 0.01
    }
    //  渲染内容
    self.renderer.render(self.scene, self.camera);
  }

  /**
   * Internal function, which adds a number of lights to the scene.
   */
  //  添加光照
  this._addLights = function () {
    var keyLight = new THREE.SpotLight(0xffffff);
    keyLight.position.set(0, 80, 80);
    keyLight.intensity = 2;
    keyLight.lookAt(new THREE.Vector3(0, 15, 0));
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.mapSize.width = 4096;
    this.scene.add(keyLight);

    var backlight1 = new THREE.SpotLight(0xaaaaaa);
    backlight1.position.set(150, 40, -20);
    backlight1.intensity = 0.5;
    backlight1.lookAt(new THREE.Vector3(0, 15, 0));
    this.scene.add(backlight1);

    var backlight2 = new THREE.SpotLight(0xaaaaaa);
    backlight2.position.set(-150, 40, -20);
    backlight2.intensity = 0.5;
    backlight2.lookAt(new THREE.Vector3(0, 15, 0));
    this.scene.add(backlight2);
  }

  // add the lights
  //  有光源就添加
  if (this.withLights) this._addLights();

}