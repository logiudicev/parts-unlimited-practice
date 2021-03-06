package mil.army.futures.asitemplate.services

import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.repositories.ProductRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.data.repository.findByIdOrNull

@ExtendWith(MockKExtension::class)
internal class ProductServiceTest {
    @MockK
    lateinit var productRepository: ProductRepository

    @InjectMockKs
    lateinit var productService: ProductService

    @Test
    fun `should retrieve all products`() {
        val expectedProducts = listOf(Product(1L, "first-product", 0, "New Model"), Product(2L, "second-product", 0, model = "New Model"))
        every { productRepository.findAll() } returns expectedProducts

        val actualProducts: List<Product> = productService.getProducts()

        assertThat(actualProducts).isEqualTo(expectedProducts)
    }

    @Test
    fun `should create a new product`() {
        every { productRepository.save(any()) } answers { firstArg() }
        val productName = "first-product"
        val productModel = "New Model"
        val productToSave = Product(name = productName, quantity = 0, model = "New Model")

        productService.addProduct(productName, productModel)

        verify { productRepository.save(productToSave) }
    }

    @Test
    fun `should update quantity`() {
        every { productRepository.findByIdOrNull(1) } returns Product(1, "my-first-product", 0,"New Model")
        every { productRepository.save(any()) } answers { firstArg() }

        val id = 1L
        val productName = "my-first-product"
        val productToSave = Product(id = 1L, name = productName, quantity = 10, model = "New Model")

        productService.updateQuantity(id, "10")

        verify { productRepository.save(productToSave) }
    }
}
