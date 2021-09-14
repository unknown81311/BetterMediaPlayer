const { Plugin } = require("powercord/entities")
const { React, getModule } = require("powercord/webpack")
const { inject, uninject } = require("powercord/injector")
const Settings = require("./components/settings")
// Modules
const PIP_SVG = require("./components/pip")
const LOOP_SVG = require("./components/loop")
const Contols = require("powercord/webpack").getModule([ "Controls" ], false).Controls

module.exports = class BetterMediaPlayer extends Plugin {
	constructor() {
		super()
	}
	observer() {
		const { get } = this.settings
		const callback = function(mutationsList, observer) {
			for(const mutation of mutationsList) {
				if (get("auto_loop", true) === true && document.querySelector("#Loop:not(.looped)")) {
					for (const ele of document.querySelectorAll("#Loop:not(.looped)")) {
						ele.classList.add("looped")
						ele.classList.add("active")
						ele.parentElement.previousSibling.loop = true
					}
				}
			}
		}
		this._observer = new MutationObserver(callback)
		this._observer.observe(document.getElementById('app-mount'), { attributes: true, childList: true, subtree: true })
	}
	PIP(node) {
		try {
			if(document.pictureInPictureElement) document.exitPictureInPicture()
			else node.parentNode.previousSibling.requestPictureInPicture()
			node.classList.toggle("active")
			node.parentNode.previousSibling.addEventListener("leavepictureinpicture", leavepip)
			function leavepip() {
				if(node.classList.contains("active")) node.classList.remove("active")
				node.parentNode.previousSibling.removeEventListener("leavepictureinpicture", leavepip)
			}
		} catch(e){}
	}
	Loop(node) {
		try {
			node.classList.toggle("active")
			node.parentNode.previousSibling.loop = node.parentNode.previousSibling.loop === false ? true : false
		} catch (e) {}
	}
	startPlugin() {
		const { get } = this.settings
		this.loadStylesheet("./components/index.css")
		this.observer()
	    powercord.api.settings.registerSettings("BetterMediaPlayer-settings", {
    	  	category: this.entityID,
    		label: "Better Media Player",
	      	render: Settings
    	})
		uninject("BetterMediaPlayer")
		inject("BetterMediaPlayer", Contols.prototype, "render", (_, res) => {
			if(get("button_pip", true) === true) res.props.children.splice(get("position_pip", 1), 0, React.createElement(PIP_SVG, {instance: this}))
			if(get("button_loop", true) === true) res.props.children.splice(get("position_loop", 1), 0, React.createElement(LOOP_SVG, {instance: this}))
			return res
		})
	}
	pluginWillUnload() {
		this._observer.disconnect()
        powercord.api.settings.unregisterSettings("BetterMediaPlayer-settings")
		uninject("BetterMediaPlayer")
	}
}