import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {createProduct, getProducts} from "../productsApiClient";

jest.mock("../productsApiClient");

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;

const addProduct = (product: string) => {
  userEvent.type(screen.getByLabelText("Product to add"), product);
  userEvent.click(screen.getByRole("button", {name: /submit/i}));
}

describe("inventory", () => {
  describe("when I view the inventory", () => {
    it("should display the products", async () => {
      mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 0}]);

      render(<App/>);

      expect(screen.getByText("Parts Unlimited Inventory")).toBeInTheDocument();
      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(await screen.findByText("a product")).toBeInTheDocument();
    });

    it("should display the products' quantities", async () => {
      mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 0}]);

      render(<App/>);

      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(await screen.findByText("0")).toBeInTheDocument();
    });
  });

  describe("when I add a new product", () => {
    it("should display the new product", async () => {
      mockCreateProduct.mockResolvedValueOnce({id: 1, name: "shiny new product", quantity: 0});
      mockGetProducts.mockResolvedValueOnce([]);
      mockGetProducts.mockResolvedValueOnce([{id: 1, name: "shiny new product", quantity: 0}]);

      render(<App/>);
      addProduct("shiny new product");

      expect(mockCreateProduct).toHaveBeenCalledWith("shiny new product");
      expect(await screen.findByText("shiny new product")).toBeInTheDocument();
    });
  });

  describe("when I add quantity to an existing product", () => {
    it("should display the quantity after entering a number and clicking add quantity button", async () => {
      mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 0}]);

      render(<App/>);

      expect(await screen.findByLabelText('input quantity')).toBeInTheDocument();
      userEvent.type(screen.getByLabelText('input quantity'), '12');
      userEvent.click(screen.getByRole('button', { name: 'add quantity'}));

      waitFor(() => expect(screen.getByText('a product 12')).toBeVisible());
    })
  })
  describe("when I place an order for a product", () => {
    it('should display order information and decrease the quantity by the order total', async () => {
      mockGetProducts.mockResolvedValue([{id: 1, name: "a product", quantity: 90}]);

      render(<App/>);

      expect(await screen.findByLabelText('input order')).toBeInTheDocument();
      userEvent.type(screen.getByLabelText('input order'), '35');
      userEvent.click(screen.getByRole('button', { name: 'order'}));

      waitFor(() => expect(screen.getByText('a product 55')).toBeVisible());

      waitFor(() => expect(screen.getByRole("alert", { name: 'You will receive "a product" X 35.'})).toBeVisible());
    })
  })
});
