#!/bin/bash
set -e

echo "🔧 Updating package list..."
sudo apt-get update -y

install_node() {
  if command -v node &>/dev/null; then
    echo "✅ Node.js is already installed: $(node -v)"
  else
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
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

install_node
install_docker

echo "✅ All done! You may need to log out and back in to use Docker without sudo."
