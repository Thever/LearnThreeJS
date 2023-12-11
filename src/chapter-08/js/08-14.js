function init() {

    // setup the scene for rendering
    var camera = initCamera(new THREE.Vector3(30, 30, 30));
    var loaderScene = new BaseLoaderScene(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    //  实例化AWDLoader
    var loader = new THREE.AWDLoader();
    //  加载awd模型，获得模型对象
    loader.load("../../assets/models/polarbear/PolarBear.awd", function (model) {
        //  遍历模型子类
        model.traverse(function (child) {
            //  如果子类是网格模型
            if (child instanceof THREE.Mesh) {
                //  修改其材质
                child.material = new THREE.MeshLambertMaterial({
                    color: 0xaaaaaa
                });
            }
        });
        //  模型缩放
        model.scale.set(0.1, 0.1, 0.1);
        //  场景渲染
        loaderScene.render(model, camera);
    });

}