package tfip.ibf2023project.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import com.stripe.exception.StripeException;
import jakarta.servlet.http.HttpServletRequest;
import tfip.ibf2023project.model.PaymentIntentDto;
import tfip.ibf2023project.repository.StripeRepository;

@Service
public class StripeService {

    @Autowired
    StripeRepository stripeRepo;
    
      public PaymentIntentDto createPaymentIntent() throws StripeException {
         return stripeRepo.createPaymentIntent();
      }

     public String webhook(@RequestBody String payload, HttpServletRequest request) {
        return stripeRepo.webhook(payload, request);
     }
}
