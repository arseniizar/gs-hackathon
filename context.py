import os

# --- Налаштування ---
# Розширення файлів, які вважаємо кодом
CODE_EXTENSIONS = {
    # Frontend
    '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json', '.md',
    # Backend Java
    '.java', '.properties', '.yml', '.xml',
    # Backend Node.js
    '.mjs',
    # Інше
    '.sql', 'Dockerfile', '.env.example'
}

# Папки, які потрібно повністю ігнорувати
IGNORE_DIRS = {
    '__pycache__', '.git', '.idea', '.vscode', 'target',
    'node_modules',   # Ігноруємо для frontend та backend-nodejs
    'build',          # Ігноруємо для frontend (Vite/CRA) та backend-java (Gradle)
    'dist'            # Стандартна папка для збірки
}

# Окремі файли, які потрібно ігнорувати
IGNORE_FILES = {
    'package-lock.json', 'yarn.lock', # Дуже великі файли, не є вихідним кодом
    '.env',                          # Ніколи не додавайте секрети!
    'mvnw', 'mvnw.cmd', 'gradlew', 'gradlew.bat' # Файли-обгортки для систем збірки
}

# Назва вихідного файлу
OUTPUT_FILE = 'project_code.txt'
# --- Кінець налаштувань ---


def scan_and_write_code(start_path='..', output_filename=OUTPUT_FILE):
    """
    Сканує директорію проєкту з кореня, збирає код в один файл.
    :param start_path: Шлях для сканування (ми запускаємо з папки 'scripts', тому йдемо на рівень вище '..')
    :param output_filename: Назва файлу для збереження.
    """
    # Визначаємо абсолютний шлях до папки проєкту
    project_root = os.path.abspath(start_path)
    print(f"Починаю сканування проєкту в директорії: {project_root}")

    # Вихідний файл буде створено в корені проєкту
    output_path = os.path.join(project_root, output_filename)

    with open(output_path, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(project_root):

            # Видаляємо папки, які потрібно ігнорувати
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                # Перевіряємо, чи файл не в списку ігнорованих
                if file in IGNORE_FILES:
                    continue

                # Перевіряємо розширення або точну назву файлу
                if any(file.endswith(ext) for ext in CODE_EXTENSIONS):
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, project_root)

                    try:
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                            content = infile.read()

                            outfile.write(f"\n{'='*20}\n")
                            outfile.write(f"// Файл: {relative_path.replace(os.sep, '/')}\n") # Уніфікуємо роздільники
                            outfile.write(f"{'='*20}\n\n")
                            outfile.write(content)

                            print(f"Додано файл: {relative_path}")

                    except Exception as e:
                        print(f"Не вдалося прочитати файл {file_path}: {e}")

    print(f"\nГотово! Весь код проєкту збережено у файлі: {output_path}")


if __name__ == "__main__":
    # Запускаємо функцію сканування.
    # Оскільки скрипт знаходиться в папці /scripts, ми починаємо сканування
    # з батьківської директорії ('..'), щоб охопити весь проєкт.
    scan_and_write_code(start_path='..')