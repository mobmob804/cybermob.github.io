// @ts-nocheck
const daysOfWeek = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];
let p = { 
    d:1, dayIdx:0, hour:8, min:0, m:400, f:0, h:90, t:90, e:40, hp:100, 
    bn:0, food:2, beer:1, tea:2, raw:1, meds:0, cp:1, gpu:"Базовий",
    games: [], 
    dealerCooldownDay: 0,
    mails: [
        { id: 1, from: "Ігор (Кабачок)", text: "Йоу чувак! Ідеш сьогодні ввечері з нами в CS катати?", answered: false },
        { id: 2, from: "KetsManTV", text: "Зробиш рестрик на стрім за 100 грн?", answered: false }
    ], 
    unreadMail:true
};

// ЧІПТЮН СИНТЕЗАТОР МУЗИКИ
let audioCtx = null, musicTimer = null, musicPlaying = false;
const melodyNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 220.00, 246.94, 261.63, 293.66, 329.63, 392.00, 523.25, 440.00];
let noteIndex = 0;

function startMusic() {
    if (musicPlaying) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    musicPlaying = true;
    
    let btn = document.getElementById('music-toggle-btn');
    if (btn) {
        btn.innerText = "🎵 Музика: УВІМК";
        btn.style.background = "#00ff66";
        btn.style.color = "#000";
    }
    
    noteIndex = 0;
    musicTimer = setInterval(() => {
        if (!musicPlaying || !audioCtx) return;
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'square';
        let freq = melodyNotes[noteIndex];
        noteIndex = (noteIndex + 1) % melodyNotes.length;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }, 250);
}

function toggleMusic() {
    let btn = document.getElementById('music-toggle-btn');
    if (!musicPlaying) {
        startMusic();
    } else {
        musicPlaying = false;
        clearInterval(musicTimer);
        if (audioCtx) { audioCtx.close(); audioCtx = null; }
        if (btn) {
            btn.innerText = "🎵 Музика: ВИМК";
            btn.style.background = "#252530";
            btn.style.color = "#00f0ff";
        }
    }
}

function nextIntro(screenNum) {
    startMusic();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('intro-screen-' + screenNum).classList.add('active');
}

function showMainMenu() {
    startMusic();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('main-menu').classList.add('active');
}

function startGame() {
    startMusic();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('game-interface').style.display = 'block';
    
    let roomEl = document.getElementById('room');
    if (roomEl) roomEl.classList.add('active');
    
    update();
}

function update() {
    let dayName = daysOfWeek[p.dayIdx];
    document.getElementById('w-day').innerText = dayName;
    let hh = String(p.hour).padStart(2, '0');
    let mm = String(p.min).padStart(2, '0');
    document.getElementById('time-str').innerText = hh + ":" + mm;

    document.getElementById('d').innerText = p.d;
    document.getElementById('m').innerText = p.m;
    document.getElementById('f').innerText = Math.floor(p.f);
    document.getElementById('h').innerText = p.h;
    document.getElementById('t').innerText = p.t;
    document.getElementById('e').innerText = p.e;
    document.getElementById('hp').innerText = p.hp;
    document.getElementById('tc').innerText = p.tea;
    document.getElementById('mc').innerText = p.raw;
    document.getElementById('fc').innerText = p.food;
    document.getElementById('bc').innerText = p.beer;
    document.getElementById('medc').innerText = p.meds;
    document.getElementById('cp').innerText = p.cp;
    document.getElementById('gpu').innerText = p.gpu;
    document.getElementById('games-count').innerText = p.games.length;

    let remBtn = document.getElementById('rem-study-btn');
    if (remBtn) remBtn.style.display = (p.dayIdx === 5) ? 'block' : 'none';

    let mailBadge = document.getElementById('mail-badge');
    if (mailBadge) mailBadge.style.display = p.unreadMail ? 'inline' : 'none';

    let mailList = document.getElementById('mail-list');
    if (mailList) {
        if (p.mails.length === 0) {
            mailList.innerHTML = "Повідомлень немає.";
        } else {
            mailList.innerHTML = p.mails.map(m => {
                let actionBtns = m.answered 
                    ? `<span style="color:#00ff66;">[Відповідь відправлено]</span>`
                    : `<div style="display:flex; gap:4px; margin-top:4px;">
                        <button class="btn-sm" onclick="replyMail(${m.id}, true)">Да</button>
                        <button class="btn-sm" onclick="replyMail(${m.id}, false)" style="background:#ff0055; color:#fff;">Ні</button>
                       </div>`;
                return `<div style="margin-bottom:8px; border-bottom:1px solid #334; padding-bottom:6px;">
                            <b>📨 ${m.from}:</b><br>${m.text}<br>${actionBtns}
                        </div>`;
            }).join('');
        }
    }
}

