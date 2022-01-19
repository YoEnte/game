exports.pages = {
	// normal pages
	home: {
		directory: '_home',
		password: false,
	},
    restricted: {
		directory: '_restricted',
		password: false,
	},
    uptime: {
		directory: '_uptime',
		password: '81hy%l:3D',
	},
    404: {
		directory: '_404',
		password: false,
	},
	launcher: {
		directory: '_launcher',
		password: false,
	},

	// game tests
	move_test1: {
		directory: '.move',
		password: false,
		type: 'snapshot',
	},
	tile_test1: {
		directory: '.tile_test_01',
		password: false,
		type: 'snapshot',
	},
	tile_test2: {
		directory: '.tile_test_02',
		password: false,
		type: 'snapshot',
	},
	move_and_cam_test1: {
		directory: '.move_and_cam',
		password: false,
		type: 'snapshot',
	},
    external_file: {
        directory:  '.external_file',
        password: false,
        type: 'experimental',
    },
	canvas_test1: {
		directory:  '.canvas_test_01',
        password: false,
        type: 'experimental',
	},

	// game versions
	game_v0_1_0: {
        directory:  'game_v0.1.0',
        password: false,
        type: 'experimental',
    }
};

exports.gen_password = 'ie3H;1(q9';