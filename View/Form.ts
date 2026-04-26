import {ensureElement} from '../src/utils/utils'
import {Component} from '../src/components/base/Component'

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected isValidFlag: boolean = false;

    constructor(container: HTMLElement) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    setErrors(errors: string[]): void {
        this.errorsElement.textContent = errors.join(', ');
    }

    setValid(isValid: boolean): void {
        this.isValidFlag = isValid;
        this.submitButton.disabled = !isValid;
    }
    
    isValid(): boolean {
        return this.isValidFlag;
    }
}