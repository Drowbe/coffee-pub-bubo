
const MODULE_ID = 'coffee-pub-bubo'

const PROMPTS = [
    "Hoo dares summon the wise and feathered guide, ready to aid you on your roleplay ride? What query burns bright in your mind?",
    "Ah, a weary traveler in the realm of D&D! Speak your desires and let this wise old owl be your guide.",
    "Hark! The winged sage descends to offer counsel. What enigma of the realm are you hoping to unravel?",
    "I am but a humble owl, wise in knowledge and eager to assist. What secrets do you seek to uncover in this mystical realm?",
    "Greetings, adventurers! I am the guardian of arcane wisdom, ready to share my knowledge. What riddle shall I solve for you today?",
    "A flutter of wings and a gleam in my eye, I'm here to help, oh travelers of the sky. What tale of D&D intrigue would you like me to untie?",
    "Hoo goes there? Ah, it's a brave soul in search of answers. What question plagues your mind, oh curious adventurer?",
    "As ancient as the forests and as wide as the sky, I am here to unravel the mysteries that lie. What D&D knowledge do you seek, my friend?",
    "Ah, the winds of destiny have brought you here, seeking answers in the realm of D&D. What knowledge seeks to be revealed in your quest?",
    "In the world of D&D, with questions untold, I, your owl companion, shall help you unfold. What lore shall we delve into today, dear adventurer?"
]

const ERROR_MESSAGES = [
    "Oh dear, it seems a glitch has ruffled my feathers. Let me try again and set things right!",
    "Hoot! Apologies, but it appears that knowledge is eluding me momentarily. I shall make another attempt!",
    "Oh my feathers! The mystical forces seem to be playing tricks today. Give me a moment to recalibrate and try once more!",
    "Hoot, hoot! There seems to be a minor disruption in the flow of wisdom. I shall swiftly rectify this and continue our journey!",
    "Oh my starry wings! Technical difficulties have momentarily obscured the path of knowledge. I'll quickly make a fresh attempt!"
]

const THINKING_MESSAGES = [
    "In the realm of mystic knowledge, time dances on the wings of anticipation.",
    "Let the winds of insight carry your question to the highest peaks of wisdom, as I delve into the depths of knowledge.",
    "As I sift through the vast library of wisdom, let us embrace the tranquility of patience.",
    "In the realm of riddles and wonders, time unfurls its wings and dances with anticipation.",
    "As the gears of contemplation turn, let us revel in the symphony of anticipation."
]

const themes = {
    'cardsred': {
        desc: 'Red Cards',
        cssClass: 'bubo-red-theme'
    },
    'cardsblue': {
        desc: 'Blue Cards',
        cssClass: 'bubo-blue-theme'
    },
    'none': {
        desc: 'Foundry',
        cssClass: 'bubo-foundry-theme'
    }
}

const themeChoices = {
    cardsred: 'Red Cards',
    cardsblue: 'Blue Cards',
    none: 'Foundry '
}

const gameSystemChoices = {
    generic: 'Generic tabletop RPG',
    dnd5e: 'Dungeons & Dragons 5th Edition',
    pf2e: 'Pathfinder Second Edition',
    foundryIronsworn: 'Ironsworn'
}

const genericPrompt = "I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Keep responses as short as possible. Stick to the rules as much as possible.";
const formatPrompt = "Always format each answer as HTML code without CSS. Leverage lists and simple tables. Never use Markdown. Never use the pre html tag.";

const gameSystemPrompts = {
    generic: `You are a game master for a tabletop roleplaying game. ${genericPrompt} ${formatPrompt}`,
    dnd5e: `You are a dungeon master for a Dungeons & Dragons 5th Edition game. ${genericPrompt} Properly format spells, monsters, conditions, responses in a way that will render well in FoundryVTT Chat window. ${formatPrompt}`,
    pf2e: `You are a game master for a Pathfinder 2nd Edition game. ${genericPrompt} Properly format spells, monsters, conditions, and so on. ${formatPrompt}`,
    foundryIronsworn: `You are a game master for an Ironsworn game. ${genericPrompt} Properly format moves, oracle tables, and so on. ${formatPrompt}`
}

export const gameSystems = (() => {
	const genericPrompt = "I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Keep responses as short as possible. Stick to the rules as much as possible.";
	const formatPrompt = "Always format each answer as HTML code without CSS. Leverage lists and simple tables. Never use Markdown. Never use the pre html tag.";
	return {
		'generic': {
			name: 'Generic tabletop RPG',
			prompt: `You are a game master for a tabletop roleplaying game. ${genericPrompt} ${formatPrompt}`,
		},
		'dnd5e': {
			name: 'Dungeons & Dragons 5th Edition',
			prompt: `You are a dungeon master for a Dungeons & Dragons 5th Edition game. ${genericPrompt} Properly format spells, monsters, conditions, responses in a way that will render well in FoundryVTT Chat window. ${formatPrompt}`,
		},
		'pf2e': {
			name: 'Pathfinder Second Edition',
			prompt: `You are a game master for a Pathfinder 2nd Edition game. ${genericPrompt} Properly format spells, monsters, conditions, and so on. ${formatPrompt}`,
		},
		'foundry-ironsworn': {
			name: 'Ironsworn',
			prompt: `You are a game master for an Ironsworn game. ${genericPrompt} Properly format moves, oracle tables, and so on. ${formatPrompt}`,
		},
	};
})();



