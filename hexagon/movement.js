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
			console.log(this.adjacent[i].id);
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
				console.log("this.currentHex.hasJumpgate")
				this.getPossibleLanes(hex);

				if (this.possibleLanes.length){

					var onLane = false;

					for (var i = 0; i < this.possibleLanes.length; i++){
					
						if (this.possibleLanes[i] instanceof Lane){
							if (isEqual(this.possibleLanes[i].path[1], hex.id)){
								this.onLane = true;
								onLane = true;

								selectedFleet.validLanes.push(
																{
																	laneid: this.possibleLanes[i].id,
																	loc: this.possibleLanes[i].path[0]
																} 
															);
								
								this.steps = 0;
								console.log("jumping onto lane");
							}
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
			}
			else if (this.activeFleet.validLanes.length){
				console.log("this.activeFleet.validLanes.length")

				var legal = [];


				for (var i = 0; i < this.activeFleet.validLanes.length; i++){
					var laneid = this.activeFleet.validLanes[i].laneid;
				//	var laneOriginHex = grid.getLaneOriginInRadiusByLaneId(this.currentHex, laneid);
					var laneOriginHex = grid.getHexByIndex(this.activeFleet.validLanes[i].loc);
					var lane = laneOriginHex.getLaneById(laneid).lane;

					var index;

					for (var j = 0; j < lane.path.length-1; j++){
						if (isEqual(lane.path[j], this.currentHex.id)){
							index = j;
							break;
						}
					}

					if (index){
						if (index >= 1 && index < lane.path.length){
							if (
								isEqual(lane.path[index-1], hex.id)
								||
								isEqual(lane.path[index+1], hex.id)
								)
								{							
									legal.push(this.activeFleet.validLanes[i]);
								}
						}
					}
				}

				if (legal.length){
					this.possibleLanes = legal;
					selectedFleet.validLanes = legal;
					this.onLane = true;
				}
				else {
					this.onLane = false;
				}
			}
			else {
				console.log("else")
				this.onLane = false;
			}

			this.pickMovement(hex);
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
		//console.log("pickMovement");
		
		this.steps++;

		if (this.onLane){
			//console.log("moving on Lane");
			this.requiredHMP.push(1);
		}
		else if (this.activeFleet.hasJumpEngine()){
			//console.log("moving off Lane /w JE");
			this.requiredHMP.push(3);
		}
		else {
			//console.log("moving off Lane /wo JE")
			this.requiredHMP.push(24);
		}
		
		console.log(this.adjacent);
		this.chosenMoves.push(hex);	
		this.drawSingleMovement(hex);

		this.unsetAdjacent();
		this.currentHex = hex;
		console.log(this.adjacent);

		this.adjacent = this.currentHex.getAdjacent();
		this.setAdjacent();
		console.log(this.adjacent);
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

	
	this.checkForOrderUndraw = function(){
		var redraw = false;
		
		for (var i = 0; i < this.orders.length; i++){
			if (this.orders[i].fleetid == this.activeFleet.id){
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
				
				moveCtx.strokeStyle = "red";
				moveCtx.lineWidth = 2 * cam.zoom;
				moveCtx.stroke();
			}
		}
	}
	
	this.drawSingleMovement = function(target){
//	console.log("drawSingleMovement");
		var origin = this.currentHex;
		moveCtx.strokeStyle = "red";
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
//	console.log(this.orders);
//	console.log("drawCurrentOrders");
		for (var i = 0; i < this.orders.length; i++){
			var origin = grid.getHexById([this.orders[i].origin[0], this.orders[i].origin[1]]);
			
			moveCtx.strokeStyle = "red";
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
		
		if (! this.onLane){
			this.possibleLanes = [];
		}
		
		
		if (this.chosenMoves.length > 0){
			var order = new MovementOrder(this.activeFleet.id, this.chosenMoves, this.origin.id, this.requiredHMP, this.possibleLanes, currentTurn);
			this.activeFleet.currentOrder = order;
		}
		else {
			var order = {
				fleetid: this.activeFleet.id,
				moves: [selectedHex.id],
				origin: selectedHex.id,
				cancel: true,
				turn: currentTurn,
				validLanes: this.possibleLanes
			}
		}

	//	console.log(order);
		this.orders.push(order);

		ajax.issueFleetMovement(order);


		this.activeFleet = false;
		selectedFleet = null;		
		selectedHex.drawLanes(jumpCtx);
		updateGUI(selectedHex);
	}
	
}
