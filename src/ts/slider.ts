const sliderWelcomeArea: Element | null = document.querySelector('.welcome-section .welcome__slider');
const slidesWelcome: NodeListOf<Element> = document.querySelectorAll('.welcome-section .welcome__img');
const bullets: NodeListOf<HTMLElement> = document.querySelectorAll('.bullet__item');
const currentSlide: HTMLParagraphElement | null = document.querySelector('.welcome-section .current-page');
const totalSlides: HTMLParagraphElement | null = document.querySelector('.welcome-section .last-page');

let elementTarget: HTMLElement;
let classNamesObj: ClassNamesObj;

const directionSlidesClasses: DynamicSlidesClasses = {
    toLeft: {
        pointer: ['backstage-slide', 'active-slide'],
        animation: ['hide-to-left', 'show-from-right']
    },
    toRight: {
        pointer: ['active-slide', 'backstage-slide'],
        animation: ['show-from-left', 'hide-to-right']
    }
}

const Slider = function(
    this: SliderInterface,
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    speed: number,
    dynamicSlidesClasses: DynamicSlidesClasses
) {
    this.sliderArea = sliderArea,
    this.slides = slides,
    this.speed = speed,
    this.dynamicSlidesClasses = dynamicSlidesClasses,
    this.currentSlidePosition = 0,
    this.isUnabled = false,
    this.direction,
    this.timeoutID,
    // TODO: in the slider for video-section needed
    this.numberOfVisibleSlides
}

Slider.prototype.defineCurrentSlidePosition = function(position: number): number {
    position = this.direction === Object.keys(this.dynamicSlidesClasses)[0]
        ? position + 1
        : position - 1;

    this.currentSlidePosition = (position + this.slides.length) % this.slides.length;
    return this.currentSlidePosition;
}

Slider.prototype.preventEventWhileAnimate = function(): void {
    [...this.slides].map(sl => sl.addEventListener('animationend', (): boolean => {
        return this.isUnabled = true;
    }));
}

Slider.prototype.assignClassNames = function(position: number): void {
    classNamesObj = this.dynamicSlidesClasses[this.direction];
    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, classNamesObj.animation[index])
    });
}

Slider.prototype.cancelClassNames = function(position: number): void {
    classNamesObj = this.dynamicSlidesClasses[this.direction];

    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.remove(className, classNamesObj.animation[index])
    });
}

Slider.prototype.runSlider = function(position: number): void {    
    this.timeoutID = setTimeout(() => {
        this.cancelClassNames(this.currentSlidePosition);
        this.defineCurrentSlidePosition(position);
        this.playInfiniteSlider(this.currentSlidePosition);        
    }, this.speed);
}

Slider.prototype.playInfiniteSlider = function(position: number): void {
    this.assignClassNames(position);                   
    this.runSlider(position);
}

Slider.prototype.detectDirectionToSlide = function(direction: string): void {
    this.direction = direction;
}

Slider.prototype.stopSlider = function(): void {
    this.sliderArea.addEventListener('mouseenter', () => {
        clearTimeout(this.timeoutID);        
    });
}

Slider.prototype.switchDirection = function(): void {
    this.sliderArea.addEventListener('mouseleave', () => {
        this.cancelClassNames(this.currentSlidePosition);

        this.direction = this.direction ===  Object.keys(this.dynamicSlidesClasses)[0]
            ?  Object.keys(this.dynamicSlidesClasses)[1]
            :  Object.keys(this.dynamicSlidesClasses)[0];

            this.defineCurrentSlidePosition(this.currentSlidePosition);
            this.playInfiniteSlider(this.currentSlidePosition);
    });
}

// !!!!

const SliderWelcome = function (this: SliderWelcomeInterface, sliderArea: Element | null, slides: NodeListOf<Element>, bullets: NodeListOf<Element>, speed: number, dynamicSlidesClasses: dynamicSlidesClassesInterface) {
    Slider.call(this, sliderArea, slides, speed, directionSlidesClasses);

    this.bullets = bullets;
    this.indexOfSlideWelcome = 0;
}

SliderWelcome.prototype = Object.create(Slider.prototype);

Object.defineProperty(SliderWelcome.prototype, 'constructor', {
    value: SliderWelcome,
    enumerable: false,
    writable: true
});

Slider.prototype.assignClassNames = function(position: number): void {
    classNamesObj = this.dynamicSlidesClasses[this.direction];
    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, classNamesObj.animation[index])
    });

    if (this.direction === Object.keys(this.dynamicSlidesClasses)[0]) {
        this.bullets[position].classList.remove('active');
        this.bullets[(position + 1) % this.slides.length].classList.add('active');
    
        currentSlide!.textContent = `${((position + 1) % this.slides.length + 1).toString().padStart(2, '0')}`;
    } else {
        this.bullets[(position + 1) % this.slides.length].classList.remove('active');
        this.bullets[position].classList.add('active');
    
        currentSlide!.textContent = `${(position + 1).toString().padStart(2, '0')}`;
    }    
}

Slider.prototype.cancelClassNames = function(position: number): void {
    classNamesObj = this.dynamicSlidesClasses[this.direction];

    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.remove(className, classNamesObj.animation[index])
    });

    if (this.direction === Object.keys(this.dynamicSlidesClasses)[0]) {
        this.bullets[(position + 1) % this.slides.length].classList.remove('active');
    } else {
        this.bullets[position].classList.remove('active');
    }    
}

SliderWelcome.prototype.thumbsSwitcher = function(): void {
    [...this.bullets].forEach(thumb => thumb.addEventListener('click', (element: Event) => {
        if (this.isUnabled) {  
            [...this.bullets].forEach(item => item.classList.remove('active'));

            elementTarget = element.target as HTMLElement;
            elementTarget.classList.add('active');

            clearTimeout(this.timeoutID);

            this.cancelClassNames(this.currentSlidePosition);

            this.currentSlidePosition = this.direction === Object.keys(sliderWelcome.dynamicSlidesClasses)[0]
                ? (Array.from(this.bullets).indexOf(element.target) - 1 + this.slides.length) % this.slides.length
                : Array.from(this.bullets).indexOf(element.target);

            this.playInfiniteSlider(this.currentSlidePosition);
        }  
    }))
}

const sliderWelcome = new (SliderWelcome as SliderWelcomeInterface)(sliderWelcomeArea, slidesWelcome, bullets, 3000, directionSlidesClasses);
sliderWelcome.detectDirectionToSlide(Object.keys(sliderWelcome.dynamicSlidesClasses)[0]);
sliderWelcome.playInfiniteSlider(sliderWelcome.currentSlidePosition);
sliderWelcome.preventEventWhileAnimate();

sliderWelcome.stopSlider();
sliderWelcome.switchDirection();

sliderWelcome.thumbsSwitcher();

totalSlides!.textContent = `${[...slidesWelcome].length.toString().padStart(2, '0')}`;