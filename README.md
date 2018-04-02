# Chatter Box

## set up
Fork the repo and clone to local repository

### Use docker
compose db first and make sure db is ready before compose fullstack
- "docker-compose up db"
- Please wait 30s after db is up, then run "docker-compose up fullstack"
- go to: http:// localhost:13000

### Not use docker
- make sure you have MySQL and Redis installed
- configure the connection params in backend-node/constants.js
- npm install 
- go to backend-node/ and run npm install
- run node app.js
- in frontend-react/src/App.jsx & frontend-react/src/ChatBox.jsx, switch BACKEND_IP to 'http://localhost:8000'
- run npm start and it will open a window on browser 'http://localhost:3000'

## Test
- npm install --save jest
- Run 'jest' in terminal

## Overview & Assumptions
Build real- time chat app (MVP)
- A single-room chatterbox
- Need to have persistent database
- Scalable and flexible system

## Tech Stacks 
Node.js, Express, Socket.io, Redis, React, Jest and MySQL

## User Stories
- As a user, I want to log in to the chat room, so that I can see my missed messages since last logout.
- As a user, I want to send messages, so that everyone else in the room can see my messages.
- As a user, I want to see all the messages in the chat room in real-time.
- As a user, I want to see how many users and who are they in the same chat room with me.

## System Architecture
![alt tag](https://i.imgur.com/PeygIvQ.png)

- Redis is used as a session store and a cache

- Redis cache will contain the latest 200 messages and logged in users

- Fetching data from MySQL will happen only once when a new server is up, and then the cache is stay on sync with user activites through socket

- User log in through http request, and once they are authenticated, a socket client is opened to pub/sub message to the cache

- Serve user at most 200 messages at once, and older messages will be served by quering the database using infinite scroll

- Each message is inserted to MySQL right after add the message to the cache

- When an existed user log in again to the chat room, the user is notifyed how many messages did he/she miss since last log out timestamp

- The server will first compare the timestamp of 100th message in the cache with the user's last log out timestamp

- If the user log out too long ago, just notify the user has missed 100+ messages, else will query the database to get a accurate number under 100

## Features
- Authentication and session
- Send & receive message in real-time across different users
- Receive message without refreshing page
- Infinite scroll message loading
- Link detection in message
- User join notification
- User left notification

## Tech Debts
- Implement object upload
- Implement a nice UI
- Password + salt for authentication
- Set up load balancer and test benchmark for scaling
- Write more tests

