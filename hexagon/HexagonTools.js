
Point = function(x, y) {
	this.x = x;
	this.y = y;
};

Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.Width = width;
	this.Height = height;
};

Line = function(x1, y1, x2, y2) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
};

Vector = function (start, end){
	this.x = end.x - start.x;
	this.y = end.y - start.y;
};

Hexagon = function(x, y, size){
	this.x = x;
	this.y = y;
	this.size = size;
	this.points;
	this.id = [x, y];
	this.highlight = false;
	
	this.hasJumpgate = false;	
	this.selected = false;
	this.validForMove = false;
	this.contains = [];
	this.specials = [];
	this.markers = [];
	
	this.visible = 0;
	
	this.create = function(){
		this.points = [];
	
		var offSetX = (this.size / 2 * this.x) * -1
		var offSetY = 0;

		if (this.x % 2 == 1) {
			offSetY += Math.sqrt(3) / 2 * this.size;
		}

		var center = new Point(
			this.x * this.size * 2 + offSetX + cam.offSet.x,
			this.y * Math.sqrt(3) / 2 * this.size * 2 + offSetY + cam.offSet.y
		)

		this.center = center;

		for (var i = 0; i < 6; i++) {
			var degree = 60 * i;
			var radian = Math.PI / 180 * degree;

			var point = new Point(
				center.x + this.size * Math.cos(radian),
				center.y + this.size * Math.sin(radian)
			)

			this.points.push(point);
		}
		
		if (selectedHex){
			if ( isEqual(selectedHex.id, this.id) ){
				this.selected = true;
			}
		}
	}
	
	this.update = function(){
		this.size = grid.hexWidth;
		this.create()
	}
	
	this.create();
	
};

Hexagon.prototype.createHoverDiv = function(pos){
	var div = document.createElement("div");
		div.className = "hoverDiv disabled";

		for (var i = 0; i < this.markers.length; i++){
			div.innerHTML += "<span>" + this.markers[i].notes + "</span></br>";
		}

	document.body.appendChild(div);

	this.hover = div;
}

Hexagon.prototype.showHoverDiv = function(pos){
	this.hover.style.marginLeft = this.center.x + 30 + cam.offSet.x + "px";
	this.hover.style.marginTop = this.center.y + 30 + cam.offSet.y + "px";
	this.hover.className = "hoverDiv";

	activeHover = this.id;
}



Hexagon.prototype.hideHoverDiv = function(){
	this.hover.className = "hoverDiv disabled";
	activeHover = false;
}

Hexagon.prototype.setVisibility = function(){	

	var sight = 0;
	/*
	0: keine Sicht
	1: nur Hex
	2: Elint (Umkreis 1 + Details);
	*/
	
	for (var i = 0; i < this.contains.length; i++){
		if (this.contains[i].owner == userid){
			if (this.contains[i] instanceof Fleet){
				if (this.contains[i].hasElint()){
					sight = 2;
					break;
				}
				else {
					sight = 1;
				}
			}
			else if (this.contains[i] instanceof Planet){		
					sight = 1;
			}
			else if (this.contains[i] instanceof Jumpgate){
					sight = 1;
			}
		}
	}



	if (sight){
		if (this.visible < sight){
			this.visible = sight;

			var adjacent = this.getAdjacent();

			if (sight > 1){
				for (var j = 0; j < adjacent.length; j++){
					if (! adjacent[j].visible){
						adjacent[j].visible = sight;
					}
				}
			}
		}
	}
}

Hexagon.prototype.draw = function(ctx){


	if (this.selected){
		ctx.strokeStyle = "red";
		ctx.lineWidth = 1;
	} 
	else {
		ctx.strokeStyle = "white";
	}
	
	ctx.lineWidth = 1;
	
	ctx.beginPath();
	ctx.moveTo(
			this.points[0].x + cam.offSet.x,
			this.points[0].y + cam.offSet.y
			);
	
	for(var i = 1; i < this.points.length; i++){	
		var p = this.points[i];
		
		ctx.lineTo(p.x + cam.offSet.x, p.y + cam.offSet.y);
	}
	ctx.closePath();
	

	if (this.validForMove == true){
		ctx.fillStyle = "red";
		ctx.fill();
	}
	else if (this.highlight == true){
		ctx.fillStyle = "red";
		ctx.fill();
	}
	else if (! this.visible){
		ctx.fillStyle = "black";
		ctx.fill();
	}
	else if (this.selected == 1){
		ctx.fillStyle = "grey";
		ctx.fill();
	}
	else {
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = "black";
		ctx.fill();
	}
	
	ctx.globalCompositeOperation = "source-over";
	ctx.stroke();
			
};


Hexagon.prototype.checkHighlight = function(){

	if (this.highlight){
		this.highlight = false;
	}
	else {
		this.highlight = true;		
	}
	this.draw(hexCtx);
}

