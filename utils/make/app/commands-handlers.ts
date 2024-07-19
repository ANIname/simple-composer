import { execSync } from 'node:child_process'

export function buildApplication() {
  console.time('🔨 build application')

  execSync('npx tsup', { stdio: 'inherit' })

  console.timeEnd('🔨 build application')
}

export function runApplication() {
  console.time('🚀 run application')

  execSync('npx ts-node src/index', { stdio: 'inherit' })

  console.timeEnd('🚀 run application')
}

export function runAndWatchApplication() {
  console.time('🚀 run and watch application')

  execSync('npx ts-node-dev --respawn --transpile-only src/index', { stdio: 'inherit' })

  console.timeEnd('🚀 run and watch application')
}

export function deployToNpm() {
  console.time('📦 deploy to npm')

  buildApplication()

  execSync('npm publish', { stdio: 'inherit' })

  console.timeEnd('📦 deploy to npm')
}