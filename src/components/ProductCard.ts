import { IProduct, TProductPage, TProductBasket } from "../types";
import { productCategory } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

export class ProductCard<T> extends Component<IProduct> {
  protected _description: HTMLElement;
  protected _image: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _id: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._description = container.querySelector(`.card__text`);
    this._image = container.querySelector(`.card__image`);
    this._title = ensureElement<HTMLElement>(`.card__title`, container);
    this._category = container.querySelector(`.card__category`);
    this._price = ensureElement<HTMLElement>(`.card__price`, container);
    this._button = container.querySelector(`.card__button`);
  }

  set id(value: string) {
		this._id = value;
	}

  get id() {
		return this._id;
	}

  set description(value: string) {
		this.setText(this._description, value);
	}

	get description() {
		return this._description.textContent || '';
	}

  set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get image() {
		return this._image.src || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

  set category(value: string) {
		this.setText(this._category, value);
    if(this._category) {
      this.toggleClass(this._category, productCategory[value], true);
    }
	}

	get category() {
		return this._category.textContent || '';
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
      this.setDisabled(this._button, true);
		}
	}

	get price() {
		return this._price.textContent;
	}

  set button(value: string) {
    this.setText(this._button, value);
	}
}

export class ProductCardCatalog extends ProductCard<TProductPage> {

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this.container.addEventListener('click', () => { 
      this.events.emit('product:select', {id: this.id});
    });
  }
}

export class ProductCardPreview extends ProductCard<IProduct> {

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this._button.addEventListener('click', () => { 
      this.events.emit('button:status', {id: this.id});
    });
  }
}

export class ProductCardBasket extends ProductCard<TProductBasket> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container, events);

    this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
    this._deleteButton = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
    
    this._deleteButton.addEventListener('click', () => {
      this.events.emit('basket:delete', {id: this.id});
    });
  }

  set index(value: number) {
		this.setText(this._index, value);
	}
}