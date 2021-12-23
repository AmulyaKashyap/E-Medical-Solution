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
    return res.render('findDoctor',{
        title:"MediCare|Find-Doctors",
        layout:'layout'
    }); 
}
module.exports.blogs =function(req,res){
    return res.render('blogs',{
        title:"MediCare|Blogs",
        layout:'layout'
    }); 
}

//module.exports.action =function(req,res){}