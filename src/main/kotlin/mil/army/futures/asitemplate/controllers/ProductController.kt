package mil.army.futures.asitemplate.controllers

import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.services.ProductService
import org.springframework.web.bind.annotation.*

@RestController
class ProductController(private val productService: ProductService) {

    @GetMapping("/products")
    fun getProducts(): List<Product> {
        return productService.getProducts()
    }

    @PostMapping("/products/{model}")
    fun addProduct(@RequestBody product: String, @PathVariable model: String): Product {
        return productService.addProduct(product, model)
    }

    @PostMapping("/products/updatequantity/{id}")
    fun updateProductQuantity(@PathVariable id: Long, @RequestBody quantity: String): Product {
        return productService.updateProductQuantity(id, quantity)
    }

    @PostMapping("/products/orderfulfillment/{id}")
    fun updateProductOrderAmount(@PathVariable id: Long, @RequestBody orderAmount: String): Product {
        return productService.updateProductOrderAmount(id, orderAmount)
    }

    @GetMapping("/hi")
    fun sayHi(): String {
        return "hi"
    }
}

