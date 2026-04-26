import { Form } from './Form';
import { ensureElement } from '../src/utils/utils'

interface OrderData {
    payment: string
    address: string
    email: string
    phone: string
}

export class OrderForm extends Form<OrderData> {
    private paymentButtons: Map<string, HTMLButtonElement> = new Map()
    private addressInput: HTMLInputElement;
    
    constructor(container: HTMLElement) {
        super(container);
        
        // Инициализируем кнопки оплаты
        const cardButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement
        const cashButton = this.container.querySelector('button[name="cash"]') as HTMLButtonElement
        
        if (cardButton) {
            this.paymentButtons.set('card', cardButton)
            cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
        }
        
        if (cashButton) {
            this.paymentButtons.set('cash', cashButton)
            cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
        }
        
        // Инициализируем поле адреса
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.addressInput.addEventListener('input', () => this.validate())
    }
    
    private setPaymentMethod(method: string): void {
        this.paymentButtons.forEach((button, key) => {
            if (key === method) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
        
        
        (this.container as any).paymentMethod = method
        this.validate()
    }
    
    private validate(): void {
        const hasPayment = (this.container as any).paymentMethod
        const hasAddress = this.addressInput.value.trim().length > 0;
        const isValid = hasPayment && hasAddress;
        
        this.setValid(isValid);
        
        const errors: string[] = [];
        if (!hasPayment) errors.push('Выберите способ оплаты')
        if (!hasAddress) errors.push('Введите адрес доставки')
        this.setErrors(errors);
    }
    
    getOrderData(): OrderData {
        return {
            payment: (this.container as any).paymentMethod || '',
            address: this.addressInput.value,
            email: '',
            phone: ''
        };
    }
    
    reset(): void {
        if (this.addressInput) this.addressInput.value = ''
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active')
        });
        (this.container as any).paymentMethod = null
        this.setValid(false);
    }
}

// Класс для формы контактов
export class ContactsForm extends Form<OrderData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    
    constructor(container: HTMLElement) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        
        this.emailInput.addEventListener('input', () => this.validate());
        this.phoneInput.addEventListener('input', () => this.validate());
    }
    
    private validate(): void {
        const email = this.emailInput.value.trim()
        const phone = this.phoneInput.value.trim()
        
        const emailValid = email.length > 0 && email.includes('@');
        const phoneValid = phone.length > 0;
        const isValid = emailValid && phoneValid;
        
        this.setValid(isValid);
        
        const errors: string[] = []
        if (!emailValid) errors.push('Введите корректный email')
        if (!phoneValid) errors.push('Введите номер телефона')
        this.setErrors(errors);
    }
    
    getContactsData(): { email: string; phone: string } {
        return {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };
    }
    
    reset(): void {
        if (this.emailInput) this.emailInput.value = ''
        if (this.phoneInput) this.phoneInput.value = ''
        this.setValid(false);
    }
}