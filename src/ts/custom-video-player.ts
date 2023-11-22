import data from '../assets/data/video.json';

const tripleSliderClasses: SlidesClasses = {
    animation: {
        forward: ['hide-to-left', 'first-from-right', 'second-from-right', 'show-from-right'],
        backward: ['show-from-left', 'hide-to-right', 'first-to-right', 'second-to-right']
    },
    position: ['first', 'second', 'third']
}

const videoPlayer: Element | null = document.querySelector('.video-section .video__player-wrapper');
const videoMain: HTMLVideoElement | null = document.querySelector('.video-section .video__item');

const btnPlayMain: HTMLButtonElement | null = document.querySelector('.video-section .play-main');
const playControlPanel: HTMLDivElement | null = document.querySelector('.video-section .video__controls-wrapper');
const btnPlayControl: HTMLButtonElement | null = document.querySelector('.video-section .play-control');
const btnVideoProgress: HTMLInputElement | null = document.querySelector('.video-section .range-bar.play-duration-control');
const btnVolumeProgress: HTMLInputElement | null = document.querySelector('.video-section .play-volume-control');
const btnVolume: HTMLInputElement | null = document.querySelector('.video-section .volume-control');

const btnFullScreen: HTMLButtonElement | null = document.querySelector('.video-section .full-screen');

const slidesVideoThumbArea: HTMLElement | null = document.querySelector('.video-section .video__thumbnails');
const slidesVideoThumb: NodeListOf<HTMLElement> = document.querySelectorAll('.video-section .video__thumb');
const bulletsVideo: NodeListOf<HTMLElement> = document.querySelectorAll('.video-section .bullet__item');
const arrowsVideo: NodeListOf<HTMLElement> = document.querySelectorAll('.video-section .stroke');

const numberOfisibleSlidesVideoThumb: number = 3;
const numberOfSlidesVideoThumb: number = slidesVideoThumb.length;

const forward: string = 'forward';
const backward: string = 'backward';
const cssActiveSlide: string = 'active-slide';
const cssActiveBullet: string = 'active';

const direction = (control: HTMLElement): string => control?.classList.contains('right') ? forward : backward;

let isUnabled: boolean = false;
let counter: number = 0;

let toggleState = function(): boolean {
    isUnabled = !isUnabled;   
    return isUnabled;
}

// starting position of the first slider in a box
let indexOfCurrentSlide: number = 0;
let arrow: HTMLElement;

const indexOfAdditionalSlide = (direction: string, indexCurrent: number, arrayOfSliders: NodeListOf<HTMLElement>, ammountVisibleSliders: number): number => {  
    
    return direction === forward ?
        (indexCurrent + ammountVisibleSliders) % arrayOfSliders.length:
        (indexCurrent - 1 + arrayOfSliders.length) % arrayOfSliders.length;
}

// during arrow click (next or previous)
//define the current visible array of slides and additional one, that should appear from front or back side and apply animation,
//not changing the initial one, which is a list of Nodes
const currentSlidersActiveSet = (direction: string, indexCurrent: number, arrayOfSliders: NodeListOf<HTMLElement>, ammountVisibleSliders: number): Array<HTMLElement> => {
    let result: Array<HTMLElement> = [];

    let additionalSlide = arrayOfSliders[indexOfAdditionalSlide(direction, indexCurrent, arrayOfSliders, ammountVisibleSliders)];

    additionalSlide.classList.add(cssActiveSlide);

    for (let i = 0; i < ammountVisibleSliders; i++) {
        result.push(arrayOfSliders[(indexCurrent + i) % arrayOfSliders.length]);
    }

    direction === forward ?
        result.push(additionalSlide):
        result.unshift(additionalSlide);    
        
    return result;
}

function setAnimation(slide: HTMLElement, index: number, setOfClasses: SlidesClasses, direction: string) {
    if (direction === forward) {
        setOfClasses.position.map((classPosition) => slide.classList
            .contains(classPosition)
                ? slide.classList.remove(classPosition)
                : '');

        slide.classList.add(setOfClasses.animation.forward[index]);
        index != 0 ? slide.classList.add(setOfClasses.position[index - 1]) : '';
        slide.addEventListener('animationend', removeForwardAnimation);        
    } else {
        setOfClasses.position.map((classPosition) => slide.classList
            .contains(classPosition)
                ? slide.classList.remove(classPosition)
                : '');

        slide.classList.add(setOfClasses.animation.backward[index]);
        setOfClasses.position[index] != undefined ? slide.classList.add(setOfClasses.position[index]) : '';

        slide.addEventListener('animationend', removeBackwardAnimation);
    }
}

