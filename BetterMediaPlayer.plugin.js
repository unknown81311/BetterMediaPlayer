/**
 * @name BetterMediaPlayer
 * @version 1.2.16
 * @author unknown81311_&_Doggybootsy
 * @description Adds more features to the MediaPlayer inside of Discord. (**Only adds PIP and Loop!**)
 * @authorLink https://betterdiscord.app/plugin?id=377
 * @source https://github.com/unknown81311/BetterMediaPlayer
 * @updateUrl https://raw.githubusercontent.com/unknown81311/BetterMediaPlayer/main/BetterMediaPlayer.plugin.js
 * @invite yYJA3qQE5F
 */

const { Webpack, DOM, React, Data, UI } = new BdApi("BetterMediaPlayer");
const classes = Object.assign({}, Webpack.getModule(m => m.controlIcon && m.video), Webpack.getModule(m => m.button && m.colorBrand));

const [
  PopoutWindowStore,
  dispatcher,
  useStateFromStores,
  PopoutWindow,
  errorClasses,
  { errorPage, buttons },
  Flex,
  intl,
  inviteActions,
  InviteModalStore,
  native,
  GuildStore,
  hljs,
  Guild,
  GuildMemberCountStore,
  VolumeSlider,
  DurationBar,
  scrollerClasses
] = Webpack.getBulk(
  { filter: m => m.getWindow },
  { filter: m => m.subscribe && m.dispatch },
  { filter: Webpack.Filters.byStrings('"useStateFromStores"'), searchExports: true  },
  { filter: m => m.render?.toString().includes("Missing guestWindow reference") },
  { filter: m => m.wrapper && m.note },
  { filter: m => m.errorPage && m.buttons },
  { filter: m => m.defaultProps?.basis, searchExports: true },
  { filter: m => m.Messages },
  { filter: m => m.resolveInvite },
  { filter: m => m.getName?.() === "InviteModalStore" },
  { filter: m => m.minimize && m.requireModule },
  { filter: m => m.getName?.() === "GuildStore" },
  { filter: m => m.highlight },
  { filter: m => m.prototype?.getEveryoneRoleId && m.prototype.getIconURL },
  { filter: m => m.getName?.() === "GuildMemberCountStore" },
  { filter: Webpack.Filters.byStrings("sliderClassName:", "onDragEnd:this.handleDragEnd", "handleValueChange") },
  { filter: m => m.Types?.DURATION },
  { filter: m => m.thin && m.customTheme }
);

const Button = BdApi.Components.Button;

const { isOpen: originalIsOpen } = InviteModalStore;
const { minimize: originalMinimize, focus: originalFocus } = native;

const c = classes.wrapperControlsHidden.split(" ")[1];
const getAllMediaPlayers = (parent = document) => !parent?.querySelectorAll ? [] : Array.from(parent.querySelectorAll(`.${c}:not([data-bmp-hook]) > .${classes.video}`), (node) => {
  node.parentElement.setAttribute("data-bmp-hook", "");
  return node;
});

