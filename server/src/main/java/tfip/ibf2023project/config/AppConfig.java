package tfip.ibf2023project.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import jakarta.annotation.PostConstruct;

@Configuration
public class AppConfig {

    @Value("${spring.data.mongodb.url}")
    private String mongoUrl;

    private MongoClient client;

    @PostConstruct
    public void init() {
        this.client = MongoClients.create(mongoUrl);
    }

    @Bean
    public MongoClient mongoClient() {
        return this.client;
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "Project");
    }
}
