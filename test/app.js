console.log("🪵 May Vibe app.js loaded: Dinotaeng & Marsh Edition");

// ✅ 測試版儲存前綴
const STORAGE_PREFIX = "daily-report-test-";
const PROGRESS_API_URL = "https://script.google.com/macros/s/AKfycbyrm3inO0h3qQf3hpKGCuQrNk68clolrYTXo5ncwEblDghytWB29dMIKA1LenjyIAr0qw/exec";

// 💡 請在 app.js 的最上方（或 PROGRESS_API_URL 下方）新增這行，用來存放抓回來的歷史資料
let globalHistoryData = {};

// ===== ↓↓↓ 當月計畫資料庫 (後台輸入區) ↓↓↓ =====
// 這裡可以預先輸入每位同仁的計畫，數量不限
const monthlyData = {
  "郭孟鑫": [
    { content: "優先聯繫 2014-2024 站前歷年成交且掛名之有效名單", target: "推估 70 筆，於月底前完成，並提供介紹卡", customerType: "舊客", itemType: "HA" },
    { content: "癌醫駐點陳醫師轉介流程溝通", target: "聽損新客 100% 回聽檢室進行聽力衛教，創造進店", customerType: "新客", itemType: "HA" }
  ],
  "陳詩潔": [
    { content: "每個月固定要追蹤前一個月的台大潛客 (例如每周一1300~1330)", target: "自己的雲端紀錄聯繫狀況(下次面談確認)", customerType: "潛客", itemType: "HA" }
  ],
  "游瑟焄": [
    { content: "鎖定林長進店保外舊客開發試聽", target: "每周 1~2 位舊客試聽", customerType: "舊客", itemType: "HA" },
  ],
  "魏頎恩": [
    { content: "提升助聽器業績佔比，針對 2021 年前站前潛客進行致電聯繫", target: "每週致電 10 筆接通", customerType: "潛客", itemType: "HA" }
  ],
  "李孟馨": [
    { content: "目前缺口在RS，但用HA補。台大近一年HA潛客名單", target: "每周聯繫 5 個 (周二台大 RS 駐點 13:00~13:30 較有空檔)", customerType: "潛客", itemType: "HA" },
    { content: "聯繫台大歷年舊客 (有效、高階、過保)，優先邀約回站前店", target: "共 57 位名單，日均致電約 4 位", customerType: "舊客", itemType: "HA" }
  ],
  "劉瑋婷": [
    { content: "金山南潛客名單（客編從 2024/06 往前，條件：住附近、潛客），另請梅子姐過濾無效名單", target: "每日 5 通（在站前值班時完成），合計每週 10 通", customerType: "潛客", itemType: "HA" }
  ],
  "周曉玄": [
    { content: "聯繫 2019~2021 忠孝門市 HA 潛客（工讀生初篩）", target: "每週接通 5 筆、20% 回店率", customerType: "潛客", itemType: "HA" },
    { content: "指派工讀生 APAP 舊客檢測流程，執行報告講解及AS11資訊提供", target: "3/14 完成教導並開始執行", customerType: "舊客", itemType: "RS" }
  ],
  "蕭純聿": [
    { content: "提升舊客成交率：1. 以單一個案與教育訓練討論服務內容及新舊機差異展示方式；2. 秉忻確認舊客試聽服務影片後回饋優化建議", target: "舊客成交率 47% (區域門市平均)", customerType: "舊客", itemType: "HA" },
    { content: "針對台大 2025 的 HA 潛客做追蹤（利用週五彈性時間）", target: "下次面談時完成 50% 的聯繫進度", customerType: "潛客", itemType: "HA" }
  ],
  "陳宛妤": [
    { content: "優化門市排程效益：建議拉長保內舊客回店頻率至 4 個月以上並縮短單人服務時間", target: "下次面談討論", customerType: "舊客", itemType: "HA" },
    { content: "提升 APAP 成交率：每月邀請睡眠技師陪同暫借預約，了解諮商狀況", target: "每月至少 2 位陪同，目標成交率提升至50% ", customerType: "新客", itemType: "RS" },
    { content: "運用 2025 忠孝潛客名單邀約 HST 或 APAP 暫借，以彌補第一季 RS 缺口", target: "每月 24 筆接通（每週 6 筆）", customerType: "潛客", itemType: "RS" }
  ],
  "林寓葳": [
    { content: "篩選天母 6 個月以上未聽檢舊客名單邀約進店（進店送 5 點，帶友加送 5 點）", target: "4 月底前完成至少 10 個舊客聽檢", customerType: "舊客", itemType: "HA" },
    { content: "整理 2015-2016 剩餘 HA 舊客名單（填寫類別與狀況）並開始聯繫 2025 年以前潛客", target: "每週聯繫 10 通有接通潛客，邀約 1 位回店", customerType: "潛客", itemType: "HA" },
    { content: "針對 2025 年 RS 未成交的個案進行聯繫", target: "下次面談前確認進度", customerType: "潛客", itemType: "RS" }
  ],
  "吳欣珮": [
    { content: "本月達標差額約30萬，優先聯繫近一年潛客名單（秉忻已提供）。", target: "每日完成兩筆接通，由聽力重的優先。", customerType: "潛客", itemType: "HA" }
  ],
  "呂桂梅": [
    { content: "八德2025RS潛客，針對AHI由高至低依序聯繫，如有成功邀約但沒機器，及時通知秉忻。", target: "每日完成3~5筆聯繫，目標邀約回店做HST重測或APAP再次暫借。", customerType: "潛客", itemType: "RS" }
  ],
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

// ===== 【三月更新】櫻花與鈴鐺噴發特效 =====


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
    // 確保這裡的 ID 與 HTML 中的 ID 一一對應
    const views = { 
        'huddle': $('huddle-view'), 
        'plan': $('plan-view'), 
        'history': $('history-view') 
    };
    
    const tabs = { 
        'huddle': $('tab-huddle'), 
        'plan': $('tab-plan'), 
        'history': $('tab-history') 
    };

    Object.keys(views).forEach(key => {
        if (views[key]) {
            views[key].classList.toggle("hidden", key !== view);
        }
        if (tabs[key]) {
            tabs[key].classList.toggle("active", key === view);
        }
    });

    if (view === "huddle") {
        try { fetchAndRenderProgress(); } catch(e) { console.error(e); }
        try { renderHuddle(); } catch(e) { console.error(e); }
    } else if (view === "history") {
        try { renderStarryMap(); } catch(e) { console.error(e); }
    }
}

