package myapp.backendcore.dto;

public class SubmissionResultDto {
    private String status;       // "DONE" or "FAILED"
    private Double score;        // may be null on FAILED
    private String errorMessage; // for FAILED
    private String hash;         // worker hash
    private Boolean plagiarism;  // true if duplicate hash
    private Integer totalRows;   // rows used in scoring
    private Long timestamp;      // worker timestamp (epoch millis)

    public SubmissionResultDto() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public Boolean getPlagiarism() {
        return plagiarism;
    }

    public void setPlagiarism(Boolean plagiarism) {
        this.plagiarism = plagiarism;
    }

    public Integer getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(Integer totalRows) {
        this.totalRows = totalRows;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
