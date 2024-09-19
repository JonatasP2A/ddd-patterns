import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

let customer = new Customer("123", "JP2A");
const address = new Address("R. default", 333, "12345-123", "City");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 100, "p1", 1);
const item2 = new OrderItem("2", "Item 2", 200, "p2", 1);
const order = new Order("1", "123", [item1, item2]);