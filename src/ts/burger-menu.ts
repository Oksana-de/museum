const burgerMenuBtn: HTMLButtonElement | null = document.querySelector('.burger-menu-btn');
const burgerMenu: HTMLDivElement | null = document.querySelector('.menu');

const isMenu = (): boolean | undefined => {
    return burgerMenu?.classList.contains('show');
};

let isHiding: boolean;

burgerMenu?.addEventListener(
    'animationend',
    () =>         
    isHiding
      ? endHideMenuAnimation()
      : endShowMenuAnimation()
);

burgerMenuBtn?.addEventListener(
    'click',
    () => isMenu()
      ? startHideMenuAnimation()
      : startShowMenuAnimation()
);

document?.addEventListener(
    'click',
    (event) => {
        if (event.target !== burgerMenu && event.target !== burgerMenuBtn && isMenu()) {
            startHideMenuAnimation();
        }
    }
)

function startShowMenuAnimation(): void {   
    isHiding = false;
    burgerMenu?.classList.add('show'); 
    burgerMenu?.classList.add('to-show');
}

function startHideMenuAnimation(): void {    
    isHiding = true;
    burgerMenu?.classList.add('to-hide');
}

function endShowMenuAnimation(): void {
    burgerMenu?.classList.remove('to-show');
}

function endHideMenuAnimation(): void {
    burgerMenu?.classList.remove('to-hide');
    burgerMenu?.classList.remove('show');
}
