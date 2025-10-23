// Simple calendar prototype showing events for two games and basic navigation
(function(){
  // events removed as requested: keep empty array
  const eventsData = [];

  const calendarEl = document.getElementById('calendar');
  const eventsEl = document.getElementById('events');

  // determine filter: from page or default 'all'
  const pageFilter = (window.__GAME_FILTER || 'all');

  // build a simple month view for current month
  function buildCalendar(year,month){
    if(!calendarEl) return;
    calendarEl.innerHTML = '';
    const first = new Date(year,month,1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year,month+1,0).getDate();

    // show weekday headers
    const weekdays = ['일','월','화','수','목','금','토'];
    weekdays.forEach(d=>{
      const hd = document.createElement('div');
      hd.className = 'day-cell';
      hd.innerHTML = '<div class="day-header"><span>'+d+'</span></div>';
      calendarEl.appendChild(hd);
    });

    // fill blanks before first day
    for(let i=0;i<startDay;i++){
      const blank = document.createElement('div');
      blank.className = 'day-cell';
      blank.innerHTML = '';
      calendarEl.appendChild(blank);
    }

    for(let d=1; d<=daysInMonth; d++){
      const cell = document.createElement('div');
      cell.className = 'day-cell';
  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  // only show the day number; removed the small yy/mm text per request
  cell.innerHTML = '<div class="day-header"><span class="date-num">'+d+'</span></div>';

      const dayEvents = eventsData.filter(ev=>ev.date===dateStr && (pageFilter==='all' || ev.game===pageFilter));
      dayEvents.forEach(ev=>{
        const evEl = document.createElement('div');
        evEl.className = 'event '+ev.game;
        evEl.textContent = ev.time + ' · ' + ev.title;
        cell.appendChild(evEl);
      });

      calendarEl.appendChild(cell);
    }
  }

  function listUpcoming(){
    if(!eventsEl) return;
    eventsEl.innerHTML = '';
    const now = new Date();
    let list = [];
    if(pageFilter === 'all'){
      // Home page: show today's matches
      const todayStr = now.toISOString().slice(0,10);
      list = eventsData.filter(ev=>ev.date===todayStr);
    } else {
      // Game page: upcoming for that game
      list = eventsData.filter(ev=>ev.game===pageFilter && new Date(ev.date + 'T' + ev.time) >= now)
        .sort((a,b)=> new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time)).slice(0,8);
    }

    if(list.length===0){
      eventsEl.innerHTML = '<li>예정된 경기가 없습니다.</li>';
      return;
    }

    list.forEach(ev=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${ev.title}</strong><br><small>${ev.date} ${ev.time} · ${ev.game.toUpperCase()}</small>`;
      eventsEl.appendChild(li);
    });
  }

  // populate past/future lists and current status/format on game pages
  function populateGamePanels(){
    if(pageFilter === 'all') return;
    const now = new Date();
    const todayStr = now.toISOString().slice(0,10);

    const pastListEl = document.getElementById('pastList');
    const futureListEl = document.getElementById('futureList');
    const currentStatusEl = document.getElementById('currentStatus');
    const currentFormatEl = document.getElementById('currentFormat');

    if(!pastListEl || !futureListEl || !currentStatusEl || !currentFormatEl) return;

    const gameEvents = eventsData.filter(ev=>ev.game===pageFilter).sort((a,b)=> new Date(b.date+'T'+b.time) - new Date(a.date+'T'+a.time));

    const past = gameEvents.filter(ev=>ev.date < todayStr);
    const future = gameEvents.filter(ev=>ev.date > todayStr);
    const todayEvents = gameEvents.filter(ev=>ev.date === todayStr);

    // past
    pastListEl.innerHTML = '';
    if(past.length===0){
      pastListEl.innerHTML = '<li>과거 대회가 없습니다.</li>';
    } else {
      past.forEach(ev=>{ const li = document.createElement('li'); li.textContent = `${ev.date} · ${ev.title}`; pastListEl.appendChild(li); });
    }

    // future
    futureListEl.innerHTML = '';
    if(future.length===0){
      futureListEl.innerHTML = '<li>다가오는 대회가 없습니다.</li>';
    } else {
      future.forEach(ev=>{ const li = document.createElement('li'); li.textContent = `${ev.date} · ${ev.title}`; futureListEl.appendChild(li); });
    }

    // current status: show today's events or a default
    if(todayEvents.length===0){
      currentStatusEl.textContent = '진행중인 대회가 없습니다.';
      currentFormatEl.textContent = '진행 방식 정보가 없습니다.';
    } else {
      // if multiple, show first as main
      const cur = todayEvents[0];
      currentStatusEl.innerHTML = `<strong>${cur.title}</strong><br><small>${cur.date} ${cur.time}</small>`;
      // basic format inference by keywords
      let format = '토너먼트';
      if(/Group|Group Stage|Round/i.test(cur.title)) format = '그룹 스테이지';
      if(/Finals|Final/i.test(cur.title)) format = '결승전 (토너먼트)';
      if(pageFilter==='lol') format = 'Bo5 / 토너먼트';
      if(pageFilter==='valorant') format = 'Bo3 / 토너먼트';
      currentFormatEl.textContent = format;
    }
  }

  // initial render: current month and month label
  const today = new Date();
  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const monthLabelEl = document.getElementById('monthLabel');
  if(monthLabelEl){
    monthLabelEl.textContent = monthNames[today.getMonth()] + ' ' + today.getFullYear();
  }
  buildCalendar(today.getFullYear(), today.getMonth());
  listUpcoming();
  // populate game-specific panels (past/future/current) if on a game page
  populateGamePanels();

})();
