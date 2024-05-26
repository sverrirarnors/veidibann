import OpenAI from 'openai';

import Scraper from './scraper';

export async function getHeadline(mblUrl: string, env: any): Promise<string> {

    const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: "https://gateway.ai.cloudflare.com/v1/ceb27a514b0d1da0b2f64d8a59d927b7/veidibann/openai",
    })

    const scraper = await new Scraper().fetch(mblUrl);

    const headlineSelector = ".newsitem-main > h1";
    const bodySelector = ".main-layout > p";

    const elements = await scraper.querySelector(`${headlineSelector}, ${bodySelector}`).getText({ spaced: false });

    const headline = elements[headlineSelector][0];

    const mainContent = elements[bodySelector].join("\n");

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        n: 3,
        messages: [
            {
                role: "system",
                content: `
You are a journalist writing a news article. The headline below is clickbait and you need to rewrite it to be more informative.
You will receive a headline and the article. Your goal is to rewrite the headline to be more informative and less sensational.
Respect Icelandic grammar, spelling, and capitalization rules.
If the article is not clickbait and represents the article well, you should return the original headline.
Please return a single headline in Icelandic formatted as the value of a json object with the key being \`headline\`.
                `,
            },
            { role: "user", content: `Headline: ${headline}\nArticle: ${mainContent}` },
        ],
    });

    const chatCompletionData = await chatCompletion.choices;

    const choiceCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        n: 3,
        messages: [
            {
                role: "system",
                content: `
I will give you three headlines in Icelandic, and the article that corresponds to them. Please choose the headline that best represents the article.
Return as json with a single key (headline) with the value being the chosen headline.
                `,
            },
            {
                role: "user",
                content: `Headlines: ${chatCompletionData.map((choice: any) => choice.message.content).join("\n")}\nArticle: ${mainContent}`,
            },
        ],
    });

    const choiceCompletionData = await choiceCompletion.choices;

    const chosenHeadline = JSON.parse(choiceCompletionData[0].message.content).headline;

    return chosenHeadline;
}

