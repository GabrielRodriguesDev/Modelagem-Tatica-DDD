import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/db/sequelize/model/product.model";
import Product from "../entity/product";
import ProductRepository from "./product.repository";

describe("Unit test for user sequelize repository", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    //* Deve testar a conexão
    it("should test connection", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } })


        expect(productModel?.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 100
        });
    });

    //* Deve atualizar o produto
    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        expect(productModel!.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 100,
        });

        product.changeName("Product 2");
        product.changePrice(200);

        await productRepository.update(product);

        const productModel2 = await ProductModel.findOne({ where: { id: "1" } });

        expect(productModel2!.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 200,
        });
    });

    //* Deve encontrar o produto
    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        const foundProduct = await productRepository.find("1");

        expect(productModel!.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
        });
    });

    //* Deve encontrar todos os produtos
    it("should find all products", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();
        const products = [product, product2];

        expect(products).toEqual(foundProducts);
    });
});