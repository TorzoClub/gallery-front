#!/bin/bash
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

scp -i ./tmp/private.pem -r build/* ${SSH_USERNAME}@${SSH_HOST}:${REMOTE_UPLOAD_PATH}
