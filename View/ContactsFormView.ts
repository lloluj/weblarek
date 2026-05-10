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
        
        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        console.log('📞 ContactsFormView конструктор:', {
            emailInput: !!this.emailInput,
            phoneInput: !!this.phoneInput
        });
        
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => {
                console.log('📧 Введен email:', this.emailInput.value);
                this.events.emit('order:email', { email: this.emailInput.value });
                this.validateForm();
            });
        }
        
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', () => {
                console.log('📱 Введен телефон:', this.phoneInput.value);
                this.events.emit('order:phone', { phone: this.phoneInput.value });
                this.validateForm();
            });
        }
        
        // Находим кнопку "Оплатить"
        const submitButton = this.container.querySelector('.button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            console.log('✅ Кнопка "Оплатить" найдена');
            submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Клик по кнопке "Оплатить"');
                
                if (this.isValid()) {
                    const email = this.emailInput?.value.trim() || '';
                    const phone = this.phoneInput?.value.trim() || '';
                    
                    if (email && phone) {
                        console.log('✅ Отправляем данные:', { email, phone });
                        this.onSubmit?.({ email, phone });
                    }
                } else {
                    console.log('❌ Валидация не пройдена');
                }
            });
        } else {
            console.error('❌ Кнопка "Оплатить" не найдена!');
        }
        
        this.validateForm();
    }

    setOnSubmit(callback: (data: { email: string; phone: string }) => void): void {
        this.onSubmit = callback;
    }

    private validateForm(): void {
        const email = this.emailInput?.value.trim() || '';
        const phone = this.phoneInput?.value.trim() || '';
        
        const emailValid = email.length > 0 && email.includes('@');
        const phoneValid = phone.length > 0;
        const isValid = emailValid && phoneValid;
        
        console.log('🔍 Валидация контактов:', { 
            email, 
            emailValid,
            phone, 
            phoneValid,
            isValid 
        });
        
        this.setValid(isValid);
        
        const errors: string[] = [];
        if (!emailValid) errors.push('Введите корректный email');
        if (!phoneValid) errors.push('Введите номер телефона');
        this.setErrors(errors);
    }

    reset(): void {
        console.log('🔄 Сброс формы контактов');
        if (this.emailInput) {
            this.emailInput.value = '';
        }
        if (this.phoneInput) {
            this.phoneInput.value = '';
        }
        this.setValid(false);
        this.validateForm();
    }

    getContainer(): HTMLElement {
        return this.container;
    }

    render(data?: Partial<ContactsData>): HTMLElement {
        return this.container;
    }
}