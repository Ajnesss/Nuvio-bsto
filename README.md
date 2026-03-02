# bs.to Nuvio Plugin

A Nuvio plugin for streaming German dubbed TV shows from bs.to (Burning Series).

## Features
- ✅ German dubbed TV series
- ✅ Multiple video hosts (VOE, Streamtape, Doodstream, Vidoza, Filemoon)
- ✅ Direct HTTP streams (no torrents needed)
- ⚠️ Movies support coming soon

## Installation

### Step 1: Upload to GitHub
1. Create a new repository on GitHub (name it something like `bsto-nuvio-plugin`)
2. Upload these files:
   - `bsto.js`
   - `manifest.json`
   - `README.md`
3. Make sure the repository is **public**

### Step 2: Add to Nuvio
1. Open Nuvio app
2. Go to **Settings → Plugins**
3. Add this repository URL:
   ```
   https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO-NAME/main/manifest.json
   ```
   (Replace YOUR-USERNAME and YOUR-REPO-NAME with your actual GitHub info)
4. Enable the **bs.to** plugin
5. Done!

## How It Works

1. Nuvio sends a TMDB ID for a TV show
2. Plugin fetches the show title from TMDB API
3. Plugin searches bs.to for that show
4. Plugin extracts video host links from the episode page
5. Plugin returns streams to Nuvio

## Supported Content
- ✅ TV Series (German dubbed)
- ❌ Movies (not yet implemented)

## Notes
- This plugin scrapes bs.to which hosts content via third-party video hosts
- Stream availability depends on bs.to's hosters
- Some streams may require clicking through to the video host site

## Troubleshooting

**No streams found?**
- The show might not be available on bs.to
- Try a different episode
- Check if bs.to is accessible in your region (may need VPN)

**Plugin not loading?**
- Make sure the GitHub repository URL is correct
- Check that files are in the main branch
- Verify the manifest.json is valid JSON

## Future Improvements
- [ ] Add movie support
- [ ] Add English language option
- [ ] Direct video URL extraction (skip redirect pages)
- [ ] Better error handling
- [ ] Search functionality for finding shows

## Disclaimer
This plugin is for educational purposes only. Users are responsible for compliance with local laws and bs.to's terms of service.
