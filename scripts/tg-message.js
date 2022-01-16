/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('../package.json')
const childProcess = require('child_process')
const fs = require('fs')

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, BUILD_DESCRIPTION, RUN_NUMBER } = process.env

const commits = JSON.parse(process.env.COMMITS)

const commitHistoryText = commits.map(commit => {
  return `  ${commit.message}`
}).join('\n')

const text = [
  BUILD_DESCRIPTION,
  `构建数: ${RUN_NUMBER}`,
  'Commits:\n' + commitHistoryText
].join('\n')

const tgRequest = {
  chat_id: TELEGRAM_CHAT_ID,
  text,
}

fs.writeFileSync('./tg-request.json', JSON.stringify(tgRequest))

const command = [
  'curl',
  `-vX POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage"`,
  '-H "Content-Type: application/json"',
  '-d @tg-request.json'
].join(' ')

childProcess.execSync(command)
