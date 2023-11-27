# Team 11 - Backend

The "Hack-Attack" (Working title) web application is a web-based game focused on educating developers on the technical aspects of cyber security, such as DDOS Attacks or SQL Injection. 

This service has been created to provide the backend Cloudformation Stack of the Hack-Attack web application. 

The cloudformation stack contains a MySQL database, which we use to store user accounts and results from playthroughs.

The database password is automatically generated using AWS SecretsManager, and passed into the lambdas which require access to the database.

It also contains a API Gateway REST API which contains three lambdas: health, login and register. 

## Technology Used

* AWS CDK - https://aws.amazon.com/cdk/
* AWS Cloudformation - https://aws.amazon.com/cloudformation/
* AWS Lambda - https://aws.amazon.com/lambda/
* AWS RDS - https://aws.amazon.com/rds/
* AWS API Gateway - https://aws.amazon.com/api-gateway/
* AWS IAM - https://aws.amazon.com/iam/
* AWS VPC - https://aws.amazon.com/vpc/

## Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Features

* Login Lambda
- Takes a username and password as parameters and checks that a matching account can be found in the database

* Register lambda
- Takes user details (forename, surname, email, username, password) as parameters and adds a new account to the database.

* Health Lambda
- Returns a status code 200 if the service is online.
