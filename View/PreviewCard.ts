import { Component } from '../src/components/base/Component';
import { IEvents } from '../src/components/base/Events';
import { IProduct } from './ProductModel';

interface IPreviewCardData {
    title: string;
    category: string;
    price: number;
    image: string;
    description: string;
}

export class PreviewCard extends Component<IPreviewCardData> {
    private events: IEvents;
    private product: IProduct;
    private onAddToBasket?: () => void;

    constructor(events: IEvents, template: HTMLTemplateElement, product: IProduct) {
        const fragment = document.importNode(template.content, true);
        const container = fragment.firstElementChild as HTMLElement;
        super(container);
        this.events = events;
        this.product = product;
        this.render(product);
        this.initListeners();
    }
    
    set title(value: string) {
        const element = this.container.querySelector('.card__title');
        if (element) element.textContent = value;
    }
    
    set category(value: string) {
        const element = this.container.querySelector('.card__category');
        if (element) element.textContent = value;
    }
    
    set price(value: number) {
        const element = this.container.querySelector('.card__price');
        if (element) element.textContent = `${value} синапсов`;
    }
    
    set image(value: string) {
        const element = this.container.querySelector('.card__image') as HTMLImageElement;
        if (element) element.setAttribute('src', value);
    }
    
    set description(value: string) {
        const element = this.container.querySelector('.card__text');
        if (element) element.textContent = value;
    }
    
    setOnAddToBasket(callback: () => void): void {
        this.onAddToBasket = callback;
    }
    
    private initListeners(): void {
        const buttonElement = this.container.querySelector('.card__button');
        if (buttonElement) {
            // Клонируем кнопку, чтобы избежать дублирования обработчиков
            const newButton = buttonElement.cloneNode(true) as HTMLElement;
            buttonElement.parentNode?.replaceChild(newButton, buttonElement);
            
            newButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🖱️ Клик по кнопке "В корзину" в PreviewCard');
                if (this.onAddToBasket) {
                    this.onAddToBasket();
                }
            });
        } else {
            console.warn('⚠️ Кнопка .card__button не найдена в PreviewCard');
        }
    }
    
    render(data?: Partial<IPreviewCardData>): HTMLElement {
        if (data) {
            if (data.title) this.title = data.title;
            if (data.category) this.category = data.category;
            if (data.price) this.price = data.price;
            if (data.image) this.image = data.image;
            if (data.description) this.description = data.description;
        } else {
            this.title = this.product.title;
            this.category = this.product.category;
            this.price = this.product.price;
            this.image = this.product.image;
            this.description = this.product.description;
        }
        return this.container;
    }
}