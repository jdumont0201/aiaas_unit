

const express = require('express')
const cors = require("cors")
var path = require('path');
var bodyParser = require('body-parser')

const storage = require("../storage/storage")
const notify = require("../log/notification")

///////////////////////////////////////////////////////////////
//  PARAMS
///////////////////////////////////////////////////////////////
const PORT = 3012
const version = "1.3.4"
const name = "Text-to-Speech / Google Cloud"
const tmp = path.join(__dirname, "/data/");
const bucketName = 'aiaas_texttospeech';


module.exports = {
  getNewServer:function(name,version){
    
    const app = express()
    app.use(cors())
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    //app.use(bodyParser.urlencoded({  extended: true}));     // to support URL-encoded bodies
    app.use(express.json());       // to support JSON-encoded bodies
    //app.use(express.urlencoded()); // to support URL-encoded bodies
    app.use((err, request, response, next) => {
      console.log(err)
      response.status(500).json({ error: err })
    })
        
    ///////////////////////////////////////////////////////////////
    //  PING
    ///////////////////////////////////////////////////////////////
    app.get('/', (req, res) => {
      res.json({ status: "live", version: version, name: name })
    });

    return app;
  },

  addTask:function(app,f){
    
    if(!app) console.error("No server given. Please use addTask(serv,f).")
    if(!f) console.error("No task function given. Please use addTask(serv,f).")
    
    app.post('/run',async (req,res)=>{

      var authOptions= {
          token: req.body.token,
          service: req.body.service
        };
      //LOG USER JOB 
      notify.notify(authOptions)

      f(req,res)
    });
  },
  startServer:function(serv){
    
    if(!serv) {console.error("No server given. Please use startServer(serv).") ;return;}
    serv.listen(PORT, () => console.log("NAME     : " + name + "\nVERSION  : " + version + "\nPORT     : "+PORT+"\nSTATUS   : Listening"))
  }
}




