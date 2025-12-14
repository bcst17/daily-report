console.log("✅ test app.js loaded");

// ✅ 測試版儲存前綴（不要動，避免污染正式版）
const STORAGE_PREFIX = "daily-report-test-";

// ===== ↓↓↓ 新增：Google Sheet 串接（測試版）↓↓↓ =====
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

// no-cors：避免 GitHub Pages → Apps Script 的 CORS 擋回應（Failed to fetch）
async function sendReportToSheet(payload) {
  fetch(SHEET_INGEST_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: INGEST_KEY,
      env: "test", // 標記為測試版
      ...payload
    })
  });
  return true;
}
// ===== ↑↑↑ 新增結束 ↑↑↑ =====


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

function n(v) {
  const x = Number(String(v ?? "").trim());
  return Number.isFinite(x) ? x : 0;
}

function $(id) {
  return document.getElementById(id);
}

// ✅ 符號＋文字統一（全站唯一來源）
function okText(ok) {
  return ok ? "✔️ 達成" : "✖️ 未達成";
}

// ===== 儲存/讀取 =====
function saveToday() {
  const date = getCurrentDateStr();
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

/**
 * ✅ 從某天往回找「最近一次有資料的日期」（跳過休假日）
 * @param {string} fromDateStr - 從這天往回找（不含當天，預設找前一天開始）
 * @param {number} maxLookbackDays
 * @returns {string|null}
 */
function findPrevDateWithData(fromDateStr, maxLookbackDays = 60) {
  let cursor = addDaysToDateStr(fromDateStr, -1);
  for (let i = 0; i < maxLookbackDays; i++) {
    if (hasDataOnDate(cursor)) return cursor;
    cursor = addDaysToDateStr(cursor, -1);
  }
  return null;
}

/**
 * ✅ 取得「最近兩次有資料的日期」
 * d1 = 最近一次有資料（上一次上班日）
 * d0 = d1 再往前最近一次有資料（上上一次上班日）
 */
function getPrevTwoDataDates(todayStr) {
  const d1 = findPrevDateWithData(todayStr);
  if (!d1) return { d1: null, d0: null };
  const d0 = findPrevDateWithData(d1);
  return { d1, d0 };
}

/**
 * ✅ 取得「昨日KPI來源日」：
 * 先用「昨天」(today-1)；若昨天沒資料→回退到「最近一次有資料的日期」
 * （這樣休假日也不會空）
 */
function getKpiSourceDateForToday(todayStr) {
  const yesterday = addDaysToDateStr(todayStr, -1);
  if (hasDataOnDate(yesterday)) return yesterday;
  return findPrevDateWithData(todayStr);
}

// ===== 讀表單 =====
function collectForm() {
  const date = getCurrentDateStr();

  const obj = {
    date,
    store: $("store")?.value?.trim() || "",
    name: $("name")?.value?.trim() || "",

    // 今日外撥
    todayCallPotential: n($("todayCallPotential")?.value),
    todayCallOld3Y: n($("todayCallOld3Y")?.value),
    todayCallTotal: n($("todayCallTotal")?.value),
    todayInviteReturn: n($("todayInviteReturn")?.value),

    // 今日預約/到店
    todayBookingTotal: n($("todayBookingTotal")?.value),
    todayVisitTotal: n($("todayVisitTotal")?.value),

    // 試用/成交
    trialHA: n($("trialHA")?.value),
    trialAPAP: n($("trialAPAP")?.value),
    dealHA: n($("dealHA")?.value),
    dealAPAP: n($("dealAPAP")?.value),

    // 明日
    tomorrowBookingTotal: n($("tomorrowBookingTotal")?.value),
    tomorrowKpiCallTotal: n($("tomorrowKpiCallTotal")?.value),
    tomorrowKpiCallOld3Y: n($("tomorrowKpiCallOld3Y")?.value),
    tomorrowKpiTrial: n($("tomorrowKpiTrial")?.value),

    updatedAt: new Date().toISOString(),
  };

  // 保險：總通數重新算一次
  obj.todayCallTotal = obj.todayCallPotential + obj.todayCallOld3Y;

  return obj;
}

// ===== 寫回表單 =====
function fillForm(data) {
  if (!data) return;

  if ($("store")) $("store").value = data.store ?? "";
  if ($("name")) $("name").value = data.name ?? "";

  if ($("todayCallPotential")) $("todayCallPotential").value = data.todayCallPotential ?? "";
  if ($("todayCallOld3Y")) $("todayCallOld3Y").value = data.todayCallOld3Y ?? "";
  recalcTotals();

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

// ===== 計算外撥總通數 =====
function recalcTotals() {
  const p = n($("todayCallPotential")?.value);
  const o = n($("todayCallOld3Y")?.value);
  if ($("todayCallTotal")) $("todayCallTotal").value = p + o;
  saveToday();
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
// A) 今日目標：仍用「最近一次有資料」當作目標來源（跳過休假）
// B) 昨日執行檢視：維持「昨天（最近一次有資料） vs 前天（上上次有資料）」← 你指定只有這邊才這樣
function renderHuddle() {
  const today = getCurrentDateStr();
  const { d1, d0 } = getPrevTwoDataDates(today);

  const prevData = d1 ? loadByDate(d1) : null;

  // A) 今日目標（以最近一次有資料為準）
  if ($("huddleTodayBooking")) $("huddleTodayBooking").textContent = prevData?.tomorrowBookingTotal ?? "-";
  if ($("huddleTodayTrial")) $("huddleTodayTrial").textContent = prevData?.tomorrowKpiTrial ?? "-";
  if ($("huddleTodayCallTotal")) $("huddleTodayCallTotal").textContent = prevData?.tomorrowKpiCallTotal ?? "-";
  if ($("huddleTodayOld3Y")) $("huddleTodayOld3Y").textContent = prevData?.tomorrowKpiCallOld3Y ?? "-";

  // 今日預約：提示＆（可選）自動帶入
  const hintBox = $("todayBookingHint");
  const hintVal = $("todayBookingHintValue");
  if (hintBox && hintVal && prevData && Number.isFinite(Number(prevData.tomorrowBookingTotal))) {
    hintVal.textContent = prevData.tomorrowBookingTotal;
    hintBox.style.display = "block";

    if ($("todayBookingTotal") && String($("todayBookingTotal").value || "").trim() === "") {
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

  const targetTrial = n(kpiSetData.tomorrowKpiTrial);
  const targetCall = n(kpiSetData.tomorrowKpiCallTotal);
  const targetInvite = n(kpiSetData.tomorrowKpiCallOld3Y);

  const actualTrial = n(execData.trialHA) + n(execData.trialAPAP);
  const actualCall = n(execData.todayCallPotential) + n(execData.todayCallOld3Y);
  const actualInvite = n(execData.todayInviteReturn);

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
// ✅ 你指定：今日執行檢視 = 「今天實績」對照「昨天KPI」(昨天填的明日KPI)
// 若昨天休假沒資料 → 自動回退到「最近一次有資料」當 KPI 來源（避免空白）
function generateMessage() {
  saveToday();

  const d = collectForm();
  const title = `${d.date}｜${d.store || ""} ${d.name || ""}`.trim();

  const msg =
`${title}
1. 今日外撥：${d.todayCallTotal} 通（潛客 ${d.todayCallPotential} 通、過保舊客 ${d.todayCallOld3Y} 通）
2. 今日預約：${d.todayBookingTotal} 位
3. 今日到店：${d.todayVisitTotal} 位
   試用：HA ${d.trialHA} 位、APAP ${d.trialAPAP} 位
   成交：HA ${d.dealHA} 位、APAP ${d.dealAPAP} 位
4. 明日已排預約：${d.tomorrowBookingTotal} 位
5. 明日KPI：
   完成試戴 ${d.tomorrowKpiTrial} 位
   外撥 ${d.tomorrowKpiCallTotal} 通
   舊客預約 ${d.tomorrowKpiCallOld3Y} 位

📊 今日執行檢視（對照昨日 KPI）
${buildTodayVsYesterdayKpiText(d)}
`;

  if ($("output")) $("output").value = msg;

  // ===== ↓↓↓ 新增：直接送 Google Sheet（測試版）↓↓↓ =====
  try {
    const todayStr = d.date;
    const hash = simpleHash(msg);
    const lastHash = localStorage.getItem(sheetSentKey(todayStr));

    // 同一天同內容就不重送
    if (lastHash !== hash) {
      sendReportToSheet({
        date: d.date,
        store: d.store,
        name: d.name,

        calls_total: d.todayCallTotal,
        calls_potential: d.todayCallPotential,
        calls_old: d.todayCallOld3Y,

        appt_today: d.todayBookingTotal,
        visit_today: d.todayVisitTotal,

        trial_ha: d.trialHA,
        trial_apap: d.trialAPAP,
        deal_ha: d.dealHA,
        deal_apap: d.dealAPAP,

        appt_tomorrow: d.tomorrowBookingTotal,
        kpi_call_tomorrow: d.tomorrowKpiCallTotal,
        kpi_old_appt_tomorrow: d.tomorrowKpiCallOld3Y,
        kpi_trial_tomorrow: d.tomorrowKpiTrial,

        message_text: msg
      });

      localStorage.setItem(sheetSentKey(todayStr), hash);
    }
  } catch (err) {
    // no-cors 看不到回傳，這裡只做保底不影響同仁操作
    console.error("send to sheet failed:", err);
  }
  // ===== ↑↑↑ 新增結束 ↑↑↑ =====
}
window.generateMessage = generateMessage;

// ===== 今日執行檢視：今天 vs 昨日KPI =====
function buildTodayVsYesterdayKpiText(todayForm) {
  const todayStr = todayForm.date;

  // KPI 來源日：優先昨天，沒有就回退到最近一次有資料
  const kpiSourceDate = getKpiSourceDateForToday(todayStr);
  const kpiSourceData = kpiSourceDate ? loadByDate(kpiSourceDate) : null;

  if (!kpiSourceData) {
    return "•（找不到昨日 KPI：請確認前一個上班日有填寫「明日KPI」）";
  }

  // 「昨日KPI」其實是：昨天填的「明日KPI」
  const targetTrial = n(kpiSourceData.tomorrowKpiTrial);
  const targetCall = n(kpiSourceData.tomorrowKpiCallTotal);
  const targetInvite = n(kpiSourceData.tomorrowKpiCallOld3Y);

  // 今天實績（直接用目前表單數字，不用等存檔）
  const actualTrial = n(todayForm.trialHA) + n(todayForm.trialAPAP);
  const actualCall = n(todayForm.todayCallTotal); // 已是總通數
  const actualInvite = n(todayForm.todayInviteReturn);

  const rate = actualCall > 0 ? (actualInvite / actualCall) : 0;
  const pct = Math.round(rate * 100) + "%";

  // 額外提示 KPI 來源日（不想顯示就把這行刪掉）
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
  recalcTotals();

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
    recalcTotals();
    renderHuddle();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  bindAutoSave();
  initDateLoad();
  renderHuddle();
});
