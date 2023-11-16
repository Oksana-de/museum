interface AnimationClassNamesObj {
    toLeft: string[],
    toRight: string[]
}
interface SlidesClasses {
    animation: AnimationClassNamesObj,
    position: string[]
}
interface SliderInterface {
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: SlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    visibleSlides:Element[],
    isInfinite: boolean,
    numberOfVisibleSlides: number 
}
interface SliderWelcomeInterface {
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: SlidesClasses,
    currentSlidePosition: number,
    isUnabled: boolean,
    direction: string,
    visibleSlides: Element[],
    isInfinite: boolean,
    numberOfVisibleSlides: number,
    sliderSurface: Element | null,
    startX: number,
    startY: number,
    distX: number,
    distY: number,
    startTime: number,
    elapsedTime: number,
    threshold: number,
    restraint: number,
    allowedTime: number
}