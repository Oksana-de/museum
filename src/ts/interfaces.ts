interface ClassNamesObj {
    pointer: string[],
    animation: string[]
}


interface DynamicSlidesClasses {
    toLeft: ClassNamesObj,
    toRight: ClassNamesObj
}

interface SliderInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    speed: number,
    dynamicSlidesClasses: DynamicSlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    timeoutID: number,
    numberOfVisibleSlides: number 
}

interface SliderWelcomeInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    speed: number,
    dynamicSlidesClasses: DynamicSlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    timeoutID: number,
    numberOfVisibleSlides: number,
    bullets: NodeListOf<Element>,
    indexOfSlideWelcome: number
}