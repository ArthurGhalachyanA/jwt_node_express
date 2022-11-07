const {Schema, model} = require('mongoose');

const WorkspaceSchema = Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, required: true},
    slug: {type: String, required: true},
});

module.exports = model('Workspace', WorkspaceSchema);