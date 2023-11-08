const sliderWelcomeArea: Element | null = document.querySelector('.welcome-section .welcome__slider');
const slidesWelcome: NodeListOf<Element> = document.querySelectorAll('.welcome-section .welcome__img');
const bullets: NodeListOf<HTMLElement> = document.querySelectorAll('.welcome-section .bullet__item');
const arrows: NodeListOf<HTMLElement> = document.querySelectorAll('.welcome-section .arrow');
const currentSlide: HTMLParagraphElement | null = document.querySelector('.welcome-section .current-page');
const totalSlides: HTMLParagraphElement | null = document.querySelector('.welcome-section .last-page');

let elementTarget: HTMLElement;
let classNamesObj: ClassNamesObj;

const slidesWelcomeClasses: SlidesClasses = {
    toLeft: ['hide-to-left', 'show-from-right'],
    toRight: ['hide-to-right', 'show-from-left']
}

const slidesVideoClasses: SlidesClasses = {
    toLeft: ['hide-to-left', 'show-from-right'],
    toRight: ['hide-to-right', 'show-from-left']
}

const Slider = function(
    this: SliderInterface,
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: DynamicSlidesClasses
) {
    this.slides = slides,
    this.bullets = bullets,
    this.arrows =arrows,
    this.slidesClasses = slidesClasses,
    this.currentSlidePosition = 0,
    this.isUnabled = false,
    this.direction = 'toLeft',
    this.visibleSlides = [this.slides[this.currentSlidePosition]],
    this.isInfinite = false,
    this.numberOfVisibleSlides = 1
}

Slider.prototype.toggleState = function(): boolean {
    this.isUnabled = !this.isUnabled;
   
    return this.isUnabled;
};

Slider.prototype.setAnimation = (func: string): string => {
    return `this.${func}.bind(this)`;
}

Slider.prototype.slideIndex = function(index: number): number {
    index = (index + this.slides.length) % this.slides.length;
    return index = (index + this.slides.length) % this.slides.length;
}

Slider.prototype.defineNextSlidePosition = function(position: number): number {
    let nextSlidePosition: number = position;
    nextSlidePosition = this.direction === Object.keys(this.slidesClasses)[0]
        ? this.slideIndex(position + 1)
        : this.slideIndex(position - 1);

    return nextSlidePosition;
}

Slider.prototype.assignAnimationClasses = function(event: Event): void {
    [...this.visibleSlides].map((slide: Element, index: number): void => {
        index === 0
        ? slide.classList.remove('active-slide', this.slidesClasses[this.direction][index])
        : slide.classList.remove(this.slidesClasses[this.direction][index]);

        slide.removeEventListener('animationend', this.setAnimation);
    })    

    this.setAnimation = () => 'stop';

    if (!event) {
        this.currentSlidePosition = [... this.slides].indexOf([...this.visibleSlides][1]);
        this.visibleSlides = this.visibleSlides.slice(1);
        this.toggleState();        
    }
}

Slider.prototype.moveSlide = function(target: Element, index: number): void {
    bullets[this.currentSlidePosition].classList.remove('active');

    if (target.classList.contains('bullet__item')) {
        this.currentSlidePosition < index
        ? this.direction = Object.keys(this.slidesClasses)[0]
        : this.direction = Object.keys(this.slidesClasses)[1];

        this.visibleSlides.push(this.slides[index]);

        currentSlide!.textContent = `${(index + 1).toString().padStart(2, '0')}`;
        target.classList.add('active');
    } else {
        this.direction = Object.keys(this.slidesClasses)[index];
        this.visibleSlides.push(this.slides[this.defineNextSlidePosition(this.currentSlidePosition)]);
        currentSlide!.textContent = `${(this.defineNextSlidePosition(this.currentSlidePosition) + 1).toString().padStart(2, '0')}`;
        bullets[this.defineNextSlidePosition(this.currentSlidePosition)].classList.add('active');
    }   

    [... this.visibleSlides].map((slide, slideIndex) => {
        slide.classList.add('active-slide', this.slidesClasses[this.direction][slideIndex]);
        slide.addEventListener('animationend', this.setAnimation);
    });
}

Slider.prototype.arrowsSwitcher = function(): void {
    currentSlide!.textContent = `${(this.currentSlidePosition + 1).toString().padStart(2, '0')}`;

    [...this.arrows].forEach((arrow, index) => arrow.addEventListener('click', (event: Event) => {
        
       if (this.isUnabled === false) {
            this.toggleState();
            this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));
            this.moveSlide(event.target, index);
        }
    })); 

    [...this.arrows].forEach((arrow, index) => arrow.addEventListener('touchstart', (event: TouchEvent) => {
        
       if (this.isUnabled === false) {
            this.toggleState();
            this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));
            this.moveSlide(event.target, index);
        }
    }));    
}

