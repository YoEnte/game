document.addEventListener('DOMContentLoaded', onload);

var canvas_size = 0;
var fov = 32 * 20;
var ratio = 9 / 16;
var pixel_size = 1;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var scale = 1.5;
var half = 2 * scale

var newWidth = ctx.width * scale;
var newHeight = ctx.height * scale;

var mouse_x, mouse_y;


const assets_num = Object.keys(assets).length;
var assets_loaded = 0;

function onload(){
    resize();
	Object.keys(assets).forEach(elem => {
		let img_node = document.createElement('img');
		img_node.classList.add(elem);
		img_node.src = `${ejs_host}/${ejs_statics}/${ejs_page}/${assets[elem]}`;
		img_node.addEventListener('load', event => {
			assets_loaded++;

			if(assets_num == assets_loaded){
				gameloop();
			}
		});
		
		document.querySelector('.img_loader').appendChild(img_node);
	});
}

function gameloop(){
	if(_mousedown){
		get_mouse(mouse_event);
	}

	half = 2 * scale;

    ctx.save();
    ctx.scale(scale, scale)
    ctx.clearRect(-100, -100, canvas_size + 100, canvas_size + 100);
    camera.move(camera.x, camera.y);
    ctx.translate(Math.round(-camera.x + canvas.width / half), Math.round(-camera.y + canvas.height / half));

	ctx.imageSmoothingEnabled = false;
    ctx.drawImage(document.querySelector('.map1'), 0, 0);
    player.update();
	player.draw();
	ctx.restore()

    window.requestAnimationFrame(gameloop);
}

var camera = {
    move(x, y) {
        let easing = 0.05 * (half / 2);

        let dx = player.x - x;
        x += dx * easing

        if(x > canvas.width / half && x < 866 - canvas.width / half){
			camera.x = x;
        }else if (x <= canvas.width / half){
            camera.x = canvas.width / half;
        }else{
			camera.x = 866 - canvas.width / half;
		}
        let dy = player.y - y;
        y += dy * easing

        if(y > canvas.height / half && y < 862 - canvas.height / half){
            camera.y = y;
        }else if(y <= canvas.height / half){
            camera.y = canvas.height / half;
        }else{
            camera.y = 862 - canvas.height / half;
        }

        return camera.x, camera.y;
    },
    x: 866 / 2,
    y: 862 / 2,
}

function normalize(x, y){
    let n = Math.max(Math.abs(x), Math.abs(y)) 
    y = y / n;
    x = x / n;
    return [x, y];
}


function resize(){
    canvas_size = document.body.clientWidth - 30;
    if(canvas_size * ratio > document.body.clientHeight) {
        canvas_size = document.body.clientHeight / ratio;
    }

    scale = ((canvas_size + 30) / fov);
    canvas.width = canvas_size;
    canvas.height = canvas_size * ratio;
    canvas.style.width = `${canvas_size}px`;
    canvas.style.height = `${canvas_size * ratio}px`;
}

window.addEventListener('resize', resize);


var controller = 'keyboard';
function toggle_controller(){
	if(controller == 'keyboard'){
		controller = 'mouse';
	}else if(controller == 'mouse'){
		controller = 'keyboard';
	}
}

window.addEventListener('keydown', event => {
    if(event.which == 68) player.move.right = 1;
    if(event.which == 65) player.move.left = 1;
    if(event.which == 83) player.move.down = 1;
    if(event.which == 87) player.move.up = 1;
});

window.addEventListener('keyup',  event => {
    if(event.which == 68) player.move.right = 0;
    if(event.which == 65) player.move.left = 0;
    if(event.which == 83) player.move.down = 0;
    if(event.which == 87) player.move.up = 0;
});

window.addEventListener('blur', event => {
	player.move.right = 0;
    player.move.left = 0;
    player.move.down = 0;
    player.move.up = 0;
});


var _mousedown = false;
var mouse_event = undefined;

function mousedown(event){
	_mousedown = true;
	player.move.toggle = true;
	mouse_event = event;
}

function mouseup(event){
	_mousedown = false;
	mouse_event = undefined;
	mouse_x = NaN;
	mouse_y = NaN;
}

function get_mouse(event){
	const rect = canvas.getBoundingClientRect();
    var temp_mouse_x = Math.floor(event.clientX - rect.left);
    var temp_mouse_y = Math.floor(event.clientY - rect.top);

	if((temp_mouse_x < 0 || temp_mouse_x > canvas_size) || (temp_mouse_y < 0 || temp_mouse_y > canvas_size * ratio)){
		mouse_x = NaN;
		mouse_y = NaN;
	}else{
		mouse_x = temp_mouse_x / scale + camera.x - canvas_size / half ;
		mouse_y = temp_mouse_y / scale + camera.y - canvas_size * ratio / half ;
	}
}

window.addEventListener('mousedown', mousedown);
window.addEventListener('mouseup', mouseup);
window.addEventListener('mouseout', mouseup);
window.addEventListener('mousemove', event => {
	if(_mousedown){
		mouse_event = event;
	}
});

window.addEventListener('wheel', event => {
    if(event.deltaY > 0) {
        fov = (fov < 32 * 20) ? fov + 32 : 32 * 20;
    }else if(event.deltaY < 0){
        fov = (fov > 32 * 8) ? fov - 32 : 32 * 8;
    }
	
	scale = ((canvas_size + 30) / fov);
});

var player = new Player(866 / 2, 862 / 2, 'josef');