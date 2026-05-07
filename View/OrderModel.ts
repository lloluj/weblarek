export interface IOrderData {
    payment: 'card' | 'cash' | null;
    address: string;
    email: string;
    phone: string;
}

export interface IOrderValidation {
    isValid: boolean;
    errors: string[];
}

export class OrderModel {
    private data: IOrderData = {
        payment: null,
        address: '',
        email: '',
        phone: ''
    };

    setPayment(payment: 'card' | 'cash'): void {
        this.data.payment = payment;
    }

    setAddress(address: string): void {
        this.data.address = address;
    }

    setEmail(email: string): void {
        this.data.email = email;
    }

    setPhone(phone: string): void {
        this.data.phone = phone;
    }

    getOrderData(): IOrderData {
        return { ...this.data };
    }

    validateOrder(): IOrderValidation {
        const errors: string[] = [];
        if (!this.data.payment) errors.push('Выберите способ оплаты');
        if (!this.data.address.trim()) errors.push('Введите адрес доставки');
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateContacts(): IOrderValidation {
        const errors: string[] = [];
        if (!this.data.email.trim() || !this.data.email.includes('@')) {
            errors.push('Введите корректный email');
        }
        if (!this.data.phone.trim()) errors.push('Введите номер телефона');
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    reset(): void {
        this.data = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
    }
}