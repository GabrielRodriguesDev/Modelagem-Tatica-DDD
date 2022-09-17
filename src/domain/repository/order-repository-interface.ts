import RepositoryInterface from "../repository/repository-interface";
import Customer from "../entity/customer";

export default interface CustomerRepositoryInterface
    extends RepositoryInterface<Customer> { }