#
#
#
NAME = "figure"

all: clean install test

test: ;@node ./test/figure.js

install: ;@echo "Installing ${NAME}....."; \
  npm install
 
update: ;@echo "Updating ${NAME}....."; \
  git pull --rebase; \
  npm install
 
clean: ;rm -rf node_modules

publish: ;@npm publish .

.PHONY: test install update clean publish