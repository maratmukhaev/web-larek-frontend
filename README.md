# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка товара:

```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  button: string;
}

interface IProductList {
  total: number;
  items: IProduct[];
}
```

Данные формы заказа:

```
interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
```

Данные заказа для отправки на сервер:

```
interface IOrder extends IOrderForm {
  total: number;
  items: string[];
}
```

Тип карточки товара в каталоге на главной странице:

```
type TProductPage = Omit<IProduct, 'description'>;
```

Тип объекта, в котором ключ — это категория товара, а значение — соответствущий ей класс разметки:

```
type TProductCategory = { [key: string]: string };
```

Тип карточки товара в корзине:

```
type TProductBasket = Pick<IProduct, 'id' | 'title' | 'price'>;
```

Данные корзины:

```
interface IBasket {
  items: TProductBasket[];
  total: number | null;
} 
```

Тип способа оплаты заказа:

```
type TPaymentMethod = 'card' | 'cash' | '';
```

Тип данных для окна с формой оплаты и адреса:

```
type TOrderPayment = Pick<IOrderForm, 'payment' | 'address'>;
```

Тип данных для окна с формой контактов:

```
type TOrderContacts = Pick<IOrderForm, 'email' | 'phone'>;
```

Тип ошибок форм заказа:
```
type TFormErrors = Partial<Record<keyof IOrderForm, string>>;
```

Данные успешного заказа:

