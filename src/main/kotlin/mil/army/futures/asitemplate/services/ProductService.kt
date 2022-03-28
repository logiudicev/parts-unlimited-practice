package mil.army.futures.asitemplate.services

import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.repositories.ProductRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.lang.Integer.parseInt

@Service
class ProductService(private val productRepository: ProductRepository) {
    fun addProduct(product: String, model: String?): Product {
        return productRepository.save(Product(name = product, quantity = 0, model = model))
    }

    fun getProducts(): List<Product> {
        return productRepository.findAll()
    }

    fun updateQuantity(id: Long, updatedQuantity: String): Product {
        val product = productRepository.findByIdOrNull(id) ?: error("no product existence")
        return productRepository.save(product.copy(quantity = updatedQuantity.toInt() + product.quantity))
    }

    fun updateOrder(id: Long, updateOrder: String): Product {
        val product = productRepository.findByIdOrNull(id) ?: error("no product existence")
        println(updateOrder)
        return productRepository.save(product.copy(quantity = product.quantity - updateOrder.toInt()))
    }
}