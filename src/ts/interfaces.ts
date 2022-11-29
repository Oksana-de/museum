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
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: DynamicSlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    visibleSlides:Element[],
    isInfinite: boolean,
    numberOfVisibleSlides: number 
}

interface SliderWelcomeInterface {
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: DynamicSlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    visibleSlides: Element[],
    isInfinite: boolean,
    numberOfVisibleSlides: number,
}