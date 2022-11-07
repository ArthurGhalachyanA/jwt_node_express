module.exports = class UserDto{
    constructor(model){
        this.id = model._id;
        this.email = model.email;
        this.fullName = model.fullName;
    };
};