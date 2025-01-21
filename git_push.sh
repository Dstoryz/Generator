#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений об ошибках
error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Функция для вывода информационных сообщений
info() {
    echo -e "${YELLOW}$1${NC}"
}

# Функция для вывода успешных сообщений
success() {
    echo -e "${GREEN}$1${NC}"
}

# Функция для сохранения текущих изменений
save_changes() {
    info "Saving current changes..."
    git add . || error "Failed to add changes"
    git commit -m "WIP: Temporary commit" || error "Failed to save changes"
}

# Проверяем git
if ! command -v git &> /dev/null; then
    error "Git is not installed"
fi

# Проверяем, находимся ли мы в git репозитории
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    info "Initializing git repository..."
    git init || error "Failed to initialize git repository"
fi

# Проверяем статус
git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    info "No changes to commit"
    exit 0
fi

# Сохраняем текущие изменения перед переключением веток
save_changes

# Проверяем и переключаемся на main ветку
current_branch=$(git branch --show-current)
if [ -z "$current_branch" ]; then
    # Если нет активной ветки
    if git show-ref --verify --quiet refs/heads/main; then
        # Если ветка main существует, переключаемся на нее
        info "Switching to existing main branch..."
        git checkout main || error "Failed to switch to main branch"
    else
        # Если ветки main нет, создаем ее
        info "Creating main branch..."
        git checkout -b main || error "Failed to create main branch"
    fi
elif [ "$current_branch" != "main" ]; then
    # Если мы не на ветке main
    if git show-ref --verify --quiet refs/heads/main; then
        # Если ветка main существует, переключаемся на нее
        info "Switching to main branch..."
        git checkout main || error "Failed to switch to main branch"
        # Применяем изменения из временной ветки
        git cherry-pick ORIG_HEAD || error "Failed to apply changes to main branch"
    else
        # Если ветки main нет, создаем ее из текущей
        info "Creating main branch from current branch..."
        git branch -m main || error "Failed to rename current branch to main"
    fi
fi

# Запрашиваем commit message для финального коммита
echo -e "${GREEN}Enter commit message (press Enter for default):${NC}"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Update $(date +%Y-%m-%d_%H-%M-%S)"
fi

# Обновляем сообщение последнего коммита
info "Updating commit message..."
git commit --amend -m "$commit_message" || error "Failed to update commit message"

# Проверяем remote
if ! git remote | grep -q "^origin$"; then
    echo -e "${GREEN}Enter GitHub repository URL:${NC}"
    read repo_url
    if [ -z "$repo_url" ]; then
        error "Repository URL is required"
    fi
    git remote add origin "$repo_url" || error "Failed to add remote"
fi

# Пушим изменения
info "Pushing to GitHub..."
if git push -u origin main; then
    success "Successfully pushed to GitHub!"
else
    # Если push не удался, пробуем pull и push снова
    info "Push failed. Trying to pull changes first..."
    if git pull --rebase origin main; then
        if git push -u origin main; then
            success "Successfully pushed to GitHub after pull!"
        else
            error "Push failed after pull. Please check your credentials and try again."
        fi
    else
        error "Pull failed. Please resolve conflicts manually."
    fi
fi 