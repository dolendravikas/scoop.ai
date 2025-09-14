// Scoop Application JavaScript - Fixed Version
console.log('Scoop App Script Loading...');

// Global variables
let currentFilterPanel = null;
let isRecording = false;
let recognition = null;

// Time units for auto singular/plural
const timeUnits = ['days', 'weeks', 'months', 'years'];
const timeUnitLabels = ['day', 'week', 'month', 'year'];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing Scoop App');
    
    initializeApp();
    setupEventListeners();
    initializeTimeSliders();
    initializeSpeechRecognition();
});

function initializeApp() {
    console.log('Initializing app...');
    
    // Get main elements
    window.resultsSection = document.getElementById('resultsSection');
    window.loadingIndicator = document.getElementById('loadingIndicator');
    window.resultsContent = document.getElementById('resultsContent');
    window.upgradeModal = document.getElementById('upgradeModal');
    window.installModal = document.getElementById('installModal');
    window.languageModal = document.getElementById('languageModal');
    window.learnMoreModal = document.getElementById('learnMoreModal');
    
    console.log('App elements found:', {
        resultsSection: !!window.resultsSection,
        upgradeModal: !!window.upgradeModal,
        installModal: !!window.installModal,
        languageModal: !!window.languageModal,
        learnMoreModal: !!window.learnMoreModal
    });
}

function initializeTimeSliders() {
    const timeValueSlider = document.getElementById('timeValueSlider');
    const timeUnitSlider = document.getElementById('timeUnitSlider');
    const timeValueDisplay = document.getElementById('timeValueDisplay');
    const timeUnitDisplay = document.getElementById('timeUnitDisplay');

    if (timeValueSlider && timeValueDisplay) {
        timeValueSlider.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            timeValueDisplay.textContent = value;
            updateTimeUnitLabel();
        });
    }

    if (timeUnitSlider && timeUnitDisplay) {
        timeUnitSlider.addEventListener('input', function(e) {
            const unitIndex = parseInt(e.target.value);
            timeUnitDisplay.textContent = timeUnits[unitIndex];
            updateTimeUnitLabel();
        });
    }

    // Initialize display
    updateTimeUnitLabel();
}

function updateTimeUnitLabel() {
    const timeValueSlider = document.getElementById('timeValueSlider');
    const timeUnitSlider = document.getElementById('timeUnitSlider');
    const timeUnitDisplay = document.getElementById('timeUnitDisplay');
    
    if (timeValueSlider && timeUnitSlider && timeUnitDisplay) {
        const timeValue = parseInt(timeValueSlider.value);
        const timeUnitIndex = parseInt(timeUnitSlider.value);
        
        // Auto-adjust singular/plural
        const isPlural = timeValue > 1;
        const unit = isPlural ? timeUnits[timeUnitIndex] : timeUnitLabels[timeUnitIndex];
        timeUnitDisplay.textContent = unit;
    }
}

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const queryInput = document.getElementById('queryInput');
            if (queryInput) {
                queryInput.value = transcript;
            }
            isRecording = false;
            updateVoiceButton();
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            updateVoiceButton();
            showNotification('Voice recognition failed. Please try again.', 'error');
        };

        recognition.onend = function() {
            isRecording = false;
            updateVoiceButton();
        };
    }
}

