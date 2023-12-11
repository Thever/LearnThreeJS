function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  camera.position.set(0, 15, 70);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  initDefaultLighting(scene);

  var loader = new THREE.JSONLoader();
  var mesh
  var skeletonHelper
  var tween
  //  加载模型文件
  loader.load('../../assets/models/hand/hand-1.js', function (geometry, mat) {
    var mat = new THREE.MeshLambertMaterial({
      color: 0xF0C8C9, 
      // 材质是否使用蒙皮。默认值为false。
      skinning: true
    });
    //  生成蒙皮网格
    mesh = new THREE.SkinnedMesh(geometry, mat);
    //  缩放
    mesh.scale.set(15,15,15);
    //  调整位置
    mesh.position.x = -5;
    //  旋转
    mesh.rotateX(0.5*Math.PI);
    mesh.rotateZ(0.3*Math.PI);
    //  场景添加网格
    scene.add(mesh);
    //  启用动画
    startAnimation();
    //  实例化dat.gui
    var gui = new dat.GUI();
    //  控制对象
    var controls = {
      showHelper: false
    }
    //  添加控制属性
    gui.add(controls, "showHelper").onChange(function(e) {
      if (e) {
        //  实例化模拟骨骼 Skeleton 的辅助对象
        skeletonHelper = new THREE.SkeletonHelper( mesh );
        //  设置材质线宽
				skeletonHelper.material.linewidth = 2;
        //  场景添加辅助对象
				scene.add( skeletonHelper );
      } else {
        if (skeletonHelper) {
          //  移除辅助对象
          scene.remove(skeletonHelper)
        }
      }

      
    });
  });
  //  调用的骨骼动画
  var onUpdate = function () {
    //  获取位置
    var pos = this.pos;
    //  手动调整骨骼位置，从而让手指转动
    // rotate the fingers
    mesh.skeleton.bones[5].rotation.set(0, 0, pos);
    mesh.skeleton.bones[6].rotation.set(0, 0, pos);
    mesh.skeleton.bones[10].rotation.set(0, 0, pos);
    mesh.skeleton.bones[11].rotation.set(0, 0, pos);
    mesh.skeleton.bones[15].rotation.set(0, 0, pos);
    mesh.skeleton.bones[16].rotation.set(0, 0, pos);
    mesh.skeleton.bones[20].rotation.set(0, 0, pos);
    mesh.skeleton.bones[21].rotation.set(0, 0, pos);

    // rotate the wrist
    // 旋转手腕
    mesh.skeleton.bones[1].rotation.set(pos, 0, 0);
  };

  function startAnimation() {
    //  定义Tween动画
    tween = new TWEEN.Tween({pos: -1.5})
    //  目标位置
    .to({pos: 0}, 3000)
    //  渐变时间区间
    .easing(TWEEN.Easing.Cubic.InOut)
    //  正向反向播放
    .yoyo(true)
    //  无限循环
    .repeat(Infinity)
    //  指定更新时调用的函数
    .onUpdate(onUpdate);   
    //  播放Tween动画
    tween.start();
  }     

  render();
  function render() {
    stats.update();
    //  更新TWEEN动画
    TWEEN.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }   
}
