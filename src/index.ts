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

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

const appData = new AppData({}, events);

Promise.all([api.getProductList()])
.then(([data]) => {
  appData.setCatalog(data);
  events.emit('initialData:loaded');
})
.catch((err) => {
  console.log(err);
});

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const succesTemplate = ensureElement<HTMLTemplateElement>('#success');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalTemplate = ensureElement<HTMLTemplateElement>('modal');
const element = document.querySelector('.header__basket-counter') as HTMLElement;


const testSection = document.querySelector('.gallery');

const modal = new Modal(cloneTemplate(modalTemplate), events);
const order = new OrderPayment(cloneTemplate(formOrderTemplate), events);
const orderContacts = new OrderContacts(cloneTemplate(formOrderTemplate), events);
const succes = new Succes(cloneTemplate(succesTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const card1 = new ProductCardBasket(cloneTemplate(cardBasketTemplate), events);
const card2 = new ProductCardBasket(cloneTemplate(cardBasketTemplate), events);

card1.title = 'Товар 1';
card1.description = 'Описание';
card1.image = 'sdgdfg';
card1.price = '3253';
card1.category = 'категория';
card1.id = '24225';
card1.index = 1;

card2.title = 'Товар 2';
card2.description = 'Описание';
card2.image = 'sdgdfg';
card1.price = '3253';
card2.category = 'категория';
card2.id = '243524';
card2.index = 2;

const cardsBasket = [];

cardsBasket.push(card1.render());
cardsBasket.push(card2.render());

succes.total = 234;

testSection.append(modal.render({content: element}));

