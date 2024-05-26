// Regex pattern to match the hyperlink
const regexPattern = /\/([a-z]*|200milur)\/[a-z]*\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\//;

async function getNewHeadline(url) {
  const cacheKey = 'headline_' + url;
  const cachedHeadline = localStorage.getItem(cacheKey);

  if (cachedHeadline) {
    return cachedHeadline;
  }

  const requestUrl = new URL("https://veidibann.sverrirarnors.workers.dev/");
  requestUrl.searchParams.append("mblUrl", url);

  try {
    const response = await fetch(requestUrl, {
      mode: 'cors', // Ensure CORS mode is enabled
      headers: {
        'Accept': 'text/plain'
      }
    });

    if (response.ok) {
      const text = await response.text(); // Parse response as text
      localStorage.setItem(cacheKey, text); // Cache the headline
      return text;
    } else {
      console.error('Failed to fetch new headline:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error fetching new headline:', error);
    return false;
  }
}

// Function to replace headlines
async function replaceHeadlines() {

  const aTags = document.querySelectorAll('a');

  // Counter to keep track of custom headlines
  let headlineIndex = 0;

  for (const aTag of aTags) {
    // Check if the <a> tag's href matches the regex pattern
    if (regexPattern.test(aTag.href)) {
      // Check if the <a> tag contains only text
      if (aTag.childNodes.length === 1 && (aTag.childNodes[0].nodeType === Node.TEXT_NODE)) {
        // Replace the inner text if it is not "Meira."
        if (aTag.innerText.trim() !== "Meira.") {
          const newHeadline = await getNewHeadline(aTag.href);
          if (newHeadline) {
            aTag.innerText = newHeadline;
            aTag.title = newHeadline;
          }
        }
      } else {
        // Check for heading tags as direct children
        const headingTag = aTag.querySelector('h1, h2, h3, h4, h5, h6');
        if (headingTag) {
          const newHeadline = await getNewHeadline(aTag.href);
          if (newHeadline) {
            headingTag.innerText = newHeadline;
            aTag.title = newHeadline;
          }
        }
      }
    }
  }
}

// Run the function to replace headlines
console.log("Replacing headlines...")
replaceHeadlines();
