import './scss/styles.scss';
import { AppData } from './components/AppData';
import { EventEmitter, IEvents } from './components/base/Events';

const appData = new AppData();

const cards = [
  {
    "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
    "description": "Если планируете решать задачи в тренажёре, берите два.",
    "image": "/5_Dots.svg",
    "title": "+1 час в сутках",
    "category": "софт-скил",
    "price": 750
},
{
  "id": "123123",
  "description": "еще один продукт",
  "image": "/3_Dots.svg",
  "title": "Другой продукт",
  "category": "хард-скил",
  "price": 50
}
]
const card1 = 
  {
    "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
    "description": "Если планируете решать задачи в тренажёре, берите два.",
    "image": "/5_Dots.svg",
    "title": "+1 час в сутках",
    "category": "софт-скил",
    "price": 750
}

const card2 = 
{
  "id": "123123",
  "description": "еще один продукт",
  "image": "/3_Dots.svg",
  "title": "Другой продукт",
  "category": "хард-скил",
  "price": 50
}

appData.setCatalog(cards);

console.log(appData.catalog);

appData.addProductToBasket(card1);
appData.addProductToBasket(card2);

console.log(appData.getProductIndex(card1));

console.log(appData.basket);
console.log(appData.getBasketCount());
console.log(appData.getBasketTotal());

appData.setPreview(card2);
console.log(appData.preview);

appData.setOrderField("address", "Москва");
appData.setOrderField("email", "ya@ya.ru");
appData.setOrderField("phone", "+79031111111");
appData.setOrderField("payment", 'cash');
console.log(appData.order);
console.log(appData.validateOrder());
console.log(appData.formErrors);
appData.clearOrder();
console.log(appData.order);
appData.clearBasket();
console.log(appData.basket);
appData.addProductToBasket(card2);
console.log(appData.basket);