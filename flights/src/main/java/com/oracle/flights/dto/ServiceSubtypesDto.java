package com.oracle.flights.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

/**
 * DTO for service subtypes JSON structure
 */
public class ServiceSubtypesDto {
    
    @JsonProperty("Ancillary")
    private List<String> ancillary;
    
    @JsonProperty("Meal")
    private List<String> meal;
    
    @JsonProperty("Shopping")
    private List<String> shopping;
    
    public ServiceSubtypesDto() {}
    
    public ServiceSubtypesDto(List<String> ancillary, List<String> meal, List<String> shopping) {
        this.ancillary = ancillary;
        this.meal = meal;
        this.shopping = shopping;
    }
    
    public List<String> getAncillary() {
        return ancillary;
    }
    
    public void setAncillary(List<String> ancillary) {
        this.ancillary = ancillary;
    }
    
    public List<String> getMeal() {
        return meal;
    }
    
    public void setMeal(List<String> meal) {
        this.meal = meal;
    }
    
    public List<String> getShopping() {
        return shopping;
    }
    
    public void setShopping(List<String> shopping) {
        this.shopping = shopping;
    }
    
    @Override
    public String toString() {
        return "ServiceSubtypesDto{" +
                "ancillary=" + ancillary +
                ", meal=" + meal +
                ", shopping=" + shopping +
                '}';
    }
}
