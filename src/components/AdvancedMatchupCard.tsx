/**
 * Advanced Matchup Card
 * Premium statistical analysis for basketball games
 * Displays offense vs defense matchups with switchable views
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeftRight } from 'lucide-react';

interface AdvancedMatchupCardProps {
  barttorvik: {
    away: TeamStats;
    home: TeamStats;
    matchup: MatchupAnalysis;
  };
  awayTeam: string;
  homeTeam: string;
}

interface TeamStats {
  rank: number;
  adjOff: number;
  adjDef: number;
  eFG_off: number;
  eFG_def: number;
  to_off: number;
  to_def: number;
  oreb_off: number;
  oreb_def: number;
  twoP_off: number;
  threeP_off: number;
}

interface MatchupAnalysis {
  rankAdvantage: 'away' | 'home';
  rankDiff: number;
  offAdvantage: 'away' | 'home';
  offDiff: string;
  defAdvantage: 'away' | 'home';
  awayOffVsHomeDef: string;
  homeOffVsAwayDef: string;
}

type ViewMode = 'awayOff_homeDef' | 'homeOff_awayDef';

export function AdvancedMatchupCard({ barttorvik, awayTeam, homeTeam }: AdvancedMatchupCardProps) {
  const [view, setView] = useState<ViewMode>('awayOff_homeDef');
  const [expanded, setExpanded] = useState(false);

  if (!barttorvik) return null;

  const { away, home, matchup } = barttorvik;

  // Determine which teams to show based on view
  const isAwayOffView = view === 'awayOff_homeDef';
  const offTeam = isAwayOffView ? away : home;
  const defTeam = isAwayOffView ? home : away;
  const offTeamName = isAwayOffView ? awayTeam : homeTeam;
  const defTeamName = isAwayOffView ? homeTeam : awayTeam;
  const matchupDiff = isAwayOffView ? matchup.awayOffVsHomeDef : matchup.homeOffVsAwayDef;

  // Calculate efficiency differential
  const efficiencyDiff = (offTeam.adjOff - defTeam.adjDef).toFixed(1);
  const efficiencyAdvantage = parseFloat(efficiencyDiff) > 0;

  // Helper for percentage bars
  const getPercentageWidth = (value: number, max: number = 100) => {
    return Math.min((value / max) * 100, 100);
  };

  // Helper for ranking badge color
  const getRankColor = (rank: number) => {
    if (rank <= 25) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (rank <= 75) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (rank <= 150) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">
            Advanced Statistical Analysis
          </h3>
        </div>
        <button
          onClick={() => setView(isAwayOffView ? 'homeOff_awayDef' : 'awayOff_homeDef')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 
                     border border-slate-600/50 transition-all duration-200 group"
          title="Switch perspective"
        >
          <ArrowLeftRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
            Switch View
          </span>
        </button>
      </div>

      {/* Matchup Header */}
      <div className="mb-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRankColor(offTeam.rank)}`}>
              #{offTeam.rank}
            </span>
            <span className="text-xl font-bold text-blue-400">{offTeamName}</span>
            <span className="text-sm text-gray-500 uppercase font-semibold">OFFENSE</span>
          </div>
          <div className="text-gray-500 font-semibold">vs</div>
          <div className="flex items-center justify-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRankColor(defTeam.rank)}`}>
              #{defTeam.rank}
            </span>
            <span className="text-xl font-bold text-red-400">{defTeamName}</span>
            <span className="text-sm text-gray-500 uppercase font-semibold">DEFENSE</span>
          </div>
        </div>
      </div>

      {/* Efficiency Matchup */}
      <div className="space-y-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Efficiency Matchup
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Adj. Offensive Efficiency</span>
              <span className="font-mono text-lg font-semibold text-white">
                {offTeam.adjOff.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Adj. Defensive Efficiency</span>
              <span className="font-mono text-lg font-semibold text-white">
                {defTeam.adjDef.toFixed(1)}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-700/50">
              <div className={`text-sm font-semibold ${efficiencyAdvantage ? 'text-emerald-400' : 'text-red-400'}`}>
                {efficiencyAdvantage ? '↑' : '↓'} {efficiencyAdvantage ? '+' : ''}{efficiencyDiff} pts/100 possessions
              </div>
            </div>
          </div>
        </div>

        {/* Shooting Matchup */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Shooting Efficiency
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">{offTeamName} eFG%</span>
                <span className="font-mono text-sm font-semibold text-white">{offTeam.eFG_off.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                  style={{ width: `${getPercentageWidth(offTeam.eFG_off, 70)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-400">{defTeamName} allows</span>
                <span className="font-mono text-sm font-semibold text-white">{defTeam.eFG_def.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                  style={{ width: `${getPercentageWidth(defTeam.eFG_def, 70)}%` }}
                />
              </div>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-700/50">
              <div className={`text-sm font-semibold ${parseFloat(matchupDiff) > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {parseFloat(matchupDiff) > 0 ? '✓' : '✗'} {matchupDiff}% shooting advantage
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Factors */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 rounded-lg p-4 border border-slate-700/30 mb-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Key Matchup Factors
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 ${offTeam.twoP_off > 50 ? 'text-emerald-400' : 'text-gray-400'}`}>
              {offTeam.twoP_off > 50 ? '✓' : '•'}
            </span>
            <span className="text-gray-300">
              <span className="font-semibold text-white">{offTeamName}</span> shoots 2P at {offTeam.twoP_off.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 ${offTeam.threeP_off > 35 ? 'text-emerald-400' : 'text-gray-400'}`}>
              {offTeam.threeP_off > 35 ? '✓' : '•'}
            </span>
            <span className="text-gray-300">
              <span className="font-semibold text-white">{offTeamName}</span> shoots 3P at {offTeam.threeP_off.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 ${defTeam.eFG_def < 50 ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {defTeam.eFG_def < 50 ? '✓' : '⚠'}
            </span>
            <span className="text-gray-300">
              <span className="font-semibold text-white">{defTeamName}</span> allows {defTeam.eFG_def.toFixed(1)}% eFG
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 ${offTeam.to_off < 18 ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {offTeam.to_off < 18 ? '✓' : '⚠'}
            </span>
            <span className="text-gray-300">
              <span className="font-semibold text-white">{offTeamName}</span> turns ball over at {offTeam.to_off.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg 
                   bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 
                   transition-all duration-200 group"
      >
        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
          {expanded ? 'Show Less' : 'Show Full Statistics'}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        )}
      </button>

      {/* Expanded Stats */}
      {expanded && (
        <div className="mt-4 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
              <div className="text-xs text-gray-500 mb-1">Turnover Rate</div>
              <div className="font-mono text-sm text-white">OFF: {offTeam.to_off.toFixed(1)}%</div>
              <div className="font-mono text-sm text-gray-400">DEF: {defTeam.to_def.toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
              <div className="text-xs text-gray-500 mb-1">Offensive Rebound %</div>
              <div className="font-mono text-sm text-white">OFF: {offTeam.oreb_off.toFixed(1)}%</div>
              <div className="font-mono text-sm text-gray-400">DEF: {defTeam.oreb_def.toFixed(1)}%</div>
            </div>
          </div>

          {/* National Rankings */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/20">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              National Rankings
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">{offTeamName}</div>
                <div className="font-semibold text-white">Overall: #{offTeam.rank} of 365</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">{defTeamName}</div>
                <div className="font-semibold text-white">Overall: #{defTeam.rank} of 365</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle branding */}
      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <div className="text-xs text-gray-500 text-center">
          Powered by NHL Savant Advanced Analytics
        </div>
      </div>
    </div>
  );
}

export default AdvancedMatchupCard;

