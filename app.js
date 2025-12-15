console.log("✅ official app.js loaded");

// ✅ 正式版儲存前綴（避免跟測試版混在一起）
const STORAGE_PREFIX = "daily-report-";

// ===== ↓↓↓ Google Sheet 串接（正式版）↓↓↓ =====
const SHEET_INGEST_URL =
  "https://script.google.com/macros/s/AKfycbxwYN_YGa5W8Fqg8YrSPTFkhkqnLB61hZ3lFgU-5kIHTSK_DmasH573pv7GutF8wf8S/exec";
const INGEST_KEY = "dailyreport-key-2025";

// 防止同一天同內容重複送出
function sheetSentKey(dateStr) {
  return `${STORAGE_PREFIX}sheet-sent-${dateStr}`;
}
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

// no-cors：避免 GitHub Pages → Apps Script 的 CORS 擋回應
async function sendReportToSheet(payload) {
  fetch(SHEET_INGEST_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: INGEST_KEY,
      env: "official", // ✅ 正式版標記
      ...payload
    })
  });
  return true;
}
// ===== ↑↑↑ Google Sheet 串接結束 ↑↑↑ =====


// ===== 日期工具 =====
function getCurrentDateStr() {
  const input = document.getElementById("date");
  let value = input && input.value;
  if (!value) {
    const d = new Date();
    const m = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    value = `${d.getFullYear()}-${m}-${day}`;
    if (input) input.value = value;
  }
  return value;
}

