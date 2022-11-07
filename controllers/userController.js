const {validationResult} = require('express-validator');
const UserModel = require('../models/userModel');
const TokenModel = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const tokenService = require('../services/tokenService');
const UserDto = require('../dtos/userDto');
const apiResponse = require('../helpers/apiResponse');

const COOKIE_REFRESH_TOKEN_MAX_AGE = 30*24*60*60*1000;

class UserController{
    async signUp(req, res){
        const response = new apiResponse();
        const {email, password, fullName} = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            response.validationErrors = errors.array();
            return res.status(400).json(response);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({email, password: hashPassword, fullName});

        response.user = new UserDto(user);
        response.tokens = await tokenService.generateTokens({...response.user});

        await tokenService.saveToken(response.user.id, response.tokens.refreshToken);
        res.cookie('refreshToken', response.tokens.refreshToken, {maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE, httpOnly: true});

        return res.json(response);
    }

    async login(req, res){
        const response = new apiResponse();
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});
        if(!user){
            response.errorMessage = 'email or password is wrong';
            return res.status(400).json(response);
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            response.errorMessage = 'email or password is wrong';
            return res.status(400).json(response);
        }

        response.user = new UserDto(user);
        response.tokens = await tokenService.generateTokens({...response.user});
        await tokenService.saveToken(response.user.id, response.tokens.refreshToken);
        res.cookie('refreshToken', response.tokens.refreshToken, {maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE, httpOnly: true});

        return res.status(200).json(response);
    }

    async logout(req, res){
        const response = new apiResponse();
        const {refreshToken} = req.cookies;

        await TokenModel.deleteOne({refreshToken});

        res.clearCookie('refreshToken');

        return res.json(response);
    }

    async refresh(req, res){
        const response = new apiResponse();
        const {refreshToken} = req.cookies;

        if(!refreshToken)
            res.status(401).json(response);

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDB)
            res.status(401).json(response);

        const user = await UserModel.findById(userData.id);
        response.user = new UserDto(user);
        response.tokens = await tokenService.generateTokens({...response.user});
        await tokenService.saveToken(response.user.id, response.tokens.refreshToken);

        res.cookie('refreshToken', response.tokens.refreshToken, {maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE, httpOnly: true});

        return res.json(response);
    }
}

module.exports = new UserController();