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
	equals(typeof SS.CandList,"function","CandList is exposed");
	equals(typeof SS.Square,"function","Square is exposed");
	equals(typeof SS.House,"function","House is exposed");
	equals(typeof SS.Board,"function","Board is exposed");
});

test("contains resources",function(){
	equals(typeof SS.constants,"object","Constant object is exposed");
});

/**************/ module("CandList"); /*******************************************************/

test("instantiation",function(){
	var c = new SS.CandList();
	ok(Array.compare(c.cands,[666,0,0,0,0,0,0,0,0,0]),"defaults to having no blocked candidates");
	equals(c.nbrBlocked,0,"has correct blocked total");
	c = new SS.CandList([666,0,0,0,0,0,0,0,1,1]);
	ok(Array.compare(c.cands,[666,0,0,0,0,0,0,0,1,1]),"can be instantiated with given candidates");
	equals(c.nbrBlocked,2,"has correct blocked total");
});

test("blocking candidate",function(){
	var c = new SS.CandList(), turn = 7, candtoblock = 5;
	equals(typeof c.block,"function","block function exists");
	same(c.block(candtoblock,turn),SS.constants.EXECUTED,"blocking returns confirming value if successful");
	equals(c.cands[candtoblock],turn,"blocked candidate is now set to given turn number");
	same(c.block(candtoblock,turn+1),SS.constants.NOACTION,"blocking a previously blocked cand returns false");
	equals(c.cands[candtoblock],turn,"blocked candidate is still set to the turn where it was first blocked");	
	ok(Array.compare([666,0,0,0,0,turn,0,0,0,0],c.cands),"candidate list is correct, all other cands still 0");
	equals(c.nbrBlocked,1,"blocked counter is updated");
	equals(typeof SS.CandList.block,"function","blocking function also has static counterpart");
	candtoblock = 9;
	equals(SS.CandList.block(c,candtoblock,turn),SS.constants.EXECUTED,"static block also returns number of added cands");
	equals(c.cands[candtoblock],turn,"static block set also set cand to given turn number");
	equals(c.nbrBlocked,2,"static block also updates nbrBlocked");
	equals(c.block(candtoblock,turn,true),SS.constants.REVERTED,"blocking previously blocked cand with TOGGLE flag returns REVERTED value");
	equals(c.cands[candtoblock],0,"cand block was toggled back");
	equals(c.nbrBlocked,1,"toggling also updates nbrBlocked");
	candtoblock = 1;
	c.block(candtoblock,-1);
	same(c.block(candtoblock,turn+1,true),SS.constants.NOACTION,"cannot toggle value set on Sudoku instantiation");
});

test("reverting CandList",function(){
	var c = new SS.CandList();
	c.block(1,10);
	c.block(2,11);
	c.block(3,12);
	c.block(4,13);
	equals(typeof c.revert,"function","revert function exists");
	equals(c.revert(20),false,"revert returns false if no change was made");
	equals(c.revert(11),true,"revert returns true if change was made");
	ok(Array.compare([666,10,11,0,0,0,0,0,0,0],c.cands),"candidate list is now reverted to state at given turn");
	equals(c.nbrBlocked,2,"blockedcount is updated");
	equals(typeof SS.CandList.revert,"function","revert function also has static counterpart");
	equals(SS.CandList.revert(c,10),true,"static revert also returns whether change was made");
	ok(Array.compare([666,10,0,0,0,0,0,0,0,0],c.cands),"static revert also changed candList");
	equals(c.nbrBlocked,1,"static revert also updates nbrCands");
});

/**************/ module("Square"); /*******************************************************/

test("instantiation",function(){
	var s = new SS.Square(5,6);
	ok(s instanceof SS.Square," Square is constructor");
	ok(s.candList instanceof SS.CandList,"Square has a candidatelist");
	ok(Array.compare(s.candList.cands,[666,0,0,0,0,0,0,0,0,0]),"Candlist has no blocks");
	equals(s.row,"r5","Square has row property");
	equals(s.col,"c6","Square has col property");
	equals(s.box,"b5","Square has box property");
	ok($.isArray(s.neighbours),"Square has neighbourids array property");
	equals((new SS.Square(1,3).box),"b1","r1c3 has box b1");
	equals((new SS.Square(6,4).box),"b5","r6c4 has box b5");
	equals((new SS.Square(7,7).box),"b9","r7c7 has box b9");
});

