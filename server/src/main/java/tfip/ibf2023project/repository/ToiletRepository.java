package tfip.ibf2023project.repository;
import java.io.StringReader;
import java.util.Arrays;
import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import tfip.ibf2023project.model.Comment;
import tfip.ibf2023project.model.Toilet;
import tfip.ibf2023project.services.Utils;

@Repository
public class ToiletRepository {
    
    @Autowired
    private MongoTemplate template;

    public final static String TOILETS = "toilets";

    public Boolean toiletCheck(Toilet toilet){
        Criteria criteria = Criteria.where("location").is(toilet.getLocation());
        Query query = Query.query(criteria);
        List<Document> toiletsWithLocation = template.find(query, Document.class, "toilets");
        if(toiletsWithLocation.isEmpty()){
            return false;
        }
        else{
            return true;
        }
    }

    public String insertToilet(Toilet toilet) {
        Document doc = Utils.ToilettoDocument(toilet);
        try {
        template.insert(doc, TOILETS);
            return "Toilet added successfully";
        } catch (Exception e) {
            return "Toilet NOT added";
        }
    }

    public String insertComment(Comment comment, String location) {
        Document doc = Utils.CommenttoDocument(comment);
        Criteria criteria = Criteria.where("location").is(location);
		Query query = Query.query(criteria);
        Document toiletsWithLocation = template.findOne(query, Document.class, "toilets");
        if(toiletsWithLocation == null){
            return "No toilet exists at this location";
        }
        else{
            Update addComment = new Update().push("comments", doc);
            UpdateResult result = template.updateFirst(query, addComment, Document.class, TOILETS);
            long resultCount = result.getModifiedCount();
            if(resultCount == 0){
                return "Unable to add comment. Please try again.";
            }
            else{ 
                return "Comment added successfully";
            }
        }
    }

    //db.getCollection("toilets").find({}, { geometry: 1, _id: 0 })
    public JsonObject getToiletLocations(){
        Query query = new Query(new Criteria());
        query.fields().exclude("_id").include("geometry");
        List<Document> locs = template.find(query, Document.class, TOILETS);
        JsonArrayBuilder jab = Json.createArrayBuilder();
        for (Document document : locs) {
            JsonReader jsonReader = Json.createReader(new StringReader(document.toJson()));
            JsonObject obj = jsonReader.readObject();
            jab.add(obj);
        }
        JsonObject locations = Json.createObjectBuilder().add("locations", jab.build()).build();
        return locations;
    }

    public JsonObject getToiletLocationAndAvgRating(String coords){
        String[] coordinatesArray = coords.split(",");
        Double lat = Double.parseDouble(coordinatesArray[1]);
        Double lng = Double.parseDouble(coordinatesArray[0]);
        List<Double> coordinates = Arrays.asList(lng, lat);
        Criteria criteria = Criteria.where("geometry.coordinates").is(coordinates);
        Query query = new Query(criteria);
        query.fields().exclude("_id").include("location").include("comments");
        Document result = template.findOne(query, Document.class, TOILETS);
        if(null == result){
            JsonObject toReturn = Json.createObjectBuilder().add("result", "No results").build();
            return toReturn;
        }
        else{
            List<Document> comments = (List<Document>) result.get("comments");
          if (comments != null && !comments.isEmpty()) {
            double sum = 0.0;
            for (Document comment : comments) {
                sum += comment.getInteger("rating");
            }
            double avgRatingdouble = sum / comments.size();
            String avgRating2dp = String.format("%.2f",avgRatingdouble);
            double avgRating = Double.parseDouble(avgRating2dp);

            result.append("avgRating", avgRating);
        } else {
            result.append("avgRating", 0.0);
        }
            return Utils.toJson(result);
        }
       
    }

        public JsonObject getToiletInfo(String location){
        Criteria criteria = Criteria.where("location").is(location);
        Query query = new Query(criteria);
        query.fields().exclude("_id");
        Document result = template.findOne(query, Document.class, TOILETS);
        if(null == result){
            JsonObject toReturn = Json.createObjectBuilder().add("result", "No results").build();
            return toReturn;
        }
        else{
            List<Document> comments = (List<Document>) result.get("comments");
          if (comments != null && !comments.isEmpty()) {
            double sum = 0.0;
            for (Document comment : comments) {
                sum += comment.getInteger("rating");
            }
            double avgRating = sum / comments.size();

            result.append("avgRating", avgRating);
        } else {
            result.append("avgRating", 0.0);
        }
            return Utils.toJson(result);
        }
    }

