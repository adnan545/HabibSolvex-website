package habib.solvex.pvt.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class EmailResponse {
    private boolean success;
    private String message;
    private String timestamp;

    public EmailResponse() {}

    public EmailResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}