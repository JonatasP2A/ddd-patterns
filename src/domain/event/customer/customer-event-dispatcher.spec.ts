import Address from "../../entity/address";
import EventDispatcher from "../@shared/event-dispatcher";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import NotifyOngoingDeliveryOperationsToRerouteHandler from "./handler/notify-ongoing-delivery-operations-to-reroute.handler";
import SendPromotionalOfferForNewCustomerHandler from "./handler/send-promotional-offer-for-new-customer.handler";
import SendWelcomeEmailWhenCustomerIsCreatedHandler from "./handler/send-welcome-email-when-customer-is-created.handler";

describe("Customer events testes", () => {
  it("should register an event handler", () => {
    // Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendWelcomeEmailWhenCustomerIsCreatedHandler()
    const eventHandler2 = new SendPromotionalOfferForNewCustomerHandler();
    const eventHandler3 = new NotifyOngoingDeliveryOperationsToRerouteHandler();
    // Act
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);
    // Assert
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContainEqual(eventHandler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContainEqual(eventHandler2);

    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toContainEqual(eventHandler3);
  })
  
  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendWelcomeEmailWhenCustomerIsCreatedHandler()
    const eventHandler2 = new SendPromotionalOfferForNewCustomerHandler();
    const eventHandler3 = new NotifyOngoingDeliveryOperationsToRerouteHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);
    // Act
    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.unregister("CustomerAddressChangedEvent", eventHandler3)
    // Assert
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(0);
  })

  it("should unregister all event handlers", () => {
    // Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendWelcomeEmailWhenCustomerIsCreatedHandler()
    const eventHandler2 = new SendPromotionalOfferForNewCustomerHandler();
    const eventHandler3 = new NotifyOngoingDeliveryOperationsToRerouteHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);
    // Act
    eventDispatcher.unregisterAll();
    // Assert
    expect(eventDispatcher.getEventHandlers).toMatchObject({});
  })

  it("should notify CustomerCreated event handlers", () => {
    // Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendWelcomeEmailWhenCustomerIsCreatedHandler()
    const eventHandler2 = new SendPromotionalOfferForNewCustomerHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    
    // Act
    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "John Doe",
    });
    // Quando o notify for executado, o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);

    // Assert
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  })

  it("should notify CustomerAddressChanged event handlers", () => {
    // Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler3 = new NotifyOngoingDeliveryOperationsToRerouteHandler();
    const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");
    const spyEventHandler3Log = jest.spyOn(console, "log");
    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler3);
    
    // Act
    const address = new Address("Rua 1", 123, "12345-00", "Springfield");
    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "1",
      name: "John Doe",
      address: address
    });
    eventDispatcher.notify(customerAddressChangedEvent);

    // Assert
    expect(spyEventHandler3).toHaveBeenCalled();
    expect(spyEventHandler3Log).toHaveBeenCalledWith(
      "Endereço do cliente: 1, John Doe alterado para: Rua 1 123, 12345-00 Springfield"
    );
  })
})