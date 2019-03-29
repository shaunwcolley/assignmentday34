const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const app = express()
const path = require('path')
const VIEWS_PATH = path.join(__dirname, '/views')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
let session = require('express-session')

app.use(bodyParser.urlencoded({ extended: false }))
//Set up css directory to allow files to refer to stylesheet in there
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))
//app.use('/socket.io',express.static('/socket.io'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials'))
app.set('views', './views')
app.set('view engine', 'mustache')

let users = [
  {username: "a", password: "a"},
  {username: "b", password: "b"}
]

let trips = [
{ id: 0,
  title: "DC Trip",
  image: "https://cdn12.picryl.com/photo/2016/12/31/washington-monument-washington-dc-national-mall-places-monuments-02bc85-1024.jpg",
  departureDate: "September 25, 2018",
  returnDate: "September 30, 2018",
  username: "b"
},
{ id: 1,
  title: "Marseille Trip",
  image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Marseille-la-nuit-by-F.Laffont-feraud.jpg",
  departureDate: "June 15, 2018",
  returnDate: "June 30, 2018",
  username: "a"
},
{ id: 2,
  title: "Santa Fe Trip",
  image: "https://c1.staticflickr.com/8/7354/9538314305_07b9ce61ec_b.jpg",
  departureDate: "May 10, 2017",
  returnDate: "May 17, 2017",
  username: "a"
}
]

app.get('/', function(req,res){
  res.render('home')
})

app.get('/trips', function(req,res){
  if(req.session.username){
    let userTrips = trips.filter(function(trip){
      return trip.username == req.session.username
    })
    res.render('index', {trips: userTrips})
  }
  else {
    res.render('home', {message: "Nice try, login first!"})
  }

})

app.get('/remove-trip', (req,res) => {
  res.render('remove-trip')
})

app.post('/remove', (req,res) => {
  let id = req.body.id
  trips = trips.filter(function(trip){
    return trip.id != id
  })
  res.redirect('/remove-trip')
})
app.get('/add-trip', (req,res)=>{
  res.render('add-trip')
})

app.post('/add-trip', (req,res) => {
  let title = req.body.title
  let image = req.body.image
  let departureDate = req.body.departureDate
  let returnDate = req.body.departureDate

  let trip = {
    id: trips.length-1,
    title: title,
    image: image,
    departureDate: departureDate,
    returnDate: returnDate,
    username: req.session.username
  }
  trips.push(trip)
  res.redirect('/trips')
})

app.get('/login', (req,res) =>{
  chatterName = req.session.username
  res.render('login')
})

app.get('/register', (req,res) => {
  res.render('register')
})

app.post('/register', (req,res) => {
  let username = req.body.username
  let password = req.body.password

  let user = {username: username, password: password}
  users.push(user)
  res.redirect('/login')
})

app.post('/login', (req, res) => {
  chatterName = req.session.username
  let username = req.body.username
  let password = req.body.password

  let persistedUser = users.find((user) => {
    return user.username == username && user.password == password
  })
  if(persistedUser) {
    if(req.session){
      req.session.username = persistedUser.username
      res.redirect('/trips')
    }
  }else {
    res.render('login', {message: 'Sorry, invalid password or username (or both!). Please, try again'})
  }
})
app.post('/signout', (req,res) => {
  if (req.session) {
    req.session.destroy(function() {
        res.redirect('/login')
    })
  } else{
    res.render('home', {message: "Sorry, you were never logged in to begin with ..."})
  }
})

let chatterName = ""
let members =[]

app.get('/chat', (req, res) => {
  if (req.session.username) {
    res.render('chat', {name: req.session.username})
  } else {
    res.render('home', {message: "Nice try, login first!"})
  }
})

let chatHistory = []

io.on('connection', (socket) => {
  console.log('Someone logged onto chat ...')
  let clients = Object.keys(io.sockets.sockets)
  io.sockets.emit('newChat', { chatHistory: chatHistory, users: clients.length})
  socket.on('trips', (data) => {
    chatHistory.push(data)
    io.sockets.emit('trips', { data:data, users: clients.length })
  })
})


server.listen(3000)

/*
app.listen(3000,function(){
  console.log("Enjoy it while it's still being served ...")
}) */
