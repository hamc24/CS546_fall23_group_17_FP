const middleware = (app) => {
    app.get('/protected', async (req, res, next) => {
        try {
            if (!req.session.user)
                res.status(200).redirect('/login');
            else
                next();
            }
            catch (error) {}
        }
    );
};

export default middleware;
