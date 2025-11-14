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

    print(f"\nГотово! Весь код проєкту збережено у файлі: {output_path}")

if __name__ == "__main__":
    # Тепер скрипт завжди працює з поточної директорії
    scan_and_write_code()
