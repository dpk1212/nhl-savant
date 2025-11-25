/**
 * NCAA API Proxy - Firebase Cloud Function
 * 
 * Proxies requests to NCAA API to avoid CORS issues
 * Endpoint: GET /ncaaProxy?date=YYYYMMDD
 */

const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");

/**
 * NCAA API Proxy endpoint
 * Accepts date parameter and fetches scoreboard from NCAA API
 */
exports.ncaaProxy = onRequest({
  cors: true, // Enable CORS for frontend requests
  memory: "256MiB",
  timeoutSeconds: 30,
}, async (request, response) => {
  try {
    const date = request.query.date;
    
    if (!date) {
      response.status(400).json({ error: "Missing date parameter (format: YYYYMMDD)" });
      return;
    }

    // Validate date format
    if (!/^\d{8}$/.test(date)) {
      response.status(400).json({ error: "Invalid date format. Use YYYYMMDD (e.g., 20251125)" });
      return;
    }

    logger.info(`Proxying NCAA API request for date: ${date}`);

    const url = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${date}`;
    const ncaaResponse = await fetch(url);

    if (!ncaaResponse.ok) {
      logger.error(`NCAA API error: ${ncaaResponse.status}`);
      response.status(ncaaResponse.status).json({ 
        error: "NCAA API error", 
        status: ncaaResponse.status 
      });
      return;
    }

    const data = await ncaaResponse.json();
    
    logger.info(`Successfully fetched ${data.games?.length || 0} games for ${date}`);
    
    // Return NCAA data directly
    response.json(data);
  } catch (error) {
    logger.error("Error in NCAA proxy:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

