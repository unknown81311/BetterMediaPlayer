/**
* @name BetterMediaPlayer
* @displayName adds more/better functionality to the media player
* @author unknown81311_&_Doggybootsy
* @authorId 359174224809689089_&_515780151791976453
* @version 1.0.0
*/
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
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
            version: "1.0.0",
            description: "Add more features to the media player in discord",
            github: "https://github.com/unknown81311/BetterMediaPlayer",
            github_raw: "https://raw.githubusercontent.com/unknown81311/BetterMediaPlayer/main/BetterMediaPlayer.plugin.js"
        },
        defaultConfig: [
            {
                type: "switch",
                id: "loop",
                name: "Add a Loop button",
                note: "Loop videos in a simple click",
                value: true,
            },
            {
                type: "switch",
                id: "PIP",
                name: "Add a PIP button",
                note: "Picture In Picture in a simple click",
                value: true,
            }

        ]
    };
    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        load() {
            BdApi.showConfirmationModal("Library plugin is needed", 
            [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                    if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                });
            }
        });
    }
    start() { }
    stop() { }
}
: (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { WebpackModules } = Api;
            
            return class BetterMediaPlayer extends Plugin {

                getSettingsPanel() {
                    return this.buildSettingsPanel().getElement();
                }

                onStart() {
                    
                }

                observer() {
                    // Set min width
                    if (document.querySelector('.wrapper-2TxpI8')) {
                        document.querySelectorAll('.wrapper-2TxpI8').forEach(element => {
                            if (element.offsetWidth <= 299) {
                                element.style.width = "300px";
                                element.parentNode.style.width = "300px";
                            }
                        });
                    }
                    // Credit FrostBird347
                    if ( this.settings.loop ) {
                        document.querySelectorAll("."+WebpackModules.getByProps('video','videoControls').videoControls).forEach(el => {
                            if (!el.classList.contains("AddedLoop")) {
                                el.classList.add("AddedLoop")
                                el.insertBefore(document.createElement("div"), el.children[1]);
                                el.children[1].innerHTML = '<svg class="'+WebpackModules.getByProps('video','videoControls').controlIcon+'" aria-hidden="false" width="16" height="16" fill="currentColor" viewBox="-5 0 459 459.648"><path fill="currentColor" d="m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0"/><path d="m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0"/></svg>'
                                el.children[1].id = "VideoLoopButton"
                                el.children[1].addEventListener("click", function(preel){ 
                                    var el = preel.srcElement
                                    if (el.tagName.toLowerCase() == "path") {
                                        el = el.parentElement
                                    }
                                    if (!el.parentElement.classList.contains("ChangingLoop")) {
                                        el.parentElement.classList.add("ChangingLoop")
                                        var videl = el
                                        videl = el.parentElement.parentElement.parentElement.children[1]
                                        if (el.style.color == "cornflowerblue") {
                                            el.style.color = "white"
                                            videl.loop = false;
                                            setTimeout(() => {
                                                setInterval(() => {
                                                    if (videl.loop == true) {
                                                        el.style.color = "cornflowerblue"
                                                    }
                                                }, 100);
                                            }, 100);
                                        } else {
                                            el.style.color = "cornflowerblue"
                                            videl.loop = true;
                                            setTimeout(() => {
                                                setInterval(() => {
                                                    if (videl.loop == false) {
                                                        el.style.color = "white"
                                                    }
                                                }, 100);
                                            }, 100);
                                        }
                                        el.parentElement.classList.remove("ChangingLoop")
                                    }
                                });
                            }
                        });
                    }
                    if ( this.settings.PIP ) {
                        document.querySelectorAll("."+WebpackModules.getByProps('video','videoControls').videoControls).forEach(el => {
                            if (!el.classList.contains("AddedPIP")) {
                                el.classList.add("AddedPIP")
                                el.insertBefore(document.createElement("div"), el.children[1]);
                                el.children[1].innerHTML = '<svg class="'+WebpackModules.getByProps('video','videoControls').controlIcon+'" aria-hidden="false" width="16" height="16" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" fill="currentcolor"/></svg>'
                                el.children[1].id = "TogglePIP"
                                el.children[1].addEventListener("click", function(preel){ 
                                    var el = preel.srcElement
                                    if (el.tagName.toLowerCase() == "path") {
                                        el = el.parentElement
                                    }
                                    if (!el.parentElement.classList.contains("TogglePIP")) {
                                        el.parentElement.classList.add("TogglePIP")
                                        var videl = el
                                        videl = el.parentElement.parentElement.parentElement.children[1]
                                        if (el.style.color == "cornflowerblue") {
                                            el.style.color = "white"
                                            document.exitPictureInPicture()
                                            setTimeout(() => {
                                                setInterval(() => {
                                                    if (document.pictureInPictureElement == videl) {
                                                        el.style.color = "cornflowerblue"
                                                    }
                                                }, 100);
                                            }, 100);
                                        } else {
                                            el.style.color = "cornflowerblue"
                                            videl.requestPictureInPicture()
                                            setTimeout(() => {
                                                setInterval(() => {
                                                    if (document.pictureInPictureElement == null) {
                                                        el.style.color = "white"
                                                    }
                                                }, 100);
                                            }, 100);
                                        }
                                        el.parentElement.classList.remove("TogglePIP")
                                    }
                                });
                            }
                        });
                    }
                }

                onStop() {
                    
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
