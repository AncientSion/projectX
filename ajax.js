window.ajax = {

	joinGame: function(gameid, callback){
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {
					type: "join",
					gameid: gameid
					},
			success: callback,		
			error: ajax.error,
		});
	},

	leaveGame: function(gameid, callback){
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {
					type: "leave",
					gameid: gameid
					},
			success: callback,
			error: ajax.error,
		});
	},

	startGame: function(gameid, callback){
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {
					type: "start",
					gameid: gameid
					},
			success: callback,
			error: ajax.error,
		});
	},

	createGame: function(name, callback){
		$.ajax({
			type: "POST",
			url: "createGame.php",
			datatype: "json",
			data: {data: name},
			success: callback,
			error: ajax.error,
		});
	},
	
	getGames: function(){
			
		$.ajax({
			type: "GET",
			url: "getGames.php",
			datatype: "json",
			data: {id: 3},
			success: ajax.getGamesSuccess,			
			error: ajax.error,
		});			
	},
	
	createGameSuccess: function(){
		console.log("createGameSuccess");
	},
	
	getGamesSuccess: function(){
		console.log("getGamesSuccess");
	},
	
	success: function(){
		console.log("success");
	},
	
	error: function(data){
		console.log("error");
	},
	
	echoReturn: function (data){
		if (data){
			console.log(data);
		}
		else {
			console.log("no data");
		}
	},
	
	getGameData: function(userid, gameid){
		ajax.getGameStatus(userid, gameid);
		ajax.getSectors();
		ajax.getPlanets();
	},

	getGameStatus: function(userid, gameid){		
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				userid: userid,
				gameid: gameid,
				currentTurn: currentTurn,
				type: "status"
				},		
			error: ajax.error,
			success: function(ret){
				if (ret){
					ret = JSON.parse(ret);
					console.log(ret);

					if (ret.status == "ready"){
						gamedata.canCommit = false;

						var div = document.createElement("div");
							div.className = "popup";
							div.addEventListener("click", function(){
								this.parentNode.removeChild(this);
							})

						var span = document.createElement("span");
							span.innerHTML = "You have already commited your turn.</br></br>";
							div.appendChild(span);

						var span = document.createElement("span");
							span.innerHTML = "You can look at the gamedata, but cant commit anew.";
							div.appendChild(span);

							document.body.appendChild(div);
					}
				}
			}
		});
	},
	
	postSectors: function(sectors){
	
		sectors = JSON.stringify(sectors);
		console.log(sectors);
	
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {sectors: sectors},	
			error: ajax.error,
			success: ajax.success,
		});
	},

	getSectors: function(){
	
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				userid: userid,
				gameid: gameid,
				type: "sectors"
				},		
			error: ajax.error,
			success: ajax.parseSectors,
		});
	},

	parseSectors: function(list){
		list = JSON.parse(list);

		if (list){		
			for (var i = 0; i < list.length; i++){
				var data = list[i];
				var icon;
				
				for (var j = 0; j < grid.hexes.length; j++){
					if (data.x == grid.hexes[j].x && data.y == grid.hexes[j].y){
						grid.hexes[j].specials.push(list[i]);

						if (data.type == "Black Hole"){
							icon = special_icons[0];
						}
						else if (data.type == "Nebula"){
							icon = special_icons[1];
						}
						else if (data.type == "Supernova"){
							icon = special_icons[2];
						}
						else if (data.type == "Radiation Cloud"){
							icon = special_icons[3];
						}
						else if (data.type == "Vortex"){
							icon = special_icons[4];
						}
						else if (data.type == "Hyperspace Waveforms"){
							icon = special_icons[5];
						}

						grid.hexes[j].specials[grid.hexes[j].specials.length-1].icon = icon;
						break;

					}
				}
			}
		}
	},
	
	postPlanets: function(planets){
	
		planets = JSON.stringify(planets);
	//	console.log(planets);
	
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {planets: planets},	
			error: ajax.error,
			success: ajax.success,
		});
	},
	
	getPlanets: function(){
	
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				userid: userid,
				gameid: gameid,
				type: "planets"
				},		
			error: ajax.error,
			success: ajax.parsePlanets,
		});
	},
	
	parsePlanets: function(list){
		list = JSON.parse(list);


		if (list){		
			for (var i = 0; i < list.length; i++){
				var data = list[i];
				
				for (var j = 0; j < grid.hexes.length; j++){
					if (data.x == grid.hexes[j].x && data.y == grid.hexes[j].y){

						var icon;
						
						var planet = new Planet(
												data.id,
												data.owner,
												data.name,
												[grid.hexes[j].x, grid.hexes[j].y],
												data.level,
												data.baseIncome,
												data.baseTrade,
												data.type,
												data.enviroment,
												data.notes_1,
												data.notes_2,
												data.notes_3
												);

					//	console.log(planet);
						grid.hexes[j].contains.push(planet);

						break;
					}
				}
			}
		}

		ajax.getGates()
	},


	postGates: function(gates){
		gates = JSON.stringify(gates);
	
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {gates: gates},	
			error: ajax.error,
			success: ajax.success,
		});
	},

	postLanes: function(lanes, gates){
		console.log("lanes");
		lanes = JSON.stringify(lanes);
	
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {lanes: lanes},	
			error: ajax.error,
			success: function(){
				ajax.postGates(gates);
			}
		});
	},

	getGates: function(){
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				userid: userid,
				gameid: gameid,
				type: "gates"
				},		
			error: ajax.error,
			success: ajax.parseGates,
		});
	},

	parseGates: function(list){
		list = JSON.parse(list);

	//	console.log(list);

		var gates = [];
		if (list){
			for (var i = 0; i < list.length; i++){
				var gate = new Jumpgate(
					list[i].id,
					list[i].owner,
					[list[i].x, list[i].y],
					0, 
					1
					)
				
				gates.push(gate);
			}
		}

	//	console.log(gates);

		for (var i = 0; i < gates.length; i++){
		//	console.log(gates[i].location);
			for (var j = 0; j < grid.hexes.length; j++){
				if (isEqual (gates[i].location, grid.hexes[j].id) ) {
				//	console.log(grid.hexes[j].id);
					grid.hexes[j].hasJumpgate = true;
					grid.hexes[j].contains.push(gates[i]);
					break;
				}
			}
		}



		ajax.getLanes();
	},

	getLanes: function(){	
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				userid: userid,
				gameid: gameid,
				type: "lanes"
				},		
			error: ajax.error,
			success: ajax.parseLanes,
		});
	},
	
	parseLanes: function(list){
		list = JSON.parse(list);


		if (list){			
			var lanes = [];
			
			for (var i = 0; i < list.length; i++){
				var data = list[i];
				
			//	console.log(data);
				
				var lane = new Lane();
				var location = [];
				
				for (var j in data){
					if (j == "id"){
						lane.id = data[j];
					}
					else if (j == "gameid"){
						continue;
					}
					else if (data[j] == null){
					//	console.log("break");			
						break;
					}
					else {
						if (location.length < 2){
							location.push(data[j]);
							
							if (location.length == 2){
								lane.path.push(location);
								location = [];
							}
						}
					}
				}
				
				lane.target = lane.path[lane.path.length-1];
				
				lanes.push(lane);
			}
			
			
			for (var i = 0; i < lanes.length; i++){
				for (var j = 0; j < grid.hexes.length; j++){
					if ( isEqual(lanes[i].path[0], grid.hexes[j].id) ){
							grid.hexes[j].lanes.push(lanes[i]);
					}
					else if ( isEqual(lanes[i].path[lanes[i].path.length-1], grid.hexes[j].id) ){
						var newLane = new Lane();
							newLane.id = lanes[i].id;
							newLane.target = lanes[i].path[0];
							
						for (var k = lanes[i].path.length-1; k >= 0; k--){
							newLane.path.push(lanes[i].path[k]);
						}

						grid.hexes[j].lanes.push(newLane);					
					}
				}
			}
		}

		ajax.getFleets()

	},

	postFleets: function(fleets){		
		fleets = JSON.stringify(fleets);
		//console.log(fleets);
	
		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {fleets: fleets},	
			error: ajax.error,
			success: ajax.echoReturn
		});
	},
	
	getFleets: function(){
		
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				type: "fleets"
				},		
			error: ajax.error,
			success: ajax.getShips
		});
	},
	
	getShips: function(fleets){

	//	console.log(fleets);
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				type: "ships"
				},		
			error: ajax.error,
