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
                    <label for="${sectionId}-imageUrl">Image URL:</label>
                    <input type="text" id="${sectionId}-imageUrl" value="https://via.placeholder.com/600x400">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-caption">Caption:</label>
                    <input type="text" id="${sectionId}-caption" value="Image caption">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-imageSize">Image Size:</label>
                    <select id="${sectionId}-imageSize">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            `;
            break;
            
        case 'features':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-featuresTitle">Features Title:</label>
                    <input type="text" id="${sectionId}-featuresTitle" value="Our Features">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-feature1">Feature 1:</label>
                    <input type="text" id="${sectionId}-feature1" value="Easy to use">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-feature2">Feature 2:</label>
                    <input type="text" id="${sectionId}-feature2" value="Fast and reliable">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-feature3">Feature 3:</label>
                    <input type="text" id="${sectionId}-feature3" value="Beautiful design">
                </div>
                <div class="form-group">
                    <label for="${sectionId}-layout">Layout:</label>
                    <select id="${sectionId}-layout">
                        <option value="vertical">Vertical List</option>
                        <option value="horizontal">Horizontal Grid</option>
                    </select>
                </div>
            `;
            break;
            
        case 'contact':
            optionsHTML = `
                <div class="form-group">
                    <label for="${sectionId}-contactTitle">Form Title:</label>
                    <input type="text" id="${sectionId}-contactTitle" value="Contact Us">
                </div>
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
    }
    
    optionsDiv.innerHTML = optionsHTML;
}

// Get user selections
function getUserSelections() {
    const sections = [];
    const sectionElements = document.querySelectorAll('.section-item');
    
    sectionElements.forEach(sectionEl => {
        const sectionId = sectionEl.id;
        const type = document.getElementById(`${sectionId}-type`).value;
        
        const sectionData = { type };
        
        // Get all inputs within this section
        const inputs = sectionEl.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.id && input.id.includes('-')) {
                const key = input.id.split('-').slice(2).join('-');
                sectionData[key] = input.value;
            }
        });
        
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
                sectionsHTML += `
        <section class="image-section" style="margin: 40px 0; text-align: center;">
            <img src="${section.imageUrl || 'https://via.placeholder.com/600x400'}" alt="${section.caption || 'Image'}" style="max-width: ${imageWidth}; height: auto; border-radius: 8px;">
            <p style="margin-top: 10px; font-style: italic;">${section.caption || 'Image caption'}</p>
        </section>`;
                break;
                
            case 'features':
                const isHorizontal = section.layout === 'horizontal';
                sectionsHTML += `
        <section class="features-section" style="margin: 40px 0;">
            <h2 style="text-align: center; margin-bottom: 30px;">${section.featuresTitle || 'Our Features'}</h2>
            <div style="display: ${isHorizontal ? 'grid' : 'block'}; ${isHorizontal ? 'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;' : ''}">
                <div style="padding: 20px; ${!isHorizontal ? 'margin-bottom: 15px;' : ''} background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <p style="font-size: 1.2em;">✓ ${section.feature1 || 'Feature 1'}</p>
                </div>
                <div style="padding: 20px; ${!isHorizontal ? 'margin-bottom: 15px;' : ''} background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <p style="font-size: 1.2em;">✓ ${section.feature2 || 'Feature 2'}</p>
                </div>
                <div style="padding: 20px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <p style="font-size: 1.2em;">✓ ${section.feature3 || 'Feature 3'}</p>
                </div>
            </div>
        </section>`;
                break;
                
            case 'contact':
                sectionsHTML += `
        <section class="contact-section" style="margin: 40px 0;">
            <h2 style="text-align: center; margin-bottom: 20px;">${section.contactTitle || 'Contact Us'}</h2>
            <form style="max-width: 500px; margin: 0 auto;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Name:</label>
                    <input type="text" style="width: 100%; padding: 10px; border: 2px solid ${selections.accentColor}; border-radius: 5px; font-family: ${selections.fontFamily};">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Email:</label>
                    <input type="email" style="width: 100%; padding: 10px; border: 2px solid ${selections.accentColor}; border-radius: 5px; font-family: ${selections.fontFamily};">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Message:</label>
                    <textarea rows="4" style="width: 100%; padding: 10px; border: 2px solid ${selections.accentColor}; border-radius: 5px; font-family: ${selections.fontFamily};"></textarea>
                </div>
                <button type="submit" style="background: ${section.buttonColor || selections.accentColor}; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer; font-weight: 600;">${section.buttonText || 'Send Message'}</button>
            </form>
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
            max-width: 800px;
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
