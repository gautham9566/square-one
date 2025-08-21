package com.oracle.travel_history_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for travel history API responses
 */
public class TravelHistoryResponseDto {

    private boolean success;
    private String message;
    private int totalRecords;

    @JsonProperty("travelHistory")
    private List<TravelHistoryDto> travelHistoryList;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    // Metadata for pagination and filtering
    private String filterType; // "passenger", "booking", "flight"
    private String filterValue; // ID or reference value
    private String status; // filter by status if applied

    // Constructors
    public TravelHistoryResponseDto() {
        this.timestamp = LocalDateTime.now();
    }

    public TravelHistoryResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public TravelHistoryResponseDto(boolean success, String message, List<TravelHistoryDto> travelHistoryList) {
        this.success = success;
        this.message = message;
        this.travelHistoryList = travelHistoryList;
        this.totalRecords = travelHistoryList != null ? travelHistoryList.size() : 0;
        this.timestamp = LocalDateTime.now();
    }

    // Static factory methods
    public static TravelHistoryResponseDto success(String message, List<TravelHistoryDto> travelHistory) {
        return new TravelHistoryResponseDto(true, message, travelHistory);
    }

    public static TravelHistoryResponseDto success(String message, List<TravelHistoryDto> travelHistory, 
                                                  String filterType, String filterValue) {
        TravelHistoryResponseDto response = new TravelHistoryResponseDto(true, message, travelHistory);
        response.setFilterType(filterType);
        response.setFilterValue(filterValue);
        return response;
    }

    public static TravelHistoryResponseDto error(String message) {
        return new TravelHistoryResponseDto(false, message);
    }

    public static TravelHistoryResponseDto notFound(String message) {
        TravelHistoryResponseDto response = new TravelHistoryResponseDto(false, message);
        response.setTotalRecords(0);
        return response;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public List<TravelHistoryDto> getTravelHistoryList() {
        return travelHistoryList;
    }

    public void setTravelHistoryList(List<TravelHistoryDto> travelHistoryList) {
        this.travelHistoryList = travelHistoryList;
        this.totalRecords = travelHistoryList != null ? travelHistoryList.size() : 0;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getFilterType() {
        return filterType;
    }

    public void setFilterType(String filterType) {
        this.filterType = filterType;
    }

    public String getFilterValue() {
        return filterValue;
    }

    public void setFilterValue(String filterValue) {
        this.filterValue = filterValue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "TravelHistoryResponseDto{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", totalRecords=" + totalRecords +
                ", filterType='" + filterType + '\'' +
                ", filterValue='" + filterValue + '\'' +
                '}';
    }
}