//			success: function(ships){
//					ajax.createFleets(fleets, ships);
//			}
			success: function(ships){
					ajax.getMoves(fleets, ships);
			}
		});
	},

	getMoves: function(fleets, ships){
		$.ajax({
			type: "GET",
			url: "getGameData.php",
			datatype: "json",
			data: {
				type: "moves"
				},		
			error: ajax.error,
			success: function(moves){
					ajax.createFleets(fleets, ships, moves);
			}
		});

	},

	createFleets: function(fleetlist, shiplist, movelist){

		var fleets = [];
		var ships = [];
		var moves = [];

		// Create Fleets
		fleetlist = JSON.parse(fleetlist);
		if (fleetlist){
			for (var i = 0; i < fleetlist.length; i++){
				var data = fleetlist[i];
				
				var fleet = new Fleet();
					fleet.id = data.id;
					fleet.location = [data.x, data.y];
					fleet.name = data.name;

					fleets.push(fleet);
			}
		}

		// Create Ships
		shiplist = JSON.parse(shiplist);
		if (shiplist){
			for (var i in shiplist){
				var data = shiplist[i];

				var ship = new Ship(
						data.id,
						data.fleetid,
						data.size,
						data.model,
						data.name,
						data.elint,
						data.scanner,
						data.jumpdrive,
						data.notes
					);

					ships.push(ship);
			}
		}

		// put Ships into Fleets
		for (var i in fleets){
			for (var j in ships){
				if (fleets[i].id == ships[j].fleetid){
					fleets[i].ships.push(ships[j]);
				}
			}
		}


		// create MovementOrder out of movelist		
		movelist = JSON.parse(movelist);
		if (movelist){
			var orders = [];
			var movement = new MovementOrder();
				movement.fleetId = null;
				movement.moves = [];
				movement.hmp = [];
				movement.steps = [];

			for (var i = 0; i < movelist.length; i++){

				if (movement.fleetId == null){
					movement.fleetId = movelist[i].fleetid;
					movement.turn = movelist[i].turn;
				}
				else if (movement.fleetId != movelist[i].fleetid){
					orders.push(movement);

					movement = new MovementOrder();
					movement.fleetId = null;
					movement.moves = [];
					movement.hmp = [];
					movement.steps = [];
					movement.turn = movelist[i].turn;
				}

				movement.moves.push( [movelist[i].x, movelist[i].y] );
				movement.hmp.push(movelist[i].hmp);
				movement.steps.push(movelist[i].step);

				if (i == movelist.length-1){
					orders.push(movement);
				}
			}

			//	console.log(orders);

			// put moves into fleets
			for (var i = 0; i < fleets.length; i++){
				for (var j = 0; j < orders.length; j++){
					orders[j].getTotalHMP = function(){
												total = 0;
												for (var i = 0; i < this.hmp.length; i++){
													total += this.hmp[i];
												}
												return total;
											}
					if (fleets[i].id == orders[j].fleetId){
						orders[j].origin = fleets[i].location;
						fleets[i].currentOrder = orders[j];
					//	console.log(fleets[i]);
						break;
					}
				}
			}

			// put moves into moveManager
			moveManager.orders = orders;
		}
		
		// put Fleets into Hexes
		for (var i = 0; i < fleets.length; i++){
			for (var j = 0; j < grid.hexes.length; j++){
				if ( isEqual(fleets[i].location, grid.hexes[j].id) ){						
					grid.hexes[j].contains.push(fleets[i]);
				}
			}
		}

		cam.initialSetup();
		drawHexGrid();

	},


	commitMoves: function(moves){

		newMoves = [];

		for (var i = 0; i < moves.length; i++){
			if (moves[i].turn == currentTurn){
				newMoves.push(moves[i]);
			}
		}

		if (newMoves){	
			newMoves = JSON.stringify(newMoves);
			console.log(moves);
		
			$.ajax({
				type: "POST",
				url: "postGameData.php",
				datatype: "json",
				data: {moves: newMoves},	
				error: ajax.error,
				success: ajax.endTurn
			});
		}
	},


	endTurn: function(){

		$.ajax({
			type: "POST",
			url: "postGameData.php",
			datatype: "json",
			data: {order: "endTurn"},
			error: ajax.error,
			success: ajax.echoReturn
		});		
	}
}



