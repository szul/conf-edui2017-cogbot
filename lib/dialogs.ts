import * as builder from "botbuilder";

export function createHeroCard(sess: builder.Session, event: any): builder.HeroCard {
    return new builder.HeroCard(sess)
        .title(event.title)
        .subtitle(event.location)
        .text(event.speakers)
        .images([
            builder.CardImage.create(sess, "")
        ])
        .buttons([
            builder.CardAction.openUrl(sess, "", "Read more...")
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
