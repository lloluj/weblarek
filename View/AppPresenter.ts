import { IEvents, EventEmitter } from '../src/components/base/Events';
import { IProduct,ProductModel } from './ProductModel';
import { Header } from './Header';
import { Gallery } from './Gallery';
import { ModalView } from './ModalView';
import { ProductPreviewView } from './ProductPreviewView';
import { BasketView } from './BasketView';
import { OrderFormView } from './OrderFormView';
import { ContactsFormView } from './ContactsFormView';
import { SuccessView } from './SuccessView';
import ApiService from '../Api';
import { IOrderRequest } from '../src/types/index';
import { Api } from '../src/components/base/Api'; 
import { BasketModel } from './BasketModel';
import { OrderModel } from './OrderModel';


export class AppPresenter {
    private events: IEvents;
    private productsModel: ProductModel;
    private basketModel: BasketModel;
    private orderModel: OrderModel;
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
        
        // Инициализация моделей
        this.productsModel = new ProductModel();
        this.basketModel = new BasketModel(this.events);
        this.orderModel = new OrderModel(this.events);
        
        // Скрываем корзину при инициализации
        if (basketElement) {
            basketElement.style.display = 'none';
            if (!document.body.contains(basketElement)) {
                document.body.appendChild(basketElement);
            }
        }
        
        // Инициализация представлений
        this.headerView = new Header(this.events, headerElement);
        this.galleryView = new Gallery(this.events, galleryElement);
        this.modalView = new ModalView(modalElement);
        this.productPreviewView = new ProductPreviewView(this.events, previewTemplate);
        this.basketView = new BasketView(this.events, basketElement);
        
        // Инициализация форм
        this.initOrderForm(orderTemplate);
        this.initContactsForm(contactsTemplate);
        this.initSuccessView(successTemplate);
        
        // Настройка колбэков
        this.setupCallbacks();
        
        // Настройка обработчиков событий
        this.setupEventListeners();
        
        // Подписка на изменения модели для перерисовки
        this.subscribeToModelChanges();
        
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
        // Устанавливаем колбэк для добавления в корзину из превью
        this.productPreviewView.setOnAddToBasket((product) => {
            console.log('🛒 Колбэк: добавление в корзину', product.title);
            this.events.emit('basket:add', product);
            this.events.emit('modal:close');
        });
        
        // Устанавливаем колбэк для оформления заказа
        this.basketView.setOnCheckout(() => {
            console.log('📦 Колбэк: оформление заказа');
            this.events.emit('order:start', {});
        });
        
        // Устанавливаем колбэки для форм
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
        this.events.on('basket:add', (product: IProduct) => {
            console.log('➕ Событие basket:add', product.title);
            this.basketModel.addItem(product);
        });
        
        this.events.on('basket:remove', (data: { id: string }) => {
            console.log('🗑️ Событие basket:remove', data.id);
            this.basketModel.removeItem(data.id);
        });
        
        this.events.on('basket:open', () => {
            console.log('🛒 Событие basket:open');
            this.openBasket();
        });
        
        this.events.on('order:start', () => {
            console.log('📝 Событие order:start');
            this.showOrderForm();
        });
        
        this.events.on('order:next', (data: { payment: string; address: string }) => {
            console.log('➡️ Событие order:next', data);
            this.orderModel.setPayment(data.payment as 'card' | 'cash');
            this.orderModel.setAddress(data.address);
            this.showContactsForm();
        });
        
        this.events.on('order:submit', (data: { email: string; phone: string }) => {
            console.log('📧 Событие order:submit', data);
            this.orderModel.setEmail(data.email);
            this.orderModel.setPhone(data.phone);
            this.submitOrder();
        });
        
        this.events.on('modal:close', () => {
            console.log('❌ Событие modal:close');
            this.modalView.close();
        });
        
        this.events.on('product:preview', (product: IProduct) => {
            console.log('👁️ Событие product:preview', product.title);
            const previewElement = this.productPreviewView.render(product);
            this.modalView.open(previewElement);
        });
    }
    
    private subscribeToModelChanges(): void {
        this.events.on('model:basket:changed', () => {
            console.log('🔄 model:basket:changed - обновляем UI');
            this.updateBasketUI();
        });
        
        this.events.on('model:order:changed', () => {
            console.log('🔄 model:order:changed - обновляем формы');
            this.validateAndUpdateForms();
        });
    }
    
    private validateAndUpdateForms(): void {
        const orderValidation = this.orderModel.validateOrder();
        const contactsValidation = this.orderModel.validateContacts();
        
        if (this.orderFormView) {
            this.orderFormView.setErrors(orderValidation.errors);
            this.orderFormView.setValid(orderValidation.isValid);
        }
        
        if (this.contactsFormView) {
            this.contactsFormView.setErrors(contactsValidation.errors);
            this.contactsFormView.setValid(contactsValidation.isValid);
        }
    }
    
    private updateBasketUI(): void {
        const items = this.basketModel.getItems();
        const total = this.basketModel.getTotalPrice();
        const count = this.basketModel.getItemCount();
        
        console.log('🔄 Обновление UI корзины, товаров:', items.length);
        console.log('📋 Товары:', items.map(i => i.title));
        
        this.basketView.render({ items, total });
        this.headerView.updateCounter(count);
    }
    
    private openBasket(): void {
        console.log('🛒 Открытие корзины');
        const basketContainer = this.basketView.getContainer();
        this.modalView.open(basketContainer);
    }
    
    private showOrderForm(): void {
        console.log('📝 Открытие формы заказа');
        if (this.orderFormView) {
            this.orderModel.reset();
            this.orderFormView.reset();
            this.modalView.open(this.orderFormView.getContainer());
        }
    }
    
    private showContactsForm(): void {
        console.log('📞 Открытие формы контактов');
        if (this.contactsFormView) {
            this.contactsFormView.reset();
            this.modalView.open(this.contactsFormView.getContainer());
        }
    }
    
    private submitOrder(): void {
        console.log('✅ Оформление заказа');
        
        const orderData = this.orderModel.getOrderData();
        const total = this.basketModel.getTotalPrice();
        const items = this.basketModel.getItems();
        
        const orderValidation = this.orderModel.validateOrder();
        const contactsValidation = this.orderModel.validateContacts();
        
        if (!orderValidation.isValid || !contactsValidation.isValid) {
            console.error('❌ Ошибки валидации');
            return;
        }
        
        const orderPayload = {
            payment: orderData.payment,
            address: orderData.address,
            email: orderData.email,
            phone: orderData.phone,
            items: items.map(item => item.id),
            total: total
        };
        
        console.log('📤 Отправка заказа:', orderPayload);
        
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        })
        .then(response => response.json())
        .then(result => {
            console.log('✅ Заказ отправлен:', result);
            this.basketModel.clear();
            this.updateBasketUI();
            
            if (this.successView) {
                this.successView.render({ total });
                this.modalView.open(this.successView.getContainer());
            } else {
                this.modalView.close();
            }
        })
        .catch(error => console.error('❌ Ошибка:', error));
    }
    
    public createCatalogCards(products: IProduct[]): void {
        console.log('📦 Создание карточек каталога, товаров:', products.length);
        this.productsModel.setProducts(products);
        
        const cards: HTMLElement[] = [];
        
        for (const product of products) {
            const card = this.galleryView.createCard(product);
            if (card) {
                cards.push(card);
            }
        }
        
        if (cards.length > 0) {
            this.galleryView.render({ cards });
        }
    }
}