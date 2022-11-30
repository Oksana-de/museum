const sliderWelcomeArea: Element | null = document.querySelector('.welcome-section .welcome__slider');
const slidesWelcome: NodeListOf<Element> = document.querySelectorAll('.welcome-section .welcome__img');
const bullets: NodeListOf<HTMLElement> = document.querySelectorAll('.welcome-section .bullet__item');
const arrows: NodeListOf<HTMLElement> = document.querySelectorAll('.welcome-section .arrow');
const currentSlide: HTMLParagraphElement | null = document.querySelector('.welcome-section .current-page');
const totalSlides: HTMLParagraphElement | null = document.querySelector('.welcome-section .last-page');

const slidesVideo: NodeListOf<Element> = document.querySelectorAll('.video-section .video__item');
const bulletsVideo: NodeListOf<HTMLElement> = document.querySelectorAll('.video-section .bullet__item');
const arrowsVideo: NodeListOf<HTMLElement> = document.querySelectorAll('.video-section .stroke');

let elementTarget: HTMLElement;

const slidesWelcomeClasses: SlidesClasses = {
    animation: {
        toLeft: ['hide-to-left', 'show-from-right'],
        toRight: ['hide-to-right', 'show-from-left']
    },
    position: ['first']
}

const slidesVideoClasses: SlidesClasses = {
    animation: {
        toLeft: ['hide-to-left', 'first-from-right', 'second-from-right', 'show-from-right'],
        toRight: ['hide-to-right', 'first-to-right', 'second-to-right', 'show-from-left']
    },
    position: ['first', 'second', 'third']
}

