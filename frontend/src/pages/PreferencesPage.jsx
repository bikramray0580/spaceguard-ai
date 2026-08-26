import {
  Bell,
  Check,
  CircleUserRound,
  Gauge,
  Grid3X3,
  Monitor,
  Radio,
  RotateCcw,
  ShieldCheck,
  Volume2,
} from 'lucide-react'
import { useState } from 'react'
import '../styles/preferences.css'

export default function PreferencesPage() {
  const [settings, setSettings] = useState({
    compactMode: true,
    orbitalVisualization: true,
    animations: true,
    gridOverlay: true,
    criticalAlerts: true,
    highAlerts: true,
    systemAlerts: true,
    soundAlerts: false,
  })

  const toggleSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <section className="preferences-page">

      {/* Page header */}
      <header className="preferences-header">
        <div>
          <span className="eyebrow">
            SYSTEM CONFIGURATION
          </span>

          <h1>Mission Preferences</h1>

          <p>
            Configure how SpaceGuard presents data,
            alerts, and monitoring information.
          </p>
        </div>

        <div className="preferences-status">
          <span className="status-dot" />
          SYSTEM NOMINAL
        </div>
      </header>

      {/* Main settings */}
      {/* Current workstation profile */}
<section className="workstation-profile">

<div className="workstation-header">
  <div>
    <span className="eyebrow">
      WORKSTATION PROFILE
    </span>

    <h2>Current configuration</h2>

    <p>
      Active preferences applied to this mission workstation.
    </p>
  </div>

  <span className="configuration-state">
    <span />
    CONFIGURATION OK
  </span>
</div>

<div className="configuration-columns">

  {/* Display summary */}
  <div className="configuration-group">

    <div className="configuration-group-title">
      <Monitor size={14} />
      DISPLAY
    </div>

    <div className="configuration-item">
      <span>Interface density</span>
      <strong>
        {settings.compactMode ? 'COMPACT' : 'STANDARD'}
      </strong>
    </div>

    <div className="configuration-item">
      <span>Orbital view</span>
      <strong>
        {settings.orbitalVisualization
          ? 'ENABLED'
          : 'DISABLED'}
      </strong>
    </div>

    <div className="configuration-item">
      <span>Animations</span>
      <strong>
        {settings.animations
          ? 'ENABLED'
          : 'DISABLED'}
      </strong>
    </div>

    <div className="configuration-item">
      <span>Grid overlay</span>
      <strong>
        {settings.gridOverlay
          ? 'ENABLED'
          : 'DISABLED'}
      </strong>
    </div>

  </div>

  {/* Monitoring summary */}
  <div className="configuration-group">

    <div className="configuration-group-title">
      <Radio size={14} />
      MONITORING
    </div>

    <div className="configuration-item">
      <span>Risk filter</span>
      <strong>ALL LEVELS</strong>
    </div>

    <div className="configuration-item">
      <span>Refresh interval</span>
      <strong>30 SEC</strong>
    </div>

    <div className="configuration-item">
      <span>Conjunction threshold</span>
      <strong>10 KM</strong>
    </div>

    <div className="configuration-item">
      <span>Default workspace</span>
      <strong>MISSION DASHBOARD</strong>
    </div>

  </div>

  {/* Alert summary */}
  <div className="configuration-group">

    <div className="configuration-group-title">
      <Bell size={14} />
      ALERTS
    </div>

    <div className="configuration-item">
      <span>Critical alerts</span>
      <strong className="status-enabled">
        {settings.criticalAlerts ? 'ON' : 'OFF'}
      </strong>
    </div>

    <div className="configuration-item">
      <span>High-risk alerts</span>
      <strong className="status-enabled">
        {settings.highAlerts ? 'ON' : 'OFF'}
      </strong>
    </div>

    <div className="configuration-item">
      <span>System alerts</span>
      <strong className="status-enabled">
        {settings.systemAlerts ? 'ON' : 'OFF'}
      </strong>
    </div>

    <div className="configuration-item">
      <span>Sound notifications</span>
      <strong>
        {settings.soundAlerts ? 'ON' : 'OFF'}
      </strong>
    </div>

  </div>

</div>

<div className="workstation-footer">

  <span>
    LAST CONFIGURATION CHANGE
  </span>

  <strong>
    CURRENT SESSION
  </strong>

  <span>
    SESSION
  </span>

  <strong>
    OPERATOR-01
  </strong>

</div>

</section>


      <div className="preferences-grid">

        {/* Display */}
        <section className="preferences-panel display-panel">

          <PanelHeader
            icon={<Monitor size={16} />}
            eyebrow="01 / DISPLAY"
            title="Display configuration"
            description="Control how mission information appears on your workstation."
          />

          <div className="settings-list">

            <ToggleSetting
              icon={<Gauge size={15} />}
              label="Interface density"
              description="Use compact spacing across monitoring panels."
              value={settings.compactMode}
              onChange={() =>
                toggleSetting('compactMode')
              }
            />

            <ToggleSetting
              icon={<Radio size={15} />}
              label="Orbital visualization"
              description="Show live orbital objects in the mission viewport."
              value={settings.orbitalVisualization}
              onChange={() =>
                toggleSetting(
                  'orbitalVisualization',
                )
              }
            />

            <ToggleSetting
              icon={<RotateCcw size={15} />}
              label="Animation intensity"
              description="Allow motion effects and simulation transitions."
              value={settings.animations}
              onChange={() =>
                toggleSetting('animations')
              }
            />

            <ToggleSetting
              icon={<Grid3X3 size={15} />}
              label="Grid overlay"
              description="Display spatial grid references in visualizations."
              value={settings.gridOverlay}
              onChange={() =>
                toggleSetting('gridOverlay')
              }
            />

          </div>

        </section>

        {/* Alert behavior */}
        <section className="preferences-panel">

          <PanelHeader
            icon={<Bell size={16} />}
            eyebrow="02 / ALERTS"
            title="Alert behavior"
            description="Choose which events require operator attention."
          />

          <div className="settings-list">

            <ToggleSetting
              icon={<ShieldCheck size={15} />}
              label="Critical alerts"
              description="Immediate notifications for critical conjunctions."
              value={settings.criticalAlerts}
              onChange={() =>
                toggleSetting('criticalAlerts')
              }
              tone="critical"
            />

            <ToggleSetting
              icon={<Bell size={15} />}
              label="High-risk alerts"
              description="Notifications for elevated conjunction risk."
              value={settings.highAlerts}
              onChange={() =>
                toggleSetting('highAlerts')
              }
              tone="high"
            />

            <ToggleSetting
              icon={<Radio size={15} />}
              label="System alerts"
              description="Operational and tracking system notifications."
              value={settings.systemAlerts}
              onChange={() =>
                toggleSetting('systemAlerts')
              }
            />

            <ToggleSetting
              icon={<Volume2 size={15} />}
              label="Sound notifications"
              description="Play an audio cue when an alert is received."
              value={settings.soundAlerts}
              onChange={() =>
                toggleSetting('soundAlerts')
              }
            />

          </div>

        </section>

        {/* Monitoring */}
        <section className="preferences-panel">

          <PanelHeader
            icon={<Radio size={16} />}
            eyebrow="03 / MONITORING"
            title="Monitoring configuration"
            description="Define the default parameters used by the workstation."
          />

          <div className="select-settings">

            <SelectSetting
              label="Default risk filter"
              value="ALL LEVELS"
              options={[
                'ALL LEVELS',
                'CRITICAL',
                'HIGH',
                'MODERATE',
              ]}
            />

            <SelectSetting
              label="Refresh interval"
              value="30 SECONDS"
              options={[
                '10 SECONDS',
                '30 SECONDS',
                '60 SECONDS',
              ]}
            />

            <SelectSetting
              label="Conjunction threshold"
              value="10 KM"
              options={[
                '5 KM',
                '10 KM',
                '25 KM',
                '50 KM',
              ]}
            />

            <SelectSetting
              label="Default workspace"
              value="MISSION DASHBOARD"
              options={[
                'MISSION DASHBOARD',
                'TRACK OBJECTS',
                'RISK ASSESSMENT',
                'DATA SCIENCE',
              ]}
            />

          </div>

        </section>

        {/* Operator */}
        <section className="preferences-panel operator-panel">

          <PanelHeader
            icon={<CircleUserRound size={16} />}
            eyebrow="04 / OPERATOR"
            title="Operator profile"
            description="Current workstation identity and access information."
          />

          <div className="operator-card">

            <div className="operator-avatar">
              <CircleUserRound size={24} />
            </div>

            <div className="operator-identity">
              <span>OPERATOR ID</span>
              <strong>OPERATOR-01</strong>
              <small>MISSION CONTROL</small>
            </div>

            <span className="operator-active">
              ACTIVE
            </span>

          </div>

          <div className="operator-meta">

            <div>
              <span>ROLE</span>
              <strong>MISSION ANALYST</strong>
            </div>

            <div>
              <span>CLEARANCE</span>
              <strong>LEVEL 03</strong>
            </div>

            <div>
              <span>SESSION</span>
              <strong>ACTIVE</strong>
            </div>

            <div>
              <span>ENVIRONMENT</span>
              <strong>PROTOTYPE</strong>
            </div>

          </div>

        </section>

      </div>

      {/* System footer */}
      <section className="preferences-system">

        <div className="system-icon">
          <Check size={16} />
        </div>

        <div>
          <span className="eyebrow">
            SYSTEM CONFIGURATION
          </span>

          <strong>
            SpaceGuard prototype environment
          </strong>

          <p>
            Preferences currently apply to this
            workstation session. Persistent storage
            will be connected during backend integration.
          </p>
        </div>

        <span className="system-state">
          CONFIGURATION READY
        </span>

      </section>

    </section>
  )
}

/* Section heading */
function PanelHeader({
  icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="preferences-panel-header">

      <div className="preferences-title-icon">
        {icon}
      </div>

      <div>
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>

    </div>
  )
}

/* Toggle control */
function ToggleSetting({
  icon,
  label,
  description,
  value,
  onChange,
  tone = '',
}) {
  return (
    <div className="setting-row">

      <div className={`setting-icon ${tone}`}>
        {icon}
      </div>

      <div className="setting-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`setting-toggle ${
          value ? 'active' : ''
        }`}
        onClick={onChange}
        aria-label={`Toggle ${label}`}
        aria-pressed={value}
      >
        <span />
      </button>

    </div>
  )
}

/* Select control */
function SelectSetting({
  label,
  value,
  options,
}) {
  return (
    <label className="select-setting">

      <span>{label}</span>

      <select defaultValue={value}>
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </label>
  )
}