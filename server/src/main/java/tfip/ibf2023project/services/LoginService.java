package tfip.ibf2023project.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tfip.ibf2023project.model.Account;
import tfip.ibf2023project.model.Login;
import tfip.ibf2023project.repository.LoginRepository;

@Service
public class LoginService {
    
    @Autowired
    LoginRepository loginRepo;

    public Boolean checkLogin(Login login){
        return loginRepo.checkLogin(login);
    }

    public String createLogin(Account account){
        return loginRepo.createLogin(account);
    }

    public String verifyDetails(Account account){
        return loginRepo.verifyDetails(account);
    }
    
    public String sendCode(String emailAdd, String code){
        return loginRepo.sendCode(emailAdd, code);
    }

    
}
