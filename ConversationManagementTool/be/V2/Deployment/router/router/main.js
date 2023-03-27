var io = require('socket.io-client');
var socket = io.connect('http://localhost:4005', {reconnect: true});


// Add a connect listener
socket.on('connect', function (socket) {
console.log('Connected!');
//socket.emit('api_call',{"id":123313,"assd":"asaa"});
});
socket.on('bot_uttered',(a,b)=>{
       console.log(b)
})
socket.emit('user_uttered',{"mail":"mahuli@varsha.com","message":"Hi","endpoint":"Vega"});
console.log("Answer??")




