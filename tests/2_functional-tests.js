const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const { app } = require('../server');

chai.use(chaiHttp);

// Use the existing app instance from server.js
// We don't need to start another server instance for testing
// since we're just using the app object for HTTP testing

suite('Functional Tests', function() {
    // Variable to store _id from a created issue for later tests
    let testIssueId;
    
    test('Create an issue with every field', function (done) {
        chai
          .request(app)
          .post('/api/issues/test-project')
          .send({
            issue_title: 'Test Issue',
            issue_text: 'This is a test issue with all fields',
            created_by: 'Tester',
            assigned_to: 'Developer',
            status_text: 'In Progress'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'status_text');
            assert.property(res.body, 'open');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, '_id');
            
            // Save the _id for later tests
            testIssueId = res.body._id;
            
            done();
          });
      });

      test('Create an issue with only required fields', function (done) {
        chai
          .request(app)
          .post('/api/issues/test-project')
          .send({
            issue_title: 'Test Issue',
            issue_text: 'This is a test issue with only required fields',
            created_by: 'Tester'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'open');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, '_id');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            done();
          });
      });

      test('Create an issue with missing required fields', function (done) {
        chai
          .request(app)
          .post('/api/issues/test-project')
          .send({
            issue_title: 'Test Issue',
            created_by: 'Tester'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
      });

      test('View issues on a project', function (done) {
        chai
          .request(app)
          .get('/api/issues/test-project')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            // Verify that we have at least one issue
            assert.isAtLeast(res.body.length, 1);
            // Verify the first issue has all required fields
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            done();
          });
      });

      test('View issues on a project with one filter', function (done) {
        chai
          .request(app)
          .get('/api/issues/test-project?open=true')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            // Check that all returned issues have open=true
            res.body.forEach(issue => {
              assert.equal(issue.open, true);
            });
            done();
          });
      });

      test('View issues on a project with multiple filters', function (done) {
        chai
          .request(app)
          .get('/api/issues/test-project?open=true&created_by=Tester')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            // Check that all returned issues match both filters
            res.body.forEach(issue => {
              assert.equal(issue.open, true);
              assert.equal(issue.created_by, 'Tester');
            });
            done();
          });
      });

      test('Update one field on an issue', function (done) {
        chai
          .request(app)
          .put('/api/issues/test-project')
          .send({
            _id: testIssueId,
            issue_title: 'Updated Issue Title'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'result');
            assert.equal(res.body.result, 'successfully updated');
            done();
          });
      });

      test('Update multiple fields on an issue', function (done) {
        chai
          .request(app)
          .put('/api/issues/test-project')
          .send({
            _id: testIssueId,
            issue_title: 'Updated Issue Title Again',
            issue_text: 'Updated issue text',
            status_text: 'Updated status'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'result');
            assert.equal(res.body.result, 'successfully updated');
            done();
          });
      });

      test('Update an issue with missing _id', function (done) {
        chai
          .request(app)
          .put('/api/issues/test-project')
          .send({
            issue_title: 'Updated Issue Title'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      });

      test('Update an issue with no fields to update', function (done) {
        chai
          .request(app)
          .put('/api/issues/test-project')
          .send({
            _id: testIssueId
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'no update field(s) sent');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, testIssueId);
            done();
          });
      });

      test('Update an issue with an invalid _id', function (done) {
        chai
          .request(app)
          .put('/api/issues/test-project')
          .send({
            _id: 'invalid_id',
            issue_title: 'Updated Issue Title'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'could not update');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, 'invalid_id');
            done();
          });
      });

      // Create a new issue for testing deletion
      let deleteIssueId;
      test('Create an issue for deletion test', function (done) {
        chai
          .request(app)
          .post('/api/issues/test-project')
          .send({
            issue_title: 'Issue to Delete',
            issue_text: 'This issue will be deleted',
            created_by: 'Tester'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            deleteIssueId = res.body._id;
            done();
          });
      });

      test('Delete an issue', function (done) {
        chai
          .request(app)
          .delete('/api/issues/test-project')
          .send({
            _id: deleteIssueId
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'result');
            assert.equal(res.body.result, 'successfully deleted');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, deleteIssueId);
            done();
          });
      });

      test('Delete an issue with an invalid _id', function (done) {
        chai
          .request(app)
          .delete('/api/issues/test-project')
          .send({
            _id: 'invalid_id'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'could not delete');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, 'invalid_id');
            done();
          });
      });

      test('Delete an issue with missing _id', function (done) {
        chai
          .request(app)
          .delete('/api/issues/test-project')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      });
});
