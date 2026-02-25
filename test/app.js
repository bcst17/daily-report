console.log("✅ Jan Style app.js loaded with Monthly Plan Support");

// ✅ 測試版儲存前綴
const STORAGE_PREFIX = "daily-report-test-";

// ===== ↓↓↓ 當月計畫資料庫 (後台輸入區) ↓↓↓ =====
// 這裡可以預先輸入每位同仁的計畫，數量不限
const monthlyData = {
  "郭孟鑫": [
    { content: "提升聽助具銷售額", target: "達成率 110%" },
    { content: "完成 5 場社區衛教講座", target: "有效潛客 +20 位" },
    { content: "iPAS AI 證照研習", target: "完成模擬試題練習" }
  ],
  "陳詩潔": [
    { content: "優化售後回訪流程", target: "滿意度 4.8 顆星" },
    { content: "舊客回流專案", target: "邀約回店人數提升 15%" }
  ],
  "游瑟焄": [
    { content: "門市陳列優化", target: "完成春節主題佈置" }
  ],
  "魏頎恩": [
    { content: "2023往前的歷年舊客名單，針對半年以上未進店者聯繫", target: "每日聯繫四位，邀約目標2位回店(依3月份平均每日預約人數計算)" },
    { content: "2025年台大RS潛客，聯繫邀約至門市體驗Vauto", target: "不設定目標，方案一優先" }
  ],
  "李孟馨": [{ content: "客戶資料數位化", target: "完成 2024 年舊檔建檔" }],
  "劉瑋婷": [{ content: "新人教育訓練", target: "帶領新進同仁完成首單" }],
  "周曉玄": [{ content: "異業合作洽談", target: "新增 2 家合作藥局" }],
  "蕭純聿": [{ content: "官方帳號經營", target: "每週發布 2 篇衛教文" }],
  "陳宛妤": [{ content: "APAP 推廣計畫", target: "試戴轉換率提升至 30%" }],
  "林寓葳": [{ content: "店務流程簡化", target: "縮短掛號等待時間 5 分鐘" }],
  "吳欣珮": [{ content: "庫存管理優化", target: "達成零庫存差異目標" }],
  "呂桂梅": [{ content: "資深客戶關懷", target: "完成 50 位老客戶電話問候" }],
  "李俊諺": [{ content: "輔具補助諮詢", target: "協助 10 位客戶申請補助" }],
  "蔡秉忻": [{ content: "門市環境整潔", target: "達成 5S 評核優等" }]
};

// ===== ↓↓↓ Google Sheet 串接（測試版）↓↓↓ =====
const SHEET_INGEST_URL = "https://script.google.com/macros/s/AKfycbxwYN_YGa5W8Fqg8YrSPTFkhkqnLB61hZ3lFgU-5kIHTSK_DmasH573pv7GutF8wf8S/exec";
const INGEST_KEY = "dailyreport-key-2025";

function sheetSentKey(dateStr) { return `${STORAGE_PREFIX}sheet-sent-${dateStr}`; }
function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return String(h);
}

async function sendReportToSheet(payload) {
    fetch(SHEET_INGEST_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: INGEST_KEY, env: "test", ...payload })
    });
    return true;
}

// ===== 【二月更新】新年噴發：紅包與金幣 =====
function spawnNewYearShower() {
    const symbols = ['🧧', '🌸', '✨', '🏮', '🧨', '🍊'];
    const count = 18; 

    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        item.style.position = 'fixed';
        item.style.bottom = '80px';
        item.style.left = (Math.random() * 80 + 10) + '%';
        item.style.fontSize = (Math.random() * 25 + 15) + 'px';
        item.style.zIndex = '100';
        item.style.pointerEvents = 'none';
        item.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        document.body.appendChild(item);

        const destinationX = (Math.random() - 0.5) * 250;
        const destinationY = -(Math.random() * 400 + 150);

        requestAnimationFrame(() => {
            item.style.transform = `translate(${destinationX}px, ${destinationY}px) rotate(${Math.random() * 720}deg)`;
            item.style.opacity = '0';
        });

        setTimeout(() => item.remove(), 1200);
    }
}

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

function storageKey(dateStr) { return `${STORAGE_PREFIX}${dateStr}`; }
function $(id) { return document.getElementById(id); }
function v(id) { const el = $(id); return String(el ? (el.value ?? "") : "").trim(); }
function num(val) {
    const s = String(val ?? "").trim();
    if (s === "") return 0;
    const x = Number(s);
    return Number.isFinite(x) ? x : 0;
}
function okText(ok) { return ok ? "✔️ 達成" : "✖️ 未達成"; }

