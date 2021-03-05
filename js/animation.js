var FPS = 30
var curr_rail = railway[0];
var curr_rail_id = 0;
var animation_interval = null;
var time_scaling = 0.5//2;
var time = 0;
var lap = 0;
var train_wheel_rot = 0;
var duck_rot = 0;
var old_pos = []
var old_rot = []
var delay = 100
for(let i = 0; i < delay; i++){
    old_pos[i] = new THREE.Vector3(400, 0, 300 + i);
    old_rot[i] = 0
}
var wanted_distance = 20;

function interpolate(x, xa, ya, xb, yb){
    return ((yb-ya)/(xb-xa))*(x-xa) + ya
}

function animation(){
    if (loaded_models.train && loaded_models.train[0] && loaded_models.wagon1 && loaded_models.wagon1[0]){
        if(Math.floor(time) > curr_rail_id){
            curr_rail = railway[curr_rail.first_child]
            curr_rail_id = Math.floor(time);
        }

        
        var t = time%1;
        var ta = 0;
        var tb = 1;
        child = railway[curr_rail.first_child]
        grandchild = railway[child.first_child]
        r1 = curr_rail.rot + 2*Math.PI*lap
        r2 = child.rot + 2*Math.PI*lap
        if (Math.abs(r1-r2) > Math.PI/2) lap++

        r2 = child.rot + 2*Math.PI*lap


        loaded_models.train[0].position.x = interpolate(t, ta, curr_rail.pos.x, tb, railway[curr_rail.first_child].pos.x)
        loaded_models.train[0].position.z = interpolate(t, ta, curr_rail.pos.z, tb, railway[curr_rail.first_child].pos.z)
        loaded_models.train[0].rotation.y = interpolate(t, ta, r1, tb, r2)


        loaded_models.trainLight[0].translateY(-6);
        loaded_models.trainLight[0].translateZ(+3);
        loaded_models.trainLight[0].position.x = loaded_models.train[0].position.x;
        loaded_models.trainLight[0].position.z = loaded_models.train[0].position.z;
        loaded_models.trainLight[0].target.position.x = loaded_models.train[0].position.x;
        loaded_models.trainLight[0].target.position.z = loaded_models.train[0].position.z;

        
        loaded_models.trainLight[0].target.rotation.y = loaded_models.train[0].rotation.y 
        loaded_models.trainLight[0].target.translateZ(-20);
        loaded_models.trainLight[0].target.updateMatrixWorld()
        loaded_models.trainLight[0].translateY(6);
        loaded_models.trainLight[0].translateZ(-3);
        if(first_person){
            camera.position.set(loaded_models.train[0].position.x, 10, loaded_models.train[0].position.z);
            camera_target = new THREE.Vector3(loaded_models.trainLight[0].target.position.x, 10, loaded_models.trainLight[0].target.position.z)
            camera.lookAt(camera_target)
        }
        var best_old = 0;
        var best_epsilon = null;
        for(let i = 0; i < delay; i++){
            var d = loaded_models.train[0].position.distanceTo(old_pos[i])
            var epsilon = Math.abs(d - wanted_distance);
            if ((!best_epsilon || best_epsilon > epsilon) && d >= wanted_distance){
                best_epsilon = epsilon;
                best_old = i;
            }
        }


        loaded_models.wagon1[0].position.x = old_pos[best_old].x
        loaded_models.wagon1[0].position.z = old_pos[best_old].z
        loaded_models.wagon1[0].rotation.y = old_rot[best_old]


        if(curr_rail.pos.x != railway[curr_rail.first_child].pos.x || curr_rail.pos.z != railway[curr_rail.first_child].pos.z){
            delta = new THREE.Vector2();
            delta.x = Math.cos(train_wheel_rot)
            delta.y = Math.sin(train_wheel_rot)
            loaded_models.train[0].children[11].translateZ(delta.x*0.04)
            loaded_models.train[0].children[11].translateY(delta.y*0.04)
            train_wheel_rot += 0.1
            for(let i = 0; i < delay-1; i++){
                old_pos[i].x = old_pos[i+1].x
                old_pos[i].z = old_pos[i+1].z
                old_rot[i] = old_rot[i+1]
            }
            old_pos[delay-1].x = loaded_models.train[0].position.x
            old_pos[delay-1].z = loaded_models.train[0].position.z
            old_rot[delay-1] = loaded_models.train[0].rotation.y
            if(train_audio.paused && audio_on) train_audio.play()
        }else{
            if(!train_audio.paused) train_audio.pause()
        }

    }
    if(loaded_models.turbine && loaded_models.turbine[0]){
        for (var i = 0; i < loaded_models.turbine.length; i++) {
            loaded_models.turbine[i].children[2].translateY(3.4);
            loaded_models.turbine[i].children[2].rotation.x += 0.06;
            loaded_models.turbine[i].children[2].translateY(-3.4);
        }
    }
    if(loaded_models.eagle && loaded_models.eagle[0]){
        loaded_models.eagle[0].children[0].rotation.z=-0.3
        loaded_models.eagle[0].translateX(200)
        loaded_models.eagle[0].rotation.y += 0.01;
        loaded_models.eagle[0].translateX(-200)
    }

    if(loaded_models.duck && loaded_models.duck[0]){
        loaded_models.duck[0].position.x = 200 +  20*(Math.cos(duck_rot))
        loaded_models.duck[0].position.z = 100 +  20*(Math.sin(duck_rot))
        loaded_models.duck[0].rotation.y = -duck_rot
        duck_rot += 0.005
    }

    if(loaded_models.duck && loaded_models.duck[0]){
        loaded_models.duck[1].position.x = 240 -  40*(Math.cos(duck_rot))
        loaded_models.duck[1].position.z = 180 -  40*(Math.sin(duck_rot))
        loaded_models.duck[1].rotation.y = -duck_rot - Math.PI
        duck_rot += 0.005
    }
    if(loaded_models.duck && loaded_models.duck[0]){
        loaded_models.duck[2].position.x = 180 + 20*Math.sin(duck_rot)
        loaded_models.duck[2].position.z = 30 
        loaded_models.duck[2].rotation.y = Math.PI/2 * Math.abs(Math.cos(duck_rot))/Math.cos(duck_rot)
        duck_rot += 0.005
    }
    
    


    time += 0.05 * time_scaling;                
    curr_frame++;
}

function startAnimation(){
    clearInterval(animation_interval);
    curr_frame=0;
    animation_interval = setInterval(animation, (1/FPS)*1000);
}

startAnimation()
