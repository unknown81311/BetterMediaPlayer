const { SwitchItem, Category, SliderInput } = require('powercord/components/settings')
const { React } = require('powercord/webpack')
class Group extends React.Component {
    constructor(props) {
        super(props)
        this.state = { toggled: false }
    }
    render() {
        return (<Category name={this.props.name} description={this.props.description} opened={this.state.toggled} onChange={() => this.setState({ toggled: !this.state.toggled })}>{this.props.children}</Category>)
    } 
}
module.exports = class Settings extends React.PureComponent {
	constructor(props) {
		super(props)
	}
	render() {
		const { getSetting, updateSetting, toggleSetting } = this.props
		return (
            <>
                <Group name="Loop" description="Loop configuration">
                    <SwitchItem value={getSetting("button_loop", true)} note="Loop videos in a simple click" onChange={() => toggleSetting("button_loop")}>Loop button</SwitchItem>
                    <SliderInput
                        stickToMarkers
                        minValue={ 0 }
                        maxValue={ 6 }
                        initialValue={ getSetting("position_loop", 1) }
                        markers={[0,1,2,3,4,5]}
                        defaultValue={ getSetting("position_loop", 1) }
                        onValueChange={ v => updateSetting("position_loop", v) }
                        note="Move the loop button to different spots"
                    >Position for loop</SliderInput>
                    <SwitchItem value={getSetting("auto_loop", true)} note="Automatically loop videos" onChange={() => toggleSetting("auto_loop")}>Auto loop</SwitchItem>
                </Group>
                <Group name="Picture in picture" description="Picture in picture configuration">
                    <SwitchItem value={getSetting("button_pip", true)} note="Loop videos in a simple click" onChange={() => toggleSetting("button_pip")}>Loop button</SwitchItem>
                    <SliderInput
                        stickToMarkers
                        minValue={ 0 }
                        maxValue={ 6 }
                        initialValue={ getSetting("position_pip", 1) }
                        markers={[0,1,2,3,4,5]}
                        defaultValue={ getSetting("position_pip", 1) }
                        onValueChange={ v => updateSetting("position_pip", v) }
                        note="Move the loop button to different spots"
                    >Position for loop</SliderInput>
                </Group>
            </>
		)
	}
}