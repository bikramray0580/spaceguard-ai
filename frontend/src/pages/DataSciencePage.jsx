import {
  Activity,
  Database,
  Radar,
  ShieldAlert,
  Target,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { mockThreats } from '../data/mockMissionData'
import '../styles/dataScience.css'

const OBJECT_COUNT = 142

// Count threats by severity.
const threatCounts = {
  CRITICAL: mockThreats.filter(
    (item) => item.level === 'CRITICAL',
  ).length,
  HIGH: mockThreats.filter(
    (item) => item.level === 'HIGH',
  ).length,
  MODERATE: mockThreats.filter(
    (item) => item.level === 'MODERATE',
  ).length,
  LOW: mockThreats.filter(
    (item) => item.level === 'LOW',
  ).length,
}

// Most objects are outside the active threat list.
const normalCount = Math.max(
  0,
  OBJECT_COUNT -
    threatCounts.CRITICAL -
    threatCounts.HIGH -
    threatCounts.MODERATE -
    threatCounts.LOW,
)

const elevatedCount =
  threatCounts.CRITICAL + threatCounts.HIGH

const sortedThreats = [...mockThreats].sort(
  (a, b) =>
    Number.parseFloat(a.distance) -
    Number.parseFloat(b.distance),
)

export default function DataSciencePage() {
  const closestThreat = sortedThreats[0]

  if (!closestThreat) {
    return (
      <section className="data-science-page">
        <div className="ds-empty-state">
          <span className="eyebrow">MISSION INTELLIGENCE</span>
          <h1>Data Science</h1>
          <p>No conjunction data is currently available.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="data-science-page">
      {/* Page header */}
      <header className="ds-header">
        <div>
          <span className="eyebrow">MISSION INTELLIGENCE</span>
          <h1>Data Science</h1>
          <p>
            Turn orbital data into clear, actionable mission insights.
          </p>
        </div>

        <div className="ds-status">
          <span className="status-dot" />
          ANALYTICS ENGINE ONLINE
        </div>
      </header>

      {/* Mission KPIs */}
      <section className="ds-kpis">
        <KpiCard
          icon={<Database size={17} />}
          label="OBJECTS MONITORED"
          value={OBJECT_COUNT}
          detail="tracked in current dataset"
        />

        <KpiCard
          icon={<Radar size={17} />}
          label="CLOSE APPROACHES"
          value={mockThreats.length}
          detail="potential conjunction events"
        />

        <KpiCard
          icon={<ShieldAlert size={17} />}
          label="ELEVATED ATTENTION"
          value={elevatedCount}
          detail="high or critical priority"
          tone="warning"
        />

        <KpiCard
          icon={<Activity size={17} />}
          label="DATA STATUS"
          value="LIVE"
          detail="analytics pipeline active"
          tone="live"
        />
      </section>

      {/* Primary analytics */}
      <section className="ds-main-grid">
        {/* Risk distribution */}
        <div className="ds-panel risk-panel">
          <PanelHeader
            eyebrow="RISK DISTRIBUTION"
            title="Monitoring posture"
            description="How the monitored object population is distributed by risk."
          />

          <div className="risk-content">
            <div className="risk-ring">
              <div className="risk-ring-inner">
                <strong>{OBJECT_COUNT}</strong>
                <span>OBJECTS</span>
              </div>
            </div>

            <div className="risk-breakdown">
              <RiskRow
                label="Critical"
                count={threatCounts.CRITICAL}
                tone="critical"
                total={OBJECT_COUNT}
              />

              <RiskRow
                label="High"
                count={threatCounts.HIGH}
                tone="high"
                total={OBJECT_COUNT}
              />

              <RiskRow
                label="Moderate"
                count={threatCounts.MODERATE}
                tone="moderate"
                total={OBJECT_COUNT}
              />

              <RiskRow
                label="Low"
                count={threatCounts.LOW}
                tone="low"
                total={OBJECT_COUNT}
              />

              <RiskRow
                label="Normal"
                count={normalCount}
                tone="normal"
                total={OBJECT_COUNT}
              />
            </div>
          </div>

          <div className="risk-message">
            <div>
              <strong>{normalCount} of {OBJECT_COUNT} objects</strong>
              <span>remain within normal monitoring levels.</span>
            </div>

            <div>
              <strong className="warning-text">
                {elevatedCount} require attention
              </strong>
              <span>because they are high or critical priority.</span>
            </div>
          </div>
        </div>

        {/* Risk concentration */}
        <div className="ds-panel orbital-panel">
          <PanelHeader
            eyebrow="RISK CONCENTRATION"
            title="Where attention is focused"
            description="A simplified view of current conjunction pressure."
          />

          <div className="orbital-map">
            <div className="map-grid" />

            <div className="map-axis y-axis">HIGH RISK</div>
            <div className="map-axis x-axis">LOWER ACTIVITY</div>

            {/* Plot threat points */}
            {mockThreats.map((threat, index) => (
              <div
                key={threat.id}
                className={`map-point ${threat.level.toLowerCase()}`}
                style={{
                  '--point-x': `${16 + ((index * 21) % 72)}%`,
                  '--point-y': `${18 + ((index * 27) % 62)}%`,
                }}
                title={`${threat.objectA} × ${threat.objectB}`}
              />
            ))}

            <div className="map-focus">
              <div className="focus-heading">
                <Target size={15} />
                <div>
                  <span>HIGHEST PRIORITY</span>
                  <strong>
                    {closestThreat.objectA} × {closestThreat.objectB}
                  </strong>
                </div>
              </div>

              <div className="focus-values">
                <div>
                  <small>MISS DISTANCE</small>
                  <strong>{closestThreat.distance}</strong>
                </div>

                <div>
                  <small>REL. VELOCITY</small>
                  <strong>{closestThreat.velocity}</strong>
                </div>

                <div>
                  <small>TCA</small>
                  <strong>
                    {closestThreat.window.replace('TCA ', '')}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closest approaches */}
        <div className="ds-panel approaches-panel">
          <PanelHeader
            eyebrow="CONJUNCTION ANALYSIS"
            title="Closest approaches"
            description="Current encounters ranked by predicted miss distance."
          />

          <div className="approach-list">
            {sortedThreats.map((threat, index) => (
              <div className="approach-row" key={threat.id}>
                <div className="approach-rank">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="approach-info">
                  <div className="approach-top">
                    <strong>
                      {threat.objectA}
                      <span> × </span>
                      {threat.objectB}
                    </strong>

                    <b className={threat.level.toLowerCase()}>
                      {threat.level}
                    </b>
                  </div>

                  <div className="approach-bar">
                    <span
                      className={threat.level.toLowerCase()}
                      style={{
                        width: `${Math.max(
                          18,
                          100 -
                            Number.parseFloat(threat.distance) * 4,
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="approach-bottom">
                    <span>{threat.window}</span>
                    <span>Relative velocity: {threat.velocity}</span>
                  </div>
                </div>

                <div className="approach-distance">
                  {threat.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary analytics */}
      <section className="ds-bottom-grid">
        {/* Scatter view */}
        <div className="ds-panel scatter-panel">
          <PanelHeader
            eyebrow="VELOCITY ANALYSIS"
            title="Velocity vs miss distance"
            description="Higher velocity and shorter distance indicate greater monitoring pressure."
          />

          <div className="scatter-chart">
            <span className="chart-y-label">RELATIVE VELOCITY</span>
            <span className="chart-x-label">MISS DISTANCE</span>
            <div className="chart-grid" />

            {mockThreats.map((threat, index) => (
              <span
                key={threat.id}
                className={`scatter-point ${threat.level.toLowerCase()}`}
                style={{
                  left: `${12 + index * 21}%`,
                  bottom: `${18 + (index % 4) * 16}%`,
                }}
                title={`${threat.objectA} × ${threat.objectB}`}
              />
            ))}

            <div className="scatter-focus">
              <span>HIGHEST PRIORITY</span>
              <strong>
                {closestThreat.objectA} × {closestThreat.objectB}
              </strong>
              <small>
                {closestThreat.distance} miss distance • {closestThreat.velocity}
              </small>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="ds-panel insights-panel">
          <PanelHeader
            eyebrow="DATA INSIGHTS"
            title="What the data tells us"
            description="Plain-language interpretation of the current dataset."
          />

          <div className="insight-grid">
            <Insight
              number="01"
              icon={<Target size={16} />}
              title="Closest approach"
              text={`${closestThreat.objectA} and ${closestThreat.objectB} have the smallest predicted miss distance at ${closestThreat.distance}.`}
            />

            <Insight
              number="02"
              icon={<Zap size={16} />}
              title="Fastest encounter"
              text={`The highest-priority encounter has a relative velocity of ${closestThreat.velocity}.`}
            />

            <Insight
              number="03"
              icon={<ShieldAlert size={16} />}
              title="Attention required"
              text={`${elevatedCount} detected pair${elevatedCount !== 1 ? 's' : ''} currently sit above normal risk thresholds.`}
            />

            <Insight
              number="04"
              icon={<TrendingUp size={16} />}
              title="Overall picture"
              text={`${normalCount} of ${OBJECT_COUNT} monitored objects remain within normal operating levels.`}
            />
          </div>
        </div>
      </section>
    </section>
  )
}

/* Reusable KPI card */
function KpiCard({ icon, label, value, detail, tone = '' }) {
  return (
    <article className={`ds-kpi ${tone}`}>
      <div className="ds-kpi-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  )
}

/* Panel heading */
function PanelHeader({ eyebrow, title, description }) {
  return (
    <div className="ds-panel-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}

/* Risk distribution row */
function RiskRow({ label, count, tone, total }) {
  const percentage =
    total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'

  return (
    <div className={`risk-row ${tone}`}>
      <div className="risk-row-label">
        <span className={`risk-dot ${tone}`} />
        <span>{label}</span>
      </div>

      <strong>{count}</strong>
      <small>{percentage}%</small>
    </div>
  )
}

/* Insight card */
function Insight({ number, icon, title, text }) {
  return (
    <article className="insight-card">
      <div className="insight-top">
        <span className="insight-icon">{icon}</span>
        <b>{number}</b>
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}
