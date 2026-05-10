
import { Component } from '../src/components/base/Component';
import { IEvents } from '../src/components/base/Events';
import { IProduct } from './ProductModel';

interface IBasketCardData {
    title: string;
    price: number;
    index: number;
}

export class BasketCard extends Component<IBasketCardData> {
    private events: IEvents;
    private productId: string;

    constructor(events: IEvents, product: IProduct, index: number) {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        
        if (!template) {
            console.error('❌ Шаблон card-basket не найден!');
            const div = document.createElement('div');
            super(div);
        } else {
            const fragment = document.importNode(template.content, true);
            const container = fragment.firstElementChild as HTMLElement;
            super(container);
        }
        
        this.events = events;
        this.productId = product.id;
        
        console.log(`🃏 Создание BasketCard: ${product.title}, индекс: ${index}`);
        
        this.render({ title: product.title, price: product.price, index });
        this.initListeners();
    }
    
    set title(value: string) {
        const element = this.container.querySelector('.card__title');
        if (element) element.textContent = value;
    }
    
    set price(value: number) {
        const element = this.container.querySelector('.card__price');
        if (element) element.textContent = `${value} синапсов`;
    }
    
    set index(value: number) {
        const element = this.container.querySelector('.basket__item-index');
        if (element) element.textContent = String(value);
    }
    
    private initListeners(): void {
        const deleteBtn = this.container.querySelector('.basket__item-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🗑️ Удаление товара:', this.productId);
                this.events.emit('basket:remove', { id: this.productId });
            });
        }
    }
    
    render(data?: Partial<IBasketCardData>): HTMLElement {
        if (data) {
            if (data.title) this.title = data.title;
            if (data.price) this.price = data.price;
            if (data.index) this.index = data.index;
        }
        return this.container;
    }
}