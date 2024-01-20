import data from '../assets/data/pricelist.json';

const minAmount: number = 0;
const maxAmount: number = 20;
const workingHoursFrom: string = "09:00";
const workingHoursTo: string = "18:00";

const formLanding: HTMLFormElement | null = document.querySelector('.tickets-section .tickets__form');
const formBooking: HTMLFormElement | null = document.querySelector('.buy-form');
const displayCart: DOMDisplayCart = {
    orderDate: formBooking?.querySelector('.overview-data .ticket-date-txt') as HTMLElement,
    orderTime: formBooking?.querySelector('.overview-data .ticket-time-txt') as HTMLElement,
    category: formBooking?.querySelector('.overview-data .ticket-type-txt') as HTMLElement,
    products: [
        {
            productName: formBooking?.querySelectorAll('.overview-order .category')[0] as HTMLElement,
            price: formBooking?.querySelectorAll('.overview-order .product-price')[0] as HTMLElement,
            amount: formBooking?.querySelectorAll('.overview-order .amount')[0] as HTMLElement,
            priceForProduct: formBooking?.querySelectorAll('.overview-order .category-price')[0] as HTMLElement
        },
        {
            productName: formBooking?.querySelectorAll('.overview-order .category')[1] as HTMLElement,
            price: formBooking?.querySelectorAll('.overview-order .product-price')[1] as HTMLElement,
            amount: formBooking?.querySelectorAll('.overview-order .amount')[1] as HTMLElement,
            priceForProduct: formBooking?.querySelectorAll('.overview-order .category-price')[1] as HTMLElement
        }
    ]


};
const closeBookingFormBtn: HTMLButtonElement | null = document.querySelector('.btn.btn-close');
const overlay: HTMLDivElement | null = document.querySelector('.overlay');

const ticketsTypeContainers: NodeListOf<HTMLFieldSetElement> = document.querySelectorAll('.tickets-type');
const ticketsAmountLanding: HTMLFieldSetElement | null | undefined = formLanding?.querySelector('.tickets-amount');
const ticketsAmountBooking: HTMLFieldSetElement | null | undefined = formBooking?.querySelector('.tickets-amount');
const purchaseSumLabel: HTMLElement | null | undefined = formLanding?.querySelector('.lbl.sum');
const purchaseSumInput: HTMLInputElement | null | undefined = formLanding?.querySelector('.amount-value.sum');

const getProductsPrice = (productsCategoryName: string, productsName: string): number => {    
    return data.pricelist
        .filter((productsCategory) => productsCategory.category.name === productsCategoryName)[0].products
            .filter(product => product.name === productsName)[0].price;
}

const ticketDate: HTMLInputElement | null | undefined = formBooking?.querySelector('.ticket-date');
const ticketTime: HTMLInputElement | null | undefined = formBooking?.querySelector('.ticket-time');

// ------------ Mediator Pattern ------------ //
const mediator = (function() {
    const subscribers: Subscriber = {};

    return {
        subscribe: function(eventName: string, callback: Function): void {
            subscribers[eventName] = subscribers[eventName] || [];         
            subscribers[eventName].push(callback.bind(this));                     
        },

        unsubscribe: function(eventName: string): void {
            subscribers[eventName].pop();
        },

        publish: function(eventName: string, data: number): void {
            if (subscribers[eventName]) {
                
                subscribers[eventName].forEach(function(callback: Function) {
                    return callback(data);
                });
            };
        },

        installTo: function(obj: MediatorForTicketsForm): void {
            obj.subscribe = mediator.subscribe;
            obj.publish = mediator.publish;
            obj.unsubscribe = mediator.unsubscribe;
        }
    }
})();

// ------------ Mediator Pattern End ------------ //

