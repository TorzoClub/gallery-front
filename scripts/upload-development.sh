#!/bin/bash
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

scp -r build ${SSH_USERNAME}@${SSH_HOST}:${REMOTE_UPLOAD_PATH} -i ./tmp/private.pem
