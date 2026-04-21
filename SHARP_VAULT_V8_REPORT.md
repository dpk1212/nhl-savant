# Sharp Vault × V8 — can we identify winners?

Generated: 4/21/2026, 10:16:07 AM ET · V8 cutover: 2026-04-18

## Baseline (all graded V8-era sharp vault positions)

| Metric | Value |
|---|---|
| Positions (N) | 290 |
| Win rate | 51.7% |
| Total invested | $24719516 |
| Total PnL | +$28564 |
| Dollar-weighted ROI | +0.1% |
| Mean per-position ROI | +1.3% |

This is the universe we're trying to filter. Everything below asks: which V8 signals would let us keep the winners and drop the losers?

---
## 1. Daily Sharp Vault PnL

| Date | Positions | WR | Invested | PnL | $ ROI | Cum PnL |
|---|---|---|---|---|---|---|
| 2026-04-18 | 77 | 42.9% | $5637713 | -$211809 | -3.8% | -$211809 |
| 2026-04-19 | 123 | 56.1% | $10023256 | +$6766 | +0.1% | -$205043 |
| 2026-04-20 | 71 | 54.9% | $6984335 | -$111607 | -1.6% | -$316650 |
| 2026-04-21 | 19 | 47.4% | $2074212 | +$345214 | +16.6% | +$28564 |

---
## 2. Single-factor breakdowns — which V8 signals separate winners?

Within each factor, buckets are sorted by **dollar-weighted ROI** (best → worst) so the winners float to the top.

### v8_onConsensusSide
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| against | 28 | 71.4% | $1313240 | +$193841 | +14.8% | +20.8% |
| unknown | 222 | 52.3% | $19187153 | +$213287 | +1.1% | +1.4% |
| on consensus | 40 | 35.0% | $4219123 | -$378564 | -9.0% | -12.7% |

### v8_qualifiedContribution (contrib ≥ 50)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| not qualified (<50) | 21 | 57.1% | $1200894 | +$405845 | +33.8% | +14.5% |
| unknown | 222 | 52.3% | $19187153 | +$213287 | +1.1% | +1.4% |
| qualified (≥50) | 47 | 46.8% | $4331469 | -$590568 | -13.6% | -4.9% |

### v8_walletBase (this wallet's composite quality)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| base<40 | 70 | 50.0% | $2894685 | +$442680 | +15.3% | +1.4% |
| base 40–55 | 76 | 55.3% | $9217009 | +$606409 | +6.6% | +5.3% |
| base 55–70 | 106 | 54.7% | $7445246 | -$199227 | -2.7% | +3.6% |
| base≥70 | 34 | 41.2% | $5091434 | -$804009 | -15.8% | -13.3% |
| — | 4 | 25.0% | $71142 | -$17289 | -24.3% | -13.3% |

### v8_walletRoiNorm (this wallet's ROI percentile)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| roi<40 | 116 | 47.4% | $8044607 | +$262170 | +3.3% | -0.2% |
| roi 40–60 | 54 | 55.6% | $8582137 | +$144477 | +1.7% | +5.4% |
| roi≥80 | 33 | 60.6% | $1849006 | -$51237 | -2.8% | +1.5% |
| roi 60–80 | 83 | 53.0% | $6172624 | -$309557 | -5.0% | +1.3% |
| — | 4 | 25.0% | $71142 | -$17289 | -24.3% | -13.3% |

### v8_walletContribution (walletBase × conviction)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| ctrb 25–50 | 83 | 56.6% | $3070907 | +$489396 | +15.9% | +8.4% |
| ctrb 50–100 | 186 | 50.5% | $19278002 | -$367060 | -1.9% | -0.3% |
| ctrb≥100 | 9 | 66.7% | $2177905 | -$62381 | -2.9% | +1.2% |
| ctrb<25 | 8 | 25.0% | $121560 | -$14102 | -11.6% | -28.1% |
| — | 4 | 25.0% | $71142 | -$17289 | -24.3% | -13.3% |

