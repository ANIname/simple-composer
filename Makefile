# App Commands
app:
	@make npm-install-if-not-exists
	@make cleanUp
	@node dist/utils/make/app

# NPM Commands
npm:
	@make npm-install-if-not-exists
	@make cleanUp
	@node dist/utils/make/npm

npm-install-if-not-exists:
	@[ -d "node_modules" ] || npm i

npm-update:
	@echo "🔄 Updating npm modules to latest versions..."
	@ncu
	@ncu -u
	@echo "🔄 Installing latest versions..."
	@npm i

cleanUp:
	@rm -rf dist
	@npx tsc