import { ProductModel, IProduct } from './ProductModel';
import { BasketModel } from './BasketModel';
import { OrderModel } from './OrderModel';

export class AppState {
    products: ProductModel;
    basket: BasketModel;
    order: OrderModel;

    constructor() {
        this.products = new ProductModel();
        this.basket = new BasketModel();
        this.order = new OrderModel();
    }

    setProducts(products: IProduct[]): void {
        this.products.setProducts(products);
    }

    addToBasket(product: IProduct): boolean {
        return this.basket.addItem(product);
    }

    removeFromBasket(id: string): boolean {
        return this.basket.removeItem(id);
    }

    clearBasket(): void {
        this.basket.clear();
    }
}