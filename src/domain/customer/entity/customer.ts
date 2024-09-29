import Entity from "@domain/@shared/entity/entity.abstract"
import Address from "../value-object/address"
import NotificationError from "@domain/@shared/notification/notification.error"
import CustomerValidatorFactory from "../factory/customer.validator.factory"

export default class Customer extends Entity {
  private _name: string = ""
  private _address?: Address
  private _active: boolean = false
  private _rewardPoints: number = 0

  constructor(id: string, name: string) {
    super();
    this._id = id
    this._name = name
    this.validate()
  }

  get name(): string {
    return this._name
  }

  get address(): Address | undefined {
    return this._address
  }

  get rewardPoints(): number {
    return this._rewardPoints
  }

  validate() {
    CustomerValidatorFactory.create().validate(this)

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  changeAddress(address: Address) {
    this._address = address
  }

  isActive(): boolean {
    return this._active
  }

  activate() {
    if (!this._address) {
      throw new Error("Address is mandatory to activate a customer")
    }
    this._active = true
  }

  deactivate() {
    this._active = false
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points
  }
}