const DATA_SOURCES = {
    world: [
        'https://www.pravda.com.ua/rss/view_news/',
        'https://rss.dw.com/xml/rss-ukr-mp'
    ],
    physics: [
        'https://phys.org/rss-feed/physics-news/',
        'https://www.sciencedaily.com/rss/matter_energy/physics.xml'
    ],
    tech: [
        'https://itc.ua/rss/',
        'https://dou.ua/feed/'
    ],
    bio: [
        'https://www.sciencedaily.com/rss/plants_animals/biology.xml',
        'https://moz.gov.ua/rss'
    ],
    space: [
        'https://universemagazine.com/feed/',
        'https://www.nasa.gov/rss/dyn/breaking_news.rss'
    ],
    culture: [
        'https://suspilne.media/rss/culture/',
        'https://liroom.com.ua/feed/'
    ],
    sport: [
        'https://champion.com.ua/rss/view_news/',
        'https://sport.ua/rss'
    ],
    finance: [
        'https://www.epravda.com.ua/rss/',
        'https://biz.nv.ua/ukr/rss/finance.xml'
    ]
};

const UPDATE_INTERVAL = 60000; // 1 minute
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// State
let appState = {
    news: {
        world: [],
        physics: [],
        tech: [],
        bio: [],
        space: [],
        culture: [],
        sport: [],
        finance: []
    },
    images: {
        world: null,
        physics: null,
        bio: null,
        space: null,
        culture: null
    },
    analytics: {
        positive: 0,
        negative: 0
    },
    logs: []
};

// --- CORE FUNCTIONS ---

function init() {
    updateClock();
    setInterval(updateClock, 1000);

    // Initial Fetch
    fetchAllData();

    // Set interval for updates
    setInterval(() => {
        logSystem('Розпочато планове оновлення даних...');
        fetchAllData();
    }, UPDATE_INTERVAL);

    // Visual Timer countdown
    startTimer();
}

function updateClock() {
    moment.locale('uk');
    const now = moment();
    document.getElementById('live-clock').innerText = now.format('HH:mm:ss');
    document.getElementById('date-display').innerText = now.format('dddd, D MMMM YYYY');
}

function startTimer() {
    let seconds = 60;
    const el = document.getElementById('timer-world');
    if (el) {
        setInterval(() => {
            seconds--;
            if (seconds < 0) seconds = 60;
            el.innerText = seconds;
        }, 1000);
    }
}