### v8_convictionMult (bet-size conviction)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| conv<0.9 | 2 | 100.0% | $28581 | +$12769 | +44.7% | +48.5% |
| conv 1.1–1.3 | 86 | 51.2% | $5199740 | +$137804 | +2.7% | +2.1% |
| conv≥1.3 | 93 | 54.8% | $14386199 | +$34474 | +0.2% | +0.5% |
| conv 0.9–1.1 | 105 | 49.5% | $5033854 | -$139194 | -2.8% | +1.0% |
| — | 4 | 25.0% | $71142 | -$17289 | -24.3% | -13.3% |

### v8_sizeRatio (this bet vs wallet average)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| size<0.8x | 11 | 72.7% | $166705 | +$69852 | +41.9% | +21.6% |
| size 1.5–3x | 87 | 50.6% | $6849288 | +$119373 | +1.7% | +1.6% |
| size≥3x | 81 | 56.8% | $12239280 | +$85609 | +0.7% | +1.9% |
| size 0.8–1.5x | 107 | 47.7% | $5393101 | -$228981 | -4.2% | -1.0% |
| — | 4 | 25.0% | $71142 | -$17289 | -24.3% | -13.3% |

### v8_contribTier (game-level tier)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| STANDARD | 13 | 61.5% | $636782 | +$103636 | +16.3% | +11.4% |
| MUTE | 13 | 53.8% | $1459972 | +$209434 | +14.3% | -0.5% |
| — | 222 | 52.3% | $19187153 | +$213287 | +1.1% | +1.4% |
| STRONG | 17 | 47.1% | $1022641 | +$4743 | +0.5% | -1.7% |
| LEAN | 25 | 44.0% | $2412968 | -$502536 | -20.8% | -1.5% |

### v8_stars (game-level stars)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| ★<2 | 23 | 39.1% | $1343611 | +$317334 | +23.6% | -15.0% |
| ★ 3–3.5 | 79 | 60.8% | $8261926 | +$129136 | +1.6% | +7.7% |
| ★ 2–2.5 | 139 | 49.6% | $10036614 | -$181838 | -1.8% | +1.0% |
| ★≥4 | 49 | 49.0% | $5077365 | -$236068 | -4.6% | -0.4% |

### v8_contribMargin (qFor − qAg)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| margin<0 | 13 | 53.8% | $1459972 | +$209434 | +14.3% | -0.5% |
| margin=+1 | 24 | 58.3% | $1446975 | +$143643 | +9.9% | +9.5% |
| — | 222 | 52.3% | $19187153 | +$213287 | +1.1% | +1.4% |
| margin≥+2 | 6 | 33.3% | $212448 | -$35264 | -16.6% | -18.3% |
| margin=0 | 25 | 44.0% | $2412968 | -$502536 | -20.8% | -1.5% |

### label (internal tier)
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| HIGH_CONVICTION | 86 | 57.0% | $12312094 | +$118755 | +1.0% | +2.1% |
| SHARP_POSITION | 204 | 49.5% | $12407422 | -$90191 | -0.7% | +1.0% |

### sport
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| MLB | 76 | 57.9% | $4417210 | +$440336 | +10.0% | +6.1% |
| NBA | 181 | 49.2% | $17899181 | -$213940 | -1.2% | -1.2% |
| NHL | 33 | 51.5% | $2403125 | -$197832 | -8.2% | +3.7% |

### market
| Bucket | N | WR | Total invested | Total PnL | $ ROI | Mean pos ROI |
|---|---|---|---|---|---|---|
| TOTAL | 54 | 50.0% | $3883210 | +$163562 | +4.2% | -1.0% |
| ML | 155 | 52.9% | $15961959 | -$101060 | -0.6% | +2.8% |
| SPREAD | 81 | 50.6% | $4874347 | -$33938 | -0.7% | -0.1% |


---
## 3. 2-way cross sections

Cells show `N · WR · $ROI · PnL`. These isolate combinations where one filter alone is noisy but two together are stable.

### v8_onConsensusSide × v8_walletBase
*cell = N · WR · $ROI · PnL*

