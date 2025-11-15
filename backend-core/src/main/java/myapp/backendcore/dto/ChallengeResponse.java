package myapp.backendcore.dto;

import myapp.backendcore.model.Challenge;
import myapp.backendcore.model.ChallengeStatus;

import java.time.Instant;
import java.util.List;

public class ChallengeResponse {
    private String id;
    private String title;
    private String description;
    private ChallengeStatus status;
    private String metric;
    private Instant deadline;
    private String rules;
    private List<Challenge.DataAsset> dataAssets;
    private Instant createdAt;
    private Instant updatedAt;

    public ChallengeResponse() {
    }

    public ChallengeResponse(String id,
                             String title,
                             String description,
                             ChallengeStatus status,
                             String metric,
                             Instant deadline,
                             String rules,
                             List<Challenge.DataAsset> dataAssets,
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

    public static Builder builder() {
        return new Builder();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ChallengeStatus getStatus() {
        return status;
    }

    public void setStatus(ChallengeStatus status) {
        this.status = status;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public Instant getDeadline() {
        return deadline;
    }

    public void setDeadline(Instant deadline) {
        this.deadline = deadline;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public List<Challenge.DataAsset> getDataAssets() {
        return dataAssets;
    }

    public void setDataAssets(List<Challenge.DataAsset> dataAssets) {
        this.dataAssets = dataAssets;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static final class Builder {
        private String id;
        private String title;
        private String description;
        private ChallengeStatus status;
        private String metric;
        private Instant deadline;
        private String rules;
        private List<Challenge.DataAsset> dataAssets;
        private Instant createdAt;
        private Instant updatedAt;

        private Builder() {
        }

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

        public Builder rules(String rules) {
            this.rules = rules;
            return this;
        }

        public Builder dataAssets(List<Challenge.DataAsset> dataAssets) {
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

        public ChallengeResponse build() {
            return new ChallengeResponse(
                    id,
                    title,
                    description,
                    status,
                    metric,
                    deadline,
                    rules,
                    dataAssets,
                    createdAt,
                    updatedAt
            );
        }
    }
}
