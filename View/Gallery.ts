import { Component } from '../src/components/base/Component';
import { IEvents } from '../src/components/base/Events';

interface IGalleryData {
    cards: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    private catalogElement: HTMLElement;
    private events: IEvents;

    public constructor(events: IEvents, container: HTMLElement) {
        super(container);
        this.events = events;
        this.catalogElement = this.container;
    }
    
    setCatalog(items: HTMLElement[]): void {
        this.catalogElement.replaceChildren(...items);
    }
    
    render(data?: Partial<IGalleryData>): HTMLElement {
        if (data?.cards) {
            this.setCatalog(data.cards);
        }
        return this.container;
    }
}