// Simple Scoop App - Debug Version
console.log('Script loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Test basic elements
    const queryInput = document.getElementById('queryInput');
    const searchBtn = document.getElementById('searchBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    
    console.log('Elements found:', {
        queryInput: !!queryInput,
        searchBtn: !!searchBtn,
        voiceBtn: !!voiceBtn
    });
    
    // Search functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            console.log('Search button clicked');
            const query = queryInput ? queryInput.value : 'No input';
            console.log('Query:', query);
            alert('Search clicked! Query: ' + query);
        });
    }
    
    // Voice button
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            console.log('Voice button clicked');
            alert('Voice button clicked!');
        });
    }
    
    // Input field
    if (queryInput) {
        queryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter pressed');
                alert('Enter pressed!');
            }
        });
        
        queryInput.addEventListener('input', function(e) {
            console.log('Input changed:', e.target.value);
        });
    }
    
    // Filter icons
    const filterIcons = document.querySelectorAll('.filter-icon');
    console.log('Filter icons found:', filterIcons.length);
    
    filterIcons.forEach(function(icon, index) {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const filter = this.dataset.filter;
            console.log('Filter icon clicked:', filter);
            
            const panel = document.getElementById(filter + 'PanelInline');
            console.log('Panel found:', !!panel);
            
            if (panel) {
                panel.classList.toggle('show');
                console.log('Panel toggled');
            }
        });
    });
    
    // Modal buttons
    const upgradeBtn = document.getElementById('upgradeBtn');
    const installBtn = document.getElementById('installBtn');
    const languageBtn = document.getElementById('languageBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    console.log('Modal buttons found:', {
        upgradeBtn: !!upgradeBtn,
        installBtn: !!installBtn,
        languageBtn: !!languageBtn,
        learnMoreBtn: !!learnMoreBtn
    });
    
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            console.log('Upgrade button clicked');
            const modal = document.getElementById('upgradeModal');
            if (modal) {
                modal.classList.add('show');
                console.log('Upgrade modal shown');
            }
        });
    }
    
    if (installBtn) {
        installBtn.addEventListener('click', function() {
            console.log('Install button clicked');
            const modal = document.getElementById('installModal');
            if (modal) {
                modal.classList.add('show');
                console.log('Install modal shown');
            }
        });
    }
    
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            console.log('Language button clicked');
            const modal = document.getElementById('languageModal');
            if (modal) {
                modal.classList.add('show');
                console.log('Language modal shown');
            }
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            console.log('Learn more button clicked');
            const modal = document.getElementById('learnMoreModal');
            if (modal) {
                modal.classList.add('show');
                console.log('Learn more modal shown');
            }
        });
    }
    
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            console.log('Close button clicked');
            const modals = document.querySelectorAll('[id$="Modal"]');
            modals.forEach(function(modal) {
                modal.classList.remove('show');
            });
        });
    });
    
    // Close modals on outside click
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                console.log('Modal closed by outside click');
            }
        });
    });
    
    console.log('All event listeners set up');
});

console.log('Script loaded');
