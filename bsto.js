// bs.to Nuvio Plugin
// Fetches German dubbed streams from bs.to

function getStreams(tmdbId, mediaType, season, episode) {
  return new Promise((resolve, reject) => {
    console.log(`[bs.to] Fetching ${mediaType} - TMDB: ${tmdbId}, S${season}E${episode}`);
    
    // Step 1: Get title from TMDB
    const tmdbApiKey = '0f29e6d5b5091b01604780e7ea095ab6'; // Public TMDB key
    const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${tmdbApiKey}&language=de-DE`;
    
    fetch(tmdbUrl)
      .then(response => response.json())
      .then(data => {
        const title = data.name || data.title; // TV shows use 'name', movies use 'title'
        const originalTitle = data.original_name || data.original_title;
        
        console.log(`[bs.to] Title: ${title}, Original: ${originalTitle}`);
        
        // Step 2: Convert title to bs.to URL format
        // bs.to uses format like: /serie/Breaking-Bad/1/1-Der-Einstieg/de
        const urlTitle = (originalTitle || title)
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
          .replace(/\s+/g, '-'); // Replace spaces with hyphens
        
        if (mediaType === 'tv') {
          // For TV shows
          const bstoUrl = `https://bs.to/serie/${urlTitle}/${season}/${episode}/de`;
          console.log(`[bs.to] Trying URL: ${bstoUrl}`);
          
          // Step 3: Fetch the episode page
          fetch(bstoUrl)
            .then(response => response.text())
            .then(html => {
              // Step 4: Extract video host links from HTML
              const streams = extractStreamsFromHTML(html, title, season, episode);
              
              if (streams.length > 0) {
                console.log(`[bs.to] Found ${streams.length} streams`);
                resolve(streams);
              } else {
                console.log('[bs.to] No streams found');
                resolve([]);
              }
            })
            .catch(error => {
              console.error('[bs.to] Error fetching page:', error);
              resolve([]);
            });
        } else {
          // Movies not fully supported yet - would need different URL structure
          console.log('[bs.to] Movies not yet supported');
          resolve([]);
        }
      })
      .catch(error => {
        console.error('[bs.to] Error fetching TMDB data:', error);
        resolve([]);
      });
  });
}

function extractStreamsFromHTML(html, title, season, episode) {
  const streams = [];
  
  try {
    // Look for video host links in the HTML
    // bs.to embeds links like: <a href="#" data-lang-key="1" data-link-target="/..." class="hoster-player">
    
    // Common patterns to look for:
    const hostPatterns = [
      { name: 'VOE', pattern: /voe\.sx\/[a-zA-Z0-9]+/gi },
      { name: 'Streamtape', pattern: /streamtape\.com\/[a-zA-Z0-9]+/gi },
      { name: 'Doodstream', pattern: /dood(?:stream)?\.(?:com|watch|to|la|ws)\/[a-zA-Z0-9]+/gi },
      { name: 'Vidoza', pattern: /vidoza\.net\/[a-zA-Z0-9]+/gi },
      { name: 'Filemoon', pattern: /filemoon\.[a-z]+\/[a-zA-Z0-9]+/gi }
    ];
    
    // Try to extract direct links from the HTML
    hostPatterns.forEach(({ name, pattern }) => {
      const matches = html.match(pattern);
      if (matches) {
        matches.forEach((match, index) => {
          const fullUrl = match.startsWith('http') ? match : `https://${match}`;
          streams.push({
            name: `bs.to (${name})`,
            title: `${name} - S${season}E${episode}`,
            url: fullUrl,
            quality: 'German Dubbed'
          });
        });
      }
    });
    
    // If no direct links found, try to find data attributes
    if (streams.length === 0) {
      // Look for data-link-target attributes
      const linkTargetRegex = /data-link-target="([^"]+)"/g;
      let match;
      while ((match = linkTargetRegex.exec(html)) !== null) {
        const redirectPath = match[1];
        if (redirectPath) {
          // These are bs.to redirect URLs that lead to the actual video
          streams.push({
            name: 'bs.to',
            title: `Stream - S${season}E${episode}`,
            url: `https://bs.to${redirectPath}`,
            quality: 'German Dubbed'
          });
        }
      }
    }
    
  } catch (error) {
    console.error('[bs.to] Error extracting streams:', error);
  }
  
  return streams;
}

// Export for Nuvio
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getStreams };
}
