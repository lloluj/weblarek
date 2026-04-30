import { IProduct } from './ProductModel';

export class ProductPreviewView {
    private onAddToBasket?: (product: IProduct) => void;

    setOnAddToBasket(callback: (product: IProduct) => void): void {
        console.log('🔗 Установлен callback добавления в корзину');
        this.onAddToBasket = callback;
    }

    render(product: IProduct): HTMLElement {
        console.log('🎨 Рендер превью товара:', product.title);
        
        const template = document.getElementById('card-preview') as HTMLTemplateElement;
        if (!template) {
            console.error('❌ Шаблон card-preview не найден');
            const fallback = document.createElement('div');
            fallback.textContent = product.title;
            return fallback;
        }
        
        const fragment = document.importNode(template.content, true);
        const previewElement = fragment.firstElementChild as HTMLElement;

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

        // Создаем новую кнопку вместо старой, чтобы избежать дублирования обработчиков
        const addButton = buttonElement?.cloneNode(true) as HTMLElement;
        if (buttonElement && addButton) {
            buttonElement.parentNode?.replaceChild(addButton, buttonElement);
            
            addButton.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🛒 Кнопка "В корзину" нажата для товара:', product.title);
                this.onAddToBasket?.(product);
            });
        } else {
            console.warn('⚠️ Кнопка "В корзину" не найдена в шаблоне');
        }

        return previewElement;
    }
}