package com.oracle.service_management.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test class to verify JSON mapping for DTOs
 */
@SpringBootTest
public class JsonMappingTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testShoppingDtoJsonMapping() throws Exception {
        // Test JSON string that matches the user's request
        String jsonString = """
            {
              "passengerId": 6,
              "flightId": 3,
              "items": ["Magazine", "Perfume", "Headphones"],
              "deliveryInstructions": "Deliver to seat 12A"
            }
            """;

        // Deserialize JSON to ShoppingDto
        ShoppingDto shoppingDto = objectMapper.readValue(jsonString, ShoppingDto.class);

        // Verify all fields are correctly mapped
        assertNotNull(shoppingDto);
        assertEquals(6L, shoppingDto.getPassengerId());
        assertEquals(3L, shoppingDto.getFlightId());
        assertNotNull(shoppingDto.getItems());
        assertEquals(3, shoppingDto.getItems().size());
        assertTrue(shoppingDto.getItems().contains("Magazine"));
        assertTrue(shoppingDto.getItems().contains("Perfume"));
        assertTrue(shoppingDto.getItems().contains("Headphones"));
        assertEquals("Deliver to seat 12A", shoppingDto.getDeliveryInstructions());

        // Verify convenience methods work
        assertTrue(shoppingDto.hasItems());
        assertEquals(3, shoppingDto.getItemCount());
        assertTrue(shoppingDto.hasDeliveryInstructions());

        System.out.println("✅ ShoppingDto JSON mapping test PASSED");
        System.out.println("Mapped items: " + shoppingDto.getItems());
    }

    @Test
    public void testServiceRequestDtoJsonMapping() throws Exception {
        // Test JSON string that matches the user's request
        String jsonString = """
            {
              "passengerId": 6,
              "flightId": 3,
              "requestedServices": ["Meal", "Shopping"],
              "mealType": "Veg",
              "mealName": "Biryani",
              "shoppingItems": ["Magazine", "Perfume"],
              "serviceNotes": "Special dietary requirements"
            }
            """;

        // Deserialize JSON to ServiceRequestDto
        ServiceRequestDto serviceRequestDto = objectMapper.readValue(jsonString, ServiceRequestDto.class);

        // Verify all fields are correctly mapped
        assertNotNull(serviceRequestDto);
        assertEquals(6L, serviceRequestDto.getPassengerId());
        assertEquals(3L, serviceRequestDto.getFlightId());
        assertNotNull(serviceRequestDto.getRequestedServices());
        assertEquals(2, serviceRequestDto.getRequestedServices().size());
        assertTrue(serviceRequestDto.getRequestedServices().contains("Meal"));
        assertTrue(serviceRequestDto.getRequestedServices().contains("Shopping"));
        assertEquals("Veg", serviceRequestDto.getMealType());
        assertEquals("Biryani", serviceRequestDto.getMealName());
        assertNotNull(serviceRequestDto.getShoppingItems());
        assertEquals(2, serviceRequestDto.getShoppingItems().size());
        assertTrue(serviceRequestDto.getShoppingItems().contains("Magazine"));
        assertTrue(serviceRequestDto.getShoppingItems().contains("Perfume"));
        assertEquals("Special dietary requirements", serviceRequestDto.getServiceNotes());

        // Verify convenience methods work
        assertTrue(serviceRequestDto.hasMealService());
        assertTrue(serviceRequestDto.hasShoppingService());
        assertTrue(serviceRequestDto.hasMealDetails());
        assertTrue(serviceRequestDto.hasShoppingDetails());

        System.out.println("✅ ServiceRequestDto JSON mapping test PASSED");
        System.out.println("Mapped requested services: " + serviceRequestDto.getRequestedServices());
        System.out.println("Mapped shopping items: " + serviceRequestDto.getShoppingItems());
    }

    @Test
    public void testShoppingDtoSerialization() throws Exception {
        // Create ShoppingDto object
        ShoppingDto shoppingDto = new ShoppingDto();
        shoppingDto.setPassengerId(6L);
        shoppingDto.setFlightId(3L);
        shoppingDto.setItems(Arrays.asList("Magazine", "Perfume", "Headphones"));
        shoppingDto.setDeliveryInstructions("Deliver to seat 12A");

        // Serialize to JSON
        String jsonString = objectMapper.writeValueAsString(shoppingDto);

        // Verify JSON contains correct field names
        assertTrue(jsonString.contains("\"passengerId\":6"));
        assertTrue(jsonString.contains("\"flightId\":3"));
        assertTrue(jsonString.contains("\"items\":["));
        assertTrue(jsonString.contains("\"Magazine\""));
        assertTrue(jsonString.contains("\"Perfume\""));
        assertTrue(jsonString.contains("\"Headphones\""));
        assertTrue(jsonString.contains("\"deliveryInstructions\":\"Deliver to seat 12A\""));

        System.out.println("✅ ShoppingDto serialization test PASSED");
        System.out.println("Serialized JSON: " + jsonString);
    }

    @Test
    public void testServiceRequestDtoSerialization() throws Exception {
        // Create ServiceRequestDto object
        ServiceRequestDto serviceRequestDto = new ServiceRequestDto();
        serviceRequestDto.setPassengerId(6L);
        serviceRequestDto.setFlightId(3L);
        serviceRequestDto.setRequestedServices(Arrays.asList("Meal", "Shopping"));
        serviceRequestDto.setMealType("Veg");
        serviceRequestDto.setMealName("Biryani");
        serviceRequestDto.setShoppingItems(Arrays.asList("Magazine", "Perfume"));
        serviceRequestDto.setServiceNotes("Special dietary requirements");

        // Serialize to JSON
        String jsonString = objectMapper.writeValueAsString(serviceRequestDto);

        // Verify JSON contains correct field names
        assertTrue(jsonString.contains("\"passengerId\":6"));
        assertTrue(jsonString.contains("\"flightId\":3"));
        assertTrue(jsonString.contains("\"requestedServices\":["));
        assertTrue(jsonString.contains("\"Meal\""));
        assertTrue(jsonString.contains("\"Shopping\""));
        assertTrue(jsonString.contains("\"mealType\":\"Veg\""));
        assertTrue(jsonString.contains("\"mealName\":\"Biryani\""));
        assertTrue(jsonString.contains("\"shoppingItems\":["));
        assertTrue(jsonString.contains("\"Magazine\""));
        assertTrue(jsonString.contains("\"Perfume\""));
        assertTrue(jsonString.contains("\"serviceNotes\":\"Special dietary requirements\""));

        System.out.println("✅ ServiceRequestDto serialization test PASSED");
        System.out.println("Serialized JSON: " + jsonString);
    }
}
