import React, {Dispatch, FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts, updateProductQuantity} from "./productsApiClient";
import {Box, Button, Container, TextField} from "@mui/material";
import {Product} from "./product";

const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const [setInput] = useState<string[]>(['']);
    const [input] = useState<string[]>(setInput);
    const [refreshCount, setRefreshCount] = useState<number>(0)




    const handleChange = (event: string, index: number) => {
        setUserInput(event);
        setInput[index] = event;
    }

    const handleOnClick = (id: number, quantity: string | undefined) => {
        updateProductQuantity(id, quantity);
        setRefreshCount(prevState => prevState + 1)

    }

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
        for (let i = 0; i < products.length; i++) {
            setInput.push(''[i]);
        }
    }, [refreshCount]);


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
                    {products.map((product, index) => <div key={index}>
                        <>
                            <TextField
                                size={"small"} sx={{height: '37px', textAlign: "center", lineHeight: "2.3"}}
                                label="input quantity"
                                onChange={(event) =>
                                    handleChange(event.target.value, index)
                                }
                                value={input.at(index)}
                            />

                            <Button variant='outlined' color='success' type='button' onClick={() => handleOnClick(product.id, input.at(index))}>
                                add quantity
                            </Button>
                        </>
                    </div>)}

                </Box>
            </Box>
        </Container>
    );
}

export default App;
