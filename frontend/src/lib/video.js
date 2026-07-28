// Video script generator and downloader

export function generateVideoScript(content, platform = 'tiktok') {
  const scripts = {
    tiktok: `🎬 TIKTOK/REEL SCRIPT
================================

📱 Format: Vertical Video (9:16)
⏱️ Duration: 15-60 seconds

HOOK (0-3 seconds):
"${content.split('\n').find(line => line.includes('Hook'))?.replace('## Hook', '').trim() || 'Stop scrolling! You need to see this'}"

MAIN CONTENT (3-45 seconds):
"${content.split('\n').filter(l => l.includes('Caption'))[0]?.replace('## Caption', '').trim() || content.substring(0, 200)}"

CTA (45-60 seconds):
"${content.split('\n').find(line => line.includes('Call-to-Action'))?.replace('## Call-to-Action', '').trim() || 'Follow for more!'}"

VISUAL NOTES:
- Film vertically (9:16 ratio)
- Use good lighting
- Add text overlays for key points
- Include trending audio
- Add captions for accessibility

BEST POSTING TIMES:
- Weekdays: 7-9 AM, 12-2 PM, 7-10 PM
- Weekends: 9 AM-12 PM

HASHTAGS:
${content.split('\n').find(line => line.includes('Hashtags'))?.replace('## Hashtags', '').trim() || '#content #viral'}`,

    youtube: `🎬 YOUTUBE SHORT SCRIPT
================================

📱 Format: Vertical (9:16) or Horizontal (16:9)
⏱️ Duration: 30-60 seconds

INTRO (0-5 seconds):
"Hey everyone! Welcome back to the channel."
"${content.split('\n').find(line => line.includes('Hook'))?.replace('## Hook', '').trim() || 'Today we are talking about something amazing'}"

MAIN CONTENT (5-50 seconds):
"${content.split('\n').filter(l => l.includes('Caption'))[0]?.replace('## Caption', '').trim() || content.substring(0, 200)}"

OUTRO (50-60 seconds):
"If you found this helpful, smash that like button and subscribe!"
"${content.split('\n').find(line => line.includes('Call-to-Action'))?.replace('## Call-to-Action', '').trim() || 'See you in the next video!'}"

THUMBNAIL IDEAS:
- Bold text overlay
- Expressive face/reaction
- Bright colors
- Clear subject

DESCRIPTION:
${content.split('\n').find(line => line.includes('Hashtags'))?.replace('## Hashtags', '').trim() || ''}`,

    facebook: `🎬 FACEBOOK VIDEO SCRIPT
================================

📱 Format: Square (1:1) or Landscape (16:9)
⏱️ Duration: 1-3 minutes

HOOK (0-10 seconds):
"${content.split('\n').find(line => line.includes('Hook'))?.replace('## Hook', '').trim() || 'Did you know this amazing fact?'}"

STORY (10-120 seconds):
"${content.split('\n').filter(l => l.includes('Caption'))[0]?.replace('## Caption', '').trim() || content.substring(0, 300)}"

CTA (120-180 seconds):
"${content.split('\n').find(line => line.includes('Call-to-Action'))?.replace('## Call-to-Action', '').trim() || 'Share this with someone who needs it!'}"

PRODUCTION NOTES:
- Use captions (most watch without sound)
- Keep it authentic and personal
- Include your brand logo
- Add background music

POSTING TIPS:
- Post when audience is most active
- Reply to comments within first hour
- Share to relevant groups`,

    linkedin: `🎬 LINKEDIN VIDEO SCRIPT
================================

📱 Format: Square (1:1) or Vertical (4:5)
⏱️ Duration: 1-2 minutes

HOOK (0-10 seconds):
"${content.split('\n').find(line => line.includes('Hook'))?.replace('## Hook', '').trim() || 'Here is something most professionals do not know'}"

VALUE (10-90 seconds):
"${content.split('\n').filter(l => l.includes('Caption'))[0]?.replace('## Caption', '').trim() || content.substring(0, 250)}"

CTA (90-120 seconds):
"${content.split('\n').find(line => line.includes('Call-to-Action'))?.replace('## Call-to-Action', '').trim() || 'What are your thoughts? Let me know in the comments!'}"

PROFESSIONAL TIPS:
- Dress professionally
- Use clean background
- Speak clearly and confidently
- Add subtitles
- Include your title/company

BEST PRACTICES:
- Post Tuesday-Thursday
- 8-10 AM or 12-1 PM
- Engage with comments immediately`,
  }

  return scripts[platform] || scripts.tiktok
}

export function downloadVideoScript(content, platform, filename) {
  const script = generateVideoScript(content, platform)
  const blob = new Blob([script], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename || 'video-script'}-${platform}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function generateVideoThumbnail(content) {
  // Generate a thumbnail idea based on content
  const title = content.split('\n').find(l => l.includes('#'))?.replace(/#/g, '').trim() || 'Check This Out'
  return {
    title,
    style: 'Bold text on gradient background',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
    elements: ['Main text', 'Subtitle', 'Brand logo', 'Border'],
  }
}