const appendLoopButton = (videoButtons) => {
  /** @type {HTMLVideoElement} */
  const video = videoButtons.parentElement.querySelector("video");

  const node = document.createElement("div");
  node.addEventListener("click", () => {
    if (video.loop = !video.loop) node.classList.add("BMP_active");
    else node.classList.remove("BMP_active");
  });
  
  node.classList.add("BMP_button");
  if (video.loop) node.classList.add("BMP_active");

  node.innerHTML = `<svg class="${classes.controlIcon}" aria-hidden="true" role="img" width="24" height="24" viewBox="-5 0 459 459.648" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0" aria-hidden="true"></path>
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0" aria-hidden="true"></path>
</svg>`;

  videoButtons.insertBefore(node, videoButtons.childNodes[1]);
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
  });
};
function Pause({ width, height }) {
  return React.createElement("svg", {
    width: width,
    height: height,
    viewBox: "0 0 18 18",
    children: React.createElement("path", {
      fill: "currentColor",
      d: "M5.25 2.25226H7.5C7.9125 2.25226 8.25 2.58976 8.25 3.00226V15.0023C8.25 15.4148 7.9125 15.7523 7.5 15.7523H5.25C4.8375 15.7523 4.5 15.4148 4.5 15.0023V3.00226C4.5 2.58976 4.8375 2.25226 5.25 2.25226ZM11.25 2.25226H13.5C13.9125 2.25226 14.25 2.58976 14.25 3.00226V15.0023C14.25 15.4148 13.9125 15.7523 13.5 15.7523H11.25C10.8375 15.7523 10.5 15.4148 10.5 15.0023V3.00226C10.5 2.58976 10.8375 2.25226 11.25 2.25226Z"
    })
  });
};
function Play({ width, height }) {
  return React.createElement("svg", {
    width: width,
    height: height,
    viewBox: "0 0 18 18",
    children: React.createElement("path", {
      fill: "currentColor",
      d: "M6.01053 2.82974C5.01058 2.24153 3.75 2.96251 3.75 4.12264V13.8774C3.75 15.0375 5.01058 15.7585 6.01053 15.1703L14.3021 10.2929C15.288 9.71294 15.288 8.28709 14.3021 7.70711L6.01053 2.82974Z"
    })
  });
};
function Loop({ width, height }) {
  return React.createElement("svg", {
    width: width,
    height: height,
    viewBox: "-5 0 459 459.648",
    children: [
      React.createElement("path", {
        fill: "currentColor",
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "m416.324219 293.824219c0 26.507812-21.492188 48-48 48h-313.375l63.199219-63.199219-22.625-22.625-90.511719 90.511719c-6.246094 6.25-6.246094 16.375 0 22.625l90.511719 90.511719 22.625-22.625-63.199219-63.199219h313.375c44.160156-.054688 79.945312-35.839844 80-80v-64h-32zm0 0"
      }),
      React.createElement("path", {
        fill: "currentColor",
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "m32.324219 165.824219c0-26.511719 21.488281-48 48-48h313.375l-63.199219 63.199219 22.625 22.625 90.511719-90.511719c6.246093-6.25 6.246093-16.375 0-22.625l-90.511719-90.511719-22.625 22.625 63.199219 63.199219h-313.375c-44.160157.050781-79.949219 35.839843-80 80v64h32zm0 0"
      })
    ]
  });
};
function Download({ width, height }) {
  return React.createElement("svg", {
    width: width,
    height: height,
    viewBox: "0 0 24 24",
    children: [
      React.createElement("path", {
        fill: "currentColor",
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"
      })
    ]
  });
};

const useVolume = (() => {
  const listeners = new Set();
  
  return function useVolume() {
    const [ volume, setVolume ] = React.useState(() => Data.load("volume") ?? 1);
  
    React.useLayoutEffect(() => {
      function listener(newVolume) {
        setVolume(newVolume);
      };
  
      listeners.add(listener);
      return () => void listeners.delete(listener);
    }, [ listeners ]);

    function setNewVolume(newVolume) {
      Data.save("volume", newVolume);
      for (const listener of listeners) listener(newVolume);
    };
  
    return [ volume, setNewVolume ];
  };
})();
const useMuted = (() => {
  const listeners = new Set();
  
  return function useMuted() {
    const [ muted, setMuted ] = React.useState(() => Data.load("muted") ?? false);
  
    React.useLayoutEffect(() => {
      function listener(isMuted) {
        setMuted(isMuted);
      };
  
      listeners.add(listener);
      return () => void listeners.delete(listener);
    }, [ ]);

    function setIsMuted(isMuted) {
      Data.save("muted", isMuted);
      for (const listener of listeners) listener(isMuted);
    };
  
    return [ muted, setIsMuted ];
  };
})();

function calcTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time - (minutes * 60);
  return { minutes, seconds };
};

function Duration({ currentTime, duration }) {
  const parsedCurrentTime = React.useMemo(() => calcTime(currentTime), [ currentTime ]);
  const parsedDuration = React.useMemo(() => calcTime(duration), [ currentTime ]);

  return React.createElement("div", {
    id: "duration",
    children: [
      `${parsedCurrentTime.minutes}:${10 > parsedCurrentTime.seconds ? `0${parsedCurrentTime.seconds}` : parsedCurrentTime.seconds}`,
      "/",
      `${parsedDuration.minutes}:${10 > parsedDuration.seconds ? `0${parsedDuration.seconds}` : parsedDuration.seconds}`
    ]
  })
};

