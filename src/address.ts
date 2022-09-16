

    
    



export default class Address {

    /* Nota-se que são atributos privados sem setters então não permite alteração */

    _street: string = "";
    _number: number = 0;
    _zip: string = "";
    _city: string = "";

    /* 
    Só permite a construção do objeto, então caso eu queira mudar o endereço,
    preciso criar um novo objeto.
    */
    constructor(street: string, number: number, zip: string, city: string) {
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get zip(): string {
        return this._zip;
    }

    get city(): string {
        return this._city;
    }

    /* 
    Validação
    */
    
    validate() {
        if (this._street.length === 0) {
            throw new Error("Street is required");
        }
        if (this._number === 0) {
            throw new Error("Number is required");
        }
        if (this._zip.length === 0) {
            throw new Error("Zip is required");
        }
        if (this._city.length === 0) {
            throw new Error("City is required");
        }
    }

        /*
    Podemos manipular os getters, fazendo retornar um endereço em um padrão americano
    através de um método, podemos manipular a visualização como quisermos, porém não
    podemos alterar os valores dos atributos.
    */

    toString() {
        return `${this._street}, ${this._number}, ${this._zip} ${this._city}`;
    }
}