    //db.getCollection("toilets").find({"submitted by" : "testUser3"})
    public JsonObject getToiletsByUserId(String userId){
        Query query = new Query(Criteria.where("submitted by").is(userId));
        query.fields().exclude("_id");
        List<Document> tltsSubmitted = template.find(query, Document.class, TOILETS);
        if(tltsSubmitted.isEmpty()){
            JsonObject noToilets = Json.createObjectBuilder().add("Result", "No toilets created by this user").build();
            return noToilets;
        }
        JsonArrayBuilder jab = Json.createArrayBuilder();
        for (Document document : tltsSubmitted) {
            JsonReader jsonReader = Json.createReader(new StringReader(document.toJson()));
            JsonObject obj = jsonReader.readObject();
            jab.add(obj);
        }
        JsonObject toiletsSubmitted = Json.createObjectBuilder().add("toilets", jab.build()).build();
        return toiletsSubmitted;
    }

    public JsonObject deleteToilet(String location){
        Query query = new Query(Criteria.where("location").is(location));
        String result = "";
        DeleteResult deleted = template.remove(query, TOILETS);
        long deletedDocs = deleted.getDeletedCount();
        if(deletedDocs == 1){
            result = "Deleted successfully";
        }
        if(deletedDocs == 0){
            result = "Unable to delete toilet. Please refresh page and try again.";
        }

        JsonObject toReturn = Json.createObjectBuilder().add("result", result).build();
        return toReturn;
    }

    public JsonObject verifyToilet(String location){
        Query query = new Query(Criteria.where("location").is(location));
        String toReturn = "";
        Document toiletsWithLocation = template.findOne(query, Document.class, "toilets");
        if(toiletsWithLocation == null){
            toReturn = "No toilet exists at this location";
        }
        else{
            new Update();
            Update verifyToilet = Update.update("verification", "Verified");
            UpdateResult result = template.updateFirst(query, verifyToilet, Document.class, TOILETS);
            long resultCount = result.getModifiedCount();
            if(resultCount == 0){
                toReturn =  "Unable to verify toilet. Please try again later.";
            }
            else{ 
                toReturn = "Verified successfully";
            }
        }

        JsonObject verifyResult = Json.createObjectBuilder().add("result", toReturn).build();
        return verifyResult;
    }

    public JsonObject getUnverifiedToilets(){
        Query query = new Query(Criteria.where("verification").is("Unverified"));
        query.fields().exclude("_id");
        List<Document> unverifiedToilets = template.find(query, Document.class, TOILETS);
        if(unverifiedToilets.isEmpty()){
            JsonObject noToilets = Json.createObjectBuilder().add("Result", "No unverified toilets").build();
            return noToilets;
        }
        JsonArrayBuilder jab = Json.createArrayBuilder();
        for (Document document : unverifiedToilets) {
            JsonReader jsonReader = Json.createReader(new StringReader(document.toJson()));
            JsonObject obj = jsonReader.readObject();
            jab.add(obj);
        }
        JsonObject unvfiedToilets = Json.createObjectBuilder().add("toilets", jab.build()).build();
        return unvfiedToilets;
    } 

    public JsonObject getVerifiedToilets(){
        Query query = new Query(Criteria.where("verification").is("Verified"));
        query.fields().exclude("_id");
        List<Document> verifiedToilets = template.find(query, Document.class, TOILETS);
        if(verifiedToilets.isEmpty()){
            JsonObject noToilets = Json.createObjectBuilder().add("Result", "No verified toilets").build();
            return noToilets;
        }
        JsonArrayBuilder jab = Json.createArrayBuilder();
        for (Document document : verifiedToilets) {
            JsonReader jsonReader = Json.createReader(new StringReader(document.toJson()));
            JsonObject obj = jsonReader.readObject();
            jab.add(obj);
        }
        JsonObject vfiedToilets = Json.createObjectBuilder().add("toilets", jab.build()).build();
        return vfiedToilets;
    } 
 
}
