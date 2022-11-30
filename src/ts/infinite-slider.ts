// Slider.prototype.defineCurrentSlidePosition = function(position: number): number {
//     position = this.direction === Object.keys(this.slidesClasses)[0]
//         ? position + 1
//         : position - 1;

//     this.currentSlidePosition = (position + this.slides.length) % this.slides.length;
//     return this.currentSlidePosition;
// }

// Slider.prototype.assignClassNames = function(position: number): void {
//     classNamesObj = this.slidesClasses[this.direction];
//     classNamesObj.pointer.map((className: string, index: number) => {
//         this.slides[(position + index) % this.slides.length].classList.add(className, classNamesObj.animation[index]);
//     });
// }

// Slider.prototype.cancelClassNames = function(position: number): void {
//     classNamesObj = this.slidesClasses[this.direction];

//     classNamesObj.pointer.map((className: string, index: number) => {
//         this.slides[(position + index) % this.slides.length].classList.remove(className, classNamesObj.animation[index])
//     });
// }

// Slider.prototype.startInfiniteSlider = function(): void {
//     this.isInfinite = true;
//     this.sliderArea.addEventListener('mouseenter', this.pauseSlider.bind(this));
//     this.sliderArea.addEventListener('mouseleave', this.switchDirection.bind(this));
//     this.playInfiniteSlider(this.currentSlidePosition);
// }

// Slider.prototype.playInfiniteSlider = function(position: number): void {
//     this.assignClassNames(position);                   
//     this.runSlider(position);
// }

// Slider.prototype.runSlider = function(position: number): void {    
//     this.timeoutID = setTimeout(() => {
//         this.cancelClassNames(this.currentSlidePosition);
//         this.defineCurrentSlidePosition(position);
//         this.playInfiniteSlider(this.currentSlidePosition);        
//     }, this.speed);
// }

// Slider.prototype.pauseSlider = function(): void {    
//     clearTimeout(this.timeoutID);
// }

// Slider.prototype.switchDirection = function(): void {   
//     this.cancelClassNames(this.currentSlidePosition);

//     this.direction = this.direction ===  Object.keys(this.slidesClasses)[0]
//         ?  Object.keys(this.slidesClasses)[1]
//         :  Object.keys(this.slidesClasses)[0];

//     this.defineCurrentSlidePosition(this.currentSlidePosition);
//     this.playInfiniteSlider(this.currentSlidePosition);
// }
