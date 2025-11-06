/**
 * Centralized Date Utilities for NHL Savant
 * 
 * NHL operates on Eastern Time (ET). All date operations should use ET timezone
 * to ensure consistency across client-side, server-side, and build-time processes.
 * 
 * PROBLEM: Using new Date().toISOString() returns UTC dates.
 * After 8 PM ET (midnight UTC), UTC is already the next day, causing cache mismatches.
 * 
 * SOLUTION: Always convert to ET before extracting date components.
 */

const ET_TIMEZONE = 'America/New_York';

/**
 * Get current date in Eastern Time (ET) as YYYY-MM-DD string
 * This is the primary function for date consistency across the app
 * 
 * @param {Date} [date] - Optional date to convert (defaults to now)
 * @returns {string} Date string in YYYY-MM-DD format (ET)
 * 
 * @example
 * // At 11 PM ET on Nov 3 (4 AM UTC on Nov 4):
 * getETDate() // Returns "2025-11-03" (correct!)
 * new Date().toISOString().split('T')[0] // Returns "2025-11-04" (wrong!)
 */
export function getETDate(date = new Date()) {
  // Convert to ET timezone and extract date components
  const etDateStr = date.toLocaleString('en-US', {
    timeZone: ET_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // toLocaleString returns "MM/DD/YYYY" format
  // Convert to "YYYY-MM-DD" format
  const [month, day, year] = etDateStr.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's date in Eastern Time (ET) as YYYY-MM-DD string
 * 
 * @returns {string} Yesterday's date in YYYY-MM-DD format (ET)
 */
export function getETYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getETDate(yesterday);
}

/**
 * Get current date/time information in Eastern Time
 * Useful for debugging and conditional logic
 * 
 * @param {Date} [date] - Optional date to convert (defaults to now)
 * @returns {Object} Date/time components in ET
 */
export function getETDateTime(date = new Date()) {
  const etDateStr = date.toLocaleString('en-US', {
    timeZone: ET_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Parse the formatted string
  const [datePart, timePart] = etDateStr.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');
  
  return {
    year: parseInt(year),
    month: parseInt(month),
    day: parseInt(day),
    hour: parseInt(hour),
    minute: parseInt(minute),
    second: parseInt(second),
    dateString: `${year}-${month}-${day}`,
    timeString: `${hour}:${minute}:${second}`
  };
}

/**
 * Get current hour in Eastern Time (0-23)
 * Useful for "before 6 AM" logic in Firebase Functions
 * 
 * @returns {number} Current hour in ET (0-23)
 */
export function getETHour() {
  const { hour } = getETDateTime();
  return hour;
}

/**
 * Format date for schedule CSV matching (M/D/YYYY format)
 * Used in generateExpertAnalysis.js and other scripts
 * 
 * @param {Date} [date] - Optional date to format (defaults to now)
 * @returns {string} Date in M/D/YYYY format (ET)
 * 
 * @example
 * formatDateForSchedule() // Returns "11/3/2025" at 11 PM ET on Nov 3
 */
export function formatDateForSchedule(date = new Date()) {
  const { year, month, day } = getETDateTime(date);
  // Remove leading zeros for schedule matching
  return `${parseInt(month)}/${parseInt(day)}/${year}`;
}

/**
 * Check if current time is before a certain hour (ET)
 * Useful for "after midnight but before 6 AM" logic
 * 
 * @param {number} cutoffHour - Hour threshold (0-23)
 * @returns {boolean} True if current ET hour is before cutoff
 */
export function isBeforeETCutoff(cutoffHour) {
  return getETHour() < cutoffHour;
}

/**
 * Get date with "after midnight" adjustment
 * If it's before 6 AM ET, returns yesterday's date
 * This matches NHL's operational day boundaries
 * 
 * @returns {string} Date in YYYY-MM-DD format (ET, with adjustment)
 */
export function getETGameDate() {
  if (isBeforeETCutoff(6)) {
    // Before 6 AM, games are still considered "yesterday"
    return getETYesterday();
  }
  return getETDate();
}

/**
 * Log date information for debugging
 * Useful for troubleshooting timezone issues
 * 
 * @param {string} context - Description of where this is being called from
 */
export function logDateDebug(context = 'Date Debug') {
  const utcDate = new Date().toISOString().split('T')[0];
  const etDate = getETDate();
  const { hour, minute } = getETDateTime();
  
  console.log(`🕐 ${context}:`);
  console.log(`   UTC Date: ${utcDate}`);
  console.log(`   ET Date:  ${etDate}`);
  console.log(`   ET Time:  ${hour}:${String(minute).padStart(2, '0')}`);
  
  if (utcDate !== etDate) {
    console.warn(`   ⚠️ TIMEZONE MISMATCH: UTC and ET dates differ!`);
  }
  
  return { utcDate, etDate };
}

/**
 * Node.js compatible version (for scripts and Firebase Functions)
 * Falls back to manual calculation if toLocaleString is not available
 */
export function getETDateNode(date = new Date()) {
  try {
    // Try browser/Node.js with Intl support first
    return getETDate(date);
  } catch (error) {
    // Fallback: Manual ET calculation (UTC - 5 hours for EST, UTC - 4 hours for EDT)
    // This is approximate and doesn't handle DST perfectly, but works for most cases
    console.warn('⚠️ Using fallback ET calculation (may not handle DST correctly)');
    
    const utcDate = new Date(date);
    // Subtract 5 hours (EST offset) - this is approximate
    utcDate.setHours(utcDate.getHours() - 5);
    
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}


