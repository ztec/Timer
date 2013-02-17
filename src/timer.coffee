class timer
#Array of all intervales when the timer was counting !
  intervals: '' #array, string to break refrence

  #total time for countdown. If set, it's the maximum time a countdown can run before triggering the endEvent and display 0 or minus !
  timerTotal: null

  status: 'S' #The status of the timer. S=Stopped R=Running

  monitoringPrecision: 50 #the presision of the monitoring in ms

  currentTime : 0 #current time spent/last for the current timer.

  _zeroTriggered : false #if true, the countDown already reach zero and an event was fired.


  constructor: ->
    @intervals = []
    @_triggers = {}
    @_setStopped()

  #start the timer using the current time
  start: =>
    if @_isRunning() then throw new alreadyRunningTimerException('The timer is already running')
    @_setRunning()
    lastInterval = @intervals[@intervals.length - 1] unless @intervals.length == 0
    @intervals.push new timerInterval()
    #insert new interval of runnign time
    @intervals[@intervals.length - 1].setShift lastInterval.getShift() + lastInterval.getDiff() unless !lastInterval
    @_startMonitoring()

  #stop the timer when invoking this method
  stop: =>
    if @_isStopped() then throw new alreadyStoppedTimerException('The timer is already stopped');
    @_setStopped()
    lastInterval = @intervals[@intervals.length - 1]
    #getting the last interval. Checks ons status garantee that previous intervals are full
    lastInterval.setEnd()
    # set the last interval as finished
    @_stopMonitoring()

  reset: =>
    if @_isRunning() then previousStatus = 'R' else previousStatus = 'S'
    #we save the previous state to restart monitoring if required
    @_setStopped()
    # set the last interval as finished
    @_stopMonitoring() unless previousStatus == 'S'
    @intervals = []
    @timerTotal = null
    @_zeroTriggered = false
    @_trigger 'change',[0,@]
    if previousStatus == 'R' then @start() #we restart the monitoring if the timer was running durring reset


  setCountDown: (hours, minutes, seconds)=>
    if hours? and minutes? and seconds?
      hours = parseInt(hours)|0
      minutes = parseInt(minutes)|0
      seconds = parseInt(seconds)|0
      @timerTotal =
      {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      totalMilliseconds: ((hours * 3600) + (minutes * 60) + seconds) * 1000 #we calculate the number of milliseconds the countdown must last
      }
      try
        @_monitoringLoop()
      catch e
    else
      throw new invalidParametersTimerException("Passed arguements to set the countDown are wrong or undefined")

  isRunning: =>
    @_isRunning()
  isStopped: =>
    @_isStopped()


  bind: (eventName,callback)=> #connect a callback to a function
    @_triggerConnect.apply @,arguments
  unbind: (eventName,callback)=> #disconnect a callback from a trigger
    @_triggerDisconnect.apply @,arguments


#Privates methods ------------------------------------------------------------------------------------------------------

#Status managment and checks

  _setRunning: =>
    @status = 'R'
  _setStopped: =>
    @status = 'S'
  _isRunning: =>
    @status == 'R'
  _isStopped: =>
    @status == 'S'

#countDown managment
  _intervalMonitoring: null;
  _startMonitoring: =>
    @_intervalMonitoring = setInterval @_monitoringLoop, @monitoringPrecision
  _stopMonitoring: =>
    clearInterval @_intervalMonitoring
    @_monitoringLoop()
  _monitoringLoop: =>
    #calculate the currentTime
    lastInterval = @intervals[@intervals.length-1] unless @intervals.length == 0
    totalTime = lastInterval.getShift() + lastInterval.getDiff()
    if @timerTotal
      @currentTime =  totalTime - @timerTotal.totalMilliseconds
    else
      @currentTime = totalTime
    @_trigger('change',[@currentTime,@]);

    #triggerEvents
    if @timerTotal and @currentTime>0 and not @_zeroTriggered
      @_trigger('zeroPassed',[@currentTime,@]);
      @_zeroTriggered = true



#EventManagment
  _triggers: ''; #in reality it's an object. string to break reference
  _triggerConnect: (name,callback)=>
    @_triggers[name] = [] unless @_triggers[name]?
    @_triggers[name].push callback

  _triggerDisconnect: (name,callback)=>
    if @_triggers[name]?
      for triggerCallBack, id  in @_triggers[name]
        if triggerCallBack == callback
          @_triggers[id] = null ;

  _trigger: (name,args)=>
    if @_triggers[name]?
      for callback, id in @_triggers[name]
        callback.apply(@,args) unless callback is null #if null, the callback was disabled !




