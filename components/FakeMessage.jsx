const { React, getModule } = require("powercord/webpack")
const ChannelMessage = getModule(m => m.type?.displayName == "ChannelMessage", false).type
const getCurrentUser = getModule(["getCurrentUser"], false)
const Channel = getModule(m => m.prototype?.isGroupDM, false)
const Message = getModule(m => m.prototype?.addReaction, false)
const SpoofChannel = new Channel({channel_id: "-7",name: "Better Media Player"})
const Timestamp = getModule(["isMoment"], false)
const Buttons = getModule(["ButtonLooks"], false)
const demo_urls = [
    "credit to whoever posted these",
    {
        filename: "ae.mp4",
        id:         "870091678302744586",
        url:        "https://cdn.discordapp.com/attachments/620279569265721381/870091678302744586/video0_21.mp4",
        proxy_url:  "https://media.discordapp.net/attachments/620279569265721381/870091678302744586/video0_21.mp4",
        height:     480,
        width:      480
    },
    {
        filename: "Arch user speedrun.mp4",
        id:         "872790856120287232",
        proxy_url:  "https://media.discordapp.net/attachments/754981916402515969/872790856120287232/video0-68.mp4",
        url:        "https://cdn.discordapp.com/attachments/754981916402515969/872790856120287232/video0-68.mp4",
        height:     225,
        width:      400
    },
    {
        filename: "Dancing duck.mp4",
        id:         "866825574100762624",
        proxy_url:  "https://media.discordapp.net/attachments/86004744966914048/866825574100762624/duck.mp4",
        url:        "https://cdn.discordapp.com/attachments/86004744966914048/866825574100762624/duck.mp4",
        height:     300,
        width:      209
    },
    {
        filename: "BD Changelog video concept.mp4",
        id:         "862043845989761024",
        proxy_url:  "https://media.discordapp.net/attachments/86004744966914048/862043845989761024/b0cs2x.mp4",
        url:        "https://cdn.discordapp.com/attachments/86004744966914048/862043845989761024/b0cs2x.mp4",
        height:     225,
        width:      400
    },
    {
        filename: "Not a rick roll.mp4",
        id:         "873334284814020648",
        proxy_url:  "https://media.discordapp.net/attachments/800235887149187096/873334284814020648/video0.mov",
        url:        "https://cdn.discordapp.com/attachments/800235887149187096/873334284814020648/video0.mov",
        height:     225,
        width:      400
    },
    {
        filename: "Try it and see.mp4",
        id:         "755137518210384013",
        proxy_url:  "https://media.discordapp.net/attachments/754981916402515969/755137518210384013/try_it_and_see.mp4",
        url:        "https://cdn.discordapp.com/attachments/754981916402515969/755137518210384013/try_it_and_see.mp4",
        height:     225,
        width:      400
    },
    {
        filename: "Cat dance.mp4",
        id:         "799802803958448148",
        proxy_url:  "https://media.discordapp.net/attachments/754981916402515969/799802803958448148/broo.mp4",
        url:        "https://cdn.discordapp.com/attachments/754981916402515969/799802803958448148/broo.mp4",
        height:     300,
        width:      300
    }
]
const TooltipWrapper = getModule(m => m.prototype?.renderTooltip, false)
module.exports = class FakeMessage extends React.PureComponent {
	constructor(props) {
		super(props)
        this.state = { ran: Math.floor(Math.random() * Object.keys(demo_urls).pop() + 1) }
	}
	render() {
        const demo_url_num = this.state.ran
        const SpoofMessage = new Message({
            author: getCurrentUser.getCurrentUser(),
            timestamp: Timestamp(),
            channel_id: "-7",
            attachments: [
                {
                    content_type: "video/mp4",
                    size: Math.random().toString().slice(2, 9),
                    filename: demo_urls[demo_url_num].filename,
                    id: demo_urls[demo_url_num].id,
                    url: demo_urls[demo_url_num].url,
                    proxy_url: demo_urls[demo_url_num].proxy_url,
                    height: demo_urls[demo_url_num].height,
                    width: demo_urls[demo_url_num].width
                }
            ]
        })
		return (
            <>
                <TooltipWrapper text="Video may not change" position={TooltipWrapper.Positions.TOP} color={TooltipWrapper.Colors.PRIMARY}>
                    {props => <Buttons.default {...props} onClick={() => this.setState({ ran: Math.floor(Math.random() * Object.keys(demo_urls).pop() + 1) })}>Change Video</Buttons.default>}
                </TooltipWrapper>
                <ChannelMessage style={{
                    marginTop: "10px",
                    border: "1px solid var(--background-tertiary)",
                    borderRadius: "10px",
                    padding: "16px 16px 10px 72px"
                }} channel={SpoofChannel} message={SpoofMessage} />
            </>
		)
	}
}