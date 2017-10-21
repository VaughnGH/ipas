function getWebSocket() {
  var ws = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + ":80" + "/ws-client");  // `/ws-client' being the websocket endpoint
  return ws
}
//const socket = getWebSocket();
//socket.addEventListener('open', function (event) {
//  socket.send('Init');
//
//});
//var i = 1;
//socket.addEventListener('message', function (event) {
//  console.log('message received: ', event.data);
//  setTimeout( function () {
//    if (!socket.closed) {
//      socket.send("msg-client " + i);
//      i+=1;
//    }
//  }, 1500);
//});
