console.log("✅ official app.js loaded");

// ✅ 正式版儲存前綴（避免跟測試版混在一起）
const STORAGE_PREFIX = "daily-report-";

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
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const mm = ("0" + (dt.getMonth() + 1)).slice(-2);
  const dd = ("0" + dt.getDate()).slice(-2);
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

// ===== localStorage =====

function getStorageKey(dateStr) {
  return STORAGE_PREFIX + dateStr;
}

function loadReport(dateStr) {
  try {
    const raw = localStorage.getItem(getStorageKey(dateStr));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveReport(dateStr, data) {
  localStorage.setItem(getStorageKey(dateStr), JSON.stringify(data));
}

// ===== 表單工具 =====

function getNum(id) {
  const el = document.getElementById(id);
  return parseInt((el && el.value) || 0);
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (!el || value === undefined || value === null || value === "") return;
  el.value = value;
}

// ===== 套回資料 =====

function applyDataToForm(data) {
  if (!data) return;

  setInputValue("store", data.store);
  setInputValue("name", data.name);

  setInputValue("todayCallPotential", data.todayCallPotential);
  setInputValue("todayCallOld3Y", data.todayCallOld3Y);
  setInputValue("todayCallTotal", data.todayCallTotal);
  setInputValue("todayInviteReturn", data.todayInviteReturn);
  setInputValue("todayBookingTotal", data.todayBookingTotal);
  setInputValue("todayVisitTotal", data.todayVisitTotal);
  setInputValue("trialHA", data.trialHA);
  setInputValue("trialAPAP", data.trialAPAP);
  setInputValue("dealHA", data.dealHA);
  setInputValue("dealAPAP", data.dealAPAP);

  setInputValue("tomorrowBookingTotal", data.tomorrowBookingTotal);
  setInputValue("tomorrowKpiCallTotal", data.tomorrowKpiCallTotal);
  setInputValue("tomorrowKpiCallOld3Y", data.tomorrowKpiCallOld3Y);
  setInputValue("tomorrowKpiTrial", data.tomorrowKpiTrial);
}

function collectTodayFormData() {
  return {
    date: getCurrentDateStr(),
    store: document.getElementById("store")?.value || "",
    name: document.getElementById("name")?.value || "",

    todayCallPotential: getNum("todayCallPotential"),
    todayCallOld3Y: getNum("todayCallOld3Y"),
    todayCallTotal: getNum("todayCallTotal"),
    todayInviteReturn: getNum("todayInviteReturn"),
    todayBookingTotal: getNum("todayBookingTotal"),
    todayVisitTotal: getNum("todayVisitTotal"),
    trialHA: getNum("trialHA"),
    trialAPAP: getNum("trialAPAP"),
    dealHA: getNum("dealHA"),
    dealAPAP: getNum("dealAPAP"),

    tomorrowBookingTotal: getNum("tomorrowBookingTotal"),
    tomorrowKpiCallTotal: getNum("tomorrowKpiCallTotal"),
    tomorrowKpiCallOld3Y: getNum("tomorrowKpiCallOld3Y"),
    tomorrowKpiTrial: getNum("tomorrowKpiTrial"),
  };
}

// ===== 計算 =====

function recalcTotals() {
  const total = getNum("todayCallPotential") + getNum("todayCallOld3Y");
  const el = document.getElementById("todayCallTotal");
  if (el) el.value = total || "";
}

// ===== 初始化每日回報 =====

function initReportData() {
  const today = getCurrentDateStr();
  const yesterday = addDaysToDateStr(today, -1);

  const todayData = loadReport(today);
  const yesterdayData = loadReport(yesterday);

  if (todayData) applyDataToForm(todayData);
  recalcTotals();

  // 今日預約：若空白，帶入昨日的「明日已排預約」
  const todayBooking = document.getElementById("todayBookingTotal");
  const hint = document.getElementById("todayBookingHint");
  const hintValue = document.getElementById("todayBookingHintValue");

  if (
    todayBooking &&
    todayBooking.value === "" &&
    yesterdayData &&
    typeof yesterdayData.tomorrowBookingTotal === "number"
  ) {
    todayBooking.value = yesterdayData.tomorrowBookingTotal;
    if (hint && hintValue) {
      hintValue.textContent = yesterdayData.tomorrowBookingTotal;
      hint.style.display = "block";
    }
  }
}

// ===== Morning Huddle（含昨日執行檢視：前天KPI對照昨天） =====

function initMorningHuddle() {
  const today = getCurrentDateStr();
  const yesterday = addDaysToDateStr(today, -1);
  const dayBefore = addDaysToDateStr(today, -2);

  const yesterdayData = loadReport(yesterday);
  const kpiSource = loadReport(dayBefore);

  if (!yesterdayData) return;

  // 今日目標（昨天填的「明日」）
  if (typeof yesterdayData.tomorrowBookingTotal === "number")
    document.getElementById("huddleTodayBooking").textContent =
      yesterdayData.tomorrowBookingTotal;

  if (typeof yesterdayData.tomorrowKpiCallTotal === "number")
    document.getElementById("huddleTodayCallTotal").textContent =
      yesterdayData.tomorrowKpiCallTotal;

  if (typeof yesterdayData.tomorrowKpiCallOld3Y === "number")
    document.getElementById("huddleTodayOld3Y").textContent =
      yesterdayData.tomorrowKpiCallOld3Y;

  if (typeof yesterdayData.tomorrowKpiTrial === "number")
    document.getElementById("huddleTodayTrial").textContent =
      yesterdayData.tomorrowKpiTrial;

  // 昨日執行檢視（前天KPI 對照 昨天實際）
  if (!kpiSource) return;

  function renderCheck(id, actual, target) {
    const el = document.getElementById(id);
    if (!el) return;

    // target = 0 視為沒有設定 KPI
    if (!target) {
      el.textContent = `目標 - / 執行 ${actual}　—`;
      return;
    }
    const ok = actual >= target;
    el.textContent = `目標 ${target} / 執行 ${actual}　${ok ? "✔ 達成" : "✖ 未達成"}`;
  }

  renderCheck(
    "checkTrialText",
    (yesterdayData.trialHA || 0) + (yesterdayData.trialAPAP || 0),
    kpiSource.tomorrowKpiTrial || 0
  );

  renderCheck(
    "checkCallText",
    yesterdayData.todayCallTotal || 0,
    kpiSource.tomorrowKpiCallTotal || 0
  );

  renderCheck(
    "checkInviteText",
    yesterdayData.todayInviteReturn || 0,
    kpiSource.tomorrowKpiCallOld3Y || 0
  );

  // 邀約成功率（Badge）
  const rateText = document.getElementById("checkInviteRateText");
  const badge = document.getElementById("checkInviteRateBadge");

  const calls = yesterdayData.todayCallTotal || 0;
  const invites = yesterdayData.todayInviteReturn || 0;

  if (rateText) rateText.textContent = "-";
  if (badge) badge.style.display = "none";

  if (calls > 0 && rateText && badge) {
    const rate = Math.round((invites / calls) * 100);
    rateText.textContent = `${rate}%`;
    badge.style.display = "inline-block";
    badge.className =
      "badge " + (rate >= 20 ? "green" : rate >= 10 ? "yellow" : "red");
    badge.textContent = rate >= 20 ? "高" : rate >= 10 ? "中" : "低";
  }
}

// ===== ✅ 產生訊息（加入：成功邀約回店 + 今日執行檢視(對照昨日KPI)） =====

function generateMessage() {
  recalcTotals();

  const today = getCurrentDateStr();
  const yesterday = addDaysToDateStr(today, -1);
  const yesterdayData = loadReport(yesterday); // ✅ 用昨天的「明日KPI」當今天對照來源

  // 先把今天資料存起來
  const todayData = collectTodayFormData();
  saveReport(today, todayData);

  const d = (document.getElementById("date").value || "").replace(/-/g, "/");
  const s = document.getElementById("store").value || "門市";
  const n = document.getElementById("name").value || "姓名";

  const callTotal = getNum("todayCallTotal");
  const callPotential = getNum("todayCallPotential");
  const callOld3Y = getNum("todayCallOld3Y");
  const inviteReturn = getNum("todayInviteReturn");

  const trialTotal = getNum("trialHA") + getNum("trialAPAP");

  // ===== 今日執行檢視（對照昨日 KPI）=====
  function buildTodayCheckBlock() {
    if (!yesterdayData) return ""; // 找不到昨日資料就先不顯示

    const targetTrial = yesterdayData.tomorrowKpiTrial || 0;
    const targetCall = yesterdayData.tomorrowKpiCallTotal || 0;
    const targetInvite = yesterdayData.tomorrowKpiCallOld3Y || 0;

    const line = (label, target, actual) => {
      if (!target) return `・${label}：目標 - / 執行 ${actual}`;
      return `・${label}：目標 ${target} / 執行 ${actual}　${
        actual >= target ? "✔ 達成" : "✖ 未達成"
      }`;
    };

    let rateLine = "・邀約成功率：-";
    if (callTotal > 0) {
      const rate = Math.round((inviteReturn / callTotal) * 100);
      rateLine = `・邀約成功率：${rate}%`;
    }

    return `
📊 今日執行檢視（對照昨日 KPI）
${line("試戴數", targetTrial, trialTotal)}
${line("外撥通數", targetCall, callTotal)}
${line("邀約回店數", targetInvite, inviteReturn)}
${rateLine}`;
  }

  const checkBlock = buildTodayCheckBlock();

  const msg = `${d}｜${s} ${n}
1. 今日外撥：
　${callTotal} 通（潛在 ${callPotential} 通、過保舊客 ${callOld3Y} 通）
　成功邀約回店 ${inviteReturn} 位
2. 今日預約：${getNum("todayBookingTotal")} 位
3. 今日到店：${getNum("todayVisitTotal")} 位
　試用：HA ${getNum("trialHA")} 位、APAP ${getNum("trialAPAP")} 位
　成交：HA ${getNum("dealHA")} 位、APAP ${getNum("dealAPAP")} 位
4. 明日已排預約：${getNum("tomorrowBookingTotal")} 位
5. 明日KPI：
　完成試戴 ${getNum("tomorrowKpiTrial")} 位
　外撥 ${getNum("tomorrowKpiCallTotal")} 通
　舊客預約 ${getNum("tomorrowKpiCallOld3Y")} 位${checkBlock ? "\n" + checkBlock : ""}`;

  document.getElementById("output").value = msg;
}

// ===== 複製（優先用 clipboard API，失敗再 fallback） =====

async function copyMessage() {
  const o = document.getElementById("output");
  if (!o) return;

  const text = o.value || "";
  if (!text.trim()) {
    alert("目前沒有可複製的文字，請先按『產生訊息』");
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      o.focus();
      o.select();
      o.setSelectionRange(0, 99999);
      document.execCommand("copy");
    }
    alert("已複製，前往企業微信貼上即可！");
  } catch (err) {
    // 最後保底：仍用選取讓使用者手動複製
    o.focus();
    o.select();
    o.setSelectionRange(0, 99999);
    alert("自動複製失敗，已幫你選取文字，請手動複製。");
    console.error(err);
  }
}

// ===== Tabs =====

function setupTabs() {
  const h = document.getElementById("tab-huddle");
  const r = document.getElementById("tab-report");
  const hv = document.getElementById("huddle-view");
  const rv = document.getElementById("report-view");

  if (!h || !r || !hv || !rv) return;

  h.onclick = () => {
    hv.classList.remove("hidden");
    rv.classList.add("hidden");
    h.classList.add("active");
    r.classList.remove("active");
  };

  r.onclick = () => {
    hv.classList.add("hidden");
    rv.classList.remove("hidden");
    r.classList.add("active");
    h.classList.remove("active");
  };
}

// ===== Init =====

document.addEventListener("DOMContentLoaded", () => {
  getCurrentDateStr();
  setupTabs();
  initReportData();
  initMorningHuddle();
});

// ✅✅✅ 讓 index.html 的 onclick / oninput 找得到（正式版「按了沒反應」通常就是缺這段）
window.recalcTotals = recalcTotals;
window.generateMessage = generateMessage;
window.copyMessage = copyMessage;
