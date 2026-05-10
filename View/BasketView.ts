
import { IEvents } from '../src/components/base/Events';
import { IProduct } from './ProductModel';
import { BasketCard } from './BasketCard';

interface IBasketData {
    items: IProduct[];
    total: number;
}

export class BasketView {
    private container: HTMLElement;
    private listElement: HTMLElement;
    private priceElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private events: IEvents;
    private onCheckoutCallback?: () => void;

    constructor(events: IEvents, container: HTMLElement) {
        this.events = events;
        this.container = container;
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = container.querySelector('.basket__button') as HTMLButtonElement;
        
        console.log('🛒 BasketView конструктор:', {
            container: !!container,
            listElement: !!this.listElement,
            priceElement: !!this.priceElement,
            buttonElement: !!this.buttonElement
        });
        
        // Инициализируем обработчик кнопки
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {
                console.log('🖱️ Клик по кнопке "Оформить"');
                if (this.onCheckoutCallback) {
                    this.onCheckoutCallback();
                } else {
                    this.events.emit('order:start', {});
                }
            });
        }
    }

    setOnCheckout(callback: () => void): void {
        console.log('🔧 setOnCheckout вызван');
        this.onCheckoutCallback = callback;
    }

    render(data: IBasketData): void {
        console.log('🛒 BasketView.render, товаров:', data.items.length);
        
        if (!this.listElement) {
            console.error('❌ listElement не найден!');
            return;
        }
        
        this.listElement.innerHTML = '';
        
        if (data.items.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            this.listElement.appendChild(emptyMessage);
            
            if (this.buttonElement) {
                this.buttonElement.disabled = true;
            }
        } else {
            // Используем представление BasketCard для каждой карточки
            data.items.forEach((product, index) => {
                console.log(`🛒 Создаем карточку для: ${product.title}`);
                const card = new BasketCard(this.events, product, index + 1);
                this.listElement.appendChild(card.render());
            });
            
            if (this.buttonElement) {
                this.buttonElement.disabled = false;
            }
        }
        
        if (this.priceElement) {
            this.priceElement.textContent = `${data.total} синапсов`;
        }
        
        console.log('📦 После рендера, детей в списке:', this.listElement.children.length);
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}