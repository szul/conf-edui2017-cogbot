import * as fs from "fs";
import * as cheerio from "cheerio";
import * as builder from "botbuilder";

var dialogs = require("./dialogs");

export enum Intent {
      LOCATION = 0
    , SCHEDULE = 1
    , TOPIC = 2
}

export interface Event {
      date: string
    , startTime: string
    , endTime: string
    , title: string
    , speakers: string
    , location: string
    , keywords: string
    , link: string
    , type: string
}

const file: string = fs.readFileSync("./edui.xml", "utf-8");
const xml: CheerioStatic = cheerio.load(file);

function getData(e: any): Array<Event> {
    if(e != null) {
        if(e.type === "person") {
            return getPerson(e.entity);
        }
        if(e.type === "topic") {
            return getTopic(e.entity);
        }
    }
}

function getPerson(search: string): Array<Event> {
    return writeEvent(getEventNodes("speakers", search));
}

function getTopic(search: string): Array<Event> {
    return writeEvent(getEventNodes("keywords", search).concat(getEventNodes("title", search)));
}

function getEventNodes(s: string, t: string): Array<CheerioElement> {
    var events: Array<CheerioElement> = [];
    xml(s).each((idx: number, elem: CheerioElement) => {
        if(xml(elem).text().toLowerCase().indexOf(t.toLowerCase()) > -1) {
            events.push(elem.parent);
        }
    });
    return events;
}

function writeEvent(events: Array<CheerioElement>): Array<Event> {
    var results: Array<Event> = [];
    for(let i = 0; i < events.length; i++) {
        let elem = xml(events[i]);
        let r: Event = {
              date: elem.parent().attr("date")
            , startTime: elem.attr("start-time")
            , endTime: elem.attr("end-time")
            , title: elem.find("title").text()
            , speakers: elem.find("speakers").text()
            , location: elem.find("location").text()
            , keywords: elem.find("keywords").text()
            , link: elem.find("link").text()
            , type: elem.attr("type")
        };
        results.push(r);
    }
    return results;
}

export function parse(sess: builder.Session, intent: Intent, entities: any): builder.HeroCard | Array<string> {
    var r = getData(entities.person).concat(getData(entities.topic));
    switch(intent) {
        case Intent.LOCATION:
            if(r.length > 1) {
                return dialogs.createChoiceOptions(r);
            }
            return (r.length === 1) ? dialogs.createHeroCard(sess, r[0]) : null;
        case Intent.SCHEDULE:
            if(r.length > 1) {
                return dialogs.createChoiceOptions(r);
            }
            return (r.length === 1) ? dialogs.createHeroCard(sess, r[0]) : null;
        case Intent.TOPIC:
            if(r.length > 1) {
                return dialogs.createChoiceOptions(r);
            }
            return (r.length === 1) ? dialogs.createHeroCard(sess, r[0]) : null;
    }
    return null;
}

export function findExact(s: string, t: string): Event {
    var e = writeEvent(getEventNodes(s, t));
    return (e.length > 0) ? e[0] : null;
}
