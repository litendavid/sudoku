/************** Test helper methods *********************************************************************/

function objpropcounter(obj){
	var i = 0;
	for(var p in obj){
		if (obj.hasOwnProperty(p)){
			i++;			
		}
	}
	return i;
}

/**************/ module("Static array methods"); /*******************************************************/

test("Array extra methods are declared",function(){
	equals(typeof Array.compare,"function","compare function exists");
	equals(typeof Array.locate,"function","locate function exists");
	equals(typeof Array.unique,"function","unique function exists");
	equals(typeof Array.common,"function","common function exists");
	equals(typeof Array.rince,"function","rince function exists");
});

test("compare function",function(){
	ok(Array.compare([1,2,3],[1,2,3]),"should return true if arrays are identical");
	ok(!Array.compare([1,2,3],[4,5,6]),"should return false if differnet members");
	ok(!Array.compare([1,2,3],[1,2,3,3]),"should return false if 2nd is same but has more members");
	ok(!Array.compare([1,2,3],[3,2,1]),"should return false if same but different order");
});

test("locate function",function(){
	equals(Array.locate(6,[1,2,3,4,5]),-1,"should return -1 when needle doesn't exist");
	equals(Array.locate(4,[1,2,3,4,5]),3,"should return index when needle exists");
});

test("unique function",function(){
	ok(Array.compare(Array.unique([1,2,3,3,3,4,4,5]),[1,2,3,4,5]),"should return only unique members");
});

test("common function",function(){
	ok(Array.compare(Array.common([1,2,3],[2,3,4,5]),[2,3]),"should only return common members");
	ok(Array.compare(Array.common([1,2,3],[4,5,6]),[]),"should return empty array if no common members");
});

test("rince function",function(){
	ok(Array.compare(Array.rince([1,2,3,4,5],[2,3,4]),[1,5]),"should remove 2nd array members from first");
});

/**************/ module("Singleton"); /*******************************************************/

test("is exposed",function(){
	equals(typeof window.SS,"object","as SS");
});

test("contains classes",function(){
	equals(typeof SS.CandList,"function","CandList is declared");
	equals(typeof SS.Square,"function","Square is declared");
	equals(typeof SS.House,"function","House is declared");
	equals(typeof SS.Board,"function","Board is declared");
});

/**************/ module("CandList"); /*******************************************************/

test("instantiation",function(){
	var c = new SS.CandList();
	ok(Array.compare(c.cands,[666,1,1,1,1,1,1,1,1,1]),"defaults to containing all candidates");
	equals(c.nbrCands,9,"has correct total");
	c = new SS.CandList([666,0,0,0,0,0,0,0,1,1]);
	ok(Array.compare(c.cands,[666,0,0,0,0,0,0,0,1,1]),"can be instantiated with given candidates");
	equals(c.nbrCands,2,"has correct total");
});

test("adding candidate",function(){
	var c = new SS.CandList([666,0,0,0,0,0,0,0,0,0]);
	equals(typeof c.add,"function","adding function exists");
	equals(c.add(5),1,"adding returns number of added candidates");
	ok(Array.compare([666,0,0,0,0,1,0,0,0,0],c.cands),"candidate list is updated with single cand");
	equals(c.nbrCands,1,"total is updated");
	equals(c.add([666,0,0,0,0,1,1,1,0,0]),2,"adding many returns number of added candidates");
	ok(Array.compare([666,0,0,0,0,1,1,1,0,0],c.cands),"candidate list is updated with candlist");
	equals(c.nbrCands,3,"total is updated");
	equals(typeof SS.CandList.add,"function","adding function also has static counterpart");
	equals(SS.CandList.add(c,9),1,"static add also returns number of added cands");
	equals(c.nbrCands,4,"static add also updates nbrCands");
});

test("removing candidate",function(){
	var c = new SS.CandList([666,1,1,1,1,1,1,1,1,1]);
	equals(typeof c.remove,"function","removing function exists");
	equals(c.remove(5),1,"removing returns number of removed candidates");
	ok(Array.compare([666,1,1,1,1,0,1,1,1,1],c.cands),"candidate list is now without removed cand");
	equals(c.nbrCands,8,"total is updated");
	equals(c.remove([666,0,0,0,0,1,1,1,0,0]),2,"removing many returns number of removed candidates");
	ok(Array.compare([666,1,1,1,1,0,0,0,1,1],c.cands),"candidate list is updated accordingly");
	equals(c.nbrCands,6,"total is updated");
	equals(typeof SS.CandList.add,"function","removing function also has static counterpart");
	equals(SS.CandList.remove(c,1),1,"static remove also returns number of removed cands");
	equals(c.nbrCands,5,"static remove also updates nbrCands");
});

/**************/ module("Square"); /*******************************************************/