| | **base 40–55** | **base 55–70** | **base<40** | **base≥70** | **—** |
|---|---|---|---|---|---|
| **against** | N=13 · 69% · +15% · +$89779 | N=9 · 67% · +28% · +$125454 | N=2 · 100% · +64% · +$13162 | N=4 · 75% · -14% · -$34554 | — |
| **on consensus** | N=10 · 50% · +16% · +$138673 | N=12 · 50% · +4% · +$33373 | N=9 · 22% · +42% · +$334270 | N=9 · 11% · -53% · -$884880 | — |
| **unknown** | N=53 · 53% · +5% · +$377957 | N=85 · 54% · -6% · -$358054 | N=59 · 53% · +5% · +$95248 | N=21 · 48% · +4% · +$115425 | N=4 · 25% · -24% · -$17289 |

### v8_onConsensusSide × v8_contribTier
*cell = N · WR · $ROI · PnL*

| | **LEAN** | **MUTE** | **STANDARD** | **STRONG** | **—** |
|---|---|---|---|---|---|
| **against** | N=9 · 100% · +50% · +$228399 | N=9 · 56% · -22% · -$64412 | N=4 · 50% · -33% · -$50647 | N=6 · 67% · +20% · +$80501 | — |
| **on consensus** | N=16 · 13% · -37% · -$730935 | N=4 · 50% · +23% · +$273846 | N=9 · 67% · +32% · +$154283 | N=11 · 36% · -12% · -$75758 | — |
| **unknown** | — | — | — | — | N=222 · 52% · +1% · +$213287 |

### v8_onConsensusSide × v8_walletRoiNorm
*cell = N · WR · $ROI · PnL*

| | **roi 40–60** | **roi 60–80** | **roi<40** | **roi≥80** | **—** |
|---|---|---|---|---|---|
| **against** | N=5 · 60% · +16% · +$49981 | N=12 · 75% · -3% · -$10503 | N=10 · 70% · +23% · +$146000 | N=1 · 100% · +21% · +$8363 | — |
| **on consensus** | N=12 · 33% · -11% · -$87450 | N=9 · 22% · -53% · -$802817 | N=16 · 44% · +30% · +$527477 | N=3 · 33% · -12% · -$15774 | — |
| **unknown** | N=37 · 62% · +2% · +$181946 | N=62 · 53% · +12% · +$503763 | N=90 · 46% · -7% · -$411307 | N=29 · 62% · -3% · -$43826 | N=4 · 25% · -24% · -$17289 |

### v8_onConsensusSide × v8_stars
*cell = N · WR · $ROI · PnL*

| | **★ 2–2.5** | **★ 3–3.5** | **★<2** | **★≥4** |
|---|---|---|---|---|
| **against** | N=16 · 88% · +43% · +$216344 | N=8 · 63% · +6% · +$27959 | N=3 · 0% · -73% · -$116872 | N=1 · 100% · +38% · +$66410 |
| **on consensus** | N=21 · 38% · -22% · -$600474 | N=11 · 36% · -14% · -$98396 | N=2 · 100% · +72% · +$409306 | N=6 · 0% · -42% · -$89000 |
| **unknown** | N=102 · 46% · +3% · +$202292 | N=60 · 65% · +3% · +$199573 | N=18 · 39% · +4% · +$24900 | N=42 · 55% · -5% · -$213478 |

### v8_walletBase × v8_contribTier
*cell = N · WR · $ROI · PnL*

| | **LEAN** | **MUTE** | **STANDARD** | **STRONG** | **—** |
|---|---|---|---|---|---|
| **base 40–55** | N=8 · 63% · +18% · +$139012 | N=2 · 0% · -73% · -$32611 | N=7 · 71% · +11% · +$38996 | N=6 · 67% · +28% · +$83055 | N=53 · 53% · +5% · +$377957 |
| **base 55–70** | N=6 · 50% · -7% · -$35190 | N=4 · 75% · +30% · +$61696 | N=3 · 67% · +39% · +$67761 | N=8 · 50% · +15% · +$64560 | N=85 · 54% · -6% · -$358054 |
| **base<40** | N=7 · 29% · -21% · -$48728 | N=2 · 100% · +73% · +$406721 | N=1 · 0% · -50% · -$1951 | N=1 · 0% · -40% · -$8610 | N=59 · 53% · +5% · +$95248 |
| **base≥70** | N=4 · 25% · -63% · -$557630 | N=5 · 40% · -35% · -$226372 | N=2 · 50% · -1% · -$1170 | N=2 · 0% · -50% · -$134262 | N=21 · 48% · +4% · +$115425 |
| **—** | — | — | — | — | N=4 · 25% · -24% · -$17289 |

