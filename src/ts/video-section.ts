// =============== IFrame Player API =============== //

const playList: (string | undefined)[] = [...document.querySelectorAll('.video__item')].map((frame: Element) => frame.firstElementChild?.id);
const videoIds: string[] = ['zp1BXPX8jcU', 'Vi5D6FKhRmo', 'NOhDysLnTvY', 'aWmJ5DgyWPI', '2OR0OCr6uRE'];

const tag: HTMLScriptElement = document.createElement('script');  
tag.src = "https://www.youtube.com/iframe_api";

const firstScriptTag: HTMLScriptElement = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady(): void {
    var YT: any; 
    playList.forEach((item, index): any => {
      new YT.Player(item, {
          height: '253',
          width: '297',
          videoId: videoIds[index],
          playerVars: {
            'playsinline': 1,
            'origin': 'https://museum-landing.netlify.app/'
          },
          events: {
            'onReady': onPlayerReady,
            //'onStateChange': onPlayerStateChange
          }
      })
    });
  }

  function onPlayerReady(event: any) {
    event.target?.playVideo();
  }