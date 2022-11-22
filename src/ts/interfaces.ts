interface dynamicSlidesClassesInterface {
    toLeft: {
        pointer: string[],
        animation: string[]
    },
    toRight: {
        pointer: string[],
        animation: string[]
    }
}

interface SliderInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    direction: string,
    isUnabled: boolean,
    timeoutID: number,
    speed: number,
    currentSlidePosition: number,
    dynamicSlidesClasses: dynamicSlidesClassesInterface,
    numberOfVisibleSlides: number 
}

interface SliderWelcomeInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    direction: string,
    isUnabled: boolean,
    timeoutID: number,
    speed: number,
    currentSlidePosition: number,
    dynamicSlidesClasses: dynamicSlidesClassesInterface,
    numberOfVisibleSlides: number,
    bullets: NodeListOf<Element>,
    indexOfSlideWelcome: number
}