import Entity from "@domain/@shared/entity/entity.abstract"
import ProductInterface from "./product.interface"
import NotificationError from "@domain/@shared/notification/notification.error";

export default class ProductB extends Entity implements ProductInterface {
  private _name: string
  private _price: number

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id
    this._name = name
    this._price = price
    this.validate()
  }

  validate() {
    if (!this._id) {
      this.notification.addError({
        context: "Customer",
        message: "ID is required"
      })
    }
    if (!this._name) {
      this.notification.addError({
        context: "Customer",
        message: "Name is required"
      })
    }
    if (!this._price || this._price <= 0) {
      this.notification.addError({
        context: "Customer",
        message: "Price must be greater than 0"
      })
    }

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get price(): number {
    return this._price * 2
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  changePrice(price: number) {
    this._price = price
    this.validate()
  }
}