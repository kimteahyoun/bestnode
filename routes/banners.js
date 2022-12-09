var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/list', function(req,res){
    var sql='select * from banner order by id desc';
    db.get().query(sql, function(err,rows){
            res.send(rows);
    })  
})
router.get('/show', function(req,res){
    var sql='select * from banner where bshow=1 order by id desc';
    db.get().query(sql, function(err,rows){
            res.send(rows);
    })  
})



//상태변경
router.post('/change', function(req,res){
    var id=req.body.id;

    var bshow=req.body.bshow
    var sql='update banner set bshow=? where id=?';
    db.get().query(sql, [bshow,id], function(err,rows){
        res.sendStatus(200)
    })


});

//파일 업로드
var multer = require('multer');
var upload = multer({
        storage: multer.diskStorage({
            destination:(req, file, done)=>{
                done(null, './public/images')
            },
            filename:(req,file,done)=>{
                done(null, Date.now()+'_'+file.originalname)
            }
        
    
})
})

router.post('/insert',upload.single('image'),function(req,res){
    var title=req.body.title;
    var url='/images/' + req.file.filename;
    var sql='insert into banner(title, url) values(?,?)';
    
    db.get().query(sql, [title,url],function(err, rows){
        res.sendStatus(200);
    });
    
    

})

router.get('/insert',function(req,res){
        res.render('insert');

})

//베너삭제
var fs = require('fs');
router.post('/delete',function(req,res){
    var url=req.body.url;
    var id= req.body.id;
    var sql='delete from banner where id=?'
    db.get().query(sql,[id],function(err,rows){
        res.sendStatus(200)
        fs.unlink(url, function(err){
            if(err) console.log('err......'+err);
        });

    })
  
})
//베너 정보리드

router.get('/read/:id',function(req,res){
    var id=req.params.id;
    var sql='select * from banner where id=?';
    db.get().query(sql,[id],function(err,rows){
        res.send(rows[0]);
    })
})
module.exports = router;