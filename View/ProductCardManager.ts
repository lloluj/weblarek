// import { Modal } from '../View/Modal';
// import { Basket } from '../View/Basket';
// import { Header } from '../View/Header';
// import { OrderForm, ContactsForm } from './OrderForm';
// import { EventEmitter } from '../src/components/base/Events';

// interface ProductData {
//     id: string;
//     title: string;
//     category: string;
//     price: number;
//     image: string;
//     description: string;
// }

// export class ProductCardManager {
//     private galleryElement: HTMLElement;
//     private modalInstance: Modal;
//     private basketInstance: Basket;
//     private headerInstance: Header;
//     private events: EventEmitter;
//     private orderForm: OrderForm | null = null;
//     private contactsForm: ContactsForm | null = null;

//     constructor(
//         galleryElement: HTMLElement,
//         modal: Modal,
//         basket: Basket,
//         header: Header,
//         events: EventEmitter
//     ) {
//         this.galleryElement = galleryElement;
//         this.modalInstance = modal;
//         this.basketInstance = basket;
//         this.headerInstance = header;
//         this.events = events;
        
//         this.modalInstance.setAddToBasketCallback((product: ProductData) => {
//             this.addToBasket(product);
//         });
        
//         this.basketInstance.setOnItemsChangeCallback((count: number) => {
//             this.updateBasketCounter();
//         });
        
//         this.basketInstance.setOnCheckoutCallback(() => {
//             this.showOrderForm();
//         });
        
//         this.initForms();
//     }
    
//     private initForms(): void {
//         // Форма заказа (адрес и оплата)
//         const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
//         if (orderTemplate) {
//             const orderFragment = document.importNode(orderTemplate.content, true);
//             const orderElement = orderFragment.firstElementChild as HTMLElement;
//             this.orderForm = new OrderForm(orderElement);
            
//             const nextButton = orderElement.querySelector('.order__button');
//             if (nextButton) {
//                 nextButton.addEventListener('click', (e) => {
//                     e.preventDefault();
//                     if (this.orderForm && this.orderForm.isValid()) {
//                         this.showContactsForm();
//                     }
//                 });
//             }
//         }
        
//         // Форма контактов (email и телефон)
//         const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
//         if (contactsTemplate) {
//             const contactsFragment = document.importNode(contactsTemplate.content, true);
//             const contactsElement = contactsFragment.firstElementChild as HTMLElement;
//             this.contactsForm = new ContactsForm(contactsElement);
            
//             const submitButton = contactsElement.querySelector('.button[type="submit"]');
//             if (submitButton) {
//                 submitButton.addEventListener('click', (e) => {
//                     e.preventDefault();
//                     if (this.contactsForm && this.contactsForm.isValid()) {
//                         this.submitOrder();
//                     }
//                 });
//             }
//         }
//     }
    
//     private showOrderForm(): void {
//         if (this.orderForm) {
//             this.orderForm.reset();
//             this.modalInstance.showContent(this.orderForm['container']);
//         }
//     }
    
//     private showContactsForm(): void {
//         if (this.contactsForm && this.orderForm) {
//             const orderData = this.orderForm.getOrderData();
//             console.log('Данные заказа:', orderData);
//             this.contactsForm.reset();
//             this.modalInstance.showContent(this.contactsForm['container']);
//         }
//     }
    
//     private submitOrder(): void {
//         if (this.contactsForm && this.orderForm) {
//             const orderData = this.orderForm.getOrderData();
//             const contactsData = this.contactsForm.getContactsData();
//             const totalPrice = this.basketInstance.getTotalPrice();
            
//             console.log('✅ Заказ оформлен:', {
//                 ...orderData,
//                 ...contactsData,
//                 total: totalPrice,
//                 items: this.basketInstance.getItemCount()
//             });
            
//             // Очищаем корзину
//             this.basketInstance.clear();
//             this.updateBasketCounter();
            
//             // Показываем окно успеха вместо alert
//             this.showSuccessModal(totalPrice);
//         }
//     }
    
//     private showSuccessModal(totalPrice: number): void {
//         // Получаем шаблон успеха
//         const successTemplate = document.getElementById('success') as HTMLTemplateElement;
//         if (!successTemplate) {
//             console.error('❌ Шаблон #success не найден');
//             return;
//         }
        
//         // Клонируем содержимое шаблона
//         const successFragment = document.importNode(successTemplate.content, true);
//         const successElement = successFragment.firstElementChild as HTMLElement;
        
