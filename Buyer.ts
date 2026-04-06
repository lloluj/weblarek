import {IProduct, IBuyer, TPayment} from '../weblarek/src/types/index'

type ValidationErrors = {
  payment: string;
  email: string;
  phone: string;
  address: string;
};


export class Buyer {
    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';
    constructor() {}
    setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment
    }
    if (data.email !== undefined) {
      this.email = data.email
    }
    if (data.phone !== undefined) {
      this.phone = data.phone
    }
    if (data.address !== undefined) {
      this.address = data.address
    }
  }
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }
  clearData(): void {
    this.payment = ''
    this.email = ''
    this.phone = ''
    this.address = ''
  }



  validate() : ValidationErrors {
    const obj : ValidationErrors = {
        payment: '',
        email: '',
        phone:'',
        address: ''
    }
    if (!this.payment) {
      obj.payment = 'Поле "вид оплаты" не может быть пустым';
    }
    if (!this.email) {
      obj.email = 'Поле "email" не может быть пустым';
    }
    if (!this.phone) {
      obj.phone = 'Поле "телефон" не может быть пустым';
    }
    if (!this.address) {
      obj.address = 'Поле "адрес" не может быть пустым';
    }
    return obj
  }
}

