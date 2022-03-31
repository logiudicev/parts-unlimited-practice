import React, {FormEvent, useEffect, useMemo, useState} from "react";
import {createProduct, getProducts, updateProductOrder, updateProductQuantity} from "./productsApiClient";
import {
    Box,
    Button,
    Grid,
    IconButton, InputBase,
    Snackbar,
    Stack,
    Table, TableCell,
    TableContainer, TableHead, TableRow,
    TextField
} from "@mui/material";
import {Product} from "./product";


const App = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState<string>("");
    const [productModel, setProductModel] = useState<string>("New Model");
    const [inputQuantity, setInputQuantity] = useState<number>(0);
    const [inputOrder, setInputOrder] = useState<number>(0);
    const [orderHelperText, setOrderHelperText] = useState<string>("");
    const [orderHelperTextContinued, setOrderHelperTextContinued] = useState<string>("");
    const [showHelperText, setShowHelperText] = useState<boolean>(false);
    const [refreshCount, setRefreshCount] = useState<number>(0);


    const [filterCriteria, setFilterCriteria] = useState<string>("");

    const filterProducts = useMemo(() => filterCriteria.length ? products.filter(product => product.model === filterCriteria) : products, [filterCriteria, products])

    const matchingModels: Product[] = [];

    const setUpdateQuantityFromInput = (event: string) => {
        setInputQuantity(parseInt(event));
    };

    const handleAddQuantityOnClick = async (id: number) => {
        const updatedProduct = await updateProductQuantity(id, inputQuantity);
        setProducts(products.map(product => {
            if(product.id === id){
                return updatedProduct;
            }
            return product;
        }))
        setRefreshCount(prevState => prevState + 1);

    }

    const handleChangeOrder = (event: string) => {
        setInputOrder(parseInt(event))
    }

    const handleOrderFulfillOnClick = (product: Product) => {
        const orderTotal: number | undefined = inputOrder
        if (orderTotal) {
            // helperText(product, orderTotal)
            updateProductOrder(product.id, helperText(product, orderTotal));
            setRefreshCount(prevState => prevState + 1);
        }
        setInputOrder(0);
    };

    const helperText = (product: Product, orderTotal: number | undefined): number | undefined => {

        let inStockOrderTotal = 0;
        let outOfStockOrderTotal = 0;
        if (orderTotal) {
            if (product.quantity >= orderTotal) {
                inStockOrderTotal = orderTotal;
                setOrderHelperText("You will receive " + '"' + product.name + '"' + " X " + inStockOrderTotal + ".")
                setOrderHelperTextContinued("")
            } else {
                inStockOrderTotal = product.quantity;
                outOfStockOrderTotal = orderTotal - product.quantity;

                setOrderHelperText("You will receive " + '"' + product.name + '"' + " X " + inStockOrderTotal + ".")
                setOrderHelperTextContinued(" Note that your order was NOT completely fulfilled. Your delivery will be short " + outOfStockOrderTotal + " items.")
            }
        }
        setShowHelperText(true);
        console.log(inStockOrderTotal)
        return (
            inStockOrderTotal
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
    }, []);

    const handleClose = () => {
        setShowHelperText(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small">
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
        <>
            <h1>Parts Unlimited Inventory</h1>


            <TextField onChange={(e) => {
                setFilterCriteria(e.target.value)
            }} aria-label="search by model" label="Search by Model"></TextField>

            <TableContainer sx={{mx: 1, my: 1}}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <h2>Product</h2>
                                {filterProducts.map((product, index) => (
                                    <Box key={index}
                                         sx={{height: '37px', lineHeight: "2.3"}}>{product.name}
                                    </Box>
                                ))}
                            </TableCell>

                            <TableCell>
                                <h2>Model</h2>
                                {filterProducts.map((product, index) => (
                                    <Box key={index}
                                         sx={{height: '37px', lineHeight: "2.3"}}>{product.model}</Box>
                                ))}
                            </TableCell>

                            <TableCell>
                                <h2>Quantity</h2>
                                {filterProducts.map((product, index) => (
                                    <Box key={index}
                                         sx={{height: '37px', textAlign: "center", lineHeight: "2.3"}}
                                         aria-label={product.name + " " + product.quantity}>
                                        {product.quantity}
                                    </Box>
                                ))}
                            </TableCell>
                            <TableCell>
                                <h2>Enter Quantity</h2>
                                {filterProducts.map((product, index) =>
                                    <Box key={index}>
                                        <TextField
                                            type='number'
                                            size={"small"} sx={{height: '37px', textAlign: "left", lineHeight: "2.3"}}
                                            label="input quantity"
                                            onChange={(e) => setUpdateQuantityFromInput(e.target.value)}
                                        />

                                        <Button variant='outlined' color='success' type='button'
                                                onClick={() => handleAddQuantityOnClick(product.id)}>
                                            add quantity
                                        </Button>
                                    </Box>
                                )}
                            </TableCell>

                            <TableCell>
                                <h2>Enter Order</h2>
                                {filterProducts.map((product, index) =>
                                    <Box key={index}>
                                        <TextField
                                            size={"small"} sx={{height: '37px', textAlign: "left", lineHeight: "2.3"}}
                                            label='input order'
                                            onChange={(event) => handleChangeOrder(event.target.value)}
                                        />

                                        <Button variant='outlined' color='success' type='button'
                                                onClick={() => handleOrderFulfillOnClick(product)}>
                                            order
                                        </Button>
                                        <Snackbar message={orderHelperText + orderHelperTextContinued}
                                                  open={showHelperText}
                                                  autoHideDuration={6000}
                                                  onClose={handleClose}
                                                  action={action}
                                        />
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            <form onSubmit={submitForm}>
                <br/>
                <Stack marginRight='80px'>
                    <Grid item>Product to add</Grid>
                    <input aria-label="product-to-add" name="product" type="text"
                           onChange={setProductNameFromInput}/>
                </Stack>
                <br/>
                <Stack marginRight='80px'>
                    <Grid item>Model</Grid>
                    <input aria-label="model-to-add" name="model" type="text"
                           onChange={setProductModelFromInput}/>
                </Stack>
                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export default App;