//         // Обновляем сумму списания
//         const descriptionElement = successElement.querySelector('.order-success__description');
//         if (descriptionElement) {
//             descriptionElement.textContent = `Списано ${totalPrice} синапсов`;
//         }
        
//         // Добавляем обработчик на кнопку закрытия
//         const closeButton = successElement.querySelector('.order-success__close');
//         if (closeButton) {
//             closeButton.addEventListener('click', () => {
//                 // Закрываем модальное окно
//                 this.modalInstance.close();
//             });
//         }
        
//         // Показываем success-элемент в модальном окне
//         this.modalInstance.showContent(successElement);
//     }

//     createCatalogCards(products: ProductData[]): void {
//         this.galleryElement.innerHTML = '';
//         products.forEach(product => {
//             const cardElement = this.createCardFromTemplate(product);
//             this.galleryElement.appendChild(cardElement);
//         });
//     }

//     private createCardFromTemplate(product: ProductData): HTMLElement {
//         const template = document.getElementById('card-catalog') as HTMLTemplateElement;
//         if (!template) {
//             throw new Error('Шаблон card-catalog не найден в HTML');
//         }
//         const fragment = document.importNode(template.content, true);
//         const cardElement = fragment.firstElementChild as HTMLElement;
//         cardElement.setAttribute('data-product-id', product.id);

//         const titleElement = cardElement.querySelector('.card__title');
//         const imageElement = cardElement.querySelector('.card__image');
//         const categoryElement = cardElement.querySelector('.card__category');
//         const priceElement = cardElement.querySelector('.card__price');

//         if (titleElement) titleElement.textContent = product.title;
//         if (imageElement) imageElement.setAttribute('src', product.image);
//         if (categoryElement) categoryElement.textContent = product.category;
//         if (priceElement) priceElement.textContent = `${product.price} синапсов`;

//         cardElement.addEventListener('click', () => {
//             this.showProductPreview(product);
//         });
//         return cardElement;
//     }

//     showProductPreview(product: ProductData): void {
//         this.modalInstance.showProductPreview(product);
//     }

//     addToBasket(product: ProductData): void {
//         this.basketInstance.addItem(product);
//     }

//     private updateBasketCounter(): void {
//         const itemsCount = this.basketInstance.getItemCount();
//         this.headerInstance.updateCounter(itemsCount);
//     }

//     openBasket(): void {
//         this.basketInstance.open();
//     }

//     getProductModal(): Modal {
//         return this.modalInstance;
//     }
// }



import { Modal } from '../View/Modal'
import { Basket } from '../View/Basket'
import { Header } from '../View/Header'
import { EventEmitter } from '../src/components/base/Events'
import { OrderForm, ContactsForm } from './OrderForm'

interface ProductData {
    id: string
    title: string
    category: string
    price: number
    image: string
    description: string
}

export class ProductCardManager {
    private galleryElement: HTMLElement
    private modalInstance: Modal
    private basketInstance: Basket
    private headerInstance: Header
    private events: EventEmitter
    private orderForm: OrderForm | null = null
    private contactsForm: ContactsForm | null = null

    constructor(
        galleryElement: HTMLElement,
        modal: Modal,
        basket: Basket,
        header: Header,
        events: EventEmitter
    ) {
        this.galleryElement = galleryElement
        this.modalInstance = modal
        this.basketInstance = basket
        this.headerInstance = header
        this.events = events
        
        this.modalInstance.setAddToBasketCallback((product: ProductData) => {
            this.addToBasket(product)
        })
        
        this.basketInstance.setOnItemsChangeCallback((count: number) => {
            this.updateBasketCounter()
        })
        
        this.basketInstance.setOnCheckoutCallback(() => {
            this.showOrderForm()
        })
        
        this.initForms()
        this.injectCategoryStyles()
    }
    
    private injectCategoryStyles(): void {
        const style = document.createElement('style')
        style.textContent = `
            .card__category_soft {
                background-color: #83FA9D !important;
            }
            .card__category_other {
                background-color: #FAD883 !important;
            }
            .card__category_additional {
                background-color: #B783FA !important;
            }
            .card__category_button {
                background-color:  #83DDFA !important;
            }
            .card__category_hard {
                background-color: #FAA083 !important;
            }
        `
        document.head.appendChild(style)
    }
    
