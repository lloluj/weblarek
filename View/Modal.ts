interface ProductData {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
    description: string;
}

export class Modal {
    private modalElement: HTMLElement;
    private contentContainer: HTMLElement;
    private previewTemplate: HTMLTemplateElement | null;
    private onAddToBasketCallback?: (product: ProductData) => void;

    constructor(modalElement: HTMLElement) {
        this.modalElement = modalElement;
        this.contentContainer = modalElement.querySelector('.modal__content') as HTMLElement;
        this.previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        
        if (!this.contentContainer) {
            console.error('❌ .modal__content не найден в модальном окне');
        }
        
        if (!this.previewTemplate) {
            console.error('❌ Шаблон card-preview не найден');
        }
        
        // Добавляем обработчик закрытия по клику на крестик
        const closeButton = this.modalElement.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close();
            });
        }
        
        // Добавляем обработчик закрытия по клику на фон
        this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.close();
            }
        });
    }

    // Метод для установки callback добавления в корзину
    setAddToBasketCallback(callback: (product: ProductData) => void): void {
        this.onAddToBasketCallback = callback;
    }

    showProductPreview(product: ProductData): void {
        console.log('🎯 Открываем модальное окно для:', product.title);
        
        if (!this.previewTemplate) {
            console.error('❌ Невозможно показать превью: шаблон не найден');
            return;
        }
        
        // Клонируем шаблон preview
        const fragment = document.importNode(this.previewTemplate.content, true);
        const previewElement = fragment.firstElementChild as HTMLElement;
        
        // Заполняем данные из продукта
        const imageElement = previewElement.querySelector('.card__image');
        const categoryElement = previewElement.querySelector('.card__category');
        const titleElement = previewElement.querySelector('.card__title');
        const textElement = previewElement.querySelector('.card__text');
        const priceElement = previewElement.querySelector('.card__price');
        const buttonElement = previewElement.querySelector('.card__button');
        
        if (imageElement) imageElement.setAttribute('src', product.image);
        if (categoryElement) categoryElement.textContent = product.category;
        if (titleElement) titleElement.textContent = product.title;
        if (textElement) textElement.textContent = product.description;
        if (priceElement) priceElement.textContent = `${product.price} синапсов`;
        
        // Добавляем обработчик для кнопки "В корзину"
        if (buttonElement) {
            // Удаляем старые обработчики, чтобы избежать дублирования
            const newButton = buttonElement.cloneNode(true);
            buttonElement.parentNode?.replaceChild(newButton, buttonElement);
            
            newButton.addEventListener('click', (event: Event) => {
                event.stopPropagation();
                console.log('🛒 Добавление в корзину:', product.title);
                if (this.onAddToBasketCallback) {
                    this.onAddToBasketCallback(product);
                }
                // Закрываем модальное окно после добавления
                this.close();
            });
        }
        
        // Показываем контент в модалке
        this.showContent(previewElement);
    }

    // Метод для отображения любого контента в модальном окне
    showContent(content: HTMLElement): void {
        // Очищаем и заполняем контент модального окна
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
        
        // Показываем модальное окно
        this.modalElement.classList.add('modal_active');
        console.log('✅ Модальное окно открыто с контентом');
    }

    close(): void {
        this.modalElement.classList.remove('modal_active');
        // Не очищаем контент сразу
    }

    closeAll(): void {
        document.querySelectorAll('.modal_active').forEach(modal => {
            modal.classList.remove('modal_active');
        });
    }
}