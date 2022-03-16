package mil.army.futures.asitemplate.services

import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.repositories.ProductRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.lang.Integer.parseInt

@Service
class ProductService(private val productRepository: ProductRepository) {
    fun addProduct(product: String): Product {
        return productRepository.save(Product(name = product, quantity = 0, model = "New Model"))
    }

    fun getProducts(): List<Product> {
        return productRepository.findAll()
    }

    fun updateProduct(id: Long, quantity: String): Product {
        val product = productRepository.findByIdOrNull(id) ?: error("no product existence")
        return productRepository.save(product.copy(quantity = parseInt(quantity)))
    }
}