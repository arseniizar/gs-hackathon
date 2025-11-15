package myapp.backendcore.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Document(collection = "challenges")
public class Challenge {

    @Id
    private String id;
    private String title;
    private String description;
    private ChallengeStatus status = ChallengeStatus.OPEN;
    private String metric;
    private Instant deadline;
    private String rules; // 👈 Додане поле
    private List<DataAsset> dataAssets; // 👈 Додане поле
    private Instant createdAt;
    private Instant updatedAt;

    // --- Constructors ---

    public Challenge() {
    }

    // Оновлений конструктор з усіма полями
    public Challenge(String id,
                     String title,
                     String description,
                     ChallengeStatus status,
                     String metric,
                     Instant deadline,
                     String rules,
                     List<DataAsset> dataAssets,
                     Instant createdAt,
                     Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.metric = metric;
        this.deadline = deadline;
        this.rules = rules;
        this.dataAssets = dataAssets;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Static Builder Access ---

    public static Builder builder() {
        return new Builder();
    }

    // --- Getters and Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ChallengeStatus getStatus() { return status; }
    public void setStatus(ChallengeStatus status) { this.status = status; }

    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }

    public Instant getDeadline() { return deadline; }
    public void setDeadline(Instant deadline) { this.deadline = deadline; }

    public String getRules() { return rules; } // 👈 Новий getter
    public void setRules(String rules) { this.rules = rules; } // 👈 Новий setter

    public List<DataAsset> getDataAssets() { return dataAssets; } // 👈 Новий getter
    public void setDataAssets(List<DataAsset> dataAssets) { this.dataAssets = dataAssets; } // 👈 Новий setter

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    // --- Внутрішній клас для DataAsset (без Lombok) ---

    public static class DataAsset {
        private String name;
        private String size;

        public DataAsset() {}

        public DataAsset(String name, String size) {
            this.name = name;
            this.size = size;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            DataAsset dataAsset = (DataAsset) o;
            return Objects.equals(name, dataAsset.name) && Objects.equals(size, dataAsset.size);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, size);
        }
    }


    // --- Builder Class (Оновлений) ---

    public static final class Builder {
        private String id;
        private String title;
        private String description;
        private ChallengeStatus status = ChallengeStatus.OPEN;
        private String metric;
        private Instant deadline;
        private String rules; // 👈 Додане поле
        private List<DataAsset> dataAssets; // 👈 Додане поле
        private Instant createdAt;
        private Instant updatedAt;

        private Builder() {}

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder status(ChallengeStatus status) {
            this.status = status;
            return this;
        }

        public Builder metric(String metric) {
            this.metric = metric;
            return this;
        }

        public Builder deadline(Instant deadline) {
            this.deadline = deadline;
            return this;
        }

        public Builder rules(String rules) { // 👈 Новий метод
            this.rules = rules;
            return this;
        }

        public Builder dataAssets(List<DataAsset> dataAssets) { // 👈 Новий метод
            this.dataAssets = dataAssets;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Challenge build() {
            return new Challenge(id, title, description, status, metric, deadline, rules, dataAssets, createdAt, updatedAt);
        }
    }
}