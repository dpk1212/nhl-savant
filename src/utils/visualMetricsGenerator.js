/**
 * Visual Metrics Generator
 * Creates data for beautiful visual presentations of statistical comparisons
 */

export class VisualMetricsGenerator {
  /**
   * Generate comparison bar data centered on league average
   */
  static generateComparisonBar(awayValue, homeValue, leagueAvg, higherIsBetter = true) {
    // Normalize values to percentage of league average
    const awayPct = (awayValue / leagueAvg) * 100;
    const homePct = (homeValue / leagueAvg) * 100;

    // Calculate bar widths (50% = league average)
    const awayWidth = Math.min(Math.max(awayPct, 0), 200);
    const homeWidth = Math.min(Math.max(homePct, 0), 200);

    // Determine colors based on higherIsBetter and value vs league avg
    const awayColor = this.getBarColor(awayValue, leagueAvg, higherIsBetter);
    const homeColor = this.getBarColor(homeValue, leagueAvg, higherIsBetter);

    // Determine advantage
    const awayAdvantage = higherIsBetter 
      ? awayValue > homeValue 
      : awayValue < homeValue;

    return {
      away: {
        value: awayValue,
        width: awayWidth,
        color: awayColor,
        hasAdvantage: awayAdvantage,
        vsLeague: ((awayValue - leagueAvg) / leagueAvg * 100).toFixed(1)
      },
      home: {
        value: homeValue,
        width: homeWidth,
        color: homeColor,
        hasAdvantage: !awayAdvantage,
        vsLeague: ((homeValue - leagueAvg) / leagueAvg * 100).toFixed(1)
      },
      leagueAvg,
      difference: Math.abs(awayValue - homeValue),
      advantageTeam: awayAdvantage ? 'away' : 'home'
    };
  }

  /**
   * Get color for bar based on value vs league average
   */
  static getBarColor(value, leagueAvg, higherIsBetter) {
    const diff = value - leagueAvg;
    const pctDiff = (diff / leagueAvg) * 100;

    // Elite (>15% better than average)
    if ((higherIsBetter && pctDiff > 15) || (!higherIsBetter && pctDiff < -15)) {
      return '#10B981'; // Green - Elite
    }
    // Strong (5-15% better)
    if ((higherIsBetter && pctDiff > 5) || (!higherIsBetter && pctDiff < -5)) {
      return '#0EA5E9'; // Blue - Strong
    }
    // Average (-5% to +5%)
    if (Math.abs(pctDiff) <= 5) {
      return '#64748B'; // Gray - Average
    }
    // Weak (>5% worse)
    return '#EF4444'; // Red - Weak
  }

  /**
   * Generate danger zone heatmap data
   */
  static generateDangerZoneHeatmap(awayDangerZone, homeDangerZone) {
    return {
      away: {
        low: {
          shots: awayDangerZone.offense.low.shots,
          xGoals: awayDangerZone.offense.low.xGoals,
          goals: awayDangerZone.offense.low.goals,
          width: this.calculateHeatmapWidth(awayDangerZone.offense.low.shots, 250)
        },
        medium: {
          shots: awayDangerZone.offense.medium.shots,
          xGoals: awayDangerZone.offense.medium.xGoals,
          goals: awayDangerZone.offense.medium.goals,
          width: this.calculateHeatmapWidth(awayDangerZone.offense.medium.shots, 80)
        },
        high: {
          shots: awayDangerZone.offense.high.shots,
          xGoals: awayDangerZone.offense.high.xGoals,
          goals: awayDangerZone.offense.high.goals,
          width: this.calculateHeatmapWidth(awayDangerZone.offense.high.shots, 35)
        }
      },
      home: {
        low: {
          shots: homeDangerZone.defense.low.shots,
          xGoals: homeDangerZone.defense.low.xGoals,
          goals: homeDangerZone.defense.low.goals,
          width: this.calculateHeatmapWidth(homeDangerZone.defense.low.shots, 250)
        },
        medium: {
          shots: homeDangerZone.defense.medium.shots,
          xGoals: homeDangerZone.defense.medium.xGoals,
          goals: homeDangerZone.defense.medium.goals,
          width: this.calculateHeatmapWidth(homeDangerZone.defense.medium.shots, 80)
        },
        high: {
          shots: homeDangerZone.defense.high.shots,
          xGoals: homeDangerZone.defense.high.xGoals,
          goals: homeDangerZone.defense.high.goals,
          width: this.calculateHeatmapWidth(homeDangerZone.defense.high.shots, 35)
        }
      },
      analysis: this.analyzeDangerZoneMatchup(awayDangerZone, homeDangerZone)
    };
  }

