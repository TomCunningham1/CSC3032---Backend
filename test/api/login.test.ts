import { host, port, databaseName as database } from '../../lib/config/constants';
import { createConnection, createPool } from 'mysql';

describe('login lambda tests', () => {
    it('shoud create a connection to the database', async () => {
        const testUsername = 'johndoe';
        const testPassword = 'password';
        const user = 'adminUser';
        const password = '*7\ncFbVAdcC]&+%bBb-(OwiJ}-wt7-=';

        const conn = createPool({
            host,
            port,
            user,
            password,
            database
        });

        const query = `SELECT * FROM Users WHERE Username = "${testUsername}" AND Password = "${testPassword}"`;
        const result = await conn.query(query, (error, results) => {
            if (error){
              console.log(error)
            }
            console.log(results);
          });
    });
});