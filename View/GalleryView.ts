import { BaseView } from './BaseView';
import { IProduct } from './ProductModel';

export class GalleryView extends BaseView<IProduct[]> {
    private onCardClick?: (product: IProduct) => void;
    private categoryStyles: Map<string, string> = new Map();

    constructor(container: HTMLElement) {
        super(container);
        this.initCategoryStyles();
    }

    private initCategoryStyles(): void {
        const style = document.createElement('style');
        style.textContent = `
            .card__category_soft { background-color: #83FA9D !important; }
            .card__category_other { background-color: #FAD883 !important; }
            .card__category_additional { background-color: #B783FA !important; }
            .card__category_button { background-color: #83DDFA !important; }
            .card__category_hard { background-color: #FAA083 !important; }
        `;
        document.head.appendChild(style);

        this.categoryStyles.set('софт-скил', 'card__category_soft');
        this.categoryStyles.set('другое', 'card__category_other');
        this.categoryStyles.set('дополнительное', 'card__category_additional');
        this.categoryStyles.set('кнопка', 'card__category_button');
        this.categoryStyles.set('хард-скил', 'card__category_hard');
    }

    setOnCardClick(callback: (product: IProduct) => void): void {
        this.onCardClick = callback;
    }

    render(products: IProduct[]): void {
        this.container.innerHTML = '';
        
        products.forEach(product => {
            const card = this.createCard(product);
            this.container.appendChild(card);
        });
    }

    private createCard(product: IProduct): HTMLElement {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        const fragment = document.importNode(template.content, true);
        const cardElement = fragment.firstElementChild as HTMLElement;

        cardElement.setAttribute('data-product-id', product.id);

        const titleElement = cardElement.querySelector('.card__title');
        const imageElement = cardElement.querySelector('.card__image');
        const categoryElement = cardElement.querySelector('.card__category');
        const priceElement = cardElement.querySelector('.card__price');

        if (titleElement) titleElement.textContent = product.title;
        if (imageElement) imageElement.setAttribute('src', product.image);
        if (categoryElement) {
            categoryElement.textContent = product.category;
            const categoryClass = this.categoryStyles.get(product.category) || 'card__category_other';
            categoryElement.classList.add(categoryClass);
        }
        if (priceElement) priceElement.textContent = `${product.price} синапсов`;

        cardElement.addEventListener('click', () => {
            this.onCardClick?.(product);
        });

        return cardElement;
    }
}