function updateVoiceButton() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        if (isRecording) {
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        } else {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const queryInput = document.getElementById('queryInput');
    const voiceBtn = document.getElementById('voiceBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        console.log('✓ Search button listener added');
    }
    
    if (queryInput) {
        queryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        console.log('✓ Query input listener added');
    }

    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
        console.log('✓ Voice button listener added');
    }

    // Filter icons - inline panels
    const filterIcons = document.querySelectorAll('.filter-icon');
    console.log('Found filter icons:', filterIcons.length);
    
    filterIcons.forEach(function(icon) {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const filter = this.dataset.filter;
            console.log('Filter icon clicked:', filter);
            console.log('Icon element:', this);
            console.log('Dataset:', this.dataset);
            toggleInlineFilterPanel(filter);
        });
    });

    // Close inline panels when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-group')) {
            closeAllInlinePanels();
        }
    });

    // AI Model selection
    const aiModelOptions = document.querySelectorAll('input[name="aiModel"]');
    console.log('Found AI model options:', aiModelOptions.length);
    aiModelOptions.forEach(function(option) {
        option.addEventListener('change', function() {
            console.log('AI model changed to:', this.value);
            closeAllInlinePanels();
        });
    });

    // Platform options
    const platformOptions = document.querySelectorAll('.platform-option');
    platformOptions.forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                this.style.transform = 'scale(0.95)';
                setTimeout(function() {
                    this.style.transform = 'scale(1)';
                }.bind(this), 150);
            }
        });
    });

    // Modal controls
    const upgradeBtn = document.getElementById('upgradeBtn');
    const installBtn = document.getElementById('installBtn');
    const languageBtn = document.getElementById('languageBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() { openModal('upgrade'); });
        console.log('✓ Upgrade button listener added');
    }
    if (installBtn) {
        installBtn.addEventListener('click', function() { openModal('install'); });
        console.log('✓ Install button listener added');
    }
    if (languageBtn) {
        languageBtn.addEventListener('click', function() { openModal('language'); });
        console.log('✓ Language button listener added');
    }
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() { openModal('learnMore'); });
        console.log('✓ Learn more button listener added');
    }

    // Close modals
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(function(btn) {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modals on outside click
    [window.upgradeModal, window.installModal, window.languageModal, window.learnMoreModal].forEach(function(modal) {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        }
    });

    // Language selection
    const languageOptions = document.querySelectorAll('input[name="language"]');
    languageOptions.forEach(function(option) {
        option.addEventListener('change', function(e) {
            changeLanguage(e.target.value);
            closeAllModals();
        });
    });

    // Search input focus effects
    if (queryInput) {
        queryInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        queryInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }
    
    console.log('All event listeners set up successfully');
}

function toggleVoiceInput() {
    if (!recognition) {
        showNotification('Voice recognition not supported in this browser', 'error');
        return;
    }

    if (isRecording) {
        recognition.stop();
    } else {
        isRecording = true;
        updateVoiceButton();
        recognition.start();
    }
}

function toggleInlineFilterPanel(filterType) {
    console.log('Toggling filter panel:', filterType);
    
    // Close current panel if open
    if (currentFilterPanel && currentFilterPanel !== filterType) {
        closeAllInlinePanels();
    }

    // Toggle the selected panel
    let panelId = filterType + 'PanelInline';
    // Fix for ai-model which has a hyphen
    if (filterType === 'ai-model') {
        panelId = 'aiModelPanelInline';
    }
    const panel = document.getElementById(panelId);
    console.log('Looking for panel:', panelId, 'Found:', !!panel);
    
    if (panel) {
        console.log('Panel element:', panel);
        console.log('Panel current classes:', panel.className);
        console.log('Panel display style:', window.getComputedStyle(panel).display);
        
        if (panel.classList.contains('show')) {
            console.log('Panel is already showing, closing it');
            closeAllInlinePanels();
        } else {
            console.log('Adding show class to panel');
            panel.classList.add('show');
            currentFilterPanel = filterType;
            
            // Add active state to filter icon
            const filterIcon = document.querySelector('[data-filter="' + filterType + '"]');
            if (filterIcon) {
                filterIcon.classList.add('active');
                console.log('Added active class to filter icon');
            } else {
                console.error('Filter icon not found for:', filterType);
            }
            
            // Force a reflow to ensure the panel is visible
            panel.offsetHeight;
            console.log('Panel classes after adding show:', panel.className);
            console.log('Panel display style after:', window.getComputedStyle(panel).display);
        }
    } else {
        console.error('Panel not found:', panelId);
        // Let's also check what panels do exist
        const allPanels = document.querySelectorAll('[id$="PanelInline"]');
        console.log('All inline panels found:', Array.from(allPanels).map(p => p.id));
    }
}