function getBuffers(node) {
  const buffers = [];
  for (let index = 0; index < node.buffered.length; index++) {
    const start = node.buffered.start(index);
    const end = node.buffered.end(index);
    if (!(end - start < 1)) {
      buffers.push([ start / node.duration, (end - start) / node.duration ]);
    };
  };
  return buffers;
};

class ErrorBoundary extends React.Component {
  state = { didError: false, errorInfo: new Error("Minified React error #999; Fake React Error (for debugging)") }
  componentDidCatch(error) {
    this.setState({ didError: true, errorInfo: error });
  };
  render() {
    return React.createElement(React.Fragment, {
      children: [
        this.state.didError && React.createElement(ErrorSplash, { ...this.props, errorInfo: this.state.errorInfo }),
        !this.state.didError && React.createElement(PictureInPicture, this.props)
      ]
    });
  };
};

let resolvedInvite;
function JoinGuild() {
  const guild = useStateFromStores([ GuildStore ], () => GuildStore.getGuild("864267123694370836"));

  const [ invite, setInvite ] = React.useState(resolvedInvite);

  const guildInfo = React.useMemo(() => {
    if (guild ? false : !invite) return;
    const guildObject = guild ? guild : new Guild(invite.guild);

    return {
      name: guildObject.name,
      members: invite ? invite.approximate_member_count : GuildMemberCountStore.getMemberCount("864267123694370836"),
      online: invite ? invite.approximate_presence_count : GuildMemberCountStore.getOnlineCount("864267123694370836"),
      url: guildObject.getIconURL()
    };
  }, [ guild, invite ]);

  React.useLayoutEffect(() => {
    if (invite) return;
    (async function () {
      const { invite } = await inviteActions.resolveInvite("yYJA3qQE5F", "Desktop Modal");
      resolvedInvite = invite;
      setInvite(invite);
    })();
  }, [ ]);

  const join = React.useCallback(async () => {
    if (guild) return;

    // Prevent from focusing to main window
    InviteModalStore.isOpen = () => true;
    native.minimize = () => {};
    native.focus = () => {};
    
    await dispatcher.dispatch({ type: "INVITE_MODAL_OPEN", invite });
    
    InviteModalStore.isOpen = originalIsOpen;
    native.minimize = originalMinimize;
    native.focus = originalFocus;
  }, [ guild, invite ]);

  const transitionTo = React.useCallback(() => {
    inviteActions.transitionToInviteSync(invite);
  }, [ guild, invite ]);

  const onClick = React.useCallback(() => {
    if (!invite) return;
    if (guild) transitionTo();
    else join();
  }, [ transitionTo, join ]);

  return React.createElement("div", {
    style: {
      display: "flex",
      background: "var(--background-secondary)",
      padding: 8,
      borderRadius: 8,
      border: "1px solid var(--background-secondary-alt)"
    },
    children: [
      guildInfo ? React.createElement("img", {
        src: guildInfo.url,
        height: 38,
        width: 38,
        style: {
          borderRadius: "50%"
        }
      }) : React.createElement("div", {
        style: {
          height: 38,
          width: 38,
          borderRadius: "50%",
          background: "var(--background-secondary-alt)"
        }
      }),
      React.createElement("div", {
        style: {
          color: "var(--text-normal)",
          flex: "1 0",
          padding: "0 8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        },
        children: [
          React.createElement("div", {
            style: {
              fontSize: "large",
              fontWeight: 600
            },
            children: [
              guildInfo && guildInfo.name,
              !guildInfo && "Resolving..."
            ]
          }),
          
          React.createElement("div", {
            style: {
              display: "flex"
            },
            children: [
              React.createElement("div", {
                style: {
                  display: "flex"
                },
                children: [
                  React.createElement("div", {
                    style: {
                      margin: "auto 8px auto 0",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--green-360)"
                    }
                  }),
                  guildInfo ? guildInfo.online : "0"
                ]
              }),
              React.createElement("div", {
                style: {
                  display: "flex"
                },
                children: [
                  React.createElement("div", {
                    style: {
                      margin: "auto 8px",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--primary-400)"
                    }
                  }),
                  guildInfo ? guildInfo.members : "0"
                ]
              })
            ]
          })
        ]
      }),
      React.createElement(Button, {
        color: Button.Colors.GREEN,
        disabled: guild ? false : !invite,
        children: [
          guild && intl.Messages.JOINED_GUILD,
          (!guild && invite) && intl.Messages.INVITE_MODAL_BUTTON.message.replace("**!!{guildName}!!**", guildInfo.name),
          (!guild && !invite) && intl.Messages.INVITE_BUTTON_RESOLVING
        ],
        onClick: onClick
      })
    ]
  });
};

