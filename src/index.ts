import './scss/styles.scss';
import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/Events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCardCatalog, ProductCardPreview, ProductCardBasket } from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Succes } from './components/Success';
import { OrderContacts, OrderPayment } from './components/Order';
import { Modal } from './components/Modal';
import { IProduct } from './types';

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
  /*page.counter = appData.getBasketCount();*/
});

//Выбрана карточка для детального просмотра
events.on('product:select', (item: IProduct) => {
  appData.setPreview(item);
});

//Изменилась карточка для детального просмотра
events.on('preview:changed', (item: IProduct) => {
  const productCardPreview = new ProductCardPreview(cloneTemplate(productPreviewTemplate), events);
  modal.render({
    content: productCardPreview.render({
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      button: appData.getButtonStatus(item),
    }),
  });
});

//Нажатие на кнопку в окне детального просмотра
events.on('button:status', (item: IProduct) => {
	appData.isAddedToBusket(item);
});

//Открылось модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

//Закрылось модальное окно
events.on('modal:closed', () => {
	page.locked = false;
});