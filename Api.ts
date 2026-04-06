import { IProductsResponse, IOrderRequest, IOrderResponse, IProduct, IApi } from '../weblarek/src/types/index';


export class ApiService {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }
  async getProducts(): Promise<IProduct[]> {
    const response: IProductsResponse = await this.api.get<IProductsResponse>('/product/');
    return response.items;
  }
  async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order/', orderData);
  }
}

export default ApiService;