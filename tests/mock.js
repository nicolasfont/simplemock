module("mock");

test("mockShouldReturnUndefinedWhenReturnNotCalled", function() {
	var m = mock();

	strictEqual(m(), undefined, "returns undefined");
});

test("mockShouldReturnExpectedValue", function() {
	var m = mock();

	m.return("hello world");

	strictEqual(m(), "hello world", "returns hello world");
});

test("mockShouldReturnDifferentValuesWhenCalledTwice", function() {
	var m = mock();

	m.return("hello");
	m.return("world");

	strictEqual(m(), "hello", "returns hello");
	strictEqual(m(), "world", "returns world");
});

test("mockShouldReturnSameValuesWhenCalledMoreThanTwice", function() {
	var m = mock();

	m.return("hello");
	m.return("world");

	strictEqual(m(), "hello", "returns hello");
	strictEqual(m(), "world", "returns world");
	strictEqual(m(), "world", "returns world");
});

test("mockShouldReturnSameValueTwoTimes", function() {
	var m = mock();

	m.return("hello", 2);
	m.return("world");

	strictEqual(m(), "hello", "returns hello");
	strictEqual(m(), "hello", "returns world");
	strictEqual(m(), "world", "returns world");
});

test("mockShouldReturnUndefinedWhenZeroTimes", function() {
	var m = mock();

	m.return("hello", 0);

	strictEqual(m(), undefined, "returns undefined");
});

test("mockShouldReturnValueWhenZeroTimes", function() {
	var m = mock();

	m.return("hello", 0);
	m.return("world");

	strictEqual(m(), "world", "returns world");
});

test("mockShouldReturnUndefinedWhenCalledThreeTimes", function() {
	var m = mock();

	m.return("hello");
	m.return("world");
	m.return(undefined);

	strictEqual(m(), "hello", "returns hello");
	strictEqual(m(), "world", "returns world");
	strictEqual(m(), undefined, "returns undefined");
});

test("mockShouldReturnExcpectedWhenExpectingFalsyValue", function() {
	var m = mock();

	m.return(0);
	m.return("hello world");

	strictEqual(m(), 0, "returns 0");
	strictEqual(m(), "hello world", "returns hello world");
});

test("mockShouldThrowString", function() {
	var m = mock();

	m.throw("some error");

	raises(function(){
		m();
	}, "some error", "should throw string");
});

test("mockShouldThrowError", function() {
	var m = mock();

	m.throw(new Error("some error"));

	raises(function(){
		m();
	}, Error, "should throw error");
});

// this it"s actually testing QUnit works fine, but I guess it doesn"t hurt
test("mockShouldThrowExpectedError", function() {
	var m = mock();
	var expectedError = new Error("some error");
	
	m.throw(expectedError);

	raises(function(){
		m();
	}, function(error) {
		return error === expectedError;
	}, "should throw error");
});

test("mockShouldThrowstrictEqualErrorTwice", function() {
	var m = mock();

	m.throw(new Error("some error"), 2);
	m.return("hello world")

	raises(function(){
		m();
	}, Error, "should throw error");
	raises(function(){
		m();
	}, Error, "should throw error");
	strictEqual(m(), "hello world", "should return hello world")
});

test("mockShouldInvokeCallback", function() {
	var m = mock();
	
	m.invoke(function(number){
		return number * 2;
	});

	strictEqual(m(2), 4, "invokes function");
	strictEqual(m(5), 10, "invokes function");
});

test("mockShouldInvokeCallbackTwice", function() {
	var m = mock();
	
	var prev = 0;
	m.invoke(function(number){
		result = number + prev;
		prev = number;
		return result;
	});

	strictEqual(m(2), 2, "invokes function");
	strictEqual(m(2), 4, "invokes function");
});

test("mockShouldInvokeCallbackTwoTimes", function() {
	var m = mock();
	
	m.invoke(function(){
		return 1;
	}, 2);
	m.return("hello world");

	strictEqual(m(), 1, "invokes function");
	strictEqual(m(), 1, "invokes function");
	strictEqual(m(), "hello world", "returns hello world");
});

test("mockShouldInvokeCallbackOnAnObject", function() {
	var o = { m: mock() };
	
	o.m.invoke(function(){
		return this === o;
	});

	ok(o.m(), "this bound to object");
});