### v8_walletBase × v8_convictionMult
*cell = N · WR · $ROI · PnL*

| | **conv 0.9–1.1** | **conv 1.1–1.3** | **conv<0.9** | **conv≥1.3** | **—** |
|---|---|---|---|---|---|
| **base 40–55** | N=31 · 52% · -1% · -$11853 | N=21 · 52% · +9% · +$151140 | N=2 · 100% · +45% · +$12769 | N=22 · 59% · +8% · +$454353 | — |
| **base 55–70** | N=34 · 53% · +4% · +$33989 | N=36 · 64% · +24% · +$345471 | — | N=36 · 47% · -11% · -$578687 | — |
| **base<40** | N=24 · 46% · +3% · +$15317 | N=18 · 33% · -18% · -$118279 | — | N=28 · 64% · +31% · +$545642 | — |
| **base≥70** | N=16 · 44% · -10% · -$176647 | N=11 · 36% · -17% · -$240528 | — | N=7 · 43% · -20% · -$386834 | — |
| **—** | — | — | — | — | N=4 · 25% · -24% · -$17289 |

### v8_contribTier × v8_qualifiedContribution
*cell = N · WR · $ROI · PnL*

| | **not qualified (<50)** | **qualified (≥50)** | **unknown** |
|---|---|---|---|
| **LEAN** | N=10 · 50% · +10% · +$43199 | N=15 · 40% · -28% · -$545735 | — |
| **MUTE** | N=2 · 100% · +73% · +$406721 | N=11 · 45% · -22% · -$197287 | — |
| **STANDARD** | N=6 · 50% · -28% · -$47174 | N=7 · 71% · +32% · +$150810 | — |
| **STRONG** | N=3 · 67% · +7% · +$3099 | N=14 · 43% · +0% · +$1644 | — |
| **—** | — | — | N=222 · 52% · +1% · +$213287 |

### v8_stars × v8_contribTier
*cell = N · WR · $ROI · PnL*

| | **LEAN** | **MUTE** | **STANDARD** | **STRONG** | **—** |
|---|---|---|---|---|---|
| **★ 2–2.5** | N=17 · 47% · -24% · -$477942 | N=9 · 67% · -10% · -$75195 | N=8 · 75% · +31% · +$106642 | N=3 · 67% · +31% · +$62365 | N=102 · 46% · +3% · +$202292 |
| **★ 3–3.5** | N=7 · 29% · -7% · -$32399 | — | N=5 · 40% · -1% · -$3006 | N=7 · 71% · -8% · -$35032 | N=60 · 65% · +3% · +$199573 |
| **★<2** | N=1 · 100% · +48% · +$7805 | N=4 · 25% · +40% · +$284629 | — | — | N=18 · 39% · +4% · +$24900 |
| **★≥4** | — | — | — | N=7 · 14% · -6% · -$22590 | N=42 · 55% · -5% · -$213478 |


---
## 4. Winner-filter simulation

If we treated the Sharp Vault as a book and only took the subset of positions matching each filter below, this is what we'd have actually done.

### Winner-filter simulation

Each row shows what the Sharp Vault would look like if we **only kept** positions matching the filter. "Kept" is our proposed whitelist; "Dropped" is what we'd fade.

