const apiResponse = require('../helpers/apiResponse');
const WorkspaceModel = require('../models/workspaceModel');
const WorkspaceService = require('../services/workspaceService');
const {validationResult} = require('express-validator');

class workspaceController{
    async getWorkspaces(req, res){
        const response = new apiResponse();

        response.workspaces = await WorkspaceModel.find({userId: req.user.id});

        res.json(response);
    }

    async getWorkspaceBySlug(req, res){
        const response = new apiResponse();
        const {slug} = req.query;

        response.workspace = await WorkspaceModel.findOne({slug, userId: req.user.id});

        if(!response.workspace)
            return res.status(204).json(response);

        res.json(response);
    }

    async createWorkspaces(req, res){
        const {slug, name} = req.body;
        const response = new apiResponse();

        response.slugExistsError = false;
        response.slugSuggests = [];

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            response.validationErrors = errors.array();
            return res.status(400).json(response);
        }

        const workspace = await WorkspaceModel.findOne({userId: req.user.id, slug});
        if(workspace){
            response.slugExistsError = true;
            response.validationErrors.push({param: 'slug', msg: 'slug what you use exists. Please change it (suggests below)'});
            response.slugSuggests = await WorkspaceService.getResolvedSlugs(slug, req.user.id);

            return res.status(400).json(response);
        }

        await WorkspaceModel.create({userId: req.user.id, name, slug});

        res.status(201).json(response);
    }

    async deleteWorkspaces(req, res){
        const response = new apiResponse();
        const {_id} = req.body;
        try {
            await WorkspaceModel.deleteOne({userId: req.user.id, _id: _id});
            res.status(202).json(response);
        }catch (e) {
            res.status(204).json(response);
        }
    }

    async updateWorkspaces(req, res){
        const {_id, name, slug} = req.body;
        const response = new apiResponse();

        response.slugExistsError = false;
        response.slugSuggests = [];

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            response.validationErrors = errors.array();
            return res.status(400).json(response);
        }

        const workspace = await WorkspaceModel.findOne({userId: req.user.id, slug, _id: {$ne : _id}});
        if(workspace){
            response.slugExistsError = true;
            response.validationErrors.push({param: 'slug', msg: 'slug what you use exists. Please change it (suggests below)'});
            response.slugSuggests = await WorkspaceService.getResolvedSlugs(slug, req.user.id, _id);

            return res.status(400).json(response);
        }

        try {
            await WorkspaceModel.updateOne(
                {_id: _id, userId : req.user.id},
                {
                    $set :{
                        name : name,
                        slug : slug
                    }
                }
            );
        }catch (e) {
            return res.status(400).json(response);
        }

        res.status(201).json(response);
    }
}

module.exports = new workspaceController();