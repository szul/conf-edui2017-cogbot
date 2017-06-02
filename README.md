# edUi Conference 2017 Presentation

This repo houses the coding examples and demos for my [edUi Conference](http://eduiconf.org) (2017) talk on [bots](http://eduiconf.org/sessions/building-bots-for-the-conversation-ui/).

This particular repository is a sister repository to an [example bot demo](https://github.com/szul/conf-edui2017-examplebot). That repo's code is designed to showcase many of the dialog and UI functionality that Microsoft's Bot Builder offers. This repo is designed to showcase the available cognitive service integration.

### How to install and run

From a shell:

```
git clone https://github.com/szul/conf-edui2017-cogbot.git
cd conf-edui2017-cogbot
npm install
tsc -p tsconfig.json
node server.js
```

You'll need the [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator) to interact with it.
