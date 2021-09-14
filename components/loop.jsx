const { React, getModule } = require('powercord/webpack')
const controlIcon = getModule(["videoControls"], false).controlIcon
module.exports = (props) => {
	return (
		<svg className={controlIcon} aria-hidden="false" id="Loop" width="16" height="16" viewBox="-5 0 459 459.648" xmlns="http://www.w3.org/2000/svg" onClick={e => props.instance.Loop(e.target.id === "Loop" ? e.target : e.target.parentElement)}>
			<path fill="currentColor" d="m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0"></path>
			<path fill="currentColor" d="m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0"></path>
		</svg>
	)
}