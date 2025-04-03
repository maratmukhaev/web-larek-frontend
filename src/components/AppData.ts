import {TFormErrors, IAppModel, IOrderForm, IProduct, IOrder} from "../types";
import { IEvents } from '../components/base/Events'

export class AppData<T> implements IAppModel {
  catalog: IProduct[] = [];
  preview: string | null;
  basket: IProduct[] = [];
  order: IOrderForm = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };
  formErrors: TFormErrors = {};

  constructor(data: Partial<T>, protected events: IEvents) {
    Object.assign(this, data);
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.events.emit('products:changed');
  }
  
  setPreview(item: IProduct) {
    this.preview = item.id;
    this.events.emit('preview:changed');
  }
  
  addProductToBasket(item: IProduct) {
    this.basket.push(item);
    this.events.emit('basket:changed', this.basket);
  }
  
  deleteProductFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id);
    this.events.emit('basket:changed', this.basket);
  };
  
  isAdded(item: IProduct) {
    return !this.basket.some(product => product.id === item.id) 
    ? this.addProductToBasket(item)
    : this.deleteProductFromBasket(item.id);
  };
  
  getBasketTotal() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }
  
  getBasketCount() {
    return this.basket.length;
  };
  
  getProductIndex(item: IProduct) {
    return this.basket.indexOf(item) + 1;
  };
  
  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    this.validateOrder();
  }
  
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.email) {
      errors.email = 'Необходимо указать электронную почту';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:changed', this.formErrors);
    return Object.keys(errors).length === 0;
}
  /*
  setOrder() {

  };
  */
  
  clearBasket() {
    this.basket = [];
    this.events.emit('basket:changed', this.basket);
  };
  
  clearOrder() {
    this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
  };
}