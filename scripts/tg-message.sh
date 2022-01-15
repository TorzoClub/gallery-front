#!/bin/sh

curl -v https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage \
-H "Content-Type: application/json" \
-d "{ \"chat_id\": \"${TELEGRAM_CHAT_ID}\", \"text\": \"${MESSAGE_TEXT}\" }"
