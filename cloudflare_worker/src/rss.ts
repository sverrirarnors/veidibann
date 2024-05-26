import { Redis } from "@upstash/redis/cloudflare";
import { XMLParser } from 'fast-xml-parser';
import { getHeadline } from './headline';

const options = {
    ignoreAttributes:false
};

const parser = new XMLParser(options);

export async function fetchFromRss(env: Env) {
    const rssFeed = "https://www.mbl.is/feeds/fp/";

    const response = await fetch(rssFeed);
    let xmlData = await response.text();
    let data = parser.parse(xmlData);

    const rssData =  data.rss.channel.item;


    const redis = Redis.fromEnv(env);

    for (const item of rssData) {
        const mblUrl = item.link;
        const cachedHeadline = await redis.get(mblUrl);
        if (!cachedHeadline) {
            const chosenHeadline = await getHeadline(mblUrl, env);
            await redis.set(mblUrl, chosenHeadline);
        }
    }
}