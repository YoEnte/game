document.addEventListener('DOMContentLoaded', gameLoop);

var canvas_size = 32 * 16;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas_size;
canvas.height = canvas_size;
canvas.style.width = canvas_size;
canvas.style.height = canvas_size;

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
            file        : 'player_sprites.png',
        }
        this.image = new Image();
        this.image.src = `${ejs_host}/${ejs_statics}/${ejs_page}/${this.anm.file}`;
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
        ctx.drawImage(this.image, this.anm.frame_size[0] * this.anm.frame, this.anm.frame_size[1] * this.anm.rotation_dir, this.anm.frame_size[0] , this.anm.frame_size[1], this.px - (this.anm.frame_size[0] / 2), this.py - (this.anm.frame_size[1] / 1.2), this.anm.frame_size[0], this.anm.frame_size[1]);
    }

    update(){
		if(controller == 'keyboard'){
			this.move.x_diff = this.move.right - this.move.left;
        	this.move.y_diff = this.move.down - this.move.up;
		}else if(controller == 'mouse'){
			if(Math.abs(mouse_x - player1.px) > 2 || Math.abs(mouse_y - player1.py) > 2){
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

			if(Math.abs(mouse_x - player1.px) > 35 || Math.abs(mouse_y - player1.py) > 35){
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

function gameLoop(){
    ctx.clearRect(-100, -100, canvas_size + 100, canvas_size + 100);

    player1.update();
	player1.draw();

    window.requestAnimationFrame(gameLoop);
}

var controller = 'mouse';
function toggle_controller(){
	if(controller == 'keyboard'){
		controller = 'mouse';
	}else if(controller == 'mouse'){
		controller = 'keyboard';
	}
}

document.addEventListener('keydown', event => {
    if(event.which == 68) player1.move.right = 1;
    if(event.which == 65) player1.move.left = 1;
    if(event.which == 83) player1.move.down = 1;
    if(event.which == 87) player1.move.up = 1;
});

document.addEventListener('keyup',  event => {
    if(event.which == 68) player1.move.right = 0;
    if(event.which == 65) player1.move.left = 0;
    if(event.which == 83) player1.move.down = 0;
    if(event.which == 87) player1.move.up = 0;
});

window.addEventListener('blur', event => {
	player1.move.right = 0;
    player1.move.left = 0;
    player1.move.down = 0;
    player1.move.up = 0;
});

var _mousedown = false;

function mousedown(event){
	_mousedown = true;
	player1.move.toggle = true;
	get_mouse();
}

function mouseup(event){
	_mousedown = false;
	mouse_x = NaN;
	mouse_y = NaN;
}

function get_mouse(){
	const rect = canvas.getBoundingClientRect();
    var temp_mouse_x = Math.floor(event.clientX - rect.left);
    var temp_mouse_y = Math.floor(event.clientY - rect.top);

	if((temp_mouse_x < 0 || temp_mouse_x > canvas_size) || (temp_mouse_y < 0 || temp_mouse_y > canvas_size)){
		mouse_x = NaN;
		mouse_y = NaN;
	}else{
		mouse_x = temp_mouse_x;
		mouse_y = temp_mouse_y;
	}
}

document.addEventListener('mousedown', mousedown);
document.addEventListener('mouseup', mouseup);
document.addEventListener('mouseout', mouseup);
document.addEventListener('mousemove', event => {
	if(_mousedown){
		get_mouse();
	}
});

var player1 = new Player(canvas_size / 2, canvas_size / 2);
function normalize(x, y){
    let n = Math.max(Math.abs(x), Math.abs(y)) 
    y = y / n;
    x = x / n;
    return [x, y];
}