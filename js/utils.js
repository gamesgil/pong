'use strict'
function StringUtils() {}
StringUtils.formatTime = (time) => {
    var mins = Math.floor(time / 60)
    var minsAsStr = mins < 10 ? "0" + mins : mins
    var secs = Math.floor(time - mins * 60)
    var secsAsStr = secs < 10 ? "0" + secs : secs
    var result = minsAsStr + ":" + secsAsStr
    
    return result
}

function Timer() {
  let timer = null
  let ticks = 0
  
  return {
    start: function(seconds, callbackOnStop, callbackOnUpdate, stopFunc) {
      if (timer === null) {
            ticks = 0

            timer = setInterval(function() {
                ticks++

                if ((ticks / 100) >= seconds) {
                    this.clear(callbackOnStop)
                }
                else if (callbackOnUpdate) {
                    callbackOnUpdate(ticks)
                }
        }.bind(this), 10)
      }
   },
    
    clear: function(callback) {
        clearInterval(timer)
        timer = null

        if (callback) {
            callback(ticks / 100)
        }
    },
      
      getTime: function() {
          return ticks
      }
    
  }
}