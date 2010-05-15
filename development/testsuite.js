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
	ok(!Array.compare([1,2,3],[4,5,6]),"should return false if differenet members");
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

/**************/ module("BlockList"); /*******************************************************/

var BlockList = SS.BlockList;

test("instantiation",function(){
	var b = new BlockList();
	ok(b instanceof BlockList,"BlockList is constructor");
	for (var i = 1; i <= 9; i++) {
		same(BlockList.get(b, i), 0, "Has item "+i+" set as 0");
	}
	equals(b.list.length,9,"has all listed as remaining");
	var squares = ["r1c1","r1c2","r1c3"];
	b = new BlockList(squares);
	for (i = 0; i < squares.length; i++) {
		same(BlockList.get(b, squares[i]), 0, "Has item "+squares[i]+" set as 0");
	}
});

test("adding block",function(){
	var b = new BlockList(), turn = 7, candtoblock = 5;
	equals(typeof BlockList.add,"function","add block function exists");
	same(BlockList.is(b,candtoblock),false,"candtoblock is false at first");
	same(BlockList.add(b,{
		k: candtoblock,
		t: turn
	}),true,"blocking returns true value if successful");
	same(BlockList.is(b,candtoblock),true,"candtoblock is true after block");
	same(BlockList.get(b,candtoblock),turn,"blocked candidate is now set to given turn number");
	same(BlockList.add(b,{
		k: candtoblock,
		t: turn + 1
	}),false,"blocking a previously blocked cand returns false");
	same(BlockList.get(b,candtoblock),turn,"blocked candidate is still set to the turn where it was first blocked");
	same(b.list.length,8,"list now has only 8 members listed as unblocked");
	same(Array.locate(candtoblock,b.list),-1,"list now doesn't contain 8");
});

test("reverting BlockList",function(){
	var b = new BlockList();
	BlockList.add(b,{
		k: 1,
		t: 10
	});
	BlockList.add(b,{
		k: 2,
		t: 11
	});
	BlockList.add(b,{
		k: 3,
		t: 12
	});
	BlockList.add(b,{
		k: 4,
		t: 13
	});
	equals(typeof BlockList.revert,"function","revert function exists");
	BlockList.revert(b,11);
	same(b.list.length,7,"reverting restored list to given turn");
	same(BlockList.get(b,4),0,"4 is no longer set");
	same(BlockList.get(b,3),0,"3 is no longer set");
	same(BlockList.get(b,2),11,"2 is still set");
	same(BlockList.get(b,1),10,"1 is still set");
	same(Array.locate(1,b.list),-1,"unblocked list doesn't contain 1");
	same(Array.locate(2,b.list),-1,"unblocked list doesn't contain 2");
	ok(Array.locate(3,b.list)>-1,"unblocked list now contains 3");
	ok(Array.locate(4,b.list)>-1,"unblocked list now contains 4");
});

test("removing block in BlockList",function(){
	var b = new BlockList(), turn = 7, candtoblock = 5;
	equals(typeof BlockList.remove,"function","remove block function exists");
	ok(BlockList.add(b,candtoblock,turn),"Block is added before removal");
	BlockList.remove(b,candtoblock);
	same(BlockList.get(b,candtoblock),0,"Candidate is no longer blocked");
	ok(Array.locate(candtoblock,b.list)>-1,"unblocked list now contains candidate");
});

test("testing item in BlockList",function(){
	var b = new BlockList(), turn = 7, candtoblock = 5;
	equals(typeof BlockList.is,"function","testing function exists (is)");
	same(BlockList.is(b,candtoblock),false,"test returns false before block");
	BlockList.add(b,{
		k: candtoblock,
		t: turn
	});
	same(BlockList.is(b,candtoblock),true,"test returns true after block");	
	BlockList.remove(b,candtoblock);
	same(BlockList.is(b,candtoblock),false,"test returns false after removal of block");
});



/**************/ module("AnswerList"); /*******************************************************/

var AnswerList = SS.AnswerList;

test("instantiation",function(){
	var a = new AnswerList();
	ok(a instanceof AnswerList,"AnswerList is constructor");
	for (var i = 1; i <= 9; i++) {
		var item = AnswerList.get(a, i);
		ok(item instanceof Object, "Item "+i+" is an object");
		same(item.t,0,"item "+i+" has turn set to 0");
		same(item.p,0,"item "+i+" has position set to 0");
	}
	equals(a.list.length,9,"has all listed as unanswered");
});

