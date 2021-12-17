# Tidal OSC Console Display

Displays Tidal OSC messages in the terminal, groomed for Mike's
Tidal tastes. Prepared for https://night.tidalcycles.org.

![preview](https://user-images.githubusercontent.com/9797/146547461-c07acc0e-1912-44ce-98c1-54127dfa60fd.gif)

## Usage

Install with `npm install` or `yarn`.

Run:

```
node index.js
```

Optionally supply two (ordered) arguments to specify the port to listen on and to control 
how many OSC messages to keep in the log buffer:

```
# listen on port 11001 and display 5 messages
node index.js 11001 5
```

By default the app listens on port 5150 and displays 10 messages.