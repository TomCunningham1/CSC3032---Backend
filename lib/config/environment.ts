import { NON_PRODUCTION_ENVIRONMENT, PRODUCTION_ENVIRONMENT } from './constants'

class Environment {
  environmentName: string
  databaseName: string

  constructor(env: string) {
    switch (env) {
      case 'non-prod': {
        this.environmentName = NON_PRODUCTION_ENVIRONMENT.environmentName
        this.databaseName = NON_PRODUCTION_ENVIRONMENT.databaseName
      }
      case 'prod': {
        this.environmentName = PRODUCTION_ENVIRONMENT.environmentName
        this.databaseName = PRODUCTION_ENVIRONMENT.databaseName
      }
    }
  }
}

const environment = new Environment(process.env.ENVIRONMENT || 'non-prod')

export default environment
