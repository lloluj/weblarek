
import { IEvents } from '../src/components/base/Events';

interface ISuccessData {
    total: number;
}

export class SuccessView {
    private container: HTMLElement;
    private closeButton: HTMLButtonElement;
    private descriptionElement: HTMLElement;
    private events: IEvents;

    constructor(events: IEvents, container: HTMLElement) {
        this.events = events;
        this.container = container;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        
        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
    }

    render(data: ISuccessData): void {
        this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}