const Router = require('express').Router;
const router = new Router();

const userController = require('../controllers/userController');
const workspaceController = require('../controllers/workspaceController');

const authMiddleware = require('../middlewares/authMiddleware');
const {signUpBody} = require('../models/bodyValidation/userBody');
const {workspaceCreateUpdateBody} = require('../models/bodyValidation/workspaceBody');

router.post('/sign-up', signUpBody, userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

router.get('/workspace', authMiddleware, workspaceController.getWorkspaceBySlug);

router.get('/workspaces', authMiddleware, workspaceController.getWorkspaces);
router.put('/workspaces', [authMiddleware, workspaceCreateUpdateBody], workspaceController.updateWorkspaces);
router.post('/workspaces', [authMiddleware, workspaceCreateUpdateBody], workspaceController.createWorkspaces);
router.delete('/workspaces', authMiddleware, workspaceController.deleteWorkspaces);

module.exports = router;