function closeAllInlinePanels() {
    const panels = document.querySelectorAll('.filter-panel-inline');
    panels.forEach(function(panel) {
        panel.classList.remove('show');
    });

    // Remove active state from all filter icons
    const filterIcons = document.querySelectorAll('.filter-icon');
    filterIcons.forEach(function(icon) {
        icon.classList.remove('active');
    });

    currentFilterPanel = null;
}

function openModal(modalType) {
    console.log('Opening modal:', modalType);
    closeAllModals();
    const modal = document.getElementById(modalType + 'Modal');
    console.log('Found modal:', !!modal);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal not found:', modalType + 'Modal');
    }
}

function closeAllModals() {
    [window.upgradeModal, window.installModal, window.languageModal, window.learnMoreModal].forEach(function(modal) {
        if (modal) {
            modal.classList.remove('show');
        }
    });
    document.body.style.overflow = 'auto';
}

function changeLanguage(langCode) {
    const languageBtn = document.getElementById('languageBtn');
    const languageNames = {
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'zh': '中文',
        'ja': '日本語'
    };
    
    if (languageNames[langCode] && languageBtn) {
        const span = languageBtn.querySelector('span');
        if (span) {
            span.textContent = languageNames[langCode];
        }
        showNotification('Language changed to ' + languageNames[langCode], 'success');
    }
}

