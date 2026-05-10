import { Form } from './Form';
import { IEvents } from '../src/components/base/Events';

interface OrderData {
    payment: string;
    address: string;
}

export class OrderFormView extends Form<OrderData> {
    private paymentButtons: Map<string, HTMLButtonElement> = new Map();
    private addressInput: HTMLInputElement;
    private events: IEvents;
    private onNext?: (data: { payment: string; address: string }) => void;
    private selectedPayment: string | null = null;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;
        
        const cardButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement;
        const cashButton = this.container.querySelector('button[name="cash"]') as HTMLButtonElement;
        this.addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        
        if (cardButton) {
            this.paymentButtons.set('card', cardButton);
            cardButton.addEventListener('click', () => {
                console.log('💳 Выбран способ оплаты: Онлайн');
                this.selectedPayment = 'card';
                this.updateButtonsStyle('card');
                this.events.emit('order:payment', { payment: 'card' });
                this.validateForm();
            });
        }
        
        if (cashButton) {
            this.paymentButtons.set('cash', cashButton);
            cashButton.addEventListener('click', () => {
                console.log('💰 Выбран способ оплаты: При получении');
                this.selectedPayment = 'cash';
                this.updateButtonsStyle('cash');
                this.events.emit('order:payment', { payment: 'cash' });
                this.validateForm();
            });
        }
        
        if (this.addressInput) {
            this.addressInput.addEventListener('input', () => {
                console.log('📝 Введен адрес:', this.addressInput.value);
                this.events.emit('order:address', { address: this.addressInput.value });
                this.validateForm();
            });
        }
        
        const nextButton = this.container.querySelector('.order__button') as HTMLButtonElement;
        if (nextButton) {
            console.log('✅ Кнопка "Далее" найдена');
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Клик по кнопке "Далее"');
                
                if (this.isValid()) {
                    const payment = this.selectedPayment;
                    const address = this.addressInput?.value.trim() || '';
                    
                    if (payment && address) {
                        console.log('✅ Отправляем данные:', { payment, address });
                        this.onNext?.({ payment, address });
                    }
                }
            });
        }
        
        this.validateForm();
    }

    setOnNext(callback: (data: { payment: string; address: string }) => void): void {
        this.onNext = callback;
    }

    private updateButtonsStyle(activeMethod: string): void {
        this.paymentButtons.forEach((button, method) => {
            if (method === activeMethod) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    private validateForm(): void {
        const hasPayment = !!this.selectedPayment;
        const hasAddress = this.addressInput?.value.trim().length > 0;
        const isValid = hasPayment && hasAddress;
        
        console.log('🔍 Валидация формы:', { 
            hasPayment, 
            paymentValue: this.selectedPayment,
            hasAddress, 
            addressValue: this.addressInput?.value,
            isValid 
        });
        
        this.setValid(isValid);
        
        const errors: string[] = [];
        if (!hasPayment) errors.push('Выберите способ оплаты');
        if (!hasAddress) errors.push('Введите адрес доставки');
        this.setErrors(errors);
    }

    reset(): void {
        console.log('🔄 Сброс формы заказа');
        this.selectedPayment = null;
        if (this.addressInput) {
            this.addressInput.value = '';
        }
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this.setValid(false);
        this.validateForm();
    }

    getContainer(): HTMLElement {
        return this.container;
    }

    render(data?: Partial<OrderData>): HTMLElement {
        return this.container;
    }
}