// Anonymised requirements register. Client, vendor, system, regulator, currency,
// cut-off times, volumes and dates are generalised on purpose.
var REGISTER = [
  { id: "GEN-01", group: "GEN", type: "Business rule", title: "Monitor only in-scope payment transactions from the client's high-value settlement system.",
    desc: "The solution monitors local-currency payment transactions processed through the high-value settlement system, within the client's role as system support provider.",
    ac: "Accepted when the solution design and statement of work both state that monitoring is limited to in-scope transactions from that system.",
    prio: "Must", source: "Workshop 1", review: "Round 1: reworded from a source-specific system name to a generic settlement source." },
  { id: "GEN-02", group: "GEN", type: "Business rule", title: "Deliver Liquidity Projection first and Transaction Anomaly Detection second.",
    desc: "The MVP delivers two use cases in a fixed order: Liquidity Projection as the primary use case, then Transaction Anomaly Detection.",
    ac: "Accepted when both use cases are implemented and operational in the MVP.",
    prio: "Must", source: "Kick-off" },
  { id: "GEN-03", group: "GEN", type: "Business rule", title: "Keep every output advisory: no settlement, funding, enforcement or operational actions.",
    desc: "The solution supports operator decisions and complements existing bank-side treasury and monitoring systems. It never initiates an action itself.",
    ac: "Accepted when all alerts, projections and dashboard outputs require operator review before any action, and testing confirms no automated action is triggered.",
    prio: "Must", source: "Workshop 1" },
  { id: "GEN-04", group: "GEN", type: "Business rule", title: "Treat transactions auto-cancelled at the end-of-day cut-off as Cancelled in processing and audit outputs.",
    desc: "Unsettled transactions are cancelled by the settlement system at the daily cut-off. The solution uses that Cancelled status consistently.",
    ac: "Accepted when a transaction still unsettled at the cut-off appears as Cancelled in the next data refresh and in audit outputs.",
    prio: "Must", source: "Workshop 2", review: "Round 1: client confirmed the source system marks these as system-cancelled, so no inference is needed." },
  { id: "GEN-05", group: "GEN", type: "Functional", title: "Run detection and projection in configurable batch cycles that leave operators time to act before cut-offs.",
    desc: "Processes run on a configurable cadence with a sensible default, timed against the settlement windows.",
    ac: "Accepted when batches run at the configured interval, the interval can be changed, and results are available before each relevant cut-off.",
    prio: "Must", source: "Workshops 1–2", review: "Round 1: cut-off timing to be derived from the settlement window schedule." },
  { id: "GEN-06", group: "GEN", type: "Functional", title: "Provide a new operator dashboard for each MVP use case.",
    desc: "One dashboard for Liquidity Projection and one for Transaction Anomaly Detection, separate from existing tools.",
    ac: "Accepted when both dashboards are available to authorised operators and each shows participant-level outputs.",
    prio: "Should", moved: "Must → Should", source: "Client response", review: "Round 1: client wants the underlying data and logic first. Dashboard moved down in priority." },
  { id: "GEN-07", group: "GEN", type: "Functional", title: "Explain every alert and flag with its inputs and calculation logic.",
    desc: "Each output shows the inputs, logic, threshold and result used to produce it, so operators can audit it.",
    ac: "Accepted when every alert and dashboard flag displays its inputs, calculation logic, threshold and calculated result.",
    prio: "Must", moved: "Should → Must", source: "Workshops 1–2", review: "Round 1: client raised the priority. Explainability became a condition for trusting the model." },
  { id: "GEN-08", group: "GEN", type: "Model expectation", title: "State clearly that MVP model performance depends on the supplied data and covered scenarios.",
    desc: "The MVP model is not intended for production use. Production readiness needs real data and further validation.",
    ac: "Accepted when project documentation states this expectation and both parties acknowledge it.",
    prio: "Doc", source: "Checkpoint 2", review: "Added at the mid-project checkpoint to set expectations on accuracy." },

  { id: "LIQ-01", group: "LIQ", type: "Functional", title: "Project each participant's intraday liquidity position.",
    desc: "Uses the current settlement account balance, today's transaction activity so far, and learned flow patterns.",
    ac: "Accepted when a projection is generated for every monitored participant in every batch cycle.",
    prio: "Must", source: "Workshops 1–2" },
  { id: "LIQ-02", group: "LIQ", type: "Functional", title: "Calculate the projected position with a client-validated formula and documented assumptions.",
    desc: "Projected position = current balance + projected inflows − projected outflows, with every input assumption written down.",
    ac: "Accepted when the formula and derivation are documented and approved, implemented as approved, and verified in testing.",
    prio: "Must", source: "Workshops 1–2" },
  { id: "LIQ-03", group: "LIQ", type: "Functional", title: "Produce confidence-bounded projections and flag threshold breaches.",
    desc: "A worst-case position at an agreed confidence level instead of a single exact forecast. A participant is flagged when the worst case breaches the threshold.",
    ac: "Accepted when each projection includes the worst-case position at the approved confidence level and a flag is raised on every breach.",
    prio: "Must", source: "Workshops 1–2" },
  { id: "LIQ-04", group: "LIQ", type: "Functional", title: "Alert operators when a projected position approaches or breaches its threshold.",
    desc: "A dashboard indicator and alert fire when the worst-case projected position approaches zero or breaches a configured threshold.",
    ac: "Accepted when each threshold condition triggers an alert within the batch cycle and the alert is visible to operators.",
    prio: "Should", source: "Workshops 1–2" },
  { id: "LIQ-05", group: "LIQ", type: "Functional", title: "Show participant-level position, projection, threshold, flag status and flag reason.",
    desc: "A liquidity view listing current balance, projected incoming and outgoing amounts, projected position, threshold and flag reason.",
    ac: "Accepted when the dashboard shows every listed value for each monitored participant.",
    prio: "Should", source: "Workshops 1–2" },
  { id: "LIQ-06", group: "LIQ", type: "Functional", title: "Learn participant-specific flow patterns by time of day, including calendar and holiday effects.",
    desc: "Historical data trains per-participant distributions that distinguish normal days, month-ends, holidays and other day types.",
    ac: "Accepted when the model trains on at least six months of simulated history and produces distinct patterns per day type.",
    prio: "Must", source: "Workshops 1–2", review: "Round 1: simulated data must contain distinguishing patterns for each type of date." },
  { id: "LIQ-07", group: "LIQ", type: "Functional", title: "Support shortfall review with ranked and filtered outputs.",
    desc: "Operators rank and filter shortfall outputs by an agreed risk or confidence metric. Direct threshold configuration is deferred.",
    ac: "Accepted when operators can rank or filter by the agreed metric and review the most critical cases first.",
    prio: "Should", source: "Checkpoint 2", review: "Checkpoint 2: dashboard ranking agreed as the interim approach." },

  { id: "ANM-01", group: "ANM", type: "Functional", title: "Learn each participant's normal behaviour and detect material intraday deviations.",
    desc: "A normal profile per participant covering expected transaction volumes and timing.",
    ac: "Accepted when detection runs for every monitored participant in every batch cycle and deviations are flagged.",
    prio: "Must", source: "Workshop 1" },
  { id: "ANM-02", group: "ANM", type: "Functional", title: "Detect five agreed high-priority anomaly types, in priority order.",
    desc: "Starting with system-wide transaction silence and single-participant silence. Lower-priority types are out of the MVP.",
    ac: "Accepted when UAT scenarios show each of the five types is detected and flagged.",
    prio: "Must", source: "Workshop 1" },
  { id: "ANM-03", group: "ANM", type: "Functional", title: "Make alerts the primary output, with deviation, timing and severity.",
    desc: "For anomaly detection, alerts take precedence over dashboard presentation.",
    ac: "Accepted when every tested anomaly produces an alert containing all specified fields.",
    prio: "Must", source: "Workshop 1" },
  { id: "ANM-04", group: "ANM", type: "Functional", title: "Route alerts to the client's support team with investigation-ready details.",
    desc: "Each alert carries enough context for the support team to start an investigation without another lookup.",
    ac: "Accepted when routing is live and end-to-end testing confirms the team receives each alert type.",
    prio: "Must", source: "Workshop 1" },
  { id: "ANM-05", group: "ANM", type: "Functional", title: "Calibrate detection for low-volume participants to keep false positives down.",
    desc: "Participants with naturally small or irregular volumes get their own calibration.",
    ac: "Accepted when synthetic low-volume profiles show a false-positive rate within the agreed tolerance.",
    prio: "Must", source: "Workshop 1" },
  { id: "ANM-06", group: "ANM", type: "Functional", title: "Give operators a feedback panel on alerts with fixed categories.",
    desc: "An operator selects an alert, picks one category from a fixed set, optionally adds a note and submits. Feedback is stored for model review.",
    ac: "Accepted when an authorised operator can open the panel from the dashboard, submit exactly one category per alert and see it stored.",
    prio: "Should", source: "Workshop 1, Checkpoint 2", review: "Round 1: client called manual feedback critical to improving accuracy over time." },

  { id: "DATA-01", group: "DATA", type: "Data", title: "Develop and validate on jointly defined synthetic data.",
    desc: "Production data is unavailable for the MVP. Both parties define synthetic data with realistic structures, volumes, profiles and incidents, guided by a data guideline.",
    ac: "Accepted when the delivery team maintains the data guideline and critical data elements, and the client confirms the datasets match it.",
    prio: "Must", source: "Workshop 2, Checkpoint 2", review: "Checkpoint 2: both parties re-confirmed that accuracy depends largely on data availability." },
  { id: "DATA-02", group: "DATA", type: "Data", title: "Represent the agreed participant subset and daily volume range with enough density per participant.",
    desc: "A representative mix of high-, mid- and low-volume participants within an agreed daily transaction range.",
    ac: "Accepted when the client approves the participant list and the dataset contains it at the agreed volumes.",
    prio: "Must", source: "Workshop 1" },
  { id: "DATA-03", group: "DATA", type: "Data", title: "Process transactions by business date, status, calendar, holiday and timestamp.",
    desc: "History includes Settled, Rejected and Cancelled statuses, with calendar and holiday references.",
    ac: "Accepted when processing tests confirm each status, the calendar references and timestamp handling.",
    prio: "Must", source: "Workshop 1" },
  { id: "DATA-04", group: "DATA", type: "Data", title: "Receive the data dictionary, code lists and approved field access for both use cases.",
    desc: "The client provides what exists and names any gaps, so the team knows which fields can be relied on.",
    ac: "Accepted when the dictionary and code lists are delivered, gaps are logged and field access is approved.",
    prio: "Must", source: "Workshop 1, Checkpoint 2" },
  { id: "DATA-05", group: "DATA", type: "Data", title: "Deliver synthetic data in stages and fold feedback into each next delivery.",
    desc: "Days of data first, then months, then the full training history, each delivery reviewed before the next.",
    ac: "Accepted when each delivery lands by its milestone (or an approved revised date) and includes the previous round's feedback.",
    prio: "Must", source: "Checkpoint 2" },

  { id: "INFRA-01", group: "INFRA", type: "Infrastructure", title: "Build and validate in the vendor cloud; plan migration to the client cloud.",
    desc: "Foundation work starts in the delivery team's environment on staging data while the client's infrastructure design is clarified.",
    ac: "Accepted when foundation setup proceeds without waiting for final design approval, both use cases validate, and a migration plan exists.",
    prio: "Must", source: "Workshops 1–2, Checkpoint 2" },
  { id: "INFRA-02", group: "INFRA", type: "Infrastructure", title: "Persist every projection, alert, flag, timestamp and audit result from each scheduled batch.",
    desc: "Scheduled jobs run at the configured interval and store all outputs for audit.",
    ac: "Accepted when each cycle produces the expected outputs and all of them are persisted and retrievable.",
    prio: "Must", source: "Workshop 2" },
  { id: "INFRA-03", group: "INFRA", type: "Infrastructure", title: "Provision least-privilege project access and confirm regulatory requirements for the design.",
    desc: "Restricted cloud and database accounts for the project team, plus confirmation of regulatory constraints that affect the design.",
    ac: "Accepted when access is limited to approved data and services and regulatory requirements are documented.",
    prio: "Must", source: "Workshop 2" },

  { id: "PL-1", group: "PL", type: "Parking list", title: "Continuous real-time detection is out of the MVP.",
    desc: "The MVP uses configurable periodic batches only.", ac: "N/A", prio: "Won't", source: "Workshop 1" },
  { id: "PL-2", group: "PL", type: "Parking list", title: "Exact future-balance prediction is out of the MVP.",
    desc: "Confidence-bounded liquidity-risk projections replace exact forecasts.", ac: "N/A", prio: "Won't", source: "Workshops 1–2" },
  { id: "PL-3", group: "PL", type: "Parking list", title: "No replacing treasury systems or acting on participants.",
    desc: "The solution stays advisory and does not resolve participant issues automatically.", ac: "N/A", prio: "Won't", source: "Workshop 1" },
  { id: "PL-4", group: "PL", type: "Parking list", title: "Compliance and regulatory monitoring is deferred to the roadmap.",
    desc: "Out of the MVP. Revisit in a later phase.", ac: "N/A", prio: "Won't", source: "Workshop 1" },
  { id: "PL-5", group: "PL", type: "Parking list", title: "Automated retraining and threshold adaptation are deferred.",
    desc: "The MVP relies on manual feedback (ANM-06) to inform later tuning.", ac: "N/A", prio: "Won't", source: "Workshop 1" }
];

