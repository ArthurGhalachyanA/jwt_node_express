const tokenService = require('../services/tokenService');

module.exports = function (req, res, next){
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return res.status(401).json();
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return res.status(401).json();
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            return res.status(401).json();
        }

        req.user = userData;
        next();
    }catch (e) {
        return res.status(401).json();
    }
};