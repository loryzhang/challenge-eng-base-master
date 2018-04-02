# Chatter Box

RUN docker-compose up fullstack
go to: http:// localhost:13000

# Overview & Assumptions
Build real- time chat app
    A single-room chatterbox
    Need to have persistent database
    Scalable and flexible system

# Tech Stacks 
Node.js, Express, Socket.io, Redis, Jest and MySQL

# User Stories
As a user, I want to log in to the chat room, so that I can see my missed messages since last logout.
As a user, I want to send messages, so that everyone else in the room can see my messages.
As a user, I want to see all the messages in the chat room in real-time.
As a user, I want to see how many users and who are they in the same chat room with me.
System Architecture
![alt tag](https://imgur.com/a/AsYDR)

Data Schema
Redis
Users: set
Messages: list
MessageCountInCache : number
MySQL
users:
Field 
Type
Description
id
Int(11)
Primary key
user
Varchar(100)
Username (UNIQUE)
email
VarChar(255)
Email (UNIQUE)
login_ts
Int(11)
Unix timestamp at login
logout_ts
Int(11)
Unix timestamp at logout

messages:
Field 
Type
Description
id
Int(11)
Primary key
user
Varchar(100)
Username
ts
Int(11)
Unix timestamp at publish
text
Varchar(255)
Text content

Features
Authentication and session
Send & receive message in real-time across different users
Receive message without refreshing page
Infinite scroll message loading
User join notification
User left notification

TEST
   RUN  jest

Tech Debts
Implement object upload
Implement a nice UI
Write more tests

