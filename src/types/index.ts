//Карточка товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}

//Тип карточки товара в каталоге на главной странице
export type TProductPage = Omit<IProduct, 'description'>;

//Тип карточки товара в корзине
export type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

//Корзина товаров
export interface IBasket {
  items: IProduct[];
  total: number | null;
} 

//Форма заказа
export interface IOrderForm {
  payment: TPaymentMethod;
  address: string;
  email: string;
  phone: string;
}

//Заказ
export interface IOrder extends IOrderForm {
  total: number;
  items: string[];
}

//Тип способа оплаты заказа
export type TPaymentMethod = 'card' | 'cash' | '';

//Тип для окна с формой способа оплаты и адреса
export type TOrderPayment = Pick<IOrderForm, 'payment' | 'address'>;

//Тип для окна с формой контактов - почты и телефона
export type TOrderContacts = Pick<IOrderForm, 'email' | 'phone'>;

//Тип ошибок форм заказа
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

//Тип данных успешного заказа:
export interface IOrderResult {
	id: string;
	total: number;
}

//Интерфейс модели данных приложения
export interface IAppModel {
  catalog: IProduct[];
  preview: string | null;
  basket: IProduct[];
  order: IOrderForm | null;

  setCatalog(items: IProduct[]): void;
  setPreview(item: IProduct): void;
  addProductToBasket(item: IProduct): void;
  deleteProductFromBasket(id: string): void;
  isAdded(id: string): boolean;
  getBasketTotal(): number;
  getBasketCount(): number;
  getProductIndex(item: IProduct): number;
  setOrderField(field: keyof IOrderForm, value: string): string;
  validateOrder(): boolean;
  addBasketToOrder(): IOrder;
  clearBasket(): IProduct[];
  clearOrder(): IOrder;
}