function logSystem(msg) {
    const logEl = document.getElementById('system-log');
    if (!logEl) return;
    const time = moment().format('HH:mm:ss');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${time}]</span> ${msg}`;
    logEl.prepend(entry);

    // Keep log clean
    if (logEl.children.length > 50) {
        logEl.removeChild(logEl.lastChild);
    }
}

// --- DATA FETCHING ---

async function fetchAllData() {
    logSystem('Оновлення глобальної стрічки...');

    const categories = ['world', 'physics', 'tech', 'bio', 'space', 'culture', 'sport', 'finance'];

    // Stagger fetches to avoid rate limit
    categories.forEach((cat, index) => {
        setTimeout(() => fetchCategory(cat, `${cat}-stream`), index * 1500);
    });
}

const SIMULATED_NEWS = {
    world: [
        { title: "Глобальний саміт досяг історичної угоди щодо клімату", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1621274403997-37aace184f49?auto=format&fit=crop&w=600&q=80", description: "Лідери 190 країн підписали зобов'язуючу угоду про скорочення викидів. Це рішення визначає екологічну політику планети на наступне десятиліття. Угода включає конкретні кроки щодо відмови від вугілля та перехід до відновлюваних джерел енергії, що має зупинити глобальне потепління." },
        { title: "Дипломатичний прорив у мирних переговорах", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80", description: "Напруженість спадає, оскільки держави погодили нову структуру безпеки. Експерти вважають це найважливішим моментом останніх років. Новий меморандум передбачає створення демілітаризованих зон та міжнародний контроль над ключовими транзитними шляхами, що стабілізує регіон." }
    ],
    physics: [
        { title: "Відкрито новий стан матерії в квантовому комп'ютері", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80", description: "Фізики спостерігали екзотичні частинки, що існують лише мільйонні частки секунди. Це відкриває шлях до створення надстабільних квантових процесорів майбутнього. Дослідження доводить можливість маніпуляції топологічними станами матерії на рівні окремих кубітів." },
        { title: "Прорив у термоядерному синтезі: новий рекорд", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80", description: "Реактор виробив більше енергії, ніж спожив під час запуску. Це наближає еру нескінченної чистої енергії для всього людства. Команда науковців зуміла підтримати стабільну плазму протягом рекордних 15 хвилин при температурі, що вдесятеро перевищує сонячну." }
    ],
    tech: [
        { title: "ШІ навчився писати код краще за людей", link: "#", pubDate: new Date(), description: "Нова модель Google Gemini показує неймовірні результати у складних алгоритмічних тестах. Програмування стає діалогом з інтелектуальною системою. Система не просто генерує код, а проводить глибокий рефакторинг та автоматично виправляє потенційні вразливості безпеки ще на стадії написання." },
        { title: "Apple представила революційні AR окуляри", link: "#", pubDate: new Date(), description: "Технологія доповненої реальності виходить на новий рівень з безшовною інтеграцією в повсякденне життя. Світ навколо стає інтерактивним полотном. Окуляри використовують передові сенсори для точного мапування простору, дозволяючи віртуальним об'єктам взаємодіяти з реальними фізичними предметами." }
    ],
    bio: [
        { title: "Вчені успішно відредагували геном для лікування хвороби", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80", description: "Технологія CRISPR рятує життя, виправляючи генетичні дефекти на рівні клітини. Перші пацієнти вже демонструють повне одужання. Цей клінічний успіх відкриває двері для терапії тисяч спадкових захворювань, які раніше вважалися невиліковними." },
        { title: "Знайдено новий вид бактерій, що їдять пластик", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80", description: "Надія на очищення океанів з'явилася завдяки мікроорганізмам, що розкладають полімери за лічені дні. Екологічна катастрофа може бути зупинена біологічним шляхом. Вчені працюють над масштабуванням цього процесу для промислового використання у переробці сміття." }
    ],
    space: [
        { title: "Телескоп NASA виявив воду на екзопланеті", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80", description: "Сліди життя можуть бути всюди. Аналіз атмосфери планети в зоні придатності до життя показав наявність водяної пари та метану. Це найсильніший доказ існування середовища, яке здатне підтримувати біологічні процеси за межами нашої Сонячної системи." },
        { title: "Starship готується до польоту на Марс", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80", description: "Колонізація червоної планети ближче, ніж здається. SpaceX проводить фінальні випробування двигунів Raptor 3. Планується, що перша безпілотна місія відправиться вже через два роки, везучи необхідне обладнання для створення паливної бази на поверхні Марса." }
    ],
    culture: [
        { title: "Український фільм отримав Оскар", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80", description: "Історична перемога вітчизняного кінематографу на головній арені світу. Стрічка вразила критиків своєю глибиною та візуальною мовою. Режисер зазначив, що цей тріумф належить усім українцям, які продовжують творити та надихати світ у найскладніші часи." },
        { title: "Виставка сучасного мистецтва в Києві", link: "#", pubDate: new Date(), image: "https://images.unsplash.com/photo-1545989253-02cc26577452?auto=format&fit=crop&w=600&q=80", description: "Мистецький Арсенал відкриває нову експозицію, що поєднує цифрові інсталяції та класичне малярство. Це новий погляд на ідентичність. Куратори зібрали роботи понад 50 митців, які досліджують тему ментальної стійкості через різні медіа-формати." }
    ],
    sport: [
        { title: "Збірна України виходить на Євро", link: "#", pubDate: new Date(), description: "Фантастична гра у вирішальному матчі принесла команді путівку до фінальної частини чемпіонату. Вся країна святкує цей спортивний успіх. Вирішальний гол був забитий на останніх хвилинах доданого часу, що викликало шквал емоцій на трибунах та в серцях вболівальників." }
    ],
    finance: [
        { title: "Криптовалютний ринок досяг нового максимуму", link: "#", pubDate: new Date(), description: "Біткоїн продовжує впевнене зростання, встановлюючи рекорди вартості на тлі інституційного прийняття. Інвестори вбачають у цифрових активах надійний засіб збереження капіталу в умовах нестабільності традиційних фінансових систем та інфляції." },
        { title: "Світова економіка демонструє ознаки стабілізації", link: "#", pubDate: new Date(), description: "Центральні банки провідних країн світу повідомляють про сповільнення темпів інфляції. Фондові ринки реагують позитивно, очікуючи на зниження відсоткових ставок. Це створює сприятливі умови для довгострокового кредитування бізнесу." }
    ]
};

async function fetchCategory(category, elementId) {
    const urls = DATA_SOURCES[category];
    const url = urls[Math.floor(Math.random() * urls.length)];
    const fetchUrl = `${RSS2JSON_API}${encodeURIComponent(url)}`;

    try {
        logSystem(`Завантаження ${category}...`);
        const response = await fetch(fetchUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items.length > 0) {
            appState.news[category] = data.items;
            logSystem(`Оновлено ${category}: ${data.items.length} матеріалів.`);

            // Try to extract image from first item
            const item = data.items[0];
            let imgUrl = null;
            if (item.enclosure && item.enclosure.link) imgUrl = item.enclosure.link;
            else if (item.thumbnail) imgUrl = item.thumbnail;

            if (imgUrl) appState.images[category] = imgUrl;

        } else {
            throw new Error(data.message || 'Елементи не знайдено');
        }
    } catch (e) {
        logSystem(`Помилка мережі для ${category}. Резерв.`);
        // Fallback
        if (!appState.news[category] || appState.news[category].length === 0) {
            const fallbackData = SIMULATED_NEWS[category] || [];
            if (fallbackData.length > 0) {
                appState.news[category] = fallbackData.map(item => ({
                    ...item,
                    pubDate: new Date().toISOString()
                }));
                // Set simulated image if available
                if (fallbackData[0].image) appState.images[category] = fallbackData[0].image;
            }
        }
    }

    // Render
    renderNews(category, elementId);
    updateTicker();
    analyzeSentiment();
}

// --- HOT STREAM & NAV ---

function updateHotStream() {
    const container = document.getElementById('main-hot-stream');
    if (!container) return;

    // Aggregate all news
    let allNews = [];
    Object.keys(appState.news).forEach(cat => {
        const catItems = appState.news[cat];
        if (catItems && Array.isArray(catItems)) {
            catItems.forEach(item => {
                allNews.push({ ...item, category: cat });
            });
        }
    });

    // Sort by Date (Newest First)
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Valid unique items (deduplication by title just in case)
    const uniqueNews = [];
    const seenTitles = new Set();
    allNews.forEach(item => {
        if (!seenTitles.has(item.title)) {
            seenTitles.add(item.title);
            uniqueNews.push(item);
        }
    });

    // Render top 20
    container.innerHTML = '';
    uniqueNews.slice(0, 20).forEach(item => {
        const el = document.createElement('div');
        el.className = 'hot-item';

        const time = moment(item.pubDate).format('HH:mm');
        const map = {
            'world': 'СВІТ',
            'physics': 'ФІЗИКА',
            'tech': 'ТЕХНО',
            'bio': 'БІО',
            'space': 'КОСМОС',
            'culture': 'КУЛЬТ',
            'sport': 'СПОРТ',
            'finance': 'ФІНАНСИ'
        };
        const catName = map[item.category] || item.category.toUpperCase();

        // Try to get image if available
        let imgHtml = '';
        if (item.enclosure && item.enclosure.link) {
            imgHtml = `<div style="height: 100px; overflow: hidden; margin-bottom: 8px;"><img src="${item.enclosure.link}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;"></div>`;
        }

        el.innerHTML = `
            <div class="hot-item-time">${time} // ${catName}</div>
            ${imgHtml}
            <div class="hot-item-title"><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;">${item.title}</a></div>
        `;
        container.appendChild(el);
    });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add temporary highlight
        el.style.transition = 'box-shadow 0.3s ease';
        el.style.boxShadow = '0 0 20px rgba(255,255,255,0.2)';
        setTimeout(() => {
            el.style.boxShadow = 'none';
        }, 1500);
    }
}

// --- RENDERING ---

function renderNews(category, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    container.innerHTML = '';
    const items = appState.news[category] ? appState.news[category].slice(0, 30) : [];

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'news-item';

        const date = moment(item.pubDate).fromNow();
        let snippet = item.description || '';
        snippet = snippet.replace(/<[^>]*>?/gm, '').substring(0, 250) + '...';

        const categoryMap = {
            'world': 'СВІТ',
            'physics': 'ФІЗИКА',
            'tech': 'ТЕХНО',
            'bio': 'БІО',
            'space': 'КОСМОС',
            'culture': 'КУЛЬТ',
            'sport': 'СПОРТ',
            'finance': 'ФІНАНСИ'
        };

        el.innerHTML = `
            <div class="news-meta">
                <span class="highlight">${categoryMap[category] || category.toUpperCase()}</span> // ${date}
            </div>
            <div class="news-title"><a href="${item.link}" target="_blank" style="color:inherit;text-decoration:none;">${item.title}</a></div>
            <div class="news-summary">${snippet}</div>
        `;
        container.appendChild(el);
    });

    // Handle Visuals
    const visualId = `${category}-visual`;
    const visualContainer = document.getElementById(visualId);

    if (visualContainer) {
        // Try to get an image from appState (real or simulated)
        let imgUrl = appState.images[category];

        // If we have a simulated image but not real one, use it.
        // Or if we are in fallback mode.
        if (!imgUrl && SIMULATED_NEWS[category] && SIMULATED_NEWS[category][0].image) {
            imgUrl = SIMULATED_NEWS[category][0].image;
        }

        if (imgUrl) {
            visualContainer.innerHTML = `<img src="${imgUrl}" alt="${category} image">`;
        }
    }

    // Update global stream whenever a category updates
    updateHotStream();
}

function updateTicker() {
    const ticker = document.getElementById('news-ticker');
    let allTitles = [];
    Object.keys(appState.news).forEach(cat => {
        const items = appState.news[cat];
        if (items) {
            items.forEach(item => allTitles.push(item.title));
        }
    });

    allTitles = allTitles.sort(() => 0.5 - Math.random()).slice(0, 20);
    const tickerContent = allTitles.map(t => `<span class="ticker-item">+++ ${t} +++</span>`).join('');

    if (ticker && (ticker.innerHTML.length < 100 || Math.random() > 0.8)) {
        ticker.innerHTML = tickerContent;
    }
}

// --- ANALYTICS ---

// --- ANALYTICS ---

let sentimentChart = null;
let analyticDebounce = null;

function analyzeSentiment() {
    if (analyticDebounce) clearTimeout(analyticDebounce);
    analyticDebounce = setTimeout(() => {
        performAnalysis();
    }, 500);
}

function performAnalysis() {
    let text = "";
    let totalItems = 0;
    Object.keys(appState.news).forEach(cat => {
        const items = appState.news[cat];
        if (items) {
            totalItems += items.length;
            items.forEach(item => text += " " + item.title + " " + (item.description || ""));
        }
    });

    if (!text) return;

    // Enhanced Ukrainian Sentiment Dictionary
    const positiveWords = ['успіх', 'перемога', 'досягнення', 'рекорд', 'відкриття', 'мир', 'зростання', 'щастя', 'надія', 'найкращий', 'золото', 'прорив', 'розвиток', 'допомога', 'підтримка', 'визволення', 'стабільність', 'відновлення', 'інновація', 'шедевр', 'тріумф', 'безпека'];
    const negativeWords = ['війна', 'криза', 'смерть', 'загибель', 'втрата', 'катастрофа', 'атака', 'загроза', 'ризик', 'проблема', 'конфлікт', 'провал', 'поразка', 'вогонь', 'вибух', 'обстріл', 'корупція', 'скандал', 'смертельна', 'трагедія', 'кривавий', 'руйнування'];

    let posCount = 0;
    let negCount = 0;

    // Split by non-alphanumeric (including unicode for cyrillic)
    const words = text.toLowerCase().match(/[а-яіїєґa-z]+/gu) || [];

    words.forEach(w => {
        if (positiveWords.includes(w)) posCount++;
        if (negativeWords.includes(w)) negCount++;
    });

    const totalWords = posCount + negCount || 1;
    const posPercent = Math.round((posCount / totalWords) * 100);
    const negPercent = Math.round((negCount / totalWords) * 100);

    // Update Basic UI
    const posEl = document.getElementById('stat-pos');
    const negEl = document.getElementById('stat-neg');
    if (posEl) posEl.innerText = posPercent + '%';
    if (negEl) negEl.innerText = negPercent + '%';

    // SOCIAL INDICES CALCULATION (Simulated Logic based on news)
    const tension = Math.min(100, (negCount / (totalItems + 1)) * 50 + (negPercent * 0.5));
    const trust = Math.max(0, (posPercent * 0.8) - (tension * 0.2));
    const focus = (totalItems > 50) ? 'ГЛОБАЛЬНИЙ' : 'ЛОКАЛЬНИЙ';

    document.getElementById('index-tension').innerText = tension.toFixed(1) + '%';
    document.getElementById('index-trust').innerText = trust.toFixed(1) + '%';
    document.getElementById('index-focus').innerText = focus;

    // Update Chart
    updateChart(posCount || 1, negCount || 1);
}

function updateChart(pos, neg) {
    const canvas = document.getElementById('sentimentChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (sentimentChart) {
        sentimentChart.data.datasets[0].data = [pos, neg];
        sentimentChart.update();
    } else {
        sentimentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Позитив', 'Негатив'],
                datasets: [{
                    data: [pos, neg],
                    backgroundColor: ['#2ed573', '#ff4757'],
                    borderColor: '#1e1e1e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Start
document.addEventListener('DOMContentLoaded', init);
