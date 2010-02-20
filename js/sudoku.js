if(!Array.locate){
	/**
	 * locates a needle in a haystack
	 * @param {string|int} obj needle to look for
	 * @param {array} arr the haystack to look in
	 * @returns {int} position of needle in array, -1 if not found
	 */
    Array.locate = function(obj,arr){
    };
}

if (!Array.unique){
	/**
	 * returns array with no duplicate elements
	 * @param {array} arr the array to check
	 * @returns {array} a new array containing only unique elements from arr
	 */
	Array.unique = function (arr) {
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
	};
}

if (!Array.rince){
	/**
	 * returns new array with elements rinced
	 * @param {array} arr1
	 * @param {array} arr2
	 * @returns {array} a new array containing elements unique to arr1
	 */
	Array.rince = function(arr1,arr2){
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
	 */
	var CandList = function(){
		/**
		 * array of candidates
		 * @name CandList#cands
		 * @type array
		 */
		this.cands = "";
		/**
		 * number of remaining candidates
		 * @name CandList#nbrCands
		 * @type int
		 */
		this.nbrCands = "";
	};
	/**
	 * sets a candidate as 1 in the list
	 * @param {int} cand
	 * @returns {boolean} whether or not cand wasn't already 1
	 */
	CandList.prototype.add = function(cand){
	};
	/**
	 * sets a candidate as 0 in the list
	 * @param {int} cand
	 * @returns {boolean} whether or not cand wasn't already 0
	 */
	CandList.prototype.remove = function(cand){
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
		 * row id (r1, r2, etc)
		 * @name Square#row
		 * @type string
		 */
		this.row = "";
		/**
		 * col id (c1, c2, etc)
		 * @name Square#col
		 * @type string
		 */		
		this.col = "";
		/**
		 * box id (b1, b2, etc)
		 * @name Square#box
		 * @type string
		 */
		this.box = "";
		/**
		 * list of all neighbour squares
		 * @name Square#neighbours
		 * @type array
		 */
		this.neighbours = [];
		/**
		 * CandList of remaining candidates
		 * @name Square#cands
		 * @type CandList
		 */
		this.cands = new CandList();
	};
	
	SS.Square = Square;

	
/******************************** House class ***************************************************/	

	/**
	 * @name House
	 * @class a house object
	 */
	var House = function(){
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
		 * @name House#positions
		 * @type array
		 */
		this.positions = [];
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
		
	};
	
	
	
/******************************** exposure ******************************************************/
	/** @ignore */
	window.SS = SS; // expose	
})(jQuery);