test("blocking candidate in square",function(){
	var s = new SS.Square(1,1);
	equals(typeof s.block,"function","Square has a block function");
	same(s.block(5,6),SS.constants.EXECUTED,"block function returns success");
	equals(s.candList.cands[5],6,"block function updated CandList");
	same(s.block(5,6,true),SS.constants.REVERTED,"blocking same value toggles it back");
	equals(typeof SS.Square.block,"function","block has static counterpart");
	same(SS.Square.block(s,7,8),SS.constants.EXECUTED,"static block also returns success");
	equals(s.candList.cands[7],8,"static block also calls CandList block");
	s.answer(9,666);
	same(SS.Square.block(s,1,667),SS.constants.NOACTION,"blocking candidate in already answered square fails");
});

test("answering square",function(){
	var s = new SS.Square(5,6),candtoanswer = 5, turn = 7;
	equals(typeof s.answer,"function","Square has an answer function");	
	same(s.answer(candtoanswer,turn),SS.constants.EXECUTED,"answer returns success");
	equals(s.answeredCand,candtoanswer,"answeredCand now set to correct candidate");
	equals(s.answeredTurn,turn,"answeredTurn now set to correct turn");
	same(s.answer(candtoanswer,turn),SS.constants.NOACTION,"subsequent answers same turn fail");
	same(s.answer(candtoanswer+1,turn+1),SS.constants.NOACTION,"subsequent answers later fail");
	same(s.answer(candtoanswer+1,turn+1),SS.constants.NOACTION,"subsequent answers later fail");
	same(s.block(candtoanswer-1,turn),SS.constants.NOACTION,"subsequent blocks after answer same turn fail");
	same(s.block(candtoanswer+2,turn+2),SS.constants.NOACTION,"subsequent blocks after answer later fail");
	s = new SS.Square(3,2);
	s.block(candtoanswer,1);
	same(s.answer(candtoanswer,2),SS.constants.NOACTION,"answering a blocked cand fails");
	ok(!s.answeredCand,"square remains unanswered");
	same(s.answer(candtoanswer+1,turn+1,true),SS.constants.EXECUTED,"answering with toggle flag works like normal if not previously answered");
	same(s.answer(candtoanswer+1,turn+1,true),SS.constants.REVERTED,"new attempt to answer with toggle flag reverts to unanswered state");
	same(s.answeredCand,undefined,"square no longer has answeredCand");
	same(s.answeredTurn,0,"square no longer has answeredTurn");
	same(SS.Square.answer(s,candtoanswer,-1,true),SS.constants.EXECUTED,"answering with static function and toggle also works like normal");
	same(SS.Square.answer(s,candtoanswer,-1,true),SS.constants.NOACTION,"cannot toggle back answer from first turn");
});

test("reverting square",function(){
	var s = new SS.Square(5,6);
	equals(typeof s.revert,"function","Square has a revert function");
	s.block(1,10);
	s.block(2,11);
	s.block(3,12);
	s.answer(4,13);
	equals(s.revert(20),false,"Reverting returns false if no change was made");
	equals(s.revert(11),true,"Reverting returns true if no change was made");
	ok(!s.answeredCand,"Square is no longer answered");
	ok(Array.compare([666,10,11,0,0,0,0,0,0,0],s.candList.cands),"candList of Square was reverted too");
});

test("classname generation",function(){
	var s = new SS.Square(1,1);
	equals(typeof s.getClass,"function","Square has a getClass function");
	equals(s.getClass(),"r1 c1 b1 canbe1 canbe2 canbe3 canbe4 canbe5 canbe6 canbe7 canbe8 canbe9","Starts with 'full' classname");
	s.candList.block(6,777);
	equals(s.getClass(),"r1 c1 b1 canbe1 canbe2 canbe3 canbe4 canbe5 canbe7 canbe8 canbe9","Doesn't include removed classes");
	s.answeredCand = 5;
	equals(s.getClass(),"r1 c1 b1 answered answer5","Answered square has special class");
});



/**************/ module("House"); /*******************************************************/

