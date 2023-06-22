package tfip.ibf2023project.services;
import java.io.StringReader;
import java.util.Arrays;
import org.bson.Document;
import com.mongodb.BasicDBObject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import tfip.ibf2023project.model.Comment;
import tfip.ibf2023project.model.Toilet;

public class Utils {

    public static Document ToilettoDocument(Toilet toilet) {
		Document doc = new Document();
		doc.put("area", toilet.getArea());
		doc.put("location", toilet.getLocation());
        doc.put("directions", toilet.getDirections());
		doc.put("submitted by",toilet.getSubmittedBy());
		doc.put("geometry",coordinatestoGeoJson(toilet.getCoordinates()));
		doc.put("verification",toilet.getVerification());
		return doc;
	}
    public static Document CommenttoDocument(Comment comment) {
		Document doc = new Document();
		doc.put("rating", comment.getRating());
		doc.put("comments", comment.getComments());
		doc.put("submitted by",comment.getSubmittedBy());
		return doc;
	}

    public static JsonObject toJson(Document doc) {
		JsonReader reader = Json.createReader(new StringReader(doc.toJson()));
		return reader.readObject();
	}

	public static BasicDBObject coordinatestoGeoJson(String coords){
		String[] parts = coords.replace("(", "").replace(")", "").split(",");
	
        Double lat = Double.parseDouble(parts[1]);
        Double lng = Double.parseDouble(parts[0]);
	
        BasicDBObject geometry = new BasicDBObject("type", "Point")
        .append("coordinates", Arrays.asList(lng, lat));
		return geometry;
	}
    
}
