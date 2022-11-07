const {body} = require("express-validator");
const UserModel = require('../userModel');
const signUpBody = [
    body('fullName').notEmpty().trim().withMessage('name is require'),
    body('email').isEmail().normalizeEmail().withMessage('please write true email')
        .custom(async value => {
            return UserModel.findOne({email: value}).then(user => {
                if(user) throw new Error('email is exists');
            });
        }),

    body('email').notEmpty().withMessage('password is require'),
    body('password').isLength({ min: 6 }).withMessage('password min size 6 symbols'),
    body('password').notEmpty().withMessage('password is require'),
];

module.exports = {
    signUpBody
};
