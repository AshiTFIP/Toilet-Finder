package tfip.ibf2023project.model;

public class PaymentIntentDto {
    private String clientSecret;

    public PaymentIntentDto(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }
    
}
