import { IEvents, EventEmitter } from '../src/components/base/Events';
import { AppState } from './AppState';
import { IProduct } from './ProductModel';
import { Header } from './Header';
import { Gallery } from './Gallery';
import { ModalView } from './ModalView';
import { ProductPreviewView } from './ProductPreviewView';
import { BasketView } from './BasketView';
import { OrderFormView } from './OrderFormView';
import { ContactsFormView } from './ContactsFormView';
import { SuccessView } from './SuccessView';

export class AppPresenter {
    private state: AppState;
    private events: IEvents;
    private headerView: Header;
    private galleryView: Gallery;
    private modalView: ModalView;
    private productPreviewView: ProductPreviewView;
    private basketView: BasketView;
    private orderFormView: OrderFormView | null = null;
    private contactsFormView: ContactsFormView | null = null;
    private successView: SuccessView | null = null;

    constructor(
        headerElement: HTMLElement,
        galleryElement: HTMLElement,
        modalElement: HTMLElement,
        basketElement: HTMLElement,
        orderTemplate: HTMLTemplateElement,
        contactsTemplate: HTMLTemplateElement,
        successTemplate: HTMLTemplateElement,
        previewTemplate: HTMLTemplateElement
    ) {
        console.log('🚀 Инициализация AppPresenter...');
        
        this.events = new EventEmitter();
        this.state = new AppState(this.events);
        
        // Скрываем корзину при инициализации
        basketElement.style.display = 'none';
        
        this.headerView = new Header(this.events, headerElement);
        this.galleryView = new Gallery(this.events, galleryElement);
        this.modalView = new ModalView(modalElement);
        this.productPreviewView = new ProductPreviewView(this.events, previewTemplate);
        this.basketView = new BasketView(this.events, basketElement);
        
        this.initOrderForm(orderTemplate);
        this.initContactsForm(contactsTemplate);
        this.initSuccessView(successTemplate);
        
        this.setupCallbacks();
        this.setupEventListeners();
        
        console.log('✅ AppPresenter инициализирован');
    }
    
    private initOrderForm(template: HTMLTemplateElement): void {
        const fragment = document.importNode(template.content, true);
        const orderElement = fragment.firstElementChild as HTMLElement;
        if (orderElement) {
            this.orderFormView = new OrderFormView(this.events, orderElement);
        }
    }
    
    private initContactsForm(template: HTMLTemplateElement): void {
        const fragment = document.importNode(template.content, true);
        const contactsElement = fragment.firstElementChild as HTMLElement;
        if (contactsElement) {
            this.contactsFormView = new ContactsFormView(this.events, contactsElement);
        }
    }
    
    private initSuccessView(template: HTMLTemplateElement): void {
        const fragment = document.importNode(template.content, true);
        const successElement = fragment.firstElementChild as HTMLElement;
        if (successElement) {
            this.successView = new SuccessView(this.events, successElement);
        }
    }
    
    private setupCallbacks(): void {
        // Только эмиты в колбэках
        this.productPreviewView.setOnAddToBasket((product) => {
            this.events.emit('basket:add', product);
            this.events.emit('modal:close');
        });
        
        this.basketView.setOnRemove((data) => {
            this.events.emit('basket:remove', data);
        });
        
        this.basketView.setOnCheckout(() => {
            this.events.emit('order:start', {});
        });
        
        if (this.orderFormView) {
            this.orderFormView.setOnNext((data) => {
                this.events.emit('order:next', data);
            });
        }
        
        if (this.contactsFormView) {
            this.contactsFormView.setOnSubmit((data) => {
                this.events.emit('order:submit', data);
            });
        }
    }
    
    private setupEventListeners(): void {
        this.events.on('basket:add', (product: IProduct) => {
            this.state.addToBasket(product);
        });
        
        this.events.on('basket:remove', (data: { id: string }) => {
            this.state.removeFromBasket(data.id);
            if (this.modalView.isOpen()) {
                this.openBasket();
            }
        });
        
        this.events.on('order:start', () => {
            this.showOrderForm();
        });
        
        this.events.on('order:next', (data: { payment: string; address: string }) => {
            this.state.order.setPayment(data.payment as 'card' | 'cash');
            this.state.order.setAddress(data.address);
            this.showContactsForm();
        });
        
        this.events.on('order:submit', (data: { email: string; phone: string }) => {
            this.state.order.setEmail(data.email);
            this.state.order.setPhone(data.phone);
            this.submitOrder();
        });
        
        this.events.on('modal:close', () => {
            this.modalView.close();
        });
        
        this.events.on('product:preview', (product: IProduct) => {
            const previewElement = this.productPreviewView.render(product);
            this.modalView.open(previewElement);
        });
        
        this.events.on('basket:open', () => {
            this.openBasket();
        });
        
        // Подписка на изменения модели - перерисовка представлений
        this.events.on('model:basket:changed', () => {
            this.updateBasketUI();
        });
    }
    
