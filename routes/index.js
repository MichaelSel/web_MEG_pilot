var express = require('express');
var router = express.Router();
var getFunc = require("../bin/gefFunc.js")
var s3connection = require("../bin/s3connection.js")





router.get('*', function(req,res,next) {


  if(req.query.study) req.session.study_no = req.query.study

  if(!req.session.study_no) req.session.study_no = 1




  if(!req.session.sona) {

    var sona = req.query.participant; // $_GET["id"]
    var set_forced = req.query.set; // $_GET["id"]
    if(set_forced!=undefined && set_forced!="") req.session.set = set_forced
    if(!sona) {
      return res.status(403).end("1This is not a valid URL. <br>Your session may have expired. You'll have to press the original link you used")
    }
    req.session.sona = sona
  }
  next()
})


router.get('*', function(req,res,next) {
  if(!req.session.chrome) {
    var ua = req.headers['user-agent'],
        $ = {};

    if (/chrome/i.test(ua)) req.session.chrome = true
    else req.session.chrome = false

    if(req.session.chrome)  return next()
    else return res.render('chrome', { title: 'Chrome Required'});
  }

  next()

})





router.post('/save', function (req, res) {
  var subject = req.body.subject;
  var block = req.body.block
  var data = req.body.data
  if(subject==undefined || data == undefined || block == undefined) return res.status(500).send("Something went wrong.")
  const params = {
    Bucket: 'cadseg', // pass your bucket name
    Key:  subject + "/csv/" + subject + "_block_" + block + ".json",
    Body: data
  };
  var s3 = s3connection.s3
  s3.upload(params, function(s3Err, data) {
    if (s3Err) {
      return res.status(500).send("Something went wrong.")
      console.log(s3Err)
    }
    return  res.status(200).send("File uploaded successfully")
    console.log(`File uploaded successfully at ${data.Location}`)
  });


});
router.post('/savechunk', function (req, res) {
  var subject = req.body.subject;
  var block = req.body.block
  var data = req.body.data
  var chunk = req.body.chunk
  if(subject==undefined || data == undefined || block == undefined || chunk == undefined) return res.status(500).send("Something went wrong.")
  console.log(1)
  data = JSON.parse(data)
  console.log(data,2)
  data = JSON2CSV(data);
  console.log(data,3)
  const params = {
    Bucket: 'cadseg', // pass your bucket name
    Key: subject + "/results/block_" + block + "_" + chunk +".csv", // file will be saved as testBucket/contacts.csv
    Body: data
  };
  console.log(params)
  var s3 = s3connection.s3
  s3.upload(params, function(s3Err, data) {
    if (s3Err) {
      return res.status(500).send("Something went wrong.")
      console.log(s3Err)
    }
    return  res.status(200).send("File uploaded successfully")
    console.log(`File uploaded successfully at ${data.Location}`)
  });


});



router.get('/deob', function(req, res, next) {
  set = req.query["set"]
  if(set==undefined) return res.status(200).send("Subject found");
  set = getFunc.deobfuscate(set)
  res.status(200).send(set)
})
router.get('/ob', function(req, res, next) {
  set = req.query["set"]
  if(set==undefined) return res.status(200).send("Subject found");
  set = getFunc.obfuscate(set)
  res.status(200).send(set)
})


router.get('/consent', function(req, res, next) {
  res.render('consent', { title: 'Consent Form'});
})
router.get('/underage', function(req, res, next) {
  res.render('underage', { title: 'Parental Consent Form'});
})

router.get('/consented', function(req, res, next) {
  req.session.censented = true
  return res.redirect('/')
})



router.get('/', function(req, res, next) {
  if(!req.session.chrome) return res.redirect('/chrome')
  if(!req.session.censented) return res.redirect('/consent')

  var s3 = s3connection.s3
  var params = {Bucket: 'cadseg', Key: "MEGp_available.txt"};

  s3.getObject(params, function(err, data) {
    // Handle any error and exit
    if (err)
      return err;
    // console.log(data)
    sets = data.Body.toString()
    sets = sets.split('\n')

    // console.log(sets)
    if((typeof req.session.set)!="string") req.session.set = String(sets[0]).replace(/(\r\n|\n|\r)/gm, "")
    sets = sets.slice(1,sets.length)
    var txt = sets.join('\n')

    // params.Body = Buffer.from
    s3.putObject({
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType:'text/plain',
      Body: txt
    }, function (err,data) {
      if(err) console.log(err)
      else console.log(data)
      if(req.session.set.length==0) return res.status(500).end("Out of test sets. The experiment cannot continue")
      return next()
    })

  })

});



router.get('/', function(req, res, next) {
  var set = req.session.set
  var sona = req.session.sona
  var study = req.session.study_no
  console.log("Study is", study)
  res.render('index', { title: 'Express',subject:set,sona:sona,study:study});
});

module.exports = router;




