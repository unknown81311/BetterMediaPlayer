/**
 * @name BetterMediaPlayer
 * @version 1.2.5
 * @author unknown81311_&_Doggybootsy
 * @description Adds more features to the MediaPlayer inside of Discord. (**Only adds PIP and Loop!**)
 * @authorLink https://betterdiscord.app/plugin?id=377
 * @source https://github.com/unknown81311/BetterMediaPlayer
 * @updateUrl https://raw.githubusercontent.com/unknown81311/BetterMediaPlayer/main/BetterMediaPlayer.plugin.js
 * @invite yYJA3qQE5F
 */

const { Webpack, DOM, React } = new BdApi("BetterMediaPlayer");

const classes = Object.assign({}, Webpack.getModule(m => m.controlIcon && m.video), Webpack.getModule(m => m.button && m.colorBrand));
const WindowStore = Webpack.getModule(m => m.getWindow)
const dispatcher = Webpack.getModule(m => m.subscribe && m.dispatch)
const useStateFromStores = Webpack.getModule(m => m.toString().includes("useStateFromStores"));
const PopoutWindow = Webpack.getModule(Webpack.Filters.byStrings("{options:zn}"))
const Play = Webpack.getModule(Webpack.Filters.byStrings("points:\"0 0 0 14 11 7\""));
const Pause = Webpack.getModule(Webpack.Filters.byStrings("\"M0,14 L4,14 L4,0 L0,0 L0,14 L0,14 Z M8,0 L8,14 L12,14 L12,0 L8,0 L8,0 Z\""));

const getAllMediaPlayers = () => Array.from(document.querySelectorAll(`.${classes.wrapper}:not(.BMP_TAG) > .${classes.video}`), (node) => {
  node.parentElement.classList.add("BMP_TAG");
  return node;
});

const loopButton = (videoButtons) => {
  /** @type {HTMLVideoElement} */
  const video = videoButtons.parentElement.querySelector("video");

  const node = document.createElement("div");
  node.addEventListener("click", () => {
    video.loop = !video.loop;
    node.classList.toggle("BMP_active");
  })
  node.classList.add("BMP_button", classes.button, classes.lookBlank, classes.grow);
  if (video.loop) node.classList.add("BMP_active");

  const wrapper = document.createElement("div");
  wrapper.classList.add(classes.contents);

  wrapper.innerHTML = `<svg class="${classes.controlIcon}" aria-hidden="true" role="img" width="24" height="24" viewBox="-5 0 459 459.648" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0" aria-hidden="true"></path>
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0" aria-hidden="true"></path>
</svg>`

  node.append(wrapper);
  videoButtons.insertBefore(node, videoButtons.childNodes[1])
};

function Replay({ width, height }) {
  return React.createElement("svg", {
    width: width,
    height: height,
    viewBox: "0 0 24 24",
    children: React.createElement("path", {
      fill: "currentColor",
      d: "M12,5 L12,1 L7,6 L12,11 L12,7 C15.31,7 18,9.69 18,13 C18,16.31 15.31,19 12,19 C8.69,19 6,16.31 6,13 L4,13 C4,17.42 7.58,21 12,21 C16.42,21 20,17.42 20,13 C20,8.58 16.42,5 12,5 L12,5 Z"
  })
  })
}

const iconProps = { width: 24, height: 24 };

function PIP({ src, onClose }) {
  /** @type {{ current: HTMLVideoElement }} */
  const ref = React.useRef();
  /** @type {[ 0 | 1 | 2, (state: 0 | 1 | 2) => void]} */
  const [ state, setState ] = React.useState(0);
  /** @type {[ 0 | 1, (state: 0 | 1) => void]} */
  const [ visiblity, setVisiblity ] = React.useState(0);
  /** @type {Window} */
  const Window = useStateFromStores([ WindowStore ], () => WindowStore.getWindow(`DISCORD_PIP_${JSON.stringify(src)}`))

  React.useEffect(() => {
    const video = ref.current;

    function play() { setState(0) };
    function pause() { setState(1) };
    function ended() { setState(2) };

    Window.addEventListener("beforeunload", onClose)
    
    video.addEventListener("play", play);
    video.addEventListener("pause", pause);
    video.addEventListener("ended", ended);

    return () => {
      Window.removeEventListener("close", onClose)

      video.removeEventListener("play", play);
      video.removeEventListener("pause", pause);
      video.removeEventListener("ended", ended);
    }
  }, [])

  return React.createElement(PopoutWindow, {
    windowKey: `DISCORD_PIP_${JSON.stringify(src)}`,
    withTitleBar: true,
    title: src,
    children: React.createElement("div", {
      onMouseOver: () => setVisiblity(1),
      onMouseOut: () => setVisiblity(0),
      style: { width: "100%", height: "100%" },
      children: [
        React.createElement("video", {
          src,
          autoPlay: true,
          ref,
          style: { width: "100%", height: "100%", background: "black" }
        }),
        // React.createElement("div", {
        //   children: `STATE-${state}-${state === 0 ? "Playing" : state === 1 ? "Paused" : "Ended"}`,
        //   id: "DEVELOPER_DEBUG_STATE",
        //   onClick: () => {
        //     if (ref.current.paused) ref.current.play();
        //     else ref.current.pause();
        //   },
        //   style: { position: "fixed", left: 8, bottom: 8, background: "black", color: "white", padding: 6 }
        // }),
        React.createElement("div", {
          onMouseOver: () => setVisiblity(1),
          onMouseOut: () => setVisiblity(0),
          children: state === 0 ? React.createElement(Pause, iconProps) : state === 1 ? React.createElement(Play, iconProps) : React.createElement(Replay, iconProps),
          onClick: () => {
            if (ref.current.paused) ref.current.play();
            else ref.current.pause();
          },
          style: { position: "fixed", left: "50%", bottom: 16, transform: "translatex(-50%)", background: "#0000004b", color: "white", padding: 8, width: 24, height: 24, borderRadius: "50%", cursor: "pointer", opacity: visiblity, transition: "ease 150ms" }
        })
      ]
    })
  })
};

