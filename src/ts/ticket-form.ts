const openFormBtn: HTMLFormElement | null = document.querySelector('.btn__tickets');

const overlay: HTMLDivElement | null = document.querySelector('.overlay');

const buyForm: HTMLFormElement | null = document.querySelector('.buy-form__wrapper');
const closeFormBtn: HTMLButtonElement | null = document.querySelector('.btn.btn-close');

const isForm = (): boolean | undefined => {
    return overlay?.classList.contains('show');
};

let isHidingForm: boolean;

overlay?.addEventListener(
    'animationend',
    () =>         
    isHidingForm
      ? endHideFormAnimation()
      : endShowFormAnimation()
)

openFormBtn?.addEventListener('click', showForm);

closeFormBtn?.addEventListener('click', hideForm);

// TODO: close form clicking on the area around the form
// document?.addEventListener(
//     'click',
//     (event) => {
//         if (event.target !== buyForm && event.target !== openFormBtn && isForm()) {
//             hideForm();
//         }
//     }
// )

function showForm(): void {
    isHidingForm = false;
    overlay?.classList.add('show');
    overlay?.classList.add('overlay-from-left');
}

function hideForm(): void {
    isHidingForm = true;
    overlay?.classList.add('overlay-to-left');
}

function endShowFormAnimation(): void {
    overlay?.classList.remove('overlay-from-left');
}

function endHideFormAnimation(): void {
    overlay?.classList.remove('overlay-to-left');
    overlay?.classList.remove('show');
}