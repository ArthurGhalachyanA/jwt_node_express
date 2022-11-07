const jwt = require('jsonwebtoken');
const TokenModel = require('../models/tokenModel');

class TokenService{
    async generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch (e) {
            return null;
        }
    }

    validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await TokenModel.findOne({user: userId});

        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }

        return await TokenModel.create({user: userId, refreshToken});
    }

    async findToken(refreshToken){
        const tokenData = await TokenModel.findOne({refreshToken});

        return tokenData;
    }
}

module.exports = new TokenService();