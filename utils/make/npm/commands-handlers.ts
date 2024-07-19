import { execSync } from 'node:child_process'

export function installDependencies() {
  console.time('⬇️ install dependencies')

  execSync('npm install', { stdio: 'inherit' })

  console.timeEnd('⬇️ install dependencies')
}

export function updateDependencies() {
  console.time('🔄 update dependencies')

  console.timeLog('🔄 update dependencies', 'Checking for outdated dependencies...')
  execSync('ncu', { stdio: 'inherit' })

  console.timeLog('🔄 update dependencies', 'Updating dependencies...')
  execSync('ncu -u', { stdio: 'inherit' })

  console.timeLog('🔄 update dependencies', 'Installing dependencies...')
  execSync('npm install', { stdio: 'inherit' })

  console.timeEnd('🔄 update dependencies')
}