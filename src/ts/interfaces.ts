interface ClassNamesObj {
    pointer: string[],
    animation: string[]
}

interface SlidesClasses {
    toLeft: string[],
    toRight: string[]
}

interface DynamicSlidesClasses {
    toLeft: ClassNamesObj,
    toRight: ClassNamesObj
}

interface SliderInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    speed: number,
    slidesClasses: DynamicSlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    visibleSlides:Element[],
    timeoutID: number,
    isInfinite: boolean,
    numberOfVisibleSlides: number 
}

interface SliderWelcomeInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    speed: number,
    slidesClasses: DynamicSlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    visibleSlides: Element[],
    timeoutID: number,
    isInfinite: boolean,

    numberOfVisibleSlides: number,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    indexOfSlideWelcome: number
}