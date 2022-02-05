selected_map = 0;

const assets = {
	josef1	: 		'assets/images/entities/player_sprites.png',
	map0	: 		'assets/images/maps/huette1.png',
	map1	: 		'assets/images/maps/test.png',
    campfire:       'assets/images/objects/campfire_sprites.png'
}

const objects = {
    josef: {
        move: {
            speed     	: 3,
			toggle		: true,
        },
        anm: {
            src         : 'player_sprites.png',
            delay_frames: 6,
			frame_size	: [32, 64],
            img_size    : [256, 256],
			rotation_deg: 180,
			rotation_top: [320, 40],
			rotation_bot: [220, 140],
            rotation_dir: 2,
            table       : [8, 4],
            x_off       : 16,
            y_off       : 60,
        },
        hitbox: [
			{w: 16, h: 8, x: 0, y: 0, x_off: -8, y_off: -4},
		],
    },
    campfire: {
        move: {},
        anm: {
            src         : 'player_sprites.png',
            delay_frames: 6,
			frame_size	: [32, 32],
            img_size    : [256, 32],
            table       : [8, 1],
            x_off       : 16,
            y_off       : 24,
        },
        hitbox: [
            {w: 23, h: 12, x: 0, y: 0, x_off: -11, y_off: -5},
        ]
    }
}

const map = [
    {
        height: 960,
        width: 960
    },
    {
        height: 862,
        width: 866,
    }
];
