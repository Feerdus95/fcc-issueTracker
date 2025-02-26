'use strict';

// Simple in-memory database for testing
const issuesByProject = {};

// Helper function to generate a unique ID
function generateID() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res) {
      let project = req.params.project;
      let query = req.query;
      
      // Initialize project if it doesn't exist
      if (!issuesByProject[project]) {
        issuesByProject[project] = [];
      }
      
      // Get all issues for the project
      let issues = issuesByProject[project];
      
      // Filter issues based on query parameters
      if (Object.keys(query).length > 0) {
        issues = issues.filter(issue => {
          for (let key in query) {
            // Special handling for open/closed status
            if (key === 'open') {
              const queryOpen = query[key] === 'true';
              if (issue.open !== queryOpen) return false;
            } 
            // For all other fields, do a simple equality check
            else if (issue[key] !== query[key]) {
              return false;
            }
          }
          return true;
        });
      }
      
      res.json(issues);
    })
    
    .post(function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      
      // Validate required fields
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      // Initialize project if it doesn't exist
      if (!issuesByProject[project]) {
        issuesByProject[project] = [];
      }
      
      // Create new issue
      let newIssue = {
        _id: generateID(),
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        open: true,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString()
      };
      
      // Add to project
      issuesByProject[project].push(newIssue);
      
      // Return the issue
      res.json(newIssue);
    })
    
    .put(function (req, res) {
      let project = req.params.project;
      let { _id, ...updates } = req.body;
      
      // Check if _id is provided
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Check if any update fields were sent
      if (Object.keys(updates).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }
      
      // Initialize project if it doesn't exist
      if (!issuesByProject[project]) {
        issuesByProject[project] = [];
      }
      
      // Find the issue to update
      const issueIndex = issuesByProject[project].findIndex(issue => issue._id === _id);
      
      // If issue not found
      if (issueIndex === -1) {
        return res.json({ error: 'could not update', _id: _id });
      }
      
      // Update the issue
      const issueToUpdate = issuesByProject[project][issueIndex];
      
      for (let key in updates) {
        if (key === 'open') {
          // Convert string 'true'/'false' to boolean
          issueToUpdate[key] = updates[key] === 'true' || updates[key] === true;
        } else {
          issueToUpdate[key] = updates[key];
        }
      }
      
      // Update the updated_on timestamp
      issueToUpdate.updated_on = new Date().toISOString();
      
      // Save back to the array
      issuesByProject[project][issueIndex] = issueToUpdate;
      
      // Return success with _id
      res.json({ result: 'successfully updated', _id: _id });
    })
    
    .delete(function (req, res) {
      let project = req.params.project;
      let { _id } = req.body;
      
      // Check if _id is provided
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      
      // Initialize project if it doesn't exist
      if (!issuesByProject[project]) {
        issuesByProject[project] = [];
      }
      
      // Find the issue to delete
      const initialLength = issuesByProject[project].length;
      
      // Remove the issue
      issuesByProject[project] = issuesByProject[project].filter(issue => issue._id !== _id);
      
      // Check if the issue was removed
      if (issuesByProject[project].length === initialLength) {
        return res.json({ error: 'could not delete', _id: _id });
      }
      
      // Return success with _id
      res.json({ result: 'successfully deleted', _id: _id });
    });
    
};
