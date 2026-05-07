import { IProduct } from './ProductModel';
import { IEvents } from '../src/components/base/Events';

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
        const fragment = document.importNode(this.template.content, true);
        const previewElement = fragment.firstElementChild as HTMLElement;

        const imageElement = previewElement.querySelector('.card__image');
        const categoryElement = previewElement.querySelector('.card__category');
        const titleElement = previewElement.querySelector('.card__title');
        const textElement = previewElement.querySelector('.card__text');
        const priceElement = previewElement.querySelector('.card__price');
        const buttonElement = previewElement.querySelector('.card__button');

        if (imageElement) imageElement.setAttribute('src', product.image);
        if (categoryElement) categoryElement.textContent = product.category;
        if (titleElement) titleElement.textContent = product.title;
        if (textElement) textElement.textContent = product.description;
        if (priceElement) priceElement.textContent = `${product.price} синапсов`;

        const addButton = buttonElement?.cloneNode(true) as HTMLElement;
        if (buttonElement && addButton) {
            buttonElement.parentNode?.replaceChild(addButton, buttonElement);
            
            addButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onAddToBasket?.(product);
            });
        }

        return previewElement;
    }
}