test("adding answer",function(){
	var a = new AnswerList(), turn = 7, candtoanswer = 5, position = "r1c1";
	equals(typeof AnswerList.add,"function","add answer function exists");
	same(AnswerList.add(a,{
		k: candtoanswer,
		t: turn,
		p: position
	}),true,"answering returns true if successful");
	var item = AnswerList.get(a,candtoanswer);
	ok(item instanceof Object, "Item "+candtoanswer+" is an object");
	same(item.t,turn,"item has turn set to turn");
	same(item.p,position,"item has position set to position");
	same(AnswerList.add(a,{
		k: candtoanswer,
		t: turn + 1,
		p: position
	}),false,"answering a previously answered cand returns false");
	same(AnswerList.get(a,candtoanswer).t,turn,"answered candidate is still set to the turn where it was first answered");
	same(a.list.length,8,"list now has only 8 members listed as unanswered");
	same(Array.locate(candtoanswer,a.list),-1,"list now doesn't contain candtoanswer");
});

test("reverting AnswerList",function(){
	var a = new AnswerList();
	AnswerList.add(a,{
		k: 1,
		t: 10,
		p: "p1"
	});
	AnswerList.add(a,{
		k: 2,
		t: 11,
		p: "p2"
	});
	AnswerList.add(a,{
		k: 3,
		t: 12,
		p: "p3"
	});
	AnswerList.add(a,{
		k: 4,
		t: 13,
		p: "p4"
	});
	equals(typeof AnswerList.revert,"function","revert function exists");
	AnswerList.revert(a,11);
	same(a.list.length,7,"reverting restored list to given turn");
	same(AnswerList.get(a,4).t,0,"4 is no longer set");
	same(AnswerList.get(a,3).t,0,"3 is no longer set");
	same(AnswerList.get(a,2).t,11,"2 is still set");
	same(AnswerList.get(a,1).t,10,"1 is still set");
	same(Array.locate(1,a.list),-1,"unanswered list doesn't contain 1");
	same(Array.locate(2,a.list),-1,"unanswered list doesn't contain 2");
	ok(Array.locate(3,a.list)>-1,"unanswered list now contains 3");
	ok(Array.locate(4,a.list)>-1,"unanswered list now contains 4");
});

test("removing answer in AnswerList",function(){
	var a = new AnswerList(), turn = 7, candtoanswer = 5;
	equals(typeof AnswerList.remove,"function","remove answer function exists");
	ok(AnswerList.add(a,{
		k: candtoanswer,
		t: turn
	}),"Answer is added before removal");
	AnswerList.remove(a,candtoanswer);
	same(AnswerList.get(a,candtoanswer).t,0,"Candidate is no longer answered at turn");
	same(AnswerList.get(a,candtoanswer).p,0,"Candidate is no longer answered at position");
	ok(Array.locate(candtoanswer,a.list)>-1,"unanswered list now contains candidate");
});




/**************/ module("PositionList"); /*******************************************************/

var PositionList = SS.PositionList;

test("instantiation",function(){
	var squares = ["r1c1","r1c2","r1c3"]; p = new PositionList(squares);
	ok(p instanceof PositionList,"PositionList is constructor");
	console.log(p);
	for (var i = 1; i <= 9; i++) {
		var item = PositionList.get(p, i);
		ok(item instanceof BlockList, "Item "+i+" is a BlockList");
		same(item.items[squares[0]],0, "Item "+i+" has r1c1 item");
		same(item.list.length, squares.length, "Item "+i+" has all listed");
	}
	equals(p.list.length,0,"has no candidates as available");
});

test("adding positionblock",function(){
	var squares = ["r1c1","r1c2","r1c3"], p = new PositionList(squares), turn = 7, candtoanswer = 5, position = "r1c1";
	equals(typeof PositionList.add,"function","add positionblock function exists");
	same(PositionList.add(p,{
		k: candtoanswer,
		t: turn,
		p: position
	}),true,"adding positionblock returns true if successful");
	var bl = PositionList.get(p,candtoanswer);
	same(BlockList.get(bl,position),turn,"Cand is now blocked in that position in that turn.");
	same(PositionList.add(p,{
		k: candtoanswer,
		t: turn + 1,
		p: position
	}),false,"answering a previously answered cand returns false");
	same(BlockList.get(bl,position),turn,"answered candidate is still set to the turn where it was first answered");
	same(p.list.length,0,"list of givens still is empty");
	PositionList.add(p,{
		k: candtoanswer,
		t: turn,
		p: "r1c2"
	});
	ok(Array.locate(candtoanswer,p.list)>-1,"list now doesn't contain candtoanswer");
});

