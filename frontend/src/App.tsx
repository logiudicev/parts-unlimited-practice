import React, {FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts} from "./productsApiClient";
import {Box, Container, TextField} from "@mui/material";
import {Product} from "./product";

const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [userInput, setUserInput] = useState<number>(0)

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

    return (
        <Container sx={{mx: 1, my: 1}}>
            <h1>Parts Unlimited Inventory</h1>
            <Box display='flex' flexDirection='row'>
                <Box>
                    <h2>Product</h2>
                    {products.map((product, index) => (
                        <div key={index}>
                            <>
                                <Box sx={{height: '37px', lineHeight: "2.3"}}>{product.name}</Box>
                            </>


                        </div>
                    ))}
                    <form onSubmit={submitForm}>
                        <br/>
                        <label>
                            Product to add
                            <input name="product" type="text" onChange={setProductNameFromInput}/>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </Box>
                <Box>
                    <h2>Quantity</h2>
                    {products.map((product, index) => (
                        <div key={index}>
                            <>
                                <Box sx={{height: '37px', textAlign: "center", lineHeight: "2.3"}}>
                                    {product.quantity}
                                </Box>
                            </>
                        </div>
                    ))}
                </Box>
                <Box sx={{marginLeft: '100px', height: '50px'}}>
                    <h2>Enter Quantity</h2>
                    {products.map((product, index) => (
                        <div key={index}>
                            <>
                                <TextField
                                    size={"small"} sx={{height: '37px', textAlign: "center", lineHeight: "2.3"}}
                                    label="input quantity"
                                    onClick={() => setUserInput(() => 0)}
                                    onChange={(event) => setUserInput(parseInt(event.target.value)
                                    )}
                                    value={userInput}
                                />
                            </>
                        </div>
                    ))}

                </Box>
            </Box>
        </Container>
    );
}

export default App;
