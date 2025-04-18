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
    this.events.emit('products:changed', { catalog: this.catalog });
  };
  
  setPreview(item: IProduct) {
    this.preview = item.id;
    this.events.emit('preview:changed', item);
  };

  getProduct(id: string) {
		return this.catalog.find(item => item.id === id);
	}
  
  addProductToBasket(item: IProduct) {
    this.basket.push(item);
    this.events.emit('basket:changed');
  };
  
  deleteProductFromBasket(item: IProduct) {
    this.basket = this.basket.filter(product => product.id !== item.id);
    this.events.emit('basket:changed');
  };
  
  isAddedToBusket(item: IProduct) {
    if (!this.basket.some(product => product.id === item.id)) {
      return this.addProductToBasket(item);
    } else {
      return this.deleteProductFromBasket(item);
    }
  };

  getButtonText(item: IProduct) {
    if (!item.price) {
			return 'Не продается';
		}
    
    if (!this.basket.some(product => product.id === item.id)) {
      return 'Купить';
    } else {
      return 'Удалить из корзины';
    }
  }
  
  getBasketTotal() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  };
  
  getBasketCount() {
    return this.basket.length;
  };
  
  getProductIndex(item: IProduct) {
    return this.basket.indexOf(item) + 1;
  };
  
  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    this.validateOrder();
  };

  setOrderPayment(value: string) {
		this.order.payment = value;
	}

  getOrderData() {
    return {
      ...this.order,
      items: this.basket.map((item) => item.id),
      total: this.getBasketTotal(),
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
        errors.payment = 'выберите способ оплаты';
    }
    if (!this.order.address) {
        errors.address = 'укажите адрес';
    }
    if (!this.order.email) {
      errors.email = 'укажите электронную почту';
    }
    if (!this.order.phone) {
      errors.phone = 'укажите телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:changed', this.formErrors);
    return Object.keys(errors).length === 0;
};
  
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