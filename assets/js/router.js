// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
  
    // Load content from HTML files
    function loadPage(page) {
      fetch(page)
        .then(response => {
          if (!response.ok) {
            throw new Error('Page not found');
          }
          return response.text();
        })
        .then(html => {
          content.innerHTML = html;
          window.history.pushState({ page }, '', `/${page}`);
          // Update active link
          document.querySelectorAll('nav a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('data-page') === page);
          });
        })
        .catch(error => {
          console.error('Error loading page:', error);
          content.innerHTML = '<h1>Page not found</h1>';
        });
    }
  
    // Event listener for navigation
    document.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const page = a.getAttribute('data-page');
        loadPage(page);
      });
    });
  
    // Load page based on URL hash
    const hash = window.location.hash.substring(1);
    loadPage(hash || 'dashboard.html');
  
    // Handle back/forward navigation
    window.addEventListener('popstate', (event) => {
      const page = event.state?.page || 'dashboard.html';
      loadPage(page);
    });
  });
  