const SocketClient = require('socket.io-client');
const mysql = require('mysql');
const redis = require('redis');
const dbAPI = require('../db');

describe('socket, db and cache', () => {
  let db;
  let socket;
  let cache;
  let receivedMsgs;
  beforeAll(() => {
    socket = SocketClient('http://localhost:8000');
    cache = redis.createClient({
      host: 'localhost',
      port: 6379,
    });
    db = mysql.createConnection({
      host: process.env.db || 'db',
      user: 'root',
      password: process.env.dbpassword === '' ? '' : 'testpass',
      database: 'challenge',
      multipleStatements: true,
    });
    db.connect();
    socket.on('receiveMsgs', (messages) => {
      receivedMsgs = messages.length;
    });
  });

  afterAll(() => {
    db.end();
  })

  it('should create users and messages table', (done) =>{
    db.query('show tables', (err, result) => {
      if (err) {
        throw err;
      } else {
        expect(Array.from(result)).toContainEqual({"Tables_in_challenge": "users"});
        expect(Array.from(result)).toContainEqual({"Tables_in_challenge": "messages"});
        done();
      }
    })
  });

  it('should add user to users table', (done) => {
     db.query('select count(*) as count from users', (err, count1) => {
       if (err) {
         throw err;
       }
       dbAPI.addUser(`testUser${Date.now().toString()}`, (err) => {
         if (err) {
           throw err;
         }
         db.query('select count(*) as count from users', (err, count2) => {
           if (err) {
             throw err;
            }
            expect(count1[0].count + 1).toBe(count2[0].count);
            done();
          });
       });
     });
  });
  
  it('should insert new message into the cache and db when sendMessage is emitted', (done) => {
     const ts = Math.floor(Date.now()/1000);
     const testMessage = {user: "test1", ts: ts, text: "test123" };
     socket.emit('sendMessage', testMessage);
     setTimeout(() => {
       cache.lrange('messages', 0, 0, (err, message) => {
         if (err) {
           throw err;
         }
         expect(message[0]).toEqual(JSON.stringify(testMessage));
         db.query('select text from messages where user ="test1" order by ts desc limit 1', (err, text) => {
          if (err) {
            throw err;
          } 
          expect(text[0].text).toEqual('test123');
          done();
        });
       });
       
     }, 500);
  });
  it('should emit receiveMsgs when fetchMessage is emitted', (done) => {
    socket.emit('fetchMessages');
    setTimeout(() => {
      expect(receivedMsgs).toEqual(200);
      done();
    }, 500);
  });
});