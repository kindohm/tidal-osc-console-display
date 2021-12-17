const osc = require('osc');
const allowedParams = ['cps', 'cycle', 'legato', 'midichan', 's', 'ccn', 'ccv', 'note', 'time', 'orbit']

// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 5150,
  metadata: true
});

let i = 0;
let name = "";
let value,type = null;
let msgs = [];

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
  const { args } = oscMsg;
  msgs = [];
  for (i = 0; i < args.length; i+=2){
    name = args[i].value;
    if (!allowedParams.includes(name)) continue;

    type= args[i+1].type;
    value= args[i+1].value;
    msgs.push(`${name}: ${type==='f' ? value.toFixed(2) : value}`)
  }
  process.stdout.write(`${msgs.join(', ')}\n`)

});

udpPort.on("ready", () => {
  console.log('ready')
})

// Open the socket.
udpPort.open();