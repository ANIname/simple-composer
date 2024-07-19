import inquirer from 'inquirer'

import * as commandsHandlers from './commands-handlers'

type Command = keyof typeof commandsHandlers

(async () => {
  const test = await inquirer.prompt<{ command: Command }>([{
    type: 'select',
    name: 'command',
    message: 'Choose the command:',
  
    choices: [
      { name: '🔨 Build application', value: 'buildApplication' },
      { name: '📦 Deploy to npm', value: 'deployToNpm' },
      { name: '🚀 Run application', value: 'runApplication' },
      { name: '🚀 Run and watch application', value: 'runAndWatchApplication' }
    ],
  }]) as { command: Command }

  commandsHandlers[test.command]()
})()

