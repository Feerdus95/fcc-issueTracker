document.addEventListener('DOMContentLoaded', () => {
  const issueForm = document.getElementById('issueForm');
  const issueList = document.getElementById('issueList');
  const recentIssues = document.getElementById('recentIssues');

  // Fetch and display all issues
  async function fetchIssues() {
    try {
      const response = await fetch('/api/issues/test-project');
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      const issues = await response.json();
      
      // Display all issues
      if (issueList) {
        if (issues.length === 0) {
          issueList.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 1rem 0;">
              <p>No issues found for this project.</p>
            </div>`;
        } else {
          issueList.innerHTML = issues.map(issue => createIssueCard(issue)).join('');
        }
      }
      
      // Display recent issues
      if (recentIssues) {
        if (issues.length === 0) {
          recentIssues.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 1rem 0;">
              <p>No issues found.</p>
            </div>`;
        } else {
          const sortedIssues = [...issues].sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
          const latestIssues = sortedIssues.slice(0, 3);
          recentIssues.innerHTML = latestIssues.map(issue => createIssueCard(issue, true)).join('');
        }
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      if (issueList) {
        issueList.innerHTML = `
          <div style="text-align: center; color: #ef4444; padding: 1rem 0;">
            <p>Failed to load issues. Please try again later.</p>
          </div>`;
      }
      if (recentIssues) {
        recentIssues.innerHTML = `
          <div style="text-align: center; color: #ef4444; padding: 1rem 0;">
            <p>Failed to load issues. Please try again later.</p>
          </div>`;
      }
    }
  }

  // Create an issue card HTML
  function createIssueCard(issue, isCompact = false) {
    const statusClass = issue.open ? 'open' : 'closed';
    const statusBadge = issue.open 
      ? '<span class="badge badge-open">Open</span>' 
      : '<span class="badge badge-closed">Closed</span>';
    
    // For compact view (recent issues), show less information
    if (isCompact) {
      return `
        <div class="issue-card ${statusClass}">
          <div class="issue-header">
            <h3 class="issue-title">${issue.issue_title}</h3>
            ${statusBadge}
          </div>
          <p style="margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${issue.issue_text}</p>
          <div class="issue-meta">
            <span><i class="fas fa-user" style="margin-right: 0.25rem;"></i>${issue.created_by}</span>
            <span><i class="fas fa-calendar-alt" style="margin-right: 0.25rem;"></i>${new Date(issue.created_on).toLocaleDateString()}</span>
          </div>
        </div>
      `;
    }
    
    // Full view for all issues
    return `
      <div class="issue-card ${statusClass}">
        <div class="issue-header">
          <h3 class="issue-title">${issue.issue_title}</h3>
          ${statusBadge}
        </div>
        <p style="margin-bottom: 1rem;">${issue.issue_text}</p>
        ${issue.status_text ? `<p style="margin-bottom: 0.5rem;"><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i>${issue.status_text}</p>` : ''}
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; color: #6b7280;">
          <span><i class="fas fa-user" style="margin-right: 0.25rem;"></i>Created by: ${issue.created_by}</span>
          <span><i class="fas fa-user-check" style="margin-right: 0.25rem;"></i>Assigned to: ${issue.assigned_to || 'Unassigned'}</span>
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin-bottom: 1rem; font-size: 0.875rem; color: #6b7280;">
          <span><i class="fas fa-calendar-alt" style="margin-right: 0.25rem;"></i>Created: ${new Date(issue.created_on).toLocaleDateString()}</span>
          <span><i class="fas fa-clock" style="margin-right: 0.25rem;"></i>Updated: ${new Date(issue.updated_on).toLocaleDateString()}</span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn ${issue.open ? 'btn-danger' : 'btn-success'} closeIssue" id="${issue._id}">
            <i class="fas ${issue.open ? 'fa-lock' : 'fa-lock-open'}" style="margin-right: 0.25rem;"></i>${issue.open ? 'Close' : 'Reopen'}
          </button>
          <button class="btn btn-danger deleteIssue" id="${issue._id}">
            <i class="fas fa-trash" style="margin-right: 0.25rem;"></i>Delete
          </button>
        </div>
      </div>
    `;
  }

  // Create a new issue
  if (issueForm) {
    issueForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(issueForm);
      const jsonData = Object.fromEntries(formData.entries());
      
      try {
        const response = await fetch('/api/issues/test-project', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create issue');
        }
        
        const result = await response.json();
        
        // Show success message
        alert('Issue created successfully!');
        
        // Reset form
        issueForm.reset();
        
        // Refresh issues
        fetchIssues();
        
      } catch (error) {
        console.error('Error creating issue:', error);
        alert('Failed to create issue. Please try again.');
      }
    });
  }

  // Delete an issue
  document.addEventListener('click', async (e) => {
    if (e.target.closest('.deleteIssue')) {
      const button = e.target.closest('.deleteIssue');
      const issueId = button.id;
      
      if (confirm('Are you sure you want to delete this issue? This cannot be undone.')) {
        try {
          const response = await fetch(`/api/issues/test-project`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: issueId })
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete issue');
          }
          
          const result = await response.json();
          
          if (result.error) {
            alert(result.error);
          } else {
            alert(result.result);
            fetchIssues();
          }
          
        } catch (error) {
          console.error('Error deleting issue:', error);
          alert('Failed to delete issue. Please try again.');
        }
      }
    }
  });

  // Close/Reopen an issue
  document.addEventListener('click', async (e) => {
    if (e.target.closest('.closeIssue')) {
      const button = e.target.closest('.closeIssue');
      const issueId = button.id;
      
      try {
        // Determine current state and toggle it
        const isCurrentlyOpen = button.textContent.trim().includes('Close');
        
        const response = await fetch(`/api/issues/test-project`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: issueId,
            open: !isCurrentlyOpen
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update issue');
        }
        
        const result = await response.json();
        
        if (result.error) {
          alert(result.error);
        } else {
          alert(`Issue ${isCurrentlyOpen ? 'closed' : 'reopened'} successfully!`);
          fetchIssues();
        }
        
      } catch (error) {
        console.error('Error updating issue:', error);
        alert('Failed to update issue. Please try again.');
      }
    }
  });

  // Initial fetch of issues
  fetchIssues();
});