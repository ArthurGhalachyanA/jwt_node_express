const {body} = require("express-validator");

const workspaceCreateUpdateBody = [
    body('name').notEmpty().trim().withMessage('name is require'),
    body('slug').notEmpty().trim().withMessage('slug is require')
];

module.exports = {
    workspaceCreateUpdateBody
};