test("reverting PositionList",function(){
	var cand = 1, squares = ["r1c1","r1c2","r1c3"], p = new PositionList(squares);
	PositionList.add(p,{
		k: cand,
		t: 10,
		p: "p1"
	});
	PositionList.add(p,{
		k: cand,
		t: 11,
		p: "p2"
	});
	PositionList.add(p,{
		k: cand,
		t: 12,
		p: "p3"
	});
	PositionList.add(p,{
		k: cand,
		t: 13,
		p: "p4"
	});
	PositionList.add(p,{
		k: cand+1,
		t: 10,
		p: "p4"
	});
	equals(typeof PositionList.revert,"function","revert function exists");
	PositionList.revert(p,11);
	
	var bl = PositionList.get(p,cand);
	same(BlockList.get(bl,"p1"),10,"Cand is blocked in p1");
	same(BlockList.get(bl,"p2"),11,"Cand is blocked in p2");
	same(BlockList.get(bl,"p3"),0,"Cand is no longer blocked in p3");
	same(BlockList.get(bl,"p4"),0,"Cand is no longer blocked in p4");
	same(BlockList.get(PositionList.get(p,cand+1),"p4"),10,"Othercand is still blocked in p4");
});

test("removing answer in PositionList",function(){
	var squares = ["r1c1","r1c2","r1c3"], p = new PositionList(undefined,squares), turn = 7, candtoanswer = 5, position = "r1c1";
	equals(typeof PositionList.remove,"function","remove positionblock function exists");
	same(PositionList.add(p,{
		t: turn,
		p: position,
		k: candtoanswer
	}),true,"adding was successful");
	PositionList.remove(p,{
		t: turn,
		p: position,
		k: candtoanswer
	});
	var bl = PositionList.get(p,candtoanswer);
	same(BlockList.get(bl,position),0,"Cand is no longer blocked in that position in that turn.");
});




/**************/ module("Square"); /*******************************************************/

var Square = SS.Square;

test("instantiation",function(){
	var s = new SS.Square(5,6);
	ok(s instanceof SS.Square," Square is constructor");
	ok(s.candBlocks instanceof BlockList,"Square has a candidatelist");
	same(s.candBlocks.list.length,9,"Candlist has 9 remaining");
	ok(s.rowBlocks instanceof BlockList,"Square has a rowBlocks");
	same(s.rowBlocks.list.length,9,"RowBlocks has 9 remaining");
	ok(s.colBlocks instanceof BlockList,"Square has a colBlocks");
	same(s.colBlocks.list.length,9,"colBlocks has 9 remaining");
	ok(s.boxBlocks instanceof BlockList,"Square has a boxBlocks");
	same(s.boxBlocks.list.length,9,"boxBlocks has 9 remaining");
	ok(s.manBlocks instanceof BlockList,"Square has a manBlocks");
	same(s.manBlocks.list.length,9,"manBlocks has 9 remaining");
	equals(s.row,"r5","Square has row property");
	equals(s.col,"c6","Square has col property");
	equals(s.box,"b5","Square has box property");
	same(s.neighbours.prototype,[].prototype,"Square has neighbourids array property");
	equals((new Square(1,3).box),"b1","r1c3 has box b1");
	equals((new Square(6,4).box),"b5","r6c4 has box b5");
	equals((new Square(7,7).box),"b9","r7c7 has box b9");
	same(s.answeredCand,0,"new square has answeredCand 0");
	same(s.answeredTurn,0,"new square has answeredTurn 0");
});

