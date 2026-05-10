import { ensureElement } from '../src/utils/utils';
import { Component } from '../src/components/base/Component';
import { IEvents } from '../src/components/base/Events';
import { IProduct } from './ProductModel';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected isValidFlag: boolean = false;

    protected constructor(container: HTMLElement) {
        super(container);
        // Ищем кнопку с классом .button (для формы контактов это кнопка "Оплатить")
        this.submitButton = container.querySelector('.button:not(.button_alt)') as HTMLButtonElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
        
        console.log('📝 Form конструктор:', {
            submitButton: this.submitButton,
            errorsElement: this.errorsElement
        });
    }

    setErrors(errors: string[]): void {
        if (this.errorsElement) {
            this.errorsElement.textContent = errors.join(', ');
            console.log('❌ Ошибки формы:', errors.join(', '));
        }
    }

    setValid(isValid: boolean): void {
        this.isValidFlag = isValid;
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
            console.log('🔘 Кнопка формы:', this.submitButton.disabled ? 'заблокирована' : 'активна');
        }
    }
    
    isValid(): boolean {
        return this.isValidFlag;
    }

    abstract render(data?: Partial<T>): HTMLElement;
}