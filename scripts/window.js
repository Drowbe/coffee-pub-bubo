import { Bubo } from './bubo.js'
// import { BUBO } from './const.js'
import { getGptReplyAsHtml } from './gpt-api.js';
import { BuboMessage } from './message.js';

export class BuboWindow extends FormApplication {

    constructor() {
        super()
        this.messages = [BuboMessage.systemMessage(Bubo.const.INITIAL_PROMPT)]
        this.onClose
        this.currentQuestion
        this.scrollHeightAtLastRender = 0
        this.answers = []
        this.inputEnabled = true
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions
        const overrides = {
            height: 'auto',
            width: 500,
            id: Bubo.const.ID,
            template: Bubo.const.WINDOW_TEMPLATE,
            title: 'Ask Bubo',
            closeOnSubmit: false,
            scrollY: ['#bubo-messages-section']
            // resizable: true
        };
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides)
        return mergedOptions
    }

    close() {
        Bubo.log('window close')
        super.close()
        if(this.onClose !== undefined) {
            this.onClose()
        }
    }

    async _render(force=false, options={}) {
        await super._render(force, options)
        var messagesSection = $('#bubo-messages-section')[0]
        if( messagesSection ) {
            var lastTop = this.scrollHeightAtLastRender - messagesSection.offsetHeight
            var newTop = messagesSection.scrollHeight - messagesSection.offsetHeight
            messagesSection.scrollTop = lastTop
            messagesSection.scrollTo({top: newTop, behavior: 'smooth'})
            // Bubo.log('current h:', messagesSection.scrollHeight, ', last h: ', this.scrollHeightAtLastRender, ', new top: ', messagesSection.scrollTop)
            this.scrollHeightAtLastRender = messagesSection.scrollHeight
        }

        const input = $($('#bubo-input-bar input')[0])
        const sendButton = $($('#bubo-input-bar button')[0])
        input.disabled = !this.inputEnabled
        sendButton.disabled = !this.inputEnabled

        if(this.inputEnabled) {
            input.focus()
            input.keydown((event) => {
                if(event.key === 'Enter') {
                    Bubo.log('ENTER KEY')
                    event.preventDefault()
                    sendButton.click()
                }
            })
        }

        setTimeout(() => {
            $('#bubo-messages-section > div').each((index, m) => {
                $(m).removeClass('bubo-message-new')
            })
            this.messages.forEach((m) => {
                m.isNew = false
            })
        }, 50);
    }

    getData(options) {
        Bubo.debug('getData', options)
        return {
            messages: this.messages
        }
    }

    activateListeners(html) {
        let input = $(html.find('#bubo-input-bar input')[0])
        input.keydown((e) => {
            if( e.keyCode == 27 ) {
                this.close()
            }
        })
    }

    addMessage(message) {
        message.isNew = true
        this.messages.push(message)
    }

    async startQuery(query) {
        this.inputEnabled = false

        // add the user message
        this.currentQuestion = query
        this.addMessage(BuboMessage.userMessage(query))
        this.render()

        // pause then add the thinking message
        await this.sleep(1000)
        this.addMessage(BuboMessage.thinkingMessage())
        this.render()

        this.submitQuery(query)
    }

    async _updateObject(event, formData) {
        Bubo.log('_updateObject', event, formData)

        // if button is a send-to-chat-button do that and bounce
        const button = $(event.submitter)
        const answerIndex = button.attr('answerindex')
        if(answerIndex !== null && answerIndex !== undefined) { 
            let answer = this.answers[answerIndex]
            answer.sendToChat()
            return 
        }

        // otherwise, assume we're handling a user question 
        var q = formData.query
        if(q === undefined || q === "") { return }
        this.startQuery(q)
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async submitQuery(query) {
        Bubo.log('submitQuery')
        // answer = BuboMessage.answerMessage("This is the answer to the question that was asked at some length to test things out as a test.", "This is a test question?", this.answers.length)
        // this.answers.push(answer)
        // this.addMessage(answer)
        // this.inputEnabled = true
        // this.render()
        // return 

        // simulated query if needed: await this.sleep(2000)
        // await this.sleep(2000)

        let gptReply
        try {
            // throw new Error('test gpt query fail')
            gptReply = await getGptReplyAsHtml(query);
        } catch (e) {
            Bubo.log('gpt query failed', e);
            ui.notifications.error(e.message, {permanent: false, console: false});
        }

        // if the last message was a temp "thinking" message (it should be), pop it out
        let last = this.messages[this.messages.length-1]
        if( last.isTemporary ) {
            this.messages.pop()
        }

        var answer
        if( gptReply ) {
            Bubo.log('gpt query success', gptReply)
            answer = BuboMessage.answerMessage(gptReply, this.currentQuestion, this.answers.length)
            this.answers.push(answer)

            // whisper answer to GM
            answer.sendAsWhisperTo(ChatMessage.getWhisperRecipients('GM'))
        } else {
            answer = BuboMessage.errorMessage()
        }
        this.addMessage(answer)
        this.inputEnabled = true
        this.render()
    }


    updateMessageStyle() {

    }


}
