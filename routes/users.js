
var express = require('express');
var router = express.Router();
var db = require('../db')
/* GET users listing. */
router.get('/list', function(req, res, next) {
  var word=`%${req.query.word}%`;
  var page= req.query.page;
  var start=(page-1) * 5;
  var sql='select * from users where id like ? or uname like ? or limit ?, 5';
  db.get().query(sql,[word, word, start], function(err,rows){
      var list=rows;
      sql='select count(*) cnt from users where id like ? or uname like ?';
      db.get().query(sql,[word,word],function(err,rows){
        res.send({
          total: rows[0].cnt,
          list:list

        })
      })


  })
});
router.get('/list1', function(req,res){
  var sql='select * from users order by id desc';
  db.get().query(sql, function(err,rows){
          res.send(rows);
  })  
})
router.post('/change',function(req,res){
  var id=req.body.id;
  var status = req.body.status;
  var sql='update users set status=? where id=?'
  db.get().query(sql, [status, id], function(err,rows){
      res.sendStatus(200);
  })

})

//user read 
router.get('/read/:id',function(req,res){
    var id=req.params.id;
    var sql='select * from users where id=?';
    db.get().query(sql, [id], function(err,rows){
      res.send(rows[0])
    })
})


//login chack
router.post('/login',function(req,res){
  var id=req.body.id;
  var sql='select * from users where id=?'
  db.get().query(sql,[id], function(err, rows){
    res.send(rows[0])
  })
})
module.exports = router;
