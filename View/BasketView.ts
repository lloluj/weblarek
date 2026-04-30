import { IProduct } from './ProductModel';



interface IBasketData {
    items: IProduct[];
    total: number;
}

export class BasketView {
    private container: HTMLElement;
    private listElement: HTMLElement;
    private priceElement: HTMLElement;
    private buttonElement: HTMLElement;
    private onRemove?: (id: string) => void;
    private onCheckout?: () => void;

    constructor(container: HTMLElement) {
        this.container = container;
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = container.querySelector('.basket__button') as HTMLElement;
        
        console.log('🛒 BasketView инициализирован');
        console.log('🛒 container:', this.container);
        console.log('🛒 listElement:', this.listElement);
        
        this.buttonElement.addEventListener('click', () => this.onCheckout?.());
    }

    setOnRemove(callback: (id: string) => void): void {
        this.onRemove = callback;
    }

    setOnCheckout(callback: () => void): void {
        this.onCheckout = callback;
    }

    render(data: IBasketData): void {
        console.log('🛒 BasketView.render вызван');
        console.log('🛒 Получено товаров:', data.items.length);
        console.log('🛒 Товары:', data.items);
        
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
            console.log('🛒 Показано сообщение о пустой корзине');
        } else {
            data.items.forEach((product, index) => {
                const item = this.createBasketItem(product, index + 1);
                if (item) {
                    this.listElement.appendChild(item);
                    console.log(`✅ Добавлен товар: ${product.title}`);
                }
            });
        }
        
        if (this.priceElement) {
            this.priceElement.textContent = `${data.total} синапсов`;
        }
        
        console.log('🛒 Всего элементов в списке:', this.listElement.children.length);
    }

    private createBasketItem(product: IProduct, index: number): HTMLElement | null {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        
        let itemElement: HTMLElement;
        
        if (template) {
            const fragment = document.importNode(template.content, true);
            itemElement = fragment.firstElementChild as HTMLElement;
        } else {
            // Fallback если шаблон не найден
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
                this.onRemove?.(product.id);
            });
        }
        
        return itemElement;
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}