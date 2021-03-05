var loaded_models = {};
var skybox;
var day = new THREE.Color( 0x87CEEB );
var night = new THREE.Color( 0x003552 );
var cloudy = new THREE.Color( 0x8A9FAF );

function add_models (scene) {
    let geometry, material, tex;
    let pos;

    // World Tile
    geometry = new THREE.BoxGeometry( 1000, 0.2, 1000 );
    material = new THREE.MeshPhongMaterial( { color: 0x6DA363 } );
    var tile = new THREE.Mesh( geometry, material );
    tile.receiveShadow = true;
    scene.add(tile);

    //Skybox
    geometry = new THREE.BoxGeometry(1000, 1000, 1000);

    material = new THREE.MeshBasicMaterial({
        color: day, side: THREE.DoubleSide
    } );
    skybox = new THREE.Mesh( geometry, material );
    skybox.position.y += 450;
    skybox.material.color = day
    scene.add(skybox);
    // Forest
    generate_forest('tree', [-120, -260], [0, -400], 7);
    generate_forest('tree', [-120, -400], [280, -480], 15);
    generate_forest('tree', [340, 50], [480, -480], 25);
    generate_forest('tree', [430, 50], [480, 480], 15);
    generate_forest('tree', [-120, 300], [100, 480], 15);
    generate_forest('tree', [-10, 120], [70, 300], 7);
    generate_forest('tree', [190, 280], [350, 405], 7);

    generate_forest('tree2', [-120, -260], [0, -400], 8);
    generate_forest('tree2', [-120, -400], [280, -480], 12);
    generate_forest('tree2', [340, 50], [480, -480], 30);
    generate_forest('tree2', [430, 50], [480, 480], 20);
    generate_forest('tree2', [-120, 300], [100, 480], 10);
    generate_forest('tree2', [-10, 120], [70, 280], 7);

    generate_forest('tree2', [190, 280], [350, 405], 10);
    
    // Mountains
    pos = new THREE.Vector3(-250, -2, -200);
    add_model(scene, "resources/landscape/", "mountains", false, pos, 35, [0, Math.PI/2, 0])
    pos = new THREE.Vector3(-280, -2, 220);
    add_model(scene, "resources/landscape/", "mountains", false, pos, 25, [0, Math.PI*0.6, 0])

    // Lake
    pos = new THREE.Vector3(220, -1.2, 100 );
    add_model(scene, "resources/landscape/", "lake2", false, pos, 1, [0, 0, 0])

    // Railway
    pos = new THREE.Vector3(400, 0.1, 320);
    init_railway(scene, 1.5, pos);

    //Train
    pos = new THREE.Vector3(400, 0, 320);
    add_model(scene, "resources/train/", "train", false, pos, 1, [0, 0, 0])
    //Wagon
    pos = new THREE.Vector3(400, 0, 360);
    add_model(scene, "resources/train/", "wagon1", false, pos, 0.7, [0, 0, 0])
    
    // Train Stations
    // Station Positions
    const pi = Math.PI;
    let sp =
    [
        [388, 259, pi],     // -12x
        [270, -255, pi],    // -12x
        [159, -375, -pi/2], // +12z
        [39, -234, 0],      // +12x
        [156, 290, 0],      // +12x
        [196, -194, pi/2]   // -12z
    ]
    loaded_models.light = []
    for (let i = 0; i < sp.length; i++) {
        pos = new THREE.Vector3(sp[i][0], 0.1, sp[i][1]);
        var light = new THREE.PointLight( 0x8ec1e9, 1, 100 );
        light.position.set(sp[i][0], 0.1, sp[i][1]);
        light.translateY(13);
        light.translateX(3);
        light.translateZ(1);
        light.intensity = 0;
        loaded_models.light.push(light)
        scene.add( light );
        add_model(scene, "resources/train_stuff/", "platform", false, pos, 1, [0, sp[i][2], 0])
    }

    // House
    for (let i = 0; i < 4; i++) {
        pos = new THREE.Vector3(103 + 35 * i, 0, -300);
        add_model(scene, "resources/train_stuff/", "house", false, pos, 1, [0, -Math.PI/2, 0])
    }
    for (let i = 0; i < 4; i++) {
        pos = new THREE.Vector3(100 + 35 * i, 0, -275);
        add_model(scene, "resources/train_stuff/", "house", false, pos, 1, [0, Math.PI/2, 0])
    }


    // Train Stuff
    for (let i = 0; i < 3; i++) {
        pos = new THREE.Vector3(-100, 0, i * 70 + 100);
        add_model(scene, "resources/train_stuff/", "turbine", false, pos, 15, [0, Math.PI/4, 0])
    }
    for (let i = 0; i < 3; i++) {
        pos = new THREE.Vector3(-50, 0, i * 70 + 50);
        add_model(scene, "resources/train_stuff/", "turbine", false, pos, 15, [0, Math.PI/4, 0])
    }



    // Duck
    pos = new THREE.Vector3(200, 0, 100);
    add_model(scene, "resources/animals/", "duck", false, pos, 0.1, [0, 0, 0])
    pos = new THREE.Vector3(240, 0, 180);
    add_model(scene, "resources/animals/", "duck", false, pos, 0.1, [0, 0, 0])
    pos = new THREE.Vector3(200, 0, 100);
    add_model(scene, "resources/animals/", "duck", false, pos, 0.1, [0, 0, 0])

    // Frog
    pos = new THREE.Vector3(275, 1, 220);
    add_model(scene, "resources/animals/", "frog", false, pos, 0.2, [0, 0.7, 0])

    // RT
    pos = new THREE.Vector3(193, 0, -72.5);
    add_model(scene, "resources/animals/", "spider", false, pos, 0.1, [0, 0.7, 0])
    pos = new THREE.Vector3(193, 0, -72.5);
    add_model(scene, "resources/animals/", "crown", false, pos, 6, [0, 0.7, 0])


    //pos = new THREE.Vector3(0, 50, 0);
    //add_model(scene, "resources/animals/", "bird", false, pos, 10, [0, 0, 0])
    pos = new THREE.Vector3(0, 200, 0);
    add_model(scene, "resources/animals/", "eagle", false, pos, 0.5, [0, 0, 0])

    // Train Light
    var trainLight = new THREE.SpotLight( 0xffffff );
    trainLight.position.set( 400, 0, 320 );
    trainLight.angle = Math.PI/6
    trainLight.distance = 40
    var targetObject = new THREE.Object3D();
    scene.add(targetObject);
    trainLight.target = targetObject;
    targetObject.position.set(400, 0, 320)
    trainLight.translateY(6)
    trainLight.translateZ(-3)
    trainLight.target.translateZ(-20)
    trainLight.target.updateMatrixWorld();
    scene.add( trainLight );
    loaded_models.trainLight = [trainLight]


}
