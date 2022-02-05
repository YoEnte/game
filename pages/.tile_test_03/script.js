document.addEventListener('DOMContentLoaded', onload);

const canvas_size = 512;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const selected_map = 0;
const mapData = {
	size		: maps[selected_map].size,
	map			: maps[selected_map].map,
	tileType	: maps[selected_map].tileType,
	tileSize	: tileTypes[maps[selected_map].tileType].size,
	centerSize	: tileTypes[maps[selected_map].tileType].centerSize,
	edgeSize	: (tileTypes[maps[selected_map].tileType].size - tileTypes[maps[selected_map].tileType].centerSize) / 2,
};

const assets = {
	ggrass_tiles	: 'assets/grass_tiles_test3.png',
	ppath_tiles	: 'assets/path_tiles_test3.png',
	sstone_tiles	: 'assets/stone_tiles_test3.png',
    grass_tiles	: 'assets/grass_tiles4.png',
	path_tiles	: 'assets/path_tiles4.png',
	stone_tiles	: 'assets/stone_tiles4.png',
}

const assets_num = Object.keys(assets).length;
var assets_loaded = 0;

canvas.width = mapData.size * mapData.tileSize;
canvas.height = mapData.size * mapData.tileSize;
canvas.style.width = `${canvas_size}px`;
canvas.style.height = `${canvas_size}px`;
const pixel_size = canvas_size / (mapData.size * mapData.tileSize);

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

	var draw_map = gen_draw_map();
	console.table(draw_map)

	render_map(draw_map);

	//window.requestAnimationFrame(gameloop);
}

function render_map(draw_map){
	draw_map.forEach((row, y) => {
		draw_map.forEach((col, x) => {
			ctx.imageSmoothingEnabled = false;
			draw_map[y][x].forEach(elem => {
				ctx.drawImage(...elem.draw);
			});
		});
	});
}

