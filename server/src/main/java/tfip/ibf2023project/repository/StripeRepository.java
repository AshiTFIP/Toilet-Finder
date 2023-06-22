package tfip.ibf2023project.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.core.env.Environment;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import tfip.ibf2023project.model.PaymentIntentDto;

@Repository
public class StripeRepository {

   @Value("${webhook}")
    private String webhook;

   @Autowired
    private Environment env;

    @PostConstruct
    public void init() {
      Stripe.apiKey = env.getProperty("stripeApiKey").trim();
    }

  public PaymentIntentDto createPaymentIntent() throws StripeException {
    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setCurrency("sgd")
            .setAmount(500L)
            .build();

    PaymentIntent intent = PaymentIntent.create(params);
    return new PaymentIntentDto(intent.getClientSecret());
}

  public String webhook(String payload, HttpServletRequest request) {
    String sigHeader = request.getHeader("Stripe-Signature");
    Event event = null;

    try {
      event = Webhook.constructEvent(
        payload, sigHeader, webhook.trim()
      );
    } catch (SignatureVerificationException e) {
      return "SignatureVerificationException";
    }

    if (event.getType().equals("payment_intent.succeeded")) {
      EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
      if (dataObjectDeserializer.getObject().isPresent()) {
        PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
        return "Payment succeeded for intent ID " + paymentIntent.getId();
      }
      return "Payment succeeded ";
      
    } else if (event.getType().equals("payment_intent.payment_failed")) {
      EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
      if (dataObjectDeserializer.getObject().isPresent()) {
        PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
        return "Payment failed for intent ID " + paymentIntent.getId();
      }
      return "Payment failed for intent ID ";
    }
     else return "No status on payment intent";
  }
}
