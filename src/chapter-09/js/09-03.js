function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  //  声明更改属性得对象
  var posSrc = { pos: 1}
  //  更改 posSrc, pos 设置为0， 渐变时间为2000毫秒
  var tween = new TWEEN.Tween(posSrc).to({pos: 0}, 2000);
  //  指定变换曲线为 Bounce.InOut
  tween.easing(TWEEN.Easing.Bounce.InOut); 
  //  更改 posSrc, pos 设置为1， 渐变时间为2000毫秒
  var tweenBack = new TWEEN.Tween(posSrc).to({pos: 1}, 2000); 
  //  指定变换曲线为 Bounce.InOut
  tweenBack.easing(TWEEN.Easing.Bounce.InOut); 
  //  tweenBack 结束回调 tween
  tweenBack.chain(tween); 
  //  tween 结束回调 tweenBack
  tween.chain(tweenBack); 
  //  上述两个链式回调会无限回调切换
  //  启动 tween 设置
  tween.start();

  var loaderScene = new BaseLoaderScene(camera, false, false, function(mesh) {
    //  主函数调用 TWEEN 更新属性值
    TWEEN.update();
    //  获取形状位置
    var positionArray = mesh.geometry.attributes['position']
    //  获取形状原点
    var origPosition = mesh.geometry.origPosition
    //  遍历形状子类
    for (i = 0; i < positionArray.count ; i++) {
      //  获取子类的x,y,z坐标
      var oldPosX = origPosition.getX(i);
      var oldPosY = origPosition.getY(i);
      var oldPosZ = origPosition.getZ(i);
      //  更新属性信息，并赋值
      positionArray.setX(i, oldPosX * posSrc.pos);
      positionArray.setY(i, oldPosY * posSrc.pos);
      positionArray.setZ(i, oldPosZ * posSrc.pos);
    }
    //  告诉 three.js 需要更新
    positionArray.needsUpdate = true;
  });
  //  实例化 PLYLoader
  var loader = new THREE.PLYLoader();
  //  加载 ply 模型
  loader.load("../../assets/models/carcloud/carcloud.ply", function (geometry) {
    //  声明点材质
    var material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      opacity: 0.6,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      //  指定材质处理函数
      map: generateSprite()
    });

    // copy the original position, so we can referene that when tweening
    //  获取形状的原本位置
    var origPosition = geometry.attributes['position'].clone()
    //  将位置信息保存到属性上
    geometry.origPosition = origPosition
    //  生成点对象
    var group = new THREE.Points(geometry, material);
    //  缩放
    group.scale.set(2.5, 2.5, 2.5);
    //  渲染
    loaderScene.render(group, camera);
  });
}

// From Three.js examples
//  生成精灵图
function generateSprite() {
  //  创建 canvas 标签
  var canvas = document.createElement('canvas');
  //  设置宽高
  canvas.width = 16;
  canvas.height = 16;
  //  获取 canvas 2d 上下文
  var context = canvas.getContext('2d');

  // draw the sprites
  //  进行梯度渐变
  //  createRadialGradient(x1, y1, r1, x2, y2, r2)
  //  createRadialGradient 方法接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。
  var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
  //  gradient.addColorStop(position, color)
  //  addColorStop 方法接受 2 个参数，position 参数必须是一个 0.0 与 1.0 之间的数值，表示渐变中颜色所在的相对位置。例如，0.5 表示颜色会出现在正中间。color 参数必须是一个有效的 CSS 颜色值（如 #FFF， rgba(0,0,0,1)，等等）。
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
  gradient.addColorStop(1, 'rgba(0,0,0,1)');
  //  使用梯度渐变作为填充内容
  context.fillStyle = gradient;
  //  fillRect(x, y, width, height)， 绘制一个填充的矩形
  context.fillRect(0, 0, canvas.width, canvas.height);

  // create the texture
  //  将绘制的内容转换成材质
  var texture = new THREE.Texture(canvas);
  //  指定材质需要更新
  texture.needsUpdate = true;
  //  返回生成的材质
  return texture;
}