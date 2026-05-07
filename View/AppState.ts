import { ProductModel, IProduct } from './ProductModel';
import { BasketModel } from './BasketModel';
import { OrderModel } from './OrderModel';
import { IEvents } from '../src/components/base/Events';

export class AppState {
    products: ProductModel;
    basket: BasketModel;
    order: OrderModel;

    constructor(events: IEvents) {
        this.products = new ProductModel();
        this.basket = new BasketModel(events);
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