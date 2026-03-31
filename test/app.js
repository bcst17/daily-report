// 🌸 台北一區上班小助手：進度看板進化版
const PROGRESS_API_URL = "https://script.google.com/macros/s/AKfycbwXkfOGNoNFe1hO8idKs-IK4Q4ZixHv-IkdssDIWpSpoH2d6O2IjhKVOOmlLy-pR6BF/exec";

// ===== 1. 當月計畫資料庫 (保留你原有的標籤資料) =====
const monthlyData = {
  "郭孟鑫": [
    { content: "確認 1~2 月 YTD 達標狀況與長庚 2 月成交進度落後問題", target: "確認春節暫借名單執行度及歸還時間是否需安排在 2 月", customerType: "舊客", itemType: "HA" },
    { content: "考量 3 月進度，全面確認歷年個人交貨客人，檢查是否有遺漏孤兒個案", target: "舊客進店盡量發放介紹卡", customerType: "舊客", itemType: "HA" }
  ],
  "陳詩潔": [
    { content: "著重台大潛客追蹤", target: "1. 台大成交率維持 40% 以上", customerType: "潛客", itemType: "HA" }
  ],
  "魏頎恩": [
    { content: "2023往前的歷年舊客名單", target: "每日聯繫四位", customerType: "舊客", itemType: "HA" },
    { content: "2025年台大RS潛客", target: "方案一優先", customerType: "潛客", itemType: "RS" }
  ],
  "李孟馨": [
    { content: "確認近三個月台大潛客名單", target: "由本人於門市系統自行確認", customerType: "潛客", itemType: "HA" },
    { content: "聯繫台大歷年舊客", target: "共 60 位名單", customerType: "舊客", itemType: "HA" }
  ],
  // ... 其餘同仁請依此類推補齊
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
