const { React, getModule } = require('powercord/webpack')
const controlIcon = getModule(["videoControls"], false).controlIcon
module.exports = (props) => {
	return (
		<svg className={controlIcon} aria-hidden="false" id="PIP" width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={e => props.instance.PIP(e.target.id === "PIP" ? e.target : e.target.parentElement)}>
			<path fill="transparent" d="M0 0h24v24H0V0z"></path>
			<path fill="currentColor" d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"></path>
		</svg>
	)
}