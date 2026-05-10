import { IProduct } from './ProductModel';
import { IEvents } from '../src/components/base/Events';
import { PreviewCard } from './PreviewCard';

export class ProductPreviewView {
    private events: IEvents;
    private template: HTMLTemplateElement;
    private onAddToBasket?: (product: IProduct) => void;

    constructor(events: IEvents, template: HTMLTemplateElement) {
        this.events = events;
        this.template = template;
    }

    setOnAddToBasket(callback: (product: IProduct) => void): void {
        this.onAddToBasket = callback;
    }

    render(product: IProduct): HTMLElement {
        const card = new PreviewCard(this.events, this.template, product);
        
        // Устанавливаем обработчик на кнопку "В корзину"
        card.setOnAddToBasket(() => {
            console.log('🛒 Нажата кнопка "В корзину" для:', product.title);
            if (this.onAddToBasket) {
                this.onAddToBasket(product);
            }
        });
        
        return card.render();
    }
}