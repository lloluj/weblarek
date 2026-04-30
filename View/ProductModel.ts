export interface IProduct {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
    description: string;
}

export class ProductModel {
    private products: Map<string, IProduct> = new Map();

    setProducts(products: IProduct[]): void {
        this.products.clear();
        products.forEach(product => {
            this.products.set(product.id, product);
        });
    }

    getProduct(id: string): IProduct | undefined {
        return this.products.get(id);
    }

    getAllProducts(): IProduct[] {
        return Array.from(this.products.values());
    }
}