function replyMail(id, yes) {
    let m = p.mails.find(x => x.id === id);
    if (m && !m.answered) {
        m.answered = true;
        if (id === 1) {
            if (yes) { p.f += 30; alert("🎮 Початали в CS! Отримано +30 FPS."); }
            else { alert("Ти відмовився від катки."); }
        } else if (id === 2) {
            if (yes) { p.m += 100; alert("💻 Допоміг зі стрімом! Зароблено +100 грн."); }
            else { alert("Ти відхилив пропозицію."); }
        }
        update();
    }
}

function addTime(hours, mins = 0) {
    p.min += mins;
    p.hour += hours + Math.floor(p.min / 60);
    p.min %= 60;
    if (p.hour >= 24) {
        p.hour %= 24;
        p.d++;
        p.dayIdx = (p.dayIdx + 1) % 7;
        
        if (Math.random() < 0.4) {
            p.mails.unshift({ id: Date.now(), from: "Lightning McQueen", text: "Оу да Маквін готов, гайда на сервер?", answered: false });
            p.unreadMail = true;
        }
    }
    update();
}

function nav(target) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    let screenEl = document.getElementById(target);
    if (screenEl) screenEl.classList.add('active');
    if (target !== 'pc') stopSnake();
    if (target === 'cybermail') p.unreadMail = false;
}

function goOut() {
    addTime(0, 10);
    checkStreetEvent();
    nav('street');
}

function goHome() {
    addTime(0, 10);
    nav('room');
}

function checkStreetEvent() {
    let rand = Math.random();
    if (rand < 0.2) {
        let found = Math.floor(Math.random() * 50) + 20;
        p.m += found;
        alert(`👀 По дорозі ти знайшов на асфальті ${found} грн!`);
    } else if (rand < 0.35) {
        alert("🐕 На вулиці до тебе причепився місцевий собака, але потім відстав.");
    }
}

function rest() {
    if (p.hour < 19 && p.hour >= 8) {
        alert("❌ Ще надто рано лягати спати! Спати можна тільки з 19:00 вечора.");
        return;
    }
    let missingEnergy = 100 - p.e;
    let sleepHours = Math.max(4, Math.ceil(missingEnergy / 12));

    p.hour += sleepHours;
    if (p.hour >= 24) {
        p.hour %= 24;
        p.d++;
        p.dayIdx = (p.dayIdx + 1) % 7;
    }
    p.min = 0;
    p.e = 100;

    if (p.bn > 3 || p.h < 20) { 
        p.hp -= 30; 
        alert(`🛏️ Ти проспав ${sleepHours} год.\n🥴 Похмілля з ранку! Здоров'я впало.`); 
    } else {
        alert(`🛏️ Ти міцно проспав ${sleepHours} годин і повністю відновив енергію!`);
    }

    p.bn = 0; 
    update();
}

function shower() { addTime(0, 30); p.hp = Math.min(100, p.hp + 10); update(); alert("Душ прийнято (+30 хв)."); }
function sport() { addTime(1, 0); p.hp = Math.min(100, p.hp + 10); p.e = Math.max(0, p.e - 10); update(); alert("Зарядка зроблена (+1 год)."); }

