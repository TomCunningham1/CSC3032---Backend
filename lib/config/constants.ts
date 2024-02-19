const port = 3306

const API_VERSION = { apiVersion: '2012-08-10' }

const EMAIL_SERVICE = {
  USER: 'tomcloudservice@gmail.com',
  SERVICE: 'gmail',
  PASS: 'cwwj wqmj afhm gtbg',
}

const CONTENT_TYPE_JSON = 'application/json'

const NON_PRODUCTION_ENVIRONMENT = {
  environmentName: 'non-production',
  databaseName: 'team11_non_prod_db',
  hostName:
    'team11-non-production-database.cxlgfoh4iee5.eu-west-1.rds.amazonaws.com',
  dynamodbTableName: 'team11_non_prod_table',
}

const PRODUCTION_ENVIRONMENT = {
  environmentName: 'production',
  databaseName: 'team11_prod_db',
  hostName:
    'team11-production-database.cxlgfoh4iee5.eu-west-1.rds.amazonaws.com',
  dynamodbTableName: 'team11_prod_table',
}

export {
  API_VERSION,
  port,
  EMAIL_SERVICE,
  CONTENT_TYPE_JSON,
  NON_PRODUCTION_ENVIRONMENT,
  PRODUCTION_ENVIRONMENT,
}
