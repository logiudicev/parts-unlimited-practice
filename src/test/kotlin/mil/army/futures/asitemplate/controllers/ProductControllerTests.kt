package mil.army.futures.asitemplate.controllers

import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import mil.army.futures.asitemplate.Product
import mil.army.futures.asitemplate.services.ProductService
import org.hamcrest.CoreMatchers.containsString
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.ComponentScan
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@WebMvcTest(ProductController::class)
@ComponentScan("mil.army.futures.asitemplate.controllers")
internal class ProductControllerTests {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockkBean
    private lateinit var productService: ProductService

    @Test
    fun `should save a new product when a new product is created`() {
        every { productService.addProduct("first-product-name") } returns Product(
            id = 1L,
            name = "first-product-name",
            quantity = 0,
            model = "New Model"
        )

        mockMvc.post("/products") {
            contentType = MediaType.TEXT_PLAIN
            content = "first-product-name"
        }.andExpect {
            status { isOk() }
            content { string(containsString("first-product-name")) }
        }

        verify(exactly = 1) {
            productService.addProduct("first-product-name")
        }
    }
    @Test
    fun `should update quantity of a product`() {
        every { productService.updateProduct(1,"10") } returns Product(
            id = 1L,
            name = "first-product-name",
            quantity = 10,
            model = "New Model"
        )
        mockMvc.post("/products/1") {
            contentType = MediaType.TEXT_PLAIN
            content = "10"
        }.andExpect {
            status { isOk() }
            content { string(containsString("10")) }
        }

        verify(exactly = 1) {
            productService.updateProduct(1,"10")
        }

    }

    @Test
    fun `should retrieve all products when getting products`() {
        every { productService.getProducts() } returns listOf(
            Product(id = 1L, name = "first-product-name", quantity = 0, model = "New Model"),
            Product(id = 2L, name = "second-product-name", quantity = 0, model = "New Model")
        )

        mockMvc.get("/products").andExpect {
            status { isOk() }
            content { string(containsString("first-product-name")) }
            content { string(containsString("second-product-name")) }
        }

        verify(exactly = 1) { productService.getProducts() }
    }

    @Test
    fun `should say hi`() {

        mockMvc.get("/hi").andExpect {
            status { isOk() }
            content { string(containsString("hi")) }
        }

    }

}
