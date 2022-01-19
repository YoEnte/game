class Entity{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.move = {
            right       : 0,
            left        : 0,
            down        : 0,
            up          : 0,
            x_diff      : 0,
            y_diff      : 0,
            x_vel       : 0,
            y_vel       : 0,
        };
        this.anm = {
            delay_frame : 0,
            frame : 0,
        };

        this.move = {...entities[type].move, ...this.move};
        this.anm = {...entities[type].anm, ...this.anm};
    }
}

class Player extends Entity{
    constructor(x, y, type){
        super(x, y, type);
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
        ctx.drawImage(document.querySelector('.josef1'), this.anm.frame_size[0] * this.anm.frame, this.anm.frame_size[1] * this.anm.rotation_dir, this.anm.frame_size[0] , this.anm.frame_size[1], this.x - (this.anm.frame_size[0] / 2), this.y - (this.anm.frame_size[1] / 1.2), this.anm.frame_size[0], this.anm.frame_size[1]);
    }

    update(){
		if(controller == 'keyboard'){
			this.move.x_diff = this.move.right - this.move.left;
        	this.move.y_diff = this.move.down - this.move.up;
		}else if(controller == 'mouse'){
			if(Math.abs(mouse_x - player.x) > 2 || Math.abs(mouse_y - player.y) > 2){
				if(this.move.toggle){
					this.move.x_diff = normalize(mouse_x - this.x, mouse_y - this.y)[0];
					this.move.y_diff = normalize(mouse_x - this.x, mouse_y - this.y)[1];

					this.move.x_diff = Math.round(this.move.x_diff * 100) / 100;
					this.move.y_diff = Math.round(this.move.y_diff * 100) / 100;
				}
			}else{
				this.move.x_diff = 0;
				this.move.y_diff = 0;
				this.move.toggle = false;
			}

			if(Math.abs(mouse_x - player.x) > 35 || Math.abs(mouse_y - player.y) > 35){
				this.move.toggle = true;
			}
		}

        this.hypo = Math.sqrt((this.move.x_diff ** 2) + (this.move.y_diff ** 2));

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

        this.x += (isNaN(this.move.x_vel)) ? 0 : this.move.x_vel;
        this.y += (isNaN(this.move.y_vel)) ? 0 : this.move.y_vel;
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
    }
}

Cow