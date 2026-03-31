// 🌸 台北一區上班小助手：進度看板進化版
const PROGRESS_API_URL = "https://script.google.com/macros/s/AKfycbwXkfOGNoNFe1hO8idKs-IK4Q4ZixHv-IkdssDIWpSpoH2d6O2IjhKVOOmlLy-pR6BF/exec";

// ===== 1. 當月計畫資料庫 (保留你原有的標籤資料) =====
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
  "蔡秉忻": [{ content: " ", target: " " }]
};



// 工具函式
const $ = (id) => document.getElementById(id);

// ===== 2. 進度看板：任務群組化渲染 (李孟馨不重複顯示姓名) =====
async function fetchAndRenderProgress() {
    const container = $("progress-dashboard");
    if (!container) return;

    try {
        const response = await fetch(PROGRESS_API_URL);
        const tasks = await response.json();
        container.innerHTML = ""; 

        // 🚀 核心邏輯：將任務按同仁姓名分組
        const grouped = tasks.reduce((acc, t) => {
            if (!acc[t.staffName]) acc[t.staffName] = [];
            acc[t.staffName].push(t);
            return acc;
        }, {});

        // 渲染每一位同仁的卡片
        Object.keys(grouped).forEach(name => {
            const card = document.createElement("div");
            // 卡片樣式：白底粉邊、置中陰影
            card.style.cssText = "background:#fff; padding:20px; border-radius:16px; margin-bottom:18px; border:1px solid #EFC1C9; box-shadow: 0 4px 12px rgba(0,0,0,0.05);";
            
            // 卡片標題：顯示同仁姓名一次
            let html = `<div style="font-weight:800; font-size:19px; color:#00A0E9; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
                          <span style="background:#FFB7C5; width:4px; height:18px; border-radius:2px;"></span>${name}
                        </div>`;

            // 顯示該同仁旗下的所有任務進度條
            grouped[name].forEach(task => {
                const color = task.percent >= 80 ? "#6BCB77" : (task.percent >= 50 ? "#FFA41B" : "#FFB7C5");
                html += `
                    <div style="margin-bottom:16px; border-top:1px solid #f9f9f9; padding-top:12px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:14px; color:#555; font-weight:600;">${task.taskName}</span>
                            <span style="font-weight:bold; color:${color}; font-size:14px;">${task.completed} / ${task.target} 筆</span>
                        </div>
                        <div style="background:#F0F0F0; height:12px; border-radius:6px; overflow:hidden;">
                            <div style="background:${color}; width:${task.percent}%; height:100%; transition:width 1s ease-out;"></div>
                        </div>
                    </div>`;
            });
            card.innerHTML = html;
            container.appendChild(card);
        });
    } catch (e) { container.innerHTML = "<p style='text-align:center; color:red;'>無法連線，請檢查中控表權限</p>"; }
}

// ===== 3. 當月計畫：標籤篩選與圓形圖示邏輯 =====
function initPlanTab() {
    const selectName = $("plan-name-select");
    const container = $("plan-list-container");
    if (!selectName || !container) return;

    selectName.innerHTML = '<option value="">-- 全區同仁 --</option>';
    Object.keys(monthlyData).forEach(n => selectName.add(new Option(n, n)));

    const render = () => {
        const name = selectName.value;
        const fCust = $("filter-customer").value;
        const fItem = $("filter-item").value;
        container.innerHTML = "";

        let list = [];
        if (name === "") {
            Object.entries(monthlyData).forEach(([n, ts]) => ts.forEach(t => list.push({...t, sName: n})));
        } else {
            list = (monthlyData[name] || []).map(t => ({...t, sName: name}));
        }

        const filtered = list.filter(t => (fCust === 'all' || t.customerType === fCust) && (fItem === 'all' || t.itemType === fItem));

        filtered.forEach((p, i) => {
            const el = document.createElement("div");
            el.className = "section"; // 使用原本的粉色框樣式
            el.style.borderLeft = "6px solid #FFB7C5";

            const cCol = p.customerType === '潛客' ? '#FF6B6B' : (p.customerType === '新客' ? '#4D96FF' : '#8D6E63');
            const iCol = p.itemType === 'RS' ? '#6BCB77' : '#FFA41B';
            const cTag = p.customerType ? p.customerType[0] : '?';
            const iTag = p.itemType ? p.itemType[0] : '?';

            // 圓形標籤 CSS
            const tagStyle = (col) => `display:inline-flex;justify-content:center;align-items:center;width:26px;height:26px;border-radius:50%;color:#fff;font-size:14px;font-weight:bold;background:${col};`;

            el.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div><b style="font-size:18px;color:#00A0E9;">${p.sName}</b></div>
                    <div style="display:flex;gap:6px;"><span style="${tagStyle(cCol)}">${cTag}</span><span style="${tagStyle(iCol)}">${iTag}</span></div>
                </div>
                <div style="margin-bottom:8px;"><small style="color:#FFB7C5;font-weight:bold;">方案</small><div>${p.content}</div></div>
                <div><small style="color:#FFB7C5;font-weight:bold;">目標</small><div>${p.target}</div></div>`;
            container.appendChild(el);
        });
    };

    [selectName, $("filter-customer"), $("filter-item")].forEach(e => e.onchange = render);
    render();
}

// ===== 4. 分頁切換邏輯 (只剩今日檢視與當月計畫) =====
function showView(view) {
    $("huddle-view").classList.toggle("hidden", view !== "huddle");
    $("plan-view").classList.toggle("hidden", view !== "plan");
    $("tab-huddle").classList.toggle("active", view === "huddle");
    $("tab-plan").classList.toggle("active", view === "plan");
    if (view === "huddle") fetchAndRenderProgress();
}

document.addEventListener("DOMContentLoaded", () => {
    $("tab-huddle").onclick = () => showView("huddle");
    $("tab-plan").onclick = () => showView("plan");
    showView("huddle");
    initPlanTab();
});