test("mockShouldInvokeCallbackOnAnObjectTwoTimes", function() {
	var o = { m: mock() };
	
	o.m.invoke(function(){
		return this === o;
	}, 2);
	o.m.return("hello world");

	ok(o.m(), "this bound to object");
	ok(o.m(), "this bound to object");
	strictEqual(o.m(), "hello world", "returns hello world");
});

test("mockShouldReturnInvokeAndThrow", function() {
	var m = mock();
	
	m.return("hello world");
	m.invoke(function(){
		return 1;
	});
	m.throw(new Error("some error"));

	strictEqual(m(), "hello world", "returns hello world");
	strictEqual(m(), 1, "invokes function");
	raises(function() {
		m();
	}, Error, "throws error");
});

test("mockShouldReturnInvokeAndThrowUsingChainedCalls", function() {
	var m = mock();
	
	m.return("hello world").invoke(function(){ return 1; }).throw(new Error("some error"));

	strictEqual(m(), "hello world", "returns hello world");
	strictEqual(m(), 1, "invokes function");
	raises(function() {
		m();
	}, Error, "throws error");
});

test("calledShouldReturnZeroWhenNeverCalled", function() {
	var m = mock();

	ok(!m.called(), "has not been called");
});

test("calledShouldReturn1WhenCalledOnce", function() {
	var m = mock();

	m.return("hello world");

	m();
	
	strictEqual(m.called(), 1, "has been called once");
});

test("calledShouldReturn2WhenCalledTwice", function() {
	var m = mock();

	m.return("hello world");

	m();
	m();
	
	strictEqual(m.called(), 2, "has been called twice");
});

test("calledWithShouldReturnTrue", function() {
	var m = mock();

	m(1);
	m(2);
	
	ok(m.calls[0].calledWith(1), "m first call called with 1");
	ok(m.calls[1].calledWith(2), "m first call called with 2");
});

test("calledWithShouldReturnFalse", function() {
	var m = mock();

	m(1);
	
	ok(!m.calls[0].calledWith(2), "m first call not called with 2");
});

test("calledWithShouldReturnTrueWhenCalledOnMock", function() {
	var m1 = mock();
	var m2 = mock();

	m1(1);
	m2(2);
	m2(3);
	
	ok(m1.calledWith(1), "m1 calledWith 1");
	ok(m2.calledWith(2), "m2 calledWith 2");
	ok(m2.calledWith(3), "m2 calledWith 3");
});

test("calledWithShouldReturnFalseWhenCalledOnMock", function() {
	var m = mock();

	m(1);
	m(7);
	
	ok(!m.calledWith(2), "m not calledWith 2");
	ok(!m.calledWith(1), "m not calledWith 1");
	ok(!m.calledWith(7), "m not called three times");
});

test("calledWithShouldReturnFalseWhenCalledOnMockAndMockNeverCalled", function() {
	var m = mock();

	ok(!m.calledWith(7), "m never called");
});

test("argumentsShouldReturnCallArguments", function() {
	var m = mock();

	m(1);
	m(2);
	
	strictEqual(m.calls[0].arguments[0], 1, "m first call arguments are correctly saved");
	strictEqual(m.calls[1].arguments[0], 2, "m second call arguments are correctly saved");
});

test("thisShouldBeBoundToObject", function() {
	var o = { m: mock() };

	o.m();
	
	strictEqual(o.m.calls[0].this, o, "callee should be bound to object");
});

test("beforeShouldReturnTrue", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(m1.calls[0].before(m2.calls[0]));
});

test("beforeShouldReturnFalse", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(!m2.calls[0].before(m1.calls[0]));
});

test("afterShouldReturnTrue", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(m2.calls[0].after(m1.calls[0]));
});

test("afterShouldReturnFalse", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(!m1.calls[0].after(m2.calls[0]));
});

test("beforeShouldReturnTrueWhenCalledOnMock", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(m1.before(m2));
});

test("beforeShouldReturnFalseWhenCalledOnMock", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(!m2.before(m1));
});

test("afterShouldReturnTrueWhenCalledOnMock", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(m2.after(m1));
});

test("afterShouldReturnFalseWhenCalledOnMock", function() {
	var m1 = mock();
	var m2 = mock();

	m1();
	m2();
	
	strictEqual(m1.called(), 1, "m1 called once");
	strictEqual(m2.called(), 1, "m2 called once");
	ok(!m1.after(m2));
});

test("noConflictShouldRestoreOriginalWindowMock", function() {
	mock.noConflict();
	
	strictEqual(window.mock, undefined, "restore window.mock");
});