// ------------ Rendering Form Elements ------------ //
function generateProducts(productIndex: number): HTMLLabelElement {
    const product: HTMLLabelElement = document.createElement('label');
    product.classList.add('lbl');
    product.innerHTML = data.pricelist[productIndex].category.label;

    const productData: HTMLInputElement = document.createElement('input');
    productData.id = `category-${data.pricelist[productIndex].category.name}`;
    productData.classList.add('radio-mark');    
    productData.type = "radio";
    productData.name = "category";
    productData.value = data.pricelist[productIndex].category.name;   

    if (sessionStorage.cart === undefined && productIndex === 0) {
        productData.checked = true;
    } else if (sessionStorage.cart !== undefined) {
        const currentCart = JSON.parse(sessionStorage.cart);
        productData.checked = productData.value === currentCart.category
            ? true
            : false;
    }

    product.append(productData);

    return product;
}

function addRadioMarks(product: HTMLLabelElement): HTMLLabelElement {
    const productDecoration: HTMLSpanElement = document.createElement('span');
    productDecoration.classList.add('custom-mark');

    product.append(productDecoration);    

    return product;
}

function generateUsersInput(productIndex: number, index: number, base: HTMLElement): void {    
    const productInputLabel: HTMLLabelElement = document.createElement('label');
    productInputLabel.classList.add('lbl', 'lbl__num');
    productInputLabel.innerHTML = data.pricelist[productIndex].products[index].label;

    const productInputContainer: HTMLDivElement = document.createElement('div');
    productInputContainer.classList.add('order__ticket');

    const productInputElement: HTMLInputElement = document.createElement('input');
    productInputElement.classList.add('amount-value');
    productInputElement.inputMode = 'numeric';
    productInputElement.step = '1';
    productInputElement.type = 'number';
    productInputElement.name = data.pricelist[productIndex].products[index].name;
    productInputElement.id = `${data.pricelist[productIndex].products[index].name}-ticket`;
    productInputElement.min = `${minAmount}`;
    productInputElement.max = `${maxAmount}`;    

    if (sessionStorage.cart === undefined) {
        productInputElement.value = `${minAmount}`;
    } else {
        const currentCart = JSON.parse(sessionStorage.cart);
        
        currentCart.products.map((item: Product) => {
            if (item.productType === productInputElement.name) {
                productInputElement.value = `${item.amount}`
            }
        })
    }

    const productBtnDecrease: HTMLButtonElement = document.createElement('button');
    productBtnDecrease.classList.add('btn__amount', 'minus');
    productBtnDecrease.type = 'button';
    productBtnDecrease.innerHTML = '&minus;';

    const productBtnIncrease: HTMLButtonElement = document.createElement('button');
    productBtnIncrease.classList.add('btn__amount', 'plus');
    productBtnIncrease.type = 'button';
    productBtnIncrease.innerHTML = '&plus;';

    productInputContainer.appendChild(productBtnDecrease);
    productInputContainer.appendChild(productInputElement);
    productInputContainer.appendChild(productBtnIncrease);

    base?.append(productInputLabel);
    base?.append(productInputContainer);
}

data.pricelist.map((item, index: number): void => {
    [...ticketsTypeContainers][1].append(generateProducts(index)); // set inputsRadio for BookingFom
    [...ticketsTypeContainers][0].append(addRadioMarks(generateProducts(index))); // set inputsRadio for LandingForm
    if (index === 0) {
        data.pricelist[index].products.map((item, index) => generateUsersInput(0, index, ticketsAmountBooking!));
        data.pricelist[index].products.map((item, index) => generateUsersInput(0, index, ticketsAmountLanding!));
    }    
});

// * set OpenList for products category functionality in FormBooking
const categoryDataBooking: HTMLDivElement | null | undefined = formBooking?.querySelector('.ticket-type__wrapper .input-data');
const btnCategoryListToggler: HTMLButtonElement | null = document.querySelector('.buy-form .btn.ticket-type');
const categoryListBookingContainer: HTMLFieldSetElement | null = document.querySelector('.buy-form .tickets-options');
const categoryListBooking: NodeListOf<HTMLInputElement> = document.querySelectorAll('.buy-form .tickets-options .radio-mark');
const categoryDataBookingInfo: HTMLDivElement | null | undefined = formBooking?.querySelector('.input-data__wrapper.input-data');
const currentProductCategoryBooking = (): HTMLInputElement | null | undefined => formBooking?.querySelector('input[name="category"]:checked');

