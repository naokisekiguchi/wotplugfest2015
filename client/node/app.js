var http = require('http');

//wrapper
function Things(uri){
  this.uri = uri;
  this.oneventemit = new Object();
  this.timer;
}
Things.prototype = {
  subscribe:function(event,func){
    var self = this;
    console.log("thigs subscribe");
    this.oneventemit[event] = func;
    this.timer = setInterval(self._check.bind(self),1000);
  },
  get:function(name){
    var self = this;
    return new Promise(function(resolve,reject){
      self._send("get/"+name,resolve);
    });
  },
  _check:function(){
    var self = this;
    this._send("check/event",(function(evt){
      if(evt){
        if(typeof this.oneventemit[evt.name] === "function"){
          this.oneventemit[evt.name](evt.data);
        }else{
          console.log("function undefined");
        }
      }
    }).bind(self));
  },
  _send:function(cmd,func){
    var url = this.uri + cmd;
    http.get(url, function(res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        func(JSON.parse(body));
      });
    }).on('error', function(e) {
      console.log(e.message);
    });
  }
}

function WoT(){}

WoT.prototype = {
  connect:function(uri){
    console.log("wot" + uri);
    return new Things(uri);
  }
}
//wrapper
  
 
/*
  https://github.com/w3c/wot/blob/master/TF-AP/Example_sketch.md
*/
 
var wot = new WoT();
//connect to a light sensor by its URI
var thing = wot.connect("http://172.16.0.212:8001/");

//thing is a remote light sensor
thing.subscribe('stateChanged',function(evt) {
  debug("sensor " + evt.src + " changed state at " + evt.time + " to " + evt.payload.brightness);
});

thing.get('brightness')
   .then(function(res) {
     debug("current brightness is " + res.value );
   });
  

function debug(mes){
  console.log(mes);
}





