function MovementManager(){

	this.activeFleet;
	this.chosenMoves = [];
	this.currentHex;
	this.adjacent = [];
	this.orders = [];
	this.origin;
	this.onLane = false;
	this.requiredHMP = [];
	this.possibleLanes = [];
	this.steps = 0;
	
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
		this.steps = 0;
		this.currentHex = selectedHex;
		this.adjacent = this.currentHex.getAdjacent();
		this.chosenMoves = [];
		this.possibleLanes = [];
		this.onLane = false;
		this.requiredHMP = [];
		this.origin = selectedHex;
		this.checkForOrderUndraw();
		
		this.setAdjacent();
		
	}
		
	this.checkForValidMove = function(hex){
		console.log("checkForValidMove");
		if (hex.validForMove){
			if (this.currentHex.hasJumpgate){
				this.getPossibleLanes(hex);

				if (this.possibleLanes.length){

					var onLane = false;

					for (var i = 0; i < this.possibleLanes.length; i++){
						if (isEqual(this.possibleLanes[i].path[1], hex.id)){
							this.onLane = true;
							onLane = true;
							this.steps = 0;
							console.log("jumping onto lane");
						}
					}

					if (! onLane){
						this.onLane = false;
					}
				}
				else {
					this.onLane = false;
					console.log("move off lane");
				}


				this.pickMovement(hex);
			}
			else if (this.possibleLanes.length){
				console.log("else if")

				var newValidLanes = [];

				for (var i = 0; i < this.possibleLanes.length; i++){
					if (isEqual(this.possibleLanes[i].path[this.steps+1], hex.id)){
						console.log("on lane true");
						this.onLane = true;
						newValidLanes.push(this.possibleLanes[i]);
					}
				}

				this.possibleLanes = newValidLanes
					console.log(this.possibleLanes);

				if (! this.possibleLanes.length){
					console.log("empty up");
					this.onLane = false;
					this.possibleLanes = [];
				}

				this.pickMovement(hex);
			}
			else {
				//console.log("else")
				this.onLane = false;;
				this.pickMovement(hex);
			}
		}
	}
	
	
	this.getPossibleLanes = function(hex){
		console.log("getPossibleLanes");

		for (var i = 0; i < this.currentHex.contains.length; i++){
			if (this.currentHex.contains[i] instanceof Jumpgate){
				if (isEqual(hex.id, this.currentHex.contains[i].lane.path[1])){
					this.possibleLanes.push(this.currentHex.contains[i].lane);
				}
			}
		}
	}
	
	this.pickMovement = function(hex, type){
		console.log("pickMovement");

		this.steps++;

		if (this.onLane){
		console.log("moving on Lane");
			this.requiredHMP.push(1);
		}
		else {
		console.log("moving off Lane");
			this.requiredHMP.push(3);
		}
		
		this.drawSingleMovement(hex);
		this.chosenMoves.push(hex);		
		this.currentHex = hex;		
		this.continuePathing();
	}
	
	this.continuePathing = function(){
		console.log("continuePathing");
		this.unsetAdjacent();
		this.adjacent = this.currentHex.getAdjacent();
		this.setAdjacent();
	}

	this.checkMovementType = function(hex){
		console.log("checkMovementType");
		if (this.origin.hasJumpgate){
			if (this.travelsAlongJumpLane(hex)){
				return "lane";
			}
		}
	
		return "normal";
	}
	
	this.travelsAlongJumpLane = function(hex){
		console.log("ding");
		var steps = this.chosenMoves.length;
		
		for (var i = 0; i < this.origin.lanes.length-1; i++){
			if (this.origin.lanes[i].path[steps+1][0] != hex.id[0] || this.origin.lanes[i].path[steps+1][1] != hex.id[1]){
				console.log("on lane");
				return false
			}
			else console.log("off lane");
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

	//	console.log(order);
		this.orders.push(order);

		ajax.issueFleetMovement(order);


		this.activeFleet = false;
		selectedFleet = null;
		
	//	console.log(selectedHex);
		selectedHex.drawLanes(jumpCtx);
		updateGUI(selectedHex);
	}
	
}