[...arrowsVideo].map((element) => element.addEventListener('click', function (event: Event) {
    if (!isUnabled) {
        toggleState();

        event.target instanceof HTMLElement? arrow = event.target : '';
   
        currentSlidersActiveSet(direction(arrow), indexOfCurrentSlide, slidesVideoThumb, numberOfisibleSlidesVideoThumb)
            .map((slide, index): void => setAnimation(slide, index, tripleSliderClasses, direction(arrow)));
    
        direction(arrow) === forward ?
            indexOfCurrentSlide = (indexOfCurrentSlide + 1) % slidesVideoThumb.length:
            indexOfCurrentSlide = Math.abs(indexOfCurrentSlide - 1 + slidesVideoThumb.length) % slidesVideoThumb.length;        

        setCurrentBullet(indexOfCurrentSlide, bulletsVideo, cssActiveBullet);
        setMainVideo(indexOfCurrentSlide, videoMain!);
        counter = 0;
    }
}))

function removeForwardAnimation (this: HTMLElement) {
    this.classList.contains(tripleSliderClasses.animation.forward[0])
        ? this.classList.remove(cssActiveSlide)
        : '';

    tripleSliderClasses.animation.forward
        .map((animationClass) => this.classList
            .contains(animationClass)
                ? this.classList.remove(animationClass)
                : '');
    
    this.removeEventListener('animationend', removeForwardAnimation);
    counter++;

    counter === tripleSliderClasses.animation.forward.length 
        ? toggleState() 
        : '';
}

function removeBackwardAnimation (this: HTMLElement) {
    this.classList.contains(tripleSliderClasses.animation.backward[tripleSliderClasses.animation.backward.length - 1])
        ? this.classList.remove(cssActiveSlide)
        : '';

    tripleSliderClasses.animation.backward
        .map((animationClass) => this.classList
            .contains(animationClass)
                ? this.classList.remove(animationClass)
                : '');

    this.removeEventListener('animationend', removeBackwardAnimation);
    counter++;

    counter === tripleSliderClasses.animation.forward.length 
        ? toggleState() 
        : '';
}

function setCurrentBullet(currentSlideIndex: number, bulletsArray: NodeListOf<HTMLElement>, aactiveBulletClassName: string): void {
    [...bulletsArray].map((bullet, index): void => index === currentSlideIndex 
        ? bullet.classList.add(aactiveBulletClassName)
        : bullet.classList.remove(aactiveBulletClassName));
}

function setMainVideo(currentSlideIndex: number, videoItem: HTMLVideoElement): void {
    videoItem.src = data.video[currentSlideIndex].src;
    videoItem.poster = data.video[currentSlideIndex].poster;    
}

// ================ Custom Video Player ================ //
const progressBarFilledColor: string = '#710707';
const progressBarUnFilledColor: string = '#c4c4c4';
let timeToStartVideo: number;

videoMain!.volume = +btnVolumeProgress!.value;
const toggleBtnVolumeIcon = (state: boolean): void => {
    state ? btnVolume!.classList.remove('mute') : btnVolume!.classList.add('mute');
}

let isMute: boolean = false;
let currentVolume: number;

[btnPlayMain, btnPlayControl, videoMain]
    .map((control: HTMLButtonElement | HTMLVideoElement | null): void => control
        ?.addEventListener('click',
            (): void => videoMain!.paused
                ? playVideo()
                : pauseVideo())
        )

function playVideo(): void {
    btnPlayMain?.classList.add('hide');
    btnPlayControl?.classList.add('pause-control');
    videoMain?.play();
}

function pauseVideo() {
    btnPlayMain?.classList.remove('hide');
    btnPlayControl?.classList.remove('pause-control');
    videoMain?.pause();
}

let toggleVolume = function(): boolean {
    isMute = !isMute;  
    return isMute;
}

function toggleMuteMode(): void {
    if (!isMute) {
        currentVolume = +btnVolumeProgress!.value;
        videoMain!.volume = 0;
        btnVolumeProgress!.value = `${videoMain!.volume}`;
        btnVolumeProgress!.style.background = `linear-gradient(to right, ${progressBarFilledColor} 0%, ${progressBarFilledColor} ${videoMain!.volume * 100}%, ${progressBarUnFilledColor} ${videoMain!.volume * 100}%, ${progressBarUnFilledColor} 100%)`;  
    } else {
        if (currentVolume > 0) {
            videoMain!.volume = currentVolume;
            btnVolumeProgress!.value = `${currentVolume}`;
            btnVolumeProgress!.style.background = `linear-gradient(to right, ${progressBarFilledColor} 0%, ${progressBarFilledColor} ${currentVolume * 100}%, ${progressBarUnFilledColor} ${currentVolume * 100}%, ${progressBarUnFilledColor} 100%)`;  
        } else {
            videoMain!.volume = +btnVolumeProgress!.step;
            btnVolumeProgress!.value = `${btnVolumeProgress!.step}`;
            btnVolumeProgress!.style.background = `linear-gradient(to right, ${progressBarFilledColor} 0%, ${progressBarFilledColor} ${+btnVolumeProgress!.step * 100}%, ${progressBarUnFilledColor} ${+btnVolumeProgress!.step * 100}%, ${progressBarUnFilledColor} 100%)`;    
        }
    }
}

