// interface ProductData {
//     id: string
//     title: string
//     category: string
//     price: number
//     image: string
//     description: string
// }

// export class Basket {
//     private container: HTMLElement
//     private listElement: HTMLElement
//     private priceElement: HTMLElement
//     private buttonElement: HTMLElement
//     private items: Map<string, ProductData> = new Map()
//     private modalInstance: any
//     private onItemsChangeCallback?: (count: number) => void
//     private onCheckoutCallback?: () => void; // Callback для оформления заказа

//     constructor(container: HTMLElement, modalInstance?: any) {
//         this.container = container
//         this.modalInstance = modalInstance

//         const listEl = container.querySelector('.basket__list');
//         if (!listEl) {
//             throw new Error('❌ Элемент .basket__list не найден в корзине');
//         }
//         this.listElement = listEl as HTMLElement

//         const priceEl = container.querySelector('.basket__price');
//         if (!priceEl) {
//             throw new Error('❌ Элемент .basket__price не найден в корзине');
//         }
//         this.priceElement = priceEl as HTMLElement

//         const buttonEl = container.querySelector('.basket__button');
//         if (!buttonEl) {
//             throw new Error('❌ Элемент .basket__button не найден в корзине');
//         }
//         this.buttonElement = buttonEl as HTMLElement

//         this.initializeEventListeners();
//     }

//     // Метод для установки callback при оформлении заказа
//     setOnCheckoutCallback(callback: () => void): void {
//         this.onCheckoutCallback = callback;
//     }

//     setOnItemsChangeCallback(callback: (count: number) => void): void {
//         this.onItemsChangeCallback = callback;
//     }

//     private notifyItemsChange(): void {
//         if (this.onItemsChangeCallback) {
//             this.onItemsChangeCallback(this.items.size);
//         }
//     }

//     private initializeEventListeners(): void {
//         // Обработчик удаления товара из корзины
//         this.listElement.addEventListener('click', (event) => {
//             const deleteButton = (event.target as HTMLElement).closest('.basket__item-delete')
//             if (deleteButton) {
//                 const item = deleteButton.closest('.basket__item')
//                 if (item instanceof HTMLElement) {
//                     const itemId = item.getAttribute('data-product-id')
//                     if (itemId) {
//                         this.items.delete(itemId);
//                         this.removeItem(item);
//                         this.notifyItemsChange();
//                     }
//                 }
//             }
//         });

//         // Обработчик оформления заказа
//         this.buttonElement.addEventListener('click', () => {
//             this.checkout();
//         });
//     }

//     addItem(product: ProductData): void {
//         if (this.items.has(product.id)) {
//             console.log('⚠️ Товар уже в корзине:', product.title);
//             return;
//         }

//         const template = document.getElementById('card-basket') as HTMLTemplateElement
//         if (!template) {
//             console.error('❌ Шаблон card-basket не найден')
//             return;
//         }

//         const fragment = document.importNode(template.content, true);
//         const itemElement = fragment.firstElementChild;

//         if (!itemElement) {
//             console.error('❌ Содержимое шаблона card-basket пустое')
//             return;
//         }

//         const cardElement = itemElement as HTMLElement;
        
//         cardElement.setAttribute('data-product-id', product.id);
        
//         const indexElement = cardElement.querySelector('.basket__item-index')
//         if (indexElement) {
//             indexElement.textContent = String(this.items.size + 1)
//         }

//         const titleElement = cardElement.querySelector('.card__title')
//         const priceElement = cardElement.querySelector('.card__price')

//         if (titleElement) titleElement.textContent = product.title;
//         if (priceElement) priceElement.textContent = `${product.price} синапсов`

//         this.listElement.appendChild(cardElement)
//         this.items.set(product.id, product)
//         this.updateTotalPrice()
//         this.updateIndexes()
//         this.notifyItemsChange()
        
//         console.log('✅ Товар добавлен в корзину. Всего товаров:', this.items.size);
//     }

//     removeItem(item: HTMLElement): void {
//         item.remove()
//         this.updateTotalPrice()
//         this.updateIndexes()
//     }

//     updateTotalPrice(): void {
//         let total = 0
//         const items = this.listElement.querySelectorAll('.basket__item')
//         items.forEach(item => {
//             const priceText = item.querySelector('.card__price')?.textContent || '0 синапсов';
//             const price = parseInt(priceText.replace(' синапсов', ''), 10)
//             total += price;
//         });
//         this.priceElement.textContent = `${total} синапсов`
//     }

//     updateIndexes(): void {
//         const items = this.listElement.querySelectorAll('.basket__item')
//         items.forEach((item, index) => {
//             const indexElement = item.querySelector('.basket__item-index')
//             if (indexElement) {
//                 indexElement.textContent = String(index + 1)
//             }
//         });
//     }

//     getItemCount(): number {
//         return this.items.size
//     }

//     getTotalPrice(): number {
//         let total = 0;
//         this.items.forEach(item => {
//             total += item.price
//         });
//         return total;
//     }

//     checkout(): void {
//         if (this.items.size === 0) {
//             alert('Корзина пуста!')
//             return;
//         }
        
//         // Вызываем callback для открытия формы заказа
//         if (this.onCheckoutCallback) {
//             this.onCheckoutCallback()
//         }
//     }

//     clear(): void {
//         this.listElement.innerHTML = '';
//         this.items.clear()
//         this.updateTotalPrice()
//         this.notifyItemsChange()
//     }

//     getElement(): HTMLElement {
//         return this.container
//     }

//     open(): void {
//         if (this.modalInstance) {
//             this.modalInstance.showContent(this.container);
//         } else {
//             this.container.style.display = 'block'
//         }
//     }

//     close(): void {
//         if (this.modalInstance) {
//             this.modalInstance.close()
//         } else {
//             this.container.style.display = 'none'
//         }
//     }
// }