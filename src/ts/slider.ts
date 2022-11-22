const sliderWelcomeArea: Element | null = document.querySelector('.welcome-section .welcome__slider');
const slidesWelcome: NodeListOf<Element> = document.querySelectorAll('.welcome-section .welcome__img');
const bullets: NodeListOf<HTMLElement> = document.querySelectorAll('.bullet__item');
const currentSlide: HTMLParagraphElement | null = document.querySelector('.welcome-section .current-page');
const totalSlides: HTMLParagraphElement | null = document.querySelector('.welcome-section .last-page');

let elementTarget: HTMLElement;

const directionSlidesClasses: dynamicSlidesClassesInterface = {
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
    dynamicSlidesClasses: dynamicSlidesClassesInterface
) {
    this.sliderArea = sliderArea,
    this.slides = slides,
    this.direction,
    this.isUnabled = false,
    this.timeoutID,
    this.speed = speed,
    this.currentSlidePosition = 0,
    this.dynamicSlidesClasses = dynamicSlidesClasses,
    // TODO: in the slider for video-section needed
    this.numberOfVisibleSlides
}

Slider.prototype.changeCurrentSlidePosition = function(position: number): number {
    this.currentSlidePosition = (position + this.slides.length) % this.slides.length;
    return this.currentSlidePosition;
}

Slider.prototype.addSlidesFromRight = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[0];

    this.dynamicSlidesClasses[this.direction].pointer.forEach((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, this.dynamicSlidesClasses[this.direction].animation[index]);

        this.slides[(position + index) % this.slides.length].addEventListener('animationend', () => {
            this.isUnabled = true;
        });
    });
}

Slider.prototype.addSlidesFromLeft = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[1];

    this.dynamicSlidesClasses[this.direction].pointer.forEach((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, this.dynamicSlidesClasses[this.direction].animation[index]);

        this.slides[(position + index) % this.slides.length].addEventListener('animationend', () => {
            this.isUnabled = true;
        });
    });
}

Slider.prototype.removeSlidesFromRight = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[0];

    this.isUnabled = false;
    this.dynamicSlidesClasses[this.direction].pointer
        .forEach((className: string, index: number) => this.slides[(position + index) % this.slides.length].classList
            .remove(className, this.dynamicSlidesClasses[this.direction].animation[index]));
}

Slider.prototype.removeSlidesFromLeft = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[1];   

    this.isUnabled = false;
    this.dynamicSlidesClasses[this.direction].pointer
        .forEach((className: string, index: number) => this.slides[(position + index) % this.slides.length].classList
            .remove(className, this.dynamicSlidesClasses[this.direction].animation[index]));
}

Slider.prototype.moveSlidesToLeft = function(position: number): void {
    this.timeoutID = setTimeout(() => {
        this.removeSlidesFromRight(this.currentSlidePosition);
        this.changeCurrentSlidePosition(position + 1);
        this.playPreviouseSlide(this.currentSlidePosition);        
    }, this.speed);
}

Slider.prototype.moveSlidesToRight = function(position: number): void {
    this.timeoutID = setTimeout(() => {
        this.removeSlidesFromLeft(this.currentSlidePosition);
        this.changeCurrentSlidePosition(position - 1);
        this.playNextSlide(this.currentSlidePosition);        
    }, this.speed);
}

Slider.prototype.playPreviouseSlide = function(position: number): void {
    this.addSlidesFromRight(position);                   
    this.moveSlidesToLeft(position);
}

Slider.prototype.playNextSlide = function(position: number): void {
    this.addSlidesFromLeft(position);                   
    this.moveSlidesToRight(position);
}

Slider.prototype.detectDirectionToSlide = function(param: string): void {
    param === Object.keys(this.dynamicSlidesClasses)[0]
        ? this.playNextSlide(this.currentSlidePosition)
        : this.playPreviouseSlide(this.currentSlidePosition);
}

Slider.prototype.stopSlider = function(): void {
    this.sliderArea.addEventListener('mouseenter', () => {
        clearTimeout(this.timeoutID);
    });
}