// ===== 儲存/讀取邏輯 =====
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

function hasDataOnDate(dateStr) { return localStorage.getItem(storageKey(dateStr)) != null; }

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
    const d0 = d1 ? findPrevDateWithData(d1) : null;
    return { d1, d0 };
}

function getKpiSourceDateForToday(todayStr) {
    const yesterday = addDaysToDateStr(todayStr, -1);
    return hasDataOnDate(yesterday) ? yesterday : findPrevDateWithData(todayStr);
}

function collectForm() {
    const date = getCurrentDateStr();
    const obj = {
        date, store: v("store"), name: v("name"),
        todayCallPotential: v("todayCallPotential"),
        todayCallOld3Y: v("todayCallOld3Y"),
        todayCallTotal: v("todayCallTotal"),
        todayInviteReturn: v("todayInviteReturn"),
        todayBookingTotal: v("todayBookingTotal"),
        todayVisitTotal: v("todayVisitTotal"),
        trialHA: v("trialHA"), trialAPAP: v("trialAPAP"),
        dealHA: v("dealHA"), dealAPAP: v("dealAPAP"),
        tomorrowBookingTotal: v("tomorrowBookingTotal"),
        tomorrowKpiCallTotal: v("tomorrowKpiCallTotal"),
        tomorrowKpiCallOld3Y: v("tomorrowKpiCallOld3Y"),
        tomorrowKpiTrial: v("tomorrowKpiTrial"),
        updatedAt: new Date().toISOString(),
    };
    const pRaw = obj.todayCallPotential;
    const oRaw = obj.todayCallOld3Y;
    obj.todayCallTotal = (pRaw === "" && oRaw === "") ? "" : String(num(pRaw) + num(oRaw));
    return obj;
}

function fillForm(data) {
    if (!data) return;
    ["store", "name", "todayCallPotential", "todayCallOld3Y", "todayInviteReturn",
     "todayBookingTotal", "todayVisitTotal", "trialHA", "trialAPAP", "dealHA", "dealAPAP",
     "tomorrowBookingTotal", "tomorrowKpiCallTotal", "tomorrowKpiCallOld3Y", "tomorrowKpiTrial"
    ].forEach(id => { if($(id)) $(id).value = data[id] ?? ""; });
    recalcTotals(false);
}

function recalcTotals(doSave = true) {
    const pRaw = v("todayCallPotential");
    const oRaw = v("todayCallOld3Y");
    if (!$("todayCallTotal")) return;
    $("todayCallTotal").value = (pRaw === "" && oRaw === "") ? "" : String(num(pRaw) + num(oRaw));
    if (doSave) saveToday();
}
window.recalcTotals = recalcTotals;

// ===== 分頁切換邏輯 (更新以支援新分頁) =====
function showView(view) {
    const views = {
        'huddle': $('huddle-view'),
        'report': $('report-view'),
        'plan': $('plan-view')
    };
    const tabs = {
        'huddle': $('tab-huddle'),
        'report': $('tab-report'),
        'plan': $('tab-plan')
    };

    // 切換顯示狀態
    Object.keys(views).forEach(key => {
        if (views[key]) views[key].classList.toggle("hidden", key !== view);
        if (tabs[key]) tabs[key].classList.toggle("active", key === view);
    });

    if (view === "huddle") renderHuddle();
}

// ===== 當月計畫渲染邏輯 (完整修正版) =====
function initPlanTab() {
    const select = $("plan-name-select");
    const container = $("plan-list-container");
    if (!select || !container) return;

    // --- 補回選單生成邏輯 ---
    // 清空並重新生成下拉選單選項 (確保與資料庫同步)
    select.innerHTML = '<option value="">-- 請選擇 --</option>';
    Object.keys(monthlyData).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        select.appendChild(opt);
    });

    // --- 監聽選擇事件並渲染卡片 ---
    select.addEventListener("change", () => {
        const name = select.value;
        container.innerHTML = "";

        if (!name || !monthlyData[name]) {
            container.innerHTML = '<p style="text-align:center; color:#999; font-size:14px;">請選擇姓名以查看計畫</p>';
            return;
        }

        // 生成任務卡片 (已將「計畫」改為「任務」，並優化間距)
        monthlyData[name].forEach((plan, index) => {
            const planEl = document.createElement("div");
            // 增加整體內距、圓角與陰影感
            planEl.style.cssText = "background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 18px; border-left: 6px solid var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05);";
            
            planEl.innerHTML = `
                <div style="font-weight: 800; color: var(--primary-dark); font-size: 19px; margin-bottom: 12px; border-bottom: 1px dashed var(--border); padding-bottom: 10px; letter-spacing: 1px;">任務 ${index + 1}</div>
                
                <div style="margin-bottom: 16px;">
                    <div style="font-weight: bold; color: var(--primary); font-size: 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 16px;">📌</span> 行動計畫內容
                    </div>
                    <div style="font-size: 15px; line-height: 1.8; color: #333; padding-left: 4px; text-align: justify; word-break: break-all;">
                        ${plan.content}
                    </div>
                </div>

                <div>
                    <div style="font-weight: bold; color: var(--primary); font-size: 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 16px;">🎯</span> 達成目標
                    </div>
                    <div style="font-size: 15px; line-height: 1.8; color: #444; padding-left: 4px; text-align: justify; word-break: break-all;">
                        ${plan.target}
                    </div>
                </div>
            `;
            container.appendChild(planEl);
        });
    });
}

