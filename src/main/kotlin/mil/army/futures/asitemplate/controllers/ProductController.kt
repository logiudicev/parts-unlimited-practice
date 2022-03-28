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
    fun addProduct(@RequestBody product: String, @PathVariable model: String?): Product {
        return productService.addProduct(product, model)
    }

    @PostMapping("/products/quantity/{id}")
    fun updateProductQuantity(@PathVariable id: Long, @RequestBody quantity: String): Product {
        return productService.updateQuantity(id, quantity)
    }

    @PostMapping("/products/order/{id}")
    fun updateProductOrder(@PathVariable id: Long, @RequestBody order: String): Product {
        return productService.updateOrder(id, order)
    }

    @GetMapping("/hi")
    fun sayHi(): String {
        return "hi"
    }
}

