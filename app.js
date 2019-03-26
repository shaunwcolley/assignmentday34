const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
//Set up css directory to allow files to refer to stylesheet in there
app.use(express.static('css'))

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

let trips = [
{ id: 0,
  title: "DC Trip",
  image: "https://cdn12.picryl.com/photo/2016/12/31/washington-monument-washington-dc-national-mall-places-monuments-02bc85-1024.jpg",
  departureDate: "September 25, 2018",
  returnDate: "September 30, 2018"
},
{ id: 1,
  title: "Marseille Trip",
  image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Marseille-la-nuit-by-F.Laffont-feraud.jpg",
  departureDate: "June 15, 2018",
  returnDate: "June 30, 2018"
},
{ id: 2,
  title: "Santa Fe Trip",
  image: "https://c1.staticflickr.com/8/7354/9538314305_07b9ce61ec_b.jpg",
  departureDate: "May 10, 2017",
  returnDate: "May 17, 2017"
}
]

app.get('/trips', function(req,res){
  res.render('index', {trips: trips})
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
    returnDate: returnDate
  }
  trips.push(trip)
  res.redirect('/trips')
})

app.listen(3000,function(){
  console.log("Enjoy it while it's still being served ...")
})