function renderHuddle() {
    const today = getCurrentDateStr();
    const { d1, d0 } = getPrevTwoDataDates(today);
    const prevData = d1 ? loadByDate(d1) : null;

    if ($("huddleTodayBooking")) $("huddleTodayBooking").textContent = (prevData?.tomorrowBookingTotal ?? "-") || "-";
    if ($("huddleTodayTrial")) $("huddleTodayTrial").textContent = (prevData?.tomorrowKpiTrial ?? "-") || "-";
    if ($("huddleTodayCallTotal")) $("huddleTodayCallTotal").textContent = (prevData?.tomorrowKpiCallTotal ?? "-") || "-";
    if ($("huddleTodayOld3Y")) $("huddleTodayOld3Y").textContent = (prevData?.tomorrowKpiCallOld3Y ?? "-") || "-";

    const hintBox = $("todayBookingHint");
    if (hintBox && prevData?.tomorrowBookingTotal) {
        $("todayBookingHintValue").textContent = prevData.tomorrowBookingTotal;
        hintBox.style.display = "block";
        if (v("todayBookingTotal") === "") { $("todayBookingTotal").value = prevData.tomorrowBookingTotal; saveToday(); }
    } else if (hintBox) { hintBox.style.display = "none"; }

    const execData = d1 ? loadByDate(d1) : null;
    const kpiSetData = d0 ? loadByDate(d0) : null;
    if (!execData || !kpiSetData) return;

    const actualTrial = num(execData.trialHA) + num(execData.trialAPAP);
    const actualCall = num(execData.todayCallPotential) + num(execData.todayCallOld3Y);
    const actualInvite = num(execData.todayInviteReturn);

    $("checkTrialText").textContent = `目標 ${num(kpiSetData.tomorrowKpiTrial)} / 執行 ${actualTrial} ${okText(actualTrial >= num(kpiSetData.tomorrowKpiTrial))}`;
    $("checkCallText").textContent = `目標 ${num(kpiSetData.tomorrowKpiCallTotal)} / 執行 ${actualCall} ${okText(actualCall >= num(kpiSetData.tomorrowKpiCallTotal))}`;
    $("checkInviteText").textContent = `目標 ${num(kpiSetData.tomorrowKpiCallOld3Y)} / 執行 ${actualInvite} ${okText(actualInvite >= num(kpiSetData.tomorrowKpiCallOld3Y))}`;

    const rate = actualCall > 0 ? (actualInvite / actualCall) : 0;
    $("checkInviteRateText").textContent = Math.round(rate * 100) + "%";
    const badge = $("checkInviteRateBadge");
    if (badge) {
        badge.style.display = "inline-block";
        badge.className = "badge " + (rate >= 0.3 ? "green" : rate >= 0.15 ? "yellow" : "red");
        badge.textContent = rate >= 0.3 ? "高" : rate >= 0.15 ? "中" : "低";
    }
}

