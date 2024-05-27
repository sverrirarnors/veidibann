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
        messages: [
            {
                role: "system",
                content: `
Þú ert blaðamaður hjá virtu íslensku tímariti. Fyrir neðan er grein. Upprunalega fyrirsögnin var óljós, ekki lýsandi fyrir greinina, og gerð til þess að fólk smelli á hana til að komast að því um hvað hún er.
Þú átt að búa til nýja fyrirsögn sem er skýrari og gefur betri upplýsingar um greinina, án þess að fyrirsögnin sé of löng.
Vinsamlegast skrifaðu fyrirsögnina á góðri íslensku með réttri stafsetningu og málfræði.
Þú átt að skila einni fyrirsögn, og engu öðru; engum gæsalöppum utan um fyrirsögnina eða neitt.`,
            },
            { role: "user", content: `Fyrirsögn: ${headline}\nGrein: ${mainContent}` },
        ],
    });

    const chatCompletionData = chatCompletion.choices;

    const chosenHeadline = chatCompletionData[0].message.content;

    if (!chosenHeadline) {
        throw new Error("No headline found");
    }

    return chosenHeadline;
}

