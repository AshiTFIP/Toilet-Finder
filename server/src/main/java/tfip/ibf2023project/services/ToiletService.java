package tfip.ibf2023project.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.json.JsonObject;
import tfip.ibf2023project.model.Comment;
import tfip.ibf2023project.model.Toilet;
import tfip.ibf2023project.repository.ToiletRepository;

@Service
public class ToiletService {

    @Autowired
    ToiletRepository tltRepo;

    public Boolean toiletCheck(Toilet toilet){
        return tltRepo.toiletCheck(toilet);
    }

    public String insertToilet(Toilet toilet){
        return tltRepo.insertToilet(toilet);
    }

    public String insertComment(Comment comment, String location){
        return tltRepo.insertComment(comment, location);
    }

    public JsonObject getToiletLocations(){
        return tltRepo.getToiletLocations();
    }

     public JsonObject getToiletLocationAndAvgRating(String coords){
        return tltRepo.getToiletLocationAndAvgRating(coords);
     }

     public JsonObject getToiletInfo(String location){
        return tltRepo.getToiletInfo(location);
     }

     public JsonObject getToiletsByUserId(String userId){
        return tltRepo.getToiletsByUserId(userId);
     }

     public JsonObject deleteToilet(String location){
        return tltRepo.deleteToilet(location);
     }
    
}
