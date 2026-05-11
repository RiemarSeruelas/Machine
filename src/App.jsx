import { useEffect, useMemo, useState } from "react";
import "./App.css";
import machineImage from "./assets/machine.png";

const API_URL = "http://localhost:5000/data";

const MACHINE_POINTS = [
  { id: 1, name: "Infeed Guard", area: "Infeed Section", guardOpen: false, interlockOk: true, guardTag: "guard_01_open", interlockTag: "interlock_01_ok" },
  { id: 2, name: "Infeed Conveyor", area: "Infeed Section", guardOpen: false, interlockOk: true, guardTag: "guard_02_open", interlockTag: "interlock_02_ok" },
  { id: 3, name: "Film Roll Area", area: "Wrapping Section", guardOpen: false, interlockOk: true, guardTag: "guard_03_open", interlockTag: "interlock_03_ok" },
  { id: 4, name: "Lower Guard", area: "Wrapping Section", guardOpen: false, interlockOk: true, guardTag: "guard_04_open", interlockTag: "interlock_04_ok" },
  { id: 5, name: "Main Guard 1", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "guard_05_open", interlockTag: "interlock_05_ok" },
  { id: 6, name: "Main Guard 2", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "guard_06_open", interlockTag: "interlock_06_ok" },
  { id: 7, name: "Main Guard 3", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "guard_07_open", interlockTag: "interlock_07_ok" },
  { id: 8, name: "Main Guard 4", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "guard_08_open", interlockTag: "interlock_08_ok" },
  { id: 9, name: "Main Guard 5", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "guard_09_open", interlockTag: "interlock_09_ok" },
  { id: 10, name: "Main Guard 6", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "guard_10_open", interlockTag: "interlock_10_ok" },
  { id: 11, name: "HMI Panel", area: "Operator Side", guardOpen: false, interlockOk: true, guardTag: "guard_11_open", interlockTag: "interlock_11_ok" },
  { id: 12, name: "Upper Hopper", area: "Top Loader", guardOpen: false, interlockOk: true, guardTag: "guard_12_open", interlockTag: "interlock_12_ok" },
  { id: 13, name: "Product Bucket", area: "Top Loader", guardOpen: false, interlockOk: true, guardTag: "guard_13_open", interlockTag: "interlock_13_ok" },
  { id: 14, name: "Drop Chute", area: "Top Loader", guardOpen: false, interlockOk: true, guardTag: "guard_14_open", interlockTag: "interlock_14_ok" },
  { id: 15, name: "Transfer Arm", area: "Transfer Section", guardOpen: false, interlockOk: true, guardTag: "guard_15_open", interlockTag: "interlock_15_ok" },
  { id: 16, name: "Center Door 1", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_16_open", interlockTag: "interlock_16_ok" },
  { id: 17, name: "Center Door 2", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_17_open", interlockTag: "interlock_17_ok" },
  { id: 18, name: "Center Door 3", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_18_open", interlockTag: "interlock_18_ok" },
  { id: 19, name: "Center Door 4", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_19_open", interlockTag: "interlock_19_ok" },
  { id: 20, name: "Center Door 5", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_20_open", interlockTag: "interlock_20_ok" },
  { id: 21, name: "Center Door 6", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_21_open", interlockTag: "interlock_21_ok" },
  { id: 22, name: "Center Door 7", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_22_open", interlockTag: "interlock_22_ok" },
  { id: 23, name: "Center Door 8", area: "Center Guarding", guardOpen: false, interlockOk: true, guardTag: "guard_23_open", interlockTag: "interlock_23_ok" },
  { id: 24, name: "Outfeed Guard", area: "Outfeed Section", guardOpen: false, interlockOk: true, guardTag: "guard_24_open", interlockTag: "interlock_24_ok" },
  { id: 25, name: "Outfeed Conveyor", area: "Outfeed Section", guardOpen: false, interlockOk: true, guardTag: "guard_25_open", interlockTag: "interlock_25_ok" },
  { id: 26, name: "Lower Motor 1", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_26_open", interlockTag: "interlock_26_ok" },
  { id: 27, name: "Lower Motor 2", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_27_open", interlockTag: "interlock_27_ok" },
  { id: 28, name: "Lower Motor 3", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_28_open", interlockTag: "interlock_28_ok" },
  { id: 29, name: "Lower Motor 4", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_29_open", interlockTag: "interlock_29_ok" },
  { id: 30, name: "Lower Motor 5", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_30_open", interlockTag: "interlock_30_ok" },
  { id: 31, name: "Lower Motor 6", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_31_open", interlockTag: "interlock_31_ok" },
  { id: 32, name: "Lower Motor 7", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_32_open", interlockTag: "interlock_32_ok" },
  { id: 33, name: "Lower Motor 8", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_33_open", interlockTag: "interlock_33_ok" },
  { id: 34, name: "Lower Motor 9", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_34_open", interlockTag: "interlock_34_ok" },
  { id: 35, name: "Outfeed Drive", area: "Drive Section", guardOpen: false, interlockOk: true, guardTag: "guard_35_open", interlockTag: "interlock_35_ok" },
  { id: 36, name: "Emergency Stop 1", area: "Safety Circuit", guardOpen: false, interlockOk: true, guardTag: "estop_36_active", interlockTag: "safety_36_ok" },
  { id: 37, name: "Emergency Stop 2", area: "Safety Circuit", guardOpen: false, interlockOk: true, guardTag: "estop_37_active", interlockTag: "safety_37_ok" },
  { id: 38, name: "Emergency Stop 3", area: "Safety Circuit", guardOpen: false, interlockOk: true, guardTag: "estop_38_active", interlockTag: "safety_38_ok" },
  { id: 39, name: "Emergency Stop 4", area: "Safety Circuit", guardOpen: false, interlockOk: true, guardTag: "estop_39_active", interlockTag: "safety_39_ok" },
];

const MACHINE_ZONES = [
  {
    id: "zone-infeed",
    name: "Infeed",
    area: "Infeed Section",
    points: "8,62 20,52 31,58 31,88 8,88",
    labelX: "18%",
    labelY: "77%",
    zoomScale: 2.45,
    tagIds: [1, 2, 26, 36],
  },
  {
    id: "zone-wrapper",
    name: "Wrapping",
    area: "Wrapping Section",
    points: "28,56 55,42 66,48 64,69 32,84",
    labelX: "46%",
    labelY: "66%",
    zoomScale: 2.1,
    tagIds: [3, 4, 5, 6, 7, 27, 28, 29],
  },
  {
    id: "zone-main",
    name: "Main Machine",
    area: "Main Machine",
    points: "55,43 78,32 88,39 87,58 62,69 55,62",
    labelX: "70%",
    labelY: "53%",
    zoomScale: 2,
    tagIds: [8, 9, 10, 11, 30, 31, 37],
  },
  {
    id: "zone-loader",
    name: "Top Loader",
    area: "Top Loader",
    points: "57,9 69,5 78,17 74,36 59,38 53,25",
    labelX: "64%",
    labelY: "24%",
    zoomScale: 2.4,
    tagIds: [12, 13, 14, 15, 38],
  },
  {
    id: "zone-center",
    name: "Center Guarding",
    area: "Center Guarding",
    points: "72,37 94,29 100,38 99,56 76,62",
    labelX: "86%",
    labelY: "47%",
    zoomScale: 2.15,
    tagIds: [16, 17, 18, 19, 20, 21, 22, 23, 32, 33, 34],
  },
  {
    id: "zone-outfeed",
    name: "Outfeed",
    area: "Outfeed Section",
    points: "90,47 100,41 100,61 92,69 87,60",
    labelX: "94%",
    labelY: "59%",
    zoomScale: 2.5,
    tagIds: [24, 25, 35, 39],
  },
];

export default function App() {
  const [machineData, setMachineData] = useState(null);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  async function fetchMachineData() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      setMachineData(data);
      setApiError("");
      setLastUpdated(new Date());
    } catch (err) {
      setApiError(err.message);
    }
  }

  useEffect(() => {
    fetchMachineData();
    const interval = setInterval(fetchMachineData, 1000);
    return () => clearInterval(interval);
  }, []);

  const status = machineData?.status || "WAITING";
  const payload = machineData?.data || {};

  const machineRows = useMemo(() => {
    return MACHINE_POINTS.map((point) => {
      const liveGuardValue = payload?.[point.guardTag];
      const liveInterlockValue = payload?.[point.interlockTag];

      return {
        ...point,
        guardOpen:
          liveGuardValue === undefined ? point.guardOpen : toBool(liveGuardValue),
        interlockOk:
          liveInterlockValue === undefined
            ? point.interlockOk
            : toBool(liveInterlockValue),
      };
    });
  }, [payload]);

  const zoneRows = useMemo(() => {
    return MACHINE_ZONES.map((zone) => {
      const zoneTags = machineRows.filter((tag) => zone.tagIds.includes(tag.id));
      const zoneState = getZoneState(zoneTags);

      return {
        ...zone,
        tags: zoneTags,
        state: zoneState,
      };
    });
  }, [machineRows]);

  const isRunning = status === "RUNNING";
  const isStopped = status === "STOPPED";
  const isWaiting =
    status === "WAITING" ||
    status === "UNKNOWN" ||
    status === "WAITING FOR DATA";

  const activeZoomZone = selectedPoint?.type === "zone" ? selectedPoint : null;
  const zoomScale = activeZoomZone?.zoomScale || 1;
  const zoomX = activeZoomZone ? parsePercent(activeZoomZone.labelX) : 50;
  const zoomY = activeZoomZone ? parsePercent(activeZoomZone.labelY) : 50;

  const machineCanvasStyle = activeZoomZone
    ? {
        "--zoom-scale": zoomScale,
        "--zoom-pan-x": `${(50 - zoomX) * zoomScale}%`,
        "--zoom-pan-y": `${(50 - zoomY) * zoomScale}%`,
      }
    : {
        "--zoom-scale": 1,
        "--zoom-pan-x": "0%",
        "--zoom-pan-y": "0%",
      };

  function openPointDetails(machine, safety) {
    setSelectedPoint({
      type: "point",
      ...machine,
      state: safety,
    });
    setShowDetailsModal(true);
  }

  function selectZone(zone, openModal = false) {
    setSelectedPoint({
      type: "zone",
      ...zone,
    });

    if (openModal) {
      setShowDetailsModal(true);
    }
  }

  function resetView() {
    setSelectedPoint(null);
    setShowDetailsModal(false);
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <div className="desktop-topbar">
          <div className="topbar-left">
            <div className="brand-card">
              <div className="brand-icon">⚙️</div>
              <div>
                <div className="brand-title">MACHINE DASHBOARD</div>
                <div className="brand-subtitle">HighByte MQTT Monitoring System</div>
              </div>
            </div>

            <button className="top-nav-btn active">Overview</button>
            <button className="top-nav-btn">Analytics</button>
            <button className="top-nav-btn">History</button>
            <button className="top-nav-btn">Maintenance</button>
          </div>

          <div className="topbar-right">
            <div className={`top-state-inline ${getStatusClass(status)}`}>
              <div className="top-state-dot" />
              <span>{status}</span>
            </div>

            <button className="top-nav-btn">Start</button>

            <button
              className="top-nav-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☀ Light" : "🌙 Dark"}
            </button>

            <div className="admin-chip">Admin</div>
          </div>
        </div>
      </header>

      <section className="summary-strip">
        <div className="summary-left">
          <div className={`summary-badge machine-badge ${getStatusClass(status)}`}>
            {isRunning ? "✓" : isStopped ? "!" : "•"}
          </div>

          <div>
            <div className="summary-title">Machine Command Center</div>
            <div className="summary-subtitle">
              Real-time stop/go status from HighByte MQTT
            </div>
          </div>

          <div
            className={`live-badge ${
              machineData?.mqttConnected ? "online" : "offline"
            }`}
          >
            {machineData?.mqttConnected ? "MQTT LIVE" : "MQTT OFFLINE"}
          </div>
        </div>

        <div className="summary-stats">
          <SummaryStat value={machineRows.length} label="POINTS" />
          <SummaryStat value={zoneRows.length} label="ZONES" variant="green" />
          <SummaryStat value={isStopped ? "STOP" : "-"} label="STOPPED" variant="red" />
          <SummaryStat value={status} label="STATE" variant="amber" />
        </div>
      </section>

      <main className="workspace machine-workspace">
        <aside className="panel left-panel machine-left-panel">
          <div className="side-list-header">
            <div>
              <div className="panel-title">Machine Points</div>
              <div className="side-list-subtitle">Click a row to inspect</div>
            </div>

            <div className="side-count">{machineRows.length}</div>
          </div>

          <div className="machine-table compact-machine-table">
            <div className="machine-table-head compact-head">
              <span>No.</span>
              <span>Name</span>
              <span>Status</span>
            </div>

            {machineRows.map((machine) => {
              const safety = getSafetyState(machine);

              return (
                <button
                  className={`machine-row compact-row ${
                    selectedPoint?.type === "point" &&
                    selectedPoint?.id === machine.id
                      ? "active"
                      : ""
                  }`}
                  key={machine.id}
                  onClick={() => openPointDetails(machine, safety)}
                >
                  <div className="machine-number">{machine.id}</div>

                  <div className="machine-info">
                    <div className="machine-row-name">{machine.name}</div>
                  </div>

                  <span className={`machine-status-chip ${safety.className}`}>
                    {safety.label}
                  </span>
                </button>
              );
            })}
          </div>

          {apiError && (
            <div className="metric-card">
              <div className="metric-label">API Error</div>
              <div className="metric-value danger-text small-value">{apiError}</div>
            </div>
          )}
        </aside>

        <section className="panel center-panel machine-center-panel">
          <div className="table-card">
            <div className="machine-panel-header">
              <div>
                <div className="table-title">Machine Layout</div>
                <div className="machine-subtitle">
                  Click a machine section to zoom. Click the label again for details.
                </div>
              </div>

              <div className={`machine-state-pill ${getStatusClass(status)}`}>
                {isRunning ? "GO" : isStopped ? "STOP" : isWaiting ? "WAIT" : "WAIT"}
              </div>
            </div>

            <div className={`machine-map ${activeZoomZone ? "zoomed" : ""}`}>
              <div className="machine-map-grid" />

              <div className="machine-zoom-layer">
                <div className="machine-stage">
                  <div
                    className={`machine-canvas ${activeZoomZone ? "is-zoomed" : ""}`}
                    style={machineCanvasStyle}
                  >
                    <img
                      src={machineImage}
                      alt="Machine"
                      className="machine-img"
                      onLoad={() => console.log("✅ Machine image loaded")}
                      onError={() => console.log("❌ Machine image failed to load")}
                    />

                    <svg
                      className="machine-svg-overlay"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      {zoneRows.map((zone) => (
                        <polygon
                          key={zone.id}
                          points={zone.points}
                          className={`machine-svg-zone ${zone.state.className} ${
                            selectedPoint?.type === "zone" &&
                            selectedPoint?.id === zone.id
                              ? "active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectZone(zone, false);
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            selectZone(zone, true);
                          }}
                        />
                      ))}
                    </svg>

                    {zoneRows.map((zone) => (
                      <button
                        key={`${zone.id}-label`}
                        className={`machine-zone-label ${zone.state.className} ${
                          selectedPoint?.type === "zone" &&
                          selectedPoint?.id === zone.id
                            ? "active"
                            : ""
                        }`}
                        style={{
                          left: zone.labelX,
                          top: zone.labelY,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (
                            selectedPoint?.type === "zone" &&
                            selectedPoint?.id === zone.id
                          ) {
                            selectZone(zone, true);
                          } else {
                            selectZone(zone, false);
                          }
                        }}
                        title={`${zone.name} - ${zone.state.label}`}
                      >
                        {zone.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {activeZoomZone && (
                <button className="reset-zoom-btn" onClick={resetView}>
                  Reset View
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {showDetailsModal && selectedPoint && (
        <div
          className="details-modal-backdrop"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="details-modal-header">
              <div>
                <div className="details-modal-kicker">
                  {selectedPoint.type === "zone" ? "Machine Zone" : "Machine Point"}
                </div>
                <div className="details-modal-title">{selectedPoint.name}</div>
                <div className="details-modal-subtitle">{selectedPoint.area}</div>
              </div>

              <button
                className="details-modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>

            <div className={`details-status-banner ${selectedPoint.state.className}`}>
              {selectedPoint.state.label}
            </div>

            {selectedPoint.type === "point" ? (
              <div className="details-grid">
                <DetailItem label="Point No." value={selectedPoint.id} />
                <DetailItem label="Status" value={selectedPoint.state.label} />
                <DetailItem
                  label="Guard"
                  value={selectedPoint.guardOpen ? "OPEN" : "CLOSED"}
                />
                <DetailItem
                  label="Interlock"
                  value={selectedPoint.interlockOk ? "OK" : "FAULT"}
                />
                <DetailItem label="Guard Tag" value={selectedPoint.guardTag} wide />
                <DetailItem
                  label="Interlock Tag"
                  value={selectedPoint.interlockTag}
                  wide
                />
              </div>
            ) : (
              <>
                <div className="details-grid">
                  <DetailItem label="Zone" value={selectedPoint.name} />
                  <DetailItem label="Status" value={selectedPoint.state.label} />
                  <DetailItem label="Tags Inside" value={selectedPoint.tags.length} />
                  <DetailItem
                    label="Unsafe Count"
                    value={
                      selectedPoint.tags.filter(
                        (tag) => tag.guardOpen || !tag.interlockOk
                      ).length
                    }
                  />
                </div>

                <div className="zone-tag-list">
                  <div className="zone-tag-list-title">Tags inside this zone</div>

                  {selectedPoint.tags.map((tag) => {
                    const tagState = getSafetyState(tag);

                    return (
                      <div className="zone-tag-row" key={tag.id}>
                        <span className="zone-tag-no">{tag.id}</span>
                        <span className="zone-tag-name">{tag.name}</span>
                        <span className={`zone-tag-status ${tagState.className}`}>
                          {tagState.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryStat({ value, label, variant }) {
  return (
    <div className={`summary-stat ${variant || ""}`}>
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
    </div>
  );
}

function Metric({ label, value, suffix, state, small }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div
        className={[
          "metric-value",
          small ? "small-value" : "",
          state === "safe" ? "safe-text" : "",
          state === "danger" ? "danger-text" : "",
        ].join(" ")}
      >
        {value} {suffix && value !== "-" ? <small>{suffix}</small> : null}
      </div>
    </div>
  );
}

function DetailItem({ label, value, wide }) {
  return (
    <div className={`detail-item ${wide ? "wide" : ""}`}>
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value}</div>
    </div>
  );
}

function getStatusClass(status) {
  if (status === "RUNNING") return "running";
  if (status === "STOPPED") return "stopped";
  return "waiting";
}

function getSafetyState(point) {
  if (point.guardOpen) {
    return {
      label: "GUARD OPEN",
      className: "danger",
    };
  }

  if (!point.interlockOk) {
    return {
      label: "INTERLOCK FAULT",
      className: "warning",
    };
  }

  return {
    label: "SAFE",
    className: "safe",
  };
}

function getZoneState(tags) {
  const hasGuardOpen = tags.some((tag) => tag.guardOpen);
  const hasInterlockFault = tags.some((tag) => !tag.interlockOk);

  if (hasGuardOpen) {
    return {
      label: "GUARD OPEN",
      className: "danger",
    };
  }

  if (hasInterlockFault) {
    return {
      label: "INTERLOCK FAULT",
      className: "warning",
    };
  }

  return {
    label: "SAFE",
    className: "safe",
  };
}

function toBool(value) {
  if (value === true || value === 1 || value === "1") return true;
  if (value === false || value === 0 || value === "0") return false;

  const text = String(value).trim().toLowerCase();

  if (["true", "yes", "on", "open", "running", "ok"].includes(text)) {
    return true;
  }

  if (["false", "no", "off", "closed", "stopped", "fault"].includes(text)) {
    return false;
  }

  return Boolean(value);
}

function parsePercent(value) {
  return Number(String(value).replace("%", ""));
}

function formatValue(value) {
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
}

function formatBool(value) {
  if (value === true || value === "true" || value === 1 || value === "1") {
    return "TRUE";
  }

  if (value === false || value === "false" || value === 0 || value === "0") {
    return "FALSE";
  }

  return "-";
}