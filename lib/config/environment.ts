import {
  NON_PRODUCTION_ENVIRONMENT,
  PRODUCTION_ENVIRONMENT,
  nonProductionHost,
  productionHost,
} from './constants'

class Environment {
  environmentName: string
  databaseName: string
  hostName: string

  constructor(env: string) {
    if (env === 'non-prod') {
      this.environmentName = NON_PRODUCTION_ENVIRONMENT.environmentName
      this.databaseName = NON_PRODUCTION_ENVIRONMENT.databaseName
      this.hostName = nonProductionHost
    }
    if (env === 'prod') {
      this.environmentName = PRODUCTION_ENVIRONMENT.environmentName
      this.databaseName = PRODUCTION_ENVIRONMENT.databaseName
      this.hostName = productionHost
    }
  }
}

const environment = new Environment(process.env.ENVIRONMENT || 'non-prod')

export default environment
