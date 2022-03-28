import axios from "axios";
import {Product} from "./product";

export async function createProduct(product: string, model: string): Promise<Product> {
    return (await axios.post<Product>(`/products/${model}`, product, {headers: {'Content-Type': 'text/plain'}})).data
}

export async function getProducts(): Promise<Product[]> {
    return (await axios.get<Product[]>("/products")).data
}

export async function updateProductQuantity(id: number, quantity: number | undefined): Promise<Product> {
    return (await axios.post<Product>(`/products/quantity/${id}`, quantity, {headers: {'Content-Type': 'text/plain'}})).data
}

export async function updateProductOrder(id: number, order: number | undefined): Promise<Product> {
    return (await axios.post<Product>(`/products/order/${id}`, order, {headers: {'Content-Type': 'text/plain'}})).data
}