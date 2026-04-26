import {Component} from '../src/components/base/Component'



interface IGalleryData {
    cards: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    render(data?: Partial<IGalleryData>): HTMLElement {
        if (data?.cards) {
            this.container.replaceChildren(...data.cards);
        }
        return this.container;
    }
}