package myapp.backendcore.dto;

import java.time.Instant;

public class LeaderboardEntryDto {
    private int rank;
    private String userDisplayName;
    private double score;
    private String submissionId;
    private Instant submittedAt;

    public LeaderboardEntryDto() {
    }

    public LeaderboardEntryDto(int rank, String userDisplayName, double score, String submissionId, Instant submittedAt) {
        this.rank = rank;
        this.userDisplayName = userDisplayName;
        this.score = score;
        this.submissionId = submissionId;
        this.submittedAt = submittedAt;
    }

    // --- Getters and Setters ---
    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }
    public String getUserDisplayName() { return userDisplayName; }
    public void setUserDisplayName(String userDisplayName) { this.userDisplayName = userDisplayName; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
    public String getSubmissionId() { return submissionId; }
    public void setSubmissionId(String submissionId) { this.submissionId = submissionId; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}