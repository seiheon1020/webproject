// Simple calendar prototype showing events for two games and basic navigation
(function(){
  const eventsData = [
    // sample League of Legends events
    {id:1,game:'lol',title:'LCK Spring Finals',date:'2025-03-23',time:'18:00'},
    {id:2,game:'lol',title:'MSI Group Stage',date:'2025-05-08',time:'14:00'},
    {id:3,game:'lol',title:'Worlds Quarterfinal',date:'2025-10-27',time:'20:00'},
    // sample Valorant events
    {id:11,game:'valorant',title:'VCT Challengers',date:'2025-04-11',time:'16:00'},
    {id:12,game:'valorant',title:'VALORANT Masters',date:'2025-06-02',time:'19:00'},
    {id:13,game:'valorant',title:'Valorant Champions',date:'2025-11-15',time:'18:30'}
  ];

  const calendarEl = document.getElementById('calendar');
  const eventsEl = document.getElementById('events');

  // determine filter: from page or default 'all'
  const pageFilter = (window.__GAME_FILTER || 'all');

  // build a simple month view for current month
  function buildCalendar(year,month){
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

  // initial render: current month and month label
  const today = new Date();
  const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const monthLabelEl = document.getElementById('monthLabel');
  if(monthLabelEl){
    monthLabelEl.textContent = monthNames[today.getMonth()] + ' ' + today.getFullYear();
  }
  buildCalendar(today.getFullYear(), today.getMonth());
  listUpcoming();

})();
