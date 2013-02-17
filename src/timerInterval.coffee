class timerInterval
  startDate: null
  endDate: null
  full: false #indicate if the
  diff: 0 #the diff calculatedn when the interval is full
  shift: 0 #offset to add to the diff. NOT used in the diffCalculation

  constructor: (startDate)->
    if startDate and typeof startDate == 'Date'
      @startDate = startDate
    else
      @startDate = new Date(); #we use the current time

  setEnd: (stopDate)=>
    #We set the end date given if it is valid and after the startDate.
    if stopDate and typeof stopDate == 'Date'
      @stopDate = stopDate
    else
      @stopDate = new Date();
    #we use the current time

    @diff = @stopDate - @startDate
    #we calculate the diff between the two dates
    @full = true

  setShift: (shift)=>
    @shift = shift
  getShift: =>
    @shift

  getDiff: =>
    if @full
      return @diff
    else
      return (new Date()) - @startDate #we retrun the diff between currentTime and the startDate