test("instantiation",function(){
	var h = new SS.House("moo");
	ok(h instanceof SS.House,"House is constructor");
	equals(typeof h.candPositions, "object","house contains candPositions array");
	equals(objpropcounter(h.candPositions),9,"candPositions object has one entry per candidate");
	ok(h.candPositions[1] instanceof Object,"each candposition is an object");
	equals(h.id,"moo","house was given id");
	ok($.isArray(h.squares),"house contains squares array");
	ok(h.answeredCands instanceof SS.CandList,"house contains CandList to track answered cands in house");
	ok(h.answerPositions instanceof Array,"house has array for answered cand squares");
});

test("adding a square to house",function(){
	var h = new SS.House("moo");
	equals(typeof h.add, "function","house has add square function");
	h.add("r1c1");
	h.add("r2c2");
	ok(Array.compare(h.squares,["r1c1","r2c2"]),"square was added to squares array");
	for (var i = 1; i <= 9; i++) {
		ok(h.candPositions[i].r1c1 === 0 && h.candPositions[i].r2c2 === 0, "cand " + i + " has 0-entry for all added squares");
	}
});

test("blocking candidate in house",function(){
	var h = new SS.House(),sqrid="r1c1",cand = 5, turn = 15;
	h.add(sqrid);
	equals(typeof h.block,"function","House has a block function");
	same(h.block(cand,turn,sqrid),SS.constants.EXECUTED,"block function returns success if wasn't previously blocked in the house");
	same(h.block(cand,turn,sqrid),SS.constants.NOACTION,"block function returns noaction if was previously blocked same turn");
	same(h.block(cand,turn+1,sqrid),SS.constants.NOACTION,"block function returns noaction if was previously blocked earlier turn");
	equals(h.candPositions[cand][sqrid],turn,"Square is now marked as blocked for that candidate at that turn");	
	equals(typeof SS.House.block,"function","block has static counterpart");
	sqrid = "r2c2";
	h.add("r2c2");
	same(SS.House.block(h,cand,turn,sqrid),SS.constants.EXECUTED,"static block also returns success");
	equals(h.candPositions[cand][sqrid],turn,"Static block also marked square as blocked for that candidate at that turn");
	same(SS.House.block(h,cand,turn,sqrid,true),SS.constants.REVERTED,"block reverts previous block if toggle flag is true");
	same(SS.House.block(h,cand+1,-1,sqrid,true),SS.constants.EXECUTED,"will block as normal with toggle flag set to true if not previously blocked");
	same(SS.House.block(h,cand+1,-1,sqrid,true),SS.constants.NOACTION,"cannot revert block done when sudoku was set (turn -1)");
	equals(h.candPositions[cand+1][sqrid],-1,"First turn block is unaffected");
});

test("answering cand in house",function(){
	var h = new SS.House(),sqrid="r1c1",othersqrid="r2c2",cand = 5, othercand = 7, turn = 15;
	equals(typeof h.answer,"function","House has an answer function");	
	same(h.answer(cand,turn,sqrid),SS.constants.EXECUTED,"answer returns true if successful");
	equals(h.answerPositions[cand],sqrid,"square now registered as answerpos for that cand");
	equals(h.answeredCands[cand],turn,"answeredCands now set to correct turn for that candidate");
	equals(h.answer(cand,turn,othersqrid),SS.constants.NOACTION,"subsequent answers of same cand in other square return false");
	equals(h.answer(othercand,turn,sqrid),SS.constants.NOACTION,"subsequent answers of other cand in same square return false");
	h.block(othercand,turn,othersqrid);
	equals(h.answer(othercand,turn+1,othersqrid),SS.constants.NOACTION,"answering cand in square thats already blocked returns false");
	equals(typeof SS.House.answer,"function","House has static answer function too");
	same(h.answer(cand,turn,sqrid,true),SS.constants.REVERTED,"if toggle is true, previous answer is reverted");
	same(h.answeredCands[cand],0,"cand no longer has answerturn");
	ok(!h.answerPositions[cand],"cand no longer has answerposition");
	same(SS.House.answer(h,cand,-1,sqrid,true),SS.constants.EXECUTED,"answering cand with toggle=true works as normal for nonextisting answer");
	equals(h.answeredCands[cand],-1,"answeredCands now set to correct turn for that candidate");	
	same(SS.House.answer(h,cand,-1,sqrid,true),SS.constants.NOACTION,"answers made on the first turn cannot be reverted");
});

