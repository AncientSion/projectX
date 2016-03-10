function Cam(){
	
	this.focus = null;
	this.offSet = {x: 0, y: 0};
	this.zoom = 1;
	this.scale = 1;
	
	this.initialSetup = function(){
	
		var mid = Math.floor(count/2);
		
		this.focus = grid.getHexById([mid, mid]);		
		this.offSet.x += hexCanvas.width / 2;
		this.offSet.y += hexCanvas.height / 2;
	//	this.doScroll(this.focus);
		this.doScroll(grid.getHexById([16, 9]));
	}
	
		
	this.undoScroll = function(){
		this.offSet.x += this.focus.center.x;
		this.offSet.y += this.focus.center.y
	}
		
	
	this.doScroll = function(newHex){
		this.focus = newHex;		
		this.offSet.x -= this.focus.center.x;
		this.offSet.y -= this.focus.center.y
	}
	
	this.adjustZoom = function(e){
		e = e.originalEvent;
		
		var zoom = this.zoom*1;
		
		if (e.wheelDelta == -120){
		//	console.log("-");
			if (zoom > 1){
				zoom = zoom - 0.5;
			}
			else if (zoom > 0.25){
				zoom = zoom - 0.25;
			}
		}
		else {
		//	console.log("+");
			if (zoom < 1){
				zoom = zoom + 0.25;
			}
			else if (zoom < 2){
				zoom = zoom + 0.5;
			}	
		}
	//	document.getElementById("zoom").value = zoom;
		
		this.zoom = zoom;
	}
}