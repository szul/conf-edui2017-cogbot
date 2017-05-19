import * as fs from "fs";
import * as cheerio from "cheerio";
import * as builder from "botbuilder";

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
    , type: string
}

const file: string = fs.readFileSync("./edui.xml", "utf-8");
const xml: CheerioStatic = cheerio.load(file);

function getData(entity: any): Array<Event> {
    if(entity != null) {
        if(entity === "person") {

        }
        if(entity === "topic") {

        }
    }
    return null;
}

function getPerson(name: string): Array<Event> {
    var events: Array<CheerioElement> = [];
    xml("speakers").each((idx: number, elem: CheerioElement) => {
        if(elem.nodeValue.indexOf(name) > -1) {
            events.push(elem.parent);
        }
    });
    return writeEvent(events);
}

function getTopic(): string {
    return null;
}

function writeEvent(events: Array<CheerioElement>): Array<Event> {
    var results: Array<Event> = [];
    for(let i = 0; i < events.length; i++) {
        let r: Event = {
              date: ""
            , startTime: ""
            , endTime: ""
            , title: ""
            , speakers: ""
            , location: ""
            , type: ""
        };
        results.push(r);
    }
    return results;
}

export function parse(intent: Intent, entities: any): string {
    var person: builder.IEntity = entities.person;
    var topic: builder.IEntity = entities.topic;
    console.log(person);
    console.log(topic);
    switch(intent) {
        case Intent.LOCATION:
            break;
        case Intent.SCHEDULE:

            break;
        case Intent.TOPIC:
            break;
    }
    return null;
}