Hexagon.prototype.checkLaneHighlight = function(laneid, ctx){

	for (var i = 0; i < this.contains.length; i++){
		if (this.contains[i] instanceof Jumpgate) {
			if (this.contains[i].lane.id == laneid) {
				if (! this.contains[i].lane.highlight) {
					this.contains[i].lane.highlight = true;
				//	ctx.clearRect(0, 0, width, height) 
					ctx.beginPath();
					ctx.moveTo(
							this.center.x + cam.offSet.x,
							this.center.y + cam.offSet.y
							);
							
						//	console.log( (this.center.x + cam.offSet.x) + " / " + (this.center.y + cam.offSet.y) );
							
					
					for (var j = 1; j < this.contains[i].lane.path.length; j++){
						var hex = grid.getHexById(this.contains[i].lane.path[j]);
				//		console.log(hex.id);
						
							ctx.lineTo(
								hex.center.x + cam.offSet.x,
								hex.center.y + cam.offSet.y
							);
							
						//	console.log( (hex.center.x + cam.offSet.x) + " / " + (hex.center.y + cam.offSet.y) );

					}
					
					ctx.lineWidth = 5 * cam.zoom;
					ctx.strokeStyle = "darkcyan";
					ctx.stroke();
				}
				else {
					this.contains[i].lane.highlight = false;
					ctx.clearRect(0, 0, width, height) 
				}
			}
		}
	}
}
				
Hexagon.prototype.drawContent = function(ctx){

	this.drawID(ctx);

	if (! this.visible){
		return false;
	}

	var planet = false;
	var friendFleets = 0;
	var hostileFleets = 0;
	var specials = false

	for (var i = 0; i < this.contains.length; i++){
		if (this.contains[i] instanceof Planet){
			planet = this.contains[i];
		}
		else if (this.contains[i] instanceof Fleet){
			if (this.contains[i].owner == userid){
				friendFleets++;
			}
			else {
				hostileFleets++;
			}
		}
	}

	ctx.strokeStyle = "black";



	if (this.specials.length > 0 && this.specials[0].icon != undefined){
		var size = this.size;
		var iconSize = this.specials[0].icon.width;
		var newSize = iconSize / 3  * cam.zoom;
		ctx.drawImage(
					this.specials[0].icon,
					this.center.x + cam.offSet.x - newSize/2,
					this.center.y + cam.offSet.y - newSize/2,
					newSize,
					newSize
					);
	}

	if (planet){
		var size = this.size;
		var newSize = 100 / 6 * cam.zoom;

		ctx.drawImage(
					planet.icon,
					this.center.x + cam.offSet.x - newSize/1.75,
					this.center.y + cam.offSet.y + newSize/8,
					newSize,
					newSize
					);
	}
	
	if (this.hasJumpgate){
		var size = this.size;
		var iconSize = jumpgate_icon.width;
		var newSize = iconSize / 3 * cam.zoom;
		
		ctx.drawImage(
					jumpgate_icon,
					this.center.x + cam.offSet.x - newSize/2 - size/1.75,
					this.center.y + cam.offSet.y - newSize/2,
					newSize,
					newSize
					);
	
	}
	
	
	if (friendFleets > 0){
		ctx.beginPath();
		
		ctx.arc(
				this.center.x + cam.offSet.x + this.size/2,
				this.center.y + cam.offSet.y - this.size/6,
				5.5 * cam.zoom,
				0,
				2*Math.PI
				);
				
		ctx.fillStyle = "green";
		ctx.fill();		
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = "bolder " + 6 * cam.zoom + "pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
					friendFleets,
					this.center.x + cam.offSet.x + this.size/2,
					this.center.y + cam.offSet.y - this.size/6
					)
		ctx.closePath();
	}
	
	if (hostileFleets > 0){
		ctx.beginPath();
		
		ctx.arc(
				this.center.x + cam.offSet.x + this.size/2,
				this.center.y + cam.offSet.y + this.size/3,
				5.5 * cam.zoom,
				0,
				2*Math.PI
				);
				
		ctx.fillStyle = "red";
		ctx.fill();		
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = "bolder " + 6 * cam.zoom + "pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
					hostileFleets,
					this.center.x + cam.offSet.x + this.size/2,
					this.center.y + cam.offSet.y + this.size/3
					)
		ctx.closePath();
	}

}

Hexagon.prototype.drawID = function(ctx){	ctx.beginPath();
	ctx.font = "bolder " + 7*cam.zoom +"pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = 'middle';
	
	var text = "";
	
	if (this.id[0] < 10){
		text += 0
		text += this.id[0];
	}
	else {
		text += this.id[0];
	}
	
		text+= ", ";
	
	if (this.id[1] < 10){
		text += 0
		text += this.id[1];
	}
	else {
		text += this.id[1];
	}
	
	if (this.markers.length){
		ctx.fillStyle = "red";
	}
	else {
		ctx.fillStyle = "white";
	}
	
	ctx.fillText(
				text,
				this.center.x + cam.offSet.x,
				this.center.y + cam.offSet.y -(this.size / 1.8)
				);	
	ctx.closePath();
}