categoryDataBooking?.setAttribute('data-content', currentProductCategoryBooking()!.parentElement?.textContent!);

btnCategoryListToggler?.parentElement?.addEventListener('click', (): void => {  
    btnCategoryListToggler?.classList.toggle('close');
    categoryListBookingContainer?.classList.toggle('show');
});

[...categoryListBooking].map(option => option.addEventListener('click', (): void => {
    btnCategoryListToggler?.classList.toggle('close');
    categoryListBookingContainer?.classList.toggle('show');
    categoryDataBookingInfo?.setAttribute('data-content', currentProductCategoryBooking()!.parentElement?.textContent!);    
}))

// ------------ Rendering Form Elements End ------------ //

// ------------ Implement Mediator Behavior ------------ //
class TicketsForm {
    ticketForm: HTMLFormElement | null;
    categoryComponent: HTMLLabelElement[] | undefined;
    categoryInput: HTMLInputElement[] | undefined;
    productInput: HTMLInputElement[] | undefined;
    purchaseSum: HTMLInputElement | null;

    inputControls: HTMLElement[] | undefined;

    productsCart!: ProductsCart;
    products!: Product[];
    product!: Product;

    eventsSet: EventsSet;

    subscribe: Function = Function;
    publish: Function = Function;
    unsubscribe: Function = Function;
    installTo: Function = Function;

    constructor (ticketForm: HTMLFormElement | null) {
        this.ticketForm = ticketForm;
        this.categoryComponent = [...this.ticketForm!.querySelectorAll('.tickets-type .lbl')] as HTMLLabelElement[];
        this.categoryInput = [...this.ticketForm!.querySelectorAll('.tickets-type .radio-mark')] as HTMLInputElement[];

        this.productInput = [...this.ticketForm!.querySelectorAll('.order__ticket .amount-value')] as HTMLInputElement[];

        this.inputControls = [...this.ticketForm!.querySelectorAll('.btn__amount')] as HTMLElement[];

        this.purchaseSum = this.ticketForm!.querySelector('.amount-value.sum');

        this.eventsSet = {
            'change': this.changeInput,
            'clickControl': this.changeInputByControl
        };       
    }

    initForm(): void {
        new FormData(this.ticketForm!);             
    }

    calculateTotalPrice = (): number => {
        let totalSum: number = 0;
        if (this.productsCart.products.length === 0) {
            return 0;
        } else {
            this.productsCart.products
                .forEach(product => totalSum = totalSum + product.amount * product.price);
            return totalSum;
        }                    
    }
    
    setProductInCart(): void {
        this.initForm();
        
        this.ticketForm?.addEventListener('formdata', (e: FormDataEvent): void => {
            const formData = e.formData;

            for (const [key, value] of formData) {                            
                if (key === 'category') {
                    this.productsCart = {
                        category: value.toString(),
                        products: [],
                        sum: 0
                    }
                } else if (this.productsCart != undefined && !key.includes('card')) {
                    this.product = {
                        productType: key,
                        price: getProductsPrice(this.productsCart.category, key),
                        amount: +value.toString()
                    }
                    this.productsCart.products.push(this.product);
                    this.productsCart.sum = this.calculateTotalPrice();
                }
                sessionStorage.cart = JSON.stringify(this.productsCart);
            }

            this.purchaseSum!.value = `${this.productsCart.sum}`;            
            
            this.ticketForm?.addEventListener('changeFormControl', (customEvent: CustomEventInit): void => {                
                this.productsCart.products
                        .map(product => product.amount = product.productType === customEvent.detail.product().productType 
                            ? +customEvent.detail.product().amount 
                            : product.amount
                        );
                this.productsCart.sum = this.calculateTotalPrice();
                
                this.purchaseSum!.value = `${this.productsCart.sum}`;
                sessionStorage.cart = JSON.stringify(this.productsCart);            
            });                     
        });

        this.initForm();
    }

