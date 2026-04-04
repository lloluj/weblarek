import {IProduct} from '../weblarek/src/types/index'

export class ProductCatalog {
    products: IProduct[] = []
    selectedProduct: IProduct | null = null
    constructor() {}
    setItems(items: IProduct[]): void {
        this.products = items
    }
    getItems():  IProduct[] {
        return this.products
    }
    getProductById(id: string) : IProduct | null {
        const product = this.products.find((product) => product.id === id);
        return product || null;
    }
    setProduct (selectedProduct: IProduct): void {
        this.selectedProduct = selectedProduct
    }
    getProduct (): IProduct | null {
        return this.selectedProduct
    }
}