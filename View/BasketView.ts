import { IProduct } from './ProductModel';
import { IEvents } from '../src/components/base/Events';

interface IBasketData {
    items: IProduct[];
    total: number;
}

export class BasketView {
    private container: HTMLElement;
    private listElement: HTMLElement;
    private priceElement: HTMLElement;
    private buttonElement: HTMLElement;
    private events: IEvents;
    private onRemove?: (data: { id: string }) => void;
    private onCheckout?: () => void;

    constructor(events: IEvents, container: HTMLElement) {
        this.events = events;
        this.container = container;
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = container.querySelector('.basket__button') as HTMLElement;
        
        console.log('🛒 BasketView конструктор:', {
            container: !!container,
            listElement: !!this.listElement,
            priceElement: !!this.priceElement,
            buttonElement: !!this.buttonElement
        });
        
        this.buttonElement.addEventListener('click', () => this.onCheckout?.());
    }

    setOnRemove(callback: (data: { id: string }) => void): void {
        this.onRemove = callback;
    }

    setOnCheckout(callback: () => void): void {
        this.onCheckout = callback;
    }

    render(data: IBasketData): void {
        console.log('🛒 BasketView.render вызван:', {
            itemsCount: data.items.length,
            total: data.total,
            items: data.items
        });
        
        if (!this.listElement) {
            console.error('❌ listElement не найден');
            return;
        }
        
        this.listElement.innerHTML = '';
        
        if (data.items.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            this.listElement.appendChild(emptyMessage);
            console.log('🛒 Корзина пуста');
        } else {
            data.items.forEach((product, index) => {
                console.log(`🛒 Создаем элемент ${index + 1}:`, product.title);
                const item = this.createBasketItem(product, index + 1);
                if (item) {
                    this.listElement.appendChild(item);
                }
            });
            console.log(`🛒 Добавлено ${data.items.length} товаров`);
        }
        
        if (this.priceElement) {
            this.priceElement.textContent = `${data.total} синапсов`;
        }
    }

    private createBasketItem(product: IProduct, index: number): HTMLElement | null {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        
        let itemElement: HTMLElement;
        
        if (template) {
            const fragment = document.importNode(template.content, true);
            itemElement = fragment.firstElementChild as HTMLElement;
            console.log('🛒 Используем шаблон card-basket');
        } else {
            console.warn('🛒 Шаблон card-basket не найден, создаем вручную');
            itemElement = document.createElement('li');
            itemElement.className = 'basket__item';
            itemElement.innerHTML = `
                <span class="basket__item-index"></span>
                <span class="card__title"></span>
                <span class="card__price"></span>
                <button class="basket__item-delete">Удалить</button>
            `;
        }
        
        if (!itemElement) return null;
        
        itemElement.setAttribute('data-product-id', product.id);
        
        const indexSpan = itemElement.querySelector('.basket__item-index');
        const titleSpan = itemElement.querySelector('.card__title');
        const priceSpan = itemElement.querySelector('.card__price');
        const deleteBtn = itemElement.querySelector('.basket__item-delete');
        
        if (indexSpan) indexSpan.textContent = String(index);
        if (titleSpan) titleSpan.textContent = product.title;
        if (priceSpan) priceSpan.textContent = `${product.price} синапсов`;
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.onRemove?.({ id: product.id });
            });
        }
        
        return itemElement;
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}