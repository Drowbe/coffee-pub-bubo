// import { moduleName, getGamePromptSetting } from './settings.js';
import { Bubo } from './bubo.js';
import { pushHistory } from './history.js';


async function callGptApi(query) {
	const apiKey = Bubo.settings.apiKey
	const model = Bubo.settings.modelVersion
	const prompt = Bubo.settings.gamePrompt
	const apiUrl = 'https://api.openai.com/v1/chat/completions';
	const promptMessage = {role: 'user', content: prompt};
	const queryMessage = {role: 'user', content: query};
	const messages = pushHistory().concat(promptMessage, queryMessage);

	const requestBody = {
		model,
		messages,
		temperature: 0.1,
	};

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`,
		},
		body: JSON.stringify(requestBody),
	};

	const is4xx = c => c >= 400 && c < 500;
	const handleFailedQuery = async (response, msg) => {
		let err = `${response?.status}`;
		try {
			const data = await response.json();
			Bubo.log(`callGptApi(): failure data =`, data);
			err = `${data?.error?.message} (${err})`;
		} catch (e) {
			Bubo.warn(`Could not decode failed API response.`, e);
		}
		throw new Error(`${msg}: ${err}`);
	};

	let response = {};
	for (
		let retries = 0, backoffTime = 5000;
		retries < 5 && !response?.ok;
		retries++, await new Promise(r => setTimeout(r, backoffTime))
	) {
		Bubo.log(`callGptApi(): waiting for reply (tries: ${retries})`);
		response = await fetch(apiUrl, requestOptions);
		Bubo.log(`callGptApi(): response =`, response);
		if (response?.status && is4xx(response?.status)) {
			await handleFailedQuery(response, "ChatGPT API failed");
		}
	}

	if (response?.ok) {
		const data = await response.json();
		// Bubo.log(`callGptApi(): response data =`, data);

		const replyMessage = data.choices[0].message;
		pushHistory(queryMessage, replyMessage);
		return replyMessage.content.trim();
	} else {
		await handleFailedQuery(response, "ChatGPT API failed multiple times");
	}
}

export async function getGptReplyAsHtml(query) {
	const answer = await callGptApi(query);
	// Bubo.log(`|${answer}|`)
	var html = /<\/?[a-z][\s\S]*>/i.test(answer) || !answer.includes('\n') ?
		answer : answer.replace(/\n/g, "<br>");
	return html.replaceAll("<p></p>", "").replace("```html", "").replace("```")
}
