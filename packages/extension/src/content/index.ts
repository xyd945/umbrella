import { WebsiteContent } from '../utils/types';

// Extract content from the current webpage
const extractWebsiteContent = (): WebsiteContent => {
  // Get the page URL
  const url = window.location.href;
  
  // Get the page title
  const title = document.title;
  
  // Get the main text content
  // We're trying to get only the meaningful content
  const bodyText = document.body.innerText || '';
  
  // Extract visible text that's likely to be content
  const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, article, section, main, div.content');
  let contentText = '';
  contentElements.forEach(element => {
    const text = element.textContent?.trim();
    if (text && text.length > 20) { // Avoid small elements
      contentText += text + '\n';
    }
  });
  
  // If we couldn't extract specific content, fall back to body text
  const text = contentText || bodyText;
  
  // Extract all links from the page
  const linkElements = document.querySelectorAll('a[href]');
  const links: string[] = [];
  linkElements.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push(href);
    }
  });
  
  // Extract metadata
  const metadata: Record<string, string> = {};
  const metaTags = document.querySelectorAll('meta');
  metaTags.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      metadata[name] = content;
    }
  });
  
  return {
    url,
    title,
    text,
    links,
    metadata
  };
};

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractContent') {
    const content = extractWebsiteContent();
    sendResponse(content);
  }
  return true; // Required for async response
}); 