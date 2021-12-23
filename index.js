const express = require('express');
const app = express();
const http  = require('http').createServer(app);
const port=8000; //80 while deploying
const cookieParser =require('cookie-parser');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const path =require('path');

const passportLocal = require('./config/passport-local-strategy');
const passportGoogle = require('./config/google-login');

const MongoStore = require('connect-mongo')(session);
//own created middleware
const flash = require('connect-flash');
const ownMiddleware = require('./config/ownMiddleware');



const io = require('socket.io')(http, {
    cors: {
      origin: '*'
    }
  });

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(http, {
  debug: true,
});

app.use("/peerjs", peerServer);


io.on('connection', (socket) => {
    console.log(' Socket Connected...')
    let counter =0
    let text=['May i know your age sir','Your weight','Please describe your syptoms so we can connect you to our best doctor','Ok,let me find a best doctor for consultant and we all are praying for your speedy recovery']
    socket.on('message', (msg) => {
        let msgg={
            user: 'Medicare',
            message: text[counter],
            count:counter++
        }
        io.emit('message', msgg)
    })
    socket.on("join-room", (roomId, userId, userName) => {
        console.log(' Socket Join...')
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on("message", (message) => {
          io.to(roomId).emit("createMessage", message, userName);
        });
      });

})


const expressLayouts = require('express-ejs-layouts');

//reading from post request
app.use(express.urlencoded());

//cookie parser
app.use(cookieParser());

//use static files:
app.use(express.static('./assets'));
app.use('/users',express.static('./assets'));
app.use('/doctors',express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles','layoutN extractStyles', true);
app.set('layout extractScripts', 'layoutN extractScripts', true);


//setting up a view engine
app.set('view engine','ejs');
app.set('views','./views');


//mongostore is used to store session cookie in the db
app.use( session({
    name:'aman',
    secret:'Pachouri',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongo setup ok');
        }
    )
    
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(ownMiddleware.setFlash);


app.use(passport.setAuthenticatedUser);


 //use express router
app.use('/',require('./routes/index'));


http.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});
