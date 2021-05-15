var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')
const mime = require('mime-types')
const fs = require('fs')
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/file/:file', (req, res) => {
  const {file} = req.params
  res.sendFile(process.cwd() +'/uploads/'+file)
})

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb("", `${file.originalname}.${mime.extension(file.mimetype)}`)
  }
})

const upload = multer({
  storage: storage
})


app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  const {originalname: name, mimetype: type, size} = req.file
  res.json({
    name,
    type,
    size
  })
} )

app.get('/api/files', (req,res) => {
  fs.readdir(process.cwd() + '/uploads', (err, files) => {
    if(err) console.log(err)
    res.json(files)
  })
})




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
