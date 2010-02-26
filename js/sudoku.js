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
	var changeCandList = function(cand,to){
		var changed = 0;
		if (cand.length){
			for(var i=10;--i;){
				if (cand[i]) {
					if (to != this.cands[i]) {
						this.cands[i] = to;
						changed++;
					}
				}
			}
		}
		else {
			if (to != this.cands[cand]){
				this.cands[cand] = to;
				changed = 1;
			}
		}
		this.nbrCands += (to ? 1 : -1)*changed;
		return changed;
	};
	
	/**
	 * sets a candidate as 1 in the list
	 * @param {int|array} single or list of candidates
	 * @returns {int} number of cands added
	 */
	CandList.prototype.add = function(cand){
		return changeCandList.apply(this,[cand,1]);
	};
	
	/**
	 * sets a candidate as 0 in the list
	 * @param {int|array} single or list of candidates
	 * @returns {int} number of cands removed
	 */
	CandList.prototype.remove = function(cand){
		return changeCandList.apply(this,[cand,0]);
	};
	/**
	 * static version to set cand as 1 in list
	 * @param {CandList} list the CandList to work with
	 * @param {int|array} cand single or list of candidates
	 * @returns {int} number of cands added
	 */
	CandList.add = function(list,cand){
		return changeCandList.apply(list,[cand,1]);
	};
	/**
	 * static version to set cand as 0 in list
	 * @param {CandList} list the CandList to work with
	 * @param {int|array} cand single or list of candidates
	 * @returns {int} number of cands removed
	 */
	CandList.remove = function(list,cand){
		return changeCandList.apply(list,[cand,0]);
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
		var ret = "";
		if (!this.answered) {
			for (var i = 0; ++i < 10;) {
				if (this.candList.cands[i]) {
					ret += "canbe" + i + " ";
				}
			}
		}
		else {
			ret = "answered is"+this.answered;
		}
		return ret.substr(0,ret.length-1);
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

/****************************** Methods **************************************************/

    /**
     * takes a sudoku as a string and preps the board
     * @param {Object} sudoku A string containing the sudoku initial squares
     */
    SS.set = function(sudoku){
		
	};
	
	/**
	 * generates board data structure
	 */
	SS.generateBoard = function(){
		var board = {
			squares: {},
			moves: {},
			selection: {},
			houses: {}
		}; 
		for (var h = 1; h < 10; h++) {
			board.houses["r" + h] = new SS.House("r"+h);
			board.houses["c" + h] = new SS.House("c"+h);
			board.houses["b" + h] = new SS.House("b"+h);
		}
		for (var r = 1; r < 10; r++) {
			for (var c = 1; c < 10; c++) {
				var s = new SS.Square(r,c); 
				board.squares[s.id] = s;
				board.houses[s.row].squares.push(s.id);
				board.houses[s.col].squares.push(s.id);
				board.houses[s.box].squares.push(s.id);
			}
		}
		for (h in board.houses) {
			for (c = 1; c < 10; c++) {
				board.houses[h].candpositions[c] = board.houses[h].squares;
			}
			for (s in board.houses[h].squares) {
				Array.merge(board.squares[board.houses[h].squares[s]].neighbours, board.houses[h].squares);
			}
		}
		for (s in board.squares) {
			Array.remove(s, board.squares[s].neighbours);
		}
		return board;
	};
	
	
	
/******************************** exposure ******************************************************/
	/** @ignore */
	window.SS = SS; // expose	
})(jQuery);