// ===== 產生訊息 =====
function generateMessage() {
    saveToday();
    spawnNewYearShower(); 
    
    const d = collectForm();
    const title = `${d.date}｜${(d.store || "")} ${(d.name || "")}`.trim();
    const todayCallTotal = num(d.todayCallPotential) + num(d.todayCallOld3Y);

    const msg = `${title}
1. 今日外撥：${todayCallTotal} 通（潛客 ${num(d.todayCallPotential)} 通、過保舊客 ${num(d.todayCallOld3Y)} 通）
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
${buildTodayVsYesterdayKpiText(d)}`;

    if ($("output")) $("output").value = msg;

    try {
        const hash = simpleHash(msg);
        if (localStorage.getItem(sheetSentKey(d.date)) !== hash) {
            sendReportToSheet({
                date: d.date, store: d.store, name: d.name,
                calls_total: todayCallTotal, calls_potential: num(d.todayCallPotential),
                calls_old: num(d.todayCallOld3Y), appt_today: num(d.todayBookingTotal),
                visit_today: num(d.todayVisitTotal), trial_ha: num(d.trialHA),
                trial_apap: num(d.trialAPAP), deal_ha: num(d.dealHA),
                deal_apap: num(d.dealAPAP), appt_tomorrow: num(d.tomorrowBookingTotal),
                kpi_call_tomorrow: num(d.tomorrowKpiCallTotal),
                kpi_old_appt_tomorrow: num(d.tomorrowKpiCallOld3Y),
                kpi_trial_tomorrow: num(d.tomorrowKpiTrial), message_text: msg
            });
            localStorage.setItem(sheetSentKey(d.date), hash);
        }
    } catch (err) { console.error("send to sheet failed:", err); }
}
window.generateMessage = generateMessage;

function buildTodayVsYesterdayKpiText(todayForm) {
    const kpiSourceDate = getKpiSourceDateForToday(todayForm.date);
    const kpiSourceData = kpiSourceDate ? loadByDate(kpiSourceDate) : null;
    if (!kpiSourceData) return "•（找不到昨日 KPI）";

    const actualTrial = num(todayForm.trialHA) + num(todayForm.trialAPAP);
    const actualCall = num(todayForm.todayCallPotential) + num(todayForm.todayCallOld3Y);
    const actualInvite = num(todayForm.todayInviteReturn);
    const rate = actualCall > 0 ? (actualInvite / actualCall) : 0;

    return [
        `• 試戴數：目標 ${num(kpiSourceData.tomorrowKpiTrial)} / 執行 ${actualTrial}  ${okText(actualTrial >= num(kpiSourceData.tomorrowKpiTrial))}`,
        `• 外撥通數：目標 ${num(kpiSourceData.tomorrowKpiCallTotal)} / 執行 ${actualCall}  ${okText(actualCall >= num(kpiSourceData.tomorrowKpiCallTotal))}`,
        `• 邀約回店數：目標 ${num(kpiSourceData.tomorrowKpiCallOld3Y)} / 執行 ${actualInvite}  ${okText(actualInvite >= num(kpiSourceData.tomorrowKpiCallOld3Y))}`,
        `• 邀約成功率：${Math.round(rate * 100)}%`.trim(),
    ].join("\n");
}

async function copyMessage() {
    const text = $("output")?.value || "";
    if (!text.trim()) return;
    spawnNewYearShower(); 

    try {
        await navigator.clipboard.writeText(text);
        alert("🧧 訊息已複製！祝您業績長紅！");
    } catch {
        const ta = $("output");
        if (ta) { ta.select(); document.execCommand("copy"); alert("✨ 已複製到剪貼簿！"); }
    }
}
window.copyMessage = copyMessage;

// ===== 初始化邏輯 =====
function bindAutoSave() {
    [ "store","name","todayCallPotential","todayCallOld3Y","todayInviteReturn",
      "todayBookingTotal","todayVisitTotal","trialHA","trialAPAP","dealHA","dealAPAP",
      "tomorrowBookingTotal","tomorrowKpiCallTotal","tomorrowKpiCallOld3Y","tomorrowKpiTrial"
    ].forEach(id => {
        const el = $(id);
        if (el) { el.addEventListener("input", saveToday); el.addEventListener("change", saveToday); }
    });
}

function initDateLoad() {
    const dateInput = $("date");
    if (!dateInput) return;
    const today = getCurrentDateStr();
    const data = loadByDate(today);
    if (data) fillForm(data);
    recalcTotals(false);

    dateInput.addEventListener("change", () => {
        document.querySelectorAll("input[type='number'], input[type='text'], select").forEach(el => {
            if (el.id !== "date") el.value = "";
        });
        const d = loadByDate(getCurrentDateStr());
        if (d) fillForm(d);
        recalcTotals(false);
        renderHuddle();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // 綁定分頁按鈕
    if($("tab-huddle")) $("tab-huddle").addEventListener("click", () => showView("huddle"));
    if($("tab-report")) $("tab-report").addEventListener("click", () => showView("report"));
    if($("tab-plan")) $("tab-plan").addEventListener("click", () => showView("plan"));

    bindAutoSave();
    initDateLoad();
    renderHuddle();
    initPlanTab(); // 初始化當月計畫分頁邏輯
});
