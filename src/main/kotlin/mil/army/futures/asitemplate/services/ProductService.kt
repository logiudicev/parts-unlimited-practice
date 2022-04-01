package mil.army.futures.asitemplate.services

import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.repositories.ProductRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class ProductService(private val productRepository: ProductRepository) {
    fun addProduct(product: String): Product {
        return productRepository.save(Product(name = product, quantity = 0))
    }

    fun getProducts(): List<Product> {
        return productRepository.findAll()
    }

    fun updateProductQuantity(id: Long, updatedQuantity: String): Product {
        val product = productRepository.findByIdOrNull(id) ?: error("nothing found")
        return productRepository.save(product.copy(quantity = updatedQuantity.toInt() + product.quantity))
    }
}