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
        successTemplate: HTMLTemplateElement
    ) {
        console.log('🚀 Инициализация AppPresenter...');
        
        this.events = new EventEmitter();
        this.state = new AppState();
        
        // Скрываем корзину при инициализации
        basketElement.style.display = 'none';
        
        this.headerView = new Header(this.events, headerElement);
        this.galleryView = new Gallery(this.events, galleryElement);
        this.modalView = new ModalView(modalElement);
        this.productPreviewView = new ProductPreviewView(this.events);
        this.basketView = new BasketView(this.events, basketElement);
        
        this.initOrderForm(orderTemplate);
        this.initContactsForm(contactsTemplate);
        this.initSuccessView(successTemplate);
        
        this.setupCallbacks();
        this.setupEventListeners();
        this.subscribeToModelChanges();
        
        console.log('✅ AppPresenter инициализирован');
    }
    
    private initOrderForm(template: HTMLTemplateElement): void {
        console.log('📝 Инициализация формы заказа');
        const fragment = document.importNode(template.content, true);
        const orderElement = fragment.firstElementChild as HTMLElement;
        if (orderElement) {
            this.orderFormView = new OrderFormView(this.events, orderElement);
            console.log('✅ Форма заказа инициализирована');
        }
    }
    
    private initContactsForm(template: HTMLTemplateElement): void {
        console.log('📞 Инициализация формы контактов');
        const fragment = document.importNode(template.content, true);
        const contactsElement = fragment.firstElementChild as HTMLElement;
        if (contactsElement) {
            this.contactsFormView = new ContactsFormView(this.events, contactsElement);
            console.log('✅ Форма контактов инициализирована');
        }
    }
    
    private initSuccessView(template: HTMLTemplateElement): void {
        console.log('🎉 Инициализация окна успеха');
        const fragment = document.importNode(template.content, true);
        const successElement = fragment.firstElementChild as HTMLElement;
        if (successElement) {
            this.successView = new SuccessView(this.events, successElement);
            console.log('✅ Окно успеха инициализировано');
        }
    }
    
    private setupCallbacks(): void {
        console.log('🔗 Настройка колбэков');
        
        this.productPreviewView.setOnAddToBasket((product) => {
            console.log('🛒 Колбэк: добавление в корзину', product.title);
            this.events.emit('basket:add', product);
            this.events.emit('modal:close');
        });
        
        this.basketView.setOnRemove((data) => {
            console.log('🗑️ Колбэк: удаление из корзины', data.id);
            this.events.emit('basket:remove', data);
        });
        
        this.basketView.setOnCheckout(() => {
            console.log('📦 Колбэк: оформление заказа');
            this.events.emit('order:start', {});
        });
        
        if (this.orderFormView) {
            this.orderFormView.setOnNext((data) => {
                console.log('➡️ Колбэк: данные формы заказа', data);
                this.events.emit('order:next', data);
            });
        }
        
        if (this.contactsFormView) {
            this.contactsFormView.setOnSubmit((data) => {
                console.log('📧 Колбэк: данные контактов', data);
                this.events.emit('order:submit', data);
            });
        }
    }
    
    private setupEventListeners(): void {
        console.log('🎧 Настройка event listeners');
        
        this.events.on('basket:add', (product: IProduct) => {
            console.log('➕ Добавление в корзину:', product.title);
            this.state.addToBasket(product);
            this.updateBasketUI();
        });
        
        this.events.on('basket:remove', (data: { id: string }) => {
            console.log('🗑️ Удаление из корзины, id:', data.id);
            this.state.removeFromBasket(data.id);
            this.updateBasketUI();
            
            if (this.modalView.isOpen()) {
                this.openBasket();
            }
        });
        
        this.events.on('order:start', () => {
            console.log('📝 Начало оформления заказа');
            this.showOrderForm();
        });
        
        this.events.on('order:next', (data: { payment: string; address: string }) => {
            console.log('➡️ Данные формы заказа:', data);
            this.state.order.setPayment(data.payment as 'card' | 'cash');
            this.state.order.setAddress(data.address);
            this.showContactsForm();
        });
        
        this.events.on('order:submit', (data: { email: string; phone: string }) => {
            console.log('📧 Данные контактов:', data);
            this.state.order.setEmail(data.email);
            this.state.order.setPhone(data.phone);
            this.submitOrder();
        });
        
        this.events.on('modal:close', () => {
            console.log('❌ Закрытие модального окна');
            this.modalView.close();
        });
        
        this.events.on('product:preview', (product: IProduct) => {
            console.log('👁️ Просмотр товара:', product.title);
            const previewElement = this.productPreviewView.render(product);
            this.modalView.open(previewElement);
        });
        
        this.events.on('basket:open', () => {
            console.log('🛒 Открытие корзины по событию');
            this.openBasket();
        });
    }
    
    private subscribeToModelChanges(): void {
        console.log('📡 Подписка на изменения модели');
        
        this.events.on('model:basket:changed', () => {
            console.log('🔄 Модель корзины изменена');
            this.updateBasketUI();
        });
    }
    
    private updateBasketUI(): void {
        const items = this.state.basket.getItems();
        const total = this.state.basket.getTotalPrice();
        const count = this.state.basket.getItemCount();
        
        console.log('🔄 Обновление UI корзины. Товары:', items.length);
        
        this.basketView.render({ items, total });
        this.headerView.updateCounter(count);
    }
    
    private openBasket(): void {
        console.log('🛒 Открытие корзины');
        const items = this.state.basket.getItems();
        const total = this.state.basket.getTotalPrice();
        
        console.log('📦 Товары в корзине перед открытием:', items.length);
        
        // Показываем корзину перед рендером
        const basketContainer = this.basketView.getContainer();
        basketContainer.style.display = 'block';
        
        // Рендерим корзину перед открытием
        this.basketView.render({ items, total });
        this.modalView.open(basketContainer);
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
        const items = this.state.basket.getItems();
        
        // Валидация через модель
        const orderValidation = this.state.order.validateOrder();
        const contactsValidation = this.state.order.validateContacts();
        
        if (!orderValidation.isValid || !contactsValidation.isValid) {
            console.error('❌ Ошибки валидации:', [...orderValidation.errors, ...contactsValidation.errors]);
            return;
        }
        
        console.log('📋 Данные заказа:', {
            ...orderData,
            total: total,
            itemsCount: items.length
        });
        
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
            console.error('❌ SuccessView не инициализирован');
            this.modalView.close();
        }
    }
    
    private sendOrderToServer(orderData: any): void {
        console.log('📤 Отправка заказа на сервер:', orderData);
        
        // Эмуляция отправки на сервер
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
            this.galleryView.render({ catalog: cards });
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
                this.events.emit('product:preview', product);
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