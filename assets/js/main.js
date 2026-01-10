// Interactive features for ML Reading Group website

document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  initializeSort();
  initializeFilters();
  initializeViewToggle();
});

// Search functionality
function initializeSearch() {
  const searchBox = document.getElementById('search-box');
  if (!searchBox) return;
  
  searchBox.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterSessions(searchTerm);
  });
}

function filterSessions(searchTerm) {
  const sessions = document.querySelectorAll('.session-row, .session-card');
  
  sessions.forEach(session => {
    const text = session.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      session.style.display = '';
    } else {
      session.style.display = 'none';
    }
  });
}

// Sort functionality for tables
function initializeSort() {
  const headers = document.querySelectorAll('.sessions-table th[data-sort]');
  
  headers.forEach(header => {
    header.addEventListener('click', function() {
      const sortKey = this.dataset.sort;
      const table = this.closest('table');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      
      // Remove sorted class from all headers
      headers.forEach(h => h.classList.remove('sorted', 'sorted-asc', 'sorted-desc'));
      
      // Determine sort direction
      const isAsc = this.classList.contains('sorted-desc');
      this.classList.add('sorted', isAsc ? 'sorted-asc' : 'sorted-desc');
      
      // Sort rows
      rows.sort((a, b) => {
        const aValue = a.querySelector(`[data-${sortKey}]`)?.dataset[sortKey] || '';
        const bValue = b.querySelector(`[data-${sortKey}]`)?.dataset[sortKey] || '';
        
        if (sortKey === 'date') {
          return isAsc ? 
            new Date(aValue) - new Date(bValue) : 
            new Date(bValue) - new Date(aValue);
        } else {
          return isAsc ? 
            aValue.localeCompare(bValue) : 
            bValue.localeCompare(aValue);
        }
      });
      
      // Re-append sorted rows
      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

// Filter by tags
function initializeFilters() {
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', function() {
      this.classList.toggle('active');
      applyFilters();
    });
  });
}

function applyFilters() {
  const activeTags = Array.from(document.querySelectorAll('.filter-tag.active'))
    .map(tag => tag.dataset.filter);
  
  if (activeTags.length === 0) {
    // Show all sessions if no filters active
    document.querySelectorAll('.session-row, .session-card').forEach(session => {
      session.style.display = '';
    });
    return;
  }
  
  const sessions = document.querySelectorAll('.session-row, .session-card');
  sessions.forEach(session => {
    const sessionType = session.dataset.type;
    const presenter = session.dataset.presenter?.toLowerCase() || '';
    
    let shouldShow = false;
    activeTags.forEach(filter => {
      if (filter === sessionType || presenter.includes(filter.toLowerCase())) {
        shouldShow = true;
      }
    });
    
    session.style.display = shouldShow ? '' : 'none';
  });
}

// View toggle (table/card/calendar)
function initializeViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const view = this.dataset.view;
      
      // Update active button
      viewBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Show/hide views
      document.querySelectorAll('.view-container').forEach(container => {
        container.classList.add('hidden');
      });
      
      const targetView = document.getElementById(`${view}-view`);
      if (targetView) {
        targetView.classList.remove('hidden');
      }
      
      // Save preference
      localStorage.setItem('preferredView', view);
    });
  });
  
  // Load saved preference
  const savedView = localStorage.getItem('preferredView');
  if (savedView) {
    const btn = document.querySelector(`.view-btn[data-view="${savedView}"]`);
    if (btn) btn.click();
  }
}

// Export to calendar
function exportToCalendar(session) {
  const title = session.title;
  const date = session.date;
  const location = session.location || 'POB 4.116';
  
  // Create ICS file content
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${formatDateForICS(date)}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
  
  // Download ICS file
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/\s+/g, '_')}.ics`;
  link.click();
}

function formatDateForICS(dateString) {
  // Convert date string to ICS format (YYYYMMDDTHHMMSS)
  const date = new Date(dateString);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0];
}

// Add to favorites
function toggleFavorite(sessionId) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  if (favorites.includes(sessionId)) {
    favorites = favorites.filter(id => id !== sessionId);
  } else {
    favorites.push(sessionId);
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoriteUI(sessionId, favorites.includes(sessionId));
}

function updateFavoriteUI(sessionId, isFavorite) {
  const btn = document.querySelector(`[data-session-id="${sessionId}"] .favorite-btn`);
  if (btn) {
    btn.classList.toggle('active', isFavorite);
    btn.textContent = isFavorite ? '★' : '☆';
  }
}

// Load favorites on page load
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  favorites.forEach(sessionId => {
    updateFavoriteUI(sessionId, true);
  });
}

// Initialize favorites after DOM is loaded
document.addEventListener('DOMContentLoaded', loadFavorites);