function clickPC() {
    if (p.e > 2) { p.f += p.cp * 5; p.e -= 5; addTime(0, 30); update(); }
    else alert("Сил немає!");
}

function buyGPU(name, cost, pow) {
    let c = parseInt(cost);
    let pw = parseInt(pow);
    if (p.m >= c || p.f >= c) {
        p.f -= c; p.cp += pw; p.gpu = name; update(); alert("Куплено " + name + "!");
    } else alert("Недостатньо коштів/FPS!");
}

function leavePCShop() {
    if (p.dayIdx === 3 && p.d >= p.dealerCooldownDay) {
        document.getElementById('dealer-modal').style.display = 'flex';
    } else {
        nav('pc');
    }
}

function dealerDeal(accept) {
    document.getElementById('dealer-modal').style.display = 'none';
    if (accept) {
        if (p.f >= 100) {
            p.f -= 100;
            p.cp += 15;
            p.gpu = "Барижна RTX";
            alert("😎 Барига в чорних очках підкинув топ-залізо! (+15 FPS клік)");
        } else {
            alert("❌ У тебе замало FPS для його умов!");
        }
    } else {
        p.dealerCooldownDay = p.d + 7;
        alert("🕶️ Барига: «Ну як хочеш, малой. Я тут буду через тиждень, якщо передумаєш!»");
    }
    nav('pc');
    update();
}

function buyGame(gameName, cost) {
    if (p.m >= cost) {
        p.m -= cost;
        p.games.push(gameName);
        update();
        alert(`🎮 Успішно куплено гру "${gameName}"!`);
    } else {
        alert("❌ Недостатньо гривень на балансі!");
    }
}

const slotIcons = ["🍋", "🍒", "🔔", "7️⃣", "💎"];
function spinSlots() {
    if (p.m < 50) { alert("❌ Для спіну потрібно 50 грн!"); return; }
    p.m -= 50;
    addTime(0, 10);
    
    let spinBtn = document.getElementById('spin-btn');
    let s1 = document.getElementById('s1');
    let s2 = document.getElementById('s2');
    let s3 = document.getElementById('s3');
    let lres = document.getElementById('lres');
    
    spinBtn.disabled = true;
    lres.innerText = "⏳ Барабани крутяться...";
    
    let count = 0;
    let timer = setInterval(() => {
        s1.innerText = slotIcons[Math.floor(Math.random() * slotIcons.length)];
        s2.innerText = slotIcons[Math.floor(Math.random() * slotIcons.length)];
        s3.innerText = slotIcons[Math.floor(Math.random() * slotIcons.length)];
        count++;
        
        if (count > 10) {
            clearInterval(timer);
            spinBtn.disabled = false;
            
            let f1 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
            let f2 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
            let f3 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
            s1.innerText = f1; s2.innerText = f2; s3.innerText = f3;
            
            if (f1 === f2 && f2 === f3) {
                let win = 500;
                p.m += win;
                lres.innerText = `🎉 ДЖЕКПОТ! 3 в ряд! Виграш +${win} грн!`;
            } else if (f1 === f2 || f2 === f3 || f1 === f3) {
                let win = 100;
                p.m += win;
                lres.innerText = `👍 2 в ряд! Виграш +${win} грн!`;
            } else {
                lres.innerText = "❌ Не пощастило, спробуй ще!";
            }
            update();
        }
    }, 100);
}

