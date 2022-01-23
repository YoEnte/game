class Objects{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type
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
        this.move.old_x = this.x;
        this.move.old_y = this.y;
        this.move = {...objects[type].move, ...this.move};
        this.anm = {...objects[type].anm, ...this.anm};
        this.hitbox = objects[type].hitbox;
        hitbox_list.push(this.hitbox);
    }
	
    hitboxes(){
        this.hitbox_list = hitbox_list.filter(array => array != this.hitbox);
        this.old_velx = this.x - this.move.old_x;
        this.old_vely = this.y - this.move.old_y;
        this.hitbox_list.forEach((array) =>{
            array.forEach((element) => {
                this.hitbox.forEach((box) => {
                    if(element.x != 0 && element.y != 0 && box.x != 0 && box.x != 0){
                        this.x = (element.y < box.y + box.h && element.y + element.h > box.y && this.old_velx != 0) ? // ist es auch im y bereich?!
                            (this.old_velx < 0 && box.x + this.old_velx < element.x + element.w && this.move.old_x - box.w / 2 >= element.x + element.w) ? //ist es im x bereich?!
                                element.x + element.w - box.x_off :     //true
                            (this.old_velx > 0 && element.x < box.x + box.w + this.old_velx && this.move.old_x + box.w / 2 <= element.x) ?
                                element.x + box.x_off : this.x :        //false
                            this.x  ;                                   //else
                        this.y = (element.x < box.x + box.w && element.x + element.w > box.x && this.old_vely != 0) ? 
                            (this.old_vely < 0 && box.y + this.old_vely < element.y + element.h && this.move.old_y >= element.y + element.h) ? 
                                element.y + element.h - box.y_off :     //true
                            (this.old_vely > 0 && element.y < box.y + box.h + this.old_vely && this.move.old_y + box.h / 2 <= element.y) ?
                                element.y + box.y_off : this.y :        //false
                            this.y  ;                                   //else

						/*
							ctx.fillStyle = 'yellow'
                            ctx.fillRect(element.x, element.y, element.w, element.h);
                            ctx.fillStyle = 'blue'
                            ctx.fillRect(box.x, box.y, box.w, box.h);
                            ctx.fillStyle = 'red'
                            ctx.fillRect(element.x, element.y, 1, 1);
                            ctx.fillRect(box.x, box.y, 1, 1);
                            ctx.fillStyle = 'green'
                            ctx.fillRect(element.x + 1, element.y, 1, box.h / 2)
                            ctx.fillStyle = 'pink'
                            ctx.fillRect(this.x, this.y, 1, 1 )
                        */
                    }
                });
            });
        });
        this.move.old_x = this.x;
        this.move.old_y = this.y;
    }
}

class Player extends Objects{
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
        this.hitbox.forEach(box => {
        box.x = this.x + box.x_off;
        box.y = this.y + box.y_off;
		});
		
        add_draw_array({z: this.y, draw : [document.querySelector('.josef1'), this.anm.frame_size[0] * this.anm.frame, this.anm.frame_size[1] * this.anm.rotation_dir, this.anm.frame_size[0] , this.anm.frame_size[1], Math.round(this.x - this.anm.x_off), Math.round(this.y - this.anm.y_off), this.anm.frame_size[0], this.anm.frame_size[1]]});
    }

    operate(){
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
        this.x = (isNaN(this.move.x_vel)) ? this.x : this.x + this.move.x_vel ;
        this.y = (isNaN(this.move.y_vel)) ? this.y : this.y + this.move.y_vel ;
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        Objects.prototype.hitboxes.call(this);
    
        this.draw();
    }
}

class Placeable extends Objects{
    constructor(x, y, type){
        super(x, y, type);
    }
	
    operate(){
        this.draw();
    }

    draw(){
        this.anm.delay_frame++;
		if(this.anm.delay_frame >= this.anm.delay_frames){
			this.anm.delay_frame = 0;
            this.anm.frame++;
            if(this.anm.frame >= this.anm.table[0]){
				this.anm.frame = 0;
			}
		}
        ctx.imageSmoothingEnabled = false;
        this.hitbox.forEach(box => {
        box.x = this.x + box.x_off;
        box.y = this.y + box.y_off;
			//ctx.fillRect(box.x, box.y, box.w, box.h);
		});
        add_draw_array({z: this.y, draw: [document.querySelector(`.${this.type}`), this.anm.frame_size[0] * this.anm.frame, 0, this.anm.frame_size[0] , this.anm.frame_size[1], Math.round(this.x - this.anm.x_off), Math.round(this.y - this.anm.y_off), this.anm.frame_size[0], this.anm.frame_size[1]]});
        ctx.fillRect(this.x,this.y,1,1)
    }
}
