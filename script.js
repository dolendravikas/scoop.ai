// Scoop Application JavaScript - Perplexity Style
class ScoopApp {
    constructor() {
        this.initializeApp();
        this.setupEventListeners();
        this.currentFilterPanel = null;
    }

    initializeApp() {
        console.log('Scoop App initialized');
        this.resultsSection = document.getElementById('resultsSection');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.resultsContent = document.getElementById('resultsContent');
        this.upgradeModal = document.getElementById('upgradeModal');
    }

    setupEventListeners() {
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const queryInput = document.getElementById('queryInput');

        searchBtn.addEventListener('click', () => this.performSearch());
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Filter icons
        const filterIcons = document.querySelectorAll('.filter-icon');
        filterIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.openFilterPanel(filter);
            });
        });

        // Close filter panels
        const closeButtons = document.querySelectorAll('.close-panel');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeFilterPanel());
        });

        // Upgrade modal
        const upgradeBtn = document.getElementById('upgradeBtn');
        const closeModal = document.querySelector('.close-modal');
        
        upgradeBtn.addEventListener('click', () => this.openUpgradeModal());
        closeModal.addEventListener('click', () => this.closeUpgradeModal());

        // Close modal on outside click
        this.upgradeModal.addEventListener('click', (e) => {
            if (e.target === this.upgradeModal) {
                this.closeUpgradeModal();
            }
        });

        // Close filter panel on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-panel')) {
                this.closeFilterPanel();
            }
        });

        // Platform option interactions
        const platformOptions = document.querySelectorAll('.platform-option');
        platformOptions.forEach(option => {
            option.addEventListener('click', function() {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
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

    openFilterPanel(filterType) {
        // Close current panel if open
        if (this.currentFilterPanel) {
            this.closeFilterPanel();
        }

        // Show the selected panel
        const panel = document.getElementById(`${filterType}Panel`);
        if (panel) {
            panel.classList.add('show');
            this.currentFilterPanel = panel;
            
            // Add active state to filter icon
            const filterIcon = document.querySelector(`[data-filter="${filterType}"]`);
            if (filterIcon) {
                filterIcon.classList.add('active');
            }
        }
    }

    closeFilterPanel() {
        if (this.currentFilterPanel) {
            this.currentFilterPanel.classList.remove('show');
            
            // Remove active state from filter icon
            const filterType = this.currentFilterPanel.id.replace('Panel', '');
            const filterIcon = document.querySelector(`[data-filter="${filterType}"]`);
            if (filterIcon) {
                filterIcon.classList.remove('active');
            }
            
            this.currentFilterPanel = null;
        }
    }

    openUpgradeModal() {
        this.upgradeModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeUpgradeModal() {
        this.upgradeModal.classList.remove('show');
        document.body.style.overflow = 'auto';
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

        return {
            platforms,
            aiModel: document.getElementById('aiModel').value,
            timeValue: parseInt(document.getElementById('timeValue').value),
            timeUnit: document.getElementById('timeUnit').value,
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
            backgroundColor: type === 'error' ? '#ff4444' : '#10a37f'
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScoopApp();
});

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to close modals/panels
    if (e.key === 'Escape') {
        const app = window.scoopApp;
        if (app) {
            app.closeFilterPanel();
            app.closeUpgradeModal();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('queryInput').focus();
    }
});

// Store app instance globally for keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
    window.scoopApp = new ScoopApp();
});