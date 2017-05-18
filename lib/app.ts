import * as restify from "restify";
import * as builder from "botbuilder";

require("dotenv-extended").load();

function startServer(): void {
    var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, () => {
        console.log("%s listening to %s", server.name, server.url);
        startBot(server);
    });
}

function startBot(server: restify.Server): void {
    var conn = new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });
    var bot = new builder.UniversalBot(conn, (sess) => {
        sess.send("Hello. Welcome to the edUi bot. You can learn about the conference schedule and speakers here.");
    });
    /*
     * Add Luis as a recognizer.
     * Get the Luis model URL from the environment.
     */
    bot.recognizer(new builder.LuisRecognizer(process.env.LUIS_MODEL_URL));
    server.post("/api/messages", conn.listen());
}

startServer();
