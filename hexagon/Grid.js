
Grid = function(width, height){
	this.hexes;
	this.width = width;
	this.height = height;
	this.hexWidth;
	
	this.create = function(){
		this.hexes = [];
	//	this.hexWidth = Math.floor(document.getElementById("sideLength").value) * cam.zoom;
		this.hexWidth = 25 * cam.zoom;
		
		// console.log("create with zoom: " + cam.zoom + " for effective sideLength: " + this.hexWidth);
		
		for (var i = 1; i < 45; i++){
			count++
			for (var j = 1; j < 45; j++){
				var hex = new Hexagon(i, j, this.hexWidth);
				this.hexes.push(hex);
			}
		}
	}
	
	
	this.update = function(){
	//	this.hexWidth = Math.floor(document.getElementById("sideLength").value) * cam.zoom;
		this.hexWidth = 25 * cam.zoom;
		
		for (var i = 0; i < this.hexes.length; i++){
			this.hexes[i].update();
		}
	}
	
	this.create();
	
};



Grid.prototype.getHexAtPos = function(click){

	var pos = new Point(
						click.x - cam.offSet.x,
						click.y - cam.offSet.y
					);
					
	var inRange = [];
	var closest = null;

	for (var hex in grid.hexes) {
		var item = grid.hexes[hex];		
		var center = item.center;
		
		if (center.x + item.size > pos.x && center.x - item.size < pos.x) {
			if (center.y + item.size > pos.y && center.y - item.size < pos.y) {
				inRange.push(item);
			}
		}
	}	

	if (inRange.length > 1) {
		var pick = null;
		var dist = null;

		for (var i = 0; i < inRange.length; i++) {
			var vector = {
				x: inRange[i].center.x - pos.x,
				y: inRange[i].center.y - pos.y
			};

			if (vector.x < 0) {
				vector.x *= -1;
			}
			if (vector.y < 0) {
				vector.y *= -1;
			}
			
			if (pick == null || vector.x + vector.y < dist) {
				pick = inRange[i];
				dist = vector.x + vector.y;				
			}
		}

		closest = pick;
	}
	else {
		closest = inRange[0];
	}

	return closest;
};

/**
 * Returns a distance between two hexes
 * @this {Grid}
 * @return {number}
 */
Grid.prototype.getHexDistance = function(/*Hexagon*/ h1, /*Hexagon*/ h2){
	//a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltaX = h1.id[0] - h2.id[0];
	var deltaY = h1.id[1] - h2.id[1];
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {Grid}
 * @return {Hexagon}
 */
Grid.prototype.getHexById = function(id){
	
	for (var i = 0; i < this.hexes.length; i++){
		if (this.hexes[i].id[0] == id[0] && this.hexes[i].id[1] == id[1]){
			return this.hexes[i];
		}
	}
	return null;
};

Grid.prototype.getHexByColAndRow = function(col, row){
	for(var i in this.hexes){
		if(this.hexes[i].id[0] == col && this.hexes[i].id[1] == row){
			return this.hexes[i];
		}
	}
	return null;
};

/**
* Returns the nearest hex to a given point
* Provided by: Ian (Disqus user: boingy)
* @this {Grid}
* @param {Point} p the test point 
* @return {Hexagon}
*/
Grid.prototype.GetNearestHex = function(/*Point*/ p) {

	var distance;
	var minDistance = Number.MAX_VALUE;
	var hx = null;

	// iterate through each hex in the grid
	for (var h in this.hexes) {
		distance = this.hexes[h].distanceFromcenter(p);

		if (distance < minDistance) // if this is the nearest thus far
		{
			minDistance = distance;
			hx = this.hexes[h];
		}
	}

	return hx;
};