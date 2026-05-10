
import { Component } from '../src/components/base/Component';
import { IEvents } from '../src/components/base/Events';
import { IProduct } from './ProductModel';

interface ICatalogCardData {
    title: string;
    category: string;
    price: number;
    image: string;
}

export class CatalogCard extends Component<ICatalogCardData> {
    private events: IEvents;
    private product: IProduct;

    constructor(events: IEvents, product: IProduct) {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        const fragment = document.importNode(template.content, true);
        const container = fragment.firstElementChild as HTMLElement;
        super(container);
        this.events = events;
        this.product = product;
        this.render(product);
    }
    
    set title(value: string) {
        const titleElement = this.container.querySelector('.card__title');
        if (titleElement) titleElement.textContent = value;
    }
    
    set category(value: string) {
        const categoryElement = this.container.querySelector('.card__category');
        if (categoryElement) {
            categoryElement.textContent = value;
            const categoryClass = this.getCategoryClass(value);
            categoryElement.classList.add(categoryClass);
        }
    }
    
    set price(value: number) {
        const priceElement = this.container.querySelector('.card__price');
        if (priceElement) priceElement.textContent = `${value} синапсов`;
    }
    
    set image(value: string) {
        const imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        if (imageElement) imageElement.setAttribute('src', value);
    }
    
    render(data?: Partial<ICatalogCardData>): HTMLElement {
        if (data) {
            if (data.title) this.title = data.title;
            if (data.category) this.category = data.category;
            if (data.price) this.price = data.price;
            if (data.image) this.image = data.image;
        } else {
            this.title = this.product.title;
            this.category = this.product.category;
            this.price = this.product.price;
            this.image = this.product.image;
        }
        return this.container;
    }
    
    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'хард-скил': 'card__category_hard'
        };
        return categoryMap[category] || 'card__category_other';
    }
}