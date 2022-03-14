import React, {Dispatch, FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts, updateProductQuantity} from "./productsApiClient";
import {Box, Button, Container, TextField} from "@mui/material";
import {Product} from "./product";

const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");

    const [setInputQuantity] = useState<string[]>(['']);
    const [inputQuantity] = useState<string[]>(setInputQuantity);

    const [setInputOrder] = useState<string[]>(['']);
    const [inputOrder] = useState<string[]>(setInputOrder);

    const [refreshCount, setRefreshCount] = useState<number>(0)


    const handleChangeQuantity = (event: string, index: number) => {
        setUserInput(event);
        setInputQuantity[index] = event;
    }

    const handleAddQuantityOnClick = (id: number, index: number) => {
        const quantity = inputQuantity.at(index);
        updateProductQuantity(id, quantity);
        //clear inputQuantity
        setInputQuantity[index] = ''

        //Refresh State of Products
        setRefreshCount(prevState => prevState + 1)
    }

    const handleChangeOrder = (event: string, index: number) => {
        setUserInput(event);
        setInputOrder[index] = event
    }

    const handleOrderFulfillOnClick = (id: number, index: number, currentQuantity: number) => {
        const orderTotal: string | undefined= inputOrder.at(index)
        if(orderTotal) {
            const quantity = currentQuantity - parseInt(orderTotal)
            updateProductQuantity(id, quantity.toString())
            setRefreshCount(prevState => prevState + 1)
        }
    };

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
            setInputQuantity.push(''[i]);
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
                                <Box sx={{height: '37px', textAlign: "center", lineHeight: "2.3"}}
                                     aria-label={product.name + " " + product.quantity}>
                                    {product.quantity}
                                </Box>
                            </>
                        </div>
                    ))}
                </Box>
                <Box sx={{marginLeft: '60px', height: '50px'}}>
                    <h2>Enter Quantity</h2>
                    {products.map((product, index) => <div key={index}>
                        <>
                            <TextField
                                size={"small"} sx={{height: '37px', textAlign: "left", lineHeight: "2.3"}}
                                label="input quantity"
                                onChange={(event) =>
                                    handleChangeQuantity(event.target.value, index)
                                }
                                value={inputQuantity.at(index)}
                            />

                            <Button variant='outlined' color='success' type='button'
                                    onClick={() => handleAddQuantityOnClick(product.id, index)}>
                                add quantity
                            </Button>
                        </>
                    </div>)}
                </Box>

                <Box sx={{marginLeft: '50px', height: '50px'}}>
                    <h2>Enter Order</h2>
                    {products.map((product, index) => <div key={index}>
                        <>
                        <TextField
                            size={"small"} sx={{height: '37px', textAlign: "left", lineHeight: "2.3"}}
                            label='input order'
                            onChange={(event) => handleChangeOrder(event.target.value, index)}
                        />

                        <Button variant='outlined' color='success' type='button' onClick={() => handleOrderFulfillOnClick(product.id, index, product.quantity)}>
                            order
                        </Button>
                        </>
                    </div>)}
                </Box>
            </Box>
        </Container>
    );
}

export default App;
