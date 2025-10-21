/**
 * AdvancedMetrics - Calculate sophisticated team metrics
 * Uses high-danger chances, rebounds, turnovers, and score-adjusted stats
 */
export class AdvancedMetrics {
  constructor(dataProcessor) {
    this.dataProcessor = dataProcessor;
  }

  // Get team data helper
  getTeamData(team, situation = '5on5') {
    return this.dataProcessor.getTeamData(team, situation);
  }

  // True Scoring Chance Quality (better than raw xG)
  // Weights high-danger chances more heavily than low-danger
  calculateTrueScoringChanceQuality(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    // Weight high-danger chances more heavily
    const hdWeight = 0.50;  // 50% from high-danger
    const mdWeight = 0.35;  // 35% from medium-danger
    const ldWeight = 0.15;  // 15% from low-danger

    const hdxG = parseFloat(teamData.highDangerxGoalsFor) || 0;
    const mdxG = parseFloat(teamData.mediumDangerxGoalsFor) || 0;
    const ldxG = parseFloat(teamData.lowDangerxGoalsFor) || 0;

    return (hdxG * hdWeight) + (mdxG * mdWeight) + (ldxG * ldWeight);
  }

  // Rebound Danger Index (teams that create chaos in front of net)
  calculateReboundDanger(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    const reboundxG = parseFloat(teamData.reboundxGoalsFor) || 0;
    const totalxG = parseFloat(teamData.xGoalsFor) || 1;

    // High % = team generates lots of rebounds (good for offense)
    return reboundxG / totalxG;
  }

  // Turnover Impact Score
  calculateTurnoverImpact(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    const takeaways = parseFloat(teamData.takeawaysFor) || 0;
    const giveaways = parseFloat(teamData.giveawaysFor) || 0;

    // Positive = more takeaways than giveaways (good)
    // Negative = more giveaways than takeaways (bad)
    return (takeaways - giveaways) / (takeaways + giveaways + 1);
  }

  // Get high-danger xG per 60
  getHighDangerxGPer60(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    const hdxG = parseFloat(teamData.highDangerxGoalsFor) || 0;
    const iceTime = parseFloat(teamData.iceTime) || 1;

    return (hdxG / iceTime) * 3600;
  }

  // Get high-danger xG against per 60
  getHighDangerxGAPer60(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    const hdxGA = parseFloat(teamData.highDangerxGoalsAgainst) || 0;
    const iceTime = parseFloat(teamData.iceTime) || 1;

    return (hdxGA / iceTime) * 3600;
  }

  // Shot quality ratio (xG per shot)
  calculateShotQuality(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    const xGoalsFor = parseFloat(teamData.xGoalsFor) || 0;
    const shotsFor = parseFloat(teamData.shotsOnGoalFor) || 1;

    return xGoalsFor / shotsFor;
  }

  // Defensive shot quality allowed
  calculateDefensiveShotQuality(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 0;

    const xGoalsAgainst = parseFloat(teamData.xGoalsAgainst) || 0;
    const shotsAgainst = parseFloat(teamData.shotsOnGoalAgainst) || 1;

    return xGoalsAgainst / shotsAgainst;
  }

  // Composite offensive rating (0-100 scale)
  calculateOffensiveRating(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 50;

    // Multiple factors
    const xGF_per60 = this.dataProcessor.calculatePer60Rate(
      parseFloat(teamData.scoreVenueAdjustedxGoalsFor) || 0,
      parseFloat(teamData.iceTime) || 1
    );
    const hdxGF_per60 = this.getHighDangerxGPer60(team, situation);
    const shotQuality = this.calculateShotQuality(team, situation);
    const reboundDanger = this.calculateReboundDanger(team, situation);

    // Normalize and weight (league averages: xGF~2.5, HDxGF~0.8, shotQuality~0.08)
    const xGFScore = Math.min(100, (xGF_per60 / 2.5) * 40);
    const hdScore = Math.min(100, (hdxGF_per60 / 0.8) * 30);
    const qualityScore = Math.min(100, (shotQuality / 0.08) * 20);
    const reboundScore = Math.min(100, (reboundDanger / 0.15) * 10);

    return xGFScore + hdScore + qualityScore + reboundScore;
  }

  // Composite defensive rating (0-100 scale, higher is better defense)
  calculateDefensiveRating(team, situation = '5on5') {
    const teamData = this.getTeamData(team, situation);
    if (!teamData) return 50;

    // Multiple factors (inverted - lower xGA is better)
    const xGA_per60 = this.dataProcessor.calculatePer60Rate(
      parseFloat(teamData.scoreVenueAdjustedxGoalsAgainst) || 0,
      parseFloat(teamData.iceTime) || 1
    );
    const hdxGA_per60 = this.getHighDangerxGAPer60(team, situation);
    const shotQualityAgainst = this.calculateDefensiveShotQuality(team, situation);

    // Invert (lower is better) and normalize
    const xGAScore = Math.min(100, ((3.5 - xGA_per60) / 2.5) * 50);
    const hdScore = Math.min(100, ((1.2 - hdxGA_per60) / 0.8) * 30);
    const qualityScore = Math.min(100, ((0.12 - shotQualityAgainst) / 0.08) * 20);

    return Math.max(0, xGAScore + hdScore + qualityScore);
  }
}