function ErrorModal({ src, errorInfo }) {
  const highlighted = React.useMemo(() => hljs.highlight(errorInfo.stack, { language: "js" }), [ ]);

  const [ copied, setCopied ] = React.useState(false);

  const setNotCopied = React.useMemo(() => _.debounce(() => setCopied(false), 1000), [ ]);

  const copy = React.useCallback(() => {
    setCopied(true);
    setNotCopied();
    DiscordNative.clipboard.copy(errorInfo.stack);
  }, [ ]);

  return React.createElement("div", {
    children: [
      React.createElement(JoinGuild, { src }),
      React.createElement("div", {
        style: {
          width: "calc(100% - 16px)",
          height: 1,
          margin: 8,
          background: "var(--background-secondary-alt)"
        }
      }),
      React.createElement("div", {
        style: {
          position: "relative"
        },
        children: [
          React.createElement("h2", {
            style: {
              color: "var(--header-primary)",
              fontWeight: 800,
              marginBottom: 8
            },
            children: "Error Stack"
          }),
          React.createElement("pre", {
            className: `${scrollerClasses.thin} ${scrollerClasses.fade} ${scrollerClasses.customTheme}`,
            style: {
              maxHeight: 200,
              background: "var(--background-secondary)",
              border: "1px solid var(--background-secondary-alt)",
              color: "var(--text-normal)",
              overflow: "auto",
              padding: 8,
              userSelect: "text",
              borderRadius: 6
            },
            children: React.createElement("code", { dangerouslySetInnerHTML: { __html: highlighted.value } })
          }),
          React.createElement("div", {
            className: `button copy${copied ? " copied" : ""}`,
            style: {
              position: "absolute",
              bottom: 8,
              right: 8,
              zIndex: 1
            },
            onClick: copy,
            children: React.createElement("svg", {
              viewBox: "0 0 24 24",
              height: 24,
              width: 24,
              children: [
                React.createElement("path", {
                  fill: "currentColor",
                  d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z"
                }),
                React.createElement("path", {
                  fill: "currentColor",
                  d: "M15 5H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
                })
              ]
            })
          })
        ]
      })
    ]
  });
};

