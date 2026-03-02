// bs.to Nuvio Plugin
// Fetches German dubbed streams from bs.to
// Hermes-compatible (no async/await, only .then() chains)

function getStreams(tmdbId, mediaType, season, episode) {
  console.log('[bs.to] Starting - TMDB:', tmdbId, 'Type:', mediaType, 'S:', season, 'E:', episode);
  
  // ALWAYS return at least one test stream so we know the plugin works
  var testStream = {
    name: 'bs.to TEST',
    title: 'Plugin is working! (S' + season + 'E' + episode + ')',
    url: 'https://voe.sx/e/test123'
  };
  
  // Return streams directly - no Promise wrapper needed
  // Hermes expects the function to return .then()-able
  
  // Step 1: Fetch TMDB data to get show title
  var tmdbApiKey = '0f29e6d5b5091b01604780e7ea095ab6';
  var tmdbUrl = 'https://api.themoviedb.org/3/' + mediaType + '/' + tmdbId + '?api_key=' + tmdbApiKey + '&language=de-DE';
  
  console.log('[bs.to] Fetching TMDB:', tmdbUrl);
  
  return fetch(tmdbUrl)
    .then(function(response) {
      console.log('[bs.to] TMDB response status:', response.status);
      return response.json();
    })
    .then(function(data) {
      var title = data.name || data.title;
      var originalTitle = data.original_name || data.original_title;
      
      console.log('[bs.to] Title:', title, '| Original:', originalTitle);
      
      if (mediaType !== 'tv') {
        console.log('[bs.to] Movies not yet supported');
        return [testStream]; // Return test stream for movies too
      }
      
      // Step 2: Build bs.to URL
      var urlTitle = (originalTitle || title)
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      
      var bstoUrl = 'https://bs.to/serie/' + urlTitle + '/' + season + '/' + episode + '/de';
      console.log('[bs.to] Trying URL:', bstoUrl);
      
      // Step 3: Fetch episode page
      return fetch(bstoUrl)
        .then(function(response) {
          console.log('[bs.to] Episode page status:', response.status);
          return response.text();
        })
        .then(function(html) {
          console.log('[bs.to] Got HTML, length:', html.length);
          
          // Step 4: Extract streams from HTML
          var streams = [testStream]; // Always include test stream
          
          // Look for video host links
          // bs.to uses data-link-target attributes
          var linkMatches = html.match(/data-link-target="([^"]+)"/g);
          
          if (linkMatches) {
            console.log('[bs.to] Found', linkMatches.length, 'data-link-target entries');
            
            for (var i = 0; i < linkMatches.length && i < 5; i++) {
              var match = linkMatches[i];
              var urlMatch = match.match(/data-link-target="([^"]+)"/);
              
              if (urlMatch && urlMatch[1]) {
                var redirectUrl = urlMatch[1];
                streams.push({
                  name: 'bs.to',
                  title: 'Stream ' + (i + 1) + ' (German)',
                  url: 'https://bs.to' + redirectUrl
                });
              }
            }
          }
          
          console.log('[bs.to] Returning', streams.length, 'streams');
          return streams;
        });
    })
    .catch(function(error) {
      console.error('[bs.to] Error:', error);
      return [testStream]; // Return test stream even on error
    });
}

// Export for Nuvio
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getStreams };
}