| Filter | Kept N | Kept WR | Kept $ROI | Kept PnL | Dropped N | Dropped $ROI | Dropped PnL |
|---|---|---|---|---|---|---|---|
| v8_onConsensusSide = true | 40 | 35.0% | -9.0% | -$378564 | 250 | +2.0% | +$407128 |
| v8_qualifiedContribution = true (contrib ≥ 50) | 47 | 46.8% | -13.6% | -$590568 | 243 | +3.0% | +$619132 |
| v8_walletBase ≥ 55 | 140 | 51.4% | -8.0% | -$1003236 | 150 | +8.5% | +$1031800 |
| v8_walletBase ≥ 70 | 34 | 41.2% | -15.8% | -$804009 | 256 | +4.2% | +$832573 |
| v8_walletRoiNorm ≥ 70 | 51 | 60.8% | +0.8% | +$17637 | 239 | +0.0% | +$10927 |
| v8_walletContribution ≥ 50 | 195 | 51.3% | -2.0% | -$429441 | 95 | +14.0% | +$458005 |
| v8_walletContribution ≥ 100 | 9 | 66.7% | -2.9% | -$62381 | 281 | +0.4% | +$90945 |
| v8_contribTier ∈ {STRONG, STANDARD} | 30 | 53.3% | +6.5% | +$108379 | 260 | -0.3% | -$79815 |
| v8_stars ≥ 3 | 128 | 56.3% | -0.8% | -$106932 | 162 | +1.2% | +$135496 |
| v8_stars ≥ 4 | 49 | 49.0% | -4.6% | -$236068 | 241 | +1.3% | +$264632 |
| on-consensus AND qualified (≥50) | 30 | 36.7% | -21.1% | -$718258 | 260 | +3.5% | +$746822 |
| on-consensus AND walletBase ≥ 55 | 21 | 33.3% | -33.5% | -$851507 | 269 | +4.0% | +$880071 |
| on-consensus AND walletRoiNorm ≥ 70 | 4 | 25.0% | -18.6% | -$31030 | 286 | +0.2% | +$59594 |
| on-consensus AND contribTier ∈ {STRONG, STANDARD} | 20 | 50.0% | +7.1% | +$78525 | 270 | -0.2% | -$49961 |
| on-consensus AND qualified AND stars ≥ 3 | 12 | 25.0% | -19.5% | -$147496 | 278 | +0.7% | +$176060 |
| ELITE combo: on-consensus AND walletBase≥55 AND contribTier∈{STRONG,STANDARD} | 12 | 50.0% | -0.7% | -$5493 | 278 | +0.1% | +$34057 |


---
## 5. 3-way cluster rankings (N ≥ 8)

Every 3-factor intersection with at least 8 positions, ranked by dollar-weighted ROI. Top = where V8 clusters historically win big. Bottom = where V8 clusters bleed.

### 5a. Top 15 hit clusters
| Rank | Cluster | N | WR | $ ROI | PnL |
|---|---|---|---|---|---|
| 1 | qualified=not qualified (<50) · walletRoi=roi<40 · sport=NBA | 9 | 77.8% | +51.2% | +$410122 |
| 2 | onCons=against · stars=★ 2–2.5 · market=ML | 11 | 90.9% | +51.1% | +$130937 |
| 3 | onCons=against · contribTier=LEAN · margin=margin=0 | 9 | 100.0% | +49.7% | +$228399 |
| 4 | onCons=unknown · stars=★ 3–3.5 · sport=MLB | 12 | 100.0% | +49.0% | +$206383 |
| 5 | qualified=unknown · stars=★ 3–3.5 · sport=MLB | 12 | 100.0% | +49.0% | +$206383 |
| 6 | contribTier=— · stars=★ 3–3.5 · sport=MLB | 12 | 100.0% | +49.0% | +$206383 |
| 7 | stars=★ 3–3.5 · margin=— · sport=MLB | 12 | 100.0% | +49.0% | +$206383 |
| 8 | onCons=against · walletRoi=roi 60–80 · stars=★ 2–2.5 | 9 | 88.9% | +45.6% | +$88209 |
| 9 | walletBase=base 55–70 · conviction=conv 1.1–1.3 · market=TOTAL | 10 | 90.0% | +45.4% | +$272167 |
| 10 | qualified=not qualified (<50) · walletRoi=roi<40 · market=ML | 9 | 44.4% | +44.7% | +$420424 |
| 11 | qualified=not qualified (<50) · walletBase=base<40 · walletRoi=roi<40 | 8 | 37.5% | +44.1% | +$349432 |
| 12 | onCons=on consensus · qualified=not qualified (<50) · walletRoi=roi<40 | 8 | 37.5% | +43.8% | +$346914 |
| 13 | onCons=on consensus · walletRoi=roi<40 · conviction=conv≥1.3 | 8 | 62.5% | +42.9% | +$603667 |
| 14 | qualified=not qualified (<50) · walletBase=base<40 · market=ML | 10 | 30.0% | +42.3% | +$339627 |
| 15 | onCons=on consensus · qualified=not qualified (<50) · walletBase=base<40 | 9 | 22.2% | +41.8% | +$334270 |

