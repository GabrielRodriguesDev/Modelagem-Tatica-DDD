import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    //* Deve criar o cliente
    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer); //! Gravando o agregado (Cliente que possui um value object endereço)

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel!.toJSON()).toStrictEqual({ //! Validando se os objetos possuem as mesmas estruturas
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        });
    });

    //* Deve atualizar o cliente
    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel!.toJSON()).toStrictEqual({ //! Validando se os objetos possuem as mesmas estruturas
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
        });
    });

    //* Deve encontrar o cliente
    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.Address = address;
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult); //! Validando se os objetos possuem as mesmas estruturas
    });

    //* Deve lançar um erro quando o cliente não for encontrado
    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();

        expect(async () => {
            await customerRepository.find("456ABC");
        }).rejects.toThrow("Customer not found");
    });

    //* Deve encontrar todos os clientes
    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.Address = address1;
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.Address = address2;
        customer2.addRewardPoints(20);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2); //! Validando se exite 2 registros da minha lista
        expect(customers).toContainEqual(customer1); //! Validando se os objetos possuem as mesmas estruturas
        expect(customers).toContainEqual(customer2); //! Validando se os objetos possuem as mesmas estruturas
    });
});