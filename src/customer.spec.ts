import Address from "./address";
import Customer from "./customer";
describe("Customer unit test", () => {

    //* Deve lançar erro quando o id estiver vazio
    it("Should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "Gabriel");
        }).toThrowError("Id is required");
    });

    //* Deve lançar erro quando o name estiver vazio
    it("Should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("1", "");
        }).toThrowError("Name is required");
    });

    //*Deve mudar de name
    it("Should change name", () => {
        const customer = new Customer("9", "Adrielly");
        customer.changeName("Drika");

        expect(customer.name).toBe("Drika");
    });

    //*Deve ativar o customer
    it("Should activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua Sebastião Mamede", 244, "06663055", "Itapevi");
        customer.Address = address;
        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    //*Deve desativar o customer
    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.isActive()).toBe(false);
    });

    //* Deve lançar erro quando o endereço é indefinido quando você ativa o customer
    it("Should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer")
    });

    //* Deve adicionar pontos de recompensa
    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);
        //! Sum
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);
        //! Sum
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });
});