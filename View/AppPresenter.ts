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
    // Views
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
        successTemplate: HTMLTemplateElement
    ) {
        console.log('🚀 Инициализация AppPresenter...');
        
        this.events = new EventEmitter();
        this.state = new AppState();
        
        // Инициализация Views
        this.headerView = new Header(this.events, headerElement);
        this.galleryView = new Gallery(galleryElement);
        this.modalView = new ModalView(modalElement);
        this.productPreviewView = new ProductPreviewView();
        this.basketView = new BasketView(basketElement);
        
        console.log('✅ Views инициализированы');
        
        this.initOrderForm(orderTemplate);
        this.initContactsForm(contactsTemplate);
        this.initSuccessView(successTemplate);
        
        this.setupCallbacks();
        this.setupEventListeners();
        
        console.log('✅ AppPresenter инициализирован');
    }
    
    private initOrderForm(template: HTMLTemplateElement): void {
        console.log('📝 Инициализация формы заказа');
        const fragment = document.importNode(template.content, true);
        const orderElement = fragment.firstElementChild as HTMLElement;
        if (orderElement) {
            this.orderFormView = new OrderFormView(orderElement);
            console.log('✅ Форма заказа инициализирована');
        }
    }
    
    private initContactsForm(template: HTMLTemplateElement): void {
        console.log('📞 Инициализация формы контактов');
        const fragment = document.importNode(template.content, true);
        const contactsElement = fragment.firstElementChild as HTMLElement;
        if (contactsElement) {
            this.contactsFormView = new ContactsFormView(contactsElement);
            console.log('✅ Форма контактов инициализирована');
        }
    }
    
    private initSuccessView(template: HTMLTemplateElement): void {
        console.log('🎉 Инициализация окна успеха');
        const fragment = document.importNode(template.content, true);
        const successElement = fragment.firstElementChild as HTMLElement;
        if (successElement) {
            this.successView = new SuccessView(successElement);
            console.log('✅ Окно успеха инициализировано');
        }
    }
    
    private setupCallbacks(): void {
        console.log('🔗 Настройка колбэков');
        
        this.productPreviewView.setOnAddToBasket((product) => {
            console.log('🛒 Колбэк: добавление в корзину', product.title);
            this.addToBasket(product);
            this.modalView.close();
        });
        
        this.basketView.setOnRemove((id) => {
            console.log('🗑️ Колбэк: удаление из корзины', id);
            this.removeFromBasket(id);
        });
        
        this.basketView.setOnCheckout(() => {
            console.log('📦 Колбэк: оформление заказа');
            this.showOrderForm();
        });
        
        if (this.orderFormView) {
            this.orderFormView.setOnNext((data) => {
                console.log('➡️ Колбэк: данные формы заказа', data);
                this.state.order.setPayment(data.payment as 'card' | 'cash');
                this.state.order.setAddress(data.address);
                this.showContactsForm();
            });
        }
        
        if (this.contactsFormView) {
            this.contactsFormView.setOnSubmit((data) => {
                console.log('📧 Колбэк: данные контактов', data);
                this.state.order.setEmail(data.email);
                this.state.order.setPhone(data.phone);
                this.submitOrder();
            });
        }
        
        if (this.successView) {
            this.successView.setOnClose(() => {
                console.log('❌ Колбэк: закрытие окна успеха');
                this.modalView.close();
            });
        }
    }
    
    private setupEventListeners(): void {
        console.log('🎧 Настройка event listeners');
        this.events.on('basket:open', () => {
            console.log('🛒 Событие: открытие корзины');
            this.openBasket();
        });
    }
    
    private addToBasket(product: IProduct): void {
        console.log('➕ Добавление в корзину:', product.title);
        const result = this.state.addToBasket(product);
        if (result) {
            console.log('✅ Товар добавлен в корзину');
            this.updateBasketUI();
        } else {
            console.log('⚠️ Товар уже в корзине');
        }
    }
    
    private removeFromBasket(id: string): void {
        console.log('🗑️ Удаление из корзины, id:', id);
        this.state.removeFromBasket(id);
        this.updateBasketUI();
        
        if (this.modalView.isOpen()) {
            this.openBasket();
        }
    }
    
    private updateBasketUI(): void {
        const items = this.state.basket.getItems();
        const total = this.state.basket.getTotalPrice();
        const count = this.state.basket.getItemCount();
        
        console.log('🔄 Обновление UI корзины. Товары:', items.length);
        console.log('🔄 Список товаров:', items.map(i => i.title));
        
        // Рендерим корзину
        this.basketView.render({ items, total });
        this.headerView.updateCounter(count);
    }
    
    private openBasket(): void {
        console.log('🛒 Открытие корзины');
        const items = this.state.basket.getItems();
        const total = this.state.basket.getTotalPrice();
        
        console.log('📦 Товары в корзине перед открытием:', items.length);
        
        // Рендерим корзину перед открытием
        this.basketView.render({ items, total });
        this.modalView.open(this.basketView.getContainer());
    }
    
    private showOrderForm(): void {
        console.log('📝 Открытие формы заказа');
        if (this.orderFormView) {
            this.state.order.reset();
            this.orderFormView.reset();
            this.modalView.open(this.orderFormView.getContainer());
        } else {
            console.error('❌ OrderFormView не инициализирован');
        }
    }
    
    private showContactsForm(): void {
        console.log('📞 Открытие формы контактов');
        if (this.contactsFormView) {
            this.contactsFormView.reset();
            this.modalView.open(this.contactsFormView.getContainer());
        } else {
            console.error('❌ ContactsFormView не инициализирован');
        }
    }
    
    private submitOrder(): void {
        console.log('✅ Оформление заказа');
        
        const orderData = this.state.order.getOrderData();
        const total = this.state.basket.getTotalPrice();
        const itemsCount = this.state.basket.getItemCount();
        
        console.log('📋 Данные заказа:', {
            ...orderData,
            total: total,
            itemsCount: itemsCount
        });
        
        this.state.clearBasket();
        this.updateBasketUI();
        
        if (this.successView) {
            this.successView.render({ total });
            this.modalView.open(this.successView.getContainer());
        } else {
            console.error('❌ SuccessView не инициализирован');
            this.modalView.close();
        }
    }
    
    public createCatalogCards(products: IProduct[]): void {
        console.log('📦 Создание карточек каталога, количество:', products.length);
        
        this.state.setProducts(products);
        
        const cards: HTMLElement[] = [];
        
        for (const product of products) {
            const card = this.createCardElement(product);
            if (card) {
                cards.push(card);
            }
        }
        
        console.log('✅ Создано карточек:', cards.length);
        
        if (cards.length > 0) {
            this.galleryView.render({ cards });
            console.log('✅ Галерея отрендерена');
        } else {
            console.error('❌ Нет карточек для отображения');
        }
    }
    
    private createCardElement(product: IProduct): HTMLElement | null {
        try {
            const template = document.getElementById('card-catalog') as HTMLTemplateElement;
            if (!template) {
                console.error('❌ Шаблон card-catalog не найден');
                return null;
            }
            
            const fragment = document.importNode(template.content, true);
            const cardElement = fragment.firstElementChild as HTMLElement;
            
            if (!cardElement) {
                console.error('❌ Не удалось создать элемент карточки');
                return null;
            }
            
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
                console.log('🖱️ Клик по карточке:', product.title);
                const previewElement = this.productPreviewView.render(product);
                this.modalView.open(previewElement);
            });
            
            return cardElement;
        } catch (error) {
            console.error('❌ Ошибка при создании карточки:', error);
            return null;
        }
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


