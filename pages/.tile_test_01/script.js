document.addEventListener('DOMContentLoaded', onload);

const canvas_size = 512;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var selected_map = 0;
const maps = [
	{
		size: 8,
		map: [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		],
	},
];

const overlays = [0, 2, 8, 10, 11, 16, 18, 22, 24, 26, 27, 30, 31, 64, 66, 72, 74, 75, 80, 82, 86, 88, 90, 91, 94, 95, 104, 106, 107, 120, 122, 123, 126, 127, 208, 210, 214, 216, 218, 219, 222, 223, 248, 250, 251, 254, 255];

const assets = {
	grass_tile: 'assets/grass_tile_test1.png',
	path_tile: 'assets/path_tile_test1.png',
	path_overlay: 'assets/path_tiles_test1.png',
}

const assets_num = Object.keys(assets).length;
var assets_loaded = 0;

canvas.width = maps[selected_map].size * 16;
canvas.height = maps[selected_map].size * 16;
canvas.style.width = `${canvas_size}px`;
canvas.style.height = `${canvas_size}px`;
const pixel_size = canvas_size / (maps[selected_map].size * 16);

var mouse_x = undefined;
var mouse_y = undefined;

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
	ctx.clearRect(-100, -100, canvas_size + 100, canvas_size + 100);

	maps[selected_map].map.forEach((row, y) => {
		maps[selected_map].map[y].forEach((col, x) => {
			if(col == 0){
				ctx.drawImage(document.querySelector('.grass_tile'), x * 16, y * 16);
			}else if(col == 1){
				ctx.drawImage(document.querySelector('.path_tile'), x * 16, y * 16);

				var tile_num = 0;			// overlay number
				var tile_count = 0;			// count tiles except same
				var this_tile;				// the value of the current surrounding tile
				var tile_okay = false;		// if current surrounding tile should be used as it is
				var overlay_found = false;	// if needed overlay found in array
				var overlay_index = 0;		// overlay index of needed overlay

				for(var tile_y = 0; tile_y < 3; tile_y++){
					for(var tile_x = 0; tile_x < 3; tile_x++){
						this_tile = 0;
						tile_okay = false;

						if(maps[selected_map].map[(y - 1) + tile_y] != undefined){							// if y not out of map
							if(maps[selected_map].map[(y - 1) + tile_y][(x - 1) + tile_x] != undefined){	// if x (and y) not out of map

								if(tile_x == 0 && tile_y == 0){			// top left corner
									if(maps[selected_map].map[(y - 1) + (tile_y + 1)][(x - 1) + (tile_x + 0)] == 1 && maps[selected_map].map[(y - 1) + (tile_y + 0)][(x - 1) + (tile_x + 1)] == 1){
										tile_okay = true;
									}
								}else if(tile_x == 2 && tile_y == 0){	// top right corner
									if(maps[selected_map].map[(y - 1) + (tile_y + 1)][(x - 1) + (tile_x + 0)] == 1 && maps[selected_map].map[(y - 1) + (tile_y + 0)][(x - 1) + (tile_x - 1)] == 1){
										tile_okay = true;
									}
								}else if(tile_x == 0 && tile_y == 2){	// bottom left corner
									if(maps[selected_map].map[(y - 1) + (tile_y - 1)][(x - 1) + (tile_x + 0)] == 1 && maps[selected_map].map[(y - 1) + (tile_y + 0)][(x - 1) + (tile_x + 1)] == 1){
										tile_okay = true;
									}
								}else if(tile_x == 2 && tile_y == 2){	// bottom right corner
									if(maps[selected_map].map[(y - 1) + (tile_y - 1)][(x - 1) + (tile_x + 0)] == 1 && maps[selected_map].map[(y - 1) + (tile_y + 0)][(x - 1) + (tile_x - 1)] == 1){
										tile_okay = true;
									}
								}else{									// not corner
									tile_okay = true;
								}

								if(tile_okay){
									this_tile = maps[selected_map].map[(y - 1) + tile_y][(x - 1) + tile_x];
								}
							}
						}

						if(!((x - 1) + tile_x == x && (y - 1) + tile_y == y)){
							tile_count++;
							tile_num += this_tile * (2 ** (tile_count - 1));
						}
					}
				}

				while(!overlay_found){
					overlay_index = overlays.indexOf(tile_num);

					if(overlay_index == -1){
						tile_num--;
					}else{
						overlay_found = true;
					}
				}

				ctx.drawImage(document.querySelector('.path_overlay'), overlay_index * 16, 0, 16, 16, x * 16, y * 16, 16, 16);
			}
		});
	});

	window.requestAnimationFrame(gameloop);
}

window.addEventListener('mousemove', event => {
	const rect = canvas.getBoundingClientRect();
	var temp_mouse_x = Math.floor((event.clientX - rect.left) / pixel_size);
	var temp_mouse_y = Math.floor((event.clientY - rect.top) / pixel_size);

	if((temp_mouse_x < 0 || temp_mouse_x > maps[selected_map].size * 16) || (temp_mouse_y < 0 || temp_mouse_y > maps[selected_map].size * 16)){
		mouse_x = undefined;
		mouse_y = undefined;
	}else{
		mouse_x = temp_mouse_x;
		mouse_y = temp_mouse_y;
	}
});

window.addEventListener('mousedown', event => {
	if(mouse_x == undefined || mouse_y == undefined){
		return;
	}

	var tile_x = Math.floor(mouse_x / 16);
	var tile_y = Math.floor(mouse_y / 16);

	if(maps[selected_map].map[tile_y][tile_x] == 1){
		maps[selected_map].map[tile_y][tile_x] = 0;
	}else{
		maps[selected_map].map[tile_y][tile_x] = 1;
	}
});