test("blocking candidate in square",function(){
	var s = new Square(1,1), cand = 5, turn = 6;
	equals(typeof Square.block,"function","Square has a block function");
	same(Square.block(s,cand,turn,SS.constants.ROW),true,"block function returns success");
	same(BlockList.is(s.rowBlocks,cand),true,"rowBlocks now is blocked");
	same(s.rowBlocks.list.length,8,"rowBlocks now lists 8 remaining");
	same(BlockList.is(s.candBlocks,cand),true,"candBlocks list now also has block for cand");
	same(Square.isblocked(s,cand),true,"isblocked now returns true for that cand");
	same(s.candBlocks.list.length,8,"candBlocks also now lists 8 remaining");
	same(Square.block(s,cand,turn+1,SS.constants.ROW),false,"trying to block same again fails");
/*
	equals(s.candBlocks.cands[cand],1,"block function updated main BlockList in square");
	equals(s.rowBlocks.cands[cand],turn,"block function updated rowBlocks list");
	ok(!(s.colBlocks.cands[cand] || s.boxBlocks.cands[cand] || s.manBlocks.cands[cand]),"other lists was unaffected");
	same(s.block(cand,turn+1,SS.constants.COL),SS.constants.ADDED,"blocking same cand in other targetlist returns added even though it was already blocked in other list");
	equals(s.candBlocks.nbrBlocked,1,"main count is still 1 as same cand was blocked");
	equals(s.candBlocks.cands[cand],2,"main list is now two for that cand");
	equals(s.colBlocks.cands[cand],turn+1,"block function updated colBlocks list");
	equals(SS.Square.block(s,cand,turn,SS.constants.ROW,SS.constants.REMOVE),SS.constants.REMOVED,"removing block returns REMOVED");
	equals(s.candBlocks.nbrBlocked,1,"removing updated blockcount");
	equals(s.candBlocks.cands[cand],1,"removing updates main block count");
	equals(SS.Square.block(s,cand,turn,SS.constants.COL,SS.constants.TOGGLE),SS.constants.REMOVED,"toggling existing block away returns REMOVED since that cand no longer blocked");
	equals(s.candBlocks.cands[cand],0,"toggling away updates main block count");
	equals(SS.Square.block(s,cand,-1,SS.constants.COL,SS.constants.REMOVE),SS.constants.NOACTION,"removing nonexisting block returns NOACTION");
	equals(SS.Square.block(s,cand,-1,SS.constants.COL,SS.constants.TOGGLE),SS.constants.ADDED,"toggling nonexisting block returns ADDED");
	equals(SS.Square.block(s,cand,turn,SS.constants.COL,SS.constants.TOGGLE),SS.constants.NOACTION,"toggling block from first turn fails");
	equals(SS.Square.block(s,cand,turn,SS.constants.COL,SS.constants.REMOVE),SS.constants.NOACTION,"removing block from first turn fails");	
	ok(!(s.boxBlocks.cands[cand] || s.manBlocks.cands[cand]),"other lists was unaffected");
	s.answeredCand = 1;
	same(SS.Square.block(s,cand,turn,SS.constants.BOX,SS.constants.ADD),SS.constants.NOACTION,"blocking candidate in already answered square fails");
*/
});

test("unblocking candidate in square",function(){
	var s = new Square(1,1), cand = 5, turn = 6;	
	equals(typeof Square.unblock,"function","Square has an unblock function");
	same(Square.unblock(s,cand,SS.constants.ROW),false,"unblocking never blocked cand returns false");
	ok(Square.block(s,cand,turn,SS.constants.ROW),"blocking row worked");
	ok(Square.block(s,cand,turn,SS.constants.COL),"blocking col worked");
	same(BlockList.is(s.rowBlocks,cand),true,"rowBlocks now is blocked");
	same(BlockList.is(s.colBlocks,cand),true,"colBlocks now is blocked");
	ok(Square.isblocked(s,cand),"Square is now blocked");
	same(Square.unblock(s,cand,SS.constants.ROW),false,"unblocking previously blocked cand returns false if other blocks remain");
	same(Square.unblock(s,cand,SS.constants.COL),true,"unblocking previously blocked cand returns true cand now unblocked in square");
});

test("answering square",function(){
	var s = new SS.Square(5,6),candtoanswer = 5, turn = 7;
	equals(typeof s.answer,"function","Square has an answer function");	
	same(s.answer(candtoanswer,turn),SS.constants.ADDED,"answer returns success");
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
	same(s.answer(candtoanswer+1,turn+1,true),SS.constants.ADDED,"answering with toggle flag works like normal if not previously answered");
	same(s.answer(candtoanswer+1,turn+1,true),SS.constants.REMOVED,"new attempt to answer with toggle flag reverts to unanswered state");
	same(s.answeredCand,0,"square no longer has answeredCand");
	same(s.answeredTurn,0,"square no longer has answeredTurn");
	s = new SS.Square(3,2);
	same(SS.Square.answer(s,candtoanswer,-1,true),SS.constants.ADDED,"answering with static function and toggle also works like normal");
	same(SS.Square.answer(s,candtoanswer,-1,true),SS.constants.NOACTION,"cannot toggle back answer from first turn");
});

