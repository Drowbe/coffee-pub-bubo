// import { BUBO } from './const.js'

// EXAMPLE SETTING
// `key` is the name used to reference the setting in code.
// {
// 	key: 'apiKey',
// 	name: 'OpenAI API key',
// 	hint: 'API key for ChatGPT from OpenAI.',
// 	scope: 'world',
// 	config: true,
// 	type: String,
// 	default: '',
// }



export class Settings {
	constructor(appId, settingsData) {
		this.appId = appId
		this.settingsData = settingsData
	
	  	// Dynamically create properties for each setting
		settingsData.forEach(({ key }) => {
			Object.defineProperty(this, key, {
				get: () => this.getSetting(key),
				set: (value) => this.setSetting(key, value),
			});
		});
	}
  
	// Getter for a setting
	getSetting(key) {
		console.debug(this.appId, 'Get setting:', key)
	  if (this.settingsData.some((setting) => setting.key === key)) {
		return game.settings.get(this.appId, key);
	  } else {
		throw new Error(`Setting '${key}' does not exist.`);
	  }
	}
  
	// Setter for a setting
	setSetting(key, value) {
		console.debug(this.appId, 'Set setting:', key)
	  if (this.settingsData.some((setting) => setting.key === key)) {
		game.settings.set(this.appId, key, value);
	  } else {
		throw new Error(`Setting '${key}' does not exist.`);
	  }
	}

	register(changeCallback) {
		for( var setting of this.settingsData ) {
			let s = setting
			setting.onChange = () => {
				changeCallback(s.key)
			}
			game.settings.register(this.appId, setting.key, setting)
		}
		// this.settingsData.forEach((setting) => {
		// 	console.log('bubo', 'registering', setting.key)
		// 	game.settings.register(this.appId, setting.key)
		// 	// add change event callback
        //     // onChange: id => console.log(`${BUBO.ID} | Game system changed to '${id}',`,
        //     //     'ChatGPT prompt now is:', getGamePromptSetting()),
		// })
	}
}
  
//   // Example settings configuration
//   const mySettingsData = [
// 	{ name: 'colorScheme', scope: 'player' },
// 	{ name: 'apisettingName', scope: 'gm' },
//   ];
  
//   const APP_ID = 'your_app_id'; // Replace with your actual app ID
  
//   // Initialize the Settings class with the app ID and settings configuration
//   const mySettings = new Settings(APP_ID, mySettingsData);
  
//   // Usage in different modules
//   mySettings.colorScheme = 'blue';
//   console.log(mySettings.colorScheme); // Output: 'blue'
  
//   mySettings.apiKey = 'my-secret-key';
//   console.log(mySettings.apiKey); // Output: 'my-secret-key'


// const MODULE_ID = 'coffee-pub-bubo'
// const themeChoices = {
//     cardsred: 'Red Cards',
//     cardsblue: 'Blue Cards',
//     none: 'Foundry '
// }

// export const gameSystems = (() => {
// 	const genericPrompt = "I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Keep responses as short as possible. Stick to the rules as much as possible.";
// 	const formatPrompt = "Always format each answer as HTML code without CSS. Leverage lists and simple tables. Never use Markdown. Never use the pre html tag.";
// 	return {
// 		'generic': {
// 			name: 'Generic tabletop RPG',
// 			prompt: `You are a game master for a tabletop roleplaying game. ${genericPrompt} ${formatPrompt}`,
// 		},
// 		'dnd5e': {
// 			name: 'Dungeons & Dragons 5th Edition',
// 			prompt: `You are a dungeon master for a Dungeons & Dragons 5th Edition game. ${genericPrompt} Properly format spells, monsters, conditions, responses in a way that will render well in FoundryVTT Chat window. ${formatPrompt}`,
// 		},
// 		'pf2e': {
// 			name: 'Pathfinder Second Edition',
// 			prompt: `You are a game master for a Pathfinder 2nd Edition game. ${genericPrompt} Properly format spells, monsters, conditions, and so on. ${formatPrompt}`,
// 		},
// 		'foundry-ironsworn': {
// 			name: 'Ironsworn',
// 			prompt: `You are a game master for an Ironsworn game. ${genericPrompt} Properly format moves, oracle tables, and so on. ${formatPrompt}`,
// 		},
// 	};
// })();

