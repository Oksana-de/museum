const container: HTMLDivElement | null = document.querySelector('.explore-section .slider');
const picture: HTMLDivElement | null = document.querySelector('.explore-section .slider .after');
const divider: HTMLDivElement | null = document.querySelector('.explore-section .divider');

const dividersHorisontalOffset: number = Math.round(divider!.clientWidth / 2);

let cursorX: number;
let containerWidth: number;
let isClicked: boolean = false;

// ----------- Mouse Events -------------- //

divider!.addEventListener('mousedown', function(event: MouseEvent): void {
    event.preventDefault();
    isClicked = true;    

    container?.addEventListener('mousemove', function slideMove(event: MouseEvent): void | boolean {
        if (!isClicked) return false;

        containerWidth = container.clientWidth;
        cursorX = event.clientX - container.offsetLeft;

        cursorParams(cursorX, containerWidth);
    })  
})

container?.addEventListener('mouseup', (): boolean => isClicked = false);

// ----------- Touch Events -------------- //

divider!.addEventListener('touchstart', function(event: TouchEvent): void {
    event.preventDefault();
    isClicked = true;    

    container?.addEventListener('touchmove', function slideMove(event: TouchEvent): void | boolean {
        if (!isClicked) return false;

        containerWidth = container.clientWidth;
        cursorX = event.touches[0].clientX - container.offsetLeft;

        cursorParams(cursorX, containerWidth);
    })  
})

container?.addEventListener('touchend', (): boolean => isClicked = false);

// ------------- Function for calculating the cursor position -------------//

function cursorParams(paramX: number, containerWidth: number): void {
    if (paramX > 0 && paramX < containerWidth - 1) {
        picture!.style.width = `${paramX}px`;
        divider!.style.left = `${paramX - dividersHorisontalOffset}px`;
    } else {
        isClicked = false;
    }
}