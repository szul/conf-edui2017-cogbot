import * as request from "request-promise";
import * as cheerio from "cheerio";
import * as fs from "fs";

const pages: Array<string> = [
     "http://eduiconf.org/schedule/#edui-schedule-day-1"
    ,"http://eduiconf.org/schedule/#edui-schedule-day-2"
    ,"http://eduiconf.org/schedule/#edui-schedule-day-3"
];

var _xml = `<conference start-date="2017-09-25" end-date="2017-09-27">`;

function getDate(date: string): string {
    let parts = date.split("2017");
    let times = parts[1].trim().split(" – ");
    return `start-time="${times[0]}" end-time="${times[1]}"`;
}

function processPage(body: string, day: string): void {
    let c = cheerio.load(body);
     _xml += `<day date="${day}">`;
     c("article").each((idx: number, elem: CheerioElement) => {
        _xml += `<event type="${c(elem).find(".session-type").text().trim()}" ${getDate(c(elem).find(".session-date").text().trim())}>`;
        _xml += `<title>${c(elem).find(".full-session-title").text().trim()}</title>`;
        _xml += `<location>${c(elem).find(".session-location").text().trim()}</location>`;
        _xml += `<speakers>${c(elem).find(".session-speakers").text().trim()}</speakers>`;
        _xml += `<keywords>${c(elem).find(".session-categories").text().trim().replace("Categories: ", "")}</keywords>`;
        _xml += "</event>";
     });
     _xml += "</day>";
}

 request(pages[0], (error, response, body) => {
     processPage(body, "2017-09-25");
 }).then(() => {
     request(pages[1], (error, response, body) => {
         processPage(body, "2017-09-26");
     }).then(() => {
         request(pages[2], (error, response, body) => {
             processPage(body, "2017-09-27");
             _xml += "</conference>";
             fs.writeFileSync("edui.xml", _xml)
         });
     });
 });
