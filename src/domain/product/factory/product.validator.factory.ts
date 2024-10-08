import ValidatorInterface from "@domain/@shared/validator/validator.interface";
import ProductYupValidator from "../validator/product.yup.validator";
import Product from "../entity/product";

export default class ProductValidatorFactory {
    static create(): ValidatorInterface<Product> {
        return new ProductYupValidator();
    }
}