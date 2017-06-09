import * as builder from "botbuilder";
import * as restify from "restify";
import * as types from "./types";

require("dotenv-extended").load();

var parser = require("./parser");
var dialogs = require("./dialogs");

function getEntities(b: any, a: any): any {
    return {
          person: b.EntityRecognizer.findEntity(a.intent.entities, "person")
        , topic: b.EntityRecognizer.findEntity(a.intent.entities, "topic")
    };
}

function sendChoice(sess: builder.Session, intent: types.Intent, args: any): void {
    var d = parser.parse(sess, intent, getEntities(builder, args));
    if(d instanceof Array) {
        builder.Prompts.choice(sess, "We are showing multiple results. Please choose one:", d);
    }
    else if(d !== null) {
        sess.send(new builder.Message(sess).addAttachment(d));
    }
    else {
        sess.send("Sorry, I don't understand what you said.");
    }
}

function sendCard(sess: builder.Session, results: any): void {
    sess.send(new builder.Message(sess).addAttachment(dialogs.createHeroCard(sess, parser.findExact("title", results.response.entity))));
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
            sendChoice(sess, types.Intent.LOCATION, args);
        },
        (sess, results) => {
            sendCard(sess, results);
        }
    ]).triggerAction({
        matches: "location"
    });

    bot.dialog("schedule", [
        (sess, args, next) => {
            sendChoice(sess, types.Intent.SCHEDULE, args);
        },
        (sess, results) => {
            sendCard(sess, results);
        }
    ]).triggerAction({
        matches: "schedule"
    });

    bot.dialog("topic", [
        (sess, args, next) => {
            sendChoice(sess, types.Intent.TOPIC, args);
        },
        (sess, results) => {
            sendCard(sess, results);
        }
    ]).triggerAction({
        matches: "topic"
    });

}

startServer();
