var express = require('express');
var router = express.Router();
var db=require('../db');
//best 상품 목록

router.get('/',function(req,res){
    var sql='select *,format(price, 3) fprice from best where isShow=true';
    db.get().query(sql, function(err,rows){
        res.send(rows);

    })

})

router.get('/list',function(req,res){
    var sql='select *,format(price, 3) fprice from best order by id desc';
    db.get().query(sql, function(err,rows){
        res.send(rows);

    })

})


router.post('/toggle',function(req,res){
    var isShow=req.body.isShow;
    var id = req.body.id;
    var sql='update best set isShow=? where id=?';
    db.get().query(sql, [isShow, id], function(err,rows){
        res.sendStatus(200);
    })
})

//베스트 상품 등록
var multer = require('multer');
var upload = multer({
        storage: multer.diskStorage({
            destination:(req, file, done)=>{
                done(null, './public/product')
            },
            filename:(req,file,done)=>{
                done(null, Date.now()+'_'+file.originalname)
            }
        
    
})
})
router.post('/insert', upload.single('image'), function(req, res){
    var title=req.body.title;
    var price=req.body.price;
    var category=req.body.category;
    var linkImg='/product/'+ req.file.filename;
    var sql='insert into best(title,price,category,linkImg) values(?,?,?,?)';
    db.get().query(sql,[title,price,category,linkImg],function(err,rows){
        res.sendStatus(200);
    })
})


//Best read
router.get('/read/:id',function(req,res){
    var id=req.params.id;
    var sql='select *, date_format(wdate,"%Y-%m-%d %T") fdate,format(price,3) fprice from best where id=?';
    db.get().query(sql, [id], function(err,rows){
        res.send(rows[0]);
    })
})

var fs = require('fs');
router.post('/delete',function(req,res){
    var url=req.body.url;
    var id= req.body.id;
    var sql='delete from best where id=?';
    db.get().query(sql,[id],function(err,rows){
        res.sendStatus(200)
        fs.unlink(url, function(err){
            if(err) console.log('err......'+err);
        });

    })
  
})
module.exports = router;
