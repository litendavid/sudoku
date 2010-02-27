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
		this.cands = (cands ? cands : [666,1,1,1,1,1,1,1,1,1]);
		/**
		 * number of remaining candidates
		 * @name CandList#nbrCands
		 * @type int
		 */
		this.nbrCands = 0;
		for(var i=10;--i;){
			this.nbrCands += this.cands[i];
		}
	};
	
	// private function
	var changeCandList = function(list,cand,to){
		var changed = 0;
		if (cand.length){
			for(var i=10;--i;){
				if (cand[i]) {
					if (to != list.cands[i]) {
						list.cands[i] = to;
						changed++;
					}
				}
			}
		}
		else {
			if (to != list.cands[cand]){
				list.cands[cand] = to;
				changed = 1;
			}
		}
		list.nbrCands += (to ? 1 : -1)*changed;
		return changed;
	};
	
	/**
	 * sets a candidate as 1 in the list
	 * @param {int|array} single or list of candidates
	 * @returns {int} number of cands added
	 */
	CandList.prototype.add = function(cand){
		return changeCandList(this,cand,1);
	};
	
	/**
	 * sets a candidate as 0 in the list
	 * @param {int|array} single or list of candidates
	 * @returns {int} number of cands removed
	 */
	CandList.prototype.remove = function(cand){
		return changeCandList(this,cand,0);
	};
	/**
	 * static version to set cand as 1 in list
	 * @param {CandList} list the CandList to work with
	 * @param {int|array} cand single or list of candidates
	 * @returns {int} number of cands added
	 */
	CandList.add = function(list,cand){
		return changeCandList(list,cand,1);
	};
	/**
	 * static version to set cand as 0 in list
	 * @param {CandList} list the CandList to work with
	 * @param {int|array} cand single or list of candidates
	 * @returns {int} number of cands removed
	 */
	CandList.remove = function(list,cand){
		return changeCandList(list,cand,0);
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
		if (!square.answer) {
			for (var i = 0; ++i < 10;) {
				if (square.candList.cands[i]) {
					ret += "canbe" + i + " ";
				}
			}
			ret = ret.substr(0,ret.length-1);
		}
		else {
			ret += "answered answer"+square.answer;
		}
		return ret;
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
		 * @name House#candpositions
		 * @type array
		 */
		this.candpositions = {
			1: [],
			2: [],
			3: [],
			4: [],
			5: [],
			6: [],
			7: [],
			8: [],
			9: []
		};
	};
	
	SS.House = House;

/******************************** Board class ***************************************************/	

	/**
	 * @constructor
	 * @name Board
	 * @class a board object
	 * @param {string} selector The ID of the wrapper for the DOM representation
	 */
	var Board = function(selector){
		if (selector) {
			this.selector = selector;
		}
		this.squares = {};
		this.moves = {};
		this.selection = {};
		this.houses = {};

		for (var h = 1; h < 10; h++) {
			this.houses["r" + h] = new SS.House("r"+h);
			this.houses["c" + h] = new SS.House("c"+h);
			this.houses["b" + h] = new SS.House("b"+h);
		}
		for (var r = 1; r < 10; r++) {
			for (var c = 1; c < 10; c++) {
				var s = new SS.Square(r,c); 
				this.squares[s.id] = s;
				this.houses[s.row].squares.push(s.id);
				this.houses[s.col].squares.push(s.id);
				this.houses[s.box].squares.push(s.id);
			}
		}
		for (h in this.houses) {
			for (c = 1; c < 10; c++) {
				this.houses[h].candpositions[c] = this.houses[h].squares;
			}
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
	Board.prototype.blockCandInSquare = function(cand,sqrid){
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
		var square = board.squares[sqrid];
		if (!CandList.remove(square.candList,cand)){
			return false;
		}
		Array.remove(sqrid,board.houses[square.row].candpositions[cand]);
		Array.remove(sqrid,board.houses[square.col].candpositions[cand]);
		Array.remove(sqrid,board.houses[square.box].candpositions[cand]);
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
		var square = board.squares[sqrid], row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box];
		if (!square.candList.cands[cand] || square.answer){
			return false;
		}
		// update the square
		square.candList = new CandList([666,0,0,0,0,0,0,0,0,0]);
		square.answer = cand;
		Board.updateSquare(board,sqrid);
		// update the houses
		row.candpositions[cand] = [sqrid];
		col.candpositions[cand] = [sqrid];
		box.candpositions[cand] = [sqrid];
		CandList.add(row.answeredCands,cand);
		CandList.add(col.answeredCands,cand);
		CandList.add(box.answeredCands,cand);
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
		for(i = 0;i<81;i++){
			n = Number(sudoku[i]);
			if (n){
				Board.answerSquare(board,n,"r"+(Math.floor((i)/9)+1)+"c"+((i)%9+1));
			}
		}
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

