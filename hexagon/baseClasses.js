function MovementOrder(fleetid, moves, origin, hmp, validLanes, turn){
	this.fleetid = fleetid
	this.origin = origin
	this.moves = [];
	this.hmp = hmp;
	this.turn = turn;
	this.validLanes = [];

	if (moves != undefined){
		for (var i = 0; i < moves.length; i++){
			this.moves.push(moves[i].id)
		}
	}
	if (validLanes){
		this.validLanes = validLanes;
	}

	this.getTotalHMP = function(){
		total = 0;
		for (var i = 0; i < this.hmp.length; i++){
			total += this.hmp[i];
		}
		return total;
	}
}

function Fleet(id, owner, loc, name){
	this.type = "Fleet";
	this.id = id;
	this.owner = owner;
	this.ships = [];
	this.location = loc;
	this.name = name;
	this.currentOrder;
	this.validLanes = [];


	this.hasJumpEngine = function(){
		for (var i = 0; i < this.ships.length; i++){
			if (this.ships[i].jumpdrive){
				return true;
			}
		}
	}
	
	this.hasElint = function(){
		for (var i = 0; i < this.ships.length; i++){
			if (this.ships[i].elint){
				return true;
			}
		}
	}
}

function Planet(id, owner, name, loc, level, baseIncome, baseTrade, type, enviroment, notes_1, notes_2, notes_3){
	this.type = "Planet";
	this.id = id;
	this.owner = owner;
	this.name = name;
	this.location = loc;
	this.level = level;
	this.baseIncome = baseIncome;
	this.baseTrade = baseTrade;
	this.type = type;
	this.enviroment = enviroment;
	this.notes = [];
	this.tempNotes = [notes_1, notes_2, notes_3];

	this.creation = function(){
		for (var i = 0; i < this.tempNotes.length; i++){
			if (this.tempNotes[i] != null){
				this.notes.push(this.tempNotes[i]);
				this.tempNotes = false;
			}
		}

		if (this.type == "Large Asteroid Field"){
				this.icon = asteroid_icons[0];
		}
		else if (this.type == "Medium Asteroid Field"){
				this.icon = asteroid_icons[1];
		}
		else if (this.type == "Small Asteroid Field"){
				this.icon = asteroid_icons[2];
		}
		else {
			for (var k = 0; k < planet_icons.length; k++){
				if ( planet_icons[k].type == this.enviroment.toLowerCase() ){
					this.icon = planet_icons[k];
				}
			}
		}

	}

	this.creation();


}


function Ship(id, fleetid, size, model, name, elint, scanner, jumpdrive, notes){
	this.type = "Ship";
	this.id = id;
	this.fleetid = fleetid
	this.size = size;
	this.model = model;
	this.name = name;
	this.elint = elint;
	this.scanner = scanner;
	this.jumpdrive = jumpdrive;
	this.notes = notes;

	//console.log(this);
}

function Jumpgate(id, owner, location, damaged, usable, lane){
	this.type = "Jumpgate";
	this.id = id;
	this.owner = owner;
	this.location = location;
	this.damaged = damaged;
	this.usable = usable;
	this.lane = lane
}

function Lane(){
	this.type = "Lane";
	this.path = [];
	this.id;
}