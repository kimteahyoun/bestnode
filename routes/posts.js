var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET users listing. */
router.get('/', function(req, res, next) {
    var page=parseInt(req.query.page);
    var query=`'%${req.query.word}%'`;
    var start=(page-1) * 10;
    var sql='select *,date_format(wdate,"%Y-%m-%d %T") fdate from posts'
    
    var condition=` where title like ${query} or userid like ${query}`
    sql+=condition + 'order by id desc limit ?,10';
    
    db.get().query(sql,[start], (err,rows)=>{
        var list=rows;
        sql='select count(*) cnt from posts' +condition;
        db.get().query(sql,function(err,rows){
            res.send({total:rows[0].cnt, list:list});
        })
           
            
    })

    })


    //post insert 
    router.post('/insert',function(req,res){
        var title=req.body.title;
        var body=req.body.body;
        var userid=req.body.userid;
        var sql='insert into posts(title,body,userid) values(?,?,?)';
        db.get().query(sql,[title,body,userid], function(err,rows){
            res.sendStatus(200);
        }) 
    
});

router.get('/:id',function(req,res){
    var id=req.params.id;
    var sql='select *,date_format(wdate,"%Y-%m-%d %T") fdate from posts where id=?';
    db.get().query(sql, [id], function(err, rows){
        res.send(rows[0]);
    })
})
//post delete
router.get('/delete/:id',function(err,res){
    var id=req.params.id;
    var sql='delete from posts where id=?';
    db.get().query(sql, [id], function(err,rows){
        res.sendStatus(200);
    })
})

//post update
router.post('/update',function(req,res){
    var id=req.body.id;
    var title=req.body.title;
    var body=req.body.body;
  
    var sql='update posts set title=?,body=?,wdate=now() where id=?';
    
    db.get().query(sql,[title,body,id], function(err,rows){
        res.sendStatus(200);
    }) 

});




module.exports = router;
