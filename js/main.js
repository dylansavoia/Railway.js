// Basics

var scene = new THREE.Scene();
var ratio = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera( 75, ratio, 0.1, 1500 );
var first_person = false
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xd1d1d1, 1);
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );


camera.position.set(435, 100, -212);
// Add Control
var control = new THREE.OrbitControls(camera, renderer.domElement);
control.maxPolarAngle = Math.PI * 0.49;
control.maxDistance = 800;
control.enableDamping = true;
control.dampingFactor = 0.2;
control.panSpeed = 0.3;
control.rotateSpeed = 0.3;
control.zoomSpeed = 1.5;
var lmt = 490;


// Create Lights
var ambient_light = new THREE.AmbientLight( 0xffffff, 0.3 );
var sunlight = new THREE.DirectionalLight( 0xffffff, 1.0 );
sunlight.position.set(-400, 900, -400);

// sunlight.castShadow = false;
// sunlight.shadow.mapSize.width =
// sunlight.shadow.mapSize.height = 4096;
// sunlight.shadow.radius = 2;

// sunlight.shadow.camera.left =
// sunlight.shadow.camera.bottom = -500;
// sunlight.shadow.camera.top =
// sunlight.shadow.camera.right = 500;
// sunlight.shadow.camera.near = 0.1;
// sunlight.shadow.camera.far = 1000;


// Add Basics
scene.add(ambient_light);
scene.add(sunlight);

function update()  {
    if (is_raining) {
        rainGeo.vertices.forEach(p => {
          p.velocity -= 0.1 + Math.random() * 0.1;
          p.y += p.velocity;

          if (p.y < -200) {
            p.y = 800;
            p.velocity = 0;
          }

        });
        rainGeo.verticesNeedUpdate = true ;
    }
    if (!first_person)
        control.update();

    if (camera.position.x > lmt)
        camera.position.x = lmt;
    else if (camera.position.x < -lmt)
        camera.position.x = -lmt;

    if (camera.position.z > lmt)
        camera.position.z = lmt;
    else if (camera.position.z < -lmt)
        camera.position.z = -lmt;

    try{
    	train_audio.volume = Math.min(1, 50 / loaded_models.train[0].position.distanceTo(camera.position));
    	duck_audio.volume = Math.min(1, 10 / loaded_models.lake2[0].position.distanceTo(camera.position));
    	turbine_audio.volume = Math.min(1, 50 / loaded_models.turbine[3].position.distanceTo(camera.position));
    	eagle_audio.volume = Math.min(1, 5 / loaded_models.eagle[0].position.distanceTo(camera.position));
    	frog_audio.volume = Math.min(1, 5 / loaded_models.frog[0].position.distanceTo(camera.position));

    }catch(e){}
}

function main_loop() {
    requestAnimationFrame(main_loop);
    update();
    renderer.render( scene, camera );
};

main_loop();

window.onload = function () {
    speed.value = time_scaling;
    speed.onchange = () => {
        time_scaling = speed.value;
    }
}

window.addEventListener('resize', function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
})

var is_day = true;
function toggleDayNight(){
	var lamp_intensity = 0;
	if(is_day){
		skybox.material.color = night;
		sunlight.intensity = 0.1;
		lamp_intensity = 1;
        is_day = false;
	} else {
        if (is_raining) {
            skybox.material.color = cloudy;
            sunlight.intensity = 0.5;
        } else {
            skybox.material.color = day;
            sunlight.intensity = 1;
        }
        is_day = true;
	}

	for (var i = 0; i < loaded_models.light.length; i++) {
		loaded_models.light[i].intensity = lamp_intensity;
	}
}

var prev_pos = [];
function toggleFirstThirdPerson(){
    tgl1st.classList.toggle('sel');
	if(first_person){
		camera.position.set(prev_pos[0], prev_pos[1], prev_pos[2]);
		camera.lookAt(0,0,0);
		control.enabled = true;
		first_person = false;
	}else{
        let pos = camera.position;
		first_person = true;
		control.enabled = false;

        prev_pos = [pos.x, pos.y, pos.z];
	}
}


var rainGeo, rain;
var rainCount = 20000;
var is_raining = false;

function toggleRain() {
    if (!is_raining) {
        if (is_day) {
            skybox.material.color = cloudy;
            sunlight.intensity = 0.5;
        }

        rainGeo = new THREE.Geometry();
        for(let i=0;i<rainCount;i++) {
            rainDrop = new THREE.Vector3(
                Math.random() * 1000 -500,
                Math.random() * 1000 - 200,
                Math.random() * 1000 - 500
            );
            rainGeo.vertices.push(rainDrop);
            rainDrop.velocity = {};
            rainDrop.velocity = 0;
        }

        rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.15,
            transparent: true
        });
        rain = new THREE.Points(rainGeo,rainMaterial);
        rain_audio.volume = 1;
        scene.add(rain);
        is_raining = true;

    } else {
        if (is_day) {
            skybox.material.color = day;
            sunlight.intensity = 1;
        }
        rain_audio.volume = 0;
        scene.remove(rain);
        is_raining = false;
    }
}

var audio_on = false;

function toggleAudio(){
    audio.value = (audio_on) ? "Enable Audio" : "Disable Audio";
    audio_on = !audio_on;

	audios = document.getElementsByTagName("audio");
	for (var i = 0; i < audios.length; i++) {
		if(audios[i].paused) audios[i].play();
		else audios[i].pause();
	}
}

// toggleRain();
// toggleDayNight()
// toggleFirstThirdPerson()
