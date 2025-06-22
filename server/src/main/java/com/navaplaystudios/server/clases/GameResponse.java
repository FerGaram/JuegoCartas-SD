package com.navaplaystudios.server.clases;

/**
 *
 * @author alber
 */
import java.util.*;

public class GameResponse {
    private boolean success;
    private String message;
    private Map<String, Object> data;
    
    public GameResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = new HashMap<>();
    }
    
    public GameResponse(boolean success, String message, Map<String, Object> data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Map<String, Object> getData() { return data; }
    
    public void addData(String key, Object value) {
        data.put(key, value);
    }
}