# Drisommer - Montoya Theme Hugo Site

This repository contains a Hugo site using the Montoya theme. Below are step-by-step instructions to set up and run this project on a fresh MacOS computer.

## Prerequisites

Before you begin, you'll need to install some basic tools:

1. **Homebrew** - The package manager for MacOS
2. **Git** - For cloning the repository
3. **Hugo** - The static site generator

## Setup Steps

### 1. Install Homebrew

Open Terminal and paste the following command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions to complete the installation. After installation, make sure Homebrew is in your PATH by running the commands provided in the installation output.

### 2. Install Git

With Homebrew installed, run:

```bash
brew install git
```

### 3. Install Hugo

Install Hugo using Homebrew:

```bash
brew install hugo
```

Verify the installation:

```bash
hugo version
```

### 4. Clone the Repository

Navigate to your preferred directory and clone the repository:

```bash
cd ~/Documents # or any directory of your choice
git clone https://github.com/tiagosomda/drisommer.git
cd drisommer
```

### 5. Run the Development Server

From the project root directory, start the Hugo development server:

```bash
cd src
hugo server -D
```

This will:
- Build the site
- Start a local web server
- Enable live reload for development
- Include draft content (due to the -D flag)

You should see output indicating the server is running, typically at http://localhost:1313/

### 6. Access the Site

Open your web browser and go to:

```
http://localhost:1313/
```

## Customizing the Theme

For technical details about customizing the Montoya theme, please refer to the [TECHNICAL_README.md](TECHNICAL_README.md) file.

## Building for Production

When you're ready to deploy your site, build the production version with:

```bash
cd src
hugo --minify
```

This creates optimized files in the `build` directory that can be deployed to any static web hosting service.

## Troubleshooting

- **Port already in use**: If port 1313 is already in use, specify a different port:
  ```bash
  hugo server -D --port 1314
  ```

- **Missing assets**: If styles or images are missing, verify that all submodules are correctly initialized:
  ```bash
  git submodule update --init --recursive
  ```

- **Color scheme issues**: Check the configuration in `src/hugo.toml` and review the color test page at `/color-test/`
