(function() {
	var mock = function() {
		var returnValues = [];
		var calls = [];
	
		var f = function() {
			calls.push({
				callDate: new Date(),
				arguments: arguments,
				this: this,
				before: function(call) {
					return this.callDate < call.callDate;
				},
				after: function(call) {
					return this.callDate > call.callDate;
				},
				calledWith: function() {
					for (var i = 0; i < arguments.length; i++) {
						if (arguments[i] !== this.arguments[i]) {
							return false;
						};
					}
					return true;
			    }
			});
			
			// wait 1 millisecond so that callDates are different
			var date = new Date();
			while (new Date() - date < 1);
			
			var returnValue = returnValues[calls.length - 1] || returnValues[returnValues.length - 1];
			return returnValue && returnValue.apply(this, arguments);
		};
	
		var addReturnValue = function(times, f) {
			var t = 1;
			
			if (times !== undefined) {
				t = times;
			}
			
			for (var i = 0; i < t; i++) {
				returnValues.push(f);
			}
		};
		
		f.return = function(value, times) {
			addReturnValue(times, function() {
				return value;
			});
			return f;
		};
		
		f.throw = function(value, times) {
			addReturnValue(times, function() {
				throw value;
			});
			return f;
		};
		
		f.invoke = function(value, times) {
			addReturnValue(times, function() {
				return value.apply(this, arguments);
			});
			return f;
		};
		
		f.calls = calls;
	
		f.called = function() {
			return calls.length;
		};
		
		f.before = function(mock) {
			return this.calls[0].before(mock.calls[0]);
		};
		
		f.after = function(mock) {
			return this.calls[0].after(mock.calls[0]);
		};
		
		var calledWithIndex = 0;
		f.calledWith = function(){
			if (calledWithIndex >= this.calls.length) {
				return false;
			}
			return this.calls[calledWithIndex].calledWith.apply(this.calls[calledWithIndex++], arguments);
		};
		
		return f;
	};
	
	var originalMock = this.mock;
	
	var that = this;
	mock.noConflict = function() {
		that.mock = originalMock;
	};
	
	this.mock = mock;
})();