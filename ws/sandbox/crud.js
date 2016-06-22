var express = require('express');
var mongodb = require('mongodb');
var Promise = require('bluebird');

var Collection = mongodb.Collection;

Promise.promisifyAll(Collection.prototype);

var router = express.Router();
module.exports = router;

router.post('/create', function(req, res) {
	db.collection('documents').insertAsync(req.body).then(function(result) {
		console.log('Inserted 1 object into the documents collection');
		console.log('finished.');
		res.json({
			status: 0,
			message: 'created'
		});
	}).catch(function(error) {
		console.log('error.', error);
		res.json({
			status: 1,
			message: 'not created',
			error: error
		});
	});
});

router.get('/retrieve', function(req, res) {
	console.log('about to retrieve.');
	console.log(req.query);
	var query = {};
	if (req.query.filter) {
		query.name = { $regex: new RegExp(req.query.filter)};
	}
	db.collection('documents').find(query).toArray().then(function(result) {
		myResult = result;
		console.log('found the following objects into the documents collection', result);
		console.log('finished.');
		res.json({
			status: 0,
			message: 'retrieved',
			result: myResult
		});
	}).catch(function(error) {
		console.log('error.', error);
		res.json({
			status: 1,
			message: 'not retrieved',
			error: error
		});
	});
	
});

router.post('/update', function(req, res) {
	console.log('about to update.');
	console.log(req.body);
	var query = {
		_id: ObjectId(req.body._id)
	};
	delete req.body._id;
	var update = {
		$set: req.body
	};
	db.collection('documents').update(query, update).then(function(result) {
		console.log('Updated 1 object into the documents collection');
		console.log('finished.');
		res.json({
			status: 0,
			message: 'updated'
		});
	}).catch(function(error) {
		console.log('error.', error);
		res.json({
			status: 1,
			message: 'not updated',
			error: error
		});
	});
	
});

router.post('/delete', function(req, res) {
	console.log('about to delete.');
	var list = req.body.map(function(n) {
		return ObjectId(n);
	});
	db.collection('documents').remove({ _id: { $in: list } }).then(function(result) {
		console.log('finished.');
		res.json({
			status: 0,
			message: 'delete',
			result: result
		});
	}).catch(function(error) {
		console.log('error.', error);
		res.json({
			status: 1,
			message: 'not delete',
			error: error
		});
	});
	
});

router.get('/drop', function(req, res) {
	db.collection('documents').drop().then(function() {
		console.log('about to close.');
		console.log('finished.');
		res.json({
			status: 0,
			message: 'dropped'
		});
	}).catch(function(error) {
		console.log('error.', error);
		res.json({
			status: 1,
			message: 'not dropped',
			error: error
		});
	});
	
});