function addDaysToDateStr(dateStr, delta) {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const mm = ("0" + (dt.getMonth() + 1)).slice(-2);
  const dd = ("0" + dt.getDate()).slice(-2);
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

function storageKey(dateStr) {
  return `${STORAGE_PREFIX}${dateStr}`;
}

function $(id) {
  return document.getElementById(id);
}

// 儲存用：保留空白
function v(id) {
  const el = $(id);
  if (!el) return "";
  return String(el.value ?? "").trim();
}

// 計算用：空白 → 0
function num(val) {
  const s = String(val ?? "").trim();
  if (s === "") return 0;
  const x = Number(s);
  return Number.isFinite(x) ? x : 0;
}

// 達成文字
function okText(ok) {
  return ok ? "✔️ 達成" : "✖️ 未達成";
}

// ===== 儲存 / 讀取 =====
function saveToday() {
  const date = getCurrentDateStr();
  recalcTotals(false);
  const payload = collectForm();
  localStorage.setItem(storageKey(date), JSON.stringify(payload));
}

function loadByDate(dateStr) {
  const raw = localStorage.getItem(storageKey(dateStr));
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function hasDataOnDate(dateStr) {
  return localStorage.getItem(storageKey(dateStr)) != null;
}

function findPrevDateWithData(fromDateStr, maxLookbackDays = 60) {
  let cursor = addDaysToDateStr(fromDateStr, -1);
  for (let i = 0; i < maxLookbackDays; i++) {
    if (hasDataOnDate(cursor)) return cursor;
    cursor = addDaysToDateStr(cursor, -1);
  }
  return null;
}

function getPrevTwoDataDates(todayStr) {
  const d1 = findPrevDateWithData(todayStr);
  if (!d1) return { d1: null, d0: null };
  const d0 = findPrevDateWithData(d1);
  return { d1, d0 };
}

function getKpiSourceDateForToday(todayStr) {
  const yesterday = addDaysToDateStr(todayStr, -1);
  if (hasDataOnDate(yesterday)) return yesterday;
  return findPrevDateWithData(todayStr);
}

// ===== 讀表單（✅ 改成：數字欄位用字串存，不要變 0） =====
function collectForm() {
  const date = getCurrentDateStr();

  const obj = {
    date,
    store: v("store"),
    name: v("name"),

    // 今日外撥（字串）
    todayCallPotential: v("todayCallPotential"),
    todayCallOld3Y: v("todayCallOld3Y"),
    todayCallTotal: v("todayCallTotal"),
    todayInviteReturn: v("todayInviteReturn"),

    // 今日預約/到店（字串）
    todayBookingTotal: v("todayBookingTotal"),
    todayVisitTotal: v("todayVisitTotal"),

    // 試用/成交（字串）
    trialHA: v("trialHA"),
    trialAPAP: v("trialAPAP"),
    dealHA: v("dealHA"),
    dealAPAP: v("dealAPAP"),

    // 明日（字串）
    tomorrowBookingTotal: v("tomorrowBookingTotal"),
    tomorrowKpiCallTotal: v("tomorrowKpiCallTotal"),
    tomorrowKpiCallOld3Y: v("tomorrowKpiCallOld3Y"),
    tomorrowKpiTrial: v("tomorrowKpiTrial"),

    updatedAt: new Date().toISOString(),
  };

  // ✅ 保險：總通數重新算一次（但存回字串；兩格都空就存空白）
  const pRaw = obj.todayCallPotential;
  const oRaw = obj.todayCallOld3Y;
  if (pRaw === "" && oRaw === "") {
    obj.todayCallTotal = "";
  } else {
    obj.todayCallTotal = String(num(pRaw) + num(oRaw));
  }

  return obj;
}

// ===== 寫回表單（✅ 直接寫字串；空白就空白，不會出現 0） =====
function fillForm(data) {
  if (!data) return;

  if ($("store")) $("store").value = data.store ?? "";
  if ($("name")) $("name").value = data.name ?? "";

  if ($("todayCallPotential")) $("todayCallPotential").value = data.todayCallPotential ?? "";
  if ($("todayCallOld3Y")) $("todayCallOld3Y").value = data.todayCallOld3Y ?? "";

  // ✅ total 由 recalcTotals 統一處理（避免被塞 0）
  recalcTotals(false);

  if ($("todayInviteReturn")) $("todayInviteReturn").value = data.todayInviteReturn ?? "";

  if ($("todayBookingTotal")) $("todayBookingTotal").value = data.todayBookingTotal ?? "";
  if ($("todayVisitTotal")) $("todayVisitTotal").value = data.todayVisitTotal ?? "";

  if ($("trialHA")) $("trialHA").value = data.trialHA ?? "";
  if ($("trialAPAP")) $("trialAPAP").value = data.trialAPAP ?? "";
  if ($("dealHA")) $("dealHA").value = data.dealHA ?? "";
  if ($("dealAPAP")) $("dealAPAP").value = data.dealAPAP ?? "";

  if ($("tomorrowBookingTotal")) $("tomorrowBookingTotal").value = data.tomorrowBookingTotal ?? "";
  if ($("tomorrowKpiCallTotal")) $("tomorrowKpiCallTotal").value = data.tomorrowKpiCallTotal ?? "";
  if ($("tomorrowKpiCallOld3Y")) $("tomorrowKpiCallOld3Y").value = data.tomorrowKpiCallOld3Y ?? "";
  if ($("tomorrowKpiTrial")) $("tomorrowKpiTrial").value = data.tomorrowKpiTrial ?? "";
}

// ===== 計算外撥總通數（✅ 兩格都空 → total 空白） =====
function recalcTotals(doSave = true) {
  const pRaw = v("todayCallPotential");
  const oRaw = v("todayCallOld3Y");

  if (!$("todayCallTotal")) {
    if (doSave) saveToday();
    return;
  }

  // ✅ 兩個都沒填：總通數保持空白（不顯示 0）
  if (pRaw === "" && oRaw === "") {
    $("todayCallTotal").value = "";
  } else {
    $("todayCallTotal").value = String(num(pRaw) + num(oRaw));
  }

  if (doSave) saveToday();
}
window.recalcTotals = recalcTotals;

// ===== 分頁切換 =====
function showView(view) {
  const huddleBtn = $("tab-huddle");
  const reportBtn = $("tab-report");
  const huddleView = $("huddle-view");
  const reportView = $("report-view");

  if (!huddleBtn || !reportBtn || !huddleView || !reportView) return;

  const isHuddle = view === "huddle";
  huddleView.classList.toggle("hidden", !isHuddle);
  reportView.classList.toggle("hidden", isHuddle);

  huddleBtn.classList.toggle("active", isHuddle);
  reportBtn.classList.toggle("active", !isHuddle);

  if (isHuddle) renderHuddle();
}

// ===== 今日檢視（畫面） =====
function renderHuddle() {
  const today = getCurrentDateStr();
  const { d1, d0 } = getPrevTwoDataDates(today);

  const prevData = d1 ? loadByDate(d1) : null;

  // A) 今日目標（以最近一次有資料為準）
  if ($("huddleTodayBooking")) $("huddleTodayBooking").textContent = (prevData?.tomorrowBookingTotal ?? "-") || "-";
  if ($("huddleTodayTrial")) $("huddleTodayTrial").textContent = (prevData?.tomorrowKpiTrial ?? "-") || "-";
  if ($("huddleTodayCallTotal")) $("huddleTodayCallTotal").textContent = (prevData?.tomorrowKpiCallTotal ?? "-") || "-";
  if ($("huddleTodayOld3Y")) $("huddleTodayOld3Y").textContent = (prevData?.tomorrowKpiCallOld3Y ?? "-") || "-";

  // 今日預約：提示＆（可選）自動帶入
  const hintBox = $("todayBookingHint");
  const hintVal = $("todayBookingHintValue");
  if (hintBox && hintVal && prevData && String(prevData.tomorrowBookingTotal ?? "").trim() !== "") {
    hintVal.textContent = prevData.tomorrowBookingTotal;
    hintBox.style.display = "block";

    if ($("todayBookingTotal") && v("todayBookingTotal") === "") {
      $("todayBookingTotal").value = prevData.tomorrowBookingTotal;
      saveToday();
    }
  } else if (hintBox) {
    hintBox.style.display = "none";
  }

  // B) 昨日執行檢視：d0 KPI（明日KPI） vs d1 實績
  const execData = d1 ? loadByDate(d1) : null;
  const kpiSetData = d0 ? loadByDate(d0) : null;

  if (!execData || !kpiSetData) {
    if ($("checkTrialText")) $("checkTrialText").textContent = "（資料不足）";
    if ($("checkCallText")) $("checkCallText").textContent = "（資料不足）";
    if ($("checkInviteText")) $("checkInviteText").textContent = "（資料不足）";
    if ($("checkInviteRateText")) $("checkInviteRateText").textContent = "-";
    const badge = $("checkInviteRateBadge");
    if (badge) badge.style.display = "none";
    return;
  }

  const targetTrial = num(kpiSetData.tomorrowKpiTrial);
  const targetCall = num(kpiSetData.tomorrowKpiCallTotal);
  const targetInvite = num(kpiSetData.tomorrowKpiCallOld3Y);

  const actualTrial = num(execData.trialHA) + num(execData.trialAPAP);
  const actualCall = num(execData.todayCallPotential) + num(execData.todayCallOld3Y);
  const actualInvite = num(execData.todayInviteReturn);

  if ($("checkTrialText")) {
    $("checkTrialText").textContent =
      `目標 ${targetTrial} / 執行 ${actualTrial}  ${okText(actualTrial >= targetTrial)}`;
  }
  if ($("checkCallText")) {
    $("checkCallText").textContent =
      `目標 ${targetCall} / 執行 ${actualCall}  ${okText(actualCall >= targetCall)}`;
  }
  if ($("checkInviteText")) {
    $("checkInviteText").textContent =
      `目標 ${targetInvite} / 執行 ${actualInvite}  ${okText(actualInvite >= targetInvite)}`;
  }

  const rate = actualCall > 0 ? (actualInvite / actualCall) : 0;
  const pct = Math.round(rate * 100) + "%";
  if ($("checkInviteRateText")) $("checkInviteRateText").textContent = pct;

  const badge = $("checkInviteRateBadge");
  if (badge) {
    badge.style.display = "inline-block";
    badge.classList.remove("green", "yellow", "red");

    if (rate >= 0.30) { badge.classList.add("green"); badge.textContent = "高"; }
    else if (rate >= 0.15) { badge.classList.add("yellow"); badge.textContent = "中"; }
    else { badge.classList.add("red"); badge.textContent = "低"; }
  }
}

// ===== 產生訊息 =====
function generateMessage() {
  saveToday();

  const d = collectForm();

  // ✅ 訊息輸出用數字（空白視為 0）
  const title = `${d.date}｜${(d.store || "")} ${(d.name || "")}`.trim();

  const todayCallPotential = num(d.todayCallPotential);
  const todayCallOld3Y = num(d.todayCallOld3Y);
  const todayCallTotal = todayCallPotential + todayCallOld3Y;

  const msg =
`${title}
1. 今日外撥：${todayCallTotal} 通（潛客 ${todayCallPotential} 通、過保舊客 ${todayCallOld3Y} 通）
2. 今日預約：${num(d.todayBookingTotal)} 位
3. 今日到店：${num(d.todayVisitTotal)} 位
   試用：HA ${num(d.trialHA)} 位、APAP ${num(d.trialAPAP)} 位
   成交：HA ${num(d.dealHA)} 位、APAP ${num(d.dealAPAP)} 位
4. 明日已排預約：${num(d.tomorrowBookingTotal)} 位
5. 明日KPI：
   完成試戴 ${num(d.tomorrowKpiTrial)} 位
   外撥 ${num(d.tomorrowKpiCallTotal)} 通
   舊客預約 ${num(d.tomorrowKpiCallOld3Y)} 位

📊 今日執行檢視（對照昨日 KPI）
${buildTodayVsYesterdayKpiText(d)}
`;

  if ($("output")) $("output").value = msg;

  // ===== 直接送 Google Sheet（測試版）=====
  try {
    const todayStr = d.date;
    const hash = simpleHash(msg);
    const lastHash = localStorage.getItem(sheetSentKey(todayStr));

    if (lastHash !== hash) {
      sendReportToSheet({
        date: d.date,
        store: d.store,
        name: d.name,

        calls_total: todayCallTotal,
        calls_potential: todayCallPotential,
        calls_old: todayCallOld3Y,

        appt_today: num(d.todayBookingTotal),
        visit_today: num(d.todayVisitTotal),

        trial_ha: num(d.trialHA),
        trial_apap: num(d.trialAPAP),
        deal_ha: num(d.dealHA),
        deal_apap: num(d.dealAPAP),

        appt_tomorrow: num(d.tomorrowBookingTotal),
        kpi_call_tomorrow: num(d.tomorrowKpiCallTotal),
        kpi_old_appt_tomorrow: num(d.tomorrowKpiCallOld3Y),
        kpi_trial_tomorrow: num(d.tomorrowKpiTrial),

        message_text: msg
      });

      localStorage.setItem(sheetSentKey(todayStr), hash);
    }
  } catch (err) {
    console.error("send to sheet failed:", err);
  }
}
window.generateMessage = generateMessage;

// ===== 今日執行檢視：今天 vs 昨日KPI =====
function buildTodayVsYesterdayKpiText(todayForm) {
  const todayStr = todayForm.date;

  const kpiSourceDate = getKpiSourceDateForToday(todayStr);
  const kpiSourceData = kpiSourceDate ? loadByDate(kpiSourceDate) : null;

  if (!kpiSourceData) {
    return "•（找不到昨日 KPI：請確認前一個上班日有填寫「明日KPI」）";
  }

  const targetTrial = num(kpiSourceData.tomorrowKpiTrial);
  const targetCall = num(kpiSourceData.tomorrowKpiCallTotal);
  const targetInvite = num(kpiSourceData.tomorrowKpiCallOld3Y);

  const actualTrial = num(todayForm.trialHA) + num(todayForm.trialAPAP);

  const actualCall = num(todayForm.todayCallPotential) + num(todayForm.todayCallOld3Y);
  const actualInvite = num(todayForm.todayInviteReturn);

  const rate = actualCall > 0 ? (actualInvite / actualCall) : 0;
  const pct = Math.round(rate * 100) + "%";

  const kpiNote = (kpiSourceDate === addDaysToDateStr(todayStr, -1))
    ? ""
    : `（昨日休假，改以前次資料 ${kpiSourceDate} 的 KPI 對照）`;

  return [
    `• 試戴數：目標 ${targetTrial} / 執行 ${actualTrial}   ${okText(actualTrial >= targetTrial)}`,
    `• 外撥通數：目標 ${targetCall} / 執行 ${actualCall}   ${okText(actualCall >= targetCall)}`,
    `• 邀約回店數：目標 ${targetInvite} / 執行 ${actualInvite}   ${okText(actualInvite >= targetInvite)}`,
    `• 邀約成功率：${pct} ${kpiNote}`.trim(),
  ].join("\n");
}

// ===== 複製 =====
async function copyMessage() {
  const text = $("output")?.value || "";
  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);
    alert("✅ 已複製到剪貼簿");
  } catch {
    const ta = $("output");
    if (ta) {
      ta.focus();
      ta.select();
      document.execCommand("copy");
      alert("✅ 已複製到剪貼簿");
    }
  }
}
window.copyMessage = copyMessage;

