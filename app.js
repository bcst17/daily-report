console.log("🌱 Pikmin Bloom Edition app.js loaded!");

// ✅ 測試版儲存前綴
const STORAGE_PREFIX = "daily-report-test-";
const PROGRESS_API_URL = "https://script.google.com/macros/s/AKfycbyrm3inO0h3qQf3hpKGCuQrNk68clolrYTXo5ncwEblDghytWB29dMIKA1LenjyIAr0qw/exec";

// 💡 請在 app.js 的最上方（或 PROGRESS_API_URL 下方）新增這行，用來存放抓回來的歷史資料
let globalHistoryData = {};

// ===== ↓↓↓ 當月計畫資料庫 (後台輸入區) ↓↓↓ =====
// 這裡可以預先輸入每位同仁的計畫，數量不限
const monthlyData = {
  "郭孟鑫": [
    { content: "繼續完成 2024、2025 站前 HA 潛客追蹤", target: "7 月完成 15 筆聯繫", customerType: "潛客", itemType: "HA" }
  ],
  "陳詩潔": [
    { content: "考量外站 + 聽力所時間佔比，完成 6 月份潛客及訂閱中用戶追蹤即可", target: " 潛客追蹤，設定 NS", customerType: "潛客", itemType: "HA" }
  ],
  "游瑟焄": [
    { content: " 站前 2018年 自己名字的 HA 潛客追蹤", target: "7 月完成 8 筆聯繫", customerType: "潛客", itemType: "HA" },
    { content: " 桃長 2020年 HA 舊客追蹤，確認是否有安排回店需求", target: "完成 29 位個案確認", customerType: "舊客", itemType: "HA" }
  ],
  "魏頎恩": [
    { content: "站前 2020 RS AHI > 15 潛客追蹤", target: "7 月完成 13 筆聯繫", customerType: "潛客", itemType: "RS" },
    { content: "保健每月完成當月目標", target: "7 月保健營收 3000 元", customerType: "舊客", itemType: "HA" }
  ],
  "李孟馨": [
    { content: "2025 年台大自己試聽過的 HA 潛客追蹤", target: "7 月完成 23 筆聯繫", customerType: "潛客", itemType: "HA" }
  ],
  "劉瑋婷": [
    { content: "2026 年聽檢後未追蹤、試聽後未成交名單確認 NS", target: "七月底完成 18 筆", customerType: "潛客", itemType: "HA" }
  ],
  "周曉玄": [
    { content: "今年舊客試聽率低於平均，提供試聽贈 5 點方案做應用", target: "達成率在進度上，先不額外設定目標", customerType: "舊客", itemType: "HA" },
    { content: "針對現有預約舊客給予轉介卡加名片，並於兩周後關心發送狀況", target: "每周至少 1 位", customerType: "舊客", itemType: "HA" },
    { content: "Google Map 評論", target: "每月至少 1 篇", customerType: "舊客", itemType: "HA" }
  ],
  "蕭純聿": [
    { content: "考量預約數量和達成率，針對現有預約，過保舊客給予轉介卡加名片，並於兩周後關心發送狀況", target: "每周至少 1 位", customerType: "舊客", itemType: "HA" },
    { content: "Google Map 評論", target: "每月至少 1 篇", customerType: "舊客", itemType: "HA" }
  ],
  "陳宛妤": [
    { content: "聯繫 2024 年桃長 HA 舊客，針對半年以上未回院，安排到週二服務，提升週二流量", target: "完成 12 筆聯繫", customerType: "舊客", itemType: "HA" },
    { content: "保健食品業績，每月達標，優先針對淨耳棉片，每位舊客回店追蹤皆把棉片加入到服務中", target: "月達成率 100 %", customerType: "舊客", itemType: "HA" },
    { content: "Google Map 評論", target: "每月至少 1 篇", customerType: "舊客", itemType: "HA" }
  ],
  "林寓葳": [
    { content: "訂閱中 HA 用戶轉買斷方案，剩餘 3 筆有機會的繼續追", target: "7 月底前完成聯繫", customerType: "舊客", itemType: "HA" },
    { content: "2018~2019 年 HA 潛客，工讀生先協助排除「個資不同意/無聯繫方式/多次去電未接」", target: "7 月完成 30 筆", customerType: "潛客", itemType: "HA" },
    { content: "2025 年 RS 潛客，針對有發送過簡訊的名單聯繫", target: "7 月完成剩餘 16 筆", customerType: "潛客", itemType: "RS" }
  ],
  "吳欣珮": [
    { content: "上半年聽檢有聽損的個案，7月完成追蹤。若有聽檢需求，再確認是否由書廷安排試聽", target: "合計 10 筆完成確認", customerType: "舊客", itemType: "HA" }
  ],
  "呂桂梅": [
    { content: "八德 RS 潛客 2022 年潛客聯繫", target: "7 月完成 65 筆聯繫", customerType: "潛客", itemType: "RS" }
  ],
  "林書廷": [
    { content: "2024 忠孝 HA 潛客追蹤", target: "7 月邀約 1 位回門市", customerType: "潛客", itemType: "HA" },
    { content: "CROS 個案與教育訓練討論", target: "6/29 前提供討論結果給秉忻", customerType: "潛客", itemType: "HA" },
    { content: "忠孝 HA 2021年交貨舊客聯繫，針對非退輔會、半年以上未進店邀約", target: "7 月邀約 10 位進店", customerType: "舊客", itemType: "HA" }
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

// ===== 分頁切換邏輯 =====
function showView(view) {
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

// ===== 當月計畫渲染邏輯 (皮克敏鮮豔色彩主題優化) =====
function initPlanTab() {
    const selectName = $("plan-name-select");
    const selectCustomer = $("filter-customer");
    const selectItem = $("filter-item");
    const container = $("plan-list-container");

    if (!selectName || !container) return;

    // 1. 生成姓名下拉選單
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

        // 2. 資料彙整策略
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

        // 3. 執行交叉篩選
        const filteredData = tasksToFilter.filter(plan => {
            const matchCust = (filterCust === "all" || plan.customerType === filterCust);
            const matchItem = (filterItem === "all" || plan.itemType === filterItem);
            return matchCust && matchItem;
        });

        if (filteredData.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#999; font-size:14px; margin-top:20px;">目前無符合篩選條件的計畫內容</p>';
            return;
        }

        // 4. 生成任務卡片 (皮克敏與大自然繽紛配色版)
        filteredData.forEach((plan, index) => {
            const planEl = document.createElement("div");
            planEl.style.cssText = "background: #fff; border: 2px solid var(--border); border-radius: 12px; padding: 18px; margin-bottom: 18px; border-left: 6px solid var(--primary); box-shadow: 0 4px 10px rgba(101,179,58,0.1); position:relative;";
            
            // 標籤顏色定義 (對應皮克敏的代表色彩)
            const custColor = plan.customerType === '潛客' ? '#FF8A80' : (plan.customerType === '新客' ? '#80D8FF' : '#E040FB'); // 紅色皮克敏、藍色皮克敏、紫色皮克敏
            const itemColor = plan.itemType === 'RS' ? '#CCFF90' : '#FFE57F'; // 嫩綠色與朝氣黃色

            // 標籤文字縮減邏輯
            const custAbbr = plan.customerType ? plan.customerType.substring(0, 1) : '?';
            const itemAbbr = plan.itemType ? plan.itemType.substring(0, 1) : '?';

            // 定義圓形標籤的統一 CSS 樣式
            const tagCircleStyle = "display:inline-flex; justify-content:center; align-items:center; width:26px; height:26px; border-radius:50%; color:var(--primary-dark); font-size:13px; font-weight:bold; box-sizing:border-box; box-shadow: 1px 1px 3px rgba(0,0,0,0.1);";

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
    
    // 初始化執行一次渲染
    renderPlans();
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

// 一人一個圖卡，內部顯示多個進度條 (皮克敏草地綠與花蜜橘色調整)
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
            
            // 生成該同仁內部的所有進度條 HTML (鮮豔的皮克敏草地綠與探險橘)
            const taskRowsHtml = staffTasks.map(task => {
                const barColor = task.percent >= 80 ? "var(--primary)" : "var(--accent-orange)"; 
                return `
                    <div style="margin-bottom: 20px;">
                        <div style="display:flex; justify-content:space-between; align-items:end; margin-bottom:8px;">
                            <span style="font-size:14px; font-weight:bold; color:var(--primary-dark);">${task.taskName}</span>
                            <span style="font-weight:900; color:${barColor}; font-size:15px;">${task.completed} / ${task.target} 筆</span>
                        </div>
                        <div style="background:#F0F4EE; height:12px; border-radius:10px; overflow:hidden;">
                            <div style="background:${barColor}; width:${task.percent}%; height:100%; transition:width 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);"></div>
                        </div>
                        <div style="text-align:right; font-size:11px; color:#A89F94; margin-top:5px; font-weight:bold;">達成率 ${task.percent}%</div>
                    </div>
                `;
            }).join("");

            // 生成外層的大圖卡容器
            const card = document.createElement("div");
            card.style.cssText = "background:#fff; padding:18px; border-radius:14px; margin-bottom:16px; border:2px solid var(--border); box-shadow: 0 4px 12px rgba(101,179,58,0.08);";
            
            card.innerHTML = `
                <div style="font-weight:800; font-size:18px; color:var(--primary-dark); margin-bottom:15px; border-bottom: 1px solid #ECECEC; padding-bottom:8px; display:flex; align-items:center; gap:8px;">
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
    
    container.innerHTML = "<p style='text-align:center; color:#999; font-size:14px;'>正在讀取花朵星圖資料...</p>";

    try {
        const response = await fetch(`${PROGRESS_API_URL}?action=getHistory`);
        globalHistoryData = await response.json(); 

        container.innerHTML = ""; 
        const staffNames = Object.keys(monthlyData);

        staffNames.forEach(name => {
            const card = document.createElement("div");
            card.style.cssText = "background:#fff; padding:15px; border-radius:15px; margin-bottom:12px; border:2px solid var(--border); box-shadow: 2px 2px 8px rgba(101,179,58,0.05);";
            
            let starsHtml = "";
            for (let i = 1; i <= 12; i++) {
                const monthKey = `${i}月`;
                const monthPlans = globalHistoryData[name]?.[monthKey]; // 取得該月計畫陣列
                
                let displayContent = ""; // 預設：完全空白 (未來月份)

                // 檢查該月是否有資料
                if (monthPlans && monthPlans.length > 0) {
                    const isAllDone = monthPlans.every(p => p.status === "⭐" || p.status === "⭐️");
                    
                    // 皮克敏精神：達成目標即開出燦爛美麗的櫻花 🌸
                    if (isAllDone) {
                        displayContent = `<div style="font-size:20px;">🌸</div>`;
                    } else {
                        displayContent = `<div style="font-size:20px; filter:grayscale(1); opacity:0.3;">🌸</div>`;
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

// 點擊星星/花朵的詳細視窗邏輯
window.openHistoryDetail = function(name, month) {
    const modal = $("history-modal");
    const content = $("modal-content");
    const monthPlans = globalHistoryData[name]?.[month] || [];
    
    if (modal) modal.classList.remove("hidden");

    if (monthPlans.length === 0) {
        content.innerHTML = `<h3 style="text-align:center; color:#999;">${month} 尚無計畫紀錄</h3>`;
        return;
    }

    // 1. 產生帶有顏色與 Emoji 的計畫清單
    let plansListHtml = monthPlans.map((p, idx) => {
        const isAchieved = p.status === '⭐' || p.status === '⭐️';
        const statusEmoji = isAchieved ? "🌸" : "❌";
        const statusLabel = isAchieved ? "達標" : "未達標";
        const themeColor = isAchieved ? "var(--primary)" : "#FF6B6B"; 
        const bgColor = isAchieved ? "#F1F8E9" : "#FFF0F0";    

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
                    <option value="同事的支援">🌱 皮克敏同伴的支援 (同事支援)</option>
                    <option value="外部資源協助">🍄 挑戰巨大蘑菇 (外部資源協助)</option>
                    <option value="更好的工具">🎒 探險背包升級 (更好的工具)</option>
                    <option value="其他">📝 其他（面談討論）</option>
                </select>
                <button onclick="submitRCA('${name}', '${month}')" style="width:100%; background:#FF6B6B; color:white; padding:14px; border-radius:50px; margin-top:15px; border:none; font-weight:bold; cursor:pointer; box-shadow: 0 4px 0px rgba(0,0,0,0.1);">送出回饋</button>
            </div>
        `;
    }

    content.innerHTML = `
        <h3 style="color:var(--primary-dark); text-align:center; margin:0 0 15px 0; font-weight:900;">${month} 行動方案花朵回顧 🌸</h3>
        <div style="max-height:350px; overflow-y:auto; padding-right:5px;">${plansListHtml}</div>
        ${rcaHtml}
    `;
};

// 🚀 送出 RCA 根因分析到 Google Sheets
window.submitRCA = async function(name, month) {
    const reasonEl = document.getElementById("rca-reason");
    if (!reasonEl) return;
    
    const reason = reasonEl.value;
    const submitBtn = event.target; 

    // 1. 防止重複點擊
    submitBtn.disabled = true;
    submitBtn.innerText = "傳送中...";

    try {
        await fetch(PROGRESS_API_URL, {
            method: "POST",
            mode: "no-cors", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "submitRCA", 
                name: name, 
                month: month, 
                reason: reason 
            })
        });

        alert(`✔️ 紀錄成功！\n已將「${month} / ${name}」的分析原因送出：\n${reason}`);
        closeModal(); 
        
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
    // 綁定分頁按鈕監聽
    if($("tab-huddle")) $("tab-huddle").addEventListener("click", () => showView("huddle"));
    if($("tab-report")) $("tab-report").addEventListener("click", () => showView("report"));
    if($("tab-plan")) $("tab-plan").addEventListener("click", () => showView("plan"));
    if($("tab-history")) $("tab-history").addEventListener("click", () => showView("history"));
  
    // 確保網頁開啟後，主動執行一次「今日檢視」的切換與渲染
    showView("huddle");

    bindAutoSave();
    initDateLoad();
    renderHuddle();
    initPlanTab();
    fetchAndRenderProgress();
});