// ===== 當月計畫渲染邏輯 (移除 Emoji 版) =====
// app.js 中的 initPlanTab 函式
function initPlanTab() {
    const selectName = $("plan-name-select");
    const selectCustomer = $("filter-customer");
    const selectItem = $("filter-item");
    const container = $("plan-list-container");

    if (!selectName || !container) return;

    // 1. 生成姓名下拉選單 (維持原樣)
    selectName.innerHTML = '<option value="">-- 全區同仁 --</option>';
    Object.keys(monthlyData).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        selectName.appendChild(opt);
    });

    // 核心渲染函式
    const renderPlans = () => {
        const selectedName = selectName.value;
        const filterCust = selectCustomer.value;
        const filterItem = selectItem.value;

        container.innerHTML = "";

        // 2. 資料彙整策略 (維持原樣)
        let tasksToFilter = [];
        if (selectedName === "") {
            Object.entries(monthlyData).forEach(([name, tasks]) => {
                tasks.forEach(task => {
                    if (task.content.trim() !== "" || task.target.trim() !== "") {
                        tasksToFilter.push({ ...task, staffName: name });
                    }
                });
            });
        } else {
            const individualTasks = monthlyData[selectedName] || [];
            tasksToFilter = individualTasks.map(task => ({ ...task, staffName: selectedName }));
        }

        // 3. 執行交叉篩選 (維持原樣)
        const filteredData = tasksToFilter.filter(plan => {
            const matchCust = (filterCust === "all" || plan.customerType === filterCust);
            const matchItem = (filterItem === "all" || plan.itemType === filterItem);
            return matchCust && matchItem;
        });

        if (filteredData.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#999; font-size:14px; margin-top:20px;">目前無符合篩選條件的計畫內容</p>';
            return;
        }

        // 4. 生成任務卡片 (更新標籤樣式)
        filteredData.forEach((plan, index) => {
            const planEl = document.createElement("div");
            planEl.style.cssText = "background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 18px; border-left: 6px solid var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); position:relative;";
            
            // 標籤顏色定義 (使用較明亮的顏色)
            const custColor = plan.customerType === '潛客' ? '#FF6B6B' : (plan.customerType === '新客' ? '#4D96FF' : '#8D6E63'); // 舊客改用溫和的咖啡色
            const itemColor = plan.itemType === 'RS' ? '#6BCB77' : '#FFA41B'; // RS綠，HA橘

            // 標籤文字縮減邏輯
            const custAbbr = plan.customerType ? plan.customerType.substring(0, 1) : '?';
            const itemAbbr = plan.itemType ? plan.itemType.substring(0, 1) : '?';

            // 定義圓形標籤的統一 CSS 樣式
            const tagCircleStyle = "display:inline-flex; justify-content:center; align-items:center; width:26px; height:26px; border-radius:50%; color:#fff; font-size:14px; font-weight:bold; box-sizing:border-box; box-shadow: 1px 1px 3px rgba(0,0,0,0.1);";

            planEl.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px; border-bottom: 1px dashed var(--border); padding-bottom: 10px;">
                    <div>
                        <div style="font-weight: 800; color: var(--primary-dark); font-size: 18px;">${plan.staffName}</div>
                        <div style="font-size: 12px; color: #999; margin-top: 2px;">任務序號 #${index + 1}</div>
                    </div>
                    <div style="display:flex; gap: 6px; align-items:center;">
                        <span style="${tagCircleStyle} background:${custColor};" title="${plan.customerType || '未分類'}">${custAbbr}</span>
                        <span style="${tagCircleStyle} background:${itemColor};" title="${plan.itemType || '未分類'}">${itemAbbr}</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <div style="font-weight: bold; color: var(--primary); font-size: 13px; margin-bottom: 4px;">行動方案</div>
                    <div style="font-size: 15px; line-height: 1.6; color: #333; text-align: justify;">${plan.content}</div>
                </div>

                <div>
                    <div style="font-weight: bold; color: var(--primary); font-size: 13px; margin-bottom: 4px;">預期目標</div>
                    <div style="font-size: 15px; line-height: 1.6; color: #666; text-align: justify;">${plan.target}</div>
                </div>
            `;
            container.appendChild(planEl);
        });
    };

    // 監聽變更
    [selectName, selectCustomer, selectItem].forEach(el => el.addEventListener("change", renderPlans));
    
    // 初始化執行一次渲染（預設顯示全區）
    renderPlans();
}

function renderHuddle() {
    const today = getCurrentDateStr();
    const { d1, d0 } = getPrevTwoDataDates(today);
    const prevData = d1 ? loadByDate(d1) : null;

    // 🚀 加上安全檢查：先確認元素存在 (if ($("..."))) 再賦值
    if ($("huddleTodayBooking")) $("huddleTodayBooking").textContent = (prevData?.tomorrowBookingTotal ?? "-") || "-";
    if ($("huddleTodayTrial")) $("huddleTodayTrial").textContent = (prevData?.tomorrowKpiTrial ?? "-") || "-";
    if ($("huddleTodayCallTotal")) $("huddleTodayCallTotal").textContent = (prevData?.tomorrowKpiCallTotal ?? "-") || "-";
    if ($("huddleTodayOld3Y")) $("huddleTodayOld3Y").textContent = (prevData?.tomorrowKpiCallOld3Y ?? "-") || "-";

    const hintBox = $("todayBookingHint");
    if (hintBox && prevData?.tomorrowBookingTotal) {
        if ($("todayBookingHintValue")) $("todayBookingHintValue").textContent = prevData.tomorrowBookingTotal;
        hintBox.style.display = "block";
        if (v("todayBookingTotal") === "") { 
            if ($("todayBookingTotal")) $("todayBookingTotal").value = prevData.tomorrowBookingTotal; 
            saveToday(); 
        }
    } else if (hintBox) { 
        hintBox.style.display = "none"; 
    }

    const execData = d1 ? loadByDate(d1) : null;
    const kpiSetData = d0 ? loadByDate(d0) : null;
    if (!execData || !kpiSetData) return;

    const actualTrial = num(execData.trialHA) + num(execData.trialAPAP);
    const actualCall = num(execData.todayCallPotential) + num(execData.todayCallOld3Y);
    const actualInvite = num(execData.todayInviteReturn);

    // 🚀 這裡也是安全檢查
    if ($("checkTrialText")) $("checkTrialText").textContent = `目標 ${num(kpiSetData.tomorrowKpiTrial)} / 執行 ${actualTrial} ${okText(actualTrial >= num(kpiSetData.tomorrowKpiTrial))}`;
    if ($("checkCallText")) $("checkCallText").textContent = `目標 ${num(kpiSetData.tomorrowKpiCallTotal)} / 執行 ${actualCall} ${okText(actualCall >= num(kpiSetData.tomorrowKpiCallTotal))}`;
    if ($("checkInviteText")) $("checkInviteText").textContent = `目標 ${num(kpiSetData.tomorrowKpiCallOld3Y)} / 執行 ${actualInvite} ${okText(actualInvite >= num(kpiSetData.tomorrowKpiCallOld3Y))}`;

    const rate = actualCall > 0 ? (actualInvite / actualCall) : 0;
    if ($("checkInviteRateText")) $("checkInviteRateText").textContent = Math.round(rate * 100) + "%";
    const badge = $("checkInviteRateBadge");
    if (badge) {
        badge.style.display = "inline-block";
        badge.className = "badge " + (rate >= 0.3 ? "green" : rate >= 0.15 ? "yellow" : "red");
        badge.textContent = rate >= 0.3 ? "高" : rate >= 0.15 ? "中" : "低";
    }
}

// 🚀 修改後的 fetchAndRenderProgress：一人一個圖卡，內部顯示多個進度條
async function fetchAndRenderProgress() {
    const container = $("progress-dashboard");
    if (!container) return;

    try {
        const response = await fetch(PROGRESS_API_URL);
        if (!response.ok) throw new Error("網路請求失敗");
        
        const tasks = await response.json(); 
        container.innerHTML = ""; 

        if (tasks.length === 0) {
            container.innerHTML = "<p style='text-align:center; color:#999;'>Task_Config 中尚無任務設定</p>";
            return;
        }

        // --- 1. 資料分組邏輯：將同仁姓名作為 Key，把任務塞進對應陣列 ---
        const groupedTasks = tasks.reduce((acc, task) => {
            if (!acc[task.staffName]) {
                acc[task.staffName] = [];
            }
            acc[task.staffName].push(task);
            return acc;
        }, {});

        // --- 2. 渲染邏輯：遍歷每個「同仁」生成一個大圖卡 ---
        Object.entries(groupedTasks).forEach(([staffName, staffTasks]) => {
            
            // 生成該同仁內部的所有進度條 HTML
            const taskRowsHtml = staffTasks.map(task => {
                const barColor = task.percent >= 80 ? "#A8B890" : "#E5B083"; 
        return `
            <div style="margin-bottom: 20px;">
                <div style="display:flex; justify-content:space-between; align-items:end; margin-bottom:8px;">
                    <span style="font-size:14px; font-weight:bold; color:#5C4033;">${task.taskName}</span>
                    <span style="font-weight:900; color:${barColor}; font-size:15px;">${task.completed} / ${task.target} 筆</span>
                </div>
                <div style="background:#EFEBE5; height:12px; border-radius:10px; overflow:hidden;">
                    <div style="background:${barColor}; width:${task.percent}%; height:100%; transition:width 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);"></div>
                </div>
                <div style="text-align:right; font-size:11px; color:#A89F94; margin-top:5px; font-weight:bold;">五月達成率 ${task.percent}%</div>
            </div>
        `;
    }).join("");

            // 生成外層的大圖卡容器
            const card = document.createElement("div");
            card.style.cssText = "background:#fff; padding:18px; border-radius:14px; margin-bottom:16px; border:1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);";
            
            card.innerHTML = `
                <div style="font-weight:800; font-size:18px; color:var(--primary-dark); margin-bottom:15px; border-bottom: 1px solid #F0F0F0; padding-bottom:8px; display:flex; align-items:center; gap:8px;">
                     ${staffName}
                </div>
                ${taskRowsHtml}
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error("進度抓取失敗:", error);
        container.innerHTML = `<p style="text-align:center; color:#FF6B6B; font-size:13px;">⚠️ 無法連線至中控表系統</p>`;
    }
}


async function renderStarryMap() {
    const container = $("starry-map-container");
    if (!container) return;
    
    container.innerHTML = "<p style='text-align:center; color:#999; font-size:14px;'>正在讀取星圖資料...</p>";

    try {
        const response = await fetch(`${PROGRESS_API_URL}?action=getHistory`);
        globalHistoryData = await response.json(); 

        container.innerHTML = ""; 
        const staffNames = Object.keys(monthlyData);

        staffNames.forEach(name => {
            const card = document.createElement("div");
            card.style.cssText = "background:#fff; padding:15px; border-radius:15px; margin-bottom:12px; border:1px solid var(--border); box-shadow: 2px 2px 8px rgba(0,0,0,0.05);";
            
let starsHtml = "";
for (let i = 1; i <= 12; i++) {
    const monthKey = `${i}月`;
    const monthPlans = globalHistoryData[name]?.[monthKey]; // 取得該月計畫陣列
    
    let displayContent = ""; // 預設：完全空白 (未來月份)

    // 檢查該月是否有資料
    if (monthPlans && monthPlans.length > 0) {
        // 🚀 判斷邏輯：檢查陣列中是否「所有方案」的 status 都是 "⭐"
        const isAllDone = monthPlans.every(p => p.status === "⭐" || p.status === "⭐️");
        
        if (isAllDone) {
            // 狀態 A：全數完成 -> 顯示亮起的金星
            displayContent = `<div style="font-size:20px;">⭐</div>`;
        } else {
            // 狀態 B：有資料但未全完成 -> 顯示「原本沒亮起的⭐」(灰色)
            displayContent = `<div style="font-size:20px; filter:grayscale(1); opacity:0.3;">⭐</div>`;
        }
    }

    starsHtml += `
        <div onclick="openHistoryDetail('${name}', '${monthKey}')" style="text-align:center; cursor:pointer; min-height:40px;">
            <div style="font-size:10px; color:#999; margin-bottom:2px;">${i}月</div>
            ${displayContent}
        </div>
    `;
}

            card.innerHTML = `
                <div style="font-weight:800; color:var(--primary-dark); margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span>${name}</span>
                </div>
                <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:8px;">
                    ${starsHtml}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("讀取星圖失敗:", error);
        container.innerHTML = "<p style='text-align:center; color:red;'>星圖載入失敗，請檢查網路</p>";
    }
}


// 點擊星星的詳細視窗邏輯
window.openHistoryDetail = function(name, month) {
    const modal = $("history-modal");
    const content = $("modal-content");
    const monthPlans = globalHistoryData[name]?.[month] || [];
    
    if (modal) modal.classList.remove("hidden");

    if (monthPlans.length === 0) {
        content.innerHTML = `<h3 style="text-align:center; color:#999;">${month} 尚無計畫紀錄</h3>`;
        return;
    }

    // 🚀 1. 產生帶有顏色與 Emoji 的計畫清單
    let plansListHtml = monthPlans.map((p, idx) => {
        // 判斷是否達成
        const isAchieved = p.status === '⭐' || p.status === '⭐️';
        const statusEmoji = isAchieved ? "✔️" : "❌";
        const statusLabel = isAchieved ? "達成" : "未達標";
        const themeColor = isAchieved ? "#248EB3" : "#FF6B6B"; // 藍色 vs 紅色
        const bgColor = isAchieved ? "#E0F7EF" : "#FFF0F0";    // 淺綠底 vs 淺紅底

        return `
            <div style="background:#f9f9f9; padding:15px; border-radius:12px; margin-bottom:12px; border-left:5px solid ${themeColor}; box-shadow: 2px 2px 5px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:bold; color:#aaa;">方案 ${idx + 1}</span>
                    <span style="background:${bgColor}; color:${themeColor}; padding:2px 10px; border-radius:20px; font-size:11px; font-weight:800; border: 1px solid ${themeColor}44;">
                        ${statusEmoji} ${statusLabel}
                    </span>
                </div>
                <div style="font-size:15px; color:#333; line-height:1.5;"><strong>計畫：</strong>${p.plan}</div>
                <div style="font-size:13px; color:#666; margin-top:6px; padding-top:6px; border-top:1px solid #eee;"><strong>目標：</strong>${p.target}</div>
            </div>
        `;
    }).join("");

    // 2. 判斷是否顯示回饋選單 (只要有一個未達成，就顯示)
    const hasFailedTask = monthPlans.some(p => !(p.status === "⭐" || p.status === "⭐️"));
    let rcaHtml = "";
    
if (hasFailedTask) {
        rcaHtml = `
            <div style="border-top:2px dashed #eee; margin-top:20px; padding-top:15px;">
                <h3 style="color:#FF6B6B; text-align:center; font-size:16px; margin-bottom:10px;">未達標原因回饋 💡</h3>
                <select id="rca-reason" style="width:100%; padding:12px; border-radius:10px; border:2px solid #eee; font-size:16px; background:#fff;">
                    <option value="多一點時間">⏳ 多一點時間</option>
                    <option value="同事的支援">🏃 同事的支援</option>
                    <option value="外部資源協助">🏔️ 外部資源協助</option>
                    <option value="更好的工具">🛠️ 更好的工具</option>
                    <option value="其他">📝 其他（面談討論）</option>
                </select>
                <button onclick="submitRCA('${name}', '${month}')" style="width:100%; background:${hasFailedTask ? '#FF6B6B' : 'var(--primary-dark)'}; color:white; padding:14px; border-radius:50px; margin-top:15px; border:none; font-weight:bold; cursor:pointer; box-shadow: 0 4px 0px rgba(0,0,0,0.1);">送出回饋</button>
            </div>
        `;
    }

    content.innerHTML = `
        <h3 style="color:var(--primary-dark); text-align:center; margin:0 0 15px 0; font-weight:900;">${month} 行動方案回顧</h3>
        <div style="max-height:350px; overflow-y:auto; padding-right:5px;">${plansListHtml}</div>
        ${rcaHtml}
    `;
};

// 🚀 送出 RCA 根因分析到 Google Sheets
window.submitRCA = async function(name, month) {
    const reasonEl = document.getElementById("rca-reason");
    if (!reasonEl) return;
    
    const reason = reasonEl.value;
    const submitBtn = event.target; // 取得目前的按鈕

    // 1. 防止重複點擊
    submitBtn.disabled = true;
    submitBtn.innerText = "傳送中...";

    try {
        // 2. 發送 POST 請求到您的 GAS
        // 注意：這裡必須使用 JSON.stringify 打包資料
        await fetch(PROGRESS_API_URL, {
            method: "POST",
            mode: "no-cors", // 避免瀏覽器跨網域攔截
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "submitRCA", 
                name: name, 
                month: month, 
                reason: reason 
            })
        });

        // 3. 成功後的回饋
        alert(`✔️ 紀錄成功！\n已將「${month} / ${name}」的分析原因送出：\n${reason}`);
        closeModal(); // 關閉彈窗
        
    } catch (e) {
        console.error("RCA 送出失敗:", e);
        alert("❌ 傳送失敗，請檢查網路連線或 GAS 部署狀態");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "送出回饋";
    }
};

// 關閉彈窗的功能
window.closeModal = function() {
    if ($("history-modal")) $("history-modal").classList.add("hidden");
};

// ===== 產生訊息 =====




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
    // 綁定分頁按鈕監聽 (維持原樣)
    if($("tab-huddle")) $("tab-huddle").addEventListener("click", () => showView("huddle"));
    if($("tab-report")) $("tab-report").addEventListener("click", () => showView("report"));
    if($("tab-plan")) $("tab-plan").addEventListener("click", () => showView("plan"));
    if($("tab-history")) $("tab-history").addEventListener("click", () => showView("history"));
  
  // 🚀 關鍵修正：確保網頁開啟後，主動執行一次「今日檢視」的切換與渲染
    showView("huddle");

    bindAutoSave();
    initDateLoad();
    renderHuddle();
    initPlanTab();
    fetchAndRenderProgress();

    // === 🎂 寓葳生日彩蛋：手機/電腦通用穩定版 ===
document.querySelectorAll('.marsh-icon').forEach(marsh => {
    // 手機版建議監聽 'touchstart' 或統一用 'click' (現代手機瀏覽器 click 已優化)
    marsh.addEventListener('click', (e) => {
        // 阻止點擊事件穿透到下方的 section
        e.stopPropagation();
      
            const today = new Date();
            const isMay19 = (today.getMonth() + 1 === 5 && today.getDate() === 19);
            
            if (isMay19) {
                // 5/19 當天的驚喜訊息
                alert("🎂 寓葳生日快樂 🎉");
            } else {
                // 非生日當天的提示
                alert("發現彩蛋了！但寓葳生日 5/19 還沒到喔 🤫");
            }
        }
    });
}
    // === 彩蛋結束 ===
});