function ErrorSplash({ src, errorInfo, windowKey }) {
  const Window = useStateFromStores([ PopoutWindowStore ], () => PopoutWindowStore.getWindow(windowKey))

  React.useLayoutEffect(() => {
    const style = document.createElement("style");
    style.innerText = `.button {
      display: flex;
      color: var(--interactive-normal);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    } .button:hover {
      color: var(--interactive-hover);
      background-color: var(--background-modifier-hover);
    } .button:hover:active {
      color: var(--interactive-active);
      background-color: var(--background-modifier-active);
    } .copy {
      background: var(--background-modifier-accent);
    } .copied {
      color: var(--button-positive-background)
    } .copied:hover {
      color: var(--button-positive-background-hover)
    } .copied:hover:active {
      color: var(--button-positive-background-active)
    }`;
    Window.document.head.appendChild(style);
  }, [ ]);

  return React.createElement(React.Fragment, {
    children: [
      React.createElement("div", {
        className: `${errorClasses.wrapper} ${errorPage}`,
        style: {
          display: "flex",
          position: "fixed",
          left: 0,
          top: 0,
          minHeight: "100%"
        },
        children: [
          React.createElement(Flex, {
            align: Flex.Align.CENTER,
            justify: Flex.Justify.CENTER,
            direction: Flex.Direction.VERTICAL,
            className: classes.flexWrapper,
            shrink: 1,
            grow: 1,
            children: [
              React.createElement(Flex.Child, {
                className: errorClasses.image,
                grow: 0,
                shrink: 1,
                wrap: false
              }),
              React.createElement(Flex.Child, {
                className: errorClasses.text,
                grow: 0,
                shrink: 1,
                wrap: false,
                children: [
                  React.createElement("h2", {
                    className: errorClasses.title,
                    children: intl.Messages.UNSUPPORTED_BROWSER_TITLE
                  }),
                  React.createElement("div", {
                    className: errorClasses.note,
                    children: React.createElement("div", {
                      children: [
                        React.createElement("p", {}, intl.Messages.CRASH_UNEXPECTED.replace("Discord", "Better Media Player")),
                        React.createElement("p", {}, intl.Messages.ERRORS_UNEXPECTED_CRASH.replace("Discord", "Better Media Player"))
                      ]
                    })
                  })
                ]
              }),
              React.createElement("div", {
                className: buttons,
                children: [
                  React.createElement(Button, {
                    size: Button.Sizes.LARGE,
                    onClick: () => Window.close(),
                    children: intl.Messages.CLOSE
                  })
                ]
              })
            ]
          })
        ]
      }),
      React.createElement("div", {
        className: "button",
        style: {
          right: 8,
          bottom: 8,
          position: "fixed"
        },
        onClick: () => UI.alert(generateTitle(errorInfo), React.createElement(ErrorModal, { src, errorInfo })),
        children: React.createElement("svg", {
          viewBox: "0 0 24 24",
          height: 24,
          width: 24,
          children: React.createElement("path", {
            fill: "currentColor",
            d: "M12 2C6.486 2 2 6.487 2 12C2 17.515 6.486 22 12 22C17.514 22 22 17.515 22 12C22 6.487 17.514 2 12 2ZM12 18.25C11.31 18.25 10.75 17.691 10.75 17C10.75 16.31 11.31 15.75 12 15.75C12.69 15.75 13.25 16.31 13.25 17C13.25 17.691 12.69 18.25 12 18.25ZM13 13.875V15H11V12H12C13.104 12 14 11.103 14 10C14 8.896 13.104 8 12 8C10.896 8 10 8.896 10 10H8C8 7.795 9.795 6 12 6C14.205 6 16 7.795 16 10C16 11.861 14.723 13.429 13 13.875Z"
          })
        })
      })
    ]
  })
};

