import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";

interface ISucces {
  total: number;
}

export class Succes extends Component<ISucces> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._description = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this._closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    })
  }

  set total(value: number) {
    this.setText(this._description, `Списано ${value} синапсов`);
  }
}