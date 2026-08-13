.DEFAULT_GOAL := help

TAURI := cargo tauri
GRADLEW := ./src-tauri/gen/android/gradlew.bat
MANIFEST := src-tauri/Cargo.toml

.PHONY: help install dev build info check fmt lint clean \
	android-init android-dev android-build android-clean \
	gradle-version gradle-stop devices emulators \
	add-plugin remove-plugin remove-permission doctor

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*## "; printf "Usage: make <command>\n\nCommands:\n"} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install frontend dependencies with Bun
	bun install

dev: ## Run the desktop app in development mode
	$(TAURI) dev

build: ## Build the desktop application
	$(TAURI) build

info: ## Show Tauri environment information
	$(TAURI) info

check: ## Type-check the Rust application
	cargo check --manifest-path $(MANIFEST)

fmt: ## Format Rust source code
	cargo fmt --manifest-path $(MANIFEST)

lint: ## Run Clippy against the Rust application
	cargo clippy --manifest-path $(MANIFEST) --all-targets --all-features -- -D warnings

clean: ## Remove Rust and frontend build output
	cargo clean --manifest-path $(MANIFEST)
	-rm -rf dist

android-init: ## Initialize the generated Android project
	$(TAURI) android init

android-dev: ## Run the app on a connected Android device or emulator
	$(TAURI) android dev

android-build: ## Build the Android application
	$(TAURI) android build

android-clean: ## Clean the generated Android Gradle project
	$(GRADLEW) clean

gradle-version: ## Show Gradle and its active JVM versions
	$(GRADLEW) --version

gradle-stop: ## Stop active Gradle daemons
	$(GRADLEW) --stop

devices: ## List connected Android devices and emulators
	adb devices

emulators: ## List configured Android virtual devices
	emulator -list-avds

add-plugin: ## Add a Tauri plugin: make add-plugin PLUGIN=sql
	@test -n "$(PLUGIN)" || (echo "PLUGIN is required. Example: make add-plugin PLUGIN=sql" && exit 1)
	$(TAURI) add $(PLUGIN)

remove-plugin: ## Remove a Tauri plugin: make remove-plugin PLUGIN=cli
	@test -n "$(PLUGIN)" || (echo "PLUGIN is required. Example: make remove-plugin PLUGIN=cli" && exit 1)
	$(TAURI) remove $(PLUGIN)

remove-permission: ## Remove a permission: make remove-permission PERMISSION=cli:*
	@test -n "$(PERMISSION)" || (echo "PERMISSION is required. Example: make remove-permission PERMISSION=cli:*" && exit 1)
	$(TAURI) permission rm "$(PERMISSION)"

doctor: ## Display versions and paths used by the toolchain
	@echo "Java"
	@java -version
	@echo "\nRust"
	@rustc --version
	@cargo --version
	@echo "\nNode and Bun"
	@node --version
	@bun --version
	@echo "\nAndroid devices"
	@adb devices