### 5b. Bottom 15 miss clusters
| Rank | Cluster | N | WR | $ ROI | PnL |
|---|---|---|---|---|---|
| 1 | qualified=qualified (≥50) · walletRoi=roi 60–80 · sport=NBA | 10 | 30.0% | -60.5% | -$719604 |
| 2 | qualified=qualified (≥50) · sport=NBA · market=ML | 11 | 27.3% | -58.2% | -$676626 |
| 3 | onCons=on consensus · margin=margin=0 · market=ML | 11 | 0.0% | -55.4% | -$716540 |
| 4 | onCons=on consensus · contribTier=LEAN · market=ML | 11 | 0.0% | -55.4% | -$716540 |
| 5 | qualified=qualified (≥50) · margin=margin=0 · market=ML | 9 | 33.3% | -53.6% | -$620083 |
| 6 | qualified=qualified (≥50) · contribTier=LEAN · market=ML | 9 | 33.3% | -53.6% | -$620083 |
| 7 | onCons=on consensus · qualified=qualified (≥50) · walletBase=base≥70 | 9 | 11.1% | -53.4% | -$884880 |
| 8 | onCons=on consensus · qualified=qualified (≥50) · walletRoi=roi 60–80 | 9 | 22.2% | -53.2% | -$802817 |
| 9 | qualified=qualified (≥50) · walletBase=base≥70 · market=ML | 11 | 27.3% | -51.0% | -$850004 |
| 10 | qualified=qualified (≥50) · walletBase=base≥70 · walletRoi=roi 60–80 | 9 | 33.3% | -49.8% | -$821536 |
| 11 | qualified=qualified (≥50) · walletRoi=roi 60–80 · market=ML | 14 | 50.0% | -49.0% | -$734912 |
| 12 | stars=★ 2–2.5 · margin=margin=0 · market=ML | 11 | 45.5% | -49.0% | -$552290 |
| 13 | contribTier=LEAN · stars=★ 2–2.5 · market=ML | 11 | 45.5% | -49.0% | -$552290 |
| 14 | margin=margin=0 · sport=NBA · market=ML | 8 | 62.5% | -48.3% | -$483184 |
| 15 | contribTier=LEAN · sport=NBA · market=ML | 8 | 62.5% | -48.3% | -$483184 |

---
## 6. Stability — daily breakdown of key signals

Same cells as §2 but split across days. Signals that stay positive (or negative) every day are the trustworthy ones.

### v8_onConsensusSide
| Bucket | 04-18 | 04-19 | 04-20 | 04-21 | TOTAL |
|---|---|---|---|---|---|
| against | — | — | N=19 · 74% · +19% · +$154491 | N=9 · 67% · +8% · +$39350 | **N=28 · 71% · +15% · +$193841** |
| on consensus | — | — | N=30 · 37% · -26% · -$684428 | N=10 · 30% · +20% · +$305864 | **N=40 · 35% · -9% · -$378564** |
| unknown | N=77 · 43% · -4% · -$211809 | N=123 · 56% · +0% · +$6766 | N=22 · 64% · +12% · +$418330 | — | **N=222 · 52% · +1% · +$213287** |

### v8_walletBase
| Bucket | 04-18 | 04-19 | 04-20 | 04-21 | TOTAL |
|---|---|---|---|---|---|
| base 40–55 | N=20 · 60% · +18% · +$195242 | N=26 · 46% · -3% · -$123963 | N=23 · 61% · +11% · +$350835 | N=7 · 57% · +32% · +$184295 | **N=76 · 55% · +7% · +$606409** |
| base 55–70 | N=23 · 39% · -18% · -$434362 | N=52 · 60% · +0% · +$5380 | N=29 · 55% · +8% · +$172324 | N=2 · 100% · +54% · +$57431 | **N=106 · 55% · -3% · -$199227** |
| base<40 | N=24 · 33% · -5% · -$44802 | N=30 · 63% · +12% · +$99326 | N=12 · 58% · +5% · +$23026 | N=4 · 25% · +55% · +$365130 | **N=70 · 50% · +15% · +$442680** |
| base≥70 | N=8 · 50% · +8% · +$87876 | N=13 · 46% · +1% · +$27549 | N=7 · 29% · -55% · -$657792 | N=6 · 33% · -36% · -$261642 | **N=34 · 41% · -16% · -$804009** |
| — | N=2 · 0% · -44% · -$15763 | N=2 · 50% · -4% · -$1526 | — | — | **N=4 · 25% · -24% · -$17289** |