  /**
   * Calculate width for heatmap bars
   */
  static calculateHeatmapWidth(value, maxValue) {
    return Math.min((value / maxValue) * 100, 100);
  }

  /**
   * Analyze danger zone matchup
   */
  static analyzeDangerZoneMatchup(awayDZ, homeDZ) {
    const awayHighDanger = awayDZ.offense.high.shots;
    const homeHighDangerAllowed = homeDZ.defense.high.shots;
    
    const hdDiff = awayHighDanger - homeHighDangerAllowed;
    const hdPctDiff = homeHighDangerAllowed > 0 
      ? (hdDiff / homeHighDangerAllowed) * 100 
      : 0;

    let analysis = "";
    if (Math.abs(hdPctDiff) < 10) {
      analysis = "Balanced high-danger shot generation";
    } else if (hdPctDiff > 0) {
      analysis = `Away offense generates ${Math.abs(hdPctDiff).toFixed(0)}% more HD shots`;
    } else {
      analysis = `Home defense allows ${Math.abs(hdPctDiff).toFixed(0)}% fewer HD shots`;
    }

    return analysis;
  }

  /**
   * Generate rebound analysis table data
   */
  static generateReboundTable(awayReb, homeReb) {
    const leagueAvgConversion = 15; // ~15% league average

    return {
      awayOffense: {
        rebounds: Math.round(awayReb.xRebFor),
        reboundXg: awayReb.rebXgFor.toFixed(2),
        reboundGoals: awayReb.rebGoalsFor,
        conversion: awayReb.rebConversion.toFixed(1),
        vsLeague: awayReb.rebConversion - leagueAvgConversion,
        status: awayReb.rebConversion > leagueAvgConversion + 3 ? 'Hot' :
                awayReb.rebConversion < leagueAvgConversion - 3 ? 'Cold' : 'Average'
      },
      homeDefense: {
        rebounds: Math.round(homeReb.xRebAgainst),
        reboundXg: homeReb.rebXgAgainst.toFixed(2),
        reboundGoals: homeReb.rebGoalsAgainst,
        allowedPct: homeReb.xRebAgainst > 0 
          ? ((homeReb.rebGoalsAgainst / homeReb.xRebAgainst) * 100).toFixed(1)
          : 0,
        control: homeReb.rebXgaPer60 < (homeReb.rebXgfPer60 || 4) ? 'Excellent' : 'Average'
      },
      matchupEdge: {
        favors: awayReb.rebConversion > leagueAvgConversion && homeReb.rebXgaPer60 > 4 
          ? 'away' 
          : homeReb.rebXgaPer60 < 3 && awayReb.rebConversion < leagueAvgConversion
            ? 'home'
            : 'neutral',
        summary: this.generateReboundSummary(awayReb, homeReb, leagueAvgConversion)
      }
    };
  }

  /**
   * Generate rebound matchup summary
   */
  static generateReboundSummary(awayReb, homeReb, leagueAvg) {
    const awayVsAvg = awayReb.rebConversion - leagueAvg;
    const homeControl = homeReb.rebXgaPer60;

    if (Math.abs(awayVsAvg) < 3 && homeControl > 3 && homeControl < 5) {
      return "Balanced rebound battle - neither team has clear edge";
    }
    if (awayVsAvg < -3) {
      return `Away team cold on rebounds (${awayReb.rebConversion.toFixed(1)}% vs ${leagueAvg}% avg)`;
    }
    if (homeControl < 3) {
      return "Home defense controls rebound positioning effectively";
    }
    return "Standard rebound metrics for both teams";
  }

