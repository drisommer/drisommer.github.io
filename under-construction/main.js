document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.querySelector('.links');
    
    // Display links from `links.js`
    linksContainer.innerHTML = ''; // Clear existing links
    links.forEach(entry => {
        const link = document.createElement('a');
        link.href = entry.url;
        link.textContent = entry.name;
        link.className = 'link';
        link.target = '_blank'; // Open links in new tab
        linksContainer.appendChild(link);
    });
});
