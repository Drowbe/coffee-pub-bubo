import { Bubo } from './bubo.js'
// import { BUBO } from './const.js'

export class BuboMessage {
    constructor() {
        this.isTemporary = false
        this.isSystemMessage = false
        this.isAnswer = false
        this.showSendButton = false
        this.showStatusIcon = false
        this.isNew = false
        this.isWhisper = false
        this.sender
        this.senderIconClass
        this.content
        this.statusIconClass
        this.question
        this.asker
        this.answerIndex
        this.containerStyle
        this.themeClass
        this.answerFinePrint
    }

    static userMessage(content) {
        let m = new BuboMessage()
        m.isTemporary = false
        m.isSystemMessage = false
        m.isAnswer = false
        m.showSendButton = false
        m.showStatusIcon = false
        m.sender = game.user.name
        m.containerStyle = Bubo.const.MESSAGE_CONTAINER_CSS_OVERRIDE
        m.themeClass = Bubo.const.USER_MESSAGE_CLASS
        m.content = content
        return m
    }

    static systemMessage(content) {
        let m = new BuboMessage()
        m.isTemporary = false
        m.isSystemMessage = true
        m.isAnswer = false
        m.showSendButton = false
        m.showStatusIcon = false
        m.sender = Bubo.const.SYSTEM_MESSAGE_SENDER
        m.senderIconClass = Bubo.const.ICON_NORMAL
        m.containerStyle = Bubo.const.MESSAGE_CONTAINER_CSS_OVERRIDE
        Bubo.log('creating system message', Bubo.settings.chatStyle, Bubo.const.CSS_CLASS_FOR_THEME[Bubo.settings.chatStyle])
        m.themeClass = Bubo.const.CSS_CLASS_FOR_THEME[Bubo.settings.chatStyle]
        m.content = content
        return m
    }

    static thinkingMessage() {
        let m = BuboMessage.systemMessage(Bubo.const.SYSTEM_THINKING_MESSAGE)
        m.isTemporary = true
        m.showStatusIcon = true
        m.statusIconClass = Bubo.const.ICON_THINKING
        return m
    }

    static errorMessage() {
        let m = BuboMessage.systemMessage(Bubo.const.SYSTEM_ERROR_MESSAGE)
        m.showStatusIcon = true
        m.statusIconClass = Bubo.const.ICON_ERROR
        return m
    }

    static answerMessage(content, question, index) {
        let m = BuboMessage.systemMessage(content)
        m.isAnswer = true
        m.showSendButton = true
        m.question = question
        m.asker = game.user.name
        m.answerIndex = index
        m.answerFinePrint = Bubo.const.ANSWER_MESSAGE_FINE_PRINT
        return m
    }

    async sendToChat() {
        let content = await this.htmlForChat()
        ChatMessage.create({
            content: content
        })
    }

    async sendAsWhisperTo(user) {
        let content = await this.htmlForWhisper()
        ChatMessage.create({
            content: content,
            whisper: user,
            blind: true
        })
    }

    async htmlForWhisper() {
        let m = { ...this }
        m.isWhisper = true
        m.showSendButton = false // m.isAnswer // this button doesn't work in chat yet
        m.containerStyle = ''
        m.sender = Bubo.const.SYSTEM_WHISPER_SENDER
        // m.themeClass = Bubo.const.CSS_CLASS_FOR_THEME[Bubo.settings.chatStyle]
        let content = await renderTemplate(Bubo.const.MESSAGE_TEMPLATE, m)
        return content
    }

    async htmlForChat() {
        let m = { ...this }
        m.showSendButton = false
        m.containerStyle = ''
        // m.themeClass = Bubo.const.CSS_CLASS_FOR_THEME[Bubo.settings.chatStyle]
        let content = await renderTemplate(Bubo.const.MESSAGE_TEMPLATE, m)
        return content
    }
}
