Utils.timer.js
--------------

This is a timer utils. it help to manage time and alert by giving the ability to fire event a precise time after started.

As a real timer, it can be stopped and restarted. Time between those two operation won't be used for time calculations

    //basic usage (in a browser):
    var timer= new window.ztec.utils.timer();
    timer.start();
    
    timer.bind('change',function(currentTime){
        console.log('current time status : '+currentTime); //will print the time status if the timer each tick (100ms)
    })
    ;
    //adding a countDown value (hours,minutes,seconds)
    timer.setCountDown(0,34,0); //Will change currentTime to (34*60*1000)-currentTime.
    
    timer.stop(); //stop the timer. No more tick !
    
    timer.start(); //restart the timer where it was.
    
    timer.reset(); //remove countDon values and set currentTime to 0. Tick continue if the timer was running
     
    timer.isRunning(); //Tell if the timer is running. !timer.isStopped();
    
    timer.isStopped(); //tell if the timer is stopped. !timer.isRunngin();
    
    timer.currentTime //This is the current time of the timer. 
    
### Events ###
The timer fire two kind of events :

    - Event : "change"
    
        timer.bind('change',function(currentTime,timer){});  //this event is fired every 100ms when the timer is running.
    
    - Event : "zerroPassed"
        timer.bind('zeroPassed',function(currentTimer,timer){}); //this event is fired only when a countDown value is set AND when the currentTime reach 0. It is fired only once.
    
    