### v8_walletRoiNorm
| Bucket | 04-18 | 04-19 | 04-20 | 04-21 | TOTAL |
|---|---|---|---|---|---|
| roi 40–60 | N=12 · 67% · -6% · -$147771 | N=19 · 63% · +5% · +$123736 | N=20 · 50% · +7% · +$218745 | N=3 · 0% · -39% · -$50233 | **N=54 · 56% · +2% · +$144477** |
| roi 60–80 | N=26 · 46% · +4% · +$57591 | N=31 · 58% · +16% · +$372886 | N=18 · 56% · -32% · -$503284 | N=8 · 50% · -35% · -$236750 | **N=83 · 53% · -5% · -$309557** |
| roi<40 | N=33 · 33% · -8% · -$117270 | N=50 · 50% · -11% · -$388837 | N=25 · 56% · +8% · +$136080 | N=8 · 63% · +50% · +$632197 | **N=116 · 47% · +3% · +$262170** |
| roi≥80 | N=4 · 50% · +16% · +$11404 | N=21 · 62% · -7% · -$99493 | N=8 · 63% · +11% · +$36852 | — | **N=33 · 61% · -3% · -$51237** |
| — | N=2 · 0% · -44% · -$15763 | N=2 · 50% · -4% · -$1526 | — | — | **N=4 · 25% · -24% · -$17289** |

### v8_contribTier
| Bucket | 04-18 | 04-19 | 04-20 | 04-21 | TOTAL |
|---|---|---|---|---|---|
| LEAN | — | — | N=22 · 45% · -31% · -$624815 | N=3 · 33% · +30% · +$122279 | **N=25 · 44% · -21% · -$502536** |
| MUTE | — | — | N=6 · 67% · -1% · -$6587 | N=7 · 43% · +22% · +$216021 | **N=13 · 54% · +14% · +$209434** |
| STANDARD | — | — | N=12 · 58% · +13% · +$74364 | N=1 · 100% · +42% · +$29272 | **N=13 · 62% · +16% · +$103636** |
| STRONG | — | — | N=9 · 44% · +7% · +$27101 | N=8 · 50% · -4% · -$22358 | **N=17 · 47% · +0% · +$4743** |
| — | N=77 · 43% · -4% · -$211809 | N=123 · 56% · +0% · +$6766 | N=22 · 64% · +12% · +$418330 | — | **N=222 · 52% · +1% · +$213287** |

### v8_stars
| Bucket | 04-18 | 04-19 | 04-20 | 04-21 | TOTAL |
|---|---|---|---|---|---|
| ★ 2–2.5 | N=40 · 38% · +2% · +$55953 | N=58 · 52% · +3% · +$136354 | N=34 · 59% · -16% · -$457088 | N=7 · 57% · +11% · +$82943 | **N=139 · 50% · -2% · -$181838** |
| ★ 3–3.5 | N=15 · 73% · +21% · +$131006 | N=33 · 64% · -1% · -$40675 | N=27 · 48% · +2% · +$72150 | N=4 · 75% · -11% · -$33345 | **N=79 · 61% · +2% · +$129136** |
| ★<2 | N=11 · 36% · +8% · +$42397 | N=7 · 43% · -20% · -$17497 | N=1 · 100% · +48% · +$7805 | N=4 · 25% · +40% · +$284629 | **N=23 · 39% · +24% · +$317334** |
| ★≥4 | N=11 · 27% · -21% · -$441165 | N=25 · 60% · -4% · -$71416 | N=9 · 56% · +37% · +$265526 | N=4 · 25% · +3% · +$10987 | **N=49 · 49% · -5% · -$236068** |

---
*Auto-generated by `scripts/sharpVaultV8Analysis.js`. Source: `sharp_action_positions` collection (GRADED subset). Complements `V8_DAILY_PNL.md` (game-level) by analyzing individual wallet bets.*