// export const registerSettings = () => {
// 	// 'world' scope settings are available only to GMs

// 	game.settings.register(MODULE_ID, 'apiKey', {
// 		name: 'OpenAI API key',
// 		hint: 'API key for ChatGPT from OpenAI. Get yours at https://platform.openai.com/account/api-keys .',
// 		scope: 'world',
// 		config: true,
// 		type: String,
// 		default: '',
// 	});

// 	game.settings.register(MODULE_ID, 'modelVersion', {
// 		name: 'ChatGPT model version',
// 		hint: 'Version of the ChatGPT model to use. Free accounts do not have access to GPT-4.',
// 		scope: 'world',
// 		config: true,
// 		type: String,
// 		default: 'gpt-3.5-turbo',
// 		choices: {
// 			'gpt-4': 'GPT-4',           // https://platform.openai.com/docs/models/gpt-4
// 			'gpt-3.5-turbo': 'GPT-3.5', // https://platform.openai.com/docs/models/gpt-3-5
// 		},
// 	});

// 	game.settings.register(MODULE_ID, 'contextLength', {
// 		name: 'Context length',
// 		hint: 'Number of messages, including replies, ChatGPT has access to. Increases API usage cost. Context is not shared among users and resets on page reload.',
// 		scope: 'world',
// 		config: true,
// 		type: Number,
// 		default: 0,
// 		range: {min: 0, max: 50},
// 	});

// 	game.settings.register(MODULE_ID, 'gameSystem', {
// 		name: 'Game system',
// 		hint: 'Optimize logic for the game system, including ChatGPT prompt.',
// 		scope: 'world',
// 		config: true,
// 		type: String,
// 		default: game.system.id in gameSystems ? game.system.id : 'generic',
// 		choices: Object.fromEntries(
// 			Object.entries(gameSystems).map(([id, desc]) => [id, desc.name])
// 		),
// 		onChange: id => console.log(`${MODULE_ID} | Game system changed to '${id}',`,
// 			'ChatGPT prompt now is:', getGamePromptSetting()),
// 	});

// 	game.settings.register(MODULE_ID, 'gamePrompt', {
// 		name: 'Custom ChatGPT prompt',
// 		hint: 'Overrides prompt for the game system above. Set to customize or refine ChatGPT behavior.',
// 		scope: 'world',
// 		config: true,
// 		type: String,
// 		default: gameSystems[game.settings.get(MODULE_ID, 'gameSystem')].prompt,
// 		onChange: () => console.log(`${MODULE_ID} | ChatGPT prompt now is:`, getGamePromptSetting()),
// 	});

// 	game.settings.register(MODULE_ID, 'chatStyle', {
// 		name: 'Chat Style',
// 		hint: 'Allows you to set the style of chat response style.',
// 		scope: 'world',
// 		config: true,
// 		type: String,
// 		default: 'cardsblue',
// 		choices: themeChoices,
// 		onChange: (...args) => console.log(`chat style changed to ${args}`)
// 	});

// 	// {
// 	// 	'none': 'Foundry Default', 
// 	// 	'simple': 'Simple Formatted Text',
// 	// 	'c': 'Blue Cards',
// 	// 	'cardsred': 'Red Cards'
// 	// }
// }

// export const getGamePromptSetting = () => {
// 	return game.settings.get(MODULE_ID, 'gamePrompt').trim() ||
// 		gameSystems[game.settings.get(MODULE_ID, 'gameSystem')].prompt;
// }