// ===== 初始化 =====
function bindAutoSave() {
  const ids = [
    "store","name",
    "todayCallPotential","todayCallOld3Y","todayInviteReturn",
    "todayBookingTotal","todayVisitTotal",
    "trialHA","trialAPAP","dealHA","dealAPAP",
    "tomorrowBookingTotal","tomorrowKpiCallTotal","tomorrowKpiCallOld3Y","tomorrowKpiTrial",
  ];
  ids.forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("input", saveToday);
    el.addEventListener("change", saveToday);
  });
}

function initTabs() {
  const h = $("tab-huddle");
  const r = $("tab-report");
  if (h) h.addEventListener("click", () => showView("huddle"));
  if (r) r.addEventListener("click", () => showView("report"));
}

function initDateLoad() {
  const dateInput = $("date");
  if (!dateInput) return;

  const today = getCurrentDateStr();

  const data = loadByDate(today);
  if (data) fillForm(data);
  recalcTotals(false);

  dateInput.addEventListener("change", () => {
    const ds = getCurrentDateStr();

    // 清空再填（避免殘留）
    document.querySelectorAll("input[type='number'], input[type='text'], select").forEach(el => {
      if (el.id === "date") return;
      if (el.tagName === "SELECT") el.value = "";
      else el.value = "";
    });

    const d = loadByDate(ds);
    if (d) fillForm(d);
    recalcTotals(false);
    renderHuddle();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  bindAutoSave();
  initDateLoad();
  renderHuddle();
});