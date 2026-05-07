import { IProduct } from './ProductModel';

export class BasketModel {
    private items: Map<string, IProduct> = new Map();

    addItem(product: IProduct): boolean {
        console.log('📦 BasketModel.addItem:', product.title, product.id);
        if (this.items.has(product.id)) {
            console.log('⚠️ Товар уже в корзине');
            return false;
        }
        this.items.set(product.id, product);
        console.log('✅ Товар добавлен. Всего товаров:', this.items.size);
        console.log('📋 Текущие товары:', Array.from(this.items.values()).map(p => p.title));
        return true;
    }

    removeItem(id: string): boolean {
        console.log('🗑️ BasketModel.removeItem, id:', id);
        const deleted = this.items.delete(id);
        console.log('🗑️ Результат удаления:', deleted);
        return deleted;
    }

    getItems(): IProduct[] {
        const items = Array.from(this.items.values());
        console.log('📋 BasketModel.getItems, количество:', items.length);
        return items;
    }

    getItemCount(): number {
        return this.items.size;
    }

    getTotalPrice(): number {
        const total = this.getItems().reduce((sum, item) => sum + item.price, 0);
        console.log('💰 Общая сумма:', total);
        return total;
    }

    clear(): void {
        console.log('🧹 Очистка корзины');
        this.items.clear();
    }

    hasItem(id: string): boolean {
        return this.items.has(id);
    }
}