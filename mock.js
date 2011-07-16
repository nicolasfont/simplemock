var mock;
(function () {
    "use strict";
    mock = function () {
        var returnValues = [], calls = [], returnValue;

        function f() {
            var now = new Date(), then = new Date();

            calls.push({
                callDate : now,
                args : arguments,
                that : this,
                before : function (call) {
                    return this.callDate < call.callDate;
                },
                after : function (call) {
                    return this.callDate > call.callDate;
                },
                calledWith : function () {
                    var i;
                    for (i = 0; i < arguments.length; i += 1) {
                        if (arguments[i] !== this.args[i]) {
                            return false;
                        }
                    }
                    return true;
                }
            });

            // wait 1 millisecond so that callDates are different
            while (then - now < 1) {
                then = new Date();
            }

            returnValue = returnValues[calls.length - 1] || returnValues[returnValues.length - 1];
            return returnValue && returnValue.apply(this, arguments);
        }

        function addReturnValue(times, f) {
            var t = 1, i;

            if (times !== undefined) {
                t = times;
            }

            for (i = 0; i < t; i += 1) {
                returnValues.push(f);
            }
        }

        f.returnValue = function (value, times) {
            addReturnValue(times, function () {
                return value;
            });
            return f;
        };

        f.throwError = function (value, times) {
            addReturnValue(times, function () {
                throw value;
            });
            return f;
        };

        f.invoke = function (value, times) {
            addReturnValue(times, function () {
                return value.apply(this, arguments);
            });
            return f;
        };

        f.calls = calls;

        f.called = function () {
            return calls.length;
        };

        f.before = function (mock) {
            return this.calls[0].before(mock.calls[0]);
        };

        f.after = function (mock) {
            return this.calls[0].after(mock.calls[0]);
        };

        f.calledWith = function () {
            var result;
            f.calledWith.index = f.calledWith.index || 0;
            if (f.calledWith.index >= this.calls.length) {
                return false;
            }
            result = this.calls[f.calledWith.index].calledWith.apply(this.calls[f.calledWith.index], arguments);
            f.calledWith.index = f.calledWith.index + 1;
            return result;
        };

        return f;
    };
}());
