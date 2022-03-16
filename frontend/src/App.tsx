import React, {Dispatch, FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts, updateProductQuantity} from "./productsApiClient";
import {Box, Button, Container, Grid, IconButton, Snackbar, Stack, TextField} from "@mui/material";
import {Product} from "./product";


const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [productModel, setProductModel] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");

    const [setInputQuantity] = useState<string[]>(['']);
    const [inputQuantity] = useState<string[]>(setInputQuantity);

    const [setInputOrder] = useState<string[]>(['']);
    const [inputOrder] = useState<string[]>(setInputOrder);

    const [refreshCount, setRefreshCount] = useState<number>(0)

    const [orderHelperText, setOrderHelperText] = useState<string>("")
    const [orderHelperTextContinued, setOrderHelperTextContinued] = useState<string>("")

    const [showHelperText, setShowHelperText] = useState<boolean>(false)

    const handleChangeQuantity = (event: string, index: number) => {
        setUserInput(event);
        setInputQuantity[index] = event;
    }

    const handleAddQuantityOnClick = (id: number, index: number) => {
        const quantity = inputQuantity.at(index);
        updateProductQuantity(id, quantity);
        //clear inputQuantity
        setInputQuantity[index] = '0'

        //Refresh State of Products
        setRefreshCount(prevState => prevState + 1)
    }

    const handleChangeOrder = (event: string, index: number) => {
        setUserInput(event);
        setInputOrder[index] = event
    }

    const handleOrderFulfillOnClick = (product: Product, index: number) => {
        const orderTotal: string | undefined = inputOrder.at(index)
        if (orderTotal) {
            helperText(product, orderTotal)
            updateProductQuantity(product.id, helperText(product, orderTotal))
            setRefreshCount(prevState => prevState + 1)
        }
        setInputOrder[index] = "0"
        setRefreshCount(prevState => prevState + 1)
    };

    const helperText = (product: Product, orderTotal: string | undefined): string | undefined => {

        let inStockOrderTotal = 0;
        let outOfStockOrderTotal = 0;
        let newQuantity = 0
        if (orderTotal) {
            if (product.quantity >= parseInt(orderTotal)) {
                inStockOrderTotal = parseInt(orderTotal);
                setOrderHelperText("You will receive " + '"' + product.name + '"' + " X " + inStockOrderTotal + ".")
                setOrderHelperTextContinued("")
            } else {
                inStockOrderTotal = product.quantity;
                outOfStockOrderTotal = parseInt(orderTotal) - product.quantity;

                setOrderHelperText("You will receive " + '"' + product.name + '"' + " X " + inStockOrderTotal + ".")
                setOrderHelperTextContinued(" Note that your order was NOT completely fulfilled. Your delivery will be short " + outOfStockOrderTotal + " items.")
            }
        }
        setShowHelperText(true);
        newQuantity = product.quantity - inStockOrderTotal
        return (
            newQuantity.toString()
        )
    }

    const setProductNameFromInput = (event: FormEvent<HTMLInputElement>) => {
        setProductName(event.currentTarget.value);
    };
    const setProductModelFromInput = (event: FormEvent<HTMLInputElement>) => {
        setProductModel(event.currentTarget.value);
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault();
        createProduct(productName, productModel).then(() => {
            getProducts().then(setProducts);
        });
    };

    useEffect(() => {
        getProducts().then(setProducts);
        for (let i = 0; i < products.length; i++) {
            setInputQuantity.push(''[i]);
        }
    }, [refreshCount]);

    const handleClose = () => {
        setShowHelperText(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" >
                Got it
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >

            </IconButton>
        </React.Fragment>
    );

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
                        <Stack marginRight='80px'>
                           <Grid item>Product to add</Grid>
                            <input aria-label="product-to-add" name="product" type="text" onChange={setProductNameFromInput}/>
                        </Stack>
                        <br/>
                        <Stack marginRight='80px'>
                           <Grid item>Model</Grid>
                            <input aria-label="model-to-add" name="model" type="text" onChange={setProductModelFromInput}/>
                        </Stack>
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
                                value={inputOrder.at(index)}
                            />

                            <Button variant='outlined' color='success' type='button'
                                    onClick={() => handleOrderFulfillOnClick(product, index)}>
                                order
                            </Button>
                            <Snackbar message={orderHelperText + orderHelperTextContinued}
                                      open={showHelperText}
                                      autoHideDuration={6000}
                                      onClose={handleClose}
                                      action={action}
                            />
                        </>
                    </div>)}
                </Box>
            </Box>
        </Container>
    );
}

export default App;