test("reverting square",function(){
	var s = new SS.Square(5,6);
	equals(typeof s.revert,"function","Square has a revert function");
	s.block(1,10,SS.constants.ROW);
	s.block(2,11,SS.constants.COL);
	s.block(3,12,SS.constants.BOX);
//	s.answer(4,13);
	s.revert(11);
	ok(!s.answeredCand,"Square is no longer answered");
	console.log("after revert",s);
	ok(Array.compare([666,1,1,0,0,0,0,0,0,0],s.candBlocks.cands),"candList of Square was reverted too");
	equal(s.candBlocks.nbrBlocked,2,"reverting updated blockCount");
});

test("classname generation",function(){
	var s = new Square(1,1);
	equals(typeof Square.getClass,"function","Square has a getClass function");
	equals(Square.getClass(s),"r1 c1 b1 canbe1 canbe2 canbe3 canbe4 canbe5 canbe6 canbe7 canbe8 canbe9","Starts with 'full' classname");
	s.candBlocks.block(6,777);
	equals(Square.getClass(s),"r1 c1 b1 canbe1 canbe2 canbe3 canbe4 canbe5 canbe7 canbe8 canbe9","Doesn't include removed classes");
	s.answeredCand = 5;
	equals(Square.getClass(s),"r1 c1 b1 answered answer5","Answered square has special class");
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
	same(h.block(cand,turn,sqrid),SS.constants.ADDED,"block function returns success if wasn't previously blocked in the house");
	same(h.block(cand,turn,sqrid),SS.constants.NOACTION,"block function returns noaction if was previously blocked same turn");
	same(h.block(cand,turn+1,sqrid),SS.constants.NOACTION,"block function returns noaction if was previously blocked earlier turn");
	equals(h.candPositions[cand][sqrid],turn,"Square is now marked as blocked for that candidate at that turn");	
	equals(typeof SS.House.block,"function","block has static counterpart");
	sqrid = "r2c2";
	h.add("r2c2");
	same(SS.House.block(h,cand,turn,sqrid),SS.constants.ADDED,"static block also returns success");
	equals(h.candPositions[cand][sqrid],turn,"Static block also marked square as blocked for that candidate at that turn");
	same(SS.House.block(h,cand,turn,sqrid,true),SS.constants.REMOVED,"block reverts previous block if toggle flag is true");
	same(SS.House.block(h,cand+1,-1,sqrid,true),SS.constants.ADDED,"will block as normal with toggle flag set to true if not previously blocked");
	same(SS.House.block(h,cand+1,-1,sqrid,true),SS.constants.NOACTION,"cannot revert block done when sudoku was set (turn -1)");
	equals(h.candPositions[cand+1][sqrid],-1,"First turn block is unaffected");
});

test("answering cand in house",function(){
	var h = new SS.House(),sqrid="r1c1",othersqrid="r2c2",cand = 5, othercand = 7, turn = 15;
	equals(typeof h.answer,"function","House has an answer function");	
	same(h.answer(cand,turn,sqrid),SS.constants.ADDED,"answer returns true if successful");
	equals(h.answerPositions[cand],sqrid,"square now registered as answerpos for that cand");
	equals(h.answeredCands[cand],turn,"answeredCands now set to correct turn for that candidate");
	equals(h.answer(cand,turn,othersqrid),SS.constants.NOACTION,"subsequent answers of same cand in other square return false");
	equals(h.answer(othercand,turn,sqrid),SS.constants.NOACTION,"subsequent answers of other cand in same square return false");
	h.block(othercand,turn,othersqrid);
	equals(h.answer(othercand,turn+1,othersqrid),SS.constants.NOACTION,"answering cand in square thats already blocked returns false");
	equals(typeof SS.House.answer,"function","House has static answer function too");
	same(h.answer(cand,turn,sqrid,true),SS.constants.REMOVED,"if toggle is true, previous answer is reverted");
	same(h.answeredCands[cand],0,"cand no longer has answerturn");
	equals(h.answerPositions[cand],0,"cand no longer has answerposition");
	same(SS.House.answer(h,cand,-1,sqrid,true),SS.constants.ADDED,"answering cand with toggle=true works as normal for nonextisting answer");
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
	same(h.answerPositions[cand],0,"cand no longer has answerposition");
	same(h.answerPositions[othercand],0,"othercand no longer has answerposition");
	equals(h.candPositions[cand][sqrid],turn-1,"cand is still blocked in square");
	equals(h.candPositions[othercand][othersqrid],0,"othercand is no longer blocked in othersquare");
	equals(typeof SS.House.revert,"function","House has static revert function too");
});


