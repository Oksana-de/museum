const sliderWelcomeArea: Element | null = document.querySelector('.welcome-section .welcome__slider');
const slidesWelcome: NodeListOf<Element> = document.querySelectorAll('.welcome-section .welcome__img');
const bullets: NodeListOf<HTMLElement> = document.querySelectorAll('.welcome-section .bullet__item');
const arrows: NodeListOf<HTMLElement> = document.querySelectorAll('.welcome-section .arrow');
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

const slidesClasses: SlidesClasses = {
    toLeft: ['hide-to-left', 'show-from-right'],
    toRight: ['hide-to-right', 'show-from-left']
}

const Slider = function(
    this: SliderInterface,
    sliderArea: Element | null,
    slides: NodeListOf<Element>,
    speed: number,
    slidesClasses: DynamicSlidesClasses
) {
    this.sliderArea = sliderArea,
    this.slides = slides,
    this.speed = speed,
    this.slidesClasses = slidesClasses,
    this.currentSlidePosition = 0,
    this.isUnabled = false,
    this.direction,
    this.visibleSlides = [this.slides[this.currentSlidePosition]],
    this.timeoutID,
    this.isInfinite = false,
    // TODO: in the slider for video-section needed
    this.numberOfVisibleSlides
}

Slider.prototype.setAnimation = (func: string): string => {
    return `this.${func}.bind(this)`;
}

Slider.prototype.slideIndex = function(index: number): number {
    index = (index + this.slides.length) % this.slides.length;
    return index = (index + this.slides.length) % this.slides.length;
}

Slider.prototype.detectDirectionToSlide = function(direction: string): void {
    this.direction = direction;
}

Slider.prototype.defineNextSlidePosition = function(position: number): number {
    let nextSlidePosition: number = position;
    nextSlidePosition = this.direction === Object.keys(this.slidesClasses)[0]
        ? this.slideIndex(position + 1)
        : this.slideIndex(position - 1);

    return nextSlidePosition;
}

Slider.prototype.defineCurrentSlidePosition = function(position: number): number {
    position = this.direction === Object.keys(this.slidesClasses)[0]
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
    classNamesObj = this.slidesClasses[this.direction];
    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, classNamesObj.animation[index]);
    });
}

Slider.prototype.cancelClassNames = function(position: number): void {
    classNamesObj = this.slidesClasses[this.direction];

    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.remove(className, classNamesObj.animation[index])
    });
}

// * Infinite Slider

Slider.prototype.startInfiniteSlider = function(): void {
    this.isInfinite = true;
    this.sliderArea.addEventListener('mouseenter', this.pauseSlider.bind(this));
    this.sliderArea.addEventListener('mouseleave', this.switchDirection.bind(this));
    this.playInfiniteSlider(this.currentSlidePosition);
}

Slider.prototype.playInfiniteSlider = function(position: number): void {
    this.assignClassNames(position);                   
    this.runSlider(position);
}

Slider.prototype.runSlider = function(position: number): void {    
    this.timeoutID = setTimeout(() => {
        this.cancelClassNames(this.currentSlidePosition);
        this.defineCurrentSlidePosition(position);
        this.playInfiniteSlider(this.currentSlidePosition);        
    }, this.speed);
}

Slider.prototype.pauseSlider = function(): void {    
    clearTimeout(this.timeoutID);
}

Slider.prototype.switchDirection = function(): void {   
    this.cancelClassNames(this.currentSlidePosition);

    this.direction = this.direction ===  Object.keys(this.slidesClasses)[0]
        ?  Object.keys(this.slidesClasses)[1]
        :  Object.keys(this.slidesClasses)[0];

    this.defineCurrentSlidePosition(this.currentSlidePosition);
    this.playInfiniteSlider(this.currentSlidePosition);
}

// !!!!

const SliderWelcome = function (this: SliderWelcomeInterface, sliderArea: Element | null, slides: NodeListOf<Element>, bullets: NodeListOf<Element>, arrows: NodeListOf<Element>, speed: number, slidesClasses: DynamicSlidesClasses) {
    Slider.call(this, sliderArea, slides, speed, slidesClasses);

    this.bullets = bullets;
    this.arrows = arrows;
    this.indexOfSlideWelcome = 0;
}

