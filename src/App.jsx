import { useEffect, useMemo, useState } from "react";
import "./App.css";
import machineImage from "./assets/machine.png";
import machine2Image from "./assets/machine2.png";
import zoneMainRealistic from "./assets/zone.png";


/* =========================================================
   01 - MACHINE POINTS / TAG CONFIG
   Real tag mapping prepared from your list.

   SFI_DoorX:
     true  = Guard ON / Door closed
     false = Guard OFF / Door open

   I_DoorXDiagnostic:
     true  = Healthy ON
     false = Healthy OFF

   Frontend internal logic:
     guardOpen = true means door is open
     interlockOk = true means healthy
========================================================= */

const MACHINE_POINTS = [
  { id: 1, name: "Unwinder Door 1", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door1", interlockTag: "I_Door1Diagnostic" },
  { id: 2, name: "Unwinder Door 2", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door2", interlockTag: "I_Door2Diagnostic" },
  { id: 3, name: "Machine Door 3", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door3", interlockTag: "I_Door3Diagnostic" },
  { id: 4, name: "Machine Door 4", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door4", interlockTag: "I_Door4Diagnostic" },
  { id: 5, name: "Machine Door 5", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door5", interlockTag: "I_Door5Diagnostic" },
  { id: 6, name: "Machine Door 6", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door6", interlockTag: "I_Door6Diagnostic" },
  { id: 7, name: "Machine Door 7", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door7", interlockTag: "I_Door7Diagnostic" },
  { id: 8, name: "Machine Door 8", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door8", interlockTag: "I_Door8Diagnostic" },
  { id: 9, name: "Machine Door 9", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door9", interlockTag: "I_Door9Diagnostic" },
  { id: 10, name: "Machine Door 10", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door10", interlockTag: "I_Door10Diagnostic" },
  { id: 11, name: "Machine Door 11", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door11", interlockTag: "I_Door11Diagnostic" },
  { id: 12, name: "Machine Door 12", area: "Main Machine", guardOpen: true, interlockOk: true, guardTag: "SFI_Door12", interlockTag: "I_Door12Diagnostic" },
  { id: 13, name: "Unwinder Door 13", area: "Unwinder Section", guardOpen: true, interlockOk: true, guardTag: "SFI_Door13", interlockTag: "I_Door13Diagnostic" },
  { id: 14, name: "Unwinder Door 14", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door14", interlockTag: "I_Door14Diagnostic" },
  { id: 15, name: "Unwinder Door 15", area: "Unwinder Section", guardOpen: false, interlockOk: false, guardTag: "SFI_Door15", interlockTag: "I_Door15Diagnostic" },
  { id: 16, name: "Unwinder Door 16", area: "Unwinder Section", guardOpen: false, interlockOk: false, guardTag: "SFI_Door16", interlockTag: "I_Door16Diagnostic" },
  { id: 17, name: "Unwinder Door 17", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door17", interlockTag: "I_Door17Diagnostic" },
  { id: 18, name: "Unwinder Door 18", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door18", interlockTag: "I_Door18Diagnostic" },
  { id: 19, name: "Unwinder Door 19", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door19", interlockTag: "I_Door19Diagnostic" },
  { id: 20, name: "Unwinder Door 20", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door20", interlockTag: "I_Door20Diagnostic" },
  { id: 21, name: "Machine Door 21", area: "Main Machine", guardOpen: false, interlockOk: true, guardTag: "SFI_Door21", interlockTag: "I_Door21Diagnostic" },
  { id: 22, name: "Door 22", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door22", interlockTag: "I_Door22Diagnostic" },
  { id: 23, name: "Door 23", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door23", interlockTag: "I_Door23Diagnostic" },
  { id: 24, name: "Door 24", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door24", interlockTag: "I_Door24Diagnostic" },
  { id: 25, name: "Door 25", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door25", interlockTag: "I_Door25Diagnostic" },
  { id: 26, name: "Door 26", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door26", interlockTag: "I_Door26Diagnostic" },
  { id: 27, name: "Door 27", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door27", interlockTag: "I_Door27Diagnostic" },
  { id: 28, name: "Door 28", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door28", interlockTag: "I_Door28Diagnostic" },
  { id: 29, name: "Door 29", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door29", interlockTag: "I_Door29Diagnostic" },
  { id: 30, name: "Door 30", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door30", interlockTag: "I_Door30Diagnostic" },
  { id: 31, name: "Door 31", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door31", interlockTag: "I_Door31Diagnostic" },
  { id: 32, name: "Door 32", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door32", interlockTag: "I_Door32Diagnostic" },
  { id: 33, name: "Door 33", area: "Machine Guarding", guardOpen: false, interlockOk: true, guardTag: "SFI_Door33", interlockTag: "I_Door33Diagnostic" }, 
  { id: 34, name: "Unwinder Door 34", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door34", interlockTag: "I_Door34Diagnostic" },
  { id: 35, name: "Unwinder Door 35", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door35", interlockTag: "I_Door35Diagnostic" },
  { id: 36, name: "Unwinder Door 36", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door36", interlockTag: "I_Door36Diagnostic" },
  { id: 37, name: "Unwinder Door 37", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door37", interlockTag: "I_Door37Diagnostic" },
  { id: 38, name: "Unwinder Door 38", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door38", interlockTag: "I_Door38Diagnostic" },
  { id: 39, name: "Unwinder Door 39", area: "Unwinder Section", guardOpen: false, interlockOk: true, guardTag: "SFI_Door39", interlockTag: "I_Door39Diagnostic" },
];

/* =========================================================
   02 - MACHINE SVG ZONES
   These are the clickable colored polygon areas on the machine.
========================================================= */

const MACHINE_ZONES = [
  {
    id: "zone-infeed",
    name: "Infeed",
    area: "Infeed Section",
    points: "11,63 22,55 30,60 29,78 11,81",
    labelX: "18%",
    labelY: "73%",
    zoomScale: 2.45,
    detailImage: zoneMainRealistic,
    tagIds: [1, 2, 26, 36],
  },
  {
    id: "zone-wrapper",
    name: "Wrapping",
    area: "Wrapping Section",
    points: "30,58 51,48 61,52 59,64 34,75",
    labelX: "44%",
    labelY: "63%",
    zoomScale: 2.1,
    detailImage: zoneMainRealistic,
    tagIds: [3, 4, 5, 6, 7, 27, 28, 29],
  },
  {
    id: "zone-main",
    name: "Main Machine",
    area: "Main Machine",
    points: "58,50 75,42 86,46 85,57 63,66 58,61",
    labelX: "70%",
    labelY: "55%",
    zoomScale: 2,
    detailImage: zoneMainRealistic,
    tagIds: [8, 9, 10, 11, 30, 31, 37],
  },
  {
    id: "zone-loader",
    name: "Top Loader",
    area: "Top Loader",
    points: "60,15 68,9 75,20 72,32 61,35 56,25",
    labelX: "65%",
    labelY: "25%",
    zoomScale: 2.4,
    detailImage: zoneMainRealistic,
    tagIds: [12, 13, 14, 15, 38],
  },
  {
    id: "zone-center",
    name: "Center Guarding",
    area: "Center Guarding",
    points: "76,45 92,39 98,44 97,53 79,59",
    labelX: "87%",
    labelY: "49%",
    zoomScale: 2.15,
    detailImage: zoneMainRealistic,
    tagIds: [16, 17, 18, 19, 20, 21, 22, 23, 32, 33, 34],
  },
  {
    id: "zone-outfeed",
    name: "Outfeed",
    area: "Outfeed Section",
    points: "91,50 98,47 99,56 93,62 90,58",
    labelX: "94%",
    labelY: "57%",
    zoomScale: 2.5,
    detailImage: zoneMainRealistic,
    tagIds: [24, 25, 35, 39],
  },
];

const MACHINE_CONFIGS = {
  meshpack: {
    id: "meshpack",
    name: "Meshpack",
    title: "Meshpack Command Center",
    subtitle: "Real-time guard and interlock status",
    apiUrl: "http://localhost:5000/data",
    image: machineImage,
    points: MACHINE_POINTS,
    zones: MACHINE_ZONES,
  },

  machine2: {
    id: "machine2",
    name: "Machine 2",
    title: "Machine 2 Command Center",
    subtitle: "Real-time machine status monitoring",
    apiUrl: "http://localhost:5000/data-machine2",
    image: machine2Image,

    // For now this copies Meshpack points.
    // Replace this later with Machine 2 tag list.
    points: MACHINE_POINTS,

    // For now this copies Meshpack zones.
    // Replace this later with Machine 2 zone locations.
    zones: MACHINE_ZONES,
  },
};

export default function App() {
  const [activeMachineId, setActiveMachineId] = useState("meshpack");
  const [machineData, setMachineData] = useState(null);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState("light");
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const activeMachine = MACHINE_CONFIGS[activeMachineId];

  /* =========================================================
     03 - FETCH HIGHBYTE / BACKEND DATA
  ========================================================= */

  async function fetchMachineData() {
    try {
      const res = await fetch(activeMachine.apiUrl);
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
  setMachineData(null);
  setApiError("");
  setSelectedPoint(null);
  setShowDetailsModal(false);

  fetchMachineData();

  const interval = setInterval(fetchMachineData, 1000);
  return () => clearInterval(interval);
}, [activeMachineId]);

  const status = machineData?.status || "WAITING";
  const payload = machineData?.data || {};

 /* =========================================================
   04 - BUILD LIVE MACHINE ROWS
   Converts real PLC tag values into frontend status values.

   PLC:
     SFI_DoorX = Guard ON / closed
     I_DoorXDiagnostic = Healthy ON

   Frontend:
     guardOpen = true means door is open
     interlockOk = true means healthy
========================================================= */

const machineRows = useMemo(() => {
  return activeMachine.points.map((point) => {
    const liveGuardOnValue = payload?.[point.guardTag];
    const liveHealthyValue = payload?.[point.interlockTag];

    const guardOn =
      liveGuardOnValue === undefined
        ? !point.guardOpen
        : toBool(liveGuardOnValue);

    const healthyOn =
      liveHealthyValue === undefined
        ? point.interlockOk
        : toBool(liveHealthyValue);

    return {
      ...point,
      guardOpen: !guardOn,
      interlockOk: healthyOn,
    };
  });
}, [payload, activeMachine]);

  /* =========================================================
     05 - LEFT PANEL ATTENTION LOGIC
     attentionRows = everything NOT READY / FAULT / WARNING
     readyRows     = READY only
  ========================================================= */

  const attentionRows = machineRows.filter((machine) => {
    const state = getSafetyState(machine);
    return state.className !== "safe";
  });

  const readyRows = machineRows.filter((machine) => {
    const state = getSafetyState(machine);
    return state.className === "safe";
  });

  /* =========================================================
     06 - BUILD MACHINE ZONES
     Groups the 39 points into 6 visual machine sections.
  ========================================================= */

  const zoneRows = useMemo(() => {
  return activeMachine.zones.map((zone) => {
    const zoneTags = machineRows.filter((tag) => zone.tagIds.includes(tag.id));
    const zoneState = getZoneState(zoneTags);

    return {
      ...zone,
      tags: zoneTags,
      state: zoneState,
    };
  });
}, [machineRows, activeMachine]);

  /* =========================================================
     07 - MACHINE STATE FLAGS
  ========================================================= */

  const isRunning = status === "RUNNING";
  const isStopped = status === "STOPPED";

  /* =========================================================
     08 - ZOOM CALCULATION
     Used when clicking a machine zone.
  ========================================================= */

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

  /* =========================================================
     09 - CLICK HANDLERS
  ========================================================= */

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
      {/* =========================================================
          10 - TOP HEADER
      ========================================================= */}

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

            {Object.values(MACHINE_CONFIGS).map((machine) => (
  <button
    key={machine.id}
    className={`top-nav-btn ${
      activeMachineId === machine.id ? "active" : ""
    }`}
    onClick={() => setActiveMachineId(machine.id)}
  >
    {machine.name}
  </button>
))}
          </div>

          <div className="topbar-right">
            <div className={`top-state-inline ${getStatusClass(status)}`}>
              <div className="top-state-dot" />
              <span>{status}</span>
            </div>

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

      {/* =========================================================
          11 - SUMMARY STRIP
      ========================================================= */}

      <section className="summary-strip">
        <div className="summary-left">
          <div className={`summary-badge machine-badge ${getStatusClass(status)}`}>
            {isRunning ? "✓" : isStopped ? "!" : "•"}
          </div>

          <div>
            <div className="summary-title">{activeMachine.title}</div>
            <div className="summary-subtitle">{activeMachine.subtitle}</div>
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
          <SummaryStat value={attentionRows.length} label="ATTENTION" variant="red" />
          <SummaryStat value={zoneRows.length} label="ZONES" variant="green" />
          <SummaryStat value={isStopped ? "STOP" : "-"} label="STOPPED" variant="red" />
          <SummaryStat value={status} label="STATE" variant="amber" />
        </div>
      </section>

      {/* =========================================================
          12 - MAIN WORKSPACE
      ========================================================= */}

      <main className="workspace machine-workspace">
        {/* =========================================================
            13 - LEFT PANEL
            Top = Needs Attention
            Bottom = Ready Points
        ========================================================= */}

        <aside className="panel left-panel machine-left-panel">
          <div className="side-list-header">
            <div>
              <div className="panel-title">Machine Points</div>
              <div className="side-list-subtitle">Click a row to inspect</div>
            </div>

            <div className="side-count">{machineRows.length}</div>
          </div>

          {/* UPDATE: NEEDS ATTENTION SECTION */}
          <div className="left-attention-card">
            <div className="attention-header">
              <div>
                <div className="attention-title">Needs Attention</div>
                <div className="attention-subtitle">
                  Points requiring line acknowledgement
                </div>
              </div>

              <div
                className={`attention-count ${
                  attentionRows.length > 0 ? "active" : ""
                }`}
              >
                {attentionRows.length}
              </div>
            </div>

            {attentionRows.length > 0 ? (
              <div className="attention-list">
                {attentionRows.map((machine) => {
                  const safety = getSafetyState(machine);

                  return (
                    <button
                      className={`attention-row ${safety.className} ${
                        selectedPoint?.type === "point" &&
                        selectedPoint?.id === machine.id
                          ? "active"
                          : ""
                      }`}
                      key={`attention-${machine.id}`}
                      onClick={() => openPointDetails(machine, safety)}
                    >
                      <div className="attention-no">{machine.id}</div>

                      <div className="attention-info">
                        <div className="attention-name">{machine.name}</div>
                        <div className="attention-area">{machine.area}</div>
                      </div>

                      <span className={`attention-chip ${safety.className}`}>
                        {safety.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="attention-empty">All points are ready.</div>
            )}
          </div>

          <div className="ready-section-label">
  <div className="ready-section-title">Ready Points</div>
  <div className="ready-section-count">{readyRows.length}</div>
</div>

<div className="machine-table compact-machine-table">
  <div className="machine-table-head compact-head">
    <span>No.</span>
    <span>Name</span>
    <span>Status</span>
  </div>

  {readyRows.map((machine) => {
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
        </aside>

        {/* =========================================================
            14 - CENTER MACHINE MAP
        ========================================================= */}

        <section className="panel center-panel machine-center-panel">
          <div className="table-card">
            <div className={`machine-map ${activeZoomZone ? "zoomed" : ""}`}>
              <div className="machine-map-grid" />

              <div className="machine-zoom-layer">
                <div className="machine-stage">
                  <div
                    className={`machine-canvas ${
                      activeZoomZone ? "is-zoomed" : ""
                    }`}
                    style={machineCanvasStyle}
                  >
                    <img
                      src={activeMachine.image}
                      alt={activeMachine.name}
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
                          selectZone(zone, true);
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

      {/* =========================================================
          15 - DETAILS MODAL
          Opens when clicking a point or zone.
      ========================================================= */}

      {showDetailsModal && selectedPoint && (
  <div
    className={`details-modal-backdrop ${
      selectedPoint?.type === "zone" && selectedPoint?.detailImage
        ? "has-detail-image"
        : ""
    }`}
    style={{
      backgroundImage:
        selectedPoint?.type === "zone" && selectedPoint?.detailImage
          ? `linear-gradient(rgba(15, 23, 42, 0.32), rgba(15, 23, 42, 0.72)), url(${selectedPoint.detailImage})`
          : undefined,
    }}
    onClick={resetView}
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

              <button className="details-modal-close" onClick={resetView}>
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
                      selectedPoint.tags.filter((tag) => {
                        const state = getSafetyState(tag);
                        return state.className !== "safe";
                      }).length
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

/* =========================================================
   16 - SMALL COMPONENTS
========================================================= */

function SummaryStat({ value, label, variant }) {
  return (
    <div className={`summary-stat ${variant || ""}`}>
      <div className="summary-value">{value}</div>
      <div className="summary-label">{label}</div>
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

/* =========================================================
   17 - STATUS LOGIC
   Your final mapping:
   Healthy ON  + Guard ON  = READY / Green
   Healthy OFF + Guard OFF = NOT READY / Red
   Healthy OFF + Guard ON  = FAULT / Red
   Healthy ON  + Guard OFF = NOT READY / Yellow
========================================================= */

function getSafetyState(point) {
  const healthyOn = point.interlockOk === true;
  const guardOn = point.guardOpen === false;

  if (healthyOn && guardOn) {
    return {
      label: "READY",
      className: "safe",
    };
  }

  if (!healthyOn && !guardOn) {
    return {
      label: "NOT READY",
      className: "danger",
    };
  }

  if (!healthyOn && guardOn) {
    return {
      label: "FAULT",
      className: "danger",
    };
  }

  if (healthyOn && !guardOn) {
    return {
      label: "NOT READY",
      className: "warning",
    };
  }

  return {
    label: "UNKNOWN",
    className: "warning",
  };
}

function getZoneState(tags) {
  const hasRedNotReady = tags.some((tag) => {
    const healthyOn = tag.interlockOk === true;
    const guardOn = tag.guardOpen === false;
    return !healthyOn && !guardOn;
  });

  const hasFault = tags.some((tag) => {
    const healthyOn = tag.interlockOk === true;
    const guardOn = tag.guardOpen === false;
    return !healthyOn && guardOn;
  });

  const hasYellowNotReady = tags.some((tag) => {
    const healthyOn = tag.interlockOk === true;
    const guardOn = tag.guardOpen === false;
    return healthyOn && !guardOn;
  });

  if (hasRedNotReady || hasFault) {
    return {
      label: "FAULT / NOT READY",
      className: "danger",
    };
  }

  if (hasYellowNotReady) {
    return {
      label: "NOT READY",
      className: "warning",
    };
  }

  return {
    label: "READY",
    className: "safe",
  };
}

/* =========================================================
   18 - UTILS
========================================================= */

function getStatusClass(status) {
  if (status === "RUNNING") return "running";
  if (status === "STOPPED") return "stopped";
  return "waiting";
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