const Slider = function(
    this: SliderInterface,
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: SlidesClasses
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

Slider.prototype.setVisibleSlides = function(): NodeListOf<Element> {
    this.visibleSlides = [this.slides[this.currentSlidePosition]];
    for (let i = 1; i < this.numberOfVisibleSlides; i++) {
        this.visibleSlides.push(this.slides[this.slideIndex(this.currentSlidePosition + i)]);
    }

    return this.visibleSlides;
}

Slider.prototype.toggleState = function(): boolean {
    this.isUnabled = !this.isUnabled;
   
    return this.isUnabled;
}

Slider.prototype.setAnimation = (func: string): string => {
    return `this.${func}.bind(this)`;
}

Slider.prototype.slideIndex = function(index: number): number {
    index = (index + this.slides.length) % this.slides.length;
    return index = (index + this.slides.length) % this.slides.length;
}

Slider.prototype.defineNextSlidePosition = function(position: number): number {
    let nextSlidePosition: number = position;
    nextSlidePosition = this.direction === Object.keys(this.slidesClasses.animation)[0]
        ? this.slideIndex(position + this.numberOfVisibleSlides)
        : this.slideIndex(position - 1);

    return nextSlidePosition;
}

Slider.prototype.assignAnimationClasses = function(event: Event): void {
    [...this.visibleSlides].map((slide: Element, index: number): void => {
        if (this.direction === Object.keys(this.slidesClasses.animation)[0]) {
            index === 0
                ? slide.classList.remove('active-slide', this.slidesClasses.animation[this.direction][index], this.slidesClasses.position[index])
                : slide.classList.remove(this.slidesClasses.animation[this.direction][index], this.slidesClasses.position[index]);
        } else {
            index === this.numberOfVisibleSlides - 1
                ? slide.classList.remove('active-slide', this.slidesClasses.animation[this.direction][index], this.slidesClasses.position[index])
                : slide.classList.remove(this.slidesClasses.animation[this.direction][index], this.slidesClasses.position[index]);
        }

        slide.removeEventListener('animationend', this.setAnimation);
    })    

    this.setAnimation = () => 'stop';

    if (!event) {
        this.direction === Object.keys(this.slidesClasses.animation)[0]
            ? this.currentSlidePosition = [... this.slides].indexOf([...this.visibleSlides][1])
            : this.currentSlidePosition = [... this.slides].indexOf([...this.visibleSlides][this.numberOfVisibleSlides])

        this.visibleSlides = this.setVisibleSlides();  
        
        [... this.visibleSlides].map((slide, slidePosition) => {            
            slide.classList.add(this.slidesClasses.position[slidePosition]);            
        });
        this.toggleState();        
    }
}

Slider.prototype.moveSlide = function(target: Element, index: number): void {
    this.bullets[this.currentSlidePosition].classList.remove('active');

    if (target.classList.contains('bullet__item')) {
        this.currentSlidePosition < index
        ? this.direction = Object.keys(this.slidesClasses.animation)[0]
        : this.direction = Object.keys(this.slidesClasses.animation)[1];

        this.visibleSlides.push(this.slides[index]);

        target.classList.add('active');
    } else {
        this.direction = Object.keys(this.slidesClasses.animation)[index];
        this.visibleSlides.push(this.slides[this.defineNextSlidePosition(this.currentSlidePosition)]);

        this.direction === Object.keys(this.slidesClasses.animation)[0]
            ? this.bullets[(this.currentSlidePosition + 1 + this.slides.length) % this.slides.length].classList.add('active')
            : this.bullets[(this.currentSlidePosition - 1 + this.slides.length) % this.slides.length].classList.add('active');
    }   

    [... this.visibleSlides].map((slide, slideIndex) => {
        slide.classList.add('active-slide', this.slidesClasses.animation[this.direction][slideIndex]);
        slide.addEventListener('animationend', this.setAnimation);
    });
}

Slider.prototype.arrowsSwitcher = function(): void {
    this.visibleSlides = this.setVisibleSlides();    

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

const SliderWelcome = function (
    this: SliderWelcomeInterface,
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: SlidesClasses,
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

SliderWelcome.prototype.detectActiveSlide = function(position: number): string {
    return currentSlide!.textContent = `${(position + 1).toString().padStart(2, '0')}`;
}

SliderWelcome.prototype.moveSlide = function(target: Element, index: number): void {
    this.bullets[this.currentSlidePosition].classList.remove('active');
    

    if (target.classList.contains('bullet__item')) {
        this.currentSlidePosition < index
        ? this.direction = Object.keys(this.slidesClasses.animation)[0]
        : this.direction = Object.keys(this.slidesClasses.animation)[1];

        this.visibleSlides.push(this.slides[index]);
        this.detectActiveSlide(index);

        target.classList.add('active');
    } else {
        this.direction = Object.keys(this.slidesClasses.animation)[index];
        this.visibleSlides.push(this.slides[this.defineNextSlidePosition(this.currentSlidePosition)]);

        if (this.direction === Object.keys(this.slidesClasses.animation)[0]) {
            this.bullets[(this.currentSlidePosition + 1 + this.slides.length) % this.slides.length].classList.add('active');
            this.detectActiveSlide((this.currentSlidePosition + 1 + this.slides.length) % this.slides.length);
        } else {
            this.bullets[(this.currentSlidePosition - 1 + this.slides.length) % this.slides.length].classList.add('active');
            this.detectActiveSlide((this.currentSlidePosition - 1 + this.slides.length) % this.slides.length);
        }
    }   

    [... this.visibleSlides].map((slide, slideIndex) => {
        slide.classList.add('active-slide', this.slidesClasses.animation[this.direction][slideIndex]);
        slide.addEventListener('animationend', this.setAnimation);
    });
}

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

// !!!
const SliderVideo = function (
    this: SliderWelcomeInterface,
    slides: NodeListOf<Element>,
    bullets: NodeListOf<Element>,
    arrows: NodeListOf<Element>,
    slidesClasses: SlidesClasses
) {

    Slider.call(this, slides, bullets, arrows, slidesClasses);
    this.numberOfVisibleSlides = 3
}

SliderVideo.prototype = Object.create(Slider.prototype);

Object.defineProperty(SliderVideo.prototype, 'constructor', {
    value: SliderVideo,
    enumerable: false,
    writable: true
});



const sliderWelcome = new (SliderWelcome as SliderWelcomeInterface)(slidesWelcome, bullets, arrows, slidesWelcomeClasses, sliderWelcomeArea);
sliderWelcome.detectActiveSlide(sliderWelcome.currentSlidePosition);
sliderWelcome.arrowsSwitcher();
sliderWelcome.bulletsSwitcher();
sliderWelcome.detectSwipe();
sliderWelcome.detectTouch();

totalSlides!.textContent = `${[...slidesWelcome].length.toString().padStart(2, '0')}`;

const sliderVideo = new (SliderVideo as SliderInterface)(slidesVideo, bulletsVideo, arrowsVideo, slidesVideoClasses);
sliderVideo.arrowsSwitcher();
sliderVideo.bulletsSwitcher();