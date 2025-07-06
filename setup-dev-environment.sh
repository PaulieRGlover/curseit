#!/bin/bash
set -e

echo "🔧 Updating package list..."
sudo apt-get update -y
sudo apt-get install -y jq

install_node() {
  if command -v node &>/dev/null; then
    echo "✅ Node.js already installed: $(node -v)"
  else
    echo "📦 Installing Node.js v22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi
}

install_docker() {
  if command -v docker &>/dev/null; then
    echo "✅ Docker is already installed: $(docker --version)"
  else
    echo "📦 Installing Docker..."

    sudo apt-get install -y \
      ca-certificates \
      curl \
      gnupg \
      lsb-release

    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
      sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "🔒 Adding user to docker group..."
    sudo usermod -aG docker $USER
  fi
}

install_git_lfs() {
  if command -v git-lfs &>/dev/null; then
    echo "✅ Git LFS already installed: $(git-lfs --version)"
  else
    echo "📦 Installing Git LFS..."
    sudo apt-get install -y git-lfs
    echo "🔧 Initializing Git LFS..."
    git lfs install
  fi
}

install_postgres_client() {
  if command -v pg_dump &>/dev/null; then
    echo "✅ PostgreSQL client tools already installed: $(pg_dump --version)"
  else
    echo "📦 Installing PostgreSQL client tools (pg_dump, pg_restore)..."
    sudo apt-get install -y postgresql-client
  fi
}

install_ohmyzsh() {
  if [ "$SHELL" = "/bin/zsh" ] || [ "$SHELL" = "/usr/bin/zsh" ]; then
    echo "✅ Zsh already the default shell."
  else
    echo "📦 Installing Zsh..."
    sudo apt-get install -y zsh
    echo "🌟 Installing Oh My Zsh..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    chsh -s $(which zsh)
    echo "ℹ️ Default shell set to Zsh. You may need to log out and log back in."
  fi
}

install_vscode_extensions() {
  if ! command -v code &>/dev/null; then
    echo "⚠️ VSCode 'code' command not found. Skipping extension installation."
    return
  fi

  if [ -f ".vscode/extensions.json" ]; then
    echo "🧩 Installing VSCode extensions from .vscode/extensions.json..."
    jq -r '.recommendations[]' .vscode/extensions.json | while read -r extension; do
      echo "🔌 Installing $extension..."
      code --install-extension "$extension" || echo "⚠️ Failed to install $extension"
    done
  else
    echo "ℹ️ No .vscode/extensions.json found."
  fi
}

install_node
install_docker
install_git_lfs
install_postgres_client
install_ohmyzsh
install_vscode_extensions

echo "✅ All done! You may need to log out and back in to use Docker without sudo."