test("instantiation",function(){
	var s = new SS.Square(5,6);
	ok(s instanceof SS.Square," Square is constructor");
	ok(s.candList instanceof SS.CandList,"Square has a candidatelist");
	ok(Array.compare(s.candList.cands,[666,1,1,1,1,1,1,1,1,1]),"Candlist is full");
	equals(s.row,"r5","Square has row property");
	equals(s.col,"c6","Square has col property");
	equals(s.box,"b5","Square has box property");
	ok($.isArray(s.neighbours),"Square has neighbourids array property");
	equals((new SS.Square(1,3).box),"b1","r1c3 has box b1");
	equals((new SS.Square(6,4).box),"b5","r6c4 has box b5");
	equals((new SS.Square(7,7).box),"b9","r7c7 has box b9");
});

test("classname generation",function(){
	var s = new SS.Square(1,1);
	equals(typeof s.getClass,"function","Square has a getClass function");
	equals(s.getClass(),"r1 c1 b1 canbe1 canbe2 canbe3 canbe4 canbe5 canbe6 canbe7 canbe8 canbe9","Starts with 'full' classname");
	s.candList.remove(6);
	equals(s.getClass(),"r1 c1 b1 canbe1 canbe2 canbe3 canbe4 canbe5 canbe7 canbe8 canbe9","Doesn't include removed classes");
	s.answer = 5;
	equals(s.getClass(),"r1 c1 b1 answered answer5","Answered square has special class");
});



/**************/ module("House"); /*******************************************************/

test("instantiation",function(){
	var h = new SS.House("moo");
	ok(h instanceof SS.House,"House is constructor");
	equals(typeof h.candpositions, "object","house contains candpositions array");
	equals(objpropcounter(h.candpositions),9,"candpositions object has one entry per candidate");
	ok(h.candpositions[1] instanceof Array,"each candposition is an array");
	equals(h.id,"moo","house was given id");
	ok($.isArray(h.squares),"house contains squares array");
});

/**************/ module("Board"); /*********************************************/

test("board generation",function(){
	var board = new SS.Board("domid");
	ok(board instanceof SS.Board,"Board is constructor");
	equals(board.selector,"domid","selection property was correctly set");
	equals(typeof board.squares, "object", "Contains square object");
	equals(typeof board.houses, "object", "Contains houses object");
	equals(typeof board.moves, "object", "Contains moves object");
	equals(typeof board.selection, "object", "Contains selection object");
	equals(objpropcounter(board.squares),81,"squares object contains 81 squares");
	equals(objpropcounter(board.houses),27,"houses object contains 27 houses");
	var sqr = board.squares.r1c1, house = board.houses.r1;
	ok(sqr instanceof SS.Square,"squares contains Square instances");
	ok(house instanceof SS.House,"houses contains House instances");
	ok(Array.compare(house.squares,["r1c1","r1c2","r1c3","r1c4","r1c5","r1c6","r1c7","r1c8","r1c9"]),"house has been given correct squares");
	ok(Array.compare(house.squares,house.candpositions[1]),"candpositions are all squares");
	ok(Array.compare(sqr.neighbours,["r1c2","r1c3","r1c4","r1c5","r1c6","r1c7","r1c8","r1c9","r2c1","r3c1","r4c1","r5c1","r6c1","r7c1","r8c1","r9c1","r2c2","r2c3","r3c2","r3c3"]),"square has been given correct neighbours");
});

test("candidate removal",function(){
	var board = new SS.Board("#board"), sqrid = "r5c5", cand = 3, square = board.squares[sqrid], 
		row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box];
	equals(typeof board.blockCandInSquare,"function","Board has blockCandInSquare function");
	ok(Array.locate(sqrid,row.candpositions[cand],sqrid) && Array.locate(sqrid,col.candpositions[cand],sqrid) && Array.locate(sqrid,box.candpositions[cand],sqrid),"square is possible position for cand in all its houses");
	equals(square.candList.cands[cand],1,"square can be cand");
	ok(board.blockCandInSquare(cand,sqrid),"blocking returns true");
	ok(Array.locate(sqrid,row.candpositions[cand],sqrid) == -1 && Array.locate(sqrid,col.candpositions[cand],sqrid) == -1 && Array.locate(sqrid,box.candpositions[cand],sqrid) == -1,"square is removed as candpossibility in all its houses");
	equals(square.candList.cands[cand],0,"square can no longer be cand");
	ok(!board.blockCandInSquare(cand,sqrid),"subsequent removal returns false");
});

test("answering a square",function(){
	var board = new SS.Board("#board"), sqrid = "r5c5", cand = 3, square = board.squares[sqrid], 
		row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box];
	equals(typeof board.answerSquare,"function","Board has answerSquare function");
	ok(board.answerSquare(cand,sqrid),"answering returns true");
	equal(square.answer,cand,"Square is now answered as cand");
	ok(Array.compare(square.candList.cands,[666,0,0,0,0,0,0,0,0,0],"square now has empty candlist"));
});

test("setting a sudoku",function(){
	var b = new SS.Board("#board"),sudoku = "800000000000000000000000000000000000000070000000000000000000000000000000000000001";
	equals(typeof b.set,"function","Board has set function");
	b.set(sudoku);
	equals(b.squares.r1c1.answer,8,"first square was correctly set");
	equals(b.squares.r5c5.answer,7,"middle square was correctly set");
	equals(b.squares.r9c9.answer,1,"last square was correctly set");
});