Hexagon.prototype.drawLanes = function(ctx){

	//if (! this.visible){ return; }
	
	ctx.clearRect(0, 0, width, height);
		
	if (this.hasJumpgate){

		for (var i = 0; i < this.contains.length; i++){
			if (this.contains[i] instanceof Jumpgate){
				ctx.beginPath();
				ctx.moveTo(
						this.center.x + cam.offSet.x,
						this.center.y + cam.offSet.y
						);
						
					//	console.log( (this.center.x + cam.offSet.x) + " / " + (this.center.y + cam.offSet.y) );
						
				
				for (var j = 1; j < this.contains[i].lane.path.length; j++){
					var hex = grid.getHexById(this.contains[i].lane.path[j]);
			//		console.log(hex.id);
					
						ctx.lineTo(
							hex.center.x + cam.offSet.x,
							hex.center.y + cam.offSet.y
						);
						
					//	console.log( (hex.center.x + cam.offSet.x) + " / " + (hex.center.y + cam.offSet.y) );

				}
				
				ctx.lineWidth = 5 * cam.zoom;
				ctx.strokeStyle = "darkcyan";
				ctx.stroke();
			}
		}
	}
}

Hexagon.prototype.getContent = function(id){
	for (var i = 0; i < this.contains.length; i++){
		if (this.contains[i].id == id){
			return this.contains[i];
		}
	}
}

Hexagon.prototype.getLaneById = function(laneid){
	for (var i = 0; i < this.contains.length; i++){
		if (this.contains[i] instanceof Jumpgate) {
			if (this.contains[i].lane.id == laneid) {
				return this.contains[i];
			}
		}
	}
}

Hexagon.prototype.getFleetById = function(id){
	for (var i = 0; i < this.contains.length; i++){
		if (this.contains[i].id == id && this.contains[i] instanceof Fleet){
			return this.contains[i];
		}
	}
}

Hexagon.prototype.getAdjacent = function(){

	var valid;
	var result = [];
	var x = this.id[0];
	var y = this.id[1];
	
	if (x % 2 != 0){
		valid = [
			[x, y - 1],
			[x + 1, y],
			[x + 1, y + 1],
			[x, y + 1],
			[x - 1, y + 1],			
			[x - 1, y],
		];
	}
	else {
		valid = [
			[x, y - 1],
			[x + 1, y - 1],
			[x + 1, y],
			[x, y + 1],
			[x - 1, y],
			[x - 1, y - 1],
		];
	}	
	
	for (var i = 0; i < valid.length; i++){
		for (var j = 0; j < grid.hexes.length; j++){
		
			if (valid[i][0] == grid.hexes[j].id[0]){
				if (valid[i][1] == grid.hexes[j].id[1]){
					result.push(grid.hexes[j]);
					break;
				}
			}
		}
	}
	
	return result;
}
/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {Hexagon}
 * @return {boolean}
 */
Hexagon.prototype.isInBounds = function(x, y) {
	return this.Contains(new Point(x, y));
};
	

/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {Hexagon}
 * @param {Point} p the test point
 * @return {boolean}
 */
Hexagon.prototype.isInHexBounds = function(/*Point*/ p) {
	if(this.points[4].x < p.x && this.points[4].y < p.y &&
	   p.x < this.points[1].x && p.y < this.points[1].y)
		return true;
	return false;
};

//grabbed from:
//http://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
//and
//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
/**
 * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
 * @this {Hexagon}
 * @param {Point} p the test point
 * @return {boolean}
 */
Hexagon.prototype.Contains = function(p) {
	
	var isIn = false;
	if (this.isInHexBounds(p))
	{
		//turn our absolute point into a relative point for comparing with the polygon's points
		//var pRel = new Point(p.x - this.x, p.y - this.y);
		var i, j = 0;
		for (i = 0, j = this.points.length - 1; i < this.points.length; j = i++)
		{
			var iP = this.points[i];
			var jP = this.points[j];
			if (
				(
				 ((iP.y <= p.y) && (p.y < jP.y)) ||
				 ((jP.y <= p.y) && (p.y < iP.y))
				//((iP.y > p.y) != (jP.y > p.y))
				) &&
				(p.x < (jP.x - iP.x) * (p.y - iP.y) / (jP.y - iP.y) + iP.x)
			   )
			{
				isIn = !isIn;
			}
		}
	}
	return isIn;
};

/**
* Returns absolute distance in pixels from the mid point of this hex to the given point
* Provided by: Ian (Disqus user: boingy)
* @this {Hexagon}
* @param {Point} p the test point
* @return {number} the distance in pixels
*/
Hexagon.prototype.distanceFromcenter = function(/*Point*/ p) {
	// Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
	var deltax = this.center.x - p.x;
	var deltay = this.center.y - p.y;

	// squaring so don't need to worry about square-rooting a negative number 
	return Math.sqrt( (deltax * deltax) + (deltay * deltay) );
};