function generateTitle(error) {
  const reactError = error.message.match(/Minified React error #[0-9]+;/);

  if (!reactError) return intl.Messages.HELP;

  const [ message ] = reactError;

  return message.slice(0, message.length - 1);
};

function PictureInPicture({ src, windowKey }) {
  /** @type {React.RefObject<HTMLVideoElement>} */
  const videoRef = React.useRef(null);
  const [ state, setState ] = React.useState(0);
  /** @type {Window} */
  const Window = useStateFromStores([ PopoutWindowStore ], () => PopoutWindowStore.getWindow(windowKey))

  React.useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const style = document.createElement("style");
    style.innerText = `#wrapper {
      width: 100%;
      height: 100%;
    } 
    #wrapper:hover #controls, .show-controls #controls {
      transform: translateX(-50%);
      opacity: 1;
    } 
    #video {
      width: 100%;
      height: 100%;
      background: black;
    }
    #loop, #download, #video, #action, #pin, #volume {
      cursor: pointer;
      color: var(--interactive-normal);
    }
    #loop:hover, #download:hover, #video:hover, #action:hover, #pin:hover, #volume:hover {
      cursor: pointer;
      color: var(--interactive-hover);
    }
    #loop:active:hover, #download:active:hover, #video:active:hover, #action:active:hover, #pin:active:hover, #volume:active:hover {
      cursor: pointer;
      color: var(--interactive-active);
    }
    #controls {
      position: fixed;
      left: 50%;
      box-sizing: border-box;
      width: min(calc(100vw - 32px), 500px);
      bottom: 16px;
      transform: translateX(-50%) translatey(calc(100% + 16px));
      background: rgba(0, 0, 0, 0.294);
      color: white;
      padding: 8px;
      height: 40px;
      border-radius: 24px;
      opacity: 0;
      transition: transform 150ms ease, opacity 150ms ease;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .volumeSlider {
      transform: translate(10px, -7px);
      background: rgba(0, 0, 0, 0.294);
    }
    #loop.active {
      color: var(--brand-experiment);
    }
    #slider {
      display: flex;
      width: 100%;
      align-self: stretch;
    }
    #duration {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
    }`;
    Window.document.head.appendChild(style);

    function play() { setState(0); };
    function pause() { setState(1); };
    function ended() {
      setState(2); 
      showControls(true);
    };
    
    video.addEventListener("play", play);
    video.addEventListener("pause", pause);
    video.addEventListener("ended", ended);

    return () => {
      video.removeEventListener("play", play);
      video.removeEventListener("pause", pause);
      video.removeEventListener("ended", ended);
    };
  }, [ ]);

  const [ volume, setVolume ] = useVolume();
  const [ muted, setMuted ] = useMuted();
  React.useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = muted ? 0 : volume;
  }, [ volume, muted ]);

  const [ duration, setDuration ] = React.useState(0);
  const [ currentTime, setCurrentTime ] = React.useState(0);

  const durationBar = React.useRef();

  const [ paused, setPaused ] = React.useState(false);
  const [ shouldShowControls, showControls ] = React.useState(false);

  const [ buffers, setBuffers ] = React.useState([ ]);

  return React.createElement("div", {
    id: "wrapper",
    className: shouldShowControls ? "show-controls" : "",
    onContextMenu: () => showControls(!shouldShowControls),
    children: [
      React.createElement("video", {
        id: "video",
        src,
        autoPlay: true,
        ref: videoRef,
        onProgress: () => setBuffers(getBuffers(videoRef.current)),
        onClick: () => {
          setPaused(!videoRef.current.paused);
          showControls(!videoRef.current.paused);
          if (videoRef.current.paused) videoRef.current.play();
          else videoRef.current.pause();
        },
        onTimeUpdate: (event) => {
          if (!durationBar.current) return;
          setCurrentTime(event.currentTarget.currentTime);
          durationBar.current.setGrabber(
            event.currentTarget.currentTime / event.currentTarget.duration
          );
        },
        onLoadedData: (event) => setDuration(event.currentTarget.duration)
      }),
      React.createElement("div", {
        id: "controls",
        children: [
          React.createElement("div", {
            id: "action",
            children: [
              state === 0 && React.createElement(Pause, { width: 24, height: 24 }),
              state === 1 && React.createElement(Play, { width: 24, height: 24 }), 
              state === 2 && React.createElement(Replay, { width: 24, height: 24 })
            ],
            onClick: () => {
              setPaused(!videoRef.current.paused);
              showControls(!videoRef.current.paused);
              if (videoRef.current.paused) videoRef.current.play();
              else videoRef.current.pause();
            }
          }),
          React.createElement("div", {
            id: "loop",
            children: React.createElement(Loop, { width: 24, height: 24 }),
            onClick: (event) => {
              const video = videoRef.current;
              if (!video) return;

              if (video.loop = !video.loop) event.currentTarget.classList.add("active");
              else event.currentTarget.classList.remove("active");
            }
          }),
          React.createElement(Duration, { 
            currentTime: Math.floor(currentTime), 
            duration: Math.floor(duration)
          }),
          React.createElement("div", {
            id: "slider",
            children: React.createElement(DurationBar, {
              buffers,
              currentWindow: Window,
              type: "DURATION",
              value: duration,
              onDrag: (multiplier) => {
                if (multiplier === 1) {
                  videoRef.current.pause();
                  setPaused(true);
                }
                else videoRef.current.currentTime = multiplier * videoRef.current.duration;

                setCurrentTime(videoRef.current.currentTime);

                if (durationBar.current) durationBar.current.setGrabber(multiplier);
              },
              onDragEnd: () => {
                if (!paused) videoRef.current.play();
              },
              onDragStart: () => {
                videoRef.current.pause();
              },
              ref: durationBar
            })
          }),
          React.createElement("div", {
            id: "volume",
            children: React.createElement(VolumeSlider, {
              minValue: 0,
              maxValue: 1,
              value: volume,
              currentWindow: Window,
              onValueChange: (volume) => {
                setVolume(volume);
                setMuted(false);
              },
              muted,
              onToggleMute: () => setMuted(!muted),
              sliderClassName: "volumeSlider"
            })
          }),
          React.createElement("a", {
            id: "download",
            href: src,
            target: "_blank",
            rel: "noreferrer noopener",
            role: "button",
            children: React.createElement(Download, { width: 24, height: 24 })
          })
        ]
      })
    ]
  });
};

function Popout({ src, windowKey }) {
  const fileName = React.useMemo(() => {
    const dirname = DiscordNative.fileManager.dirname(src);
    return src.replace(`${dirname}/`, "");
  }, [ ]);

  return React.createElement(PopoutWindow, {
    windowKey: windowKey,
    withTitleBar: true,
    macOSFrame: true,
    title: `${fileName} - Discord`,
    children: React.createElement(ErrorBoundary, {
      windowKey,
      src: src
    })
  });
};

const encodeBase64 = (str) => {
  return btoa(new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), ""));
};

const appendPipButton = (videoButtons) => {
  /** @type {HTMLVideoElement} */
  const video = videoButtons.parentElement.querySelector("video");

  const node = document.createElement("div");
  node.addEventListener("click", () => {
    const windowKey = `DISCORD_PIP_${encodeBase64(video.src)}`;

    if (node.classList.contains("BMP_active")) {
      node.classList.remove("BMP_active");
      return PopoutWindowStore.unmountWindow(windowKey);
    };

    dispatcher.dispatch({
      type: "POPOUT_WINDOW_OPEN",
      key: windowKey,
      render: () => React.createElement(Popout, {
        windowKey,
        src: video.src
      }),
      features: {popout: true}
    });
    // Listener to remove the active class
    function listener() {
      if (PopoutWindowStore.getWindowOpen(windowKey)) return;

      node.classList.remove("BMP_active");
      PopoutWindowStore.removeChangeListener(listener);
    };
    PopoutWindowStore.addChangeListener(listener);

    node.classList.add("BMP_active");
  })

  node.classList.add("BMP_button");
  
  node.innerHTML = `<svg class="${classes.controlIcon}" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="transparent" fill-rule="evenodd" clip-rule="evenodd" d="M0 0h24v24H0V0z" aria-hidden="true"></path>
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" aria-hidden="true"></path>
</svg>`;
  
  videoButtons.insertBefore(node, videoButtons.childNodes[videoButtons.childNodes.length - 1])
};

const observer = new MutationObserver((records) => {
  for (const { addedNodes } of records) {
    /** @type {HTMLElement} */
    const videoButton = Array.from(addedNodes).find(node => node.classList.value === classes.videoControls);
    if (!videoButton) continue;    
    
    appendPipButton(videoButton);
    appendLoopButton(videoButton);
  };
});

module.exports = class BetterMediaPlayer {
  observer(record) {
    for (const added of record.addedNodes) {
      for (const video of getAllMediaPlayers(added)) {
        const videoButton = video.parentElement.querySelector(`.${classes.videoControls}`);
      
        if (videoButton) {
          appendPipButton(videoButton);
          appendLoopButton(videoButton);
        }
        else observer.observe(video.parentElement, {
          childList: true,
          attributes: true
        });
      }
    }
  };
  start() {
    this.observer({ addedNodes: [ document ] });

    DOM.addStyle(".BMP_active svg { color: var(--brand-500) }");
  };
  stop() {
    DOM.removeStyle();

    Array.from(document.querySelectorAll("[data-bmp-hook]"), node => node.removeAttribute("data-bmp-hook"));
    Array.from(document.querySelectorAll(".BMP_button"), node => node.remove());

    for (const key of PopoutWindowStore.getWindowKeys()) {
      if (!key.startsWith("DISCORD_PIP_")) continue;
      try {
        PopoutWindowStore.unmountWindow(key);
      } 
      catch (error) {
        console.groupCollapsed(
          `%cBMP%c Error accord when unmounting%c\n${key.replace("DISCORD_PIP_", "")}`, 
          "color: #202124; padding: 3px 2px; background: #ed4245; border-radius: 3px;", 
          "color: red", 
          "color: yellow"
        );
        console.error(error);
        console.groupEnd();
      };
    };

    observer.disconnect();
  };
};
