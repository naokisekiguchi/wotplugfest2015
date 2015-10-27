

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
    //console.log("_check");
    var self = this;
    this._send("check/event",(function(evt){
      if(evt){
        //console.log(evt);
        if(typeof this.oneventemit[evt.name] === "function"){
          this.oneventemit[evt.name](evt.data);
        }else{
          console.log("function undefined");
        }
      }
    }).bind(self));
  },
  _send:function(cmd,func){
    /*
    //console.log("send"+this.uri);
    //var xhr = new XMLHttpRequest({mozSystem: true});
    var xhr = new XMLHttpRequest();
    //xhr.open('GET', url, true);
    xhr.open('GET', this.uri + cmd, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4 && xhr.status === 200){
        //console.log(xhr.responseText);
        func(JSON.parse(xhr.responseText));
      }
    };
    xhr.send(null);
    */
    var url = this.uri + cmd;
    http.get(url, function(res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        //console.log(body);
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
//client side, connect to a lightbulb by its URI
var thing = wot.connect("http://172.16.0.212:8001/");

//client side, thing is a remote lightbulb
thing.subscribe('stateChanged',function(evt) {
  debug("sensor " + evt.src + " changed state at " + evt.time + " to " + evt.payload.brightness);
});

//client side, thing is a remote lightbulb
thing.get('brightness')
   .then(function(res) {
     debug("current brightness is " + res.value );
   });
  

function debug(mes){
  console.log(mes);
  //document.getElementById("debug").innerHTML = mes;
}





