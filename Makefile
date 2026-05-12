# Cortex Monorepo Makefile

# Variables
APP_NAME := cortex
CORE_NAME := cortex-core

# Paths
CRATES_DIR := crates
APP_DIR := $(CRATES_DIR)/cortex-app
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
	cd $(APP_DIR) && $(TAURI) dev

.PHONY: dev-ui
dev-ui: ## Run the frontend dev server
	cd $(UI_DIR) && $(NPM) run dev

.PHONY: dev-cli
dev-cli: ## Run the CLI in development mode
	$(CARGO) run -p $(APP_NAME) -- run

# --- Build ---

.PHONY: build
build: build-ui build-app ## Build all components for production

.PHONY: build-ui
build-ui: ## Build the frontend
	cd $(UI_DIR) && $(NPM) install && $(NPM) run build

.PHONY: build-app
build-app: ## Build the Tauri application (production)
	cd $(APP_DIR) && $(TAURI) build

# --- Lint & Format ---

.PHONY: lint
lint: lint-rust lint-ui ## Run all linters

.PHONY: lint-rust
lint-rust: ## Run clippy for all crates
	$(CARGO) clippy --workspace -- -D warnings

.PHONY: lint-ui
lint-ui: ## Run eslint for the frontend
	cd $(UI_DIR) && $(NPM) run lint

.PHONY: type-check
type-check: ## run typescript type-check
	cd $(UI_DIR) && npx tsc -b --noEmit

.PHONY: fmt
fmt: fmt-rust fmt-ui ## Format all code

.PHONY: fmt-rust
fmt-rust: ## Format Rust code
	$(CARGO) fmt --all

.PHONY: fmt-ui
fmt-ui: ## Format frontend code
	cd $(UI_DIR) && $(NPM) run format

.PHONY: check-fmt-rust
check-fmt-rust: ## Check Rust code formatting
	$(CARGO) fmt --all -- --check

.PHONY: check-fmt-ui
check-fmt-ui: ## Check frontend code formatting
	cd $(UI_DIR) && npx prettier --check .

.PHONY: check-fmt
check-fmt: check-fmt-rust check-fmt-ui ## Check all code formatting

.PHONY: check
check: ## Run cargo check for the workspace
	$(CARGO) check --workspace

# --- Test ---

.PHONY: test
test: test-core test-cli test-app ## Run all tests

.PHONY: test-workspace
test-workspace: ## Run all tests in the workspace
	$(CARGO) test --workspace

.PHONY: test-doc
test-doc: ## Run doc tests for the workspace
	$(CARGO) test --doc --workspace

.PHONY: test-core
test-core: ## Run tests for cortex-core
	$(CARGO) test -p $(CORE_NAME)

.PHONY: test-app
test-app: ## Run tests for cortex (Tauri)
	$(CARGO) test -p $(APP_NAME)

.PHONY: verify-ipc
verify-ipc: test-app ## Verify IPC contract sync
	@if [ -n "$$(git status --porcelain $(UI_DIR)/src/bindings.ts | grep -v '??')" ]; then \
		echo "Error: IPC bindings are out of sync. Please commit the changes in $(UI_DIR)/src/bindings.ts"; \
		git diff $(UI_DIR)/src/bindings.ts; \
		exit 1; \
	fi

# --- CI ---

.PHONY: ci
ci: check-fmt lint type-check verify-ipc test-workspace test-doc ## Run all CI checks locally
	@echo "All CI checks passed!"

# --- Cleanup ---

.PHONY: clean
clean: ## Clean build artifacts
	$(CARGO) clean
	rm -rf $(UI_DIR)/dist
	rm -rf $(UI_DIR)/node_modules
