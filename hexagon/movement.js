function MovementManager(){

	this.activeFleet;
	this.chosenMoves = [];
	this.currentHex;
	this.adjacent = [];
	this.orders = [];
	this.origin;
	this.currentLane = false;
	this.onLane = false;
	this.currentNode;
	this.requiredHMP = [];
	
	this.setAdjacent = function(){
		for (var i = 0; i < this.adjacent.length; i++){
			this.adjacent[i].validForMove = true;
			this.adjacent[i].draw(hexCtx);
		}
	}
	
	this.unsetAdjacent = function(){
		for (var i = 0; i < this.adjacent.length; i++){
			this.adjacent[i].validForMove = false;
			this.adjacent[i].draw(hexCtx);
		}
		
		this.adjacent = [];
	}
	
	this.initiateMovement = function(){
		this.activeFleet = selectedFleet;
		this.currentHex = selectedHex;
		this.adjacent = this.currentHex.getAdjacent();
		this.chosenMoves = [];
		this.currentLane = false;
		this.onLane = false;
		this.requiredHMP = [];
		this.origin = selectedHex;
		this.checkForOrderUndraw();
		
		this.setAdjacent();
		
	}
	
	this.pickMovement = function(hex, type){
		if (this.onLane){
			this.requiredHMP.push(1);
		}
		else {
			this.requiredHMP.push(3);
		}
		
		this.drawSingleMovement(hex);
		this.chosenMoves.push(hex);
		console.log(this.chosenMoves);
		
		this.currentHex = hex;
		
		this.continuePathing();
	}
	
	this.continuePathing = function(){
		this.unsetAdjacent();
		this.adjacent = this.currentHex.getAdjacent();
		this.setAdjacent();
	}
	
	this.checkForValidMove = function(hex){
		if (hex.validForMove){
			if (this.currentHex.hasJumpgate){
				this.currentNode = this.currentHex;
				this.currentLane = this.getLane(hex);
				if (this.currentLane){
					this.onLane = true;
				//	console.log("jump onlane");
					this.pickMovement(hex);
				}
				else {
					this.onLane = false;
				//	console.log("jump no lane");
					this.pickMovement(hex);
				}
			}
			else if (this.onLane){
				for (var i = 0; i < this.currentLane.path.length; i++){
					if (isEqual(this.currentHex.id, this.currentLane.path[i])){
						var index = i;
					}
				}
				
				if (isEqual(this.currentLane.path[index+1], hex.id)){
				//	console.log("onlane");
					this.pickMovement(hex);
				}
				else {
				//	console.log("leftlane");
					this.onLane = false;
					this.currentLanse = false;
					this.pickMovement(hex);
				}
			}
			else {
				//	console.log("free space");
				this.pickMovement(hex);
			}
		}
	}
	
	
	this.getLane = function(hex){
		for (var i = 0; i < this.currentNode.lanes.length; i++){
			if (isEqual(hex.id, this.currentNode.lanes[i].path[1])){
				return this.currentNode.lanes[i];
			}
		}
		return false;
	}
	
	
	this.checkMovementType = function(hex){
		if (this.origin.hasJumpgate){
			if (this.travelsAlongJumpLane(hex)){
				return "lane";
			}
		}
	
		return "normal";
	}
	
	this.travelsAlongJumpLane = function(hex){
		var steps = this.chosenMoves.length;
		
		for (var i = 0; i < this.origin.lanes.length-1; i++){
			if (this.origin.lanes[i].path[steps+1][0] != hex.id[0] || this.origin.lanes[i].path[steps+1][1] != hex.id[1]){
				console.log("on lane");
				return false
			}
			else console.log("on lane");
		}
			return true;
	}
	
	this.checkForOrderUndraw = function(){
		var redraw = false;
		
		for (var i = 0; i < this.orders.length; i++){
			if (this.orders[i].fleetId == this.activeFleet.id){
				this.orders.splice(i, 1);
				redraw = true;
			}
		}
		if (redraw){
			moveCtx.clearRect(0, 0, width, height);
			
			for (var i = 0; i < this.orders.length; i++){
				var startId = [this.orders[i].origin[0], this.orders[i].origin[1]];
				var start = grid.getHexById(startId);
				
				moveCtx.beginPath();
				moveCtx.moveTo(
							start.center.x + cam.offSet.x,
							start.center.y + cam.offSet.y
							);
								
				for (var j = 1; j < this.orders[i].moves.length; j++){
					var hex = grid.getHexById(this.orders[i].moves[j]);
					
					moveCtx.lineTo(
								hex.center.x + cam.offSet.x,
								hex.center.y + cam.offSet.y
								);
				}
				
				moveCtx.strokeStyle = "lightGreen";
				moveCtx.lineWidth = 2 * cam.zoom;
				moveCtx.stroke();
			}
		}
	}
	
	this.drawSingleMovement = function(target){
//	console.log("drawSingleMovement");
		var origin = this.currentHex;
		moveCtx.strokeStyle = "lightGreen";
		moveCtx.lineWidth = 2 * cam.zoom;
		
		moveCtx.beginPath();
		moveCtx.moveTo(
						origin.center.x + cam.offSet.x,
						origin.center.y + cam.offSet.y
						);
		moveCtx.lineTo( 
						target.center.x + cam.offSet.x,
						target.center.y + cam.offSet.y
						);
		
		moveCtx.closePath();
		moveCtx.stroke();
	}
	
	this.drawCurrentOrders = function(ctx){
//	console.log("drawCurrentOrders");
		for (var i = 0; i < this.orders.length; i++){
			var origin = grid.getHexById([this.orders[i].origin[0], this.orders[i].origin[1]]);
			
			moveCtx.strokeStyle = "lightGreen";
			moveCtx.lineWidth = 2 * cam.zoom;
			
			moveCtx.beginPath();
			moveCtx.moveTo(
							origin.center.x + cam.offSet.x,
							origin.center.y + cam.offSet.y
							);
			
			for (var j = 0; j < this.orders[i].moves.length; j++){
				var goal = grid.getHexById([this.orders[i].moves[j][0], this.orders[i].moves[j][1]]);
				
				moveCtx.lineTo(
								goal.center.x + cam.offSet.x,
								goal.center.y + cam.offSet.y
								);
			}
			
			moveCtx.stroke();	
		}
	}

		
	this.confirmCurrentMovementPlan = function(){
		this.unsetAdjacent();
		
		if (this.chosenMoves.length > 0){
			var order = new MovementOrder(this.activeFleet.id, this.chosenMoves, this.origin.id, this.requiredHMP, currentTurn);
			this.activeFleet.currentOrder = order;
		}
		else {
			var order = {
				fleetId: this.activeFleet.id,
				moves: [selectedHex.id],
				origin: selectedHex.id,
				cancel: true,
				turn: currentTurn
			}
		}

		console.log(order);
		this.orders.push(order);
		this.activeFleet = false;
		selectedFleet = null;
		
	//	console.log(selectedHex);
		selectedHex.drawLanes(jumpCtx);
		updateGUI(selectedHex);
	}
	
}
