import * as fs from "fs";
import * as cheerio from "cheerio";

const file: string = fs.readFileSync("../edui.xml", "utf-8");
const xml: CheerioStatic = cheerio.load(file);
