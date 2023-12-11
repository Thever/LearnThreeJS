//  灯光阴影
//  1.材质要满足能够对光照有反应
//  2.设置渲染器开启阴影计算 render.shadowMap.enabled = true
//  3.设置光照投射阴影 directionalLight.castShadow = true
//  4.设置物体投射阴影 sphere.castShadow = true
//  5.设置物体接收阴影 plane.receiveShadow = true
function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  //  创建场景
  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  //  创建透视相机
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and configure it with shadows
  //  创建渲染器
  var renderer = new THREE.WebGLRenderer();
  //  设置背景色
  renderer.setClearColor(new THREE.Color(0x000000));
  //  设置渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // 创建树木
  // createTree(scene);
  // 创建房子
  // createHouse(scene);
  // 创建草地
  // createGroundPlane(scene);
  // 创建围墙
  // createBoundingWall(scene);

  // create a cube
  //  创建立方体
  //  声明立方缓冲几何体
  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  //  声明基础网格材质
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xFF0000
  });
  //  集合形状和材质生成立方体
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  //  允许立方体生成阴影
  cube.castShadow = true;

  // position the cube
  //  调整立方体位置
  cube.position.x = -4;
  cube.position.y = 2;
  cube.position.z = 0;

  // add the cube to the scene
  // 将立方体添加到场景
  scene.add(cube);

  //  添加球体
  //  声明球缓冲几何体
  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  //  声明基础网格材质
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff
  });
  //  结合生成球体
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  //  调整球体位置
  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;
  //  允许球体生成阴影
  sphere.castShadow = true;

  //  将球体添加到场景
  scene.add(sphere);

  // create the ground plane
  //  创建平面
  //  创建平面缓冲几何体
  var planeGeometry = new THREE.PlaneGeometry(60, 20);
  //  声明基础网格材质
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xAAAAAA
  });
  //  结合生成平面
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // rotate and position the plane
  //  x轴逆时针旋转90度
  plane.rotation.x = -0.5 * Math.PI;
  //  调整平面位置
  plane.position.set(15, 0, 0);
  //  平面接收产生的阴影
  plane.receiveShadow = true;
  //  将平面添加到场景
  scene.add(plane);

  // position and point the camera to the center of the scene
  //  调整相机位置
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  //  让相机查看场景
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  //  创建聚光灯光源
  var spotLight = new THREE.SpotLight(0xFFFFFF);
  //  设置位置
  spotLight.position.set(-40, 40, -15);
  //  允许点光源生成阴影
  spotLight.castShadow = true;
  //  设置阴影贴图分辨率
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  // spotLight.shadow.mapSize.set(1024, 1024)
  //  设置生成阴影的视锥
  //  最远距离
  spotLight.shadow.camera.far = 130;
  //  最近距离
  spotLight.shadow.camera.near = 40;

  // If you want a more detailled shadow you can increase the 
  // mapSize used to draw the shadows.
  // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  //  场景添加点光源
  scene.add(spotLight);

  //  创建环境光
  var ambienLight = new THREE.AmbientLight(0x353535);
  //  场景添加环境光
  scene.add(ambienLight);

  // add the output of the renderer to the html element
  //  将渲染内容放到到 #webgl-output下
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  // 渲染场景
  renderer.render(scene, camera);
}

function createBoundingWall(scene) {
  //  声明4面围墙的形状
  var wallLeft = new THREE.CubeGeometry(70, 2, 2);
  var wallRight = new THREE.CubeGeometry(70, 2, 2);
  var wallTop = new THREE.CubeGeometry(2, 2, 50);
  var wallBottom = new THREE.CubeGeometry(2, 2, 50);
  //  声明围墙材质
  var wallMaterial = new THREE.MeshLambertMaterial({
    color: 0xa0522d
  });
  //  生成四面围墙
  var wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial);
  var wallRightMesh = new THREE.Mesh(wallRight, wallMaterial);
  var wallTopMesh = new THREE.Mesh(wallTop, wallMaterial);
  var wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial);

  //  调整围墙的位置
  wallLeftMesh.position.set(15, 1, -25);
  wallRightMesh.position.set(15, 1, 25);
  wallTopMesh.position.set(-19, 1, 0);
  wallBottomMesh.position.set(49, 1, 0);

  //  将围墙添加到场景
  scene.add(wallLeftMesh);
  scene.add(wallRightMesh);
  scene.add(wallBottomMesh);
  scene.add(wallTopMesh);

}

function createGroundPlane(scene) {
  // create the ground plane
  //  创建草地
  //  创建草地平面形状
  var planeGeometry = new THREE.PlaneGeometry(70, 50);
  //  创建草地材质
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0x9acd32
  });
  //  生成草地
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  //  允许草地接收应用
  plane.receiveShadow = true;

  // rotate and position the plane
  //  x轴逆时针旋转90度
  plane.rotation.x = -0.5 * Math.PI;
  //  调整草地位置
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;
  //  场景添加草地
  scene.add(plane)
}

function createHouse(scene) {
  //  创建房屋形状
  //  屋顶
  var roof = new THREE.ConeGeometry(5, 4);
  //  房屋主体
  var base = new THREE.CylinderGeometry(5, 5, 6);

  // create the mesh
  //  创建材质
  //  屋顶材质
  var roofMesh = new THREE.Mesh(roof, new THREE.MeshLambertMaterial({
    color: 0x8b7213
  }));
  //  房屋主体材质
  var baseMesh = new THREE.Mesh(base, new THREE.MeshLambertMaterial({
    color: 0xffe4c4
  }));

  //  调整位置
  roofMesh.position.set(25, 8, 0);
  baseMesh.position.set(25, 3, 0);

  //  允许产生阴影和接收阴影
  roofMesh.receiveShadow = true;
  baseMesh.receiveShadow = true;
  roofMesh.castShadow = true;
  baseMesh.castShadow = true;

  //  添加到场景
  scene.add(roofMesh);
  scene.add(baseMesh);
}

/**
 * Add the tree to the scene
 * @param scene The scene to add the tree to
 */
function createTree(scene) {
  //  树干形状
  var trunk = new THREE.CubeGeometry(1, 8, 1);
  //  树叶形状
  var leaves = new THREE.SphereGeometry(4);

  // create the mesh
  //  创建材质
  //  树干材质
  var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshLambertMaterial({
    color: 0x8b4513
  }));
  //  树叶材质
  var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshLambertMaterial({
    color: 0x00ff00
  }));

  // position the trunk. Set y to half of height of trunk
  //  更改位置
  trunkMesh.position.set(-10, 4, 0);
  leavesMesh.position.set(-10, 12, 0);

  //  允许生成和接收阴影
  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  leavesMesh.castShadow = true;
  leavesMesh.receiveShadow = true;

  //  添加到场景
  scene.add(trunkMesh);
  scene.add(leavesMesh);
}