function gen_draw_map(){
	draw_map = [];

	mapData.map.forEach((row, y) => {
		draw_map.push([]);

		mapData.map[y].forEach((col, x) => {
			draw_map[y].push([]);

			// center
			var draw_array = {
				z		: col[0],
				draw	: [
					document.querySelector(`.${tileTypes[mapData.tileType].tiles[col[0]][col[1]]}`),
					mapData.edgeSize + (0 * mapData.tileSize),
					mapData.edgeSize,
					mapData.centerSize,
					mapData.centerSize,
					(x * mapData.tileSize) + mapData.edgeSize,
					(y * mapData.tileSize) + mapData.edgeSize,
					mapData.centerSize,
					mapData.centerSize,
				],
			};

			draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);

			// edges and corners
			for(var tileY = 0; tileY < 3; tileY++){
				for(var tileX = 0; tileX < 3; tileX++){

					var countPos = (tileY * 3) + tileX;

					var xMargin = (tileX == 1) ? mapData.edgeSize : (tileX == 2) ? mapData.edgeSize + mapData.centerSize : 0;
					var yMargin = (tileY == 1) ? mapData.edgeSize : (tileY == 2) ? mapData.edgeSize + mapData.centerSize : 0;

					var tileColX = (x - 1) + tileX;
					var tileColY = (y - 1) + tileY;
					if(mapData.map[(y - 1) + tileY] != undefined && mapData.map[tileColY][tileColX] != undefined){
						var tileCol = mapData.map[tileColY][tileColX];
					}else{
						var tileCol = undefined;
					}
					
					if(countPos % 2 == 0 && countPos != 4){						// if corner

						var xDiff = tileColX - x;
						var yDiff = tileColY - y;

						// own corner extension
						var lowestSubtile	= col[1];
						var lowestTile 		= col[0];
						lowestSubtile 		= (mapData.map[y + yDiff] != undefined && mapData.map[y + yDiff][x + xDiff] != undefined) ? (mapData.map[y + yDiff][x + xDiff][0] < lowestTile) ? mapData.map[y + yDiff][x + xDiff][1] : lowestSubtile : lowestSubtile;	// corner
						lowestTile 			= (mapData.map[y + yDiff] != undefined && mapData.map[y + yDiff][x + xDiff] != undefined) ? (mapData.map[y + yDiff][x + xDiff][0] < lowestTile) ? mapData.map[y + yDiff][x + xDiff][0] : lowestTile : lowestTile;		// corner
						lowestSubtile 		= (mapData.map[y][x + xDiff] != undefined) ? (mapData.map[y][x + xDiff][0] < lowestTile) ? mapData.map[y][x + xDiff][1] : lowestSubtile : lowestSubtile;					// edge x
						lowestTile 			= (mapData.map[y][x + xDiff] != undefined) ? (mapData.map[y][x + xDiff][0] < lowestTile) ? mapData.map[y][x + xDiff][0] : lowestTile  : lowestTile;						// edge x
						lowestSubtile 		= (mapData.map[y + yDiff] != undefined) ? (mapData.map[y + yDiff][x][0] < lowestTile) ? mapData.map[y + yDiff][x][1] : lowestSubtile : lowestSubtile;					// edge y
						lowestTile 			= (mapData.map[y + yDiff] != undefined) ? (mapData.map[y + yDiff][x][0] < lowestTile) ? mapData.map[y + yDiff][x][0] : lowestTile : lowestTile;						// edge y

						var draw_array = {
							z		: lowestTile,
							draw	: [
								document.querySelector(`.${tileTypes[mapData.tileType].tiles[lowestTile][lowestSubtile]}`),
								xMargin + (3 * mapData.tileSize),
								yMargin,
								mapData.edgeSize,
								mapData.edgeSize,
								(x * mapData.tileSize) + xMargin,
								(y * mapData.tileSize) + yMargin,
								mapData.edgeSize,
								mapData.edgeSize,
							],
						};

						draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);

						// overlay corner
						if(col[0] > lowestTile || (col[0] > lowestTile && tileCol == undefined)){
							var cornerOverlay = 0;

							cornerOverlay += (mapData.map[y][x + xDiff] == undefined || (tileCol != undefined && col[0] <= mapData.map[y][x + xDiff][0])) ? 1 : 0; 	// horizontal
							cornerOverlay += (mapData.map[y + yDiff] == undefined || (tileCol != undefined && col[0] <= mapData.map[y + yDiff][x][0])) ? 2 : 0;		// vertical

							// own
							var draw_array = {
								z		: col[0],
								draw	: [
									document.querySelector(`.${tileTypes[mapData.tileType].tiles[col[0]][col[1]]}`),
									xMargin + ((4 + cornerOverlay) * mapData.tileSize),
									yMargin,
									mapData.edgeSize,
									mapData.edgeSize,
									(x * mapData.tileSize) + xMargin,
									(y * mapData.tileSize) + yMargin,
									mapData.edgeSize,
									mapData.edgeSize,
								],
							};

							draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);

							// others
							if(cornerOverlay == 0 || ((cornerOverlay == 1 || cornerOverlay == 2) && (mapData.map[y + yDiff] != undefined || mapData.map[y][x + xDiff] != undefined))){
								if((tileCol != undefined && col[0] > mapData.map[y][x + xDiff][0]) && mapData.map[y][x + xDiff][0] != lowestTile){		// horizontal

									var draw_array = {
										z		: mapData.map[y][x + xDiff][0],
										draw	: [
											document.querySelector(`.${tileTypes[mapData.tileType].tiles[mapData.map[y][x + xDiff][0]][mapData.map[y][x + xDiff][1]]}`),
											xMargin + (5 * mapData.tileSize),
											yMargin,
											mapData.edgeSize,
											mapData.edgeSize,
											(x * mapData.tileSize) + xMargin,
											(y * mapData.tileSize) + yMargin,
											mapData.edgeSize,
											mapData.edgeSize,
										],
									};

									draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);
								}

								if((tileCol != undefined && col[0] > mapData.map[y + yDiff][x][0]) && mapData.map[y + yDiff][x][0] != lowestTile){		// horizontal

									var draw_array = {
										z		: mapData.map[y + yDiff][x][0],
										draw	: [
											document.querySelector(`.${tileTypes[mapData.tileType].tiles[mapData.map[y + yDiff][x][0]][mapData.map[y + yDiff][x][1]]}`),
											xMargin + (6 * mapData.tileSize),
											yMargin,
											mapData.edgeSize,
											mapData.edgeSize,
											(x * mapData.tileSize) + xMargin,
											(y * mapData.tileSize) + yMargin,
											mapData.edgeSize,
											mapData.edgeSize,
										],
									};

									draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);
								}
							}
						}

					}else if(countPos % 2 == 1){								// if edge

						var xSize = (tileX == 1) ? mapData.centerSize : mapData.edgeSize;
						var ySize = (tileY == 1) ? mapData.centerSize : mapData.edgeSize;

						if(tileCol == undefined || tileCol[0] >= col[0]){		// if should connect
							
							// own edge extension
							var draw_array = {
								z		: col[0],
								draw	: [
									document.querySelector(`.${tileTypes[mapData.tileType].tiles[col[0]][col[1]]}`),
									xMargin + (1 * mapData.tileSize),
									yMargin,
									xSize,
									ySize,
									(x * mapData.tileSize) + xMargin,
									(y * mapData.tileSize) + yMargin,
									xSize,
									ySize,
								],
							};

							draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);
						}else{
							
							// connection edge from neighbour
							var draw_array = {
								z		: tileCol[0],
								draw	: [
									document.querySelector(`.${tileTypes[mapData.tileType].tiles[tileCol[0]][tileCol[1]]}`),
									xMargin + (1 * mapData.tileSize),
									yMargin,
									xSize,
									ySize,
									(x * mapData.tileSize) + xMargin,
									(y * mapData.tileSize) + yMargin,
									xSize,
									ySize,
								],
							};

							draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);

							// own edge overlay
							var draw_array = {
								z		: col[0],
								draw	: [
									document.querySelector(`.${tileTypes[mapData.tileType].tiles[col[0]][col[1]]}`),
									xMargin + (2 * mapData.tileSize),
									yMargin,
									xSize,
									ySize,
									(x * mapData.tileSize) + xMargin,
									(y * mapData.tileSize) + yMargin,
									xSize,
									ySize,
								],
							};

							draw_map[y][x] = add_draw_array(draw_map[y][x], draw_array);
						}
					}
				}
			}
		});
	});

	return draw_map;
}

function add_draw_array(draw_list, draw_array){

	draw_list.every((item, i) => {
		if(item.z > draw_array.z){
			draw_list.splice(i, 0, draw_array);
			return false;
		}

		if(i == draw_list.length - 1){
			draw_list.push(draw_array);
		}

		return true;
	});

	if(draw_list.length == 0){
		draw_list.push(draw_array);
	}

	return draw_list;
}

window.addEventListener('mousemove', event => {
	const rect = canvas.getBoundingClientRect();
	var temp_mouse_x = Math.floor((event.clientX - rect.left) / pixel_size);
	var temp_mouse_y = Math.floor((event.clientY - rect.top) / pixel_size);

	if((temp_mouse_x < 0 || temp_mouse_x > mapData.size * mapData.tileSize) || (temp_mouse_y < 0 || temp_mouse_y > mapData.size * mapData.tileSize)){
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

	var tileX = Math.floor(mouse_x / mapData.tileSize);
	var tileY = Math.floor(mouse_y / mapData.tileSize);

	if(mapData.map[tileY][tileX] == 1){
		mapData.map[tileY][tileX] = 0;
	}else{
		mapData.map[tileY][tileX] = 1;
	}
});