const Blogs = require("../models/blogs");
const Doctor =require("../models/doctor");

module.exports.home =function(req,res){
    return res.render('home',{
        title:"MediCare"
    }); 
}
module.exports.homeP =function(req,res){
    return res.render('home-page',{
        title:"MediCare",
        layout:'layoutN'
    }); 
}
module.exports.findDoc =function(req,res){
    Doctor.find({},function(err,docs){
        return res.render('findDoctor',{
            title:"MediCare|Find-Doctors",
            layout:'layout',
            docs:docs
        });
    }); 
}
module.exports.findDocS =function(req,res){
    Doctor.find({$or:[ {'name':req.body.docName}, {'address.city':req.body.City},{'specialization':req.body.dept} ]},function(err,docs){
        return res.render('findDoctor',{
            title:"MediCare|Find-Doctors",
            layout:'layout',
            docs:docs
        });
    }); 
}

module.exports.forgotPass=function(req,res){
    return res.render('forgotPass',{
        title:"MediCare|Forgot",
        layout:'layout'
    }); 
}
module.exports.blogs =function(req,res){
    Blogs.find({}).populate('uploadBy').exec(function(err,blogs){
    return res.render('blogs',{
        title:"MediCare|Blogs",
        layout:'layout',
        blogs:blogs
    }); 
});
}

module.exports.aptSuccess=function(req,res){
    return res.render('rateUs',{
        title:"MediCare|Forgot",
        layout:'layout'
    }); 
}


//module.exports.action =function(req,res){}