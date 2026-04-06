import {IProduct} from '../weblarek/src/types/index'


export class ShoppingCart {
    private items: IProduct[] = []
    constructor() {}
    getItems(): IProduct[] {
        return this.items
    }
    addItem(item:IProduct): void{
        this.items.push(item)
    }
    deleteItem(item:IProduct): void {
        const id = item.id;
        this.items = this.items.filter(product => product.id !== id);
    }

    clear() :void {
        this.items = []
    }
    getPrice(): number {
        let totalPrice: number = 0;

        if (this.items.length === 0) {
            return totalPrice;
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item && item.price != null) {
            totalPrice += item.price;
            }
        }
        return totalPrice;
    }
    getCount() : number {
        return this.items.length
    }
    hasItem(id: string): boolean{
        return this.items.some(item => item.id === id);
    }
}