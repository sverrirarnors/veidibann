/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Redis } from "@upstash/redis/cloudflare";

import { getHeadline } from './headline';

import { fetchFromRss } from './rss';


export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		
		// Handle CORS preflight request
		if (request.method === 'OPTIONS') {
			return handleOptions(request);
		}

		const redis = Redis.fromEnv(env);

		const url = new URL(request.url);

		const headers = new Headers();
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
		headers.set('Access-Control-Allow-Headers', 'Content-Type');
		headers.set('Access-Control-Max-Age', '86400'); // Cache the preflight response for 24 hours

		try {

			const mblUrl = url.searchParams.get('mblUrl');

			console.log(mblUrl);

			if (!mblUrl) {
				return new Response("Missing mblUrl", { status: 400 })
			}

			const cachedHeadline = await redis.get(mblUrl);

			if (cachedHeadline) {
				return new Response(cachedHeadline, { status: 200, headers })
			}

		const chosenHeadline = await getHeadline(mblUrl, env);

		await redis.set(mblUrl, chosenHeadline);
		
		return new Response(chosenHeadline, { status: 200, headers });
	}
		catch (error) {
			return new Response(error, { status: 500, headers })
		}
	},

	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(fetchFromRss(env));
	}

};

// Function to handle CORS preflight request
function handleOptions(request: Request) {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400'); // Cache the preflight response for 24 hours

    return new Response(null, {
        status: 204,
        headers
    });
}
