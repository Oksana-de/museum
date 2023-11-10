const container: HTMLDivElement | null = document.querySelector('.explore-section .slider');
const picture: HTMLDivElement | null = document.querySelector('.explore-section .slider .after');

const divider: HTMLDivElement | null = document.querySelector('.explore-section .divider');
const dividersHorisontalOffset: number = Math.round(divider!.clientWidth / 2);

let pictureWidth: number;
let isClicked: boolean = false;

divider!.addEventListener('mousedown', function(event: MouseEvent): void {
    event.preventDefault();
    isClicked = true;    

    container?.addEventListener('mousemove', function slideMove(event: MouseEvent): void | boolean {
        if (!isClicked) return false;

        pictureWidth = event.clientX - container.offsetLeft;

        if (pictureWidth > 0 && pictureWidth < container.clientWidth - 1) {
            picture!.style.width = `${pictureWidth}px`;
            divider!.style.left = `${pictureWidth - dividersHorisontalOffset}px`;
        } else {
            isClicked = false;
        }
    })  
})

container?.addEventListener('mouseup', (): boolean => isClicked = false);

// ----------- Touch Events -------------- //

divider!.addEventListener('touchstart', function(event: TouchEvent): void {
    event.preventDefault();
    isClicked = true;    

    container?.addEventListener('touchmove', function slideMove(event: TouchEvent): void | boolean {
        if (!isClicked) return false;

        pictureWidth = event.touches[0].clientX - container.offsetLeft;

        if (pictureWidth > 0 && pictureWidth < container.clientWidth - 1) {
            picture!.style.width = `${pictureWidth}px`;
            divider!.style.left = `${pictureWidth - dividersHorisontalOffset}px`;
        } else {
            isClicked = false;
        }
    })  
})

container?.addEventListener('touchend', (): boolean => isClicked = false);