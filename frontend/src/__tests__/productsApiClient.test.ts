import nock from 'nock';
import {createProduct, getProducts, updateProductOrder, updateProductQuantity} from "../productsApiClient";

describe('productsApiClient', () => {
    describe('getProducts', () => {
        it('should make a GET request to retrieve all products', async () => {
            const expectedProducts = [{name: 'first-product', quantity: 0}, {name: 'second-product', quantity: 2}];
            nock('http://localhost').get('/products').reply(200, expectedProducts);

            const actualProducts = await getProducts();

            expect(actualProducts).toEqual(expectedProducts);
        });
    });

    describe('createProduct', () => {
        it('should make a POST request to create a product', async () => {
            const scope = nock('http://localhost', {
                reqheaders: {
                    'Content-Type': 'text/plain'
                }
            }).post('/products', 'my-new-product')
                .reply(200, {name: "my-new-product", quantity: 0, model: "New Model"});

            const response = await createProduct("my-new-product", "New Model");

            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual("my-new-product");
            expect(response.quantity).toEqual(0);
            expect(response.model).toEqual("New Model")
        });
    });

    describe('updateProductQuantity', () => {
        it('should make a POST request to update a product quantity', async () => {
            const scope = nock('http://localhost', {
                reqheaders: {
                    'Content-Type': 'text/plain'
                }
            }).post('/products/quantity/1')
                .reply(200, {id: 1, name: "my-new-product", quantity: 10});

            const response = await updateProductQuantity(1, 10);
            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual("my-new-product");
            expect(response.quantity).toEqual(10);
        })
    })

    describe('updateProductOrder', () => {
        it('should make a POST request to update a product order', async () => {
            const scope = nock('http://localhost', {
                reqheaders: {
                    'Content-Type': 'text/plain'
                }
            }).post('/products/order/1')
                .reply(200, {id: 1, name: "my-new-product", quantity: 10});

            const response = await updateProductOrder(1, 10);
            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual("my-new-product");
            expect(response.quantity).toEqual(10);
        })
    })

});