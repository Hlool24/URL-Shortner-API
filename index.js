require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const dburl= 'mongodb+srv://user-1:1234@cluster0.dlmck.mongodb.net/urlshortner?retryWrites=true&w=majority';

//Schema
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl : Number
})

const urlShortner = mongoose.model('urlShortner', urlSchema)

//connect to database
mongoose.connect(dburl)
.then(result => {
  app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
})
.catch(err => console.log(err))

// Basic Configuration
const port = process.env.PORT || 3000;
 

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: true }));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.post('/api/shorturl', (req,res) => {

  const original_URL = req.body.url;

  let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);

if(!original_URL.match(urlRegex)){
  res.json({error: 'Invalid URL'})
	return
}
      const findOne = urlShortner.findOne({originalUrl:original_URL})
      .then(result => {
        if(result === null){
          let randomNo = Math.floor(Math.random()*10000);
          const create = new urlShortner({
            originalUrl:original_URL,
            shortUrl:randomNo
          })
            create.save()
            .then(result => res.status(200).json({"original_url":result.originalUrl,"short_url":result.shortUrl}))
            .catch(err => console.log(err))
        }
        else{
        res.status(200).json({"original_url":result.originalUrl,"short_url":result.shortUrl})}})
      
      .catch(err => console.log(err))


})

app.get('/api/shorturl/:id',(req,res) =>  {
  const shortURL = req.params.id;

  urlShortner.findOne({shortUrl:shortURL})
  .then(result =>{
    if(result)
    res.redirect(result.originalUrl)
    else 
    res.json({error:"NOT FOUND"})
  })
  .catch(err => console.log(err))
})



