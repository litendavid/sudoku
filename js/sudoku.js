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
		REVERTED: "reverted",
		EXECUTED: "executed"
	};
	SS.constants = constants;
	
/****************************** CandList class **************************************************/

	/**
	 * @constructor
	 * @name CandList
	 * @class A Candidate List object
	 * @param {void|cands} optional cands array
	 */
	var CandList = function(cands){
		/**
		 * array of candidates
		 * @name CandList#cands
		 * @type array
		 */
		this.cands = (cands ? cands : [666,0,0,0,0,0,0,0,0,0]);
		/**
		 * number of blocked candidates
		 * @name CandList#nbrBlocked
		 * @type int
		 */
		this.nbrBlocked = 0;
		for(var i=10;--i;){
			this.nbrBlocked += (this.cands[i] ? 1 : 0);
		}
	};
	
	/**
	 * blocks a candidate, setting it to the given turn number
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {boolean} toggle Whether or not to toggle already blocked value back to unblocked
	 * @returns {boolean} Whether or not the cand was blocked
	 */
	CandList.prototype.block = function(cand,turn,toggle){
		return CandList.block(this,cand,turn,toggle);
	};
	
	/**
	 * blocks a candidate, setting it to the given turn number
	 * @param {CandList} list The CandList to operate on
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {boolean} toggle Whether or not to toggle back to unblocked if already blocked
	 * @returns {int} 1 if blocked, -1 if toggled to unblocked, 0 if was already blocked and no toggle
	 */	
	CandList.block = function(list,cand,turn,toggle){
		if (list.cands[cand] && list.cands[cand] <= turn){
			if (toggle && list.cands[cand] != -1){
				list.cands[cand] = 0;
				list.nbrBlocked -= 1;
				return constants.REVERTED;
			}
			return constants.NOACTION;
		}
		list.cands[cand] = turn;
		list.nbrBlocked += 1;
		return constants.EXECUTED;
	};
	
	/**
	 * reverts status back to a given turn
	 * @param {int} turn The turn number to revert it to
	 * @returns {boolean} Whether or not the revert meant any changes
	 */	
	CandList.prototype.revert = function(turn){
		return CandList.revert(this,turn);
	};
	
	/**
	 * Static version, reverts status back to a given turn
	 * @param {CandList} list The CandList to operate on
	 * @param {int} turn The turn number to revert it to
	 * @returns {boolean} Whether or not the revert meant any changes
	 */	
	CandList.revert = function(list,turn){
		var oldNbrBlocked = list.nbrBlocked;
		list.nbrBlocked = 0;
		for(var i=10;--i;){
			if (list.cands[i]>turn){
				list.cands[i] = 0;
			}
			list.nbrBlocked += (list.cands[i] ? 1 : 0);
		}
		return list.nbrBlocked != oldNbrBlocked;
	};
	
	
	SS.CandList = CandList;
	
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
		 * @name Square#candList
		 * @type CandList
		 */
		this.candList = new CandList();
	};
	
	/**
	 * returns the CSS class string, which depends on available cands
	 * @returns {string} the CSS class
	 */
	Square.prototype.getClass = function(){
		return Square.getClass(this);
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
				if (!square.candList.cands[i]) {
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
	 * blocks a candidate, setting it to the given turn number
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {boolean} toggle Whether or not to toggle back already
	 * @returns {boolean} Whether or not the cand was blocked
	 */
	Square.prototype.block = function(cand,turn,toggle){
		return Square.block(this,cand,turn,toggle);
	};
	
	/**
	 * blocks a candidate, setting it to the given turn number
	 * @param {Square} square The Square to operate on
	 * @param {int} cand The candidate to block
	 * @param {int} turn The turn number to set it to
	 * @param {boolean} toggle Whether or not to toggle back already
	 * @returns {boolean} Whether or not the cand was blocked
	 */	
	Square.block = function(square,cand,turn,toggle){
		if (square.answeredCand && square.answeredTurn <= turn){
			return constants.NOACTION;
		}
		return CandList.block(square.candList,cand,turn,toggle);
	};
	
	/**
	 * reverts status back to a given turn
	 * @param {int} turn The turn number to revert it to
	 * @returns {boolean} Whether or not the revert meant any changes
	 */	
	Square.prototype.revert = function(turn){
		return Square.revert(this,turn);
	};
	
	/**
	 * Static version, reverts status back to a given turn
	 * @param {Square} list The Square to operate on
	 * @param {int} turn The turn number to revert it to
	 * @returns {boolean} Whether or not the revert meant any changes
	 */	
	Square.revert = function(square,turn){
		var oldAnsweredTurn = square.answeredTurn;
		if (square.answeredTurn>turn){
			square.answeredTurn = 0;
			square.answeredCand = 0;
		}
		return CandList.revert(square.candList,(turn)) || (oldAnsweredTurn && !square.answeredTurn);
	};

	/**
	 * Sets square answer as given candidate at given turn
	 * @param {int} cand The cand to set it to
	 * @param {int} turn The turn number to revert it to
	 * @param {boolean} toggle Whether or not to toggle back answer
	 * @returns {int} Action code according to constant
	 */	
	Square.prototype.answer = function(cand,turn,toggle){
		return Square.answer(this,cand,turn,toggle);
	};
	
	/**
	 * Static version, sets square answer as given candidate at given turn
	 * @param {Square} square The square to operate on
	 * @param {int} cand The cand to set it to
	 * @param {int} turn The turn number to revert it to
	 * @returns {int} Action code according to constant
	 */	
	Square.answer = function(square,cand,turn,toggle){
		if (square.candList.cands[cand] && square.candList.cands[cand] <= turn){ // that cand is blocked
			return constants.NOACTION;
		} 
		if (square.answeredCand){ // square already answered
			if (toggle && square.answeredTurn != -1){
				square.answeredTurn = 0;
				square.answeredCand = undefined;
				return constants.REVERTED;
			}
			return constants.NOACTION;
		}
		square.answeredTurn = turn;
		square.answeredCand = cand;
		return constants.EXECUTED;
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
				return constants.REVERTED;
			}
			return constants.NOACTION;
		}
		house.candPositions[cand][sqrid] = turn;
		return constants.EXECUTED;
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
				house.answerPositions[cand] = undefined;
				return constants.REVERTED;
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
		return constants.EXECUTED;
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
		var square = board.squares[sqrid], turn = board.currentTurn;
		if (!Square.block(square,cand,turn)){
			return false;
		}
		House.block(board.houses[square.row],cand,turn,sqrid);
		House.block(board.houses[square.col],cand,turn,sqrid);
		House.block(board.houses[square.box],cand,turn,sqrid);
		Board.updateSquare(board,sqrid);
		return true;
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
		var square = board.squares[sqrid], row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box],
		    turn = board.currentTurn;
		if (square.answeredCand || (square.candList.cands[cand] && square.candList.cands[cand] <= turn)){
			return false;
		}
		// update the square
		Square.answer(square,cand,turn);
		Board.updateSquare(board,sqrid);
		// update the houses
		House.answer(board.houses[square.row],cand,turn,sqrid);
		House.answer(board.houses[square.col],cand,turn,sqrid);
		House.answer(board.houses[square.box],cand,turn,sqrid);
		// update the neighbours
		for(var nid in square.neighbours){
			Board.blockCandInSquare(board,cand,square.neighbours[nid]);
		}
		return true;
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