    private updateBasketUI(): void {
        const items = this.state.basket.getItems();
        const total = this.state.basket.getTotalPrice();
        const count = this.state.basket.getItemCount();
        
        this.basketView.render({ items, total });
        this.headerView.updateCounter(count);
    }
    
    private openBasket(): void {
        const items = this.state.basket.getItems();
        const total = this.state.basket.getTotalPrice();
        
        const basketContainer = this.basketView.getContainer();
        basketContainer.style.display = 'block';
        
        this.basketView.render({ items, total });
        this.modalView.open(basketContainer);
    }
    
    private showOrderForm(): void {
        if (this.orderFormView) {
            this.state.order.reset();
            this.orderFormView.reset();
            this.modalView.open(this.orderFormView.getContainer());
        }
    }
    
    private showContactsForm(): void {
        if (this.contactsFormView) {
            this.contactsFormView.reset();
            this.modalView.open(this.contactsFormView.getContainer());
        }
    }
    
    private submitOrder(): void {
        const orderData = this.state.order.getOrderData();
        const total = this.state.basket.getTotalPrice();
        const items = this.state.basket.getItems();
        
        // Валидация через модель
        const orderValidation = this.state.order.validateOrder();
        const contactsValidation = this.state.order.validateContacts();
        
        if (!orderValidation.isValid || !contactsValidation.isValid) {
            console.error('Ошибки валидации:', [...orderValidation.errors, ...contactsValidation.errors]);
            return;
        }
        
        // Отправка заказа на сервер
        this.sendOrderToServer({
            payment: orderData.payment,
            address: orderData.address,
            email: orderData.email,
            phone: orderData.phone,
            items: items.map(item => item.id),
            total: total
        });
        
        this.state.clearBasket();
        this.updateBasketUI();
        
        if (this.successView) {
            this.successView.render({ total });
            this.modalView.open(this.successView.getContainer());
        } else {
            this.modalView.close();
        }
    }
    
    private sendOrderToServer(orderData: any): void {
        console.log('📤 Отправка заказа на сервер:', orderData);
        
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка отправки заказа');
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Заказ успешно отправлен:', data);
        })
        .catch(error => {
            console.error('❌ Ошибка при отправке заказа:', error);
        });
    }
    
    public createCatalogCards(products: IProduct[]): void {
        this.state.setProducts(products);
        
        const cards: HTMLElement[] = [];
        
        for (const product of products) {
            const card = this.createCardElement(product);
            if (card) {
                cards.push(card);
            }
        }
        
        if (cards.length > 0) {
            this.galleryView.render({ cards });
        }
    }
    
    private createCardElement(product: IProduct): HTMLElement | null {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        if (!template) return null;
        
        const fragment = document.importNode(template.content, true);
        const cardElement = fragment.firstElementChild as HTMLElement;
        
        if (!cardElement) return null;
        
        cardElement.setAttribute('data-product-id', product.id);
        
        const titleElement = cardElement.querySelector('.card__title');
        const imageElement = cardElement.querySelector('.card__image');
        const categoryElement = cardElement.querySelector('.card__category');
        const priceElement = cardElement.querySelector('.card__price');
        
        if (titleElement) titleElement.textContent = product.title;
        if (imageElement) imageElement.setAttribute('src', product.image);
        if (categoryElement) {
            categoryElement.textContent = product.category;
            const categoryClass = this.getCategoryClass(product.category);
            categoryElement.classList.add(categoryClass);
        }
        if (priceElement) priceElement.textContent = `${product.price} синапсов`;
        
        cardElement.addEventListener('click', () => {
            this.events.emit('product:preview', product);
        });
        
        return cardElement;
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