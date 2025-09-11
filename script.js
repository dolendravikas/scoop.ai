// Scoop Application JavaScript - Enhanced Version
class ScoopApp {
    constructor() {
        this.currentFilterPanel = null;
        this.isRecording = false;
        this.recognition = null;
        this.timeUnits = ['days', 'weeks', 'months', 'years'];
        this.timeUnitLabels = ['day', 'week', 'month', 'year'];
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
                this.setupEventListeners();
            });
        } else {
            this.initializeApp();
            this.setupEventListeners();
        }
    }

    initializeApp() {
        console.log('Scoop App initialized');
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.resultsContent = document.getElementById('resultsContent');
        this.upgradeModal = document.getElementById('upgradeModal');
        this.installModal = document.getElementById('installModal');
        this.languageModal = document.getElementById('languageModal');
        this.learnMoreModal = document.getElementById('learnMoreModal');
        
        // Initialize Web Speech API
        this.initializeSpeechRecognition();
        
        // Initialize time sliders
        this.initializeTimeSliders();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('queryInput').value = transcript;
                this.isRecording = false;
                this.updateVoiceButton();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.updateVoiceButton();
                this.showNotification('Voice recognition failed. Please try again.', 'error');
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                this.updateVoiceButton();
            };
        }
    }

    initializeTimeSliders() {
        const timeValueSlider = document.getElementById('timeValueSlider');
        const timeUnitSlider = document.getElementById('timeUnitSlider');
        const timeValueDisplay = document.getElementById('timeValueDisplay');
        const timeUnitDisplay = document.getElementById('timeUnitDisplay');

        timeValueSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            timeValueDisplay.textContent = value;
            this.updateTimeUnitLabel();
        });

        timeUnitSlider.addEventListener('input', (e) => {
            const unitIndex = parseInt(e.target.value);
            timeUnitDisplay.textContent = this.timeUnits[unitIndex];
            this.updateTimeUnitLabel();
        });

        // Initialize display
        this.updateTimeUnitLabel();
    }

    updateTimeUnitLabel() {
        const timeValue = parseInt(document.getElementById('timeValueSlider').value);
        const timeUnitIndex = parseInt(document.getElementById('timeUnitSlider').value);
        const timeUnitDisplay = document.getElementById('timeUnitDisplay');
        
        // Auto-adjust singular/plural
        const isPlural = timeValue > 1;
        const unit = isPlural ? this.timeUnits[timeUnitIndex] : this.timeUnitLabels[timeUnitIndex];
        timeUnitDisplay.textContent = unit;
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (this.isRecording) {
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        } else {
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const queryInput = document.getElementById('queryInput');
        const voiceBtn = document.getElementById('voiceBtn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        if (queryInput) {
            queryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
            
            // Prevent space from triggering voice input when typing
            queryInput.addEventListener('keydown', (e) => {
                if (e.key === ' ') {
                    // Allow normal space input in text field
                    return;
                }
            });
        }

        // Voice input
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        }

        // Filter icons - inline panels
        const filterIcons = document.querySelectorAll('.filter-icon');
        console.log('Found filter icons:', filterIcons.length);
        filterIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const filter = e.currentTarget.dataset.filter;
                console.log('Filter icon clicked:', filter);
                this.toggleInlineFilterPanel(filter);
            });
        });

        // Close inline panels when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-group')) {
                this.closeAllInlinePanels();
            }
        });

        // AI Model selection
        const aiModelOptions = document.querySelectorAll('input[name="aiModel"]');
        aiModelOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.closeAllInlinePanels();
            });
        });

        // Platform options
        const platformOptions = document.querySelectorAll('.platform-option');
        platformOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });

        // Modal controls
        const upgradeBtn = document.getElementById('upgradeBtn');
        const installBtn = document.getElementById('installBtn');
        const languageBtn = document.getElementById('languageBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => this.openModal('upgrade'));
        }
        if (installBtn) {
            installBtn.addEventListener('click', () => this.openModal('install'));
        }
        if (languageBtn) {
            languageBtn.addEventListener('click', () => this.openModal('language'));
        }
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => this.openModal('learnMore'));
        }

        // Close modals
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Close modals on outside click
        [this.upgradeModal, this.installModal, this.languageModal, this.learnMoreModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // Language selection
        const languageOptions = document.querySelectorAll('input[name="language"]');
        languageOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
                this.closeAllModals();
            });
        });

        // Search input focus effects
        queryInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        queryInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.showNotification('Voice recognition not supported in this browser', 'error');
            return;
        }

        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.isRecording = true;
            this.updateVoiceButton();
            this.recognition.start();
        }
    }

    toggleInlineFilterPanel(filterType) {
        console.log('Toggling filter panel:', filterType);
        
        // Close current panel if open
        if (this.currentFilterPanel && this.currentFilterPanel !== filterType) {
            this.closeAllInlinePanels();
        }

        // Toggle the selected panel
        const panel = document.getElementById(`${filterType}PanelInline`);
        console.log('Found panel:', panel);
        
        if (panel) {
            if (panel.classList.contains('show')) {
                this.closeAllInlinePanels();
            } else {
                panel.classList.add('show');
                this.currentFilterPanel = filterType;
                
                // Add active state to filter icon
                const filterIcon = document.querySelector(`[data-filter="${filterType}"]`);
                if (filterIcon) {
                    filterIcon.classList.add('active');
                }
            }
        } else {
            console.error('Panel not found:', `${filterType}PanelInline`);
        }
    }

    closeAllInlinePanels() {
        const panels = document.querySelectorAll('.filter-panel-inline');
        panels.forEach(panel => {
            panel.classList.remove('show');
        });

        // Remove active state from all filter icons
        const filterIcons = document.querySelectorAll('.filter-icon');
        filterIcons.forEach(icon => {
            icon.classList.remove('active');
        });

        this.currentFilterPanel = null;
    }

    openModal(modalType) {
        console.log('Opening modal:', modalType);
        this.closeAllModals();
        const modal = document.getElementById(`${modalType}Modal`);
        console.log('Found modal:', modal);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal not found:', `${modalType}Modal`);
        }
    }

    closeAllModals() {
        [this.upgradeModal, this.installModal, this.languageModal, this.learnMoreModal].forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
    }

    changeLanguage(langCode) {
        const languageBtn = document.getElementById('languageBtn');
        const languageNames = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'zh': '中文',
            'ja': '日本語'
        };
        
        if (languageNames[langCode]) {
            languageBtn.querySelector('span').textContent = languageNames[langCode];
            this.showNotification(`Language changed to ${languageNames[langCode]}`, 'success');
        }
    }

    async performSearch() {
        const query = document.getElementById('queryInput').value.trim();
        if (!query) {
            this.showNotification('Please enter a search query', 'error');
            return;
        }

        // Get filter values
        const filters = this.getFilterValues();
        
        // Show results section and loading
        this.resultsSection.style.display = 'block';
        this.loadingIndicator.style.display = 'block';
        this.resultsContent.style.display = 'none';

        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });

        try {
            // Simulate API call delay
            await this.delay(2000);
            
            // Generate mock results based on filters
            const results = await this.generateMockResults(query, filters);
            
            // Display results
            this.displayResults(results);
            
        } catch (error) {
            console.error('Search error:', error);
            this.displayError('An error occurred while searching. Please try again.');
        }
    }

    getFilterValues() {
        const platforms = [];
        if (document.getElementById('twitter').checked) platforms.push('twitter');
        if (document.getElementById('linkedin').checked) platforms.push('linkedin');
        if (document.getElementById('reddit').checked) platforms.push('reddit');
        if (document.getElementById('quora').checked) platforms.push('quora');

        // Get selected AI model
        const selectedModel = document.querySelector('input[name="aiModel"]:checked');
        const aiModel = selectedModel ? selectedModel.value : 'gpt-4';

        // Get time values from sliders
        const timeValue = parseInt(document.getElementById('timeValueSlider').value);
        const timeUnitIndex = parseInt(document.getElementById('timeUnitSlider').value);
        const timeUnit = this.timeUnits[timeUnitIndex];

        return {
            platforms,
            aiModel,
            timeValue,
            timeUnit,
            keywords: document.getElementById('keywords').value.trim()
        };
    }

    async generateMockResults(query, filters) {
        // This would normally make API calls to social media platforms
        // For now, we'll generate realistic mock data
        
        const mockData = {
            query: query,
            filters: filters,
            timestamp: new Date().toISOString(),
            intelligenceReport: this.generateIntelligenceReport(query, filters),
            platformResults: this.generatePlatformResults(filters.platforms, query)
        };

        return mockData;
    }

    generateIntelligenceReport(query, filters) {
        const aiModel = filters.aiModel;
        const timeRange = `${filters.timeValue} ${filters.timeUnit}`;
        const platforms = filters.platforms.join(', ').toUpperCase();
        
        return {
            summary: `Based on analysis of ${platforms} over the past ${timeRange}, here are the key insights about "${query}":`,
            keyFindings: [
                `Strong engagement detected across ${filters.platforms.length} platforms`,
                `Peak discussion times identified during business hours`,
                `Sentiment analysis shows predominantly positive sentiment (78%)`,
                `Top influencers and thought leaders identified in this space`,
                `Emerging trends and patterns detected in recent posts`
            ],
            recommendations: [
                "Monitor these platforms regularly for updates",
                "Consider engaging with top contributors",
                "Track sentiment changes over time",
                "Set up alerts for new relevant content"
            ]
        };
    }

    generatePlatformResults(platforms, query) {
        const results = {};
        
        platforms.forEach(platform => {
            results[platform] = this.generatePlatformSpecificResults(platform, query);
        });
        
        return results;
    }

    generatePlatformSpecificResults(platform, query) {
        const platformData = {
            twitter: {
                name: 'X (Twitter)',
                icon: 'fab fa-twitter',
                posts: [
                    `Latest discussion on ${query} shows growing interest in enterprise adoption`,
                    `Technical deep-dive thread with 2.3K retweets gaining traction`,
                    `Industry expert shares insights on ${query} market trends`,
                    `Community debate on implementation challenges`,
                    `New research paper on ${query} referenced by 15+ accounts`
                ]
            },
            linkedin: {
                name: 'LinkedIn',
                icon: 'fab fa-linkedin',
                posts: [
                    `Professional insights on ${query} from industry leaders`,
                    `Company announcement about ${query} integration`,
                    `Career opportunities in ${query} space increasing`,
                    `Thought leadership article gaining 500+ reactions`,
                    `Networking discussion on ${query} best practices`
                ]
            },
            reddit: {
                name: 'Reddit',
                icon: 'fab fa-reddit',
                posts: [
                    `r/technology discussion on ${query} with 150+ comments`,
                    `Technical subreddit analysis of ${query} performance`,
                    `Community project showcase using ${query}`,
                    `AMA session with ${query} expert scheduled`,
                    `Open source tools for ${query} development shared`
                ]
            },
            quora: {
                name: 'Quora',
                icon: 'fas fa-question-circle',
                posts: [
                    `Detailed Q&A about ${query} implementation`,
                    `Expert comparison of ${query} vs alternatives`,
                    `Beginner-friendly explanation of ${query} concepts`,
                    `Real-world case study on ${query} success`,
                    `Future predictions for ${query} development`
                ]
            }
        };

        return platformData[platform] || { name: platform, icon: 'fas fa-globe', posts: [] };
    }

    displayResults(data) {
        this.loadingIndicator.style.display = 'none';
        this.resultsContent.style.display = 'block';
        this.resultsContent.classList.add('show');

        const report = data.intelligenceReport;
        const platformResults = data.platformResults;

        let html = `
            <div class="intelligence-report">
                <h4>AI Analysis Summary (${data.filters.aiModel.toUpperCase()})</h4>
                <p><strong>Query:</strong> ${data.query}</p>
                <p><strong>Analysis Period:</strong> Past ${data.filters.timeValue} ${data.filters.timeUnit}</p>
                <p><strong>Platforms Analyzed:</strong> ${data.filters.platforms.join(', ').toUpperCase()}</p>
                
                <h5>Key Findings:</h5>
                <ul>
                    ${report.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                </ul>
                
                <h5>Recommendations:</h5>
                <ul>
                    ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="platform-results">
        `;

        Object.values(platformResults).forEach(platform => {
            html += `
                <div class="platform-result">
                    <h5>
                        <i class="${platform.icon}"></i>
                        ${platform.name}
                    </h5>
                    <ul>
                        ${platform.posts.map(post => `<li>${post}</li>`).join('')}
                    </ul>
                </div>
            `;
        });

        html += '</div>';
        this.resultsContent.innerHTML = html;
    }

    displayError(message) {
        this.loadingIndicator.style.display = 'none';
        this.resultsContent.style.display = 'block';
        this.resultsContent.innerHTML = `
            <div class="intelligence-report" style="background: #2a1a1a; border-left: 4px solid #ff4444;">
                <h4 style="color: #ff6666;">Error</h4>
                <p>${message}</p>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
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
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scoopApp = new ScoopApp();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modals/panels
    if (e.key === 'Escape') {
        if (window.scoopApp) {
            window.scoopApp.closeAllInlinePanels();
            window.scoopApp.closeAllModals();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('queryInput').focus();
    }
    
    // Space to toggle voice input (only when not in input field)
    if (e.key === ' ' && document.activeElement.id !== 'queryInput') {
        e.preventDefault();
        if (window.scoopApp) {
            window.scoopApp.toggleVoiceInput();
        }
    }
});