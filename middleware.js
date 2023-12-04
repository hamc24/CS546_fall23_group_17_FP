const exportedMethod = {
    async privateProtect(req, res, next){
        
        if (!req.session.user)
            res.status(200).redirect('/login');
        else
            next();            
        },


    async checkAdmin(res,req,next){
        if (req.session.user){
            res.status(200).redirect('/login');
            if(req.session.user.role != 'admin'){
                return res.status(403).render('error',{error:" user does not have permission to view the page"});
            }
        }else{
            next();            
        }
    }
}

export default exportedMethod;
