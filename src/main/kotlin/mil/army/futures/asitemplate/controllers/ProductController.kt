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

    @PostMapping("/products")
    fun addProduct(@RequestBody product: String): Product {
        return productService.addProduct(product)
    }

    @PostMapping("/products/{id}")
    fun updateProductQuantity(@PathVariable id: Long, @RequestBody quantity: String): Product {
        return productService.updateProduct(id, quantity)
    }

    @GetMapping("/hi")
    fun sayHi(): String {
        return "hi"
    }
}