    private initForms(): void {
        const orderTemplate = document.getElementById('order') as HTMLTemplateElement
        if (orderTemplate) {
            const orderFragment = document.importNode(orderTemplate.content, true)
            const orderElement = orderFragment.firstElementChild as HTMLElement
            this.orderForm = new OrderForm(orderElement)
            
            const nextButton = orderElement.querySelector('.order__button')
            if (nextButton) {
                nextButton.addEventListener('click', (e) => {
                    e.preventDefault()
                    if (this.orderForm && this.orderForm.isValid()) {
                        this.showContactsForm()
                    }
                })
            }
        }
        
        const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement
        if (contactsTemplate) {
            const contactsFragment = document.importNode(contactsTemplate.content, true)
            const contactsElement = contactsFragment.firstElementChild as HTMLElement
            this.contactsForm = new ContactsForm(contactsElement)
            
            const submitButton = contactsElement.querySelector('.button[type="submit"]')
            if (submitButton) {
                submitButton.addEventListener('click', (e) => {
                    e.preventDefault()
                    if (this.contactsForm && this.contactsForm.isValid()) {
                        this.submitOrder()
                    }
                })
            }
        }
    }
    
    private showOrderForm(): void {
        if (this.orderForm) {
            this.orderForm.reset()
            this.modalInstance.showContent(this.orderForm['container'])
        }
    }
    
    private showContactsForm(): void {
        if (this.contactsForm && this.orderForm) {
            const orderData = this.orderForm.getOrderData()
            console.log('Данные заказа:', orderData)
            this.contactsForm.reset()
            this.modalInstance.showContent(this.contactsForm['container'])
        }
    }
    
    private submitOrder(): void {
        if (this.contactsForm && this.orderForm) {
            const orderData = this.orderForm.getOrderData()
            const contactsData = this.contactsForm.getContactsData()
            const totalPrice = this.basketInstance.getTotalPrice()
            
            console.log('✅ Заказ оформлен:', {
                ...orderData,
                ...contactsData,
                total: totalPrice,
                items: this.basketInstance.getItemCount()
            })
            
            this.basketInstance.clear()
            this.updateBasketCounter()
            this.showSuccessModal(totalPrice)
        }
    }
    
    private showSuccessModal(totalPrice: number): void {
        const successTemplate = document.getElementById('success') as HTMLTemplateElement
        if (!successTemplate) return
        
        const successFragment = document.importNode(successTemplate.content, true)
        const successElement = successFragment.firstElementChild as HTMLElement
        
        const descriptionElement = successElement.querySelector('.order-success__description')
        if (descriptionElement) {
            descriptionElement.textContent = `Списано ${totalPrice} синапсов`
        }
        
        const closeButton = successElement.querySelector('.order-success__close')
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.modalInstance.close()
            })
        }
        
        this.modalInstance.showContent(successElement)
    }

    createCatalogCards(products: ProductData[]): void {
        this.galleryElement.innerHTML = ''
        products.forEach(product => {
            const cardElement = this.createCardFromTemplate(product)
            this.galleryElement.appendChild(cardElement)
        })
    }

    private createCardFromTemplate(product: ProductData): HTMLElement {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement
        if (!template) {
            throw new Error('Шаблон card-catalog не найден в HTML')
        }

        const fragment = document.importNode(template.content, true)
        const cardElement = fragment.firstElementChild as HTMLElement

        cardElement.setAttribute('data-product-id', product.id)

        const titleElement = cardElement.querySelector('.card__title')
        const imageElement = cardElement.querySelector('.card__image')
        const categoryElement = cardElement.querySelector('.card__category')
        const priceElement = cardElement.querySelector('.card__price')

        if (titleElement) titleElement.textContent = product.title
        if (imageElement) imageElement.setAttribute('src', product.image)
        if (categoryElement) {
            categoryElement.textContent = product.category
            const categoryClass = this.getCategoryClass(product.category)
            categoryElement.classList.add(categoryClass)
        }
        if (priceElement) priceElement.textContent = `${product.price} синапсов`

        cardElement.addEventListener('click', () => {
            this.showProductPreview(product)
        })

        return cardElement
    }
    
    private getCategoryClass(category: string): string {
        const categoryMap: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button',
            'хард-скил': 'card__category_hard'
        }
        return categoryMap[category] || 'card__category_other'
    }

    showProductPreview(product: ProductData): void {
        this.modalInstance.showProductPreview(product)
    }

    addToBasket(product: ProductData): void {
        this.basketInstance.addItem(product)
    }

    private updateBasketCounter(): void {
        const itemsCount = this.basketInstance.getItemCount()
        this.headerInstance.updateCounter(itemsCount)
    }

    openBasket(): void {
        this.basketInstance.open()
    }

    getProductModal(): Modal {
        return this.modalInstance
    }
}

