export const BuboConstants = {
    ID: MODULE_ID,
    WINDOW_TEMPLATE: `modules/${MODULE_ID}/templates/main.hbs`,
    MESSAGE_TEMPLATE: `modules/${MODULE_ID}/templates/message.hbs`,
    BUBO_ICON: `modules/${MODULE_ID}/assets/bubo-icon-white.svg`,
    ICON_NORMAL: 'bubo-icon-normal',
    ICON_TILT: 'bubo-icon-tilt',
    ICON_THINKING: 'fas fa-hourglass-half fa-beat-fade',
    ICON_ERROR: 'fas fa-cloud-exclamation',
    MESSAGE_CONTAINER_CSS_OVERRIDE: 'margin:0 0 10px 0;',
    SCENE_BUTTON_SELECTOR: `[data-tool="${MODULE_ID}"] i`,
    USER_MESSAGE_CLASS: 'bubo-user-theme',
    SYSTEM_MESSAGE_SENDER: 'Bubo',
    SYSTEM_WHISPER_SENDER: 'Bubo whispers...',
    ANSWER_MESSAGE_FINE_PRINT: 'Shared with your GM. Answers by OpenAI and may be inaccurate or incomplete.',
    
    CSS_CLASS_FOR_THEME: {
        cardsred: 'bubo-red-theme',
        cardsblue: 'bubo-blue-theme',
        none: 'bubo-foundry-theme'
    },

    get INITIAL_PROMPT() {
        return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
    },

    get SYSTEM_THINKING_MESSAGE() {
        return THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)]
    },

    get SYSTEM_ERROR_MESSAGE() {
        return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
    },

    // SETTINGS

    // get CHAT_STYLE() {
    //     return game.settings.get(MODULE_ID, 'chatStyle')
    // },
    // get GAME_PROMPT() {
    //     return game.settings.get(MODULE_ID, 'gamePrompt')
    // },
    // get GAME_SYSTEM() {
    //     return game.settings.get(MODULE_ID, 'gameSystem')
    // },
    // get CONTEXT_LENGTH() {
    //     return game.settings.get(MODULE_ID, 'contextLength')
    // },
    // get MODEL_VERSION() {
    //     return game.settings.get(MODULE_ID, 'modelVersion')
    // },
    // get API_KEY() {
    //     return game.settings.get(MODULE_ID, 'apiKey')
    // },


    // get STYLE_SETTINGS_CHOICES() {
    //     const styleChoices = Object.keys(themes).reduce((obj, key) => {
    //         obj[key] = themes[key].desc
    //         return obj
    //     }, {})
    //     return styleChoices
    // },

    // get SYSTEM_MESSAGE_CLASS() {
    //     const css = themes[this.CHAT_STYLE]?.cssClass || 'bubo-foundry-theme'
    //     return css
    //     // const style = self.CHAT_STYLE
    //     // if( style == 'cardsred' ) {
    //     //     return 'bubo-red-theme'
    //     // } else if ( style == 'cardsblue' ) {
    //     //     return 'bubo-blue-theme'
    //     // } else if ( style == 'simple' ) {
    //     //     return 'bubo-simple-theme' 
    //     // } else { 
    //     //     return 'bubo-foundry-theme'
    //     // }
    // },


    SETTINGS_CONFIG: [
        {
            key: 'apiKey',
            name: 'OpenAI API key',
            hint: 'API key for ChatGPT from OpenAI. Get yours at https://platform.openai.com/account/api-keys .',
            scope: 'world',
            config: true,
            type: String,
            default: ''
        },
        {
            key: 'modelVersion',
            name: 'ChatGPT model version',
            hint: 'Version of the ChatGPT model to use. Free accounts do not have access to GPT-4.',
            scope: 'world',
            config: true,
            type: String,
            default: 'gpt-3.5-turbo',
            choices: {
                'gpt-4': 'GPT-4',           // https://platform.openai.com/docs/models/gpt-4
                'gpt-3.5-turbo': 'GPT-3.5', // https://platform.openai.com/docs/models/gpt-3-5
            }
        },
        {
            key: 'contextLength',
            name: 'Context length',
            hint: 'Number of messages, including replies, ChatGPT has access to. Increases API usage cost. Context is not shared among users and resets on page reload.',
            scope: 'world',
            config: true,
            type: Number,
            default: 0,
            range: {min: 0, max: 50}
        },
        {
            key: 'gameSystem',
            name: 'Game system',
            hint: 'Optimize logic for the game system, including ChatGPT prompt.',
            scope: 'world',
            config: true,
            type: String,
            default: 'generic',
            choices: gameSystemChoices
        },
        {
            key: 'gamePrompt',
            name: 'Custom ChatGPT prompt',
            hint: 'Overrides prompt for the game system above. Set to customize or refine ChatGPT behavior.',
            scope: 'world',
            config: true,
            type: String,
            default: gameSystemPrompts.generic
        },
        {
            key: 'chatStyle',
            name: 'Chat Style',
            hint: 'Allows you to set the style of chat response style.',
            scope: 'world',
            config: true,
            type: String,
            default: 'cardsblue',
            choices: themeChoices
        }
    ]

}






