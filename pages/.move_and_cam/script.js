document.addEventListener('DOMContentLoaded', onload);

var canvas_size = 32 * 25;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var scale = 1.5;
var half = 2 * scale

canvas.width = canvas_size;
canvas.height = canvas_size / 4 * 3;
canvas.style.width = `${canvas_size}px`;
canvas.style.height = `${canvas_size / 4 * 3}px`;
var newWidth = ctx.width * scale;
var newHeight = ctx.height * scale;

var mouse_x, mouse_y;

class Player{
    constructor(px, py){
        this.px = px;
        this.py = py;

        this.move = {
            right       : 0,
            left        : 0,
            down        : 0,
            up          : 0,
            speed     	: 3,
            x_diff      : 0,
            y_diff      : 0,
            x_vel       : 0,
            y_vel       : 0,
			toggle		: true,
        }
        this.anm = {
            table       : [8, 4],
			frame_size	: [32, 64],
            img_size    : [256, 256],
            frame       : 0,
			rotation_deg: 180,
			rotation_top: [320, 40],
			rotation_bot: [220, 140],
            rotation_dir: 2,
            delay_frames: 6,
			delay_frame : 0,
        }
    }

    draw(){

		this.anm.delay_frame++;
		if(this.anm.delay_frame >= this.anm.delay_frames){
			this.anm.delay_frame = 0;
			
			this.anm.frame = (this.move.x_diff != 0 || this.move.y_diff != 0) ? this.anm.frame + 1 : 0;
			if(this.anm.frame >= this.anm.table[0]){
				this.anm.frame = 0;
			}
		}

		ctx.imageSmoothingEnabled = false;
        ctx.drawImage(document.querySelector('.josef1'), this.anm.frame_size[0] * this.anm.frame, this.anm.frame_size[1] * this.anm.rotation_dir, this.anm.frame_size[0] , this.anm.frame_size[1], this.px - (this.anm.frame_size[0] / 2), this.py - (this.anm.frame_size[1] / 1.2), this.anm.frame_size[0], this.anm.frame_size[1]);
    }

    update(){
		if(controller == 'keyboard'){
			this.move.x_diff = this.move.right - this.move.left;
        	this.move.y_diff = this.move.down - this.move.up;
		}else if(controller == 'mouse'){
			if(Math.abs(mouse_x - player.px) > 2 || Math.abs(mouse_y - player.py) > 2){
				if(this.move.toggle){
					this.move.x_diff = normalize(mouse_x - this.px, mouse_y - this.py)[0];
					this.move.y_diff = normalize(mouse_x - this.px, mouse_y - this.py)[1];

					this.move.x_diff = Math.round(this.move.x_diff * 100) / 100;
					this.move.y_diff = Math.round(this.move.y_diff * 100) / 100;
				}
			}else{
				this.move.x_diff = 0;
				this.move.y_diff = 0;
				this.move.toggle = false;
			}

			if(Math.abs(mouse_x - player.px) > 35 || Math.abs(mouse_y - player.py) > 35){
				this.move.toggle = true;
			}
		}

        this.hypo = Math.sqrt((this.move.x_diff * this.move.x_diff) + (this.move.y_diff * this.move.y_diff));

		if(!(this.move.x_diff == 0 && this.move.y_diff == 0)){
			this.anm.rotation_deg = (Math.atan2(this.move.y_diff, this.move.x_diff) * 180 / Math.PI) + 90;
			if(this.anm.rotation_deg < 0){
				this.anm.rotation_deg += 360;
			}
		}
		
		if(!(this.anm.rotation_deg < this.anm.rotation_top[0] && this.anm.rotation_deg > this.anm.rotation_top[1])){
			this.anm.rotation_dir = 0;
		}else if(this.anm.rotation_deg < this.anm.rotation_bot[1] && this.anm.rotation_deg > this.anm.rotation_top[1]){
			this.anm.rotation_dir = 1;
		}else if(this.anm.rotation_deg < this.anm.rotation_bot[0] && this.anm.rotation_deg > this.anm.rotation_bot[1]){
			this.anm.rotation_dir = 2;
		}else if(this.anm.rotation_deg > this.anm.rotation_bot[0] && this.anm.rotation_deg < this.anm.rotation_top[0]){
            this.anm.rotation_dir = 3;
        }

        this.move.x_vel = (this.move.x_diff / this.hypo) * this.move.speed; 
		this.move.y_vel = (this.move.y_diff / this.hypo) * this.move.speed; 

        this.px += (isNaN(this.move.x_vel)) ? 0 : this.move.x_vel;
        this.py += (isNaN(this.move.y_vel)) ? 0 : this.move.y_vel;
		this.px = Math.round(this.px);
		this.py = Math.round(this.py);
    }
}

const assets = {
	josef1: 'player_sprites.png',
	map1: 'test.png',
}

const assets_num = Object.keys(assets).length;
var assets_loaded = 0;

function onload(){

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

	if(scale < 1){
		scale = 1;
	}
	if(scale > 5){
		scale = 5;
	}

	half = 2 * scale;

    ctx.save();
    ctx.scale(scale, scale)
    ctx.clearRect(-100, -100, canvas_size + 100, canvas_size + 100);
    camera.move(camera.x, camera.y);
    ctx.translate(Math.round(-camera.x + canvas.width / half), Math.round(-camera.y + canvas.height / half));

    let map_img = new Image();
    map_img.src = `${ejs_host}/${ejs_statics}/${ejs_page}/test.png`;
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

        let dx = player.px - x;
        x += dx * easing

        if(x > canvas.width / half && x < 866 - canvas.width / half){
			camera.x = x;
        }else if (x <= canvas.width / half){
            camera.x = canvas.width / half;
        }else{
			camera.x = 866 - canvas.width / half;
		}
        let dy = player.py - y;
        y += dy * easing

        if(y > canvas.height / half && y < 862 - canvas.height / half){
            camera.y = y;
        }else if(y <= canvas.height / half){
            camera.y = canvas.height / half;
        }else{
            camera.y = 862 - canvas.height / half;
        }
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

	if((temp_mouse_x < 0 || temp_mouse_x > canvas_size) || (temp_mouse_y < 0 || temp_mouse_y > canvas_size / 4 * 3)){
		mouse_x = NaN;
		mouse_y = NaN;
	}else{
		mouse_x = temp_mouse_x / scale + camera.x - canvas_size / half ;
		mouse_y = temp_mouse_y / scale + camera.y - canvas_size / 4 * 3 / half ;
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
	if(event.deltaY < 0){
		scale += 0.1;
		scale = Math.floor(scale * 10) / 10;
	}else if(event.deltaY > 0){
		scale -= 0.1;
		scale = Math.floor(scale * 10) / 10;
	}
});

var player = new Player(866 / 2, 862 / 2);