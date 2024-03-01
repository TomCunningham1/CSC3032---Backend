import { rdsMock } from '../mock_utils';
import { Environment } from '../../lib/config/environment';
import { env } from 'process';

describe('get all lambda tests', () => {

    let environment: Environment;

    describe('production', () => {

        beforeEach(() => {
            environment = new Environment('prod');
        })

        it('should contain production database name', () => {
            const databaseName = environment.databaseName;

            expect(databaseName).toBe('team11_prod_db')
        })

        it('should contain production dynamodb table name', () => {
            const dynamodbTable = environment.dynamodbTableName

            expect(dynamodbTable).toBe('team11_prod_table')
        })

        it('should contain production database host name', () => {
            const databaseHostName = environment.hostName

            expect(databaseHostName).toBe('team11-production-database.cxlgfoh4iee5.eu-west-1.rds.amazonaws.com')
        })

        it('should contain the env abbreviation for lambda names', () => {
            const abbr = environment.abbr

            expect(abbr).toBe('p')
        })

        it('should contain the database name', () => {
            const environmentName = environment.environmentName

            expect(environmentName).toBe('production')
        })
    })

    describe('non-production', () => {

        beforeEach(() => {
            environment = new Environment('non-prod');
        })

        it('should contain production database name', () => {
            const databaseName = environment.databaseName;

            expect(databaseName).toBe('team11_non_prod_db')
        })

        it('should contain production dynamodb table name', () => {
            const dynamodbTable = environment.dynamodbTableName

            expect(dynamodbTable).toBe('team11_non_prod_table')
        })

        it('should contain production database host name', () => {
            const databaseHostName = environment.hostName

            expect(databaseHostName).toBe('team11-non-production-database.cxlgfoh4iee5.eu-west-1.rds.amazonaws.com')
        })

        it('should contain the env abbreviation for lambda names', () => {
            const abbr = environment.abbr

            expect(abbr).toBe('np')
        })

        it('should contain the database name', () => {
            const environmentName = environment.environmentName

            expect(environmentName).toBe('non-production')
        })
    })

});
