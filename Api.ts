import { IProductsResponse, IOrderRequest, IOrderResponse, IProduct, IApi } from '../weblarek/src/types/index';


class ApiService {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }
  async get(): Promise<IProduct[]> {
    const response: IProductsResponse = await this.api.get<IProductsResponse>('/product/');
    return response.items;
  }
  async post(orderData: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order/', orderData);
  }
}

export default ApiService;