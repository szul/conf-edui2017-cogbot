import * as builder from "botbuilder";
import * as types from "./types";

export function createHeroCard(sess: builder.Session, event: any, intent: types.Intent): builder.HeroCard {
    switch(intent) {
        case types.Intent.LOCATION:
            sess.send(`It looks like you can find that session at ${event.location}. Here is some more information.`);
            break;
        case types.Intent.SCHEDULE:
        sess.send(`That session starts at ${event.startTime} and ends at ${event.endTime} on ${event.date}. Here is some more information.`);
            break;
        case types.Intent.TOPIC:
            sess.send("Here is a presentation that we think matches your interest.");
            break;
    }
    return new builder.HeroCard(sess)
        .title(event.title)
        .subtitle(event.location)
        .text(event.speakers)
        .images([
            builder.CardImage.create(sess, (event.images != null) ? event.images[0].link : "")
        ])
        .buttons([
            builder.CardAction.openUrl(sess, event.link, "Learn more...")
        ]);
}

export function createChoiceOptions(events: Array<any>): Array<string> {
    var a: Array<string> = [];
    for(let i = 0; i < events.length; i++) {
        if(events[i] != null) {
            a.push(events[i].title);
        }
    }
    return a;
}
