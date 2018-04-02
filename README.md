#Chatter Box

## set up
### use docker
- docker-compose up fullstack
- go to: http:// localhost:13000

### fork the repo and clone to local repository
- make sure you have MySQL and Redis installed
- configure the connection params in backend-node/constants.js
- run npm install
- go to backend-node/ and run node app.js
- in frontend-react/src/App.jsx & frontend-react/src/ChatBox.jsx, switch BACKEND_IP to 'http://localhost:8000'
- run npm start and it will open a window on browser 'http://localhost:3000'

## Test
- run jest

## Overview & Assumptions
Build real- time chat app
- A single-room chatterbox
- Need to have persistent database
- Scalable and flexible system

## Tech Stacks 
Node.js, Express, Socket.io, Redis, React, Jest and MySQL

## User Stories
As a user, I want to log in to the chat room, so that I can see my missed messages since last logout.
As a user, I want to send messages, so that everyone else in the room can see my messages.
As a user, I want to see all the messages in the chat room in real-time.
As a user, I want to see how many users and who are they in the same chat room with me.

## System Architecture
![alt tag](https://i.imgur.com/PeygIvQ.png)

- Redis is used here as a session store and a cache.
- Redis cache will keep track of the latest 200 messages and online users.
- Fetching data from MySQL will happen only once when a new server is up, and then the cache is stay on sync with user activites through socket.
- User log in through http request, and once they are authenticated, a socket client is opened to pub/sub message to cache.
- Serve user at most 200 messages at once, and older messages will be served by quering the database using infinite scroll.
- Data insertion to MySQL db happend right after a message is added to the cache.
- When an existed user log in again to the chat room, it will first query if the timestamp of 100th message in cache is later than the user's last log out timestamp, which will indicate if the user has missed more than 100 messages. If so, just notify the user missed 100+ messages, else will query the database to get a accurate number. This will avoid to scan through the whole database.

## Features
Authentication and session
Send & receive message in real-time across different users
Receive message without refreshing page
Infinite scroll message loading
Link detection in message
User join notification
User left notification

## Tech Debts
Implement object upload
Implement a nice UI
Write more tests

