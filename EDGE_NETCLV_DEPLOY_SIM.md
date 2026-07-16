# EDGE × netCLV Deploy Sim — May-fit → June

Fit window: **2026-05-10 → 2026-06-01** (n=272, both-signal n=97, May PnL -29.5u)
Deploy: **2026-06-01+** UI staked · frozen thresholds · fail-open when EDGE/netCLV missing

## Frozen May thresholds
- EDGE median **1.25** · netCLV median **-1.27**
- netCLV p25/p75 **-6.11 / 7.46**
- tape p20/p80 **-1.22 / 1.94** (tape = 1.5·EDGE/10 + 2·netCLV/10)
- old top2 p25 **65.08** (control)

## June coverage
- n=423 · hasBoth=220 (52%)
- both≥median: n=70 · WR 62.9% · 45.1u · ROI 25.2%
- both<median: n=22 · WR 45.5% · -8u · ROI -14.7%

## Policy results (ΔPnL vs baseline)
| Policy | n | WR | PnL | ROI | ΔPnL |
|--------|--:|---:|----:|----:|-----:|
| ONLY_TAPE_ABOVE_MED | 328 | 59.5% | 86.9u | 9.4% | +46u |
| BOOST_NET_HIGH | 310 | 57.1% | 78.9u | 8.9% | +38u |
| DROP_NET_LOW | 310 | 57.1% | 70.6u | 8.3% | +29.7u |
| COMBO_JOINT_NO_SHARP | 366 | 56.6% | 67.7u | 6.4% | +26.8u |
| DROP_BOTH_LOW_AND_SHARP | 366 | 56.6% | 60.3u | 6% | +19.4u |
| DROP_SHARP | 384 | 56.3% | 58.5u | 5.5% | +17.6u |
| BOOST_BOTH_HIGH | 401 | 55.6% | 58.4u | 5% | +17.5u |
| COMBO_JOINT | 401 | 55.6% | 58.4u | 5% | +17.5u |
| BOOST_TAPE_HIGH | 386 | 56% | 58.2u | 5.2% | +17.3u |
| DROP_TOP2_LOW | 239 | 57.3% | 50.2u | 7.3% | +9.3u |
| DROP_BOTH_LOW | 401 | 55.6% | 48.9u | 4.4% | +8u |
| DROP_TAPE_LOW | 386 | 56% | 48u | 4.5% | +7.1u |
| KEEP_BOTH_HIGH | 70 | 62.9% | 45.1u | 25.2% | +4.2u |
| BASELINE | 423 | 55.1% | 40.9u | 3.5% | +0u |

## Walk-forward (weekly median refresh)
| Week | priorN | edgeMed | netMed | Base | DROP_BOTH_LOW | COMBO_JOINT | COMBO+noSHARP |
|------|-------:|--------:|-------:|-----:|--------------:|------------:|--------------:|
| 2026-06-01 | 97 | 1.25 | -1.27 | 14.7u | 13.8u | 11.8u | 11.8u |
| 2026-06-08 | 156 | 5.89 | -1.57 | 5.1u | 15u | 17.1u | 17.1u |
| 2026-06-15 | 220 | 6.58 | -1.57 | 13.2u | 5.6u | 7u | 7u |
| 2026-06-22 | 238 | 6.69 | -1.82 | -10.2u | -0.2u | 1.8u | 1.6u |
| 2026-06-29 | 253 | 6.98 | -1.82 | 27.9u | 41.9u | 42.8u | 28.7u |
| 2026-07-06 | 289 | 6.58 | -1.74 | -9.8u | -7.8u | -5.6u | 9u |

### WF totals
- **BASELINE**: 40.9u (n=423) · Δ +0u
- **DROP_BOTH_LOW**: 68.3u (n=388) · Δ +27.4u
- **COMBO_JOINT**: 74.9u (n=388) · Δ +34u
- **BOOST_TAPE_HIGH**: 62.2u (n=379) · Δ +21.3u
- **DROP_SHARP**: 58.5u (n=384) · Δ +17.6u
- **COMBO_JOINT_NO_SHARP**: 75.2u (n=357) · Δ +34.3u

## Verdict
- Best frozen policy: **ONLY_TAPE_ABOVE_MED** · ΔPnL **+46u** · ROI 9.4%
- DROP_BOTH_LOW: **+8u** (cancel both-below-May-median)
- COMBO_JOINT (drop low + boost high): **+17.5u**
- DROP_SHARP alone: **+17.6u**
- Walk-forward COMBO_JOINT_NO_SHARP Δ: **34.3u**

## Ship recommendation

1. **Primary lever — netCLV** (not old top2): `DROP_NET_LOW` (+29.7u) / `BOOST_NET_HIGH` (+38u) with May p25=−6.11 / p75=+7.46.
2. **Selection — tape ≥ May median** when EDGE+netCLV available: `ONLY_TAPE_ABOVE_MED` (+46u, 9.4% ROI). Fail-open on missing signal.
3. **Stack SHARP mute**: `COMBO_JOINT_NO_SHARP` +26.8u frozen · **+34.3u** walk-forward.
4. **Do not** use May EDGE median (1.25) as a hard floor — June EDGE runs ~7; walk-forward EDGE med or netCLV-led gates only.
5. Old `DROP_TOP2_LOW` only +9.3u — netCLV cancel is ~3× the dollar lift.

