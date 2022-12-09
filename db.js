var mysql=require('mysql');
var con;

exports.connect=function(){
    con=mysql.createPool({
        connectionLimit:100,
        host:'localhost',
        user:'react',
        password:'pass',
        database:'reactdb',
        port:'3306'
    })
}

exports.get=function(){
    return con;
}