```
interface IOrderResult {
	id: string;
	total: number;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой данных — отвечает за хранение и изменение данных;
- слой представления — отвечает за отображение данных на странице;
- презентер — отвечает за связь данных и представления.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы:

- `get` — выполняет `GET` запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.

- `post` — принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер события позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 

Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:

- `on` — подписывается на событие;
- `emit` — инициализирует событие;
- `trigger` — возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

#### Класс Component

Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента.

Набор методов:

- `toggleClass` — переключает класс элемента.
- `setText` — устанавливает текстовое содержимое.
- `setDisabled` — устанавливает состояние блокировки.
- `setHidden` — скрывает элемент.
- `setVisible` — показывает элемент.
- `setImage` — устанавливает источник изображения и алтернативный текст.
- `render` — сохраняет данные, полученные в параметре, в полях компонентов через их сеттеры и возвращает обновленный контейнер компонента.

### Слой данных

#### Класс AppData

Класс отвечает за хранение и логику работы с данными всего приложения. 

В полях класса хранятся следующие данные:

- `catalog: IProduct[]` — массив карточек каталога.
- `preview: string | null` — id карточки, выбранной для детального просмотра.
- `basket: IProduct[]` — массив карточек, добавленных в корзину.
- `order: IOrderForm | null` — данные формы заказа.
- `orderData: IOrder` — данные заказа для отправки на сервер.
- `formErrors: FormErrors` — ошибки форм заказа.

Набор методов для взаимодействия с этими данными:

- `setCatalog(items: IProduct[]): void` — сохраняет массив товаров в каталог.
- `setPreview(item: IProduct): void` — сохраняет id товара для детального просмотра.
- `getProduct(id: string): IProduct` — получает товар по id.
- `addProductToBasket(item: IProduct): void` — добавляет товар в массив корзины. 
- `deleteProductFromBasket(id: string): void` — удаляет товар из массива корзины.
- `isAdded(item: IProduct): void` — проверяет наличие товара в массиве корзины.
- `getButtonStatus(item: IProduct): void` — получает статус кнопки в окне детального просмотра карточки. 
- `getBasketTotal(): number` — получает общую стоимость товаров в корзине.
- `getBasketCount(): number` — получает количество товаров в корзине.
- `getProductIndex(item: IProduct): number` — получает порядковый номер товара в корзине.
- `setOrderField(field: keyof IOrderForm, value: string): void` — сохраняет значения, введенные в поля формы заказа.
- `setOrderPayment(value: string): void` — сохраняет значение способа оплаты.
- `validateOrder(): boolean` — проверяет заполнение формы заказа.
- `setOrderData(): void` — сохраняет данные заказа для отправки на сервер.
- `clearBasket(): void` — очищает корзину от всех товаров.
- `clearOrder(): void` — очищает данные из форм заказа.

### Слой представления

Все классы представления отвечают за отображение данных внутри контейнера.

#### Класс Modal

Реализует универсальное модальное окно, в котором отображается содержимое любого модального окна приложения — детальная карточка продукта, корзина, форма заказа и окно успешного заказа. Устанавливает слушатели на клик в оверлей и на кнопку-крестик для закрытия попапа. Конструктор принимает контейнер и экземпляр класса `EventEmitter` для инициации событий.

Поля класса:

- `content: HTMLElement` — содержимое модального окна.
- `closeButton: HTMLButtonElement` — кнопка-крестик закрытия модального окна.

Методы класса:

- `open()` — открывает модальное окно.
- `close()` — закрывает модальное окно.

Содержит сеттер для установки содержимого модального окна.

#### Класс ProductCard

Общий класс карточки товара. Поля класса содержат элементы разметки контейнера с названием, категорией, изображением, описанием, стоимостью товара и кнопкой добавления в корзину. Конструктор принимает DOM элемент темплейта карточки и экземпляр класса `EventEmitter` для инициации событий. Содержит сеттеры для установки значений полей.

#### Класс ProductCardCatalog

Наследует класс `ProductCard`, отвечает за отображение карточки товара в каталоге на главной странице. Конструктор принимает DOM элемент темплейта карточки и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливается слушатель на клик для генерации события открытия модального окна детального просмотра.

#### Класс ProductCardPreview

Наследует класс `ProductCard`, отвечает за отображение карточки товара в окне детального просмотра. Конструктор принимает DOM элемент темплейта карточки и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливается слушатель на кнопке, при срабатывании которой генерируется соответствующее событие.

#### Класс ProductCardBasket

Наследует класс `ProductCard`, отвечает за отображение карточки товара в окне корзины. Поля класса содержат элементы разметки контейнера с порядковым номером товара и кнопкой удаления. Конструктор принимает DOM элемент темплейта карточки и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливается слушатель на кнопке удаления товара, при срабатывании которой генерируется соответствующее событие.

#### Класс Page

Отвечает за отображение динамических элементов на главной странице. Конструктор принимает контейнер с кнопкой корзины, счетчиком и каталогом товаров, и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливается слушатель на кнопке корзины, при срабатывании которой генерируется соответствующее событие. Содержит метод, отвечающий за блокирование скроллинга при открытом модальном окне.

#### Класс Basket

Отвечает за отображение окна корзины. Поля класса содержат элементы разметки контейнера со списком товаров, общей стоимостью и кнопкой оформления заказа. Конструктор принимает темплейт корзины и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливается слушатель на кнопке оформления заказа, при срабатывании которой генерируется соответствующее событие.

#### Класс Success

Отвечает за отображение окна успешного оформления заказа. Содержит поля с общей суммой заказа и кнопкой «За новыми покупками». Конструктор принимает темплейт блока и экземпляр класса `EventEmitter` для инициации событий. На кнопку вешается слушатель события.

#### Класс Form

Представляет собой компонент формы, отвечающий за отображение общих элементов форм заказа — кнопки отправки (submit) и поля ошибок валидации. Конструктор принимает темплейт формы и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливаются слушатели событий для отслеживания ввода данных в поля формы и срабатывания кнопки submit.

Содержит сеттеры для установки сообщения об ошибке валидации и установки состояния кнопки submit в зависимости от валидности формы.

#### Класс OrderPayment

Расширяет класс `Form`. Отвечает за отображение кнопок выбора способа оплаты и поля ввода адреса. Конструктор принимает темплейт формы и экземпляр класса `EventEmitter` для инициации событий. В конструкторе устанавливаются слушатели на кнопки выбора способа оплаты. Содержит методы переключения активности кнопок оплаты и их деактивации и сеттер для установки адреса.

#### Класс OrderContacts

Расширяет класс `Form`. Отвечает за отображение полей ввода почты и телефона. Конструктор принимает темплейт формы и экземпляр класса `EventEmitter` для инициации событий. Содержит сеттеры для установки почты и телефона. 

### Слой коммуникации

#### Класс AppApi

Наследует базовый класс `Api`. Принимает в конструктор базовый URL сервера и URL для формирования адреса изображения товара. Предоставляет методы, реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов

Код, описывающий взаимодействие данных и представления, находится в файле `index.ts`, выполняющем роль презентера. Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий, и обработчиков этих событий, описанных в `index.ts`. В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### Список всех событий, которые могут генерироваться в системе:

*События изменения данных (генерируются классами модели данных):*

- `products:changed` — изменение каталога товаров.
- `preview:changed` — изменение карточки товара в окне детального просмотра.
- `basket:changed` — изменение корзины товаров.
- `formErrors:changed` — изменение состояния валидации формы.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление):*

- `product:select` — выбор карточки для детального просмотра.
- `button:status` — нажатие на кнопку в окне детального просмотра.
- `basket:open` — открытие корзины товаров.
- `basket:delete` — удаления товара с помощью кнопки в корзине.
- `order:open` — открытие формы заказа.
- `input:change` — изменение одного из полей формы.
- `payment:change` — изменение способа оплаты в форме.
- `order:submit` — подтверждение способа оплаты и адреса.
- `contacts:submit` — подтверждение почты и телефона.
- `order:finished` — нажатие на кнопку успешного заказа.
- `modal:open` - открытие модального окна.
- `modal:close` - закрытие модального окна.