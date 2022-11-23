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

Slider.prototype.startInfinitieSlider = function(position: number): void {    
    this.timeoutID = setTimeout(() => {
        this.cancelClassNames(this.currentSlidePosition);
        this.defineCurrentSlidePosition(position);
        this.playSlide(this.currentSlidePosition);        
    }, this.speed);
}

Slider.prototype.playSlide = function(position: number): void {
    this.assignClassNames(position);                   
    this.startInfinitieSlider(position);
}

Slider.prototype.detectDirectionToSlide = function(direction: string): void {
    this.direction = direction;
    this.playSlide(this.currentSlidePosition)
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
            this.playSlide(this.currentSlidePosition);
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

            this.playSlide(this.currentSlidePosition);
        }  
    }))
}

const sliderWelcome = new (SliderWelcome as SliderWelcomeInterface)(sliderWelcomeArea, slidesWelcome, bullets, 3000, directionSlidesClasses);
sliderWelcome.detectDirectionToSlide(Object.keys(sliderWelcome.dynamicSlidesClasses)[0]);
sliderWelcome.preventEventWhileAnimate();

sliderWelcome.stopSlider();
sliderWelcome.switchDirection();

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
//                         this.defineCurrentSlidePosition(this.currentSlidePosition + 1);
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
//                         this.defineCurrentSlidePosition(this.currentSlidePosition - 1);
//                         this.addSlidesFromLeft(this.currentSlidePosition);
//                     }
//                 }
//             }  
//             e.preventDefault();
//         }
//     })
// }    