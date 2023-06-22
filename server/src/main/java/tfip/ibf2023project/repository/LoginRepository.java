package tfip.ibf2023project.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import tfip.ibf2023project.model.Account;
import tfip.ibf2023project.model.Login;

@Repository
public class LoginRepository {

    @Autowired
    JdbcTemplate template;

    @Value("${mail.sender.email}")
    private String senderEmail;

    @Value("${mail.sender.password}")
    private String password;

    private final String CHECK_ID_SQL = "select * from logins where user_id = ?;";
    private final String CHECK_EMAIL_SQL = "select * from logins where email = ?;";
    private final String CREATE_ACCOUNT_SQL = "insert into logins (user_id, pw, email) values (? , ?, ?);";

    public Boolean checkLogin(Login login){
        try{
            Login result = template.queryForObject(CHECK_ID_SQL, BeanPropertyRowMapper.newInstance(Login.class), login.getUserId());
        if(result.getPw().equals(login.getPw())){
            return true;
        }
        else {
            return false;
        }
    }
    catch(EmptyResultDataAccessException e){
        return false;
    }
}

    public String verifyDetails(Account account){
        String userIdResult ="";
        String emailResult = "";
        String toReturn = "";

        try{
            Account result = template.queryForObject(CHECK_ID_SQL, BeanPropertyRowMapper.newInstance(Account.class), account.getUserId());
            if(result.getUserId().equals(account.getUserId())){
                userIdResult = "User ID already taken";
            }
    
            else{
                userIdResult = "User ID available";
            }
        }
        catch(EmptyResultDataAccessException e){
            userIdResult = "User ID available";
        }
    
        try{
            Account result = template.queryForObject(CHECK_EMAIL_SQL, BeanPropertyRowMapper.newInstance(Account.class), account.getEmail());
            if(result.getEmail().equals(account.getEmail())){
                emailResult = "Email already taken";
            }
    
            else{
                emailResult = "Email available";
            }
        }
        catch(EmptyResultDataAccessException e){
            emailResult = "Email available";
        }

        toReturn = userIdResult + " and "+emailResult;

        return toReturn;
    
    }

    public String createLogin(Account account){
        String userIdResult ="";
        String emailResult = "";
        String toReturn = "";

    try{
        Account result = template.queryForObject(CHECK_ID_SQL, BeanPropertyRowMapper.newInstance(Account.class), account.getUserId());
        if(result.getUserId().equals(account.getUserId())){
            userIdResult = "User ID already taken";
        }

        else{
            userIdResult = "User ID available";
        }
    }
    catch(EmptyResultDataAccessException e){
        userIdResult = "User ID available";
    }

    try{
        Account result = template.queryForObject(CHECK_EMAIL_SQL, BeanPropertyRowMapper.newInstance(Account.class), account.getEmail());
        if(result.getEmail().equals(account.getEmail())){
            emailResult = "Email already taken";
        }

        else{
            emailResult = "Email available";
        }
    }
    catch(EmptyResultDataAccessException e){
        emailResult = "Email available";
    }


    if(userIdResult.equals("User ID available")&&emailResult.equals("Email available")){
        Integer created = template.update(CREATE_ACCOUNT_SQL, account.getUserId(), account.getPw(), account.getEmail());
        if(created == 1){
            toReturn = "Account created successfully";
        }
        else{
            toReturn = "Unable to create account";
        }
    }

    else{
        toReturn = userIdResult +" and "+emailResult;
    }

    return toReturn;

    }

    public String sendCode(String emailAdd, String code){

        String recipientEmail = emailAdd;

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.port", "587");

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(senderEmail, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject("Verification Code");
            message.setText("Verification Code: "+code);
            Transport.send(message);

            return "Code sent successfully!";

        } catch (MessagingException e) {
            return "Failed to send email. Error: " + e.getMessage();
        }
    }

}