Slider.prototype.startSlider = function(): void {
    this.sliderArea.addEventListener('mouseleave', () => {
        if (this.isUnabled && this.direction === Object.keys(this.dynamicSlidesClasses)[0]) {
            this.removeSlidesFromRight(this.currentSlidePosition);
            this.changeCurrentSlidePosition(this.currentSlidePosition - 1);
            this.playNextSlide(this.currentSlidePosition);
        }
        if (this.isUnabled && this.direction === Object.keys(this.dynamicSlidesClasses)[1]) {
            this.removeSlidesFromLeft(this.currentSlidePosition);
            this.changeCurrentSlidePosition(this.currentSlidePosition + 1);
            this.playPreviouseSlide(this.currentSlidePosition);
        }
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

SliderWelcome.prototype.removeSlidesFromLeft = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[1];

    this.isUnabled = false;
    this.dynamicSlidesClasses[this.direction].pointer
        .forEach((className: string, index: number) => this.slides[(position + index) % this.slides.length].classList
            .remove(className, this.dynamicSlidesClasses[this.direction].animation[index]));

    this.bullets[position].classList.remove('active');
}

SliderWelcome.prototype.removeSlidesFromRight = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[0];

    this.isUnabled = false;
    this.dynamicSlidesClasses[this.direction].pointer
        .forEach((className: string, index: number) => this.slides[(position + index) % this.slides.length].classList
            .remove(className, this.dynamicSlidesClasses[this.direction].animation[index]));

    this.bullets[(position + 1) % this.slides.length].classList.remove('active');
}

SliderWelcome.prototype.addSlidesFromLeft = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[1];

    this.dynamicSlidesClasses[this.direction].pointer.forEach((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, this.dynamicSlidesClasses[this.direction].animation[index]);
        
        this.bullets[(position + index) % this.slides.length].classList.remove('active');
        this.bullets[position].classList.add('active');

        currentSlide!.textContent = `${(position + 1).toString().padStart(2, '0')}`;

        this.slides[(position + index) % this.slides.length].addEventListener('animationend', () => {
            this.isUnabled = true;
        });
    });
}

SliderWelcome.prototype.addSlidesFromRight = function(position: number): void {
    this.direction = Object.keys(this.dynamicSlidesClasses)[0];

    this.dynamicSlidesClasses[this.direction].pointer.forEach((className: string, index: number) => {
        this.slides[(position + index) % this.slides.length].classList.add(className, this.dynamicSlidesClasses[this.direction].animation[index]);
        
        this.bullets[position].classList.remove('active');
        this.bullets[(position + 1) % this.slides.length].classList.add('active');

        currentSlide!.textContent = `${((position + index) % this.slides.length + 1).toString().padStart(2, '0')}`;

        this.slides[(position + index) % this.slides.length].addEventListener('animationend', () => {
            this.isUnabled = true;
        });
    });
}

SliderWelcome.prototype.thumbsSwitcher = function(): void {
    [...this.bullets].forEach(thumb => thumb.addEventListener('click', (element: Event) => {
        if (this.isUnabled) {  
            [...this.bullets].forEach(item => item.classList.remove('active'));

            elementTarget = element.target as HTMLElement;
            elementTarget.classList.add('active');

            this.indexOfSlideWelcome = Array.from(this.bullets).indexOf(element.target);

            clearTimeout(this.timeoutID);

            this.removeSlidesFromRight(this.currentSlidePosition);
            this.changeCurrentSlidePosition(this.indexOfSlideWelcome - 1);
            this.playPreviouseSlide(this.currentSlidePosition);
        }  
    }))
}

const sliderWelcome = new (SliderWelcome as SliderWelcomeInterface)(sliderWelcomeArea, slidesWelcome, bullets, 3000, directionSlidesClasses);
sliderWelcome.stopSlider();
sliderWelcome.startSlider();

sliderWelcome.detectDirectionToSlide(sliderWelcome.direction);
sliderWelcome.thumbsSwitcher();

totalSlides!.textContent = `${[...slidesWelcome].length.toString().padStart(2, '0')}`;

