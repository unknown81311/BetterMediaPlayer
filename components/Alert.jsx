const { React, getModule, getModuleByDisplayName } = require("powercord/webpack")
const {ModalContent, ModalFooter, ModalHeader} = getModule(["ModalRoot"], false),
    Buttons = getModule(["ButtonLooks"], false),
    FormTitle = getModuleByDisplayName("FormTitle", false),
    Messages = getModule(["Messages"], false).Messages,
	Markdown = getModuleByDisplayName("Markdown", false)
module.exports = class Alert extends React.PureComponent {
	constructor(props) {
		super(props)
	}
	render() {
        const message = `\`\`\`js\n${this.props.error}\n\`\`\``
		return (
            <>
                <ModalHeader separator={false}>
                    <FormTitle tag="h4">Error</FormTitle>
                </ModalHeader>
                <ModalContent>
                    <Markdown>{message}</Markdown>
                </ModalContent>
                <ModalFooter>
                    <Buttons.default onClick={this.props.onClose}>{Messages.DONE}</Buttons.default>
                </ModalFooter>
            </>
		)
	}
}