const rouletteColors = ["🔴", "⚫", "🟢"];
function spinRoulette(choice) {
    if (p.m < 100) { alert("❌ Для ставки в рулетці потрібно 100 грн!"); return; }
    p.m -= 100;
    addTime(0, 10);
    
    let wheel = document.getElementById('roulette-wheel');
    let lres = document.getElementById('lres');
    lres.innerText = "🎡 Рулетка крутиться...";
    
    let count = 0;
    let timer = setInterval(() => {
        let rColor = rouletteColors[Math.floor(Math.random() * rouletteColors.length)];
        wheel.innerText = `${rColor} | ${rColor} | ${rColor}`;
        count++;
        
        if (count > 12) {
            clearInterval(timer);
            let rand = Math.random();
            let resultColor = rand < 0.45 ? "red" : (rand < 0.90 ? "black" : "green");
            let icon = resultColor === "red" ? "🔴 Червоне" : (resultColor === "black" ? "⚫ Чорне" : "🟢 Зеро");
            
            wheel.innerText = icon;
            
            if (choice === resultColor) {
                let multiplier = choice === "green" ? 14 : 2;
                let win = 100 * multiplier;
                p.m += win;
                lres.innerText = `🎉 Випадає ${icon}! Перемога +${win} грн!`;
            } else {
                lres.innerText = `❌ Випадає ${icon}. Ставка програла!`;
            }
            update();
        }
    }, 90);
}

function tryShop() {
    if (p.dayIdx === 6) { alert("❌ У неділю супермаркет зачинений!"); return; }
    if (p.hour < 6 || p.hour >= 22) { alert("❌ Працює з 06:00 до 22:00!"); return; }
    nav('shop');
}

function makeTea() { if(p.tea > 0) { p.tea--; p.t = Math.min(100, p.t + 40); addTime(0, 10); update(); } else alert("Немає чаю!"); }
function cookMiv() { if(p.raw > 0) { p.raw--; p.food++; addTime(0, 15); update(); } else alert("Немає мівіни!"); }
function eat() { if(p.food > 0) { p.food--; p.h = Math.min(100, p.h + 40); addTime(0, 15); update(); } else alert("Порожньо!"); }
function drink() { if(p.beer > 0) { p.beer--; p.bn++; p.t = Math.min(100, p.t + 20); update(); } else alert("Немає пива!"); }

function buy(item, cost) {
    let c = parseInt(cost);
    if(p.m >= c) {
        p.m -= c;
        if(item==='miv') p.raw++; if(item==='tea') p.tea++; if(item==='chips') p.food++; if(item==='beer') p.beer++;
        update(); alert("Куплено!");
    } else alert("Мало грошей!");
}
function buyMed(cost) {
    let c = parseInt(cost);
    if(p.m >= c) { p.m -= c; p.meds++; update(); alert("Ліки куплені!"); } else alert("Мало грошей!");
}
function useMed() { if(p.meds > 0) { p.meds--; p.hp = 100; update(); alert("Здоров'я в нормі!"); } else alert("Немає ліків!"); }

function attendCollege() {
    if (p.dayIdx === 5 || p.dayIdx === 6) { alert("❌ У вихідні коледж не працює!"); return; }
    if (p.hour < 9 || p.hour > 15) { alert("❌ Пари проходять з 09:00 до 15:00!"); return; }
    addTime(2, 0); p.e = Math.max(0, p.e - 20); update();
    alert("🎓 Пари успішно відвідано!");
}

function studyRemote() {
    addTime(1, 30); p.e = Math.max(0, p.e - 10); update();
    alert("💻 Дистанційне навчання в суботу пройдено!");
}

let workType = '', workCount = 0, workTarget = 5;
function startWork(type) {
    if (p.dayIdx === 6) alert("⚠️ Неділя — вихідний! Оплата за підробіток зменшена вдвічі.");
    workType = type; workCount = 0;
    workTarget = type === 'janitor' ? 5 : 8;
    document.getElementById('mg-text').innerText = type === 'janitor' ? "🧹 Швидко замітай сміття!" : "🚗 Мий авто від бруду!";
    document.getElementById('mg-count').innerText = workCount + " / " + workTarget;
    document.getElementById('mini-game').style.display = 'block';
}

