var express = require('express');

var router = express.Router();
module.exports = router

var crud = require('./sandbox/crud.js');
router.use('/crud', crud);

var sessionRouter = require('./sandbox/session.js');
router.use('/session', sessionRouter);

var authenticate = require('./sandbox/authenticate.js');
router.use('/authenticate', authenticate);

var email = require('./sandbox/email.js');
router.use('/email', email);

var configMgmt = require('./sandbox/configMgmt.js');
router.use('/configMgmt', configMgmt);

var user = require('./sandbox/user.js');
router.use('/user', user);

var mongooseCrud = require('./sandbox/mongooseCrud.js');
router.use('/mongooseCrud', mongooseCrud);

var group = require('./sandbox/group.js');
router.use('/group', group);

