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
        val expectedProducts = listOf(Product(1L, "first-product", 0), Product(2L, "second-product", 0))
        every { productRepository.findAll() } returns expectedProducts

        val actualProducts: List<Product> = productService.getProducts()

        assertThat(actualProducts).isEqualTo(expectedProducts)
    }

    @Test
    fun `should create a new product`() {
        every { productRepository.save(any()) } answers { firstArg() }
        val productName = "first-product"
        val productToSave = Product(name = productName, quantity = 0)

        productService.addProduct(productName)

        verify { productRepository.save(productToSave) }
    }

    @Test
    fun `should update a product quantity given a quantity`() {
        every { productRepository.findByIdOrNull(1) } returns Product(1, "first-product", 20)
        every { productRepository.save(any()) } answers { firstArg() }

        productService.updateProductQuantity(1, "20")

        verify { productRepository.save(Product(1, "first-product", 40)) }
    }
}
