var express = require('express');
var router = express.Router();
var db=require('../db');


var multer = require('multer');
var upload = multer({
        storage: multer.diskStorage({
            destination:(req, file, done)=>{
                done(null, './public/photos')
            },
            filename:(req,file,done)=>{
                done(null, Date.now()+'_'+file.originalname)
            }
        
    
})
})

router.post('/insert',upload.single('image'), function(req,res){
    var name=req.body.name;
    var job=req.body.job;
    var birthday=req.body.birthday;
    var gender=req.body.gender;
    var image='/photos/' + req.file.filename;
    var sql='insert into customers(name,job,birthday,gender,image) values(?,?,?,?,?)'
   
    db.get().query(sql,[name,job,birthday,gender,image],function(err,rows){
        res.sendStatus(200)
    })
})


//고객 탈퇴/복원
router.post('/change',function(req,res){
    var id=req.body.id;
    var state=req.body.state
    var sql='update customers set state= ? where id=?';
    db.get().query(sql,[state, id], function(err,rows){
        res.sendStatus(200);
    })
})
 

router.get('/chart/job_gender',function(req,res){
    var sql="call count_job_gender"
    db.get().query(sql, function(err, rows){
        var genders=rows[0];
        var jobs=rows[1];
        var list=rows[2];


        var row=[];
        var col=[];
        col.push('직업명');
        for(var i=0; i<genders.length; i++){
            var item=genders[i];
            col.push(item.gender);
        }
        //데이터 행들
        row.push(col);
        var index=0;
        for(var i=0; i<jobs.length; i++){
            var col=[];
            for(var j=0; j < genders.length; j++){
                var item=list[index];
                if(col.length==0) col.push(item.job);
                col.push(item.count);
                index=index + 1;
      
            
            }
            row.push(col)
        }
        res.send(row)
    })
})
router.get('/chart/:type',function(req, res){
    var type=req.params.type;
    var sql='';
    switch(type){
        case '1'://직업별 인원수
        sql="select job, count(*) count from customers group by job order by job";
        break;
        case '2':
            sql='select gender, count(*) count from customers group by gender'
            break;
        case '3':
            sql="select month(jdate) month, count(*) count";
            sql +="from customers";
            sql +="where year(jdate)='2022'";
            sql +="group by month";
            sql +="order by month";
            break;

    }
    db.get().query(sql, function(err,rows){
        res.send(rows);
    })
})



module.exports = router;