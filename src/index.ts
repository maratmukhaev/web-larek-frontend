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

// Мониторинг всей событий
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

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

//Получаем каталог продуктов с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

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
      button: appData.getButtonStatus(item),
    })
  });
});

//Нажата кнопка в окне детального просмотра
events.on('button:status', ({id}: {id: string}) => {
  const item = appData.getProduct(id);
	appData.isAddedToBusket(item);
  modal.close();
});

//Открылась корзина
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

//Удалился товар из корзины
events.on('basket:delete', ({id}: {id: string}) => {
  const item = appData.getProduct(id);
  appData.deleteProductFromBasket(item);
})

//Открылась форма оплаты и адреса
events.on('order:open', () => {
  modal.render({
    content: orderPayment.render({
      address: '',
      valid: true, 
      errors: [],
    })
  })
})

//Изменилось одно из полей формы
events.on('input:change', (data: { 
  field: keyof IOrderForm, 
  value: string 
}) => {
  appData.setOrderField(data.field, data.value);
});

//Изменился способ оплаты
events.on('payment:change', (data: { payment: string, button: HTMLElement }) => {
orderPayment.togglePayment(data.button);
appData.validateOrder();
});

//Подтверждение способа оплаты и адреса
events.on('order:submit', () => {
	modal.render({
		content: orderContacts.render({
			email: '',
      phone: '',
			valid: false,
			errors: [],
		}),
	});
});

//Подтверждение почты и телефона
events.on('contacts:submit', () => {
	modal.render({
		content: success.render({
      total: appData.getBasketTotal(),
    }),
	});
});


//Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	orderPayment.valid = !payment && !address;
	orderPayment.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join(' и ');
  orderContacts.valid = !email && !phone;
  orderContacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join(' и ');
});

//Открылось модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

//Закрылось модальное окно
events.on('modal:close', () => {
	page.locked = false;
});