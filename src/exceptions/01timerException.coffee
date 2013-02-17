#baseException !
class timerException
  message: "";
  code: "";
  getMessage: =>
    @message
  getCode: =>
    @code
  constructor: (message, code)->
    @message = message
    @code = code unless typeof code == "undefined"
