package myapp.backendcore.dto;

// Цей DTO містить тільки ту інформацію, яка потрібна воркеру
public class WorkerSubmissionDto {
    private String id;
    private String filePath; // Шлях до файлу на сервері
    private String metric;   // Метрика для оцінки

    public WorkerSubmissionDto(String id, String filePath, String metric) {
        this.id = id;
        this.filePath = filePath;
        this.metric = metric;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }
}