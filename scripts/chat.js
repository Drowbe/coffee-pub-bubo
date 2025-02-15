// NOT USED CURRENTLY

import { Bubo } from './bubo.js'
// import { BUBO } from './const.js'
import { BuboMessage } from './message.js'
import { getGptReplyAsHtml } from './gpt-api.js';

export class BuboChatbot {
    constructor() {
        this.onChatCommand
    }

    async registerCommand() {
        // Hooks.on("chatCommandsReady", (chatCommands) => {
        //     Bubo.log('chat commands ready', chatCommands)
        //     chatCommands.registerCommand(chatCommands.createCommandFromData({
        //         module: BUBO.ID,
        //         commandKey: "/bubo",
        //         shouldDisplayToChat: false,
        //         iconClass: "fa-circle-question",
        //         description: "Ask Bubo",
        //         gmOnly: false,
        //         invokeOnCommand: (chatlog, messageText, chatdata) => {
        //             this.onChatCommand(messageText)
        //         },
        //     }));
        // })
    }

    async handleQuery(query) {
        BuboMessage.thinkingMessage().sendAsWhisperTo(game.user)
        let gptReply
        try {
            throw new Error('test gpt query fail')
            gptReply = await getGptReplyAsHtml(query);
        } catch (e) {
            Bubo.log('gpt query failed', e);
            ui.notifications.error(e.message, {permanent: false, console: false});
        }

        var answer
        if( gptReply ) {
            Bubo.log('gpt query success', gptReply)
            answer = BuboMessage.answerMessage(gptReply, query, 0)
            // if( !game.user.isGM ) {
            //     answer.sendAsWhisperTo(game.user)
            // }
            answer.sendAsWhisperTo(ChatMessage.getWhisperRecipients('GM'))
        } else {
            BuboMessage.errorMessage().sendAsWhisperTo(game.user)
        }

    }

    // processCommand(chatLog, message, chatData) {
    //     Bubo.log("Invoked /bubo", message)

    // }

    // async processChatMessage(message, chatData) {
    //     Bubo.log('chat message', message, chatData)
    //     if(message.startsWith('/bubo') || message.startsWith('/w bubo')) {
    //         chatData.content = 'do not read'
    //         chatData.type = 0
    //         await ChatMessage.create(chatData)
    //         return false
    //     }
    //     return true

    //     //Grab some of the settings to personalize the bot
    //     const strChatStyle = game.settings.get(moduleName, 'chatStyle');
    //     const strBotName = game.settings.get(moduleName, 'botName');
    //     const strIconStyle = game.settings.get(moduleName, 'iconStyle');
    //     const echoChatMessage = async (chatData, question) => {
    //         const toGptHtmlBefore = `<div id="chatboxgpt-question-wrappper-${strChatStyle}"><h1><i class="fas ${strIconStyle}" id="chatboxgpt-question-icon-${strChatStyle}"></i>${strBotName} is Thinking...</h1><div id="chatboxgpt-question-content-${strChatStyle}"><b>Someone Asked:</b> `;
    //         const toGptHtmlAfter = `<h3>OpenAI is generating the results... be patient as this could take up to a minute.</h3></div></div>`;
    //         chatData.content = `${toGptHtmlBefore}${question.replace(/\n/g,)}${toGptHtmlAfter}`;
    //         await ChatMessage.create(chatData);
    //     };

    //     let match;

    //     const reWhisper = new RegExp(/^(\/w(?:hisper)?\s)(\[(?:[^\]]+)\]|(?:[^\s]+))\s*([^]*)/, "i");
    //     match = message.match(reWhisper);
    //     if (match) {
    //         const gpt = 'gpt';
    //         const userAliases = match[2].replace(/[[\]]/g, "").split(",").map(n => n.trim());
    //         const question = match[3].trim();

    //         if (userAliases.some(u => u.toLowerCase() === gpt)) {
    //             const users = userAliases
    //                 .filter(n => n.toLowerCase() !== gpt)
    //                 .reduce((arr, n) => arr.concat(ChatMessage.getWhisperRecipients(n)), [game.user]);

    //             // same error logic as in Foundry
    //             if (!users.length) throw new Error(game.i18n.localize("ERROR.NoTargetUsersForWhisper"));
    //             if (users.some(u => !u.isGM && u.id != game.user.id) && !game.user.can("MESSAGE_WHISPER")) {
    //                 throw new Error(game.i18n.localize("ERROR.CantWhisper"));
    //             }

    //             chatData.type = CONST.CHAT_MESSAGE_TYPES.WHISPER;
    //             chatData.whisper = users.map(u => u.id); // <--------- Hiding turns off WHISPER
    //             chatData.sound = CONFIG.sounds.notification;
    //             echoChatMessage(chatData, question);
    //             respondTo(question, users);

    //             // prevent further processing, since an unknown whisper target would trigger an error
    //             return false;
    //         }
    //     }

    //     const rePublic = new RegExp(/^(\/\?\s)\s*([^]*)/, "i");
    //     match = message.match(rePublic);
    //     if (match) {
    //         const question = match[2].trim();

    //         echoChatMessage(chatData, question);
    //         respondTo(question, []);

    //         // prevent further processing, since an unknown command would trigger an error
    //         return false;
    //     }

    //     return true;
    // }

    // async respondTo(question, users) {
    //     console.debug(`${moduleName} | respondTo(question = "${question}", users =`, users, ')');
    //     try {
    //         // const reply = await getGptReplyAsHtml(question);
    //         const reply = 'test output'
    //         const abbr = "By ChatGPT. Statements may be false";
    
    //         //Grab some of the settings to personalize the bot
    //         const strChatStyle = game.settings.get(moduleName, 'chatStyle');
    //         const strBotName = game.settings.get(moduleName, 'botName');
    //         const strIconStyle = game.settings.get(moduleName, 'iconStyle');
    
    //         await ChatMessage.create({
    //             user: game.user.id,
    //         //	speaker: ChatMessage.getSpeaker({alias: 'Ask Coffee Pub'}), // I COMMENTED THIS OUT
    //             content: `<div title="${abbr}" id="chatboxgpt-answer-wrappper-${strChatStyle}"><h1><i class="fas ${strIconStyle}" id="chatboxgpt-question-icon-${strChatStyle}"></i>${strBotName}'s Research</h1><div id="chatboxgpt-answer-description-${strChatStyle}"><h2><b>Answering: </b> "${question}" for <span class="chatboxGMGPTuser-${strChatStyle}">${game.user.name}</span>.</h2></div><div id="chatboxgpt-answer-content-${strChatStyle}">${reply}<h3>Results were generated by OpenAI, so information may be innacurate or incomplete.</h3></div></div>`,
    //             whisper: users.map(u => u.id), // <--------- Hiding turns off WHISPER
    //             sound: CONFIG.sounds.notification,
    //         });
    //     } catch (e) {
    //         console.error(`${moduleName} | Failed to provide response.`, e);
    //         ui.notifications.error(e.message, {permanent: true, console: false});
    //     }
    // }
    
}