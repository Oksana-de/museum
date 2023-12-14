interface AnimationClassNamesObj {
    forward: string[],
    backward: string[]
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
    visibleSlides: Element[],
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

// ========== Interfaces for Tickets Section ============== //
interface ProductElements {
    productName: HTMLElement,
    price: HTMLElement,
    amount: HTMLElement,
    priceForProduct: HTMLElement
}
interface DOMDisplayCart {
    [key: string]: HTMLElement | ProductElements[],
}
interface ProductsCart {
    category: string,
    products: Array<Product>,
    sum: number
}

interface Product {
    productType: string,
    price: number,
    amount: number
}

interface ChangeInput {
    inputElement: HTMLInputElement,
    checkedCategory?: number,
    productName: string,
    productAmount: number
}

interface EventsSet {
    [eventName: string]: Function
}

interface TicketsForm {
    ticketForm: HTMLFormElement | null;
    categoryComponent: HTMLLabelElement[] | undefined;
    eventsSet: EventsSet;
}

interface MediatorForTicketsForm extends TicketsForm {
    subscribe: Function,
    publish: Function,
    unsubscribe: Function
    installTo: Function
}
interface Subscriber {
    [eventName: string]: Function[]    
}