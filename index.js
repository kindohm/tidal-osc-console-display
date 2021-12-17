const numberOfPads = 12;
const defaultPort = 5150;
const defaultHistoryLength = 10;
const port =
  process.argv.length > 2
    ? parseInt(process.argv[2]) || defaultPort
    : defaultPort;
const oscHistoryCount =
  process.argv.length > 3
    ? parseInt(process.argv[3]) || defaultHistoryLength
    : defaultHistoryLength;

const osc = require("osc");
const DraftLog = require("draftlog");

const historyParamSorts = {
  cycle: 0,
  time: 100,
  cps: 2,
  s: 3,
  midichan: 4,
  ccn: 5,
  ccv: 6,
  note: 7,
  orbit: 8,
  legato: 9,
};

const allowedHistoryParams = Object.keys(historyParamSorts);

DraftLog.into(console);

// Create an osc.js UDP Port listening on port 57121.
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: port,
  metadata: true,
});

const padCounts = Array(numberOfPads)
  .fill(null)
  .map(() => 0);
const padLogDrafts = padCounts.map((c) => console.draft(c));
const oscMessageHistory = Array(oscHistoryCount)
  .fill()
  .map(() => "");
const oscMessageDrafts = oscMessageHistory.map((m) => console.draft(m));

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg, timeTag, info) {
  const { args } = oscMsg;

  let ccn = null,
    s = null,
    note = null,
    chan = null;

  let parts = [];

  for (let i = 0; i < args.length; i += 2) {
    const name = args[i].value;
    const type = args[i + 1].type;
    const value = args[i + 1].value;
    if (name === "midichan") {
      chan = Math.round(value);
    } else if (name === "note") {
      note = value;
    } else if (name === "ccn") {
      ccn = value;
    } else if (name === "s") {
      s = value;
    }

    if (allowedHistoryParams.includes(name)) {
      parts.push({ name, value: type === "f" ? value.toFixed(2) : value });
    }
  }

  oscMessageHistory.push(parts.sort(sortParts).map(partString).join(", "));
  if (oscMessageHistory.length > 5) {
    oscMessageHistory.shift();
  }

  logMessages();

  if (
    ccn === null &&
    note !== null &&
    chan !== null &&
    chan >= 0 &&
    s === "rytm"
  ) {
    padCounts[chan]++;
  }

  logCounts();
});

const partString = (part) => {
  return `${part.name}: ${part.value}`;
};

const sortParts = (a, b) => {
  return historyParamSorts[a.name] - historyParamSorts[b.name];
};

const tobin = (num) => {
  return num.toString(2).padStart(16, "0");
};

const label = (num) => {
  return `pad${num.toString().padStart(2, "0")}`;
};

const logCounts = () => {
  padLogDrafts.forEach((log, i) => {
    log(`${label(i)} ${tobin(padCounts[i])}`);
  });
};

const logMessages = () => {
  oscMessageDrafts.forEach((msgLog, i) => {
    msgLog(oscMessageHistory[i]);
  });
};

// Open the socket.
udpPort.open();

logCounts();
logMessages();