/**************/ module("Board"); /*********************************************/

test("board generation",function(){
	var board = new SS.Board("domid",false);
	ok(board instanceof SS.Board,"Board is constructor");
	equals(board.selector,"domid","selection property was correctly set");
	same(board.free,false,"freemode property was correctly set to false");
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
	board = new SS.Board("someid",true);
	same(board.free,true,"freemode property was correctly set to true");	
});

test("candidate blocking",function(){
	var board = new SS.Board("#board"), sqrid = "r5c5", cand = 3, square = board.squares[sqrid], 
		row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box],
		turn = 666;
	board.currentTurn = turn;
	equals(typeof board.blockCandInSquare,"function","Board has blockCandInSquare function");
	ok(!row.candPositions[cand][sqrid] && !col.candPositions[cand][sqrid] && !box.candPositions[cand][sqrid],"square is possible position for cand in all its houses");
	same(board.blockCandInSquare(cand,sqrid),SS.constants.ADDED,"blocking returns success");
	same(board.blockCandInSquare(cand,sqrid),SS.constants.NOACTION,"repeated blocking fails");
	equals(row.candPositions[cand][sqrid],turn,"square is blocked at this turn in its row");
	equals(col.candPositions[cand][sqrid],turn,"square is blocked at this turn in its col");
	equals(box.candPositions[cand][sqrid],turn,"square is blocked at this turn in its box");
	same(board.blockCandInSquare(cand,sqrid),SS.constants.NOACTION,"subsequent removal returns false");
	equals(typeof SS.Board.blockCandInSquare,"function","There is static version of blockCandInSquare function");
	board.free = true;
	same(SS.Board.blockCandInSquare(board,cand,sqrid),SS.constants.REMOVED,"Blocking is reverted if board is in freemode");
	same(row.candPositions[cand][sqrid],0,"square is no longer blocked at this turn in its row");
	same(col.candPositions[cand][sqrid],0,"square is blocked at this turn in its col");
	same(box.candPositions[cand][sqrid],0,"square is blocked at this turn in its box");
});

test("answering a square",function(){
	var board = new SS.Board("#board"), sqrid = "r5c5", cand = 3, square = board.squares[sqrid], 
		row = board.houses[square.row], col = board.houses[square.col], box = board.houses[square.box], turn = 666;
	board.currentTurn = turn;
	equals(typeof board.answerSquare,"function","Board has answerSquare function");
	same(board.answerSquare(cand,sqrid),SS.constants.ADDED,"answering returns success");
	equal(square.answeredCand,cand,"Square is now answered as cand");
	equal(square.answeredTurn,turn,"Square is answered in this turn");
	equal(row.answeredCands[cand],turn,"Row has turn as answeredTurn for cand");
	equal(row.answerPositions[cand],sqrid,"Row has sqrid as answerPosition for cand");
	equal(col.answeredCands[cand],turn,"Col has turn as answeredTurn for cand");
	equal(col.answerPositions[cand],sqrid,"Col has sqrid as answerPosition for cand");
	equal(box.answeredCands[cand],turn,"Box has turn as answeredTurn for cand");
	equal(box.answerPositions[cand],sqrid,"Box has sqrid as answerPosition for cand");
	equals(typeof SS.Board.answerSquare,"function","Board has static answerSquare function");
	same(SS.Board.answerSquare(board,cand,sqrid),SS.constants.NOACTION,"subsequent answer returns noaction");
	board.free = true;
	same(SS.Board.answerSquare(board,cand,sqrid),SS.constants.REMOVED,"subsequent answer in freemode means reversal");
	equal(square.answeredCand,0,"Square is no longer answered as cand");
	equal(square.answeredTurn,0,"Square no longer has answeredTurn");
	equal(row.answeredCands[cand],0,"Row no longer has turn as answeredTurn for cand");
	equal(row.answerPositions[cand],0,"Row no longer has sqrid as answerPosition for cand");
	equal(col.answeredCands[cand],0,"Col no longer has turn as answeredTurn for cand");
	equal(col.answerPositions[cand],0,"Col no longer has sqrid as answerPosition for cand");
	equal(box.answeredCands[cand],0,"Box no longer has turn as answeredTurn for cand");
	equal(box.answerPositions[cand],0,"Box no longer has sqrid as answerPosition for cand");
	equals(typeof SS.Board.answerSquare,"function","Board has static answerSquare function");
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
