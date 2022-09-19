
import { Sequelize } from "sequelize-typescript";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";

import ProductModel from "../../../product/repository/sequelize/product.model";
import OrderItemModel from "./order-item.model";
import OrderRepository from "./order.repository";
import { or } from "sequelize";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import Customer from "../../../../domain/customer/entity/customer";
import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    //* Deve criar um novo pedido
    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ //! Recuperando o registro que atenda a clausula
            where: { id: order.id },
            include: ["items"], //* Incluindo os itens ao recuperar o pedido
        });

        expect(orderModel!.toJSON()).toStrictEqual({ //! Validando se os objetos possuem as mesmas estruturas
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    //* Deve atualizar o pedido
    it("should update a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);



        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        let order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        let orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });


        expect(orderModel!.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });

        const product2 = new Product("456", "Product 2", 10);
        await productRepository.create(product2);

        const ordemItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            1
        );


        order = new Order("123", "123", [ordemItem, ordemItem2]);
        await orderRepository.update(order);

        orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel!.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
                {
                    id: ordemItem2.id,
                    name: ordemItem2.name,
                    price: ordemItem2.price,
                    quantity: ordemItem2.quantity,
                    order_id: "123",
                    product_id: "456",
                }
            ],
        });
    });

    //* Deve encontrar o pedido
    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            1
        );

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });


    //* Deve encontrar todos os pedidos
    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("456", "Product 2", 10);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const ordemItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            1
        );
        const ordemItem2 = new OrderItem(
            "1",
            product2.name,
            product2.price,
            product2.id,
            2
        );
        const orderRepository = new OrderRepository();

        const order1 = new Order("123", "123", [ordemItem1]);
        await orderRepository.create(order1);

        // const order2 = new Order("456", "123", [ordemItem2]);
        // await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders.length).toBe(1);
    });
});