// TODO: version of the slider for the Video-Section
// const visibleSlidesFromLeft = ['first-slide', 'middle-slide', 'last-slide', 'backstage-slide'];
// const slidesAnimationFromLeft = ['first-slide-from-left', 'middle-slide-from-left', 'last-slide-from-left', 'backstage-slide-from-left'];
// const visibleSlidesFromRight = ['backstage-slide', 'first-slide', 'middle-slide', 'last-slide'];
// const slidesAnimationFromRight = ['backstage-slide-from-right', 'first-slide-from-right', 'middle-slide-from-right', 'last-slide-from-right'];

// const sliderAreaPortfolioSection = document.querySelector('.portfolio-section .slider__area');
// const slides = document.querySelectorAll('.portfolio-section .slide');

// const portfolioSlider = new SliderPortfolio(sliderAreaPortfolioSection, slides, 3000, visibleSlidesFromRight, visibleSlidesFromLeft, slidesAnimationFromRight, slidesAnimationFromLeft);

// portfolioSlider.stopSlider();
// portfolioSlider.startSlider();
// portfolioSlider.detectDirectionToSlide(portfolioSlider.direction);
// portfolioSlider.swipeMouseDownDetect();
// portfolioSlider.swipeMouseUpDetect();

// function SliderPortfolio(sliderArea, slides, timeoutDuration, rightClassNamesArray, leftClassNamesArray, rightAnimationClassNamesArray, leftAnimationClassNamesArray) {
//     Slider.call(this, sliderArea, slides, timeoutDuration, rightClassNamesArray, leftClassNamesArray, rightAnimationClassNamesArray, leftAnimationClassNamesArray);

//     this.surface = sliderArea;
//     this.startX = 0;
//     this.startY = 0;
//     this.distX = 0;
//     this.distY = 0;
//     this.startTime = 0;
//     this.elapsedTime = 0;
//     this.threshold = 150;
//     this.restraint = 100;
//     this.allowedTime = 300;
// }
// SliderPortfolio.prototype = Object.create(Slider.prototype);
// Object.defineProperty(SliderPortfolio.prototype, 'constructor', {
//     value: SliderPortfolio,
//     enumerable: false,
//     writable: true
// });

// SliderPortfolio.prototype.swipeMouseDownDetect = function() {
    
//     this.surface.addEventListener('mousedown', (e) => {
//         if (this.isUnabled) {
//             this.startX = e.pageX;
//             this.startY = e.pageY;
//             this.startTime = new Date().getTime();
//             e.preventDefault();
//         }
//     })
// }

// SliderPortfolio.prototype.swipeMouseUpDetect = function() {
//     this.surface.addEventListener('mouseup', (e) => {
//         this.distX = e.pageX - this.startX;
//         this.distY = e.pageY - this.startY;
//         this.elapsedTime = new Date().getTime() - this.startTime;

//         if (this.elapsedTime <= this.allowedTime) {
//             if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) {
//                 if (this.distX < 0) {
//                     if (this.isUnabled && this.direction === 'fromLeft') {    
//                         this.direction = 'fromRight';

//                         this.removeSlidesFromLeft(this.currentSlidePosition);
//                         this.addSlidesFromRight(this.currentSlidePosition);
//                     } else { 
//                         this.direction = 'fromRight';

//                         this.removeSlidesFromRight(this.currentSlidePosition);
//                         this.changeCurrentSlidePosition(this.currentSlidePosition + 1);
//                         this.addSlidesFromRight(this.currentSlidePosition);
//                     }
//                 } else {
//                     if (this.isUnabled && this.direction === 'fromRight') {    
//                         this.direction = 'fromLeft';

//                         this.removeSlidesFromRight(this.currentSlidePosition);
//                         this.addSlidesFromLeft(this.currentSlidePosition);
//                     } else {   
//                         this.direction = 'fromLeft';

//                         this.removeSlidesFromLeft(this.currentSlidePosition);
//                         this.changeCurrentSlidePosition(this.currentSlidePosition - 1);
//                         this.addSlidesFromLeft(this.currentSlidePosition);
//                     }
//                 }
//             }  
//             e.preventDefault();
//         }
//     })
// }    