package tfip.ibf2023project.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Toilet {
    private String area;
    private String location;
    private String directions;
    private String submittedBy;
    private String coordinates;
    private String verification;
}
