# Cortex Monorepo Makefile

# Variables
APP_NAME := cortex-app
CLI_NAME := cortex-cli
CORE_NAME := cortex-core

# Paths
CRATES_DIR := crates
APP_DIR := $(CRATES_DIR)/cortex-app
CLI_DIR := $(CRATES_DIR)/cortex-cli
CORE_DIR := $(CRATES_DIR)/cortex-core
UI_DIR := $(APP_DIR)/ui

# Tools
CARGO := cargo
NPM := npm
TAURI := $(CARGO) tauri

# Default target
.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# --- Development ---

.PHONY: dev
dev: ## Run the Tauri app in development mode
	$(TAURI) dev

.PHONY: dev-ui
dev-ui: ## Run the frontend dev server
	cd $(UI_DIR) && $(NPM) run dev

.PHONY: dev-cli
dev-cli: ## Run the CLI in development mode
	$(CARGO) run -p $(CLI_NAME) --

# --- Build ---

.PHONY: build
build: build-ui build-app build-cli ## Build all components for production

.PHONY: build-ui
build-ui: ## Build the frontend
	cd $(UI_DIR) && $(NPM) install && $(NPM) run build

.PHONY: build-app
build-app: ## Build the Tauri application (production)
	$(TAURI) build

.PHONY: build-cli
build-cli: ## Build the CLI binary
	$(CARGO) build --release -p $(CLI_NAME)

# --- Lint & Format ---

.PHONY: lint
lint: lint-rust lint-ui ## Run all linters

.PHONY: lint-rust
lint-rust: ## Run clippy for all crates
	$(CARGO) clippy --all-targets --all-features -- -D warnings

.PHONY: lint-ui
lint-ui: ## Run eslint for the frontend
	cd $(UI_DIR) && $(NPM) run lint

.PHONY: fmt
fmt: fmt-rust fmt-ui ## Format all code

.PHONY: fmt-rust
fmt-rust: ## Format Rust code
	$(CARGO) fmt --all

.PHONY: fmt-ui
fmt-ui: ## Format frontend code (via prettier if available, or just lint fix)
	cd $(UI_DIR) && $(NPM) run lint -- --fix

.PHONY: check
check: ## Run cargo check for the workspace
	$(CARGO) check --workspace

# --- Test ---

.PHONY: test
test: test-core test-cli test-app ## Run all tests

.PHONY: test-core
test-core: ## Run tests for cortex-core
	$(CARGO) test -p $(CORE_NAME)

.PHONY: test-cli
test-cli: ## Run tests for cortex-cli
	$(CARGO) test -p $(CLI_NAME)

.PHONY: test-app
test-app: ## Run tests for cortex-app (Tauri)
	$(CARGO) test -p $(APP_NAME)

# --- Cleanup ---

.PHONY: clean
clean: ## Clean build artifacts
	$(CARGO) clean
	rm -rf $(UI_DIR)/dist
	rm -rf $(UI_DIR)/node_modules