SliderWelcome.prototype = Object.create(Slider.prototype);

Object.defineProperty(SliderWelcome.prototype, 'constructor', {
    value: SliderWelcome,
    enumerable: false,
    writable: true
});

Slider.prototype.assignClassNames = function(position: number): void {
    classNamesObj = this.slidesClasses[this.direction];
    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, classNamesObj.animation[index])
    });

    if (this.direction === Object.keys(this.slidesClasses)[0]) {
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
    classNamesObj = this.slidesClasses[this.direction];

    classNamesObj.pointer.map((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.remove(className, classNamesObj.animation[index])
    });

    if (this.direction === Object.keys(this.slidesClasses)[0]) {
        this.bullets[(position + 1) % this.slides.length].classList.remove('active');
    } else {
        this.bullets[position].classList.remove('active');
    }    
}

SliderWelcome.prototype.thumbsSwitcher = function(): void {
    [...this.bullets].forEach(thumb => thumb.addEventListener('click', (element: Event) => {
        if (!this.isInfinite || this.isUnabled) {  
            [...this.bullets].forEach(item => item.classList.remove('active'));

            elementTarget = element.target as HTMLElement;
            elementTarget.classList.add('active');

            clearTimeout(this.timeoutID);

            this.cancelClassNames(this.currentSlidePosition);

            this.currentSlidePosition = this.direction === Object.keys(this.slidesClasses)[0]
                ? (Array.from(this.bullets).indexOf(element.target) - 1 + this.slides.length) % this.slides.length
                : Array.from(this.bullets).indexOf(element.target);
// !
            this.isInfinite
              ? this.playInfiniteSlider(this.currentSlidePosition)
              : this.assignClassNames(this.currentSlidePosition);
        }  
    }))
}

SliderWelcome.prototype.assignAnimationClasses = function(event: Event): void {
    [...this.visibleSlides].map((slide: Element, index: number): void => {
        index === 0
        ? slide.classList.remove('active-slide', this.slidesClasses[this.direction][index])
        : slide.classList.remove(this.slidesClasses[this.direction][index]);

        slide.removeEventListener('animationend', this.setAnimation);
    })

    this.setAnimation = () => 'stop';

    if (!event) {

        this.currentSlidePosition = this.defineNextSlidePosition(this.currentSlidePosition);
        this.visibleSlides = this.visibleSlides.slice(1);

        console.log('vsisble slides: ', this.visibleSlides, 'currSlide: ', this.currentSlidePosition); 
    }
}

SliderWelcome.prototype.arrowsSwitcher = function(): void {
    currentSlide!.textContent = `${(this.currentSlidePosition + 1).toString().padStart(2, '0')}`;

    [...this.arrows].forEach((arrow, index) => arrow.addEventListener('click', () => {     
        bullets[this.currentSlidePosition].classList.remove('active');

        this.direction = Object.keys(this.slidesClasses)[index];
        this.visibleSlides.push(this.slides[this.defineNextSlidePosition(this.currentSlidePosition)]);

        currentSlide!.textContent = `${(this.defineNextSlidePosition(this.currentSlidePosition) + 1).toString().padStart(2, '0')}`;
        bullets[this.defineNextSlidePosition(this.currentSlidePosition)].classList.add('active');

        this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));

        [... this.visibleSlides].map((slide, index) => {
            slide.classList.add('active-slide', this.slidesClasses[this.direction][index]);
            slide.addEventListener('animationend', this.setAnimation);
        });
    }))    
}

const sliderWelcome = new (SliderWelcome as SliderWelcomeInterface)(sliderWelcomeArea, slidesWelcome, bullets, arrows, 3000, slidesClasses);
// sliderWelcome.detectDirectionToSlide(Object.keys(sliderWelcome.dynamicSlidesClasses)[0]);
sliderWelcome.detectDirectionToSlide(Object.keys(sliderWelcome.slidesClasses)[0]);

// sliderWelcome.startInfiniteSlider();

// sliderWelcome.preventEventWhileAnimate();

// sliderWelcome.thumbsSwitcher();
sliderWelcome.arrowsSwitcher();

totalSlides!.textContent = `${[...slidesWelcome].length.toString().padStart(2, '0')}`;