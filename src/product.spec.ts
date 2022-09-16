import Product from "./product";

describe("Product unit tests", () => {

    //* Deve lançar erro qunando Id estiver vázio
    it("should throw error when id is empty", () => {
        expect(() => {
            const product = new Product("", "Product 1", 100);
        }).toThrowError("Id is required");
    });

    //* Deve lançar erro quando name estiver vázio
    it("should throw error when name is empty", () => {
        expect(() => {
            const product = new Product("123", "", 100);
        }).toThrowError("Name is required");
    });

    //* Deve lançar erro quando o preço for menor que zero
    it("should throw error when price is less than zero", () => {
        expect(() => {
            const product = new Product("123", "Name", -1);
        }).toThrowError("Price must be greater than zero");
    });

    //* Deve mudar o name
    it("should change name", () => {
        const product = new Product("123", "Product 1", 100);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    });

    //* Deve mudar o price
    it("should change price", () => {
        const product = new Product("123", "Product 1", 100);
        product.changePrice(150);
        expect(product.price).toBe(150);
    });
});