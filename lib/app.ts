import * as builder from "botbuilder";
import * as restify from "restify";

require("dotenv-extended").load();

var parser = require("./parser");

function getEntities(b: any, a: any): any {
    return {
          person: b.EntityRecognizer.findEntity(a.intent.entities, "person")
        , topic: b.EntityRecognizer.findEntity(a.intent.entities, "topic")
    };
}

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
        if(sess.message.text.toLowerCase() === "hello") {
            sess.send("Hello. Welcome to the edUi bot. You can learn about the conference schedule and speakers here.");
        }
        else {
            sess.send("Sorry, I don't understand what you said.");
        }
    });
    /*
     * Add Luis as a recognizer.
     * Get the Luis model URL from the environment.
     */
    bot.recognizer(new builder.LuisRecognizer(process.env.LUIS_MODEL_URL));
    server.post("/api/messages", conn.listen());

    bot.dialog("location", [
        (sess, args, next) => {
            var text = parser.parse(parser.Intent.LOCATION, getEntities(builder, args));
        }
    ]).triggerAction({
        matches: "location"
    });

    bot.dialog("schedule", [
        (sess, args, next) => {
            var text = parser.parse(parser.Intent.SCHEDULE, getEntities(builder, args));
        }
    ]).triggerAction({
        matches: "schedule"
    });

    bot.dialog("topic", [
        (sess, args, next) => {
            var text = parser.parse(parser.Intent.TOPIC, getEntities(builder, args));
        }
    ]).triggerAction({
        matches: "topic"
    });

}

startServer();