test("reverting house",function(){
	var h = new SS.House(),sqrid="r1c1",othersqrid="r2c2", cand = 5, othercand = 7, turn = 15;
	equals(typeof h.revert,"function","Square has a revert function");
	h.block(cand,turn-1,sqrid);
	h.block(othercand,turn+1,othersqrid);
	h.answer(othercand,turn+2,sqrid);
	h.answer(cand,turn+3,othersqrid);
	equals(h.revert(turn+5),false,"Reverting returns false if no change was made");
	equals(h.revert(turn),true,"Reverting returns true if change was made");
	ok(!h.answerPositions[cand],"cand no longer has answerposition");
	ok(!h.answerPositions[othercand],"othercand no longer has answerposition");
	equals(h.candPositions[cand][sqrid],turn-1,"cand is still blocked in square");
	equals(h.candPositions[othercand][othersqrid],0,"othercand is no longer blocked in othersquare");
	equals(typeof SS.House.revert,"function","House has static revert function too");
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
	ok(Array.compare(sqr.neighbours,["r1c2","r1c3","r1c4","r1c5","r1c6","r1c7","r1c8","r1c9","r2c1","r3c1","r4c1","r5c1","r6c1","r7c1","r8c1","r9c1","r2c2","r2c3","r3c2","r3c3"]),"square has been given correct neighbours");
	var error = false;
	for(var s in house.squares){
		for (var i = 1; i<=9; i++){
        	if (house.candPositions[i][house.squares[s]] !== 0){
				error = true;
			}
		}
	}
	ok(!error,"all candPositions has 0 for all squares");
});

test("candidate blocking",function(){
	var board = new SS.Board("#board"), sqrid = "r5c5", cand = 3, square = board.squares[sqrid], 
		row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box],
		turn = 666;
	board.currentTurn = turn;
	equals(typeof board.blockCandInSquare,"function","Board has blockCandInSquare function");
	ok(!row.candPositions[cand][sqrid] && !col.candPositions[cand][sqrid] && !box.candPositions[cand][sqrid],"square is possible position for cand in all its houses");
	ok(board.blockCandInSquare(cand,sqrid),"blocking returns true");
	equals(row.candPositions[cand][sqrid],turn,"square is blocked at this turn in its row");
	equals(col.candPositions[cand][sqrid],turn,"square is blocked at this turn in its col");
	equals(box.candPositions[cand][sqrid],turn,"square is blocked at this turn in its box");
	ok(!board.blockCandInSquare(cand,sqrid),"subsequent removal returns false");
	equals(typeof SS.Board.blockCandInSquare,"function","There is static version of blockCandInSquare function");	
});

test("answering a square",function(){
	var board = new SS.Board("#board"), sqrid = "r5c5", cand = 3, square = board.squares[sqrid], 
		row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box];
	equals(typeof board.answerSquare,"function","Board has answerSquare function");
	ok(board.answerSquare(cand,sqrid),"answering returns true");
	equal(square.answeredCand,cand,"Square is now answered as cand");
	ok(Array.compare(square.candList.cands,[666,0,0,0,0,0,0,0,0,0],"square now has empty candlist"));
});

test("setting a sudoku",function(){
	var b = new SS.Board("#board"),sudoku = "800000000000000000000000000000000000000070000000000000000000000000000000000000001";
	equals(typeof b.set,"function","Board has set function");
	equals(b.currentTurn,-1,"Turn is -1 to begin");
	b.set(sudoku);
	equals(b.currentTurn,1,"Turn is 1 after setting of sudoku");
	equals(b.squares.r1c1.answeredCand,8,"first square was correctly set");
	equals(b.squares.r5c5.answeredCand,7,"middle square was correctly set");
	equals(b.squares.r9c9.answeredCand,1,"last square was correctly set");
	equals(b.squares.r1c1.answeredTurn,-1,"first square answerTurn is -1");
	equals(b.squares.r5c5.answeredTurn,-1,"middle square answerTurn is -1");
	equals(b.squares.r9c9.answeredTurn,-1,"last square answerTurn is -1");
});
