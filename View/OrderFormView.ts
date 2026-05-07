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

    constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;
        
        // Поиск элементов только внутри контейнера
        const cardButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement;
        const cashButton = this.container.querySelector('button[name="cash"]') as HTMLButtonElement;
        this.addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        
        if (cardButton) {
            this.paymentButtons.set('card', cardButton);
            cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
        }
        if (cashButton) {
            this.paymentButtons.set('cash', cashButton);
            cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
        }
        
        this.addressInput.addEventListener('input', () => this.validate());
        
        const nextButton = this.container.querySelector('.order__button');
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isValid()) {
                    this.onNext?.({
                        payment: this.getSelectedPayment() || '',
                        address: this.addressInput.value.trim()
                    });
                }
            });
        }
    }

    setOnNext(callback: (data: { payment: string; address: string }) => void): void {
        this.onNext = callback;
    }

    private setPaymentMethod(method: string): void {
        this.paymentButtons.forEach((button, key) => {
            if (key === method) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
        this.validate();
    }

    private getSelectedPayment(): string | null {
        for (const [method, button] of this.paymentButtons) {
            if (button.classList.contains('button_alt-active')) {
                return method;
            }
        }
        return null;
    }

    private validate(): void {
        const hasPayment = !!this.getSelectedPayment();
        const hasAddress = this.addressInput.value.trim().length > 0;
        const isValid = hasPayment && hasAddress;
        
        this.setValid(isValid);
        
        const errors: string[] = [];
        if (!hasPayment) errors.push('Выберите способ оплаты');
        if (!hasAddress) errors.push('Введите адрес доставки');
        this.setErrors(errors);
    }

    reset(): void {
        this.addressInput.value = '';
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this.validate();
    }

    getContainer(): HTMLElement {
        return this.container;
    }

    render(data?: Partial<OrderData>): HTMLElement {
        return this.container;
    }
}