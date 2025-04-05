import { TOrderContacts, TOrderPayment } from "../types";
import { IEvents } from "./base/Events";
import { Form } from "./Form";

export class OrderPayment extends Form<TOrderPayment> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _address: HTMLInputElement;
  
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.elements.namedItem('card') as HTMLButtonElement;
    this._cashButton = container.elements.namedItem('cash') as HTMLButtonElement;
    this._address = container.elements.namedItem('address') as HTMLInputElement;

    if(this._cardButton) {
      this._cardButton.addEventListener('click', () => {
        this.events.emit('payment:change', {
          payment: this._cardButton.name,
        });
      });
    }

    if(this._cashButton) {
      this._cashButton.addEventListener('click', () => {
        this.events.emit('payment:change', {
          payment: this._cashButton.name,
        });
      });
    }
  }

  set address(value: string) {
    this._address.value = value;
  }

  togglePayment(value: HTMLElement) {
		this.clearPayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	clearPayment() {
		this.toggleClass(this._cardButton, 'button_alt-active', false);
		this.toggleClass(this._cashButton, 'button_alt-active', false);
	}
}

export class OrderContacts extends Form<TOrderContacts> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._email = container.elements.namedItem('email') as HTMLInputElement;
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }
}