function progressGame() {
    workCount++;
    if (workCount === 2 && Math.random() < 0.4) {
        let bonus = 30;
        p.m += bonus;
        alert(`⚡ Під час роботи начальник дав премію +${bonus} грн за старанність!`);
    }

    document.getElementById('mg-count').innerText = workCount + " / " + workTarget;
    if (workCount >= workTarget) {
        let basePay = workType === 'janitor' ? 90 : 140;
        let pay = p.dayIdx === 6 ? Math.floor(basePay / 2) : basePay;
        let hours = workType === 'janitor' ? 2 : 3;
        p.m += pay; addTime(hours, 0);
        document.getElementById('mini-game').style.display = 'none';
        update(); alert("🎉 Зароблено " + pay + " грн.");
    }
}

function fish() {
    if (p.e < 10) { alert("Мало енергії!"); return; }
    p.e -= 10;
    let fbtn = document.getElementById('fbtn');
    if (fbtn) fbtn.style.display = 'none';
    let fmsg = document.getElementById('fmsg');
    if (fmsg) fmsg.innerText = "⏳ Ловимо рибу...";
    setTimeout(() => {
        addTime(1, 0); p.food += 2; update();
        if (fbtn) fbtn.style.display = 'block';
        if (fmsg) fmsg.innerText = "🎉 Рибу піймано! (+2 їжі)";
    }, 1500);
}

function hackGame() {
    if (p.e < 10) { alert("Мало енергії!"); return; }
    p.e -= 10;
    addTime(1, 0);
    let code = Math.floor(Math.random() * 900) + 100;
    let ans = prompt("[ХАКЕРСЬКИЙ ВЗЛОМ]\nВведи код: " + code);
    if (ans == code) { p.f += 40; update(); alert("🔥 Успіх! +40 FPS."); }
    else alert("❌ Помилка взлому!");
}

let sInt, sAct = false, cvs, ctx;
let sn = [{x:80, y:60}], fd = {x:40, y:40}, dx = 10, dy = 0;

function toggleSnake() {
    cvs = document.getElementById('snake-canvas');
    ctx = cvs ? cvs.getContext('2d') : null;
    let box = document.getElementById('snake-box');
    let btn = document.getElementById('snake-btn');
    if(!sAct) {
        if (box) box.style.display = 'block';
        if (btn) btn.innerText = "🛑 Закрити Змійку";
        sAct = true;
        sn = [{x:80, y:60}]; dx = 10; dy = 0;
        clearInterval(sInt); sInt = setInterval(updSnake, 130);
    } else stopSnake();
}
function stopSnake() {
    clearInterval(sInt); sAct = false;
    let box = document.getElementById('snake-box');
    if (box) box.style.display = 'none';
    let btn = document.getElementById('snake-btn');
    if (btn) btn.innerText = "🐍 Грати у Змійку";
}
function leavePC() { stopSnake(); nav('room'); }

function setDir(d) {
    if(d==='UP'&&dy===0){dx=0;dy=-10;} if(d==='DOWN'&&dy===0){dx=0;dy=10;}
    if(d==='LEFT'&&dx===0){dx=-10;dy=0;} if(d==='RIGHT'&&dx===0){dx=10;dy=0;}
}

function updSnake() {
    if (!ctx || !cvs) return;
    let head = {x: sn[0].x + dx, y: sn[0].y + dy};
    if(head.x<0||head.x>=180||head.y<0||head.y>=120) { alert("🐍 Змійка врізалася!"); stopSnake(); return; }
    sn.unshift(head);
    if(head.x===fd.x && head.y===fd.y) {
        p.f += 20; addTime(0, 15); update();
        fd.x = Math.floor(Math.random()*17)*10; fd.y = Math.floor(Math.random()*11)*10;
    } else sn.pop();
    ctx.fillStyle = "#141419"; ctx.fillRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle = "#00ff66"; sn.forEach(b => ctx.fillRect(b.x, b.y, 9, 9));
    ctx.fillStyle = "#ff0055"; ctx.fillRect(fd.x, fd.y, 9, 9);
}
function supportDev() {
    alert("☕ Дякую від щирого серця! 😊\nАле найкращий донат для мене — це твоя увага до цієї гри та гарний настрій! Гракай на здоров'я, бро! 🚀🍻");
}
