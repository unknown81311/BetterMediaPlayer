/**
 * @name        BetterMediaPlayer
 * @displayName adds more/better functionality to the media player
 * @author      unknown81311_&_Doggybootsy
 * @authorId    359174224809689089_&_515780151791976453
 * @version     1.0.0
 * @source      https://github.com/unknown81311/BetterMediaPlayer
 * @updateUrl   https://raw.githubusercontent.com/unknown81311/BetterMediaPlayer/main/BetterMediaPlayer.plugin.js
*/
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell")
    var fs = new ActiveXObject("Scripting.FileSystemObject")
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins")
    var pathSelf = WScript.ScriptFullName
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30)
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40)
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10)
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true)
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins)
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40)
    }
    WScript.Quit()
@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "Better Media Player",
            authors: [
                {
                    name: "unknown81311",
                    discord_id: "359174224809689089",
                    github_username: "unknown81311"
                },
                {
                    name: "Doggybootsy",
                    discord_id: "515780151791976453",
                    github_username: "Doggybootsy"
                }
            ],
            version: "1.1.0",
            description: "Add more features to the media player in discord",
            github: "https://github.com/unknown81311/BetterMediaPlayer",
            github_raw: "https://raw.githubusercontent.com/unknown81311/BetterMediaPlayer/main/BetterMediaPlayer.plugin.js"
        },
        changelog: [
            {
                "title": "Change(s)...",
                "type": "improved",
                "items": [
                    "Mostly use's react instead of dom",
                    "A lightcord warning"
                ]
            }
        ],
        defaultConfig: [
            {
                type: "switch",
                id: "button_loop",
                name: "Add a Loop button",
                note: "Loop videos in a simple click",
                value: true,
            },
            {
                type: 'slider',
                id: 'position_loop',
                name: 'Position for loop',
                note: 'Move the loop button to different spots',
                value: 1,
                markers: [1, 2, 3, 4, 5, 6],
                stickToMarkers: true
            },
            {
                type: "switch",
                id: "auto_loop",
                name: "Automatically loop videos",
                note: "Loop videos w/o clicking a button",
                value: true,
            },
            {
                type: "switch",
                id: "PIP",
                name: "Add a PIP button",
                note: "Picture In Picture in a simple click",
                value: true
            },
            {
                type: 'slider',
                id: 'position_PIP',
                name: 'Position for PIP',
                note: 'Move the PIP button to different spots',
                value: 1,
                markers: [1, 2, 3, 4, 5, 6],
                stickToMarkers: true
            }
        ]
    }
    return (window.Lightcord || window.LightCord) ? class {
        // stolen from DevilBro
		getName () {return config.info.name}
		getAuthor () {return config.info.author}
		getVersion () {return config.info.version}
		getDescription () {return `${config.info.description}\nDo not use LightCord!`}
		load () {BdApi.alert("Attention!", "By using LightCord you are risking your Discord Account, due to using a 3rd Party Client. Switch to an official Discord Client (https://discord.com/) with the proper BD Injection (https://betterdiscord.app/)")}
		start() {}
		stop() {}
	} : !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config }
        load() {
            BdApi.showConfirmationModal("Library plugin is needed", 
            [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                    if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9")
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r))
                })
            }
        })
    }
    start() {}
    stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { WebpackModules } = Api
            const VideoControls = WebpackModules.getByProps("Controls").Controls
            const loop = "Loop"
            const PIP = "PIP"

            return class BetterMediaPlayer extends Plugin {
                constructor(props) {
                    super(props)
                }

                getSettingsPanel() {
                    const panel = this.buildSettingsPanel()
                    panel.addListener(() => {
                        this.patching()
                        this.css()
                        // Just make it not do 5 when one/both is disabled
                        if(this.settings.PIP === false || this.settings.button_loop === false){
                            if(this.settings.position_loop === 6)
                                this.settings.position_loop = 5
                            if(this.settings.position_PIP === 6)
                                this.settings.position_PIP = 5
                        }
                    })
                    return panel.getElement()
                }

                css(mode) {
                    if(mode === "start") {
                        BdApi.injectCSS(`${config.info.name.replace(' ','').replace(' ','')}_active`,`
.${WebpackModules.getByProps('video','videoControls').controlIcon}.active{
    color: var(--brand-experiment)
}
`
                        )
                        BdApi.injectCSS(`${config.info.name.replace(' ','').replace(' ','')}_min`,`
.${ZLibrary.WebpackModules.getByProps('imageWrapper').imageWrapper}:not(a)>.${ZLibrary.WebpackModules.getByProps('video','wrapper').wrapper}, 
.${ZLibrary.WebpackModules.getByProps('imageWrapper').imageWrapper}:not(a) {
    min-width: calc(266px + ${this.settings.PIP === true ? '32px' : '0'} + ${this.settings.button_loop === true ? '32px' : '0'})
}
`
                        )
                    }
                    else {
                        if(mode === "stop") {
                            document.getElementById(`${config.info.name.replace(' ','').replace(' ','')}_active`).remove()
                            document.getElementById(`${config.info.name.replace(' ','').replace(' ','')}_min`).remove()
                        }
                        else {
                            this.css("stop")
                            this.css("start")
                        }
                    }
                }
                patching(mode) {
                    if(mode === "start") {
                        // Start
                        this.patching("stop")
                        if( this.settings.PIP === true) {
                            const data = {
                                splice: this.settings.position_PIP,
                                width: 16,
                                height: 16,
                                viewBox: "0 0 24 24",
                                path: {
                                    1: {
                                        d: 'M0 0h24v24H0V0z'
                                    },
                                    2: {
                                        fill: "currentColor",
                                        d: 'M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z'
                                    }
                                }
                            }
                            this.patcher(PIP, data)
                        }
                        if( this.settings.button_loop === true) {
                            const data = {
                                splice: this.settings.position_loop,
                                width: 16,
                                height: 16,
                                viewBox: "-5 0 459 459.648",
                                path: {
                                    1: {
                                        fill: "currentColor",
                                        d: 'm416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0'
                                    },
                                    2: {
                                        fill: "currentColor",
                                        d: 'm32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0'
                                    }
                                }
                            }
                            this.patcher(loop, data)
                        }
                    } 
                    else{
                        // Stop
                        if (mode === "stop") {
                            if( this.settings.PIP === true)
                                BdApi.Patcher.unpatchAll(PIP)
                            if( this.settings.button_loop === true)
                                BdApi.Patcher.unpatchAll(loop)
                        } 
                        else {
                            // Settings
                            if( this.settings.PIP === false)
                                BdApi.Patcher.unpatchAll(PIP)
                            if( this.settings.button_loop === false)
                                BdApi.Patcher.unpatchAll(loop)
                            this.patching("start")
                        }
                    }
                }
                onStart() {
                    try {
                        this.patching("start")
                        this.css("start")
                    } catch (error) {
                        BdApi.showToast("An error accord\nCheck console for more details", {type: "error"})
                        console.error(error)
                    }
                }
                patcher(type, data) {
                    BdApi.Patcher.after(type, VideoControls.prototype, "render", (thisObject, _, res) => {
                        res.props.children.splice(data.splice, 0, 
                            BdApi.React.createElement("svg", {
                                onClick: (e) => {
                                    // Weird issue with pip
                                    if (e.target.id == "PIP") {
                                        this.picture_picture(e.target)
                                    } else {
                                        if (e.target.id == "Loop") {
                                            e.target.classList.toggle('active')
                                            e.target.parentNode.previousSibling.loop = e.target.parentNode.previousSibling.loop === false ? true : false
                                        } else {
                                            if (e.target.parentNode.id == "PIP") {
                                                this.picture_picture(e.target.parentNode)
                                            }
                                        }
                                    }       
                                },
                                width: data.width,
                                height: data.height,
                                viewBox: data.viewBox,
                                class: WebpackModules.getByProps('video','videoControls').controlIcon,
                                id: type,
                                children: [
                                    BdApi.React.createElement("path", {
                                        fill: data.path[1].fill === undefined ? 'transparent' : data.path[1].fill,
                                        d: data.path[1].d
                                    }),
                                    BdApi.React.createElement("path", {
                                        fill: data.path[2].fill === undefined ? 'transparent' : data.path[2].fill,
                                        d: data.path[2].d
                                    })
                                ]
                            }))
                        }
                    )
                }
                picture_picture(node) {
                    if(document.pictureInPictureElement)
                        document.exitPictureInPicture()
                    else
                        node.parentNode.previousSibling.requestPictureInPicture()
                    node.classList.toggle('active')
                    node.parentNode.previousSibling.addEventListener('leavepictureinpicture', function() {
                        if( node.classList.contains('active') )
                            node.classList.remove('active')
                        this.removeEventListener('leavepictureinpicture', onclick)
                    })
                }
                observer(mutations) {
                    if( this.settings.auto_loop === true ) {
                        // Doing
                        for(const ite of document.querySelectorAll(`.${WebpackModules.getByProps('video','videoControls').videoControls}:not(.loop)`)) {
                            ite.classList.add('loop')
                            // Adding loop
                            if(ite.previousSibling.loop === false)
                                ite.previousSibling.loop = true
                            // Adding class to loop button
                            ite.childNodes.forEach(ele => {
                                if(ele.id === loop && ele.classList == `${WebpackModules.getByProps('video','videoControls').controlIcon}`) {
                                    ele.classList.add('active')
                                }
                            })
                        }
                    }
                }
                onStop() {
                    this.patching("stop")
                    this.css("stop")
                }
            }
        }
        return plugin(Plugin, Api)
    })(global.ZeresPluginLibrary.buildPlugin(config))
})()
/*@end@*/
