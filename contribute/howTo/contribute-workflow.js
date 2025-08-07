// COLIB Contribution Workflow JavaScript
// Enhanced interactive workflow for contributing to COLIB

// Global state
let selectedWorkflow = null;
let completedSections = new Set();
let uploadedFile = null;

// Workflow selection
function selectContributionType(type) {
  selectedWorkflow = type;

  // Update visual feedback
  document.querySelectorAll('.option-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.getElementById(`option-${type}`).classList.add('selected');

  // Show workflow container
  const workflowContainer = document.getElementById('workflow-container');
  workflowContainer.style.display = 'block';

  // Load appropriate workflow
  if (type === 'add-content') {
    loadAddContentWorkflow();
  } else {
    loadModifyContentWorkflow();
  }

  // Smooth scroll to workflow
  setTimeout(() => {
    workflowContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function loadAddContentWorkflow() {
  const container = document.getElementById('workflow-container');
  const workflow = document.getElementById('add-content-workflow');
  container.innerHTML = workflow.innerHTML;

  // Show first step
  showStep('step-qmd');
}

function loadModifyContentWorkflow() {
  const container = document.getElementById('workflow-container');
  const workflow = document.getElementById('modify-content-workflow');
  container.innerHTML = workflow.innerHTML;
}

// Step navigation
function showStep(stepId) {
  // Hide all steps
  document.querySelectorAll('.workflow-step').forEach(step => {
    step.style.display = 'none';
  });

  // Show selected step
  const targetStep = document.getElementById(stepId);
  if (targetStep) {
    targetStep.style.display = 'block';
    targetStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Section expansion for template filling
function expandSection(sectionId) {
  const section = document.getElementById(sectionId);
  const isVisible = section.style.display !== 'none';

  // Toggle section visibility
  section.style.display = isVisible ? 'none' : 'block';

  // Update card appearance
  const card = section.previousElementSibling;
  if (card) {
    card.classList.toggle('expanded', !isVisible);
  }

  if (!isVisible) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Section validation
function validateSection(sectionType) {
  const editorId = `${sectionType}-editor`;
  const validationId = `${sectionType}-validation`;
  const editor = document.getElementById(editorId);
  const validation = document.getElementById(validationId);

  if (!editor || !validation) return;

  const content = editor.value.trim();
  let isValid = false;
  let message = '';

  switch (sectionType) {
    case 'context':
      isValid = content.length >= 100 && content.includes('power system');
      message = isValid
        ? '✅ Context section looks good! Clear background and motivation provided.'
        : '❌ Context needs more detail. Include background, motivation, and power system relevance (minimum 100 characters).';
      break;

    case 'model':
      isValid = content.length >= 150 && (content.includes('$$') || content.includes('equation'));
      message = isValid
        ? '✅ Model description is comprehensive! Good technical detail provided.'
        : '❌ Model description needs more detail. Include equations, variables, and implementation details (minimum 150 characters).';
      break;

    case 'references':
      isValid = content.length >= 50 && (content.includes('@') || content.includes('http') || content.includes('doi'));
      message = isValid
        ? '✅ References look properly formatted! Good citation practices.'
        : '❌ Add proper references with citations (@ref format), URLs, or DOIs (minimum 50 characters).';
      break;
  }

  // Update validation display
  validation.innerHTML = `<div class="validation-message ${isValid ? 'success' : 'error'}">${message}</div>`;
  validation.style.display = 'block';

  // Update completion status
  if (isValid) {
    completedSections.add(sectionType);
  } else {
    completedSections.delete(sectionType);
  }

  updateCompletionStatus();

  return isValid;
}

// Update template completion status
function updateCompletionStatus() {
  const totalSections = 3; // context, model, references
  const completedCount = completedSections.size;
  const percentage = (completedCount / totalSections) * 100;

  // Update progress bar
  const progressFill = document.getElementById('progress-fill');
  const completionText = document.getElementById('completion-text');
  const continueButton = document.getElementById('continue-validation');

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  if (completionText) {
    if (completedCount === totalSections) {
      completionText.textContent = '🎉 All sections completed! Ready for validation.';
      completionText.className = 'completion-success';
      if (continueButton) {
        continueButton.style.display = 'inline-block';
      }
    } else {
      completionText.textContent = `${completedCount}/${totalSections} sections completed. Continue filling out the remaining sections.`;
      completionText.className = 'completion-pending';
      if (continueButton) {
        continueButton.style.display = 'none';
      }
    }
  }
}

// File upload handling
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploadedFile = file;

  // Update file info display
  const fileInfo = document.getElementById('file-info');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');
  const validateButton = document.getElementById('validate-full');

  if (fileInfo && fileName && fileSize) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';
  }

  // Enable validation button
  if (validateButton) {
    validateButton.disabled = false;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Template validation
function validateFullTemplate() {
  if (!uploadedFile) {
    alert('Please upload a QMD file first.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    performTemplateValidation(content);
  };
  reader.readAsText(uploadedFile);
}

function performTemplateValidation(content) {
  const results = document.getElementById('validation-results');
  const checklist = document.getElementById('validation-checklist');
  const continueButton = document.getElementById('continue-submit');

  if (!results || !checklist) return;

  // Validation checks
  const checks = [
    {
      name: 'YAML Header',
      test: content.includes('---') && content.includes('title:'),
      message: 'Valid YAML front matter with title'
    },
    {
      name: 'Content Structure',
      test: content.includes('##') && content.length > 500,
      message: 'Proper section structure with adequate content'
    },
    {
      name: 'Mathematical Content',
      test: content.includes('$$') || content.includes('\\(') || content.includes('equation'),
      message: 'Mathematical equations or technical formulas included'
    },
    {
      name: 'References',
      test: content.includes('@') || content.includes('http') || content.includes('doi'),
      message: 'Proper citations and references included'
    },
    {
      name: 'File Format',
      test: uploadedFile.name.endsWith('.qmd') || uploadedFile.name.endsWith('.md'),
      message: 'Correct QMD/Markdown file format'
    },
    {
      name: 'File Size',
      test: uploadedFile.size > 1000 && uploadedFile.size < 5000000, // 1KB to 5MB
      message: 'Appropriate file size (not empty, not too large)'
    }
  ];

  // Generate validation results
  let passedChecks = 0;
  let checklistHTML = '';

  checks.forEach(check => {
    const passed = check.test;
    if (passed) passedChecks++;

    checklistHTML += `
      <div class="validation-item ${passed ? 'pass' : 'fail'}">
        <i class="fas ${passed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
        <span class="check-name">${check.name}</span>
        <span class="check-message">${check.message}</span>
      </div>
    `;
  });

  checklist.innerHTML = checklistHTML;
  results.style.display = 'block';

  // Show continue button if validation passes
  const validationScore = passedChecks / checks.length;
  if (validationScore >= 0.8 && continueButton) { // 80% pass rate
    continueButton.style.display = 'inline-block';

    // Add success message
    checklist.innerHTML += `
      <div class="validation-summary success">
        <h5><i class="fas fa-trophy"></i> Validation Successful!</h5>
        <p>Your template passes ${passedChecks}/${checks.length} validation checks. You're ready to submit!</p>
      </div>
    `;
  } else {
    // Add failure message with tips
    checklist.innerHTML += `
      <div class="validation-summary error">
        <h5><i class="fas fa-exclamation-triangle"></i> Validation Issues Found</h5>
        <p>Your template passes ${passedChecks}/${checks.length} checks. Please address the failed checks before submitting.</p>
        <p><strong>Tip:</strong> Make sure your QMD file includes proper YAML headers, section headings, mathematical content, and references.</p>
      </div>
    `;
  }

  // Scroll to results
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Submission handling
function showSubmissionSuccess() {
  setTimeout(() => {
    const successDiv = document.getElementById('submission-success');
    if (successDiv) {
      successDiv.style.display = 'block';
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 1000); // Delay to allow GitHub to open
}

// Bug report and improvement workflow
function openGitHubIssue(issueType) {
  const githubMessage = document.getElementById('github-message');
  if (githubMessage) {
    githubMessage.style.display = 'block';
  }

  let url = 'https://github.com/CRESYM/Colib_Quarto.github.io/issues/new';

  switch (issueType) {
    case 'bug':
      url += '?assignees=GJCRESYM%2C+matoubongrain&labels=bug&template=bug_report.md&title=%5BBUG%5D%3A+';
      break;
    case 'enhancement':
      url += '?assignees=GJCRESYM%2C+matoubongrain&labels=enhancement&template=feature_request.md&title=%5BENHANCEMENT%5D%3A+';
      break;
    case 'documentation':
      url += '?assignees=GJCRESYM%2C+matoubongrain&labels=documentation&template=documentation.md&title=%5BDOCS%5D%3A+';
      break;
  }

  // Open GitHub in new tab
  setTimeout(() => {
    window.open(url, '_blank');
  }, 1500);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
  console.log('COLIB Contribution Workflow initialized');

  // Add smooth scrolling behavior
  document.documentElement.style.scrollBehavior = 'smooth';

  // Add CSS classes for enhanced styling
  addDynamicStyles();
});

function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced workflow styles */
    .contribution-selector {
      display: flex;
      gap: 2rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }
    
    .option-card {
      flex: 1;
      min-width: 300px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }
    
    .option-card:hover {
      border-color: #007bff;
      box-shadow: 0 8px 25px rgba(0,123,255,0.15);
      transform: translateY(-2px);
    }
    
    .option-card.selected {
      border-color: #007bff;
      background: linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%);
      box-shadow: 0 8px 25px rgba(0,123,255,0.2);
    }
    
    .option-icon {
      font-size: 3rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .option-card h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .option-card p {
      color: #6c757d;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .option-card ul {
      color: #495057;
      list-style-position: inside;
    }
    
    .workflow-step {
      background: #ffffff;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 2rem;
      margin: 2rem 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .step-counter {
      background: #007bff;
      color: white;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      font-weight: bold;
    }
    
    .next-step-button {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
      transition: all 0.3s ease;
    }
    
    .next-step-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,123,255,0.3);
    }
    
    .template-sections {
      margin: 2rem 0;
    }
    
    .section-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      padding: 1rem;
      margin: 1rem 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .section-card:hover {
      background: #e9ecef;
      border-color: #007bff;
    }
    
    .section-card.expanded {
      border-color: #007bff;
      background: #e3f2fd;
    }
    
    .section-card h4 {
      margin: 0;
      color: #495057;
    }
    
    .section-card p {
      margin: 0.5rem 0 0 0;
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .section-content {
      background: white;
      border: 1px solid #dee2e6;
      border-top: none;
      padding: 1.5rem;
      border-radius: 0 0 6px 6px;
    }
    
    .section-editor {
      width: 100%;
      min-height: 120px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      padding: 0.75rem;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      resize: vertical;
    }
    
    .validate-section {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
    
    .validation-result {
      margin-top: 1rem;
    }
    
    .validation-message {
      padding: 0.75rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
    
    .validation-message.success {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }
    
    .validation-message.error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    
    .progress-bar {
      background: #e9ecef;
      border-radius: 4px;
      height: 1rem;
      overflow: hidden;
      margin: 1rem 0;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
      height: 100%;
      transition: width 0.5s ease;
      width: 0%;
    }
    
    .completion-success {
      color: #155724;
      font-weight: bold;
    }
    
    .completion-pending {
      color: #856404;
    }
    
    .validation-panel {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 2rem;
      margin: 1rem 0;
    }
    
    .file-upload-label {
      display: inline-block;
      background: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .file-upload-label:hover {
      background: #0056b3;
    }
    
    input[type="file"] {
      display: none;
    }
    
    .file-info {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    }
    
    .validate-button {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      margin: 1rem 0;
      transition: all 0.3s ease;
    }
    
    .validate-button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .validate-button:not(:disabled):hover {
      background: #218838;
      transform: translateY(-1px);
    }
    
    .validation-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      border: 1px solid;
    }
    
    .validation-item.pass {
      background: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }
    
    .validation-item.fail {
      background: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }
    
    .validation-item i {
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }
    
    .check-name {
      font-weight: bold;
      margin-right: 1rem;
      min-width: 120px;
    }
    
    .validation-summary {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border-radius: 6px;
      border: 2px solid;
    }
    
    .validation-summary.success {
      background: #d4edda;
      border-color: #28a745;
      color: #155724;
    }
    
    .validation-summary.error {
      background: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }
    
    .submit-button {
      display: inline-block;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: bold;
      margin: 1rem 0;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }
    
    .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40,167,69,0.3);
      color: white;
      text-decoration: none;
    }
    
    .submission-success {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border: 2px solid #28a745;
      border-radius: 8px;
      padding: 2rem;
      margin: 2rem 0;
      text-align: center;
    }
    
    .success-message h3 {
      color: #155724;
      margin-bottom: 1rem;
    }
    
    .improvement-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .improvement-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .improvement-card:hover {
      border-color: #007bff;
      box-shadow: 0 6px 20px rgba(0,123,255,0.15);
      transform: translateY(-2px);
    }
    
    .improvement-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .improvement-card h4 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .improvement-card p {
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .github-redirect-message {
      background: #e3f2fd;
      border: 1px solid #2196f3;
      border-radius: 6px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .contribution-selector {
        flex-direction: column;
      }
      
      .option-card {
        min-width: unset;
      }
    }
  `;
  document.head.appendChild(style);
}

// Make functions globally available
window.selectContributionType = selectContributionType;
window.showStep = showStep;
window.expandSection = expandSection;
window.validateSection = validateSection;
window.handleFileUpload = handleFileUpload;
window.validateFullTemplate = validateFullTemplate;
window.showSubmissionSuccess = showSubmissionSuccess;
window.openGitHubIssue = openGitHubIssue;
