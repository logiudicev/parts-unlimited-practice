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
        every { productService.addProduct("first-product-name", "1125") } returns Product(
            id = 1L,
            name = "first-product-name",
            model = "1125",
            quantity = 0
        )

        mockMvc.post("/products/1125") {
            contentType = MediaType.TEXT_PLAIN
            content = "first-product-name"
        }.andExpect {
            status { isOk() }
            content { string(containsString("first-product-name")) }
        }

        verify(exactly = 1) {
            productService.addProduct("first-product-name", "1125")
        }
    }

    @Test
    fun `should save a new product with model name when a new product is created`() {
        every { productService.addProduct("first-product-name", "1125") } returns Product(
            id = 1L,
            name = "first-product-name",
            model = "1125",
            quantity = 0
        )

        mockMvc.post("/products") {
            contentType = MediaType.TEXT_PLAIN
            content = "first-product-name"
        }.andExpect {
            status { isOk() }
            content { string(containsString("first-product-name")) }
        }

        verify(exactly = 1) {
            productService.addProduct("first-product-name", "1125")
        }
    }

    @Test
    fun `should update product quantity of an existing product`() {
        every { productService.updateProductQuantity(1L, "25") } returns Product(
            id = 1L,
            name = "first-product-name",
            quantity = 25,
        )

        mockMvc.post("/products/updatequantity/1") {
            contentType = MediaType.TEXT_PLAIN
            content = "25"
        }.andExpect {
            status { isOk() }
            content { string(containsString("25")) }
        }
        verify(exactly = 1) {
            productService.updateProductQuantity(1L, "25")
        }
    }

    @Test
    fun `should reduce a product quantity of an existing product when ordered`() {
        every { productService.updateProductOrderAmount(1L, "25") } returns Product(
            id = 1L,
            name = "first-product-name",
            quantity = 25,
        )

        mockMvc.post("/products/orderfulfillment/1") {
            contentType = MediaType.TEXT_PLAIN
            content = "25"
        }.andExpect {
            status { isOk() }
            content { string(containsString("25")) }
        }
        verify(exactly = 1) {
            productService.updateProductOrderAmount(1L, "25")
        }
    }

    @Test
    fun `should retrieve all products when getting products`() {
        every { productService.getProducts() } returns listOf(
            Product(id = 1L, name = "first-product-name", quantity = 0),
            Product(id = 2L, name = "second-product-name", quantity = 0)
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


