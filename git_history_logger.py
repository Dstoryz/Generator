import subprocess
import os
import logging
from pathlib import Path

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',  # Упрощенный формат вывода
    handlers=[
        logging.FileHandler('git_history.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class GitHistoryAnalyzer:
    def __init__(self, repo_path='.'):
        self.repo_path = Path(repo_path).resolve()
        
    def run_git_command(self, command):
        """Выполнение git команды и возврат результата"""
        try:
            result = subprocess.run(
                command,
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                shell=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            logger.error(f"Error executing git command: {e}")
            return None

    def get_all_branches(self):
        """Получение списка всех веток"""
        branches = self.run_git_command('git branch -a')
        if branches:
            return [b.strip() for b in branches.split('\n')]
        return []

    def analyze_branch(self, branch):
        """Анализ отдельной ветки"""
        logger.info(f"\nBranch: {branch}")
        logger.info("-" * 80)
        
        # Переключаемся на ветку
        self.run_git_command(f'git checkout {branch}')
        
        # Получаем все коммиты в ветке, отсортированные по дате
        commits = self.run_git_command('git log --format="%h | %ad | %an | %s" --date=format:"%Y-%m-%d %H:%M:%S"')
        if commits:
            logger.info(commits)

    def analyze_repository(self):
        """Анализ всего репозитория"""
        # Сохраняем текущую ветку
        current_branch = self.run_git_command('git branch --show-current')
        
        try:
            # Получаем все ветки
            branches = self.get_all_branches()
            
            # Анализируем каждую ветку
            for branch in branches:
                if branch.startswith('*'):
                    branch = branch[2:]
                if 'HEAD' in branch or 'origin/' in branch:
                    continue
                self.analyze_branch(branch)
                
        finally:
            # Возвращаемся на исходную ветку
            self.run_git_command(f'git checkout {current_branch}')

def main():
    try:
        # Создаем анализатор
        analyzer = GitHistoryAnalyzer()
        
        # Очищаем предыдущий лог-файл
        if os.path.exists('git_history.log'):
            os.remove('git_history.log')
            
        # Запускаем анализ
        analyzer.analyze_repository()
        
    except Exception as e:
        logger.error(f"Error during analysis: {e}")

if __name__ == "__main__":
    main() 