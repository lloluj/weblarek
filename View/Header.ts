import { ensureElement } from '../src/utils/utils';
import { Component } from '../src/components/base/Component';
import { IEvents } from '../src/components/base/Events';
import { IProduct } from './ProductModel';

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected events: IEvents;

    public constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
    
    updateCounter(count: number): void {
        if (this.counterElement) {
            this.counterElement.textContent = String(count);
        }
    }
    
    render(data?: Partial<IHeader>): HTMLElement {
        if (data?.counter !== undefined) {
            this.counter = data.counter;
        }
        return this.container;
    }
}