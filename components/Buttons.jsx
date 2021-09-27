const { React, getModule } = require('powercord/webpack')
const controlIcon = getModule(["videoControls"], false).controlIcon
module.exports.LoopIcon = class LoopIcon extends React.PureComponent {
	constructor(props) {
		super(props)
        this.state = { active: this.props.active }
	}
	onClick(node) {
		this.setState({ active: !this.state.active })
		try {node.loop = !node.loop} 
		catch (e) {this.props.instance.error(e)}
	}
	render() {
		return (
			<svg 
				className={controlIcon} 
				aria-hidden="false" id="Loop" 
				width="16" height="16" 
				viewBox="-5 0 459 459.648" 
				xmlns="http://www.w3.org/2000/svg" 
				onClick={e => this.onClick(e.target.id === "Loop" ? e.target.parentElement.previousSibling : e.target.parentElement.parentElement.previousSibling)}>
				<path 
					fill={this.state.active === true ? "var(--brand-experiment)" : "currentColor"} 
					d="m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0"></path>
				<path 
					fill={this.state.active === true ? "var(--brand-experiment)" : "currentColor"} 
					d="m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0"></path>
			</svg>
		)
	}
}
module.exports.PipIcon = class PipIcon extends React.PureComponent {
	constructor(props) {
		super(props)
        this.state = { active: false }
	}
	onClick(node) {
		try {
			if(document.pictureInPictureElement && (this.state.active === true)) 
				document.exitPictureInPicture()
			else {
				node.requestPictureInPicture()
				this.setState({ active: true })
			}
			const oldThis = this
			node.addEventListener("leavepictureinpicture", leavepip)
			function leavepip() {
				oldThis.setState({ active: false })
				node.removeEventListener("leavepictureinpicture", leavepip)
			}
		} 
		catch(e){this.props.instance.error(e)}
	}
	render() {
		return (
			<svg 
				className={controlIcon} 
				aria-hidden="false" id="PIP" 
				width="16" height="16" 
				viewBox="0 0 24 24" 
				xmlns="http://www.w3.org/2000/svg" 
				onClick={e => this.onClick(e.target.id === "PIP" ? e.target.parentElement.previousSibling : e.target.parentElement.parentElement.previousSibling)}>
				<path 
					fill="transparent" 
					d="M0 0h24v24H0V0z"></path>
				<path 
					fill={this.state.active === true ? "var(--brand-experiment)" : "currentColor"} 
					d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path>
			</svg>
		)
	}
}