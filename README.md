# Overview

Application has five main components i.e. APIs, database, kafka, email scheduler and email sender. User can be created via api. There are other apis as well for querying, deletion and pagination fetching. These apis are there for demonstration purposes. A pagination framework and query builder has been implemented as well. Application starts with a single docker command. Emails are created in database on startup. As soon as the user is created, user will start to receive emails.

# Prerequisites

- Docker
- Docker Compose
- ```sendgrid API key``` (It's not a hard requirement, emails will only be sent if valid api key and from email has been provided. Otherwise the invalid api_key errors will appear in logs but the functionality of application will not be impacted. It will needs to be pasted in ```docker-compose.yaml``` file along with associated email.

# Setting up & Running

Clone the repository and run it.

```bash
  git clone https://github.com/usman6/email-scheduler.git
  cd email-scheduler
  docker-compose up
```
Emails are created in database on application startup.

Create user...

```bash
curl --location --request POST '127.0.0.1:8080/api/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fullName": "abc",
    "email": "abc@xyz.com"
}'
```

# Swagger Documentation

Swagger UI based API docs are available at the following end point. It is for demonstration purpose. It is not a complete documentation. Postman collection contains complete documentation.

```{host:port}/v1/api-docs/```

# Postman Collection

Postman collection of APIs is available in scripts folder of email-manager-api.

# Project Components

- MySQL Database
- Kafka
- Email Manager APIs
- Email Scheduler
- Email Sender


## 1) Email Manager APIs

- CRUD operations for creating users, fetch users along with emails that have been sent to users and fetching emails.
- It has a pagination and querying mechanism implemented for demonstration.
- There is a proper error handling framework implemented. 
- It has a middleware for future implementation of authentication but authentication is not implemented.
- Some unit tests are there as well. They are simple and for demonstration only.
- It has proper mechanism to pass environment configuration variables.

## 2) Email Schduler

- It fetches emails from email manager-api
- It fetches users along with the emails that have been sent to users previously. To avoid multiple round trips to database and api, we are fetching users and associated emails in single call.
- It is executed by a cron job once clock completes a minute. 
- It iterates through users and then compares the sent emails of each user with that of all others emails and create an array of email id's that have not been sent to that user yet. Then it selects an email from that array and create an email object comprising of user email, email subject and email text. This email object is sent to kafka topic named 'email'.
- While iterating through users and after producing email object to kafka topic, it creates an object containing ```userId``` and ```emailId``` and adds it to an array. This array of objects is posted to email-manager-api and ```users-emails``` association is updated in database. This is basically the sent emails for user. 

## 3) Email Sender

This is the final step in process of sending an email to respective user. Emails are picked up synchronously and sent to users using sendgrid api. If api key is invalid, it logs an error and it never crashes. It accepts an environment variable named ```MAX_RETRY_COUNT```. This variable specifies the maximum number of retries after failing which the email would not be tried to sent again. The consumer is attached to kafka topi as a group which will be beneficial in case of horizontal scaling having multiple senders for sending emails. Email sender is set to start consuming messages from ```email``` topic from where it left last hence avoiding duplicates. The part when a user's list of sent email is updated in email scheduler could have been implemented in email sender instead of email scheduler so that it only updates the users sent email list if email is sent successfully. I have kept it in scheduler as without sendgrid api key all emails would be tried again and again.

## 4) Tests

Some unit tests have been added in email-manager-api. Integration tests can also be added by mocking kafka and sendgrid. 

# To Do

- Implement caching
- Enhance unit testing
- Integration tests