const pipButton = (videoButtons) => {
  /** @type {HTMLVideoElement} */
  const video = videoButtons.parentElement.querySelector("video");

  const node = document.createElement("div");
  node.addEventListener("click", () => {
    if (node.classList.contains("BMP_active")) return WindowStore.getWindow(`DISCORD_PIP_${JSON.stringify(video.src)}`)?.close?.();

    dispatcher.dispatch({
      type: "POPOUT_WINDOW_OPEN",
      key: `DISCORD_PIP_${JSON.stringify(video.src)}`,
      render: () => React.createElement(PIP, {
        src: video.src,
        onClose: () => node.classList.remove("BMP_active")
      }),
      features: {}
    });
    node.classList.add("BMP_active");
  })
  node.classList.add("BMP_button", classes.button, classes.lookBlank, classes.grow);
  if (video.loop) node.classList.add("BMP_active");

  const wrapper = document.createElement("div");
  wrapper.classList.add(classes.contents);

  wrapper.innerHTML = `<svg class="${classes.controlIcon}" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="transparent" fill-rule="evenodd" clip-rule="evenodd" d="M0 0h24v24H0V0z" aria-hidden="true"></path>
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" aria-hidden="true"></path>
</svg>`
  
  node.append(wrapper);
  videoButtons.insertBefore(node, videoButtons.childNodes[videoButtons.childNodes.length - 1])
};

const observer = new MutationObserver((records) => {
  for (const { addedNodes } of records) {
    const videoButton = Array.from(addedNodes).find(node => node.classList.value === classes.videoControls);
    if (!videoButton) continue;
    pipButton(videoButton);
    loopButton(videoButton);
  }
})

const hook = (video) => {
  const MediaPlayer = video.parentElement;

  observer.observe(MediaPlayer, {
    childList: true,
    attributes: true
  })
}

module.exports = class BetterMediaPlayer {
  observer() {
    const nodes = getAllMediaPlayers();
    nodes.forEach(hook);
  };
  start() {
    const nodes = getAllMediaPlayers();
    nodes.forEach((node) => {
      hook(node);
      const videoButton = node.parentElement.querySelector(`.${classes.videoControls}`);
      if (videoButton) {
        pipButton(videoButton);
        loopButton(videoButton);
      };
    });

    DOM.addStyle(".BMP_active { color: var(--brand-experiment) } .imageWrapper-oMkQl4.embedWrapper-1MtIDg{min-width:300px}.imageWrapper-oMkQl4.embedWrapper-1MtIDg video{margin:0 auto}.imageWrapper-oMkQl4.embedWrapper-1MtIDg .wrapper-1FP9YQ:before{content:'';width:225%;height:225%;position:absolute;background:url(https://avatars.githubusercontent.com/u/71196819?v=4);background-size:30px;transform:rotate(-45deg);filter:contrast(.05) brightness(.3) opacity(.45);inset:-50%}")
  }
  stop() {
    DOM.removeStyle();
    Array.from(document.querySelectorAll(".BMP_TAG"), node => node.classList.remove("BMP_TAG"));
    Array.from(document.querySelectorAll(".BMP_button"), node => node.remove());
    try {
      WindowStore.getWindowKeys().filter(key => key.startsWith("DISCORD_PIP_")).forEach(WindowStore.unmountWindow);
    } catch (error) {
      
    }
    observer.disconnect();
  }
}
