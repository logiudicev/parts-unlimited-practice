import React, {FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts, updateProductQuantity} from "./productsApiClient";
import {Box, Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {Product} from "./product";

const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<Product>()
    const [quantityInput, setQuantityInput] = useState<number>(0);

    const setProductNameFromInput = (event: FormEvent<HTMLInputElement>) => {
        setProductName(event.currentTarget.value);
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault();
        createProduct(productName).then(() => {
            getProducts().then(setProducts);
        });
    };

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product)
    };

    const addQuantityToSelectedProduct = async () => {
        const id = selectedProduct?.id

            const updatedProductQuantity = await updateProductQuantity(id, quantityInput);
            setProducts(products.map(product => {
                if (product.id === id && updatedProductQuantity !== undefined || null) {
                    return updatedProductQuantity;
                }
                return product;
            }))
    };

    return (
        <Container sx={{mx: 1, my: 1}}>
            <h1>Parts Unlimited Inventory</h1>
            <Box display='flex' flexDirection='row'>
                <Box>
                    <h2>Product</h2>
                    {products.map((product, index) => (
                        <div key={index}>{product.name}</div>
                    ))}
                    <form onSubmit={submitForm}>
                        <br/>
                        <label>
                            Product to add
                            <input name="product" type="text" onChange={setProductNameFromInput}/>
                        </label>
                        <button type="submit">Submit</button>
                    </form>

                    <Box sx={{minWidth: 120}}>
                        <Stack>
                            <InputLabel id="select-product">Select a Product</InputLabel>
                            <Select labelId="select-product" value={selectedProduct ? selectedProduct.name : products.at(0)?.name || ""}
                                    label="Select a Product"
                            >
                                {products.map((product, index) => (
                                    <MenuItem value={product.name} key={index}
                                              onClick={() => handleSelectProduct(product)}>{product.name}</MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </Box>

                    <Box>
                        <TextField type="number" value={quantityInput} label="Enter Product Quantity"
                                   sx={{marginTop: "10px"}}
                                   onChange={(quantity) => {
                                       if (!Number.isNaN(quantity.target.value)) {
                                           setQuantityInput(parseInt(quantity.target.value));
                                       }
                                   }}>
                        </TextField>
                        <Button variant="contained" color="success" sx={{height: "55px", marginTop: "10px"}}
                                onClick={addQuantityToSelectedProduct}>
                            Add Quantity
                        </Button>
                    </Box>

                </Box>

                <Box>
                    <h2>Quantity</h2>
                    {products.map((product, index) => (
                        <div key={index}>{product.quantity}</div>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default App;
