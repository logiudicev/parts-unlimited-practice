import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {createProduct, getProducts} from "../productsApiClient";

jest.mock("../productsApiClient");

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;

const addProduct = (product: string, model: string) => {
    userEvent.type(screen.getByLabelText("product-to-add"), product);
    userEvent.type(screen.getByLabelText("model-to-add"), model);

    userEvent.click(screen.getByRole("button", {name: /submit/i}));
}

describe("inventory", () => {
    describe("when I view the inventory", () => {
        it("should display the products", async () => {
            mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 0, model: "New Model"}]);

            render(<App/>);

            expect(screen.getByText("Parts Unlimited Inventory")).toBeInTheDocument();
            expect(screen.getByText("Product")).toBeInTheDocument();
            expect(await screen.findByText("a product")).toBeInTheDocument();
        });

        it("should display the products' quantities", async () => {
            mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 0, model: "New Model"}]);

            render(<App/>);

            expect(screen.getByText("Quantity")).toBeInTheDocument();
            expect(await screen.findByText("0")).toBeInTheDocument();
        });
    });

    describe("when I add a new product", () => {
        it("should display the new product", async () => {
            mockCreateProduct.mockResolvedValueOnce({
                id: 1,
                name: "shiny new product",
                quantity: 0,
                model: "New Model"
            });
            mockGetProducts.mockResolvedValueOnce([]);
            mockGetProducts.mockResolvedValueOnce([{
                id: 1,
                name: "shiny new product",
                quantity: 0,
                model: "New Model"
            }]);

            render(<App/>);
            addProduct("shiny new product", "New Model");

            expect(mockCreateProduct).toHaveBeenCalledWith("shiny new product", "New Model");
            expect(await screen.findByText("shiny new product")).toBeInTheDocument();
            expect(await screen.findByText("New Model")).toBeInTheDocument();

        });
    });

    describe("when I add quantity to an existing product", () => {
        it("should display the quantity after entering a number and clicking add quantity button", async () => {
            mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 0, model: "New Model"}]);

            render(<App/>);

            expect(await screen.findByLabelText('input quantity')).toBeInTheDocument();
            userEvent.type(screen.getByLabelText('input quantity'), '12');
            userEvent.click(screen.getByRole('button', {name: 'add quantity'}));

            waitFor(() => expect(screen.getByText('a product 12')).toBeVisible());
        })
    })
    describe("when I place an order for a product", () => {
        it('should display order information and decrease the quantity by the order total', async () => {
            mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 90, model: "New Model"}]);

            render(<App/>);

            expect(await screen.findByLabelText('input order')).toBeInTheDocument();
            userEvent.type(screen.getByLabelText('input order'), '35');
            userEvent.click(screen.getByRole('button', {name: 'order'}));

            waitFor(() => expect(screen.getByText('a product 55')).toBeVisible());

            waitFor(() => expect(screen.getByRole("alert", {name: 'You will receive "a product" X 35.'})).toBeVisible());
        })
    })
    describe('when I search for a product', () => {
        it('should narrow list of products when search text matches their model', async () => {
            mockGetProducts.mockResolvedValue([
              {id: 1, name: "Ryzen-7", quantity: 90, model: "2700X"},
              {id: 2, name: "Ryzen-7", quantity: 90, model: "2700"},
              {id: 3, name: "Ryzen-7", quantity: 90, model: "3700X"}]);

            render(<App/>);

            expect(await screen.findByLabelText('search by model')).toBeVisible();

            userEvent.type(screen.getByLabelText('search by model'), '2700X');

            waitFor(() => {
                expect(screen.queryByText('2700')).not.toBeInTheDocument();
                expect(screen.queryByText('3700X')).not.toBeInTheDocument();
                expect(screen.queryByText('2700X')).toBeInTheDocument();
            })
        })
    })
});
