const WebSocket = require('ws');
const http = require('http');

// const HIDDevice = require('./server/controllers/HIDDevicesController');
const deviceController = require('./server/controllers/device.controller');
const {
  app
} = require('./app');
const WEBSOCKET_URL = 9999;

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const server = http.createServer(app);

//const wss = new WebSocket.Server({ port: 8888 });
const wss = new WebSocket.Server({
  server
});

wss.on('connection', function connection(ws) {
  
  ws.isAlive = true;
  ws.on('asynchronous-message', req => {
   
  });

  ws.on('message', async msg => {
   
    let message = null;
    try {
      message = JSON.parse(msg);
    } catch (error) {
      message = 'invalid type';
    }
   

    if (message.type == 'request') {
      const response = {
        type: 'reply',
        transactionId: message.transactionId,
        payload: {}
      };
      //--------- for socket and electron
      switch (message.event) {
        case "getAllDevices":
          response.payload = await deviceController.default.getAllDevices();
          ws.send(JSON.stringify(response));
          break;
        case "writeToDevice":
          var fs = require("fs");
          // for socket flow code
          fs.writeFile("c://BOSE//raphael-file.txt", JSON.stringify(message), (err) => {
            if (err) 
            
            fs.readFile("c://BOSE//raphael-file.txt", function (err, data) {
              
              let returnVal = JSON.parse(data);
              response.payload = returnVal.payload.data;
              ws.send(JSON.stringify(response));
            });
          });
          break;
        default:
          response.payload = {
            'key': 'default value' + message.event
          };
          ws.send(JSON.stringify(response));
      }
    } else {
      const response = {
        type: 'reply',
        transactionId: '0',
        payload: {
          'key': 'invalid request type received.'
        }
      };

      
      // ipcRenderer.send('asynchronous-message', response);
      // ws.send(JSON.stringify(response));
    }
  });
});

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);

server.listen(WEBSOCKET_URL);
