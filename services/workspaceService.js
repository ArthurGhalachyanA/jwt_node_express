const WorkspaceModel = require('../models/workspaceModel');

class WorkspaceService{
    async getResolvedSlugs(sentSlug, userId, workspaceId = null, count = 3){
        let idOfSlug = 0;
        const resolvedSlugs = [];
        const match = /[0-9]+$/.exec(sentSlug);

        if(match && match[0]){
            sentSlug = sentSlug.slice(0, match['index']);
            idOfSlug = parseInt(match[0]);
        }

        while(resolvedSlugs.length < count){
            const slug = sentSlug + ++idOfSlug;
            const workspace = await WorkspaceModel.findOne({userId, slug, _id: {$ne : workspaceId}});

            if(!workspace)
                resolvedSlugs.push(slug);
        }

        return resolvedSlugs;
    }
}

module.exports = new WorkspaceService();