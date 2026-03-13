// Get form elements
const form = document.getElementById('designForm');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');
const previewContainer = document.getElementById('preview');
const previewFrame = document.getElementById('previewFrame');
const addSectionBtn = document.getElementById('addSectionBtn');
const sectionsWrapper = document.getElementById('sectionsWrapper');

let sectionCount = 0;

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
            <button type="button" class="btn-remove" onclick="removeSection('${sectionId}')">Remove</button>
        </div>
        
        <div class="form-group">
            <label for="${sectionId}-type">Section Type:</label>
            <select id="${sectionId}-type" class="section-type" data-section="${sectionId}">
                <option value="text">Text Block</option>
                <option value="image">Image with Caption</option>
                <option value="features">Features List</option>
                <option value="contact">Contact Form</option>
                <option value="showcase">Showcase Work</option>
            </select>
        </div>
        
        <div id="${sectionId}-options" class="section-options"></div>
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
            <button type="button" class="btn-remove-small" onclick="removeShowcaseItem('${itemId}')">×</button>
        </div>
        <div class="form-group">
            <label for="${itemId}-title">Title:</label>
            <input type="text" id="${itemId}-title" value="Project ${itemCount}">
        </div>
        <div class="form-group">
            <label for="${itemId}-description">Description:</label>
            <textarea id="${itemId}-description" rows="2">Description of this item</textarea>
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
            <input type="url" id="${itemId}-link" placeholder="https://example.com">
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
                    <input type="text" id="${sectionId}-heading" value="Section Heading">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-content">Content:</label>
                    <textarea id="${sectionId}-content" rows="3">Your section content here.</textarea>
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
                    <input type="number" id="${sectionId}-imageCount" value="1" min="1" max="10" onchange="updateImageInputs('${sectionId}')">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-imageSize">Image Size:</label>
                    <select id="${sectionId}-imageSize">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
                <div id="${sectionId}-imageInputs" class="dynamic-inputs"></div>
            `;
            break;
            
        case 'features':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-featuresTitle">Features Title:</label>
                    <input type="text" id="${sectionId}-featuresTitle" value="Our Features">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-featureCount">How many features?</label>
                    <input type="number" id="${sectionId}-featureCount" value="3" min="1" max="10" onchange="updateFeatureInputs('${sectionId}')">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-layout">Layout:</label>
                    <select id="${sectionId}-layout">
                        <option value="vertical">Vertical List</option>
                        <option value="horizontal">Horizontal Grid</option>
                    </select>
                </div>
                <div id="${sectionId}-featureInputs" class="dynamic-inputs"></div>
            `;
            break;
            
        case 'contact':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactTitle">Form Title:</label>
                    <input type="text" id="${sectionId}-contactTitle" value="Contact Us">
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
                <div id="${sectionId}-contactInput"></div>
                <div class="form-group">
                    <label for="${sectionId}-buttonText">Button Text:</label>
                    <input type="text" id="${sectionId}-buttonText" value="Send Message">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-buttonColor">Button Color:</label>
                    <input type="color" id="${sectionId}-buttonColor" value="#d91b5c">
                </div>
            `;
            break;
            
        case 'showcase':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-showcaseTitle">Showcase Title:</label>
                    <input type="text" id="${sectionId}-showcaseTitle" value="My Work">
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
                    <label>Items to Showcase:</label>
                    <button type="button" class="btn-add-small" onclick="addShowcaseItem('${sectionId}')">+ Add Item</button>
                    <div id="${sectionId}-items" class="showcase-items-container"></div>
                </div>
            `;
            break;
    }
    
    optionsDiv.innerHTML = optionsHTML;
    
    // If showcase type, add initial item
    if (type === 'showcase') {
        addShowcaseItem(sectionId);
    }
    
    // If image type, initialize image inputs
    if (type === 'image') {
        updateImageInputs(sectionId);
    }
    
    // If features type, initialize feature inputs
    if (type === 'features') {
        updateFeatureInputs(sectionId);
    }
    
    // If contact type, initialize contact input
    if (type === 'contact') {
        updateContactInput(sectionId);
    }
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
    const sections = [];
    const sectionElements = document.querySelectorAll('.section-item');
    
    sectionElements.forEach(sectionEl => {
        const sectionId = sectionEl.id;
        const type = document.getElementById(`${sectionId}-type`).value;
        
        const sectionData = { type };
        
        // Get all inputs within this section (excluding showcase items and dynamic inputs)
        const inputs = sectionEl.querySelectorAll('input:not([id*="-item-"]):not([id*="-imageUrl-"]):not([id*="-caption-"]):not([id*="-feature-"]), textarea:not([id*="-item-"]), select:not([id*="-item-"])');
        inputs.forEach(input => {
            if (input.id && input.id.includes('-') && !input.id.includes('-items') && !input.id.includes('-inputs')) {
                const key = input.id.split('-').slice(2).join('-');
                if (key) {
                    sectionData[key] = input.value;
                }
            }
        });
        
        // If image type, get all images
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
        
        // If features type, get all features
        if (type === 'features') {
            const featureCount = parseInt(document.getElementById(`${sectionId}-featureCount`)?.value) || 3;
            const features = [];
            
            for (let i = 1; i <= featureCount; i++) {
                const feature = document.getElementById(`${sectionId}-feature-${i}`)?.value || '';
                features.push(feature);
            }
            
            sectionData.features = features;
        }
        
        // If showcase type, get all items
        if (type === 'showcase') {
            const itemsContainer = document.getElementById(`${sectionId}-items`);
            const items = [];
            
            if (itemsContainer) {
                const itemElements = itemsContainer.querySelectorAll('.showcase-item');
                itemElements.forEach(itemEl => {
                    const itemId = itemEl.id;
                    const mediaType = document.getElementById(`${itemId}-mediaType`)?.value || 'image';
                    
                    const item = {
                        title: document.getElementById(`${itemId}-title`)?.value || '',
                        description: document.getElementById(`${itemId}-description`)?.value || '',
                        link: document.getElementById(`${itemId}-link`)?.value || '',
                        mediaType: mediaType
                    };
                    
                    if (mediaType === 'image' || mediaType === 'both') {
                        item.image = document.getElementById(`${itemId}-image`)?.value || '';
                    }
                    
                    if (mediaType === 'video' || mediaType === 'both') {
                        item.video = document.getElementById(`${itemId}-video`)?.value || '';
                    }
                    
                    if (mediaType === 'both') {
                        item.mediaLayout = document.getElementById(`${itemId}-mediaLayout`)?.value || 'carousel';
                    }
                    
                    items.push(item);
                });
            }
            
            sectionData.items = items;
        }
        
        sections.push(sectionData);
    });
    
    return {
        siteTitle: document.getElementById('siteTitle').value,
        heading: document.getElementById('heading').value,
        content: document.getElementById('content').value,
        bgColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        accentColor: document.getElementById('accentColor').value,
        fontFamily: document.getElementById('fontFamily').value,
        sections: sections
    };
}

