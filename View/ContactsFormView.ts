import { Form } from './Form';
import { IEvents } from '../src/components/base/Events';

interface ContactsData {
    email: string;
    phone: string;
}

export class ContactsFormView extends Form<ContactsData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private events: IEvents;
    private onSubmit?: (data: { email: string; phone: string }) => void;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;
        
        // Поиск элементов только внутри контейнера
        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        this.emailInput.addEventListener('input', () => this.validate());
        this.phoneInput.addEventListener('input', () => this.validate());
        
        const submitButton = this.container.querySelector('.button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isValid()) {
                    this.onSubmit?.({
                        email: this.emailInput.value.trim(),
                        phone: this.phoneInput.value.trim()
                    });
                }
            });
        }
    }

    setOnSubmit(callback: (data: { email: string; phone: string }) => void): void {
        this.onSubmit = callback;
    }

    private validate(): void {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        
        const emailValid = email.length > 0 && email.includes('@');
        const phoneValid = phone.length > 0;
        const isValid = emailValid && phoneValid;
        
        this.setValid(isValid);
        
        const errors: string[] = [];
        if (!emailValid) errors.push('Введите корректный email');
        if (!phoneValid) errors.push('Введите номер телефона');
        this.setErrors(errors);
    }

    reset(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.validate();
    }

    getContainer(): HTMLElement {
        return this.container;
    }

    render(data?: Partial<ContactsData>): HTMLElement {
        return this.container;
    }
}