async function performSearch() {
    const queryInput = document.getElementById('queryInput');
    const query = queryInput ? queryInput.value.trim() : '';
    
    if (!query) {
        showNotification('Please enter a search query', 'error');
        return;
    }

    // Get filter values
    const filters = getFilterValues();
    
    // Show results section and loading
    if (window.resultsSection) {
        window.resultsSection.style.display = 'block';
    }
    if (window.loadingIndicator) {
        window.loadingIndicator.style.display = 'block';
    }
    if (window.resultsContent) {
        window.resultsContent.style.display = 'none';
    }

    // Scroll to results
    if (window.resultsSection) {
        window.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    try {
        // Call the backend API
        const response = await fetch('http://localhost:3001/api/scoop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                platforms: filters.platforms,
                aiModel: filters.aiModel,
                timeRange: filters.timeRange,
                keywords: filters.keywords
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data);
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
        
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to mock data if API fails
        console.log('Falling back to mock results...');
        const results = generateMockResults(query, filters);
        results.error = `API Error: ${error.message}. Showing mock data.`;
        displayResults(results);
    }
}

function getFilterValues() {
    const platforms = [];
    const twitter = document.getElementById('twitter');
    const linkedin = document.getElementById('linkedin');
    const reddit = document.getElementById('reddit');
    const quora = document.getElementById('quora');
    
    if (twitter && twitter.checked) platforms.push('twitter');
    if (linkedin && linkedin.checked) platforms.push('linkedin');
    if (reddit && reddit.checked) platforms.push('reddit');
    if (quora && quora.checked) platforms.push('quora');

    // Get selected AI model
    const selectedModel = document.querySelector('input[name="aiModel"]:checked');
    const aiModel = selectedModel ? selectedModel.value : 'gpt-4';

    // Get time values from sliders
    const timeValueSlider = document.getElementById('timeValueSlider');
    const timeUnitSlider = document.getElementById('timeUnitSlider');
    const timeValue = timeValueSlider ? parseInt(timeValueSlider.value) : 7;
    const timeUnitIndex = timeUnitSlider ? parseInt(timeUnitSlider.value) : 0;
    const timeUnit = timeUnits[timeUnitIndex];

    const keywordsInput = document.getElementById('keywords');
    const keywords = keywordsInput ? keywordsInput.value.trim() : '';

    return {
        platforms: platforms,
        aiModel: aiModel,
        timeValue: timeValue,
        timeUnit: timeUnit,
        keywords: keywords
    };
}

function generateMockResults(query, filters) {
    return {
        query: query,
        filters: filters,
        timestamp: new Date().toISOString(),
        intelligenceReport: generateIntelligenceReport(query, filters),
        platformResults: generatePlatformResults(filters.platforms, query)
    };
}

function generateIntelligenceReport(query, filters) {
    const aiModel = filters.aiModel;
    const timeRange = filters.timeValue + ' ' + filters.timeUnit;
    const platforms = filters.platforms.join(', ').toUpperCase();
    
    return {
        summary: 'Based on analysis of ' + platforms + ' over the past ' + timeRange + ', here are the key insights about "' + query + '":',
        keyFindings: [
            'Strong engagement detected across ' + filters.platforms.length + ' platforms',
            'Peak discussion times identified during business hours',
            'Sentiment analysis shows predominantly positive sentiment (78%)',
            'Top influencers and thought leaders identified in this space',
            'Emerging trends and patterns detected in recent posts'
        ],
        recommendations: [
            'Monitor these platforms regularly for updates',
            'Consider engaging with top contributors',
            'Track sentiment changes over time',
            'Set up alerts for new relevant content'
        ]
    };
}

function generatePlatformResults(platforms, query) {
    const results = {};
    
    platforms.forEach(function(platform) {
        results[platform] = generatePlatformSpecificResults(platform, query);
    });
    
    return results;
}

function generatePlatformSpecificResults(platform, query) {
    const platformData = {
        twitter: {
            name: 'X (Twitter)',
            icon: 'fab fa-twitter',
            posts: [
                'Latest discussion on ' + query + ' shows growing interest in enterprise adoption',
                'Technical deep-dive thread with 2.3K retweets gaining traction',
                'Industry expert shares insights on ' + query + ' market trends',
                'Community debate on implementation challenges',
                'New research paper on ' + query + ' referenced by 15+ accounts'
            ]
        },
        linkedin: {
            name: 'LinkedIn',
            icon: 'fab fa-linkedin',
            posts: [
                'Professional insights on ' + query + ' from industry leaders',
                'Company announcement about ' + query + ' integration',
                'Career opportunities in ' + query + ' space increasing',
                'Thought leadership article gaining 500+ reactions',
                'Networking discussion on ' + query + ' best practices'
            ]
        },
        reddit: {
            name: 'Reddit',
            icon: 'fab fa-reddit',
            posts: [
                'r/technology discussion on ' + query + ' with 150+ comments',
                'Technical subreddit analysis of ' + query + ' performance',
                'Community project showcase using ' + query,
                'AMA session with ' + query + ' expert scheduled',
                'Open source tools for ' + query + ' development shared'
            ]
        },
        quora: {
            name: 'Quora',
            icon: 'fas fa-question-circle',
            posts: [
                'Detailed Q&A about ' + query + ' implementation',
                'Expert comparison of ' + query + ' vs alternatives',
                'Beginner-friendly explanation of ' + query + ' concepts',
                'Real-world case study on ' + query + ' success',
                'Future predictions for ' + query + ' development'
            ]
        }
    };

    return platformData[platform] || { name: platform, icon: 'fas fa-globe', posts: [] };
}

function displayResults(data) {
    if (window.loadingIndicator) {
        window.loadingIndicator.style.display = 'none';
    }
    if (window.resultsContent) {
        window.resultsContent.style.display = 'block';
        window.resultsContent.classList.add('show');

        let html = '';

        // Check if this is real API data or mock data
        if (data.analysis && data.rawData) {
            // Real API data format
            html = '<div class="intelligence-report">' +
                '<h4>AI Analysis Summary (' + data.aiModel.toUpperCase() + ')</h4>' +
                '<p><strong>Query:</strong> ' + data.query + '</p>' +
                '<p><strong>Data Sources:</strong> ' + data.platforms.join(', ').toUpperCase() + '</p>' +
                '<p><strong>Posts Analyzed:</strong> ' + data.dataCount + '</p>' +
                (data.error ? '<div class="error-notice"><strong>Note:</strong> ' + data.error + '</div>' : '') +
                '<h5>AI Analysis:</h5>' +
                '<div class="analysis-content">' + data.analysis + '</div>' +
                '</div>' +
                '<div class="platform-results">' +
                '<h5>Raw Data Sources:</h5>';

            // Group data by platform
            const platformData = {};
            data.rawData.forEach(item => {
                if (!platformData[item.platform]) {
                    platformData[item.platform] = [];
                }
                platformData[item.platform].push(item);
            });

            Object.entries(platformData).forEach(([platform, posts]) => {
                const platformIcons = {
                    'twitter': 'fab fa-twitter',
                    'reddit': 'fab fa-reddit',
                    'linkedin': 'fab fa-linkedin',
                    'quora': 'fas fa-question-circle'
                };
                
                html += '<div class="platform-result">' +
                    '<h6><i class="' + (platformIcons[platform] || 'fas fa-globe') + '"></i> ' + platform.toUpperCase() + ' (' + posts.length + ' posts)</h6>' +
                    '<div class="posts-container">';
                
                posts.slice(0, 5).forEach(post => {
                    html += '<div class="post-item">' +
                        '<div class="post-content">' + post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '') + '</div>' +
                        '<div class="post-meta">' +
                            '<span class="post-author">' + (post.author || 'Unknown') + '</span>' +
                            '<span class="post-date">' + new Date(post.created_at).toLocaleDateString() + '</span>' +
                            (post.url ? '<a href="' + post.url + '" target="_blank" class="post-link">View Original</a>' : '') +
                        '</div>' +
                        '</div>';
                });
                
                if (posts.length > 5) {
                    html += '<div class="more-posts">... and ' + (posts.length - 5) + ' more posts</div>';
                }
                
                html += '</div></div>';
            });

            html += '</div>';
        } else {
            // Mock data format (fallback)
            const report = data.intelligenceReport;
            const platformResults = data.platformResults;

            html = '<div class="intelligence-report">' +
                '<h4>AI Analysis Summary (' + data.filters.aiModel.toUpperCase() + ')</h4>' +
                '<p><strong>Query:</strong> ' + data.query + '</p>' +
                '<p><strong>Analysis Period:</strong> Past ' + data.filters.timeValue + ' ' + data.filters.timeUnit + '</p>' +
                '<p><strong>Platforms Analyzed:</strong> ' + data.filters.platforms.join(', ').toUpperCase() + '</p>' +
                '<h5>Key Findings:</h5>' +
                '<ul>' + report.keyFindings.map(function(finding) { return '<li>' + finding + '</li>'; }).join('') + '</ul>' +
                '<h5>Recommendations:</h5>' +
                '<ul>' + report.recommendations.map(function(rec) { return '<li>' + rec + '</li>'; }).join('') + '</ul>' +
                '</div>' +
                '<div class="platform-results">';

            Object.values(platformResults).forEach(function(platform) {
                html += '<div class="platform-result">' +
                    '<h5><i class="' + platform.icon + '"></i>' + platform.name + '</h5>' +
                    '<ul>' + platform.posts.map(function(post) { return '<li>' + post + '</li>'; }).join('') + '</ul>' +
                    '</div>';
            });

            html += '</div>';
        }

        window.resultsContent.innerHTML = html;
    }
}

function showNotification(message, type) {
    type = type || 'info';
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '4000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'error' ? '#ff4444' : type === 'success' ? '#10a37f' : '#2a2a2a'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(function() {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(function() {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modals/panels
    if (e.key === 'Escape') {
        closeAllInlinePanels();
        closeAllModals();
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const queryInput = document.getElementById('queryInput');
        if (queryInput) {
            queryInput.focus();
        }
    }
});

console.log('Scoop App Script Loaded Successfully');