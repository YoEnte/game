const assets = {
	josef1	: 		'assets/images/entities/player_sprites.png',
	map1	: 		'assets/test.png',
}

const entities = {
    josef: {
        move: {
            speed     	: 3,
			toggle		: true,
        },
        anm: {
            delay_frames: 6,
			frame_size	: [32, 64],
            img_size    : [256, 256],
			rotation_deg: 180,
			rotation_top: [320, 40],
			rotation_bot: [220, 140],
            rotation_dir: 2,
            table       : [8, 4],
        }
    },
    cow: {
        move: {
            speed     	: 3,
			toggle		: true,
        },
        anm: {
            delay_frames: 6,
			delay_frame : 0,
			frame_size	: [32, 64],
            frame       : 0,
            img_size    : [256, 256],
			rotation_deg: 180,
			rotation_top: [320, 40],
			rotation_bot: [220, 140],
            rotation_dir: 2,
            table       : [8, 4],
        }
    }
}