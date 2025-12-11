// 專門給 test 版用的儲存前綴（之後自動帶入昨天資料會用到）
const STORAGE_PREFIX = "daily-report-test-";

// 預設日期：打開頁面時自動帶入今天
function setDefaultDate() {
  const d = new Date();
  const m = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.value = `${d.getFullYear()}-${m}-${day}`;
  }
}

// 取得數字欄位的值（原本的 getNum）
function getNum(id) {
  const el = document.getElementById(id);
  return parseInt((el && el.value) || 0);
}

// 計算今日外撥總通數（原本的 recalcTotals）
function recalcTotals() {
  const total =
    getNum("todayCallPotential") + getNum("todayCallOld3Y");
  const inputTotal = document.getElementById("todayCallTotal");
  if (inputTotal) {
    inputTotal.value = total || "";
  }
}

// 產生訊息（原本的 generateMessage）
function generateMessage() {
  const dateValue = document.getElementById("date").value || "";
  const d = dateValue.replace(/-/g, "/");
  const s = document.getElementById("store").value || "門市";
  const n = document.getElementById("name").value || "姓名";

  const msg =
`${d}｜${s} ${n}
1. 今日外撥：${getNum("todayCallTotal")} 通（潛在 ${getNum("todayCallPotential")} 通、過保舊客 ${getNum("todayCallOld3Y")} 通）
2. 今日預約：${getNum("todayBookingTotal")} 位
3. 今日到店：${getNum("todayVisitTotal")} 位
   試用：HA ${getNum("trialHA")} 位、APAP ${getNum("trialAPAP")} 位
   成交：HA ${getNum("dealHA")} 位、APAP ${getNum("dealAPAP")} 位
4. 明日已排預約：${getNum("tomorrowBookingTotal")} 位
5. 明日KPI:
   外撥 ${getNum("tomorrowKpiCallTotal")} 通
   舊客預約 ${getNum("tomorrowKpiCallOld3Y")} 位
   完成試戴 ${getNum("tomorrowKpiTrial")} 位`;

  const output = document.getElementById("output");
  if (output) {
    output.value = msg;
  }
}

// 複製文字（原本的 copyMessage）
function copyMessage() {
  const o = document.getElementById("output");
  if (!o) return;

  o.select();
  o.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("已複製，前往企業微信貼上即可！");
}

// 分頁切換：Morning Huddle / 每日回報
function setupTabs() {
  const tabHuddle = document.getElementById("tab-huddle");
  const tabReport = document.getElementById("tab-report");
  const huddleView = document.getElementById("huddle-view");
  const reportView = document.getElementById("report-view");

  if (!tabHuddle || !tabReport || !huddleView || !reportView) {
    console.warn("有些 tab 或 section 找不到，請檢查 index.html 的 id 是否對應。");
    return;
  }

  // 預設顯示「每日回報」
  huddleView.classList.add("hidden");
  reportView.classList.remove("hidden");
  tabReport.classList.add("active");
  tabHuddle.classList.remove("active");

  tabHuddle.addEventListener("click", () => {
    huddleView.classList.remove("hidden");
    reportView.classList.add("hidden");
    tabHuddle.classList.add("active");
    tabReport.classList.remove("active");
  });

  tabReport.addEventListener("click", () => {
    huddleView.classList.add("hidden");
    reportView.classList.remove("hidden");
    tabReport.classList.add("active");
    tabHuddle.classList.remove("active");
  });
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  setDefaultDate();
  setupTabs();
});

