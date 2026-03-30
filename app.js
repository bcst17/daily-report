console.log("🌸 Mar Style app.js loaded: Sakura & Doraemon Edition");

// ✅ 測試版儲存前綴
const STORAGE_PREFIX = "daily-report-test-";

// ===== ↓↓↓ 當月計畫資料庫 (後台輸入區) ↓↓↓ =====
// 這裡可以預先輸入每位同仁的計畫，數量不限
const monthlyData = {
  "郭孟鑫": [
    { content: "確認 1~2 月 YTD 達標狀況與長庚 2 月成交進度落後問題", target: "確認春節暫借名單執行度及歸還時間是否需安排在 2 月", customerType: "舊客", itemType: "HA" },
    { content: "考量 3 月進度，全面確認歷年個人交貨客人，檢查是否有遺漏孤兒個案", target: "舊客進店盡量發放介紹卡", customerType: "舊客", itemType: "HA" }
  ],
  "陳詩潔": [
    { content: "每個月固定要追蹤前一個月的台大潛客 (例如每周一1300~1330)", target: "自己的雲端紀錄聯繫狀況(下次面談確認)", customerType: "潛客", itemType: "HA" }
  ],
  "游瑟焄": [
    { content: "鎖定林長進店保外舊客開發試聽", target: "每周 1~2 位舊客試聽", customerType: "舊客", itemType: "HA" },
    { content: "落實舊客試聽執行與溝通（秉忻執行）", target: "3/5 前完成與水錦溝通確認", customerType: "舊客", itemType: "HA" }
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
  "蔡秉忻": [{ content: " ", target: " " }]
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
function spawnSakuraShower() {
    const symbols = ['🌸', '🔔', '💗', '🍡', '✨']; // 櫻花、鈴鐺、愛心、三色糰子
    const count = 20; 

    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        item.style.position = 'fixed';
        item.style.bottom = '80px';
        item.style.left = (Math.random() * 80 + 10) + '%';
        item.style.fontSize = (Math.random() * 20 + 15) + 'px';
        item.style.zIndex = '100';
        item.style.pointerEvents = 'none';
        item.style.transition = 'all 1.5s cubic-bezier(0.19, 1, 0.22, 1)'; // 更加輕柔的飄落感
        
        document.body.appendChild(item);

        const destinationX = (Math.random() - 0.5) * 300;
        const destinationY = -(Math.random() * 500 + 200);

        requestAnimationFrame(() => {
            item.style.transform = `translate(${destinationX}px, ${destinationY}px) rotate(${Math.random() * 540}deg)`;
            item.style.opacity = '0';
        });

        setTimeout(() => item.remove(), 1500);
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

// ===== 當月計畫渲染邏輯 (移除 Emoji 版) =====
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
    spawnSakuraShower(); 
    
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
    spawnSakuraShower(); 

    try {
        await navigator.clipboard.writeText(text);
        alert("🌸 訊息已複製！祝您三月業績如櫻花盛開！");
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
