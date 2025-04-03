import './scss/styles.scss';
import { AppData } from './components/AppData';
import { EventEmitter } from './components/base/Events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductCardCatalog, ProductCardPreview, ProductCardBasket } from './components/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';

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
})
.catch((err) => {
  console.log(err);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

const page = new Page(document.body, events);
const card1 = new ProductCardCatalog(cloneTemplate(cardCatalogTemplate), events);
const card2 = new ProductCardCatalog(cloneTemplate(cardCatalogTemplate), events);

card1.title = 'Товар 1'
card1.description = 'Описание';
card1.image = 'https://larek-api.nomoreparties.co/content/weblarek/5_Dots.svg';
card1.price = '876';
card1.category = 'категория';
card1.id = '54321';


card2.title = 'Товар 2'
card2.description = 'Описание';
card2.image = 'https://larek-api.nomoreparties.co/content/weblarek/5_Dots.svg';
card2.price = '';
card2.category = 'категория';
card2.id = '12345';

const cardCatalog = [];
cardCatalog.push(card1.render());
cardCatalog.push(card2.render());

page.render({catalog: cardCatalog})

page.render({counter: 10});
