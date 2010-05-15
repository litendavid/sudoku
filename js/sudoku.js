/****************************** Array extras **************************************************/

if(!Array.locate){
	/**
	 * locates a needle in a haystack
	 * @param {string|int} obj needle to look for
	 * @param {array} arr the haystack to look in
	 * @returns {int} position of needle in array, -1 if not found
	 */
    Array.locate = function(obj,arr){ // needle, haystack
        for(var i=0, l=arr.length; i<l; i++){
            if(arr[i]==obj){
                return i;
            }
        }
        return -1;
    };
}

if (!Array.unique){
	/**
	 * returns array with no duplicate elements
	 * @param {array} arr the array to check
	 * @returns {array} a new array containing only unique elements from arr
	 */
	Array.unique = function (arr) {
		var r = [];
		o:for(var i = 0, n = arr.length; i < n; i++) {
			for(var x = 0, y = r.length; x < y; x++) {
				if(r[x]==arr[i]) {
					continue o;
				}
			}
			r[r.length] = arr[i];
		}
		return r;
	};
}

if (!Array.common){
	/**
	 * returns array with elements common to two given arrays
	 * @param {array} arr1
	 * @param {array} arr2
	 * @returns {array} a new array containing elements found in both arr1 and arr2
	 */
	Array.common = function(arr1,arr2){
		var r = [];
		for (var i = 0, l = arr1.length; i < l; i++) {
			if (Array.locate(arr1[i], arr2) != -1) {
				r.push(arr1[i]);
			}
		}
		return r;
	};
}

if (!Array.rince){
	/**
	 * returns new array with elements rinced
	 * @param {array} arr1
	 * @param {array} arr2
	 * @returns {array} a new array containing elements unique to arr1
	 */
	Array.rince = function(arr1,arr2){ // array, filter with parts NOT to include
		var r = [];
		for (var i = 0, l = arr1.length; i < l; i++) {
			if (Array.locate(arr1[i], arr2) == -1) {
				r.push(arr1[i]);
			}
		}
		return r;
	};
}

if (!Array.compare){
	/**
	 * checks whether or not two arrays are equal
	 * @param {array} arr1
	 * @param {array} arr2
	 * @returns {bool} whether or not the arrays have the same elements in the same order
	 */
	Array.compare = function(arr1, arr2){
		if (arr1.length != arr2.length) {
			return false;
		}
		for (var i = 0; i < arr1.length; i++) {
			if (arr1[i] != arr2[i]) {
				return false;
			}
		}
		return true;
	};
}

if (!Array.merge) {
	/**
	 * merges two arrays together
	 * @param {arr1} arr1
	 * @param {arr2} arr2
	 * @returns {array} a new array containing all elements from both arr1 and arr2
	 */
	Array.merge = function(arr1, arr2){
		for (var i = 0; i < arr2.length; i++) {
			if (Array.locate(arr2[i], arr1) == -1) {
				arr1.push(arr2[i]);
			}
		}
	};
}

if (!Array.remove){
	/**
	 * removes a needle from the haystack. modifies the original array!
	 * modifies original array by removing obj
	 * @param {int|string} sth to remove from array
	 * @param {array} array
	 */
	Array.remove = function(obj,array){
		var pos = Array.locate(obj,array);
		if (pos != -1){
			array.splice(pos,1);
		}
	};
}

/****************************** Object extras **************************************************/

if (!Object.keys){
	Object.keys = function(obj){
		var ret = [];
		for(var k in obj){
			if (obj.hasOwnProperty(k)){
				ret.push(k);
			}
		}
		return ret;
	};
}


/****************************** Program!! :) **************************************************/

(function ($){
	
	/**
	 * @namespace The main singleton
	 */
	SS = {};
	
	/**
	 * used as return value from certain functions
	 */
	var constants = {
		NOACTION: "noaction",
		NOMATTER: "nomatter",
		REMOVED: "removed",
		ADDED: "executed",
		ADD: "add",
		REMOVE: "remove",
		TOGGLE: "toggle",
		ROW: "row",
		COL: "col",
		BOX: "box",
		MAN: "man"
	};
	SS.constants = constants;

/****************************** Listmakermaker ***************************************************/
	
var ListMakerMaker = function(args){ // { defaultval(inst), isset(val,data), makeval(inst,data), listable(val), constrargsisdata }
	var defaultkeys = [1,2,3,4,5,6,7,8,9], startdata, constructor = function(constrargs){
		var keys = defaultkeys;
		if (constrargs){
			if (args.constrargsisdata) {
				this.data = constrargs;
			}
			else {
				this.keys = keys = constrargs;
			}
		}
		this.items = {};
		for(var i in keys){
			this.items[keys[i]] = args.defaultval(this);
		}
		updatelist(this);
	}, updatelist = function(inst){
		var keys = inst.keys || defaultkeys;
		inst.list = [];
		for(var i=0;i<keys.length;i++){
			if (args.listable(get(inst,keys[i]))){
				inst.list.push(keys[i]);
			}
		}
	}, revert = function(inst,data){
		for(var key in inst.items){
			if (!args.isset(get(inst,key),{
				t: data
			})){
				constructor.remove(inst,key);
			}
		}
	}, add = function(inst,data){ // data is {k: key} and some other stuff
		if (!args.isset(inst.items[data.k],data)){
			inst.items[data.k] = args.makeval(inst,data);
			updatelist(inst);
			return true;
		}
		return false;
	}, remove = function(inst,key){
		if (!args.isset(get(inst,key),{t:666666666})){
			return false;
		}
		inst.items[key] = args.defaultval(inst);
		updatelist(inst);
		return true;
	}, get = function(inst,key){
		return inst.items[key];
	};
	constructor.revert = args.revert ? args.revert : revert;
	constructor.add = add;
	constructor.remove = args.remove ? args.remove : remove;
	constructor.get = get;
	constructor.is = function(inst,key,turn){
		return args.isset(get(inst,key),{t:turn?turn:666666});
	};
	return constructor;
};

/******************************* BlockList class ************************************************/

	/**
	 * @constructor
	 * @name BlockList
	 * @class A Block List object
	 */
	var BlockList = ListMakerMaker({
		defaultval : function(inst){
			return 0;
		},
		isset: function(val, data){
			return val == -1 || (val <= data.t && val !== 0);
		},
		makeval: function(inst,data){
			return data.t;
		},
		listable: function(val){
			return val === 0;
		}
	});

	SS.BlockList = BlockList;
	
/******************************* AnswerList class ************************************************/

	/**
	 * @constructor
	 * @name AnswerList
	 * @class An AnswerList object
	 */
	var AnswerList = ListMakerMaker({
		defaultval : function(inst){
			return {t:0,p:0};
		},
		isset: function(val, data){
			return val.t == -1 || (val.t <= data.t && val.t !== 0);
		},
		makeval: function(inst,data){
			return {t:data.t,p:data.p};
		},
		listable: function(val){
			return val.t === 0;
		}
	});

	SS.AnswerList = AnswerList;


/******************************* PositionList class ************************************************/

	/**
	 * @constructor
	 * @name PositionList
	 * @class A PositionList object
	 */
	var PositionList = ListMakerMaker({
		defaultval : function(inst){
			return new BlockList(inst.data);
		},
		isset: function(val, data){ // val is BlockList with position keys, data is {k,p,t}
		    var current = val.items[data.p];
			return current == -1 || (current <= data.t && current !== 0);
		},
		makeval: function(inst,data){ // data is {k,p,t}
			BlockList.add(inst.items[data.k],{k:data.p,t:data.t});
			return inst.items[data.k];
		},
		listable: function(val){
			return val.list.length === 1;
		},
		revert: function(inst,data){
			for(var key in inst.items){
				BlockList.revert(inst.items[key],data);
			}
		},
		remove: function(inst,data){ // data is {k,p,t}
			BlockList.remove(inst.items[data.k],data.p);
		},
		constrargsisdata: true
	});

	SS.PositionList = PositionList;


/******************************** Square ******************************************************/	

	/**
	 * @constructor
	 * @name Square
	 * @class a square object
	 * @param {int} r the row number
	 * @param {int} c the column number
	 */
	var Square = function(r,c){
		/**
		 * square id (r1c1, r2c2, etc)
		 * @name Square#id
		 * @type string
		 */
		this.id = "r"+r+"c"+c;
		/**
		 * row id (r1, r2, etc)
		 * @name Square#row
		 * @type string
		 */
		this.row = "r"+r;
		/**
		 * col id (c1, c2, etc)
		 * @name Square#col
		 * @type string
		 */		
		this.col = "c"+c;
		/**
		 * box id (b1, b2, etc)
		 * @name Square#box
		 * @type string
		 */
		this.box = "b"+(3*(Math.floor((r+2) / 3)-1) + Math.floor((c+2) / 3));
		/**
		 * list of all neighbour squares
		 * @name Square#neighbours
		 * @type array
		 */
		this.neighbours = [];
		/**
		 * CandList of remaining candidates
		 * @name Square#candBlocks
		 * @type CandList
		 */
		this.candBlocks = new BlockList();
		/**
		 * CandList of remaining candidates in row
		 * @name Square#rowBlocks
		 * @type CandList
		 */
		this.rowBlocks = new BlockList();
		/**
		 * CandList of remaining candidates in col
		 * @name Square#colBlocks
		 * @type CandList
		 */
		this.colBlocks = new BlockList();
		/**
		 * CandList of remaining candidates in box
		 * @name Square#boxBlocks
		 * @type CandList
		 */
		this.boxBlocks = new BlockList();
		/**
		 * CandList of remaining candidates not blocked by user
		 * @name Square#manBlocks
		 * @type CandList
		 */
		this.manBlocks = new BlockList();
		/**
		 * turn in which square was given an answer
		 * @name Square#answeredTurn
		 * @type int
		 */
		this.answeredTurn = 0;
		/**
		 * candidate square is answered as
		 * @name Square#answeredCand
		 * @type int
		 */
		this.answeredCand = 0;
	};
	
	/**
	 * Static version, CSS class string, which depends on available cands
	 * @param {Square} square the square to work with
	 * @returns {string} the CSS class
	 */
	Square.getClass = function(square){
		var ret = square.row+" "+square.col+" "+square.box+" ";
		if (!square.answeredCand) {
			for (var i = 0; ++i < 10;) {
				if (!BlockList.is(square.candBlocks,i)) {
					ret += "canbe" + i + " ";
				}
			}
			ret = ret.substr(0,ret.length-1);
		}
		else {
			ret += "answered answer"+square.answeredCand;
		}
		return ret;
	};


	/**
	 * tests if a square is blocked for a given cand (or answered)
	 * @param {Square} square The Square to operate on
	 * @param {int} cand The candidate to test
	 * @returns {boolean} Whether or not that square is blocked
	 */	
	Square.isblocked = function(square,cand){
		return square.answeredTurn || BlockList.is(square.candBlocks,cand);
	};
	
	/**
	 * blocks a candidate, setting it to the given turn number
	 * @param {Square} square The Square to operate on
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {string target Which list to block in (row/col/box/man)
	 * @returns {boolean} Whether or not adding made difference
	 */	
	Square.block = function(square,cand,turn,target){
		if (square.answeredCand){
			return false;
		}
		var targetList = (target == constants.ROW ? square.rowBlocks : 
		                 target == constants.COL ? square.colBlocks : 
						 target == constants.BOX ? square.boxBlocks : 
						 square.manBlocks);
		BlockList.add(targetList,{t:turn,k:cand});
		return BlockList.add(square.candBlocks,{t:turn,k:cand});
	};
	
	/**
	 * unblocks a candidate
	 * @param {Square} square The Square to operate on
	 * @param {int} cand The candidate to unblock
	 * @param {string target Which list to unblock in (row/col/box/man)
	 * @returns {boolean} Whether or not removing made difference in square
	 */	
	Square.unblock = function(square,cand,target){
		if (square.answeredCand){
			return "alreadyanswered,idiot"; // square is answered, blockremoving is irrelevant
		}
		var targetList = (target == constants.ROW ? square.rowBlocks : 
		                  target == constants.COL ? square.colBlocks : 
						  target == constants.BOX ? square.boxBlocks : 
						  square.manBlocks);
		var msg = (target == constants.ROW ? "row" : 
		                  target == constants.COL ? "col" : 
						  target == constants.BOX ? "box" : 
						  "man");
console.log(square,msg,targetList);
		if (!BlockList.remove(targetList,cand)){
			return "no block existed, moron"; // this block didn't exist, no change
		}
		if (!BlockList.is(square.rowBlocks,cand) && !BlockList.is(square.colBlocks,cand) && !BlockList.is(square.boxBlocks,cand) && !BlockList.is(square.manBlocks,cand)){
			BlockList.remove(square.candBlocks,cand);
			return "weee, no longer blocked!"; // last block in square was removed, cand is now available!
		}
		return "removed, but others remain"; // other blocks remain, no change
	};
	
	
	/**
	 * Static version, reverts status back to a given turn
	 * @param {Square} list The Square to operate on
	 * @param {int} turn The turn number to revert it to
	 */	
	Square.revert = function(square,turn){
		// removing answer
		if (square.answeredTurn>turn){
			square.answeredTurn = 0;
			square.answeredCand = 0;
		}
		// removing blocks
		BlockList.revert(square.rowBlocks,turn);
		BlockList.revert(square.colBlocks,turn);
		BlockList.revert(square.boxBlocks,turn);
		BlockList.revert(square.manBlocks,turn);
		// update blocksummary
		BlockList.revert(square.candBlocks,turn);
	};

	/**
	 * Sets square answer as given candidate at given turn
	 * @param {Square} square The square to operate on
	 * @param {int} cand The cand to set it to
	 * @param {int} turn The turn number to revert it to
	 * @returns {int} Action code according to constant
	 */	
	Square.answer = function(square,cand,turn){
		if (Square.isblocked(square.candBlocks,cand)){ // that cand is blocked or answered
			return false;
		} 
		square.answeredTurn = turn;
		square.answeredCand = cand;
		return true;
	};

	/**
	 * unsets answer
	 * @param {Square} square The square to operate on
	 * @returns {bool} Whether or not an answer was removed
	 */	
	Square.unanswer = function(square){
		if (square.answeredTurn === 0){ // square didn't have answer
			return false;
		} 
		square.answeredTurn = 0;
		square.answeredCand = 0;
		return true;
	};

	SS.Square = Square;

	
/******************************** House class ***************************************************/	

	/**
	 * @name House
	 * @class a house object
	 * @param {string} id the id of the house
	 */
	var House = function(id){
		/**
		 * id of house
		 * @name House#id
		 * @type string
		 */
		this.id = id;
		/**
		 * list of all contained squares
		 * @name House#squares
		 * @type array
		 */
		this.squares = [];
		/**
		 * list of answered candidates
		 * @name House#cands
		 * @type CandList
		 */
		this.answeredCands = new CandList();
		/**
		 * possible positions for the different candidates
		 * @name House#candPositions
		 * @type object
		 */
		this.candPositions = {
			1: {},
			2: {},
			3: {},
			4: {},
			5: {},
			6: {},
			7: {},
			8: {},
			9: {}
		};
		/**
		 * array with square ids for answered cands
		 * @name House#answerPositions
		 * @type array
		 */
		this.answerPositions = [666,0,0,0,0,0,0,0,0,0];
	};
	
	/**
	 * Adds a squareid to a house. Only used during board instantiation
	 * @param {string} sqrid id of square to add
	 */
	House.prototype.add = function(sqrid){
		this.squares.push(sqrid);
		for(var i=1;i<=9;i++){
			this.candPositions[i][sqrid] = 0;
		}
	};
	
	/**
	 * blocks a candidate in a square, setting it to the given turn number
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {string} sqrid The id of the square to block cand in
	 * @param {boolean} toggle Whether or not to toggle back eventual previous block
	 * @returns {boolean} Whether or not the cand was not already blocked
	 */
	House.prototype.block = function(cand,turn,sqrid,toggle){
		return House.block(this,cand,turn,sqrid,toggle);
	};
	
	/**
	 * blocks a candidate in a square, setting it to the given turn number
	 * @param {House} house The house to operate on
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {string} sqrid The id of the square to block cand in
	 * @param {boolean} toggle Whether or not to toggle back eventual previous block
	 * @returns {boolean} Whether or not the cand was not already blocked
	 */
	House.block = function(house,cand,turn,sqrid,toggle){
		if (house.candPositions[cand][sqrid]){
			if (toggle && house.candPositions[cand][sqrid] != -1){
				house.candPositions[cand][sqrid] = 0;
				return constants.REMOVED;
			}
			return constants.NOACTION;
		}
		house.candPositions[cand][sqrid] = turn;
		return constants.ADDED;
	};
	
	/**
	 * answers a candidate in a square, setting it to the given turn number
	 * @param {int} cand The candidate to answer
	 * @param {int} turn The turn number in which to answer
	 * @param {string} sqrid The id of the square to answer cand in
	 * @param {boolean} toggle Whether or not to toggle back eventual previous answer
	 * @returns {boolean} Whether or not the cand was not already answered
	 */
	House.prototype.answer = function(cand,turn,sqrid,toggle){
		return House.answer(this,cand,turn,sqrid,toggle);
	};
	
	/**
	 * Static version, answers a candidate in a square, setting it to the given turn number
	 * @param {House} house The house to operate on
	 * @param {int} cand The candidate to answer
	 * @param {int} turn The turn number in which to answer
	 * @param {string} sqrid The id of the square to answer cand in
	 * @param {boolean} toggle Whether or not to toggle back eventual previous block
	 * @returns {boolean} Whether or not the cand was not already answered
	 */
	House.answer = function(house,cand,turn,sqrid,toggle){
		if (house.answeredCands[cand]){ // already answered for that cand
			if (toggle && house.answeredCands[cand] != -1){
				house.answeredCands[cand] = 0;
				house.answerPositions[cand] = 0;
				return constants.REMOVED;
			}
			return constants.NOACTION;
		}
		if (house.candPositions[cand][sqrid]){ // cand is blocked in that square
			return constants.NOACTION;
		}
		for(var i in house.answerPositions){   // square already answered with some cand
			if (house.answerPositions[i]===sqrid){
				return constants.NOACTION;
			}
		}
		house.answeredCands[cand] = turn;
		house.answerPositions[cand] = sqrid;
		return constants.ADDED;
	};

	/**
	 * reverts a House state back to a given turn
	 * @param {int} turn The turn number to set it to
	 * @returns {boolean} Whether or not the revert meant any changes
	 */
	House.prototype.revert = function(turn){
		return House.revert(this,turn);
	};
	
	/**
	 * Static version, reverts a House back to a given turn
	 * @param {House} house The house to operate on
	 * @param {int} turn The turn number to set it to
	 * @returns {boolean} Whether or not the revert meant any changes
	 */
	House.revert = function(house,turn){
		var change = false;
		for(var i = 1;i<=9;i++){
			// undo answer for this cand
			if (house.answeredCands[i] && house.answeredCands[i] > turn){
				house.answeredCands[i] = 0;
				house.answerPositions[i] = 0;
				change = true;
			}
			// undo block for this cand
			for(var s in house.candPositions[i]){
				if (house.candPositions[i][s] && house.candPositions[i][s] > turn){
					house.candPositions[i][s] = 0;
					change = true;
				}
			}
		}
		return change;
	};

	SS.House = House;

/******************************** Board class ***************************************************/	

	/**
	 * @constructor
	 * @name Board
	 * @class a board object
	 * @param {string} selector The ID of the wrapper for the DOM representation
	 */
	var Board = function(selector,free){
		/**
		 * DOM id of board wrapper
		 * @name Board#selector
		 * @type string
		 */
		this.selector = selector;
		/**
		 * object with sqrids as key, squares as value
		 * @name Board#squares
		 * @type object
		 */
		this.squares = {};
		/**
		 * object with movenumber as key, effectobject as value. move to own class? Not yet used.
		 * @name Board#moves
		 * @type object
		 */
		this.moves = {};
		/**
		 * object containing currently selected squares/cands/houses. Not yet used.
		 * @name Board#moves
		 * @type object
		 */
		this.selection = {};
		/**
		 * object with houseids as key, houses as value
		 * @name Board#houses
		 * @type object
		 */
		this.houses = {};
		/**
		 * the current turn number, set to 1 after sudoku is set
		 * @name Board#currentTurn
		 * @type int
		 */
		this.currentTurn = -1;
		/**
		 * flag if board is in free mode
		 * @name Board#free
		 * @type boolean
		 */
		this.free = !!free;

		for (var h = 1; h < 10; h++) {
			this.houses["r" + h] = new House("r"+h);
			this.houses["c" + h] = new House("c"+h);
			this.houses["b" + h] = new House("b"+h);
		}
		for (var r = 1; r < 10; r++) {
			for (var c = 1; c < 10; c++) {
				var s = new Square(r,c); 
				this.squares[s.id] = s;
				this.houses[s.row].add(s.id);
				this.houses[s.col].add(s.id);
				this.houses[s.box].add(s.id);
			}
		}
		for (h in this.houses) {
			for (s in this.houses[h].squares) {
				Array.merge(this.squares[this.houses[h].squares[s]].neighbours, this.houses[h].squares);
			}
		}
		for (s in this.squares) {
			Array.remove(s, this.squares[s].neighbours);
		}
	};
	
	/**
	 * Blocks a candidate in a square
	 * @param {int} cand candidate to block
	 * @param {string} sqrid id of square to block cand in
	 * @returns {bool} whether or not cand was removed (might already have been removed)
	 */
	Board.prototype.blockCandInSquare = function(cand,sqrid,turn){
		return Board.blockCandInSquare(this,cand,sqrid);
	};
	
	/**
	 * Static version, blocks a candidate in a square
	 * @param {Board} board The board to work with
	 * @param {int} cand candidate to block
	 * @param {string} sqrid id of square to block cand in
	 * @returns {bool} whether or not cand was removed (might already have been removed)
	 */
	Board.blockCandInSquare = function(board,cand,sqrid){
		var square = board.squares[sqrid],
		    turn = board.currentTurn,
			toggle = board.free,
			squareresult = Square.block(square,cand,turn,toggle);
		if (squareresult != constants.NOACTION) {
			House.block(board.houses[square.row], cand, turn, sqrid, toggle);
			House.block(board.houses[square.col], cand, turn, sqrid, toggle);
			House.block(board.houses[square.box], cand, turn, sqrid, toggle);
			Board.updateSquare(board, sqrid);
		}
		return squareresult;
	};

	/**
	 * Sets a square to a candidate, answering it
	 * @param {int} cand candidate to set
	 * @param {string} sqrid id of square to answer cand in
	 * @returns {bool} whether or not cand was answered (might not be available in square)
	 */
	Board.prototype.answerSquare = function(cand, sqrid){
		return Board.answerSquare(this,cand,sqrid);
	};

	/**
	 * Static version, sets a square to a candidate, answering it
	 * @param {Board} board The board to work with
	 * @param {int} cand candidate to set
	 * @param {string} sqrid id of square to answer cand in
	 * @returns {bool} whether or not cand was answered (might not be available in square)
	 */
	Board.answerSquare = function(board,cand,sqrid){
		var square = board.squares[sqrid],
    		row = board.houses[square.row],
		    col = board.houses[square.col], 
			box = board.houses[square.box],
		    turn = board.currentTurn,
			toggle = board.free,
			squareresult = Square.answer(square,cand,turn,toggle);
		if (squareresult != constants.NOACTION) {
			// update square in UI
			Board.updateSquare(board, sqrid);
			// update the houses
			House.answer(row, cand, turn, sqrid, toggle);
			House.answer(col, cand, turn, sqrid, toggle);
			House.answer(box, cand, turn, sqrid, toggle);
			// update the neighbours
			for (var nid in square.neighbours) {
				Board.blockCandInSquare(board, cand, square.neighbours[nid], toggle);
			}
		}
		return squareresult;
	};
	
	
	
	/**
	 * Updates DOM representation of a square
	 * @param {string} sqrid id of the square to update
	 */
	Board.prototype.updateSquare = function(sqrid){
		return Board.updateSquare(this,sqrid);
	};
	
	/**
	 * Static version, updates DOM representation of a square
	 * @param {Board} board
	 * @param {string} sqrid
	 */
	Board.updateSquare = function(board,sqrid){
		var square = board.squares[sqrid], newclass = Square.getClass(square);
		$("#"+sqrid,board.selector)[0].className = newclass;
	};
	
	/**
	 * parses a sudoku string and sets all initial squares
	 * @param {Board} board the board to work with
	 * @param {string} sudoku a string representation of the sudoku, empty squares 0
	 */
	Board.set = function(board,sudoku) {
		var i, n;
		board.currentTurn = -1;
		for(i = 0;i<81;i++){
			n = Number(sudoku[i]);
			if (n){
				Board.answerSquare(board,n,"r"+(Math.floor((i)/9)+1)+"c"+((i)%9+1));
			}
		}
		board.currentTurn = 1;
	};
	
	/**
	 * parses a sudoku string and sets all initial squares
	 * @param {string} sudoku a string representation of the sudoku, empty squares 0
	 */
	Board.prototype.set = function(sudoku){
		return Board.set(this,sudoku);
	};
	
	SS.Board = Board;

/****************************** Methods **************************************************/

	
	
/******************************** exposure ******************************************************/
	/** @ignore */
	window.SS = SS; // expose	
})(jQuery);

