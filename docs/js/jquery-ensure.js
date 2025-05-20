// This script ensures jQuery is available as $ for other scripts
(function() {
  // Make sure jQuery is always available as $ globally
  if (typeof jQuery !== 'undefined') {
    window.$ = window.jQuery; // Ensure $ is available
  } else {
    console.error('jQuery is not loaded - please check script loading order');
  }
})();
