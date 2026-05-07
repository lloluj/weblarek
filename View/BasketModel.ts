import { IProduct } from './ProductModel';
import { IEvents } from '../src/components/base/Events';

export class BasketModel {
    private items: Map<string, IProduct> = new Map();
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    addItem(product: IProduct): boolean {
        if (this.items.has(product.id)) {
            return false;
        }
        this.items.set(product.id, product);
        this.events.emit('model:basket:changed', { items: this.getItems() });
        return true;
    }

    removeItem(id: string): boolean {
        const deleted = this.items.delete(id);
        if (deleted) {
            this.events.emit('model:basket:changed', { items: this.getItems() });
        }
        return deleted;
    }

    getItems(): IProduct[] {
        return Array.from(this.items.values());
    }

    getItemCount(): number {
        return this.items.size;
    }

    getTotalPrice(): number {
        return this.getItems().reduce((sum, item) => sum + item.price, 0);
    }

    clear(): void {
        this.items.clear();
        this.events.emit('model:basket:changed', { items: [] });
    }

    hasItem(id: string): boolean {
        return this.items.has(id);
    }
}