  /**
   * Generate physical play metrics table
   */
  static generatePhysicalMetrics(awayPhys, homePhys) {
    return [
      {
        stat: 'Shot Blocks',
        away: {
          value: awayPhys.blockingRate.toFixed(1) + '%',
          raw: awayPhys.blockedShotsAgainst,
          label: `${awayPhys.blockedShotsAgainst} blocks`
        },
        home: {
          value: homePhys.blockingRate.toFixed(1) + '%',
          raw: homePhys.blockedShotsAgainst,
          label: `${homePhys.blockedShotsAgainst} blocks`
        },
        advantage: homePhys.blockingRate > awayPhys.blockingRate ? 'home' : 'away',
        diff: Math.abs(homePhys.blockingRate - awayPhys.blockingRate).toFixed(1) + '%'
      },
      {
        stat: 'Takeaways',
        away: {
          value: awayPhys.takeawaysPer60.toFixed(1),
          raw: awayPhys.takeaways,
          label: `${awayPhys.takeaways} total`
        },
        home: {
          value: homePhys.takeawaysPer60.toFixed(1),
          raw: homePhys.takeaways,
          label: `${homePhys.takeaways} total`
        },
        advantage: awayPhys.takeaways > homePhys.takeaways ? 'away' : 'home',
        diff: Math.abs(awayPhys.takeaways - homePhys.takeaways)
      },
      {
        stat: 'DZ Giveaways',
        away: {
          value: awayPhys.dZoneGiveawaysPer60.toFixed(1),
          raw: awayPhys.dZoneGiveaways,
          label: `${awayPhys.dZoneGiveaways} mistakes`
        },
        home: {
          value: homePhys.dZoneGiveawaysPer60.toFixed(1),
          raw: homePhys.dZoneGiveaways,
          label: `${homePhys.dZoneGiveaways} mistakes`
        },
        advantage: awayPhys.dZoneGiveaways < homePhys.dZoneGiveaways ? 'away' : 'home',
        diff: Math.abs(awayPhys.dZoneGiveaways - homePhys.dZoneGiveaways)
      },
      {
        stat: 'Hits',
        away: {
          value: awayPhys.hitsPer60.toFixed(1),
          raw: awayPhys.hits,
          label: `${awayPhys.hits} hits`
        },
        home: {
          value: homePhys.hitsPer60.toFixed(1),
          raw: homePhys.hits,
          label: `${homePhys.hits} hits`
        },
        advantage: awayPhys.hits > homePhys.hits ? 'away' : 'home',
        diff: Math.abs(awayPhys.hits - homePhys.hits)
      }
    ];
  }

  /**
   * Get impact badge (🔥🎯⚡)
   */
  static getImpactBadge(importance) {
    switch (importance) {
      case 'CRITICAL':
        return { emoji: '🔥', label: 'CRITICAL', color: '#EF4444' };
      case 'HIGH':
        return { emoji: '🎯', label: 'HIGH IMPACT', color: '#F59E0B' };
      case 'MODERATE':
        return { emoji: '⚡', label: 'MODERATE', color: '#3B82F6' };
      default:
        return { emoji: '📊', label: 'FACTOR', color: '#64748B' };
    }
  }

  /**
   * Get tier badge based on rank
   */
  static getTierBadge(rank) {
    if (!rank) return { label: 'N/A', color: '#64748B' };
    
    if (rank <= 3) {
      return { label: 'ELITE', color: '#10B981', icon: '↑' };
    } else if (rank <= 10) {
      return { label: 'STRONG', color: '#0EA5E9', icon: '↑' };
    } else if (rank <= 22) {
      return { label: 'AVERAGE', color: '#64748B', icon: '=' };
    } else {
      return { label: 'WEAK', color: '#EF4444', icon: '↓' };
    }
  }

  /**
   * Format goal impact for display
   */
  static formatGoalImpact(impact) {
    const sign = impact >= 0 ? '+' : '';
    return `${sign}${impact.toFixed(2)}`;
  }

  /**
   * Get color for goal impact
   */
  static getImpactColor(impact, forTotals = true) {
    if (forTotals) {
      // For totals: negative = under (green), positive = over (red)
      if (impact < -0.2) return '#10B981'; // Strong under edge
      if (impact < -0.05) return '#34D399'; // Mild under edge
      if (impact > 0.2) return '#EF4444'; // Strong over edge
      if (impact > 0.05) return '#F87171'; // Mild over edge
      return '#64748B'; // Neutral
    } else {
      // For moneyline: positive = good, negative = bad
      return impact > 0 ? '#10B981' : '#EF4444';
    }
  }
}

