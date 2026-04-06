// Get form elements
const form = document.getElementById('designForm');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const previewContainer = document.getElementById('preview');
const previewFrame = document.getElementById('previewFrame');
const addSectionBtn = document.getElementById('addSectionBtn');
const sectionsWrapper = document.getElementById('sectionsWrapper');

let sectionCount = 0;
let pageCount = 0;
let currentPage = 'main'; // Track which page we're editing

// Page management
const addPageBtn = document.getElementById('addPageBtn');
const pagesWrapper = document.getElementById('pagesWrapper');
const pages = {
    main: {
        name: 'Home',
        filename: 'index.html',
        sections: []
    }
};

// Add page functionality
addPageBtn.addEventListener('click', () => {
    pageCount++;
    const pageId = `page-${pageCount}`;
    
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-item';
    pageDiv.id = pageId;
    pageDiv.innerHTML = `
        <div class="page-header">
            <h3>Page ${pageCount + 1}</h3>
            <div>
                <button type="button" class="btn-edit" onclick="editPage('${pageId}')" aria-label="Edit page ${pageCount + 1}">Edit Page</button>
                <button type="button" class="btn-remove" onclick="removePage('${pageId}')" aria-label="Remove page ${pageCount + 1}">Remove</button>
            </div>
        </div>
        
        <div class="form-group">
            <label for="${pageId}-name">Page Name (for navigation):</label>
            <input type="text" id="${pageId}-name" placeholder="About Us" aria-required="false" onchange="updatePageName('${pageId}')">
        </div>
        
        <div class="form-group">
            <label for="${pageId}-filename">Filename:</label>
            <input type="text" id="${pageId}-filename" placeholder="about.html" aria-required="false">
        </div>
        
        <div class="form-group">
            <label for="${pageId}-heading">Page Heading:</label>
            <input type="text" id="${pageId}-heading" placeholder="About Our Company" aria-required="false">
        </div>
        
        <div class="form-group">
            <label for="${pageId}-content">Page Content:</label>
            <textarea id="${pageId}-content" rows="4" placeholder="Main content for this page..." aria-required="false"></textarea>
        </div>
    `;
    
    pagesWrapper.appendChild(pageDiv);
    
    // Initialize page in pages object
    pages[pageId] = {
        name: '',
        filename: '',
        heading: '',
        content: '',
        sections: []
    };
});

// Remove page
function removePage(pageId) {
    if (confirm('Are you sure you want to remove this page?')) {
        document.getElementById(pageId).remove();
        delete pages[pageId];
        
        // If we're editing this page, switch back to main
        if (currentPage === pageId) {
            editPage('main');
        }
    }
}

// Update page name
function updatePageName(pageId) {
    const nameInput = document.getElementById(`${pageId}-name`);
    if (pages[pageId]) {
        pages[pageId].name = nameInput.value;
    }
}

// Edit page sections
function editPage(pageId) {
    // Save current page's sections and content
    if (currentPage) {
        pages[currentPage].sections = getCurrentSections();
        
        // Save main page heading and content if on main page
        if (currentPage === 'main') {
            pages[currentPage].heading = document.getElementById('heading')?.value || '';
            pages[currentPage].content = document.getElementById('content')?.value || '';
        }
    }
    
    // Switch to new page
    currentPage = pageId;
    
    // Update main heading and content fields
    if (pageId === 'main') {
        document.getElementById('heading').value = pages[pageId].heading || '';
        document.getElementById('content').value = pages[pageId].content || '';
    } else {
        const pageHeading = document.getElementById(`${pageId}-heading`)?.value || '';
        const pageContent = document.getElementById(`${pageId}-content`)?.value || '';
        document.getElementById('heading').value = pageHeading;
        document.getElementById('content').value = pageContent;
    }
    
    // Clear sections wrapper
    sectionsWrapper.innerHTML = '';
    sectionCount = 0;
    
    // Load page's sections
    if (pages[pageId] && pages[pageId].sections) {
        pages[pageId].sections.forEach(sectionData => {
            // Recreate section
            sectionCount++;
            const sectionId = `section-${sectionCount}`;
            
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-item';
            sectionDiv.id = sectionId;
            sectionDiv.innerHTML = `
                <div class="section-header">
                    <h3>Section ${sectionCount}</h3>
                    <button type="button" class="btn-remove" onclick="removeSection('${sectionId}')" aria-label="Remove section ${sectionCount}">Remove</button>
                </div>
                
                <div class="form-group">
                    <label for="${sectionId}-type">Section Type:</label>
                    <select id="${sectionId}-type" class="section-type" data-section="${sectionId}" aria-describedby="${sectionId}-type-desc">
                        <option value="text">Text Block</option>
                        <option value="image">Image with Caption</option>
                        <option value="features">Features List</option>
                        <option value="contact">Contact Form</option>
                        <option value="showcase">Showcase Work</option>
                        <option value="hero">Hero Section</option>
                        <option value="pricing">Pricing Tables</option>
                        <option value="faq">FAQ Accordion</option>
                        <option value="timeline">Timeline/Process</option>
                        <option value="team">Team Members</option>
                        <option value="stats">Statistics/Counters</option>
                    </select>
                </div>
                
                <div id="${sectionId}-options" class="section-options" role="region" aria-label="Section ${sectionCount} options"></div>
            `;
            
            sectionsWrapper.appendChild(sectionDiv);
            
            // Set section type and trigger options
            document.getElementById(`${sectionId}-type`).value = sectionData.type;
            updateSectionOptions(sectionId, sectionData.type);
            
            // Restore section data
            restoreSectionData(sectionId, sectionData);
            
            // Add event listener for type changes
            document.getElementById(`${sectionId}-type`).addEventListener('change', (e) => {
                updateSectionOptions(sectionId, e.target.value);
            });
        });
    }
    
    // Update UI to show which page is being edited
    const pageIndicator = document.getElementById('currentPageIndicator');
    if (pageIndicator) {
        pageIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'currentPageIndicator';
    indicator.style.cssText = 'background: #d91b5c; color: white; padding: 10px 20px; border-radius: 8px; margin-bottom: 15px; font-weight: 600;';
    indicator.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>Editing: ${pageId === 'main' ? 'Home Page' : (pages[pageId]?.name || 'New Page')}</span>
            ${pageId !== 'main' ? '<button type="button" onclick="editPage(\'main\')" style="background: white; color: #d91b5c; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">Back to Home</button>' : ''}
        </div>
    `;
    sectionsWrapper.parentElement.insertBefore(indicator, sectionsWrapper);
}

// Get current sections from UI
function getCurrentSections() {
    const sections = [];
    const sectionElements = document.querySelectorAll('.section-item');
    
    sectionElements.forEach(sectionEl => {
        const sectionId = sectionEl.id;
        const type = document.getElementById(`${sectionId}-type`)?.value;
        
        if (!type) return;
        
        const sectionData = { type };
        
        // Get all inputs within this section
        const inputs = sectionEl.querySelectorAll('input:not([id*="-item-"]):not([id*="-imageUrl-"]):not([id*="-caption-"]):not([id*="-feature-"]):not([id*="-plan"]):not([id*="-faq"]):not([id*="-step"]):not([id*="-member"]):not([id*="-stat"]), textarea:not([id*="-item-"]):not([id*="-plan"]):not([id*="-faq"]):not([id*="-step"]):not([id*="-member"]), select:not([id*="-item-"])');
        inputs.forEach(input => {
            if (input.id && input.id.includes('-') && !input.id.includes('-items') && !input.id.includes('-inputs')) {
                const key = input.id.split('-').slice(2).join('-');
                if (key && key !== 'type') {
                    sectionData[key] = input.value;
                }
            }
        });
        
        // Handle specific section types with dynamic content
        if (type === 'image') {
            const imageCount = parseInt(document.getElementById(`${sectionId}-imageCount`)?.value) || 1;
            const images = [];
            for (let i = 1; i <= imageCount; i++) {
                const url = document.getElementById(`${sectionId}-imageUrl-${i}`)?.value || '';
                const caption = document.getElementById(`${sectionId}-caption-${i}`)?.value || '';
                images.push({ url, caption });
            }
            sectionData.images = images;
        }
        
        if (type === 'features') {
            const featureCount = parseInt(document.getElementById(`${sectionId}-featureCount`)?.value) || 3;
            const features = [];
            for (let i = 1; i <= featureCount; i++) {
                const feature = document.getElementById(`${sectionId}-feature-${i}`)?.value || '';
                features.push(feature);
            }
            sectionData.features = features;
        }
        
        // Add other dynamic content types as needed...
        
        sections.push(sectionData);
    });
    
    return sections;
}

// Restore section data to UI
function restoreSectionData(sectionId, sectionData) {
    // This will be populated with values from sectionData
    // For now, just trigger the initial setup
    // Values will be empty/default
}

// Color theme presets
const colorThemes = {
    professional: { bg: '#f8f9fa', text: '#212529', accent: '#0d6efd', secondary: '#6c757d' },
    vibrant: { bg: '#ffffff', text: '#2d3748', accent: '#9333ea', secondary: '#f97316' },
    pastel: { bg: '#fef3f8', text: '#4a5568', accent: '#ec4899', secondary: '#93c5fd' },
    dark: { bg: '#1a202c', text: '#e2e8f0', accent: '#06b6d4', secondary: '#8b5cf6' },
    nature: { bg: '#f0fdf4', text: '#1e3a1e', accent: '#22c55e', secondary: '#92400e' },
    sunset: { bg: '#fff7ed', text: '#431407', accent: '#f97316', secondary: '#ec4899' }
};

// Handle color theme changes
document.getElementById('colorTheme').addEventListener('change', (e) => {
    const theme = e.target.value;
    const customColors = document.getElementById('customColors');
    
    if (theme === 'custom') {
        customColors.style.display = 'block';
    } else {
        customColors.style.display = 'none';
        const colors = colorThemes[theme];
        if (colors) {
            document.getElementById('bgColor').value = colors.bg;
            document.getElementById('textColor').value = colors.text;
            document.getElementById('accentColor').value = colors.accent;
            document.getElementById('secondaryAccent').value = colors.secondary;
        }
    }
});

// Handle header/footer toggles
document.getElementById('includeHeader').addEventListener('change', (e) => {
    document.getElementById('headerOptions').style.display = e.target.value === 'yes' ? 'block' : 'none';
});

document.getElementById('includeFooter').addEventListener('change', (e) => {
    document.getElementById('footerOptions').style.display = e.target.value === 'yes' ? 'block' : 'none';
});

// Initialize custom colors display
document.getElementById('customColors').style.display = 'block';

// Add section functionality
addSectionBtn.addEventListener('click', () => {
    sectionCount++;
    const sectionId = `section-${sectionCount}`;
    
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-item';
    sectionDiv.id = sectionId;
    sectionDiv.innerHTML = `
        <div class="section-header">
            <h3>Section ${sectionCount}</h3>
            <button type="button" class="btn-remove" onclick="removeSection('${sectionId}')" aria-label="Remove section ${sectionCount}">Remove</button>
        </div>
        
        <div class="form-group">
            <label for="${sectionId}-type">Section Type:</label>
            <select id="${sectionId}-type" class="section-type" data-section="${sectionId}" aria-describedby="${sectionId}-type-desc">
                <option value="text">Text Block</option>
                <option value="image">Image with Caption</option>
                <option value="features">Features List</option>
                <option value="contact">Contact Form</option>
                <option value="showcase">Showcase Work</option>
                <option value="hero">Hero Section</option>
                <option value="pricing">Pricing Tables</option>
                <option value="faq">FAQ Accordion</option>
                <option value="timeline">Timeline/Process</option>
                <option value="team">Team Members</option>
                <option value="stats">Statistics/Counters</option>
            </select>
        </div>
        
        <div id="${sectionId}-options" class="section-options" role="region" aria-label="Section ${sectionCount} options"></div>
    `;
    
    sectionsWrapper.appendChild(sectionDiv);
    
    // Trigger initial options display
    updateSectionOptions(sectionId, 'text');
    
    // Add event listener for type changes
    document.getElementById(`${sectionId}-type`).addEventListener('change', (e) => {
        updateSectionOptions(sectionId, e.target.value);
    });
});

// Remove section
function removeSection(sectionId) {
    document.getElementById(sectionId).remove();
}

// Add showcase item
function addShowcaseItem(sectionId) {
    const itemsContainer = document.getElementById(`${sectionId}-items`);
    const itemCount = itemsContainer.children.length + 1;
    const itemId = `${sectionId}-item-${itemCount}`;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'showcase-item';
    itemDiv.id = itemId;
    itemDiv.innerHTML = `
        <div class="showcase-item-header">
            <strong>Item ${itemCount}</strong>
            <button type="button" class="btn-remove-small" onclick="removeShowcaseItem('${itemId}')" aria-label="Remove item ${itemCount}">×</button>
        </div>
        <div class="form-group">
            <label for="${itemId}-title">Title:</label>
            <input type="text" id="${itemId}-title" value="Project ${itemCount}" aria-required="false">
        </div>
        <div class="form-group">
            <label for="${itemId}-description">Description:</label>
            <textarea id="${itemId}-description" rows="2" aria-required="false">Description of this item</textarea>
        </div>
        <div class="form-group">
            <label for="${itemId}-mediaType">Media Type:</label>
            <select id="${itemId}-mediaType" onchange="updateShowcaseMedia('${itemId}')">
                <option value="image">Image Only</option>
                <option value="video">Video Only</option>
                <option value="both">Image & Video</option>
            </select>
        </div>
        <div id="${itemId}-mediaInputs"></div>
        <div class="form-group">
            <label for="${itemId}-link">Link (optional):</label>
            <input type="url" id="${itemId}-link" placeholder="https://example.com" aria-required="false">
        </div>
    `;
    
    itemsContainer.appendChild(itemDiv);
    
    // Initialize media inputs
    updateShowcaseMedia(itemId);
}

// Update showcase media inputs based on type
function updateShowcaseMedia(itemId) {
    const mediaType = document.getElementById(`${itemId}-mediaType`).value;
    const container = document.getElementById(`${itemId}-mediaInputs`);
    
    let inputsHTML = '';
    
    switch(mediaType) {
        case 'image':
            inputsHTML = `
                <div class="form-group">
                    <label for="${itemId}-image">Image URL:</label>
                    <input type="url" id="${itemId}-image" value="https://via.placeholder.com/400x300">
                </div>
            `;
            break;
            
        case 'video':
            inputsHTML = `
                <div class="form-group">
                    <label for="${itemId}-video">Video URL (YouTube, Vimeo, or direct link):</label>
                    <input type="url" id="${itemId}-video" placeholder="https://www.youtube.com/watch?v=...">
                </div>
            `;
            break;
            
        case 'both':
            inputsHTML = `
                <div class="form-group">
                    <label for="${itemId}-mediaLayout">Media Layout:</label>
                    <select id="${itemId}-mediaLayout">
                        <option value="carousel">Carousel (swipe through)</option>
                        <option value="side-by-side">Side by Side</option>
                        <option value="stacked">Stacked (image then video)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-image">Image URL:</label>
                    <input type="url" id="${itemId}-image" value="https://via.placeholder.com/400x300">
                </div>
                <div class="form-group">
                    <label for="${itemId}-video">Video URL (YouTube, Vimeo, or direct link):</label>
                    <input type="url" id="${itemId}-video" placeholder="https://www.youtube.com/watch?v=...">
                </div>
            `;
            break;
    }
    
    container.innerHTML = inputsHTML;
}

// Remove showcase item
function removeShowcaseItem(itemId) {
    document.getElementById(itemId).remove();
}

// Update section options based on type
function updateSectionOptions(sectionId, type) {
    const optionsDiv = document.getElementById(`${sectionId}-options`);
    
    let optionsHTML = '';
    
    switch(type) {
        case 'text':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-heading">Heading:</label>
                    <input type="text" id="${sectionId}-heading" placeholder="Section Heading" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-content">Content:</label>
                    <textarea id="${sectionId}-content" rows="3" placeholder="Your section content here." aria-required="false"></textarea>
                </div>
                <div class="form-group">
                    <label for="${sectionId}-align">Text Alignment:</label>
                    <select id="${sectionId}-align">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            `;
            break;
            
        case 'image':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-imageCount">How many images?</label>
                    <input type="number" id="${sectionId}-imageCount" value="1" min="1" max="10" onchange="updateImageInputs('${sectionId}')" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-imageSize">Image Size:</label>
                    <select id="${sectionId}-imageSize">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
                <div id="${sectionId}-imageInputs" class="dynamic-inputs" role="region" aria-label="Image inputs"></div>
            `;
            break;
            
        case 'features':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-featuresTitle">Features Title:</label>
                    <input type="text" id="${sectionId}-featuresTitle" value="Our Features" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-featureCount">How many features?</label>
                    <input type="number" id="${sectionId}-featureCount" value="3" min="1" max="10" onchange="updateFeatureInputs('${sectionId}')" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-layout">Layout:</label>
                    <select id="${sectionId}-layout">
                        <option value="vertical">Vertical List</option>
                        <option value="horizontal">Horizontal Grid</option>
                    </select>
                </div>
                <div id="${sectionId}-featureInputs" class="dynamic-inputs" role="region" aria-label="Feature inputs"></div>
            `;
            break;
            
        case 'contact':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactTitle">Form Title:</label>
                    <input type="text" id="${sectionId}-contactTitle" value="Contact Us" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-contactType">Contact Method:</label>
                    <select id="${sectionId}-contactType" onchange="updateContactInput('${sectionId}')">
                        <option value="email">Email Form</option>
                        <option value="phone">Phone Number</option>
                        <option value="link">External Link</option>
                        <option value="social">Social Media</option>
                        <option value="address">Physical Address</option>
                    </select>
                </div>
                <div id="${sectionId}-contactInput" role="region" aria-label="Contact input"></div>
                <div class="form-group">
                    <label for="${sectionId}-buttonText">Button Text:</label>
                    <input type="text" id="${sectionId}-buttonText" value="Send Message" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-buttonColor">Button Color:</label>
                    <input type="color" id="${sectionId}-buttonColor" value="#d91b5c" aria-label="Button color picker">
                </div>
            `;
            break;
            
        case 'showcase':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-showcaseTitle">Showcase Title:</label>
                    <input type="text" id="${sectionId}-showcaseTitle" value="My Work" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-showcaseType">What to Showcase:</label>
                    <select id="${sectionId}-showcaseType">
                        <option value="projects">Projects</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="gallery">Gallery</option>
                        <option value="testimonials">Testimonials</option>
                        <option value="products">Products</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="${sectionId}-showcaseLayout">Layout Style:</label>
                    <select id="${sectionId}-showcaseLayout">
                        <option value="grid">Grid (2 columns)</option>
                        <option value="grid3">Grid (3 columns)</option>
                        <option value="list">Vertical List</option>
                        <option value="cards">Card Style</option>
                    </select>
                </div>
                <div class="showcase-items-section">
                    <label id="${sectionId}-itemsLabel">Items to Showcase:</label>
                    <button type="button" class="btn-add-small" onclick="addShowcaseItem('${sectionId}')" aria-label="Add showcase item">+ Add Item</button>
                    <div id="${sectionId}-items" class="showcase-items-container" role="region" aria-labelledby="${sectionId}-itemsLabel"></div>
                </div>
            `;
            break;
            
        case 'hero':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-heroTitle">Hero Title:</label>
                    <input type="text" id="${sectionId}-heroTitle" value="Welcome to Our Website" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-heroSubtitle">Subtitle:</label>
                    <input type="text" id="${sectionId}-heroSubtitle" value="We create amazing experiences" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-heroDescription">Description:</label>
                    <textarea id="${sectionId}-heroDescription" rows="3" aria-required="false">Transform your ideas into reality with our innovative solutions.</textarea>
                </div>
                <div class="form-group">
                    <label for="${sectionId}-heroCTA">Call-to-Action Text:</label>
                    <input type="text" id="${sectionId}-heroCTA" value="Get Started" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-heroCTALink">CTA Link:</label>
                    <input type="url" id="${sectionId}-heroCTALink" value="#contact" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-heroImage">Background Image URL (optional):</label>
                    <input type="url" id="${sectionId}-heroImage" placeholder="https://example.com/image.jpg" aria-required="false">
                </div>
            `;
            break;
            
        case 'pricing':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-pricingTitle">Pricing Section Title:</label>
                    <input type="text" id="${sectionId}-pricingTitle" value="Our Pricing Plans" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-planCount">Number of Plans:</label>
                    <input type="number" id="${sectionId}-planCount" value="3" min="1" max="6" onchange="updatePricingInputs('${sectionId}')" aria-required="false">
                </div>
                <div id="${sectionId}-pricingInputs" class="dynamic-inputs" role="region" aria-label="Pricing plan inputs"></div>
            `;
            break;
            
        case 'faq':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-faqTitle">FAQ Section Title:</label>
                    <input type="text" id="${sectionId}-faqTitle" value="Frequently Asked Questions" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-faqCount">Number of Questions:</label>
                    <input type="number" id="${sectionId}-faqCount" value="4" min="1" max="10" onchange="updateFAQInputs('${sectionId}')" aria-required="false">
                </div>
                <div id="${sectionId}-faqInputs" class="dynamic-inputs" role="region" aria-label="FAQ inputs"></div>
            `;
            break;
            
        case 'timeline':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-timelineTitle">Timeline Title:</label>
                    <input type="text" id="${sectionId}-timelineTitle" value="Our Process" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-stepCount">Number of Steps:</label>
                    <input type="number" id="${sectionId}-stepCount" value="4" min="1" max="10" onchange="updateTimelineInputs('${sectionId}')" aria-required="false">
                </div>
                <div id="${sectionId}-timelineInputs" class="dynamic-inputs" role="region" aria-label="Timeline step inputs"></div>
            `;
            break;
            
        case 'team':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-teamTitle">Team Section Title:</label>
                    <input type="text" id="${sectionId}-teamTitle" value="Meet Our Team" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-memberCount">Number of Team Members:</label>
                    <input type="number" id="${sectionId}-memberCount" value="4" min="1" max="12" onchange="updateTeamInputs('${sectionId}')" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-teamLayout">Layout:</label>
                    <select id="${sectionId}-teamLayout">
                        <option value="grid2">Grid (2 columns)</option>
                        <option value="grid3" selected>Grid (3 columns)</option>
                        <option value="grid4">Grid (4 columns)</option>
                    </select>
                </div>
                <div id="${sectionId}-teamInputs" class="dynamic-inputs" role="region" aria-label="Team member inputs"></div>
            `;
            break;
            
        case 'stats':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-statsTitle">Statistics Title:</label>
                    <input type="text" id="${sectionId}-statsTitle" value="Our Achievements" aria-required="false">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-statCount">Number of Statistics:</label>
                    <input type="number" id="${sectionId}-statCount" value="4" min="1" max="8" onchange="updateStatsInputs('${sectionId}')" aria-required="false">
                </div>
                <div id="${sectionId}-statsInputs" class="dynamic-inputs" role="region" aria-label="Statistics inputs"></div>
            `;
            break;
    }
    
    optionsDiv.innerHTML = optionsHTML;
    
    // Initialize dynamic inputs based on type
    if (type === 'showcase') {
        addShowcaseItem(sectionId);
    } else if (type === 'image') {
        updateImageInputs(sectionId);
    } else if (type === 'features') {
        updateFeatureInputs(sectionId);
    } else if (type === 'contact') {
        updateContactInput(sectionId);
    } else if (type === 'pricing') {
        updatePricingInputs(sectionId);
    } else if (type === 'faq') {
        updateFAQInputs(sectionId);
    } else if (type === 'timeline') {
        updateTimelineInputs(sectionId);
    } else if (type === 'team') {
        updateTeamInputs(sectionId);
    } else if (type === 'stats') {
        updateStatsInputs(sectionId);
    }
}

