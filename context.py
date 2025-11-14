import os

# --- Налаштування ---
CODE_EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json', '.md',
    '.java', '.properties', '.yml', '.xml',
    '.mjs', '.sql', 'Dockerfile', '.env.example'
}

# Папки, які потрібно повністю ігнорувати
IGNORE_DIRS = {
    '__pycache__', '.git', '.idea', '.vscode', 'target', 'node_modules',
    'build', 'dist',
    'venv', '.venv'  # ЗМІНЕНО: Додано '.venv'
}

IGNORE_FILES = {
    'package-lock.json', 'yarn.lock', '.env',
    'mvnw', 'mvnw.cmd', 'gradlew', 'gradlew.bat', '.env.example'
}

OUTPUT_FILE = 'project_code.txt'
# --- Кінець налаштувань ---

def scan_and_write_code(start_path='.', output_filename=OUTPUT_FILE): # ЗМІНЕНО: start_path тепер '.'
    """
    Сканує поточну директорію, збирає код в один файл.
    """
    project_root = os.path.abspath(start_path)
    print(f"Починаю сканування проєкту в директорії: {project_root}")

    output_path = os.path.join(project_root, output_filename)

    with open(output_path, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(project_root):

            # Видаляємо папки, які потрібно ігнорувати
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                if file == output_filename or file in IGNORE_FILES:
                    continue

                if any(file.endswith(ext) for ext in CODE_EXTENSIONS):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, project_root)

                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                            content = infile.read()

                            outfile.write(f"\n{'='*20}\n")
                            outfile.write(f"// Файл: {relative_path.replace(os.sep, '/')}\n")
                            outfile.write(f"{'='*20}\n\n")
                            outfile.write(content)

                            print(f"Додано файл: {relative_path}")

                    except Exception as e:
                        print(f"Не вдалося прочитати файл {file_path}: {e}")
        outfile.write('''
    we are on hackaton right now you are a professional full stack software enginner; we workr in a team of 4 people be sure to note different parts of our app; do the best; easy working solutions, dont add unnecessary things

нижче текст нашого завдання:

WARSAW HACKATHON 2025
Hackathon Management Platform
Problem Statement
As aspiring and creative engineers, you are tasked with designing and implementing a Hackathon Platform that allows users to participate in data modeling challenges. The platform's primary purpose is to enable users to participate in data challenges, covering team implementation, dataset management, solution submission, and evaluation. The goal is to create a user-friendly and efficient platform that supports the entire lifecycle of a hackathon.
Brief Context
Hackathons are most engaging when the underlying infrastructure is seamless, allowing participants to focus entirely on solving the problem. Organizers require a platform that is easy to set up, secure with data, and transparent to participants. Teams in a real-world competition determined by scoring, accuracy matters, a clean user experience, and fast troubleshooting under time pressure. The platform should be user-friendly and efficient, supporting the entire lifecycle of a data-modeling hackathon.
Challenges Proposals
Challenge Catalog: Provide a centralized catalog of available challenges. Each challenge should have a title, a detailed description, specific rules, the primary evaluation metric (such as ROC-AUC or RMSE), the submission deadline in UTC, and associated assets.
Challenge Assets & Data Distribution: Provide sample datasets (such as train.csv, test.csv, sample_submission.csv) in JSON or Parquet formats with integrity checks (sizes, schemas, optional checksums) and rate limits. Include input and output examples demonstrating the expected solution format and data structure.
Solution Submission Pipeline: Develop an user interface (UI) and an /api/submit endpoint. The system should validate the submission and only order or submitted files, support various file types (for example, CSV, JSON, Python scripts, model files), and reject malformed files with actionable error messages.
Scoring Service: Implement an automated service to compute a deterministic score against a hidden ground-truth dataset. Persist the score, timestamps, submission hash, and audit metadata. Track each team's best score.
Leaderboard: Display a live ranking of participants based on their scores. Implement tie-breakers, such as the earliest timestamp of a team's best score. Include options for public/private leaderboard toggles (for example, a hold-out split for final ranking).
User Authentication & Roles: Implement simple registration and login (such as email and password, OAuth, or a developer mode). Define and manage roles for participants, administrators and judges.
Admin Console: Provide a comprehensive admin interface to create, read, update, and delete (CRUD) challenges, including their metrics, deadlines, and rules. Enable dataset uploads, freeze/unfreeze submission capabilities, and export final results. Provide administrative oversight features for participant accounts and permissions. Implement manual review capabilities for complex submissions requiring human judgment (for example, innovation or code-quality aspects not covered by automated scoring).
Operational Safety: Incorporate essential security measures such as file size caps, MIME type checks, storage outside the web root, rate-limiting, and basic input sanitation. The Minimum Viable Product (MVP) should explicitly prohibit arbitrary code execution.
Observability: Ensure clear logging, request and score audit trails, and fast health checks to monitor platform status.
Reproducibility: The platform should be easily deployable with a one-command launch (such as docker-compose up or a single script). Include seeded randomness where applicable and a smoke dataset for continuous integration (CI) testing.
Fair Play: Implement basic anti-cheating measures, such as duplicate detection via hash, row-count checks, suspicious scoring logs, and submission cooldown periods.
Error Experience: Design helpful inputs, states and provide actionable error messages that guide users on how to fix issues (like wrong columns, NaNs or extra rows).
Performance & Concurrency: Ensure non-blocking scoring (for example, using background jobs/queues) that can work with file sizes up to 100 MB without timing out.
Documentation: Provide a concise README with setup steps, an architecture sketch, and troubleshooting tips.
Summary
These examples represent key problems and building blocks for your Hackathon Management Platform. Feel free to innovate beyond these suggestions. The goal is to craft a platform that members can win ownership, and participants will enjoy using, fostering a user-friendly and efficient experience throughout the entire hackathon lifecycle.
Speak with our mentors! They are happy to share real-world constraints and edge cases that matter in competition.
Keep in mind the important aspects:
Reproducibility & Reliability: Ensure deterministic scoring and a one-command setup on a clean machine.
Security & Data Privacy: Implement safe file handling and clear rules; avoid Personally Identifiable Information (PII) and arbitrary code execution in the MVP.
User Experience: To enjoy taking part in the hackathon and focus on the challenge rather than understanding the platform.
Evaluation Criteria
These criteria will be used to select winning projects (each criterium is worth up to 10 points):
Implementation of Key Features: Assess the completeness, robustness, and reliability of core functionalities.
UI/UX: Evaluate the intuitiveness of the design, ease of navigation, aesthetic appeal, and overall user satisfaction for both participants and administrators.
Presentation: Judge the clarity, professionalism, and effectiveness of the platform's demonstration and documentation.
Additional Features: Consider the value, creativity, and successful implementation of any features beyond the core requirements that enhance the platform's utility or user experience.
Flexibility: Evaluate the versatility and efficiency in handling various data types and formats required for diverse data modeling challenges.
Submission
Create Video: Each team must prepare a video of up to five minutes that explains and showcases its solution.
If you used AI tools (e.g., Copilot, Claude) during development, share how you used them and how you addressed security and privacy concerns.
If your solution incorporates AI to improve the user experience of your platform, discuss any trade-offs or limitations it introduces.
Upload your video: The video should be uploaded to Lockbox under a directory named with the team's name. We recommend you to submit also other resources, such as a text file with a link to a Git repository or a demo application.
After the first round, judges will select the top three teams to present live in the finals, followed by a Q&A session.
Good luck and have fun!


стак нашого проекту: реакт, нодж джс, монго, джава спрінг бут
''')


    print(f"\nГотово! Весь код проєкту збережено у файлі: {output_path}")

if __name__ == "__main__":
    # Тепер скрипт завжди працює з поточної директорії
    scan_and_write_code()
