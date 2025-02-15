import { BuboWindow } from './window.js'
import { BuboChatbot } from './chat.js'
import { BuboConstants } from './const.js'
import { Settings } from './settings.js';
// import { registerSettings } from './settings.js';

export class Bubo {

    static _settings = new Settings(BuboConstants.ID, BuboConstants.SETTINGS_CONFIG)
    static get settings() {
        return this._settings
    }

    static _const = BuboConstants
    static get const() {
        return this._const
    }

    static log(...args) {
        console.log(this.const.ID, ...args);
    }

    static warn(...args) {
        console.warn(this.const.ID, ...args)
    }

    static error(...args) {
        console.error(this.const.ID, ...args)
    }

    static debug(...args) {
        console.debug(this.const.ID, ...args)
    }

    constructor() {
        this.appWindow
        this.chatbot
        this.lastMessageStyleClass
    }    

    start() {
        Bubo.debug('start')
        this.chatbot = new BuboChatbot()
        this.chatbot.registerCommand()
        this.chatbot.onChatCommand = (message) => {
            this.chatCommand(message)
        }

        Hooks.once('init', () => {
            Bubo.debug('init')
            Bubo.settings.register(this.settingChanged)
            getTemplate(Bubo.const.WINDOW_TEMPLATE)
            getTemplate(Bubo.const.MESSAGE_TEMPLATE, 'message')
        })
        
        Hooks.on('getSceneControlButtons', (controls) => {
            // Bubo.log('getSceneControlButtons b', controls)
            const parent = controls.find(c => c.name === "token")
            var buboControl = parent.tools.find(c => c.name === Bubo.const.ID)
        
            if (buboControl === undefined) {
                // Bubo.log("adding scene button")
                buboControl = {
                    active: false,
                    icon: "bubo-icon-normal",
                    name: Bubo.const.ID,
                    title: "Ask Bubo",
                    onClick: () => { this.toolbarButtonClick() }
                }
                parent.tools.push(buboControl)
            }
        })
        
        Hooks.on('ready', () => {
            Bubo.debug('ready')
            // this.toggleWindow()
        })

        Hooks.on('renderSettingsConfig', (_settingsConfig, element, _data) => {
            Bubo.debug('renderSettingsConfig: ', _settingsConfig, element, _data)
            this.lastMessageStyleClass = Bubo.const.SYSTEM_MESSAGE_CLASS
            // let apiKeyInput = element.find(`input[name='${BUBO.ID}.apiKey']`)[0]
            // if (apiKeyInput) {
            //     // apiKeyInput.type = 'password'
            //     apiKeyInput.autocomplete = 'one-time-code'
            // }
        })
    
        // Hooks.on('updateSetting', (setting, value, diff, foo) => {
        //     if( setting.key == `${Bubo.const.ID}.chatStyle` ) {
        //         cssClass = 
        //         Bubo.debug('message class changed from', this.lastMessageStyleClass, 'to', Bubo.const.SYSTEM_MESSAGE_CLASS)
        //         var elements = $(`.${this.lastMessageStyleClass}`)
        //         elements.removeClass(this.lastMessageStyleClass).addClass(Bubo.const.SYSTEM_MESSAGE_CLASS)
        //     } else {
        //     }
        // })
    }

    settingChanged(setting) {
        Bubo.debug('setting', setting, 'changed to', Bubo.settings[setting])
    }

    chatCommand(message) {
        Bubo.debug('chat command, message =', message)
        if( !message ) {
            this.toggleWindow()
        } else {
            this.showWindow()
            this.appWindow.startQuery(message)
            // this.chatbot.handleQuery(message)

        }
    }

    toolbarButtonClick() {
        // if we have a window now we're about to close it, so remove active
        let active = !this.hasWindow()
        setTimeout(() => {
            let sceneButton = $($(Bubo.const.SCENE_BUTTON_SELECTOR)[0])
            if( active ) {
                sceneButton.removeClass(Bubo.const.ICON_NORMAL).addClass(Bubo.const.ICON_TILT)
            } else {
                sceneButton.removeClass(Bubo.const.ICON_TILT).addClass(Bubo.const.ICON_NORMAL)
            }
        }, 200)
        this.toggleWindow()
    }

    hasWindow() {
        // Bubo.log('hasWindow', this.appWindow, this.appWindow !== undefined)
        return this.appWindow !== undefined
    }

    windowClosed() {
        Bubo.debug('windowClosed')
        this.appWindow = undefined
        let sceneButton = $($(Bubo.const.SCENE_BUTTON_SELECTOR)[0])
        sceneButton.removeClass(Bubo.const.ICON_TILT).addClass(Bubo.const.ICON_NORMAL)
    }

    showWindow() {
        if(this.hasWindow()) {
            this.appWindow.bringToTop()
        } else {
            this.toggleWindow()
        }
    }

    toggleWindow() {
        if(this.hasWindow()) {
            this.appWindow.close()    
        }
        else {
            this.appWindow = new BuboWindow()
            this.appWindow.onClose = () => { this.windowClosed() }
            this.appWindow.render(true)
        }    
    }

    
}
