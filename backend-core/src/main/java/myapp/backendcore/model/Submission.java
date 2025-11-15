package myapp.backendcore.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "submissions")
public class Submission {

    @Id
    private String id;
    private String userId;
    private String challengeId;
    private String filename;          // stored filename on disk
    private String originalFilename;
    private long fileSize;
    private SubmissionStatus status;
    private Double score;             // null until processed
    private String errorMessage;
    private String submissionHash;    // SHA1 for duplicate detection
    private Instant createdAt;
    private Instant updatedAt;
    private String workerHash;
    private Boolean plagiarism;      // true if worker detected duplicate hash
    private Integer workerTotalRows; // how many rows were used to score
    private Instant workerScoredAt;  // when the worker scored it

    public Submission() {
    }

    public Submission(String id,
                      String userId,
                      String challengeId,
                      String filename,
                      String originalFilename,
                      long fileSize,
                      SubmissionStatus status,
                      Double score,
                      String errorMessage,
                      String submissionHash,
                      Instant createdAt,
                      Instant updatedAt,
                      String workerHash,
                      Boolean plagiarism,
                      Integer workerTotalRows,
                      Instant workerScoredAt) {
        this.id = id;
        this.userId = userId;
        this.challengeId = challengeId;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.fileSize = fileSize;
        this.status = status;
        this.score = score;
        this.errorMessage = errorMessage;
        this.submissionHash = submissionHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.workerHash = workerHash;
        this.plagiarism = plagiarism;
        this.workerTotalRows = workerTotalRows;
        this.workerScoredAt = workerScoredAt;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(String challengeId) {
        this.challengeId = challengeId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getSubmissionHash() {
        return submissionHash;
    }

    public void setSubmissionHash(String submissionHash) {
        this.submissionHash = submissionHash;
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

    public String getWorkerHash() {
        return workerHash;
    }

    public void setWorkerHash(String workerHash) {
        this.workerHash = workerHash;
    }

    public Boolean getPlagiarism() {
        return plagiarism;
    }

    public void setPlagiarism(Boolean plagiarism) {
        this.plagiarism = plagiarism;
    }

    public Integer getWorkerTotalRows() {
        return workerTotalRows;
    }

    public void setWorkerTotalRows(Integer workerTotalRows) {
        this.workerTotalRows = workerTotalRows;
    }

    public Instant getWorkerScoredAt() {
        return workerScoredAt;
    }

    public void setWorkerScoredAt(Instant workerScoredAt) {
        this.workerScoredAt = workerScoredAt;
    }

    public static final class Builder {
        private String id;
        private String userId;
        private String challengeId;
        private String filename;
        private String originalFilename;
        private long fileSize;
        private SubmissionStatus status;
        private Double score;
        private String errorMessage;
        private String submissionHash;
        private Instant createdAt;
        private Instant updatedAt;
        private String workerHash;
        private Boolean plagiarism;
        private Integer workerTotalRows;
        private Instant workerScoredAt;

        private Builder() {
        }

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder challengeId(String challengeId) {
            this.challengeId = challengeId;
            return this;
        }

        public Builder filename(String filename) {
            this.filename = filename;
            return this;
        }

        public Builder originalFilename(String originalFilename) {
            this.originalFilename = originalFilename;
            return this;
        }

        public Builder fileSize(long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        public Builder status(SubmissionStatus status) {
            this.status = status;
            return this;
        }

        public Builder score(Double score) {
            this.score = score;
            return this;
        }

        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public Builder submissionHash(String submissionHash) {
            this.submissionHash = submissionHash;
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

        public Builder workerHash(String workerHash) {
            this.workerHash = workerHash;
            return this;
        }

        public Builder plagiarism(Boolean plagiarism) {
            this.plagiarism = plagiarism;
            return this;
        }

        public Builder workerTotalRows(Integer workerTotalRows) {
            this.workerTotalRows = workerTotalRows;
            return this;
        }

        public Builder workerScoredAt(Instant workerScoredAt) {
            this.workerScoredAt = workerScoredAt;
            return this;
        }

        public Submission build() {
            return new Submission(id, userId, challengeId, filename, originalFilename, fileSize, status,
                    score, errorMessage, submissionHash, createdAt, updatedAt, workerHash, plagiarism,
                    workerTotalRows, workerScoredAt);
        }
    }
}
