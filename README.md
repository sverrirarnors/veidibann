![Logo fyrir veiðibann](./extension/icon128.png)

# Veiðibann

Tired of clickbait headlines on mbl.is? Veiðibann uses GPT-4o to rewrite headlines on mbl.is to make them more descriptive and clear.

## Where does this work?

At the moment this is only set up for mbl.is and Chrome, but it should be easy to adapt this to other browsers and news sites because of the simplicity of the project.

## How do I set this up?

After cloning the repository, you can [go to Chrome's extension settings](chrome://extensions/), click "Load unpacked" and select the "extension" folder within the repository. After that, you have to reload Chrome.

## How does this work?

The backend uses [Cloudflare Workers](https://workers.cloudflare.com/) and [OpenAI's GPT-4o](https://openai.com/index/hello-gpt-4o/) to rewrite unclear headlines. A very simple browser extension talks to this backend to replace the headlines with more clear ones, and caches them in the local storage to minimize the number of requests.

Here's an example of an unclear headline that Veiðibann makes more clear.

![Tvær útgáfur af fyrisögnum](./screenshot.png)
