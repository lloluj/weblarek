import { BaseView } from './BaseView';

export class HeaderView extends BaseView<number> {
    private counterElement: HTMLElement;
    private basketButton: HTMLButtonElement;
    private onBasketOpen?: () => void;

    constructor(container: HTMLElement) {
        super(container);
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
        
        this.basketButton.addEventListener('click', () => this.onBasketOpen?.());
    }

    setOnBasketOpen(callback: () => void): void {
        this.onBasketOpen = callback;
    }

    render(count: number): void {
        this.counterElement.textContent = String(count);
    }
}