    changeInput(data: ChangeInput) {    
        if (data.inputElement.name === 'category') {
            this.productsCart.category = data.inputElement.value;
               
            this.productsCart.products
                .map((product, index) => {
                    product.price = getProductsPrice(this.productsCart.category, product.productType);
                    (displayCart.products as ProductElements[])[index].price.textContent = getProductsPrice(this.productsCart.category, product.productType).toString();
                    (displayCart.products as ProductElements[])[index].priceForProduct.textContent = `${getProductsPrice(this.productsCart.category, product.productType) * product.amount}`;

                });
            
            // mediator logic   
            (this.categoryComponent![data.checkedCategory!].querySelector('.radio-mark')! as HTMLInputElement).checked = true;
            categoryDataBookingInfo?.setAttribute('data-content', currentProductCategoryBooking()!.parentElement?.textContent!);
            this.ticketForm!.setAttribute('category', this.productsCart.category);

            (displayCart.category as HTMLElement).textContent = currentProductCategoryBooking()!.parentElement?.textContent!;

            this.productsCart.sum = this.calculateTotalPrice();
        } else {
            this.productsCart.products
                .map((product, index) => {
                    if (product.productType === data.inputElement.name) {
                        product.amount = +data.inputElement.value;
                        (displayCart.products as ProductElements[])[index].amount.textContent = data.inputElement.value;
                        (displayCart.products as ProductElements[])[index].priceForProduct.textContent = `${product.price * product.amount}`;
                    }
                });
            this.productsCart.sum = this.calculateTotalPrice();

            // mediator logic
            this.productInput?.map(product => product.name === data.productName ? product.value = data.productAmount.toString() : '');
        }
        this.purchaseSum!.value = `${this.productsCart.sum}`;

        sessionStorage.cart = JSON.stringify(this.productsCart);
    }

    changeInputByControl(data: ChangeInput) {        
        this.productsCart.products
        .map((product, index) => {
            if (product.productType === data.inputElement.name) {
                product.amount = +data.inputElement.value;
                (displayCart.products as ProductElements[])[index].amount.textContent = data.inputElement.value;
                (displayCart.products as ProductElements[])[index].priceForProduct.textContent = `${product.price * product.amount}`;
            }
        });
        this.productsCart.sum = this.calculateTotalPrice();
        
        // mediator logic
        this.productInput?.map(product => product.name === data.productName ? product.value = data.productAmount.toString() : '');
        this.purchaseSum!.value = `${this.productsCart.sum}`;

        sessionStorage.cart = JSON.stringify(this.productsCart);
    }
}

const landingForm: TicketsForm = new TicketsForm(formLanding);
const bookingForm: TicketsForm = new TicketsForm(formBooking);

const formsArray: TicketsForm[] = [landingForm, bookingForm];

mediator.installTo(landingForm);
mediator.installTo(bookingForm);

const initProducts = async () => {
    initProductsWithForLoop(formsArray);
}

const initProductsWithForLoop = async (formsArray: TicketsForm[]) => {
    for (const form of formsArray) {
        form.setProductInCart();
    }
}

document.addEventListener('DOMContentLoaded', initProducts);
// TODO: think about some refactoring the code and async events as well

formsArray.map(form => form.ticketForm?.addEventListener('change', subscribeChangeInput));

function subscribeChangeInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let checkedCategory: number;
    let productName: string;
    let productAmount: number;

    if (inputElement.name === 'category') {        
        checkedCategory = formsArray.filter(form => [...form.categoryInput!].includes(inputElement))[0].categoryInput!.indexOf(inputElement);
    } else {
        productName = inputElement.name;
        productAmount = +inputElement.value;
    }

    formsArray.map(obj => {
        obj.subscribe('change', obj.eventsSet['change']);
        obj.publish('change', {inputElement: inputElement, checkedCategory: checkedCategory, productName: productName, productAmount: productAmount});
        obj.unsubscribe('change', obj.eventsSet['change']);
    });
}

formsArray.map(form => form.ticketForm?.addEventListener('click', subscribeControlClick));

function subscribeControlClick(event: Event) {
    const currentControl: HTMLButtonElement = event.target as HTMLButtonElement;
    const inputElement: HTMLInputElement | undefined | null = currentControl.parentElement?.querySelector('.amount-value');
    let changedProduct: ChangeInput;

    if (currentControl.classList.contains('btn__amount')) {
        changedProduct = changeAmount(currentControl);

        formsArray.map(obj => {
            obj.subscribe('clickControl', obj.eventsSet['clickControl']);
            obj.publish('clickControl', {inputElement: inputElement, productName: changedProduct.productName, productAmount: changedProduct.productAmount});
            obj.unsubscribe('clickControl', obj.eventsSet['clickControl']);
        });
    }  
}

function changeAmount(operator: HTMLButtonElement): ChangeInput {
    const currentAmount: HTMLInputElement | null | undefined = operator.parentElement?.querySelector('.amount-value');
    const customChangeEvent: CustomEvent = new CustomEvent('changeFormControl', {
        bubbles: true,
        detail: {
            product: (): ChangeInput => {
                return {
                    inputElement: currentAmount!,
                    productName: currentAmount!.name,
                    productAmount: +currentAmount!.value
                }
            }
        }        
    });
    
    if (operator.classList.contains('minus')) {
        if (+currentAmount!.value > minAmount) {
            currentAmount!.value = `${+currentAmount!.value - 1}`;
            currentAmount!.dispatchEvent(customChangeEvent);
        } else {
            currentAmount!.value = `${minAmount}`;
        }
    } else {
        if (+currentAmount!.value === maxAmount) {
            currentAmount!.value = `${maxAmount}`;
        } else {
            currentAmount!.value = `${+currentAmount!.value + 1}`;
            currentAmount!.dispatchEvent(customChangeEvent);
        }
    }

    return customChangeEvent.detail.product();              
}
// ------------ Implement Mediator Behavior End ------------ //

// ------------ Other inputs and validation ------------ //
const formatDateToStringInOrderForm = (date: Date | string): string => {
    const currentDate = new Date(date!);
    return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

const formatDateToShortDigits = (): string => {
    const dateToFormat = new Date();
    return `${dateToFormat.getFullYear()}-${dateToFormat.getMonth() + 1}-${dateToFormat.getDate()}`;
}
ticketDate!.min = formatDateToShortDigits();
ticketDate!.addEventListener('change', (event) => {
    if ((event.target as HTMLInputElement).value != '') {
        (event.target as HTMLInputElement).classList.remove('info');
        (displayCart.orderDate as HTMLElement).textContent = formatDateToStringInOrderForm((event.target as HTMLInputElement).value);
    }
})

ticketTime!.min = workingHoursFrom;
ticketTime!.max = workingHoursTo;
ticketTime!.step = "1800";
ticketTime!.addEventListener('change', (event) => {
    if ((event.target as HTMLInputElement).value != '') {
        (event.target as HTMLInputElement).classList.remove('info');
        (displayCart.orderTime as HTMLElement).textContent = (event.target as HTMLInputElement).value;
    }
})
// ------------ Other inputs and validation End ------------ //

// ----------------- Manage BookingForm ----------------- //
const isBookingForm = (): boolean | undefined => {
    return overlay?.classList.contains('show');
};

let isHidingBookingForm: boolean;

formLanding?.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(formLanding);
    for (const entry of data) {
    }

    showForm();
}, false)

overlay?.addEventListener(
    'animationend',
    () =>         
    isHidingBookingForm
      ? endHideFormAnimation()
      : endShowFormAnimation()
)

closeBookingFormBtn?.addEventListener('click', hideForm);

formBooking?.addEventListener('submit', (event: SubmitEvent) => {
    event.preventDefault();

    const data = new FormData(formBooking);
    for (const entry of data) {
        console.log(entry);        
    }
}, false)

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
    isHidingBookingForm = false;
    overlay?.classList.add('show');
    overlay?.classList.add('overlay-from-left');
}

function hideForm(): void {
    isHidingBookingForm = true;
    overlay?.classList.add('overlay-to-left');
}

function endShowFormAnimation(): void {
    overlay?.classList.remove('overlay-from-left');
}

function endHideFormAnimation(): void {
    overlay?.classList.remove('overlay-to-left');
    overlay?.classList.remove('show');
}