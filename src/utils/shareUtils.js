/**
 * Share Utilities - Premium sharing functionality for NHL Savant
 * Handles native share, clipboard, and text formatting
 */

/**
 * Format share text for social media / messaging apps
 */
export function formatShareText(shareData) {
  const {
    teams,
    gameTime,
    bet,
    advantages = [],
    angle = null
  } = shareData;

  // Build the text
  let text = `🏒 NHL SAVANT PICK\n\n`;
  text += `${teams.away} @ ${teams.home}`;
  
  if (gameTime) {
    text += ` | ${gameTime}`;
  }
  
  text += `\n\n💰 BEST VALUE: ${bet.pick}\n`;
  text += `Odds: ${bet.odds > 0 ? '+' : ''}${bet.odds} | `;
  text += `EV: +${bet.ev.toFixed(1)}% | `;
  text += `Confidence: ${bet.confidence}`;
  
  // Add key advantages if available
  if (advantages.length > 0) {
    text += `\n\nKEY ADVANTAGES:\n`;
    advantages.slice(0, 3).forEach(adv => {
      // Clean up bullet point if it exists
      const cleanAdv = adv.replace(/^[•\-\*]\s*/, '');
      text += `• ${cleanAdv}\n`;
    });
  }
  
  // Add betting angle if available
  if (angle) {
    text += `\n${angle}`;
  }
  
  text += `\n\n📊 Via NHL Savant | nhlsavant.com`;
  
  return text;
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  try {
    // Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      textArea.remove();
      return false;
    }
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}

/**
 * Handle native share (Web Share API)
 * Falls back to copy if not supported
 */
export async function handleNativeShare(shareData) {
  const text = formatShareText(shareData);
  const title = `NHL Savant Pick: ${shareData.teams.away} @ ${shareData.teams.home}`;
  
  // Check if Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: 'https://nhlsavant.com'
      });
      return { success: true, method: 'native' };
    } catch (err) {
      // User cancelled or error occurred
      if (err.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      console.error('Native share failed:', err);
      // Fall through to clipboard fallback
    }
  }
  
  // Fallback: Copy to clipboard
  const copied = await copyToClipboard(text);
  return { 
    success: copied, 
    method: 'clipboard',
    fallback: true 
  };
}

/**
 * Generate and download shareable image
 * This is called from ShareableCard component which handles the actual rendering
 */
export async function downloadShareImage(canvas, shareData) {
  try {
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `nhl-savant-${shareData.teams.away}-${shareData.teams.home}-${Date.now()}.png`;
        
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        resolve({ success: true, filename });
      }, 'image/png', 1.0);
    });
  } catch (err) {
    console.error('Download image failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get confidence level with color
 * Matches existing logic from TodaysGames.jsx
 */
export function getConfidenceLevel(evPercent, modelProb) {
  // Convert modelProb to percentage if it's a decimal
  const probPercent = modelProb > 1 ? modelProb : modelProb * 100;
  
  if (evPercent >= 8 && probPercent >= 60) {
    return { level: 'VERY HIGH', color: '#10B981' };
  } else if (evPercent >= 5 && probPercent >= 55) {
    return { level: 'HIGH', color: '#10B981' };
  } else if (evPercent >= 3) {
    return { level: 'MEDIUM', color: '#F59E0B' };
  } else {
    return { level: 'LOW', color: '#94A3B8' };
  }
}

