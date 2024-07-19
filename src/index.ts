import EventEmitter from 'events'

type TaskHandler = (task: Task) => unknown
type AbortHandler = (task: Task) => unknown

interface TaskHandlersResult {
  [key: string]: unknown
}

interface AbortHandlersResult {
  [key: string]: unknown
}

interface TaskContext {
  [key: string]: unknown
}

interface TaskOptions {
  taskHandlers: TaskHandler[]
  abortHandlers?: AbortHandler[]
}

export default class Task {
  eventEmitter = new EventEmitter()

  taskHandlers: TaskOptions['taskHandlers'] = []
  abortHandlers: TaskOptions['abortHandlers'] = []

  taskArguments: unknown[] = []

  taskHandlersResult: TaskHandlersResult = {}
  abortHandlersResult: AbortHandlersResult = {}

  taskContext: TaskContext = {}

  error: Error | null = null

  taskType: 'parallel' | 'series' = 'parallel'
 
  constructor(options: TaskOptions) {
    this.taskHandlers = options.taskHandlers
    this.abortHandlers = options.abortHandlers || []
  }

  waitForHandlerCompletion(handlerName: string) {
    if (this.taskType === 'series') return console.warn('waitForHandlerCompletion is not supported in series tasks')

    return new Promise((resolve) => this.eventEmitter.once(handlerName, resolve))
  }
}

export class ParallelTask extends Task {
  async run(...args: unknown[]) {
    try {
      this.taskType = 'parallel'
      this.taskArguments = args
      this.taskContext = {}
      this.error = null

      const promises = this.taskHandlers.map(async (handler: TaskHandler, index) => {
        const handlerName = handler.name || `handler${index}`

        const result = await handler(this)

        this.taskHandlersResult[handlerName] = result

        this.eventEmitter.emit(handlerName)

        return result
      })

      await Promise.all(promises)

      return this.taskHandlersResult
    } catch (error) {
      this.error = error as Error

      if (!this.abortHandlers?.length) return

      const promises = this.abortHandlers.map(async (handler: AbortHandler, index) => {
        const handlerName = handler.name || `handler${index}`

        const result = await handler(this)

        this.abortHandlersResult[handlerName] = result

        this.eventEmitter.emit(handlerName)

        return result
      })

      await Promise.all(promises)

      return this.abortHandlersResult
    }
  }
}

export class SeriesTask extends Task {
  async run(...args: unknown[]) {
    try {
      this.taskType = 'series'
      this.taskArguments = args
      this.taskContext = {}
      this.error = null

      let counter = 0

      for (counter; counter < this.taskHandlers.length; counter++) {
        const handler = this.taskHandlers[counter]

        if (!handler) break

        const handlerName = handler.name || `handler${counter}`

        const result = await handler(this)

        this.taskHandlersResult[handlerName] = result
      }

      return this.taskHandlersResult
    } catch (error) {
      this.error = error as Error

      if (!this.abortHandlers?.length) return

      let counter = 0

      for (counter; counter < this.abortHandlers.length; counter++) {
        const handler = this.abortHandlers[counter] as AbortHandler

        if (!handler) break

        const handlerName = handler.name || `handler${counter}`

        const result = await handler(this)

        this.abortHandlersResult[handlerName] = result
      }

      return this.abortHandlersResult
    }
  }
}