(function () {
  var list = document.getElementById("register");
  var search = document.getElementById("reg-search");
  var buttons = document.querySelectorAll("[data-group]");
  var count = document.getElementById("reg-count");
  var group = "ALL";

  function badgeClass(p) { return { Must: "must", Should: "should", "Won't": "wont", Doc: "doc" }[p]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function render() {
    var q = search.value.trim().toLowerCase();
    var rows = REGISTER.filter(function (r) {
      if (group !== "ALL" && r.group !== group) return false;
      if (!q) return true;
      return (r.id + " " + r.title + " " + r.desc + " " + r.ac + " " + (r.review || "")).toLowerCase().indexOf(q) !== -1;
    });
    count.textContent = rows.length + " of " + REGISTER.length;
    if (!rows.length) { list.innerHTML = '<div class="empty">No requirements match.</div>'; return; }
    list.innerHTML = rows.map(function (r) {
      return '<details class="reg-item"><summary>' +
        '<code>' + r.id + '</code>' +
        '<span class="type">' + esc(r.type) + '</span>' +
        '<span class="title">' + esc(r.title) + '</span>' +
        '<span class="prio"><span class="badge ' + badgeClass(r.prio) + '">' + (r.prio === "Doc" ? "Note" : r.prio) + '</span></span>' +
        '</summary><div class="reg-detail">' +
        '<div><h4>Description</h4><p>' + esc(r.desc) + '</p></div>' +
        '<div><h4>Acceptance criteria</h4><p>' + esc(r.ac) + '</p></div>' +
        '<div><h4>Source</h4><p>' + esc(r.source) + (r.moved ? ' <span class="badge moved">' + esc(r.moved) + '</span>' : '') + '</p></div>' +
        (r.review ? '<div class="full"><h4>Client review</h4><p class="note">' + esc(r.review) + '</p></div>' : '') +
        '</div></details>';
    }).join("");
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      group = b.getAttribute("data-group");
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render();
    });
  });
  search.addEventListener("input", render);

  var tally = { Must: 0, Should: 0, "Won't": 0, Doc: 0 };
  REGISTER.forEach(function (r) { tally[r.prio]++; });
  var colors = { Must: "var(--accent)", Should: "var(--info)", "Won't": "var(--stop)", Doc: "var(--good)" };
  var labels = { Must: "Must", Should: "Should", "Won't": "Won't have", Doc: "Expectation note" };
  document.getElementById("prio-bar").innerHTML = Object.keys(tally).map(function (k) {
    return '<span style="flex:' + tally[k] + ';background:' + colors[k] + '" title="' + labels[k] + ': ' + tally[k] + '"></span>';
  }).join("");
  document.getElementById("prio-legend").innerHTML = Object.keys(tally).map(function (k) {
    return '<span><i style="background:' + colors[k] + '"></i>' + labels[k] + ' · ' + tally[k] + '</span>';
  }).join("");

  render();
})();
