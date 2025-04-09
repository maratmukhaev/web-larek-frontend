import './scss/styles.scss';
import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/Events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCardCatalog, ProductCardPreview, ProductCardBasket } from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Success } from './components/Success';
import { OrderContacts, OrderPayment } from './components/Order';
import { Modal } from './components/Modal';
import { IOrderForm, IProduct } from './types';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

//Темплейты
const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных приложения
const appData = new AppData({}, events);

//Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderPayment = new OrderPayment(cloneTemplate(paymentTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

//Бизнес-логика приложения
// Реагируем на события

//Изменились элементы каталога
events.on('products:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const productCardCatalog = new ProductCardCatalog(cloneTemplate(productCatalogTemplate), events);
    return productCardCatalog.render(item);
  });
});

//Выбрана карточка для детального просмотра
events.on('product:select', ({id}: {id: string}) => {
  const item = appData.getProduct(id);
  appData.setPreview(item);
});

//Изменилась карточка для детального просмотра
events.on('preview:changed', (item: IProduct) => {
  const productCardPreview = new ProductCardPreview(cloneTemplate(productPreviewTemplate), events);
  modal.render({
    content: productCardPreview.render({
      ...item, 
      button: appData.getButtonText(item),
    })
  });
});

//Нажата кнопка в окне детального просмотра товара
events.on('button:status', ({id}: {id: string}) => {
  const item = appData.getProduct(id);
	appData.isAddedToBusket(item);
  modal.close();
});

//Нажата кнопка корзины в хедере
events.on('basket:open', () => {
  modal.render({
    content: basket.render(),
  })
})

//Изменились данные корзины
events.on('basket:changed', () => {
  page.counter = appData.getBasketCount();
  basket.total = appData.getBasketTotal();
  basket.items = appData.basket.map(item => {
    const productCardBasket = new ProductCardBasket(cloneTemplate(productBasketTemplate), events);
    productCardBasket.index = appData.getProductIndex(item);
    return productCardBasket.render({
      ...item,
    })
  })
})

//Нажата кнопка удаления товара в корзине
events.on('basket:delete', ({id}: {id: string}) => {
  const item = appData.getProduct(id);
  appData.deleteProductFromBasket(item);
})

//Нажата кнопка оформления заказа в корзине
events.on('order:open', () => {
  orderPayment.clearPayment();
  modal.render({
    content: orderPayment.render({
      payment: appData.order.payment,
      address: appData.order.address,
      valid: appData.validateOrder(), 
      errors: [],
    })
  })
})

//Изменилось содержимое одного из полей формы
events.on('input:change', (data: { 
  field: keyof Pick<IOrderForm, 'address' | 'phone' | 'email'>; 
  value: string,
}) => {
  appData.setOrderField(data.field, data.value);
});

//Изменился способ оплаты
events.on('payment:change', (data: { 
  payment: keyof Pick<IOrderForm, 'payment'>, 
  button: HTMLElement, 
}) => {
  orderPayment.togglePayment(data.button);
  appData.setOrderPayment(data.payment);
  appData.validateOrder();
});

//Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<IOrderForm>) => {
	const { payment, address, email, phone } = errors;
  const createValidationError = (errorsObject: Record<string, string>): string => 
    Object.values(errorsObject).filter((i) => !!i).join(' и ');

	orderPayment.valid = !payment && !address;
	orderPayment.errors = createValidationError({ payment, address });
  orderContacts.valid = !email && !phone;
  orderContacts.errors = createValidationError({ email, phone });
});

//Подтверждены способ оплаты и адрес
events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			email: appData.order.email,
      phone: appData.order.phone,
			valid: appData.validateOrder(),
			errors: [],
		}),
	});
});

//Подтверждены почта и телефон
events.on('contacts:submit', () => {
  api.orderItems(appData.getOrderData())
  .then(() => {
    modal.render({
      content: success.render({
        total: appData.getBasketTotal(),
      }),
    });
    appData.clearBasket();
    appData.clearOrder();
  })
  .catch((err) => {
    console.error(err);
  })
});

//Нажата кнопка в окне успешного заказа
events.on('order:finished', () => {
  modal.close();
})

//Открылось модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

//Закрылось модальное окно
events.on('modal:close', () => {
	page.locked = false;
});

//Получаем каталог продуктов с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });