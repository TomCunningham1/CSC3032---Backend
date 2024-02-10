import {
  NON_PRODUCTION_ENVIRONMENT,
  PRODUCTION_ENVIRONMENT,
} from './constants'

class Environment {
  environmentName: string
  databaseName: string
  hostName: string

  constructor(env: string) {
    if (env === 'non-prod') {
      this.environmentName = NON_PRODUCTION_ENVIRONMENT.environmentName
      this.databaseName = NON_PRODUCTION_ENVIRONMENT.databaseName
      this.hostName = NON_PRODUCTION_ENVIRONMENT.hostName
    }
    if (env === 'prod') {
      this.environmentName = PRODUCTION_ENVIRONMENT.environmentName
      this.databaseName = PRODUCTION_ENVIRONMENT.databaseName
      this.hostName = PRODUCTION_ENVIRONMENT.hostName
    }
  }
}

const environment = new Environment(process.env.ENVIRONMENT || 'non-prod')

export default environment