function applyMutemode() {
    toggleMuteMode();
    toggleVolume();
    toggleBtnVolumeIcon(!isMute);
}

btnVolume?.addEventListener('click', applyMutemode);

btnVolumeProgress?.addEventListener('input', function() {
    videoMain!.volume = +this.value;
    this.style.background = `linear-gradient(to right, ${progressBarFilledColor} 0%, ${progressBarFilledColor} ${+this.value * 100}%, ${progressBarUnFilledColor} ${+this.value * 100}%, ${progressBarUnFilledColor} 100%)`;
    if (+this.value === 0) {
        btnVolume!.classList.add('mute');
        toggleVolume();
    } else {
        btnVolume!.classList.remove('mute');
    }
    currentVolume = +btnVolumeProgress!.value;    
})

btnVideoProgress?.addEventListener('input', function() {
    let currentTimeVideo = +btnVideoProgress.value * videoMain!.duration;
    videoMain!.currentTime = currentTimeVideo;
    this.style.background = `linear-gradient(to right, ${progressBarFilledColor} 0%, ${progressBarFilledColor} ${+this.value * 100}%, ${progressBarUnFilledColor} ${+this.value * 100}%, ${progressBarUnFilledColor} 100%)`;
})

videoMain?.addEventListener('timeupdate',handleProgress);

videoMain?.addEventListener('ended', ():void => {
    btnPlayMain?.classList.remove('hide');
        btnPlayControl?.classList.remove('pause-control');
})
      
function handleProgress(): void {
    timeToStartVideo = isNaN(videoMain!.currentTime / videoMain!.duration)
        ? 0
        : videoMain!.currentTime / videoMain!.duration;
    
    btnVideoProgress!.value = `${timeToStartVideo}`;
    btnVideoProgress!.style.background = `linear-gradient(to right, ${progressBarFilledColor} 0%, ${progressBarFilledColor} ${timeToStartVideo * 100}%, ${progressBarUnFilledColor} ${timeToStartVideo * 100}%, ${progressBarUnFilledColor} 100%)`;
}

// ============== Set FullScreen Mode Functionality ========= //
btnFullScreen?.addEventListener('click', (): void => toggleFullScreen());

function toggleFullScreen(): void {
    if (document.fullscreenElement) {
        btnFullScreen?.classList.remove('full-screen-exit');
        document.exitFullscreen();
    } else {
        btnFullScreen?.classList.add('full-screen-exit');
        videoPlayer!.requestFullscreen();
    }
}

function fullscreenChanged(): void {
    if (document.fullscreenElement) {
        setTimeout(() => playControlPanel?.classList.add('hide'), 2000);
    } else {
        playControlPanel?.classList.remove('hide');
    }
}

document.addEventListener('fullscreenchange', fullscreenChanged);

// ============== Keyboard management ============== //
document.addEventListener('keypress', keyboardControl);

function keyboardControl(event: KeyboardEvent): void {
    switch (event.code) {
        case 'KeyM':
            applyMutemode();
            break;
        case 'KeyF':
            toggleFullScreen();
            break;
        case 'Space':
            event.preventDefault();
            videoMain!.paused
                ? playVideo()
                : pauseVideo();
            break;
        case 'Comma':
            if (event.shiftKey) {
                videoMain!.playbackRate -= .25;
                showPlaybackRate();
            }
            break;
        case 'Period':
            if (event.shiftKey) {
                videoMain!.playbackRate += .25;
                showPlaybackRate();                
            }
            break;
    }    
}

function showPlaybackRate(): void {
    videoPlayer?.firstElementChild?.classList.contains('playback-rate-info')
        ? videoPlayer?.firstElementChild?.remove()
        :'';
    
    const plabackRateInfo: HTMLDivElement = document.createElement('div');
    plabackRateInfo.classList.add('playback-rate-info');
    plabackRateInfo.textContent = `${videoMain!.playbackRate}x`;
    videoPlayer?.prepend(plabackRateInfo);

    setTimeout(() => plabackRateInfo.remove(), 3000);
}