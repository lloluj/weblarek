


class ShoppingCart {
    items: IProduct[] = []
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
    getPrice() : number {
        let totalPrice : number = 0
        for (let i = 0;i < this.items.length;i ++) {
            if (this.items[i].price != null) {totalPrice += this.items[i].price}
        }
        return totalPrice
    }
    getCount() : number {
        return this.items.length
    }
    hasItem(id: string): boolean{
        return this.items.some(item => item.id === id);
    }
}