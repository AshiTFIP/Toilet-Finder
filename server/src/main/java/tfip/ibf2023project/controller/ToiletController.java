package tfip.ibf2023project.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import com.stripe.exception.StripeException;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletRequest;
import tfip.ibf2023project.model.Account;
import tfip.ibf2023project.model.Comment;
import tfip.ibf2023project.model.Login;
import tfip.ibf2023project.model.PaymentIntentDto;
import tfip.ibf2023project.model.Toilet;
import tfip.ibf2023project.services.LoginService;
import tfip.ibf2023project.services.StripeService;
import tfip.ibf2023project.services.ToiletService;

@Controller
//@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping
public class ToiletController {

    @Value("${stripePublishableKey}")
    private String stripePK;

    @Value("${googleMapsApiKey}")
    private String googleMapsKey;

    @Autowired
    LoginService loginSvc;

    @Autowired
    ToiletService tltSvc;

    @Autowired
    StripeService stripeSvc;

    @PostMapping(path = "/login")
    @ResponseBody
    public ResponseEntity<String> checkLogin(@RequestBody MultiValueMap<String, String> form){
        Login login = new Login();
        login.setUserId(form.getFirst("userId"));
        login.setPw(form.getFirst("pw"));
        Boolean result = loginSvc.checkLogin(login);
        String status = "";

        if(result){
            status = "ID found";
        }
        else {
            status = "ID not found, please create a new account";
        }

        JsonObject response = Json.createObjectBuilder()
            .add("status",status)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @PostMapping(path = "/verifydetails",consumes=MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public ResponseEntity<String> verifyDetails(@RequestBody MultiValueMap<String, String> form){
        Account account = new Account();
        account.setUserId(form.getFirst("userId"));
        account.setPw(form.getFirst("pw"));
        account.setEmail(form.getFirst("email"));
        String status = "";
        status = loginSvc.verifyDetails(account);
        JsonObject response = Json.createObjectBuilder()
            .add("status",status)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @PostMapping(path = "/createaccount",consumes=MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public ResponseEntity<String> createLogin(@RequestBody MultiValueMap<String, String> form){
        Account account = new Account();
        account.setUserId(form.getFirst("userId"));
        account.setPw(form.getFirst("pw"));
        account.setEmail(form.getFirst("email"));
        String status = "";
        status = loginSvc.createLogin(account);
        JsonObject response = Json.createObjectBuilder()
            .add("status",status)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @PostMapping(path = "/sendCode",consumes=MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public ResponseEntity<String> sendCode(@RequestBody MultiValueMap<String, String> form){
        String emailAdd = form.getFirst("emailAdd");
        String code = form.getFirst("code");
        String status = "";
        status = loginSvc.sendCode(emailAdd, code);
        JsonObject response = Json.createObjectBuilder()
            .add("status",status)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @PostMapping(path = "/addtoilet",consumes=MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public ResponseEntity<String> addToilet(@RequestBody MultiValueMap<String, String> form){
        Toilet toilet = new Toilet();
        toilet.setArea(form.getFirst("area")); 
        toilet.setLocation(form.getFirst("location"));
        toilet.setDirections(form.getFirst("directions"));
        toilet.setSubmittedBy(form.getFirst("submittedBy"));
        toilet.setCoordinates(form.getFirst("coordinates"));
        toilet.setVerification(form.getFirst("verification"));
        String status = "Added";
        Boolean toiletCheck = tltSvc.toiletCheck(toilet);
        if (toiletCheck){
            status = "Location already taken";
        }
        else{
            status = tltSvc.insertToilet(toilet);
        }
        
        JsonObject response = Json.createObjectBuilder()
            .add("status",status)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @PostMapping(path = "/addcomment",consumes=MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseBody
    public ResponseEntity<String> addComment(@RequestBody MultiValueMap<String, String> form){
        Comment comment = new Comment();
        String location = form.getFirst("location");
        comment.setRating(Integer.parseInt(form.getFirst("rating"))); 
        comment.setComments(form.getFirst("comments"));
        comment.setSubmittedBy(form.getFirst("submittedBy"));
        String status = "";
        status = tltSvc.insertComment(comment, location);
        JsonObject response = Json.createObjectBuilder()
            .add("status",status)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @GetMapping("/gettoiletlocations")
    @ResponseBody
    public ResponseEntity<String> getToiletLocations(){
        JsonObject locations = tltSvc.getToiletLocations();
            return ResponseEntity.ok(locations.toString());
    }

    @PostMapping("/gettoiletlocationandavgrating")
    @ResponseBody
    public ResponseEntity<String> getToiletLocationAndAvgRating(@RequestBody MultiValueMap<String, String> form){
        String coordinates = form.getFirst("coordinates");
        JsonObject toiletinfo = tltSvc.getToiletLocationAndAvgRating(coordinates);
            return ResponseEntity.ok((toiletinfo.toString()));
    }

    @GetMapping("/gettoiletinfo/{location}")
    @ResponseBody
    public ResponseEntity<String> getToiletInfo(@PathVariable String location){
        JsonObject toiletinfo = tltSvc.getToiletInfo(location);
            return ResponseEntity.ok((toiletinfo.toString()));
    }

    @GetMapping("/gettoiletsbyuserid")
    @ResponseBody
    public ResponseEntity<String> getToiletsByUserId(@RequestParam String userId){
        JsonObject toiletsSubmitted = tltSvc.getToiletsByUserId(userId);
        return ResponseEntity.ok(toiletsSubmitted.toString());
    }

    @DeleteMapping("/deletetoilet/{location}")
    public ResponseEntity<String> deleteToilet(@PathVariable String location){
        JsonObject deleteResult = tltSvc.deleteToilet(location);
        return ResponseEntity.ok(deleteResult.toString());
    }

    @GetMapping("/getjoke")
    public ResponseEntity<String> getJoke(){
        String uri = "https://official-joke-api.appspot.com/random_joke";
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/createpaymentintent")
    public ResponseEntity<PaymentIntentDto> createPaymentIntent() throws StripeException {
    PaymentIntentDto intent = stripeSvc.createPaymentIntent();
    return ResponseEntity.ok(intent);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(@RequestBody String payload, HttpServletRequest request) {
    String response = stripeSvc.webhook(payload, request);
    return  ResponseEntity.ok(response);
    }

    @GetMapping("/getstripepublishablekey")
    @ResponseBody
    public ResponseEntity<String> getStripePublishableKey(){
        JsonObject response = Json.createObjectBuilder()
            .add("key",stripePK)
            .build();

            return ResponseEntity.ok(response.toString());
    }

    @GetMapping("/getgooglemapsapikey")
    @ResponseBody
    public ResponseEntity<String> getGoogleMapsAPIKey(){
        JsonObject response = Json.createObjectBuilder()
            .add("key",googleMapsKey)
            .build();

            return ResponseEntity.ok(response.toString());
    }
}