// Update pricing inputs
function updatePricingInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-planCount`)?.value) || 3;
    const container = document.getElementById(`${sectionId}-pricingInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="dynamic-input-group">
                <h4>Plan ${i}</h4>
                <div class="form-group">
                    <label for="${sectionId}-plan${i}-name">Plan Name:</label>
                    <input type="text" id="${sectionId}-plan${i}-name" value="Plan ${i}">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-plan${i}-price">Price:</label>
                    <input type="text" id="${sectionId}-plan${i}-price" value="$${i * 10}/mo">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-plan${i}-features">Features (comma-separated):</label>
                    <textarea id="${sectionId}-plan${i}-features" rows="3">Feature 1, Feature 2, Feature 3</textarea>
                </div>
                <div class="form-group">
                    <label for="${sectionId}-plan${i}-highlight">Highlight this plan:</label>
                    <select id="${sectionId}-plan${i}-highlight">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Update FAQ inputs
function updateFAQInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-faqCount`)?.value) || 4;
    const container = document.getElementById(`${sectionId}-faqInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="dynamic-input-group">
                <h4>Question ${i}</h4>
                <div class="form-group">
                    <label for="${sectionId}-faq${i}-question">Question:</label>
                    <input type="text" id="${sectionId}-faq${i}-question" value="Question ${i}?">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-faq${i}-answer">Answer:</label>
                    <textarea id="${sectionId}-faq${i}-answer" rows="3">Answer to question ${i}.</textarea>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Update timeline inputs
function updateTimelineInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-stepCount`)?.value) || 4;
    const container = document.getElementById(`${sectionId}-timelineInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="dynamic-input-group">
                <h4>Step ${i}</h4>
                <div class="form-group">
                    <label for="${sectionId}-step${i}-title">Step Title:</label>
                    <input type="text" id="${sectionId}-step${i}-title" value="Step ${i}">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-step${i}-description">Description:</label>
                    <textarea id="${sectionId}-step${i}-description" rows="2">Description of step ${i}.</textarea>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Update team inputs
function updateTeamInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-memberCount`)?.value) || 4;
    const container = document.getElementById(`${sectionId}-teamInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="dynamic-input-group">
                <h4>Team Member ${i}</h4>
                <div class="form-group">
                    <label for="${sectionId}-member${i}-name">Name:</label>
                    <input type="text" id="${sectionId}-member${i}-name" value="Team Member ${i}">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-member${i}-role">Role/Position:</label>
                    <input type="text" id="${sectionId}-member${i}-role" value="Position">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-member${i}-bio">Bio:</label>
                    <textarea id="${sectionId}-member${i}-bio" rows="2">Brief bio about this team member.</textarea>
                </div>
                <div class="form-group">
                    <label for="${sectionId}-member${i}-image">Photo URL:</label>
                    <input type="url" id="${sectionId}-member${i}-image" value="https://via.placeholder.com/300">
                </div>
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Update stats inputs
function updateStatsInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-statCount`)?.value) || 4;
    const container = document.getElementById(`${sectionId}-statsInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="dynamic-input-group">
                <h4>Statistic ${i}</h4>
                <div class="form-group">
                    <label for="${sectionId}-stat${i}-number">Number/Value:</label>
                    <input type="text" id="${sectionId}-stat${i}-number" value="${i * 100}+">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-stat${i}-label">Label:</label>
                    <input type="text" id="${sectionId}-stat${i}-label" value="Statistic ${i}">
                </div>
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Update contact input based on type
function updateContactInput(sectionId) {
    const contactType = document.getElementById(`${sectionId}-contactType`).value;
    const container = document.getElementById(`${sectionId}-contactInput`);
    
    let inputHTML = '';
    
    switch(contactType) {
        case 'email':
            inputHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactValue">Your Email Address (where form submissions go):</label>
                    <input type="email" id="${sectionId}-contactValue" placeholder="your@email.com">
                </div>
            `;
            break;
            
        case 'phone':
            inputHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactValue">Phone Number:</label>
                    <input type="tel" id="${sectionId}-contactValue" placeholder="+1 (555) 123-4567">
                </div>
            `;
            break;
            
        case 'link':
            inputHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactValue">Contact Form Link:</label>
                    <input type="url" id="${sectionId}-contactValue" placeholder="https://example.com/contact">
                </div>
            `;
            break;
            
        case 'social':
            inputHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactValue">Social Media Link:</label>
                    <input type="url" id="${sectionId}-contactValue" placeholder="https://twitter.com/username">
                </div>
            `;
            break;
            
        case 'address':
            inputHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactValue">Physical Address:</label>
                    <textarea id="${sectionId}-contactValue" rows="3" placeholder="123 Main St&#10;City, State 12345"></textarea>
                </div>
            `;
            break;
    }
    
    container.innerHTML = inputHTML;
}

// Update image inputs based on count
function updateImageInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-imageCount`).value) || 1;
    const container = document.getElementById(`${sectionId}-imageInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="dynamic-input-group">
                <h4>Image ${i}</h4>
                <div class="form-group">
                    <label for="${sectionId}-imageUrl-${i}">Image URL:</label>
                    <input type="text" id="${sectionId}-imageUrl-${i}" value="https://via.placeholder.com/600x400">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-caption-${i}">Caption:</label>
                    <input type="text" id="${sectionId}-caption-${i}" value="Image ${i} caption">
                </div>
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Update feature inputs based on count
function updateFeatureInputs(sectionId) {
    const count = parseInt(document.getElementById(`${sectionId}-featureCount`).value) || 3;
    const container = document.getElementById(`${sectionId}-featureInputs`);
    
    let inputsHTML = '';
    for (let i = 1; i <= count; i++) {
        inputsHTML += `
            <div class="form-group">
                <label for="${sectionId}-feature-${i}">Feature ${i}:</label>
                <input type="text" id="${sectionId}-feature-${i}" value="Feature ${i}">
            </div>
        `;
    }
    
    container.innerHTML = inputsHTML;
}

// Get user selections
function getUserSelections() {
    // Save current page's sections and content before collecting all data
    if (currentPage) {
        pages[currentPage].sections = getCurrentSections();
        
        // Save heading and content for current page
        if (currentPage === 'main') {
            pages[currentPage].heading = document.getElementById('heading')?.value || '';
            pages[currentPage].content = document.getElementById('content')?.value || '';
        } else {
            // For non-main pages, save from the heading/content fields
            pages[currentPage].heading = document.getElementById('heading')?.value || '';
            pages[currentPage].content = document.getElementById('content')?.value || '';
            
            // Also update the page's own fields
            const pageHeadingInput = document.getElementById(`${currentPage}-heading`);
            const pageContentInput = document.getElementById(`${currentPage}-content`);
            if (pageHeadingInput) pageHeadingInput.value = pages[currentPage].heading;
            if (pageContentInput) pageContentInput.value = pages[currentPage].content;
        }
    }
    
    // Update page info from inputs
    Object.keys(pages).forEach(pageId => {
        if (pageId !== 'main') {
            const nameInput = document.getElementById(`${pageId}-name`);
            const filenameInput = document.getElementById(`${pageId}-filename`);
            const headingInput = document.getElementById(`${pageId}-heading`);
            const contentInput = document.getElementById(`${pageId}-content`);
            
            if (nameInput) pages[pageId].name = nameInput.value || 'Page';
            if (filenameInput) pages[pageId].filename = filenameInput.value || 'page.html';
            if (headingInput && pageId !== currentPage) pages[pageId].heading = headingInput.value || '';
            if (contentInput && pageId !== currentPage) pages[pageId].content = contentInput.value || '';
        }
    });
    
    return {
        siteTitle: document.getElementById('siteTitle').value || 'My Awesome Website',
        heading: document.getElementById('heading').value || 'Welcome to My Site',
        content: document.getElementById('content').value || 'This is my website content.',
        bgColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        accentColor: document.getElementById('accentColor').value,
        secondaryAccent: document.getElementById('secondaryAccent').value,
        fontFamily: document.getElementById('fontFamily').value,
        headingFont: document.getElementById('headingFont').value,
        fontSize: document.getElementById('fontSize').value,
        lineHeight: document.getElementById('lineHeight').value,
        pageWidth: document.getElementById('pageWidth').value,
        spacing: document.getElementById('spacing').value,
        borderRadius: document.getElementById('borderRadius').value,
        shadowIntensity: document.getElementById('shadowIntensity').value,
        buttonStyle: document.getElementById('buttonStyle').value,
        buttonSize: document.getElementById('buttonSize').value,
        animations: document.getElementById('animations').value,
        contentAlign: document.getElementById('contentAlign').value,
        includeHeader: document.getElementById('includeHeader').value,
        logoType: document.getElementById('logoType')?.value || 'text',
        logoContent: document.getElementById('logoContent')?.value || 'My Brand',
        navItems: document.getElementById('navItems')?.value || 'Home, About, Services, Contact',
        headerStyle: document.getElementById('headerStyle')?.value || 'static',
        includeFooter: document.getElementById('includeFooter').value,
        copyrightText: document.getElementById('copyrightText')?.value || '© 2024 My Website. All rights reserved.',
        socialLinks: document.getElementById('socialLinks')?.value || '',
        pages: pages
    };
}

// Generate HTML content based on user selections
function generateHTML(selections, pageId = 'main', allPages = null) {
    const pageData = selections.pages[pageId];
    const sections = pageData?.sections || [];
    
    // Calculate derived values
    const fontSizeMap = { small: '14px', medium: '16px', large: '18px' };
    const baseFontSize = fontSizeMap[selections.fontSize] || '16px';
    const pageWidthMap = { narrow: '800px', standard: '1200px', wide: '1400px', full: '100%' };
    const maxWidth = pageWidthMap[selections.pageWidth] || '1200px';
    const spacingMap = { compact: '20px', comfortable: '40px', spacious: '60px' };
    const sectionSpacing = spacingMap[selections.spacing] || '40px';
    const shadowMap = {
        none: 'none',
        subtle: '0 2px 4px rgba(0,0,0,0.05)',
        medium: '0 4px 12px rgba(0,0,0,0.1)',
        strong: '0 8px 24px rgba(0,0,0,0.15)'
    };
    const boxShadow = shadowMap[selections.shadowIntensity] || shadowMap.medium;
    const buttonSizeMap = {
        small: { padding: '8px 20px', fontSize: '14px' },
        medium: { padding: '12px 30px', fontSize: '16px' },
        large: { padding: '16px 40px', fontSize: '18px' }
    };
    const btnSize = buttonSizeMap[selections.buttonSize] || buttonSizeMap.medium;
    const transition = selections.animations === 'enabled' ? 'all 0.3s ease' : 'none';
    
    // Generate button styles based on selection
    const getButtonStyle = (color) => {
        const styles = {
            filled: `background: ${color}; color: white; border: 2px solid ${color};`,
            outline: `background: transparent; color: ${color}; border: 2px solid ${color};`,
            ghost: `background: transparent; color: ${color}; border: none;`
        };
        return styles[selections.buttonStyle] || styles.filled;
    };
    
    // Generate header HTML with navigation to all pages
    let headerHTML = '';
    if (selections.includeHeader === 'yes') {
        let navHTML = '';
        
        // Add home link
        navHTML += `<a href="index.html" style="color: ${selections.textColor}; text-decoration: none; padding: 10px 15px; transition: ${transition};">Home</a>`;
        
        // Add links to other pages
        if (allPages) {
            Object.keys(allPages).forEach(pid => {
                if (pid !== 'main' && allPages[pid].name && allPages[pid].filename) {
                    navHTML += `<a href="${allPages[pid].filename}" style="color: ${selections.textColor}; text-decoration: none; padding: 10px 15px; transition: ${transition};">${allPages[pid].name}</a>`;
                }
            });
        }
        
        const logoHTML = selections.logoType === 'image' 
            ? `<img src="${selections.logoContent}" alt="Logo" style="height: 40px;">`
            : `<span style="font-size: 1.5em; font-weight: bold; color: ${selections.accentColor};">${selections.logoContent}</span>`;
        
        const headerPosition = selections.headerStyle === 'sticky' ? 'position: sticky; top: 0; z-index: 1000;' : '';
        
        headerHTML = `
        <header style="${headerPosition} background: ${selections.bgColor}; padding: 20px 0; box-shadow: ${boxShadow}; border-bottom: 2px solid ${selections.accentColor};">
            <div style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
                <div class="logo"><a href="index.html" style="text-decoration: none;">${logoHTML}</a></div>
                <nav style="display: flex; gap: 10px;">
                    ${navHTML}
                </nav>
            </div>
        </header>`;
    }
    
    // Generate footer HTML
    let footerHTML = '';
    if (selections.includeFooter === 'yes') {
        let socialHTML = '';
        if (selections.socialLinks) {
            const socialArray = selections.socialLinks.split(',').map(item => item.trim());
            socialHTML = '<div style="margin-top: 15px;">' + socialArray.map(link => {
                const [platform, url] = link.split('|').map(s => s.trim());
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: ${selections.accentColor}; text-decoration: none; margin: 0 10px; transition: ${transition};">${platform}</a>`;
            }).join('') + '</div>';
        }
        
        footerHTML = `
        <footer style="background: ${selections.textColor}; color: ${selections.bgColor}; padding: ${sectionSpacing} 20px; margin-top: ${sectionSpacing}; text-align: center;">
            <div style="max-width: ${maxWidth}; margin: 0 auto;">
                <p>${selections.copyrightText}</p>
                ${socialHTML}
            </div>
        </footer>`;
    }
    
    let sectionsHTML = '';
    
    sections.forEach((section, index) => {
        switch(section.type) {
            case 'text':
                sectionsHTML += `
        <section class="text-section" style="text-align: ${section.align || 'left'}; margin: 40px 0;">
            <h2>${section.heading || 'Section Heading'}</h2>
            <p>${section.content || 'Section content'}</p>
        </section>`;
                break;
                
            case 'image':
                const imageWidth = section.imageSize === 'small' ? '300px' : section.imageSize === 'medium' ? '500px' : '100%';
                let imagesHTML = '';
                
                if (section.images && section.images.length > 0) {
                    section.images.forEach(img => {
                        imagesHTML += `
            <div style="margin-bottom: 30px;">
                <img src="${img.url}" alt="${img.caption}" style="max-width: ${imageWidth}; height: auto; border-radius: 8px; display: block; margin: 0 auto;">
                <p style="margin-top: 10px; font-style: italic;">${img.caption}</p>
            </div>`;
                    });
                }
                
                sectionsHTML += `
        <section class="image-section" style="margin: 40px 0; text-align: center;">
            ${imagesHTML}
        </section>`;
                break;
                
            case 'features':
                const isHorizontal = section.layout === 'horizontal';
                let featuresHTML = '';
                
                if (section.features && section.features.length > 0) {
                    section.features.forEach(feature => {
                        featuresHTML += `
                <div style="padding: 20px; ${!isHorizontal ? 'margin-bottom: 15px;' : ''} background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <p style="font-size: 1.2em;">✓ ${feature}</p>
                </div>`;
                    });
                }
                
                sectionsHTML += `
        <section class="features-section" style="margin: 40px 0;">
            <h2 style="text-align: center; margin-bottom: 30px;">${section.featuresTitle || 'Our Features'}</h2>
            <div style="display: ${isHorizontal ? 'grid' : 'block'}; ${isHorizontal ? 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;' : ''}">
                ${featuresHTML}
            </div>
        </section>`;
                break;
                
            case 'contact':
                const contactType = section.contactType || 'email';
                const contactValue = section.contactValue || '';
                let contactHTML = '';
                
                switch(contactType) {
                    case 'email':
                        contactHTML = `
            <form action="https://formsubmit.co/${contactValue}" method="POST" style="max-width: 500px; margin: 0 auto;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Name:</label>
                    <input type="text" name="name" required style="width: 100%; padding: 10px; border: 2px solid ${selections.accentColor}; border-radius: 5px; font-family: ${selections.fontFamily};">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Email:</label>
                    <input type="email" name="email" required style="width: 100%; padding: 10px; border: 2px solid ${selections.accentColor}; border-radius: 5px; font-family: ${selections.fontFamily};">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Message:</label>
                    <textarea name="message" rows="4" required style="width: 100%; padding: 10px; border: 2px solid ${selections.accentColor}; border-radius: 5px; font-family: ${selections.fontFamily};"></textarea>
                </div>
                <button type="submit" style="background: ${section.buttonColor || selections.accentColor}; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; font-weight: 600;">${section.buttonText || 'Send Message'}</button>
            </form>`;
                        break;
                        
                    case 'phone':
                        contactHTML = `
            <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                <p style="font-size: 1.3em; margin-bottom: 20px;">Call us at:</p>
                <a href="tel:${contactValue}" style="font-size: 2em; color: ${selections.accentColor}; text-decoration: none; font-weight: bold; display: block; margin-bottom: 20px;">${contactValue}</a>
                <a href="tel:${contactValue}" style="background: ${section.buttonColor || selections.accentColor}; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block;">${section.buttonText || 'Call Now'}</a>
            </div>`;
                        break;
                        
                    case 'link':
                        contactHTML = `
            <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                <p style="font-size: 1.2em; margin-bottom: 20px;">Get in touch with us through our contact form</p>
                <a href="${contactValue}" target="_blank" style="background: ${section.buttonColor || selections.accentColor}; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block;">${section.buttonText || 'Contact Us'}</a>
            </div>`;
                        break;
                        
                    case 'social':
                        contactHTML = `
            <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                <p style="font-size: 1.2em; margin-bottom: 20px;">Connect with us on social media</p>
                <a href="${contactValue}" target="_blank" style="background: ${section.buttonColor || selections.accentColor}; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; font-weight: 600; text-decoration: none; display: inline-block;">${section.buttonText || 'Follow Us'}</a>
            </div>`;
                        break;
                        
                    case 'address':
                        contactHTML = `
            <div style="max-width: 500px; margin: 0 auto; text-align: center;">
                <p style="font-size: 1.3em; margin-bottom: 20px;">Visit us at:</p>
                <p style="font-size: 1.2em; line-height: 1.8; white-space: pre-line; color: #666;">${contactValue}</p>
            </div>`;
                        break;
                }
                
                sectionsHTML += `
        <section class="contact-section" style="margin: 40px 0;">
            <h2 style="text-align: center; margin-bottom: 20px;">${section.contactTitle || 'Contact Us'}</h2>
            ${contactHTML}
        </section>`;
                break;
                
            case 'showcase':
                let showcaseItemsHTML = '';
                const layout = section.showcaseLayout || 'grid';
                const isCard = layout === 'cards';
                
                if (section.items && section.items.length > 0) {
                    section.items.forEach(item => {
                        let mediaHTML = '';
                        const mediaType = item.mediaType || 'image';
                        
                        // Helper function to convert video URLs to embed format
                        const getEmbedUrl = (url) => {
                            if (!url) return '';
                            
                            // YouTube
                            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                                const videoId = url.includes('youtu.be') 
                                    ? url.split('youtu.be/')[1]?.split('?')[0]
                                    : url.split('v=')[1]?.split('&')[0];
                                return `https://www.youtube.com/embed/${videoId}`;
                            }
                            
                            // Vimeo
                            if (url.includes('vimeo.com')) {
                                const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
                                return `https://player.vimeo.com/video/${videoId}`;
                            }
                            
                            // Direct video link
                            return url;
                        };
                        
                        if (mediaType === 'image') {
                            mediaHTML = `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 250px; object-fit: cover;">`;
                        } else if (mediaType === 'video') {
                            const embedUrl = getEmbedUrl(item.video);
                            if (embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com')) {
                                mediaHTML = `<iframe src="${embedUrl}" style="width: 100%; height: 250px; border: none;" allowfullscreen title="${item.title} video"></iframe>`;
                            } else {
                                mediaHTML = `<video src="${item.video}" controls style="width: 100%; height: 250px; object-fit: cover;" aria-label="${item.title} video"></video>`;
                            }
                        } else if (mediaType === 'both') {
                            const mediaLayout = item.mediaLayout || 'carousel';
                            const embedUrl = getEmbedUrl(item.video);
                            
                            if (mediaLayout === 'carousel') {
                                mediaHTML = `
                                    <div style="position: relative; width: 100%; height: 250px; overflow: hidden;">
                                        <div class="carousel-container" style="display: flex; transition: transform 0.3s ease;">
                                            <div style="min-width: 100%; height: 250px;">
                                                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                            </div>
                                            <div style="min-width: 100%; height: 250px;">
                                                ${embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') 
                                                    ? `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen title="${item.title} video"></iframe>`
                                                    : `<video src="${item.video}" controls style="width: 100%; height: 100%; object-fit: cover;" aria-label="${item.title} video"></video>`}
                                            </div>
                                        </div>
                                        <button onclick="this.parentElement.querySelector('.carousel-container').style.transform = 'translateX(0%)'" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; padding: 10px 15px; cursor: pointer; border-radius: 50%; font-size: 18px;" aria-label="Previous slide">‹</button>
                                        <button onclick="this.parentElement.querySelector('.carousel-container').style.transform = 'translateX(-100%)'" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; padding: 10px 15px; cursor: pointer; border-radius: 50%; font-size: 18px;" aria-label="Next slide">›</button>
                                    </div>`;
                            } else if (mediaLayout === 'side-by-side') {
                                mediaHTML = `
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; height: 250px;">
                                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                        ${embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') 
                                            ? `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen title="${item.title} video"></iframe>`
                                            : `<video src="${item.video}" controls style="width: 100%; height: 100%; object-fit: cover;" aria-label="${item.title} video"></video>`}
                                    </div>`;
                            } else if (mediaLayout === 'stacked') {
                                mediaHTML = `
                                    <div style="height: auto;">
                                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 10px;">
                                        ${embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') 
                                            ? `<iframe src="${embedUrl}" style="width: 100%; height: 200px; border: none;" allowfullscreen title="${item.title} video"></iframe>`
                                            : `<video src="${item.video}" controls style="width: 100%; height: 200px; object-fit: cover;" aria-label="${item.title} video"></video>`}
                                    </div>`;
                            }
                        }
                        
                        const itemHTML = `
                <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); ${isCard ? 'border: 2px solid ' + selections.accentColor + ';' : ''}">
                    ${mediaHTML}
                    <div style="padding: 20px;">
                        <h3 style="color: ${selections.accentColor}; margin-bottom: 10px; font-size: 1.4em;">${item.title}</h3>
                        <p style="margin-bottom: 15px; color: #666;">${item.description}</p>
                        ${item.link ? `<a href="${item.link}" style="color: ${selections.accentColor}; text-decoration: none; font-weight: 600;" aria-label="View more about ${item.title}">View More →</a>` : ''}
                    </div>
                </div>`;
                        showcaseItemsHTML += itemHTML;
                    });
                }
                
                sectionsHTML += `
        <section class="showcase-section" style="margin: 40px 0;">
            <h2 style="text-align: center; margin-bottom: 15px;">${section.showcaseTitle || 'My Work'}</h2>
            <p style="text-align: center; color: #666; margin-bottom: 30px; font-style: italic;">${section.showcaseType || 'projects'}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${layout === 'list' ? '100%' : '300px'}, 1fr)); gap: 30px;">
                ${showcaseItemsHTML}
            </div>
        </section>`;
                break;
                
            case 'hero':
                const heroStyle = section.heroImage 
                    ? `background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${section.heroImage}'); background-size: cover; background-position: center;`
                    : `background: linear-gradient(135deg, ${selections.accentColor}, ${selections.secondaryAccent});`;
                
                sectionsHTML += `
        <section class="hero-section" style="${heroStyle} color: white; padding: ${parseInt(sectionSpacing) * 2}px 20px; text-align: center; border-radius: ${selections.borderRadius}; margin: ${sectionSpacing} 0;">
            <h2 style="font-size: 3em; margin-bottom: 20px;">${section.heroTitle || 'Welcome'}</h2>
            <p style="font-size: 1.5em; margin-bottom: 15px; font-weight: 600;">${section.heroSubtitle || ''}</p>
            <p style="font-size: 1.2em; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">${section.heroDescription || ''}</p>
            <a href="${section.heroCTALink || '#'}" style="${getButtonStyle(selections.bgColor)} padding: ${btnSize.padding}; font-size: ${btnSize.fontSize}; border-radius: ${selections.borderRadius}; text-decoration: none; display: inline-block; transition: ${transition}; box-shadow: ${boxShadow};">${section.heroCTA || 'Get Started'}</a>
        </section>`;
                break;
                
            case 'pricing':
                let pricingHTML = '';
                if (section.plans && section.plans.length > 0) {
                    section.plans.forEach(plan => {
                        const featuresArray = plan.features.split(',').map(f => f.trim());
                        const featuresHTML = featuresArray.map(f => `<li style="padding: 8px 0;">${f}</li>`).join('');
                        const highlight = plan.highlight === 'yes' ? `border: 3px solid ${selections.accentColor}; transform: scale(1.05);` : `border: 2px solid #ddd;`;
                        
                        pricingHTML += `
                <div style="background: white; padding: 30px; border-radius: ${selections.borderRadius}; ${highlight} box-shadow: ${boxShadow}; transition: ${transition};">
                    <h3 style="color: ${selections.accentColor}; font-size: 1.8em; margin-bottom: 15px;">${plan.name}</h3>
                    <p style="font-size: 2.5em; font-weight: bold; color: ${selections.textColor}; margin-bottom: 20px;">${plan.price}</p>
                    <ul style="list-style: none; padding: 0; margin-bottom: 25px; text-align: left;">
                        ${featuresHTML}
                    </ul>
                    <button style="${getButtonStyle(selections.accentColor)} padding: ${btnSize.padding}; font-size: ${btnSize.fontSize}; border-radius: ${selections.borderRadius}; cursor: pointer; width: 100%; transition: ${transition};">Choose Plan</button>
                </div>`;
                    });
                }
                
                sectionsHTML += `
        <section class="pricing-section" style="margin: ${sectionSpacing} 0;">
            <h2 style="text-align: center; margin-bottom: 40px; color: ${selections.accentColor}; font-size: 2.5em;">${section.pricingTitle || 'Pricing'}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
                ${pricingHTML}
            </div>
        </section>`;
                break;
                
            case 'faq':
                let faqHTML = '';
                if (section.faqs && section.faqs.length > 0) {
                    section.faqs.forEach((faq, idx) => {
                        faqHTML += `
                <details style="background: white; padding: 20px; margin-bottom: 15px; border-radius: ${selections.borderRadius}; border: 2px solid ${selections.accentColor}; cursor: pointer;">
                    <summary style="font-size: 1.2em; font-weight: 600; color: ${selections.accentColor}; cursor: pointer;">${faq.question}</summary>
                    <p style="margin-top: 15px; color: ${selections.textColor}; line-height: ${selections.lineHeight};">${faq.answer}</p>
                </details>`;
                    });
                }
                
                sectionsHTML += `
        <section class="faq-section" style="margin: ${sectionSpacing} 0;">
            <h2 style="text-align: center; margin-bottom: 30px; color: ${selections.accentColor}; font-size: 2.5em;">${section.faqTitle || 'FAQ'}</h2>
            ${faqHTML}
        </section>`;
                break;
                
            case 'timeline':
                let timelineHTML = '';
                if (section.steps && section.steps.length > 0) {
                    section.steps.forEach((step, idx) => {
                        timelineHTML += `
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="flex-shrink: 0; width: 50px; height: 50px; background: ${selections.accentColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5em; font-weight: bold;">${idx + 1}</div>
                    <div style="flex: 1;">
                        <h3 style="color: ${selections.accentColor}; margin-bottom: 10px; font-size: 1.5em;">${step.title}</h3>
                        <p style="color: ${selections.textColor}; line-height: ${selections.lineHeight};">${step.description}</p>
                    </div>
                </div>`;
                    });
                }
                
                sectionsHTML += `
        <section class="timeline-section" style="margin: ${sectionSpacing} 0;">
            <h2 style="text-align: center; margin-bottom: 40px; color: ${selections.accentColor}; font-size: 2.5em;">${section.timelineTitle || 'Process'}</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                ${timelineHTML}
            </div>
        </section>`;
                break;
                
            case 'team':
                let teamHTML = '';
                const teamCols = section.teamLayout === 'grid4' ? '4' : section.teamLayout === 'grid3' ? '3' : '2';
                if (section.members && section.members.length > 0) {
                    section.members.forEach(member => {
                        teamHTML += `
                <div style="background: white; padding: 25px; border-radius: ${selections.borderRadius}; box-shadow: ${boxShadow}; text-align: center; transition: ${transition};">
                    <img src="${member.image}" alt="${member.name}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid ${selections.accentColor};">
                    <h3 style="color: ${selections.accentColor}; margin-bottom: 5px; font-size: 1.4em;">${member.name}</h3>
                    <p style="color: ${selections.secondaryAccent}; font-weight: 600; margin-bottom: 10px;">${member.role}</p>
                    <p style="color: ${selections.textColor}; line-height: ${selections.lineHeight};">${member.bio}</p>
                </div>`;
                    });
                }
                
                sectionsHTML += `
        <section class="team-section" style="margin: ${sectionSpacing} 0;">
            <h2 style="text-align: center; margin-bottom: 40px; color: ${selections.accentColor}; font-size: 2.5em;">${section.teamTitle || 'Our Team'}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                ${teamHTML}
            </div>
        </section>`;
                break;
                
            case 'stats':
                let statsHTML = '';
                if (section.stats && section.stats.length > 0) {
                    section.stats.forEach(stat => {
                        statsHTML += `
                <div style="text-align: center; padding: 30px; background: white; border-radius: ${selections.borderRadius}; box-shadow: ${boxShadow};">
                    <p style="font-size: 3em; font-weight: bold; color: ${selections.accentColor}; margin-bottom: 10px;">${stat.number}</p>
                    <p style="font-size: 1.2em; color: ${selections.textColor};">${stat.label}</p>
                </div>`;
                    });
                }
                
                sectionsHTML += `
        <section class="stats-section" style="margin: ${sectionSpacing} 0;">
            <h2 style="text-align: center; margin-bottom: 40px; color: ${selections.accentColor}; font-size: 2.5em;">${section.statsTitle || 'Statistics'}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
                ${statsHTML}
            </div>
        </section>`;
                break;
        }
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selections.siteTitle}${pageId !== 'main' ? ' - ' + (pageData?.name || '') : ''}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${selections.fontFamily};
            background-color: ${selections.bgColor};
            color: ${selections.textColor};
            line-height: ${selections.lineHeight};
            font-size: ${baseFontSize};
        }
        
        .container {
            max-width: ${maxWidth};
            margin: 0 auto;
            padding: ${sectionSpacing} 20px;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: ${selections.headingFont};
            color: ${selections.accentColor};
        }
        
        h1 {
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        
        h2 {
            margin-bottom: 15px;
            font-size: 1.8em;
        }
        
        p {
            margin-bottom: 15px;
            text-align: ${selections.contentAlign};
        }
        
        .accent {
            color: ${selections.accentColor};
            font-weight: bold;
        }
        
        a:hover {
            opacity: 0.8;
        }
        
        button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
        
        details summary:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    ${headerHTML}
    <div class="container">
        <h1>${pageData?.heading || selections.heading}</h1>
        <p>${pageData?.content || selections.content}</p>
        ${sectionsHTML}
        <p class="accent" style="margin-top: ${sectionSpacing}; text-align: center;">Built with WebsiteMaker</p>
    </div>
    ${footerHTML}
</body>
</html>`;
}

// Preview functionality
let previewPages = {};

previewBtn.addEventListener('click', () => {
    const selections = getUserSelections();
    previewPages = {};
    
    // Generate HTML for all pages
    Object.keys(selections.pages).forEach(pageId => {
        const html = generateHTML(selections, pageId, selections.pages);
        previewPages[pageId] = html;
    });
    
    // Show preview container
    previewContainer.style.display = 'block';
    
    // Setup page switcher if multiple pages
    const pageKeys = Object.keys(selections.pages);
    const previewPageSwitcher = document.getElementById('previewPageSwitcher');
    const previewPageSelect = document.getElementById('previewPageSelect');
    
    if (pageKeys.length > 1) {
        previewPageSwitcher.style.display = 'block';
        
        // Populate page selector
        previewPageSelect.innerHTML = '';
        pageKeys.forEach(pageId => {
            const option = document.createElement('option');
            option.value = pageId;
            option.textContent = pageId === 'main' ? 'Home' : selections.pages[pageId].name;
            previewPageSelect.appendChild(option);
        });
        
        // Add change listener
        previewPageSelect.onchange = () => {
            loadPreviewPage(previewPageSelect.value);
        };
    } else {
        previewPageSwitcher.style.display = 'none';
    }
    
    // Load initial page (main/home)
    loadPreviewPage('main');
    
    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth' });
});

// Load a specific page in preview
function loadPreviewPage(pageId) {
    const html = previewPages[pageId];
    if (!html) return;
    
    // Intercept navigation clicks in the preview
    const modifiedHtml = html.replace(/<a href="([^"]+)"/g, (match, href) => {
        // Check if it's an internal page link
        if (href.endsWith('.html')) {
            // Find the page ID for this filename
            const selections = getUserSelections();
            let targetPageId = 'main';
            
            if (href !== 'index.html') {
                Object.keys(selections.pages).forEach(pid => {
                    if (selections.pages[pid].filename === href) {
                        targetPageId = pid;
                    }
                });
            }
            
            return `<a href="#" onclick="parent.switchPreviewPage('${targetPageId}'); return false;"`;
        }
        return match;
    });
    
    // Load HTML into iframe
    const blob = new Blob([modifiedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    
    // Update selector
    const previewPageSelect = document.getElementById('previewPageSelect');
    if (previewPageSelect) {
        previewPageSelect.value = pageId;
    }
}

// Function to switch preview page (called from iframe)
window.switchPreviewPage = function(pageId) {
    loadPreviewPage(pageId);
};

// Download functionality - creates ZIP with multiple pages
downloadBtn.addEventListener('click', async () => {
    const selections = getUserSelections();
    
    // Check if there are multiple pages
    const pageKeys = Object.keys(selections.pages);
    
    if (pageKeys.length === 1) {
        // Single page - download as before
        const html = generateHTML(selections, 'main', selections.pages);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Your website has been downloaded!');
    } else {
        // Multiple pages - create ZIP
        try {
            // We'll use JSZip library - need to load it dynamically
            if (typeof JSZip === 'undefined') {
                // Load JSZip from CDN
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
            }
            
            const zip = new JSZip();
            
            // Generate HTML for each page
            pageKeys.forEach(pageId => {
                const filename = pageId === 'main' ? 'index.html' : selections.pages[pageId].filename;
                const html = generateHTML(selections, pageId, selections.pages);
                zip.file(filename, html);
            });
            
            // Generate ZIP file
            const content = await zip.generateAsync({ type: 'blob' });
            
            // Download ZIP
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'website.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Your multi-page website has been downloaded as a ZIP file!');
        } catch (error) {
            console.error('Error creating ZIP:', error);
            showNotification('Error creating ZIP file. Please try again.', true);
        }
    }
});

// Helper function to load external scripts
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Helper function to show notifications
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${isError ? '#dc3545' : '#28a745'}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
