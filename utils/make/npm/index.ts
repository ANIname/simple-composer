import inquirer from 'inquirer'

import * as commandsHandlers from './commands-handlers'

type Command = keyof typeof commandsHandlers

(async () => {
  const test = await inquirer.prompt<{ command: Command }>([{
    type: 'select',
    name: 'command',
    message: 'Choose the command:',
  
    choices: [
      { name: '⬇️  Install dependencies', value: 'installDependencies' },
      { name: '🔄 Update dependencies', value: 'updateDependencies' }
    ],
  }]) as { command: Command }

  commandsHandlers[test.command]()
})()

