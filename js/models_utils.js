/*************************/
/*        Common         */
/*************************/
function add_model(scene, path, name, shadow, pos, scale=1, rot=[0,0,0]){
    if (!loaded_models[name])
        loaded_models[name] = []
    new THREE.MTLLoader()
        .setPath( path )
        .setMaterialOptions({side: THREE.DoubleSide}) 
        .load( name + ".mtl", function ( materials ) {

            materials.preload();
            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( path )
                .load( name + ".obj", function ( object ) {
                    object.scale.set(scale, scale, scale);
                    object.position.set(pos.x, pos.y, pos.z)
                    object.rotation.x += rot[0]
                    object.rotation.y += rot[1]
                    object.rotation.z += rot[2]
                    if (shadow) {
                        object.traverse(function(child){
                            child.castShadow = true;
                        });
                    }
                    loaded_models[name].push(object)
                    scene.add( object );
                } );
        } );
}

function rotate_vector_y(vec, angle){
    result = new THREE.Vector3();
    result.add(vec);
    result.applyAxisAngle(new THREE.Vector3(0,1,0), angle);
    return result;
}

function add_vectors(v1, v2){
    result = new THREE.Vector3();
    result.addVectors(v1, v2);
    return result;
}

function rand(min, max) {
    return (Math.random() * (max - min)) + min;
}

/*************************/
/*         Rails         */
/*************************/
rails_folder = "resources/rails/"

const rails = {
    STRAIGHT: {
        file: "rail_straight",
        base_link: new THREE.Vector3(0,0,-10.125),
        link1: new THREE.Vector3(0,0,-10.125),
        rotation1: 0,
    },
    STOP: {
        base_link: new THREE.Vector3(0,0,0),
        link1: new THREE.Vector3(0,0,0),
        rotation1: 0,
    },
    TURN_LEFT: {
        file: "rail_turn_left",
        base_link: new THREE.Vector3(0,0,-10.125),
        link1: new THREE.Vector3(-2.209, 0, -10.061),
        rotation1: 18*Math.PI/180,
    },
    SWITCH_LEFT: {
        file: "rail_switch_left",
        base_link: new THREE.Vector3(0,0,-10.125),
        link1: new THREE.Vector3(0,0,-10.125),
        rotation1: 0,
        link2: new THREE.Vector3(-2.209, 0, -10.061),
        rotation2: 18*Math.PI/180,
    },
    TURN_RIGHT: {
        file: "rail_turn_right",
        base_link: new THREE.Vector3(0,0,-10.125),
        link1: new THREE.Vector3(+2.209, 0, -10.061),
        rotation1: -18*Math.PI/180,
    },
}


const railway = [];
function create_rail_node(rail, first_child = null, second_child = null){
    var rail_node = {
        rail: rail,
        first_child: first_child,
        second_child: second_child,
        drawed: false,
    }
    railway.push(rail_node);
    return rail_node;
}

function repeat_rail(type, start, end) {
    for (let i = start; i <= end; i++)
        create_rail_node(type, i);
}

function traverse(scene, scale, Id, pos, rot) {
    if(Id == null || railway[Id].drawed) return;
    var node = railway[Id]
    pos = add_vectors(pos, rotate_vector_y(node.rail.base_link, rot))
    if (node.rail != rails.STOP)
        add_model(scene, rails_folder, node.rail.file, false, pos, scale, [0,rot, 0])
    

    node.drawed = true
    node.pos = pos
    node.rot = rot
    if(node.first_child != null){
        pos1 = add_vectors(pos, rotate_vector_y(node.rail.link1, rot))
        rot1 = rot + node.rail.rotation1
        traverse(scene, scale, node.first_child, pos1, rot1);
    }

    if(node.second_child != null){
        pos2 = add_vectors(pos, rotate_vector_y(node.rail.link2, rot))
        rot2 = rot + node.rail.rotation2
        traverse(scene, scale, node.second_child, pos2, rot2);

    }
}


function init_railway(scene, scale, startPos){
    for (var k in rails) {
        rails[k].base_link.multiplyScalar(scale);

        rails[k].link1.multiplyScalar(scale);
        if(rails[k].link2)
            rails[k].link2.multiplyScalar(scale);
    }

    traverse(scene, scale, 0, startPos, 0)
}

/*************************/
/*        Forest         */
/*************************/

const trees = {
    'tree': {
        'scale': [2.5, 5],
    },
    'tree2': {
        'scale': [5, 12],
    },
}

function create_tree(tree, pos, rot, scale) {
    // Fix Models' quirks
    if (tree == 'tree3') pos.y += 20;

    add_model(scene, "resources/landscape/", tree, true, pos, scale, [0, rot, 0]);
}

function generate_forest(tree, min, max, n) {
    var x, z, scale, rot, pos;

    // Trees Properties
    var tp = trees[tree];

    for (let i = 0; i < n; i++) {
        x = rand(min[0], max[0]);
        z = rand(min[1], max[1]);

        scale = rand(tp.scale[0], tp.scale[1]);
        rot = rand(0, Math.PI);

        pos = new THREE.Vector3(x, 0, z);
        create_tree(tree, pos, rot, scale);
    }
}