Slider.prototype.bulletsSwitcher = function(): void {
    [...this.bullets].forEach((bullet, index) => bullet.addEventListener('click', (event: Event) => {

        if (this.isUnabled === false && event.target instanceof HTMLElement && !event.target.classList.contains('active')) {
            this.toggleState();
            this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));
            this.moveSlide(event.target, index);
        }        
    }));

    [...this.bullets].forEach((bullet, index) => bullet.addEventListener('touchstart', (event: TouchEvent) => {

        if (this.isUnabled === false && event.target instanceof HTMLElement && !event.target.classList.contains('active')) {
            this.toggleState();
            this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));
            this.moveSlide(event.target, index);
        }        
    }));
}

// * Infinite Slider
Slider.prototype.defineCurrentSlidePosition = function(position: number): number {
    position = this.direction === Object.keys(this.slidesClasses)[0]
        ? position + 1
        : position - 1;

    this.currentSlidePosition = (position + this.slides.length) % this.slides.length;
    return this.currentSlidePosition;
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

//* End of the Infinite Slider

const SliderWelcome = function (
    this: SliderWelcomeInterface,
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: DynamicSlidesClasses,
    sliderSurface: Element | null
) {

    Slider.call(this, slides, bullets, arrows, slidesClasses);
    this.sliderSurface = sliderSurface,
    this.startX = 0;
    this.startY = 0;
    this.distX = 0;
    this.distY = 0;
    this.startTime = 0;
    this.elapsedTime = 0;
    this.threshold = 150;
    this.restraint = 100;
    this.allowedTime = 300;
}

SliderWelcome.prototype = Object.create(Slider.prototype);

Object.defineProperty(SliderWelcome.prototype, 'constructor', {
    value: SliderWelcome,
    enumerable: false,
    writable: true
});

SliderWelcome.prototype.detectSwipe = function(): void {  
    this.mouseDownDetect();
    this.mouseUpDetect();
}

SliderWelcome.prototype.mouseDownDetect = function(): void {        
    this.sliderSurface.addEventListener('mousedown', (event: MouseEvent) => {
        if (!this.isUnabled) {          
            this.startX = event.pageX;
            this.startY = event.pageY;
            this.startTime = new Date().getTime();
            event.preventDefault();
        }
    })
}

SliderWelcome.prototype.mouseUpDetect = function() {
    this.sliderSurface.addEventListener('mouseup', (event: MouseEvent) => {
        this.distX = event.pageX - this.startX;
        this.distY = event.pageY - this.startY;
        this.elapsedTime = new Date().getTime() - this.startTime;        

        if (this.elapsedTime <= this.allowedTime) {
            if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint && this.isUnabled === false) {
                this.toggleState();
                this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));

                this.distX < 0
                    ? this.moveSlide(event.target, 0)
                    : this.moveSlide(event.target, 1);
            }  
            event.preventDefault();
        }
    })
}


SliderWelcome.prototype.detectTouch = function(): void {  
    this.touchStartDetect();
    this.touchEndDetect();
}

SliderWelcome.prototype.touchStartDetect = function(): void {        
    this.sliderSurface.addEventListener('touchstart', (event: TouchEvent) => {    
        if (!this.isUnabled) {          
            this.startX = event.changedTouches[0].pageX;
            this.startY = event.changedTouches[0].pageY;
            this.startTime = new Date().getTime();
            event.preventDefault();
        }
    })
}

SliderWelcome.prototype.touchEndDetect = function() {
    this.sliderSurface.addEventListener('touchend', (event: TouchEvent) => {
        this.distX = event.changedTouches[0].pageX - this.startX;
        this.distY = event.changedTouches[0].pageY - this.startY;
        this.elapsedTime = new Date().getTime() - this.startTime;        

        if (this.elapsedTime <= this.allowedTime) {
            if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint && this.isUnabled === false) {
                this.toggleState();
                this.setAnimation = (event: Event) => this.setAnimation(this.assignAnimationClasses(event));

                this.distX < 0
                    ? this.moveSlide(event.target, 0)
                    : this.moveSlide(event.target, 1);
            }  
            event.preventDefault();
        }
    })
}

const sliderWelcome = new (SliderWelcome as SliderWelcomeInterface)(slidesWelcome, bullets, arrows, slidesWelcomeClasses, sliderWelcomeArea);
sliderWelcome.arrowsSwitcher();
sliderWelcome.bulletsSwitcher();
sliderWelcome.detectSwipe();
sliderWelcome.detectTouch();

totalSlides!.textContent = `${[...slidesWelcome].length.toString().padStart(2, '0')}`;