// Generated by CoffeeScript 1.4.0
(function() {
  var alreadyRunningTimerException, alreadyStoppedTimerException, badIntervalTimerException, invalidParametersTimerException, timer, timerException, timerInterval,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  timerException = (function() {

    timerException.prototype.message = "";

    timerException.prototype.code = "";

    timerException.prototype.getMessage = function() {
      return this.message;
    };

    timerException.prototype.getCode = function() {
      return this.code;
    };

    function timerException(message, code) {
      this.getCode = __bind(this.getCode, this);

      this.getMessage = __bind(this.getMessage, this);
      this.message = message;
      if (typeof code !== "undefined") {
        this.code = code;
      }
    }

    return timerException;

  })();

  alreadyRunningTimerException = (function(_super) {

    __extends(alreadyRunningTimerException, _super);

    function alreadyRunningTimerException() {
      return alreadyRunningTimerException.__super__.constructor.apply(this, arguments);
    }

    return alreadyRunningTimerException;

  })(timerException);

  alreadyStoppedTimerException = (function(_super) {

    __extends(alreadyStoppedTimerException, _super);

    function alreadyStoppedTimerException() {
      return alreadyStoppedTimerException.__super__.constructor.apply(this, arguments);
    }

    return alreadyStoppedTimerException;

  })(timerException);

  badIntervalTimerException = (function(_super) {

    __extends(badIntervalTimerException, _super);

    function badIntervalTimerException() {
      return badIntervalTimerException.__super__.constructor.apply(this, arguments);
    }

    return badIntervalTimerException;

  })(timerException);

  invalidParametersTimerException = (function(_super) {

    __extends(invalidParametersTimerException, _super);

    function invalidParametersTimerException() {
      return invalidParametersTimerException.__super__.constructor.apply(this, arguments);
    }

    return invalidParametersTimerException;

  })(timerException);

  timer = (function() {

    timer.prototype.intervals = '';

    timer.prototype.timerTotal = null;

    timer.prototype.status = 'S';

    timer.prototype.monitoringPrecision = 50;

    timer.prototype.currentTime = 0;

    timer.prototype._zeroTriggered = false;

    function timer() {
      this._trigger = __bind(this._trigger, this);

      this._triggerDisconnect = __bind(this._triggerDisconnect, this);

      this._triggerConnect = __bind(this._triggerConnect, this);

      this._monitoringLoop = __bind(this._monitoringLoop, this);

      this._stopMonitoring = __bind(this._stopMonitoring, this);

      this._startMonitoring = __bind(this._startMonitoring, this);

      this._isStopped = __bind(this._isStopped, this);

      this._isRunning = __bind(this._isRunning, this);

      this._setStopped = __bind(this._setStopped, this);

      this._setRunning = __bind(this._setRunning, this);

      this.unbind = __bind(this.unbind, this);

      this.bind = __bind(this.bind, this);

      this.isStopped = __bind(this.isStopped, this);

      this.isRunning = __bind(this.isRunning, this);

      this.setCountDown = __bind(this.setCountDown, this);

      this.reset = __bind(this.reset, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);
      this.intervals = [];
      this._triggers = {};
      this._setStopped();
    }

    timer.prototype.start = function() {
      var lastInterval;
      if (this._isRunning()) {
        throw new alreadyRunningTimerException('The timer is already running');
      }
      this._setRunning();
      if (this.intervals.length !== 0) {
        lastInterval = this.intervals[this.intervals.length - 1];
      }
      this.intervals.push(new timerInterval());
      if (!!lastInterval) {
        this.intervals[this.intervals.length - 1].setShift(lastInterval.getShift() + lastInterval.getDiff());
      }
      return this._startMonitoring();
    };

    timer.prototype.stop = function() {
      var lastInterval;
      if (this._isStopped()) {
        throw new alreadyStoppedTimerException('The timer is already stopped');
      }
      this._setStopped();
      lastInterval = this.intervals[this.intervals.length - 1];
      lastInterval.setEnd();
      return this._stopMonitoring();
    };

    timer.prototype.reset = function() {
      var previousStatus;
      if (this._isRunning()) {
        previousStatus = 'R';
      } else {
        previousStatus = 'S';
      }
      this._setStopped();
      if (previousStatus !== 'S') {
        this._stopMonitoring();
      }
      this.intervals = [];
      this.timerTotal = null;
      this._zeroTriggered = false;
      this._trigger('change', [0, this]);
      if (previousStatus === 'R') {
        return this.start();
      }
    };

    timer.prototype.setCountDown = function(hours, minutes, seconds) {
      if ((hours != null) && (minutes != null) && (seconds != null)) {
        hours = parseInt(hours) | 0;
        minutes = parseInt(minutes) | 0;
        seconds = parseInt(seconds) | 0;
        this.timerTotal = {
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          totalMilliseconds: ((hours * 3600) + (minutes * 60) + seconds) * 1000
        };
        try {
          return this._monitoringLoop();
        } catch (e) {

        }
      } else {
        throw new invalidParametersTimerException("Passed arguements to set the countDown are wrong or undefined");
      }
    };

    timer.prototype.isRunning = function() {
      return this._isRunning();
    };

    timer.prototype.isStopped = function() {
      return this._isStopped();
    };

    timer.prototype.bind = function(eventName, callback) {
      return this._triggerConnect.apply(this, arguments);
    };

    timer.prototype.unbind = function(eventName, callback) {
      return this._triggerDisconnect.apply(this, arguments);
    };

    timer.prototype._setRunning = function() {
      return this.status = 'R';
    };

    timer.prototype._setStopped = function() {
      return this.status = 'S';
    };

    timer.prototype._isRunning = function() {
      return this.status === 'R';
    };

    timer.prototype._isStopped = function() {
      return this.status === 'S';
    };

    timer.prototype._intervalMonitoring = null;

    timer.prototype._startMonitoring = function() {
      return this._intervalMonitoring = setInterval(this._monitoringLoop, this.monitoringPrecision);
    };

    timer.prototype._stopMonitoring = function() {
      clearInterval(this._intervalMonitoring);
      return this._monitoringLoop();
    };

    timer.prototype._monitoringLoop = function() {
      var lastInterval, totalTime;
      if (this.intervals.length !== 0) {
        lastInterval = this.intervals[this.intervals.length - 1];
      }
      totalTime = lastInterval.getShift() + lastInterval.getDiff();
      if (this.timerTotal) {
        this.currentTime = totalTime - this.timerTotal.totalMilliseconds;
      } else {
        this.currentTime = totalTime;
      }
      this._trigger('change', [this.currentTime, this]);
      if (this.timerTotal && this.currentTime > 0 && !this._zeroTriggered) {
        this._trigger('zeroPassed', [this.currentTime, this]);
        return this._zeroTriggered = true;
      }
    };

    timer.prototype._triggers = '';

    timer.prototype._triggerConnect = function(name, callback) {
      if (this._triggers[name] == null) {
        this._triggers[name] = [];
      }
      return this._triggers[name].push(callback);
    };

    timer.prototype._triggerDisconnect = function(name, callback) {
      var id, triggerCallBack, _i, _len, _ref, _results;
      if (this._triggers[name] != null) {
        _ref = this._triggers[name];
        _results = [];
        for (id = _i = 0, _len = _ref.length; _i < _len; id = ++_i) {
          triggerCallBack = _ref[id];
          if (triggerCallBack === callback) {
            _results.push(this._triggers[id] = null);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    timer.prototype._trigger = function(name, args) {
      var callback, id, _i, _len, _ref, _results;
      if (this._triggers[name] != null) {
        _ref = this._triggers[name];
        _results = [];
        for (id = _i = 0, _len = _ref.length; _i < _len; id = ++_i) {
          callback = _ref[id];
          if (callback !== null) {
            _results.push(callback.apply(this, args));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return timer;

  })();

  timerInterval = (function() {

    timerInterval.prototype.startDate = null;

    timerInterval.prototype.endDate = null;

    timerInterval.prototype.full = false;

    timerInterval.prototype.diff = 0;

    timerInterval.prototype.shift = 0;

    function timerInterval(startDate) {
      this.getDiff = __bind(this.getDiff, this);

      this.getShift = __bind(this.getShift, this);

      this.setShift = __bind(this.setShift, this);

      this.setEnd = __bind(this.setEnd, this);
      if (startDate && typeof startDate === 'Date') {
        this.startDate = startDate;
      } else {
        this.startDate = new Date();
      }
    }

    timerInterval.prototype.setEnd = function(stopDate) {
      if (stopDate && typeof stopDate === 'Date') {
        this.stopDate = stopDate;
      } else {
        this.stopDate = new Date();
      }
      this.diff = this.stopDate - this.startDate;
      return this.full = true;
    };

    timerInterval.prototype.setShift = function(shift) {
      return this.shift = shift;
    };

    timerInterval.prototype.getShift = function() {
      return this.shift;
    };

    timerInterval.prototype.getDiff = function() {
      if (this.full) {
        return this.diff;
      } else {
        return (new Date()) - this.startDate;
      }
    };

    return timerInterval;

  })();

  if (!(this.ztec != null)) {
    this.ztec = {};
  }

  if (!(this.ztec.utils != null)) {
    this.ztec.utils = {};
  }

  this.ztec.utils.timer = timer;

}).call(this);