// Generate HTML content based on user selections
function generateHTML(selections) {
    let sectionsHTML = '';
    
    selections.sections.forEach((section, index) => {
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
                                mediaHTML = `<iframe src="${embedUrl}" style="width: 100%; height: 250px; border: none;" allowfullscreen></iframe>`;
                            } else {
                                mediaHTML = `<video src="${item.video}" controls style="width: 100%; height: 250px; object-fit: cover;"></video>`;
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
                                                    ? `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`
                                                    : `<video src="${item.video}" controls style="width: 100%; height: 100%; object-fit: cover;"></video>`}
                                            </div>
                                        </div>
                                        <button onclick="this.parentElement.querySelector('.carousel-container').style.transform = 'translateX(0%)'" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; padding: 10px 15px; cursor: pointer; border-radius: 50%; font-size: 18px;">‹</button>
                                        <button onclick="this.parentElement.querySelector('.carousel-container').style.transform = 'translateX(-100%)'" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.8); border: none; padding: 10px 15px; cursor: pointer; border-radius: 50%; font-size: 18px;">›</button>
                                    </div>`;
                            } else if (mediaLayout === 'side-by-side') {
                                mediaHTML = `
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; height: 250px;">
                                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                        ${embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') 
                                            ? `<iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`
                                            : `<video src="${item.video}" controls style="width: 100%; height: 100%; object-fit: cover;"></video>`}
                                    </div>`;
                            } else if (mediaLayout === 'stacked') {
                                mediaHTML = `
                                    <div style="height: auto;">
                                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 10px;">
                                        ${embedUrl.includes('youtube.com') || embedUrl.includes('vimeo.com') 
                                            ? `<iframe src="${embedUrl}" style="width: 100%; height: 200px; border: none;" allowfullscreen></iframe>`
                                            : `<video src="${item.video}" controls style="width: 100%; height: 200px; object-fit: cover;"></video>`}
                                    </div>`;
                            }
                        }
                        
                        const itemHTML = `
                <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); ${isCard ? 'border: 2px solid ' + selections.accentColor + ';' : ''}">
                    ${mediaHTML}
                    <div style="padding: 20px;">
                        <h3 style="color: ${selections.accentColor}; margin-bottom: 10px; font-size: 1.4em;">${item.title}</h3>
                        <p style="margin-bottom: 15px; color: #666;">${item.description}</p>
                        ${item.link ? `<a href="${item.link}" style="color: ${selections.accentColor}; text-decoration: none; font-weight: 600;">View More →</a>` : ''}
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
        }
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selections.siteTitle}</title>
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
            line-height: 1.6;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        h1 {
            color: ${selections.accentColor};
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        
        h2 {
            color: ${selections.accentColor};
            margin-bottom: 15px;
            font-size: 1.8em;
        }
        
        p {
            font-size: 1.1em;
            margin-bottom: 15px;
        }
        
        .accent {
            color: ${selections.accentColor};
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${selections.heading}</h1>
        <p>${selections.content}</p>
        ${sectionsHTML}
        <p class="accent" style="margin-top: 60px; text-align: center;">Built with WebsiteMaker</p>
    </div>
</body>
</html>`;
}

// Preview functionality
previewBtn.addEventListener('click', () => {
    const selections = getUserSelections();
    const html = generateHTML(selections);
    
    // Show preview container
    previewContainer.style.display = 'block';
    
    // Load HTML into iframe
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    previewFrame.src = url;
    
    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth' });
});

// Download functionality
downloadBtn.addEventListener('click', () => {
    const selections = getUserSelections();
    const html = generateHTML(selections);
    
    // Create blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert('Your website has been downloaded! Open the index.html file in your browser to view it.');
});
