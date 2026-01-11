// Инициализация Яндекс SDK
let yandexSDK;
try {
    yandexSDK = YaGames;
    yandexSDK.init().then(ysdk => {
        window.ysdk = ysdk;
        console.log('Yandex SDK initialized');
        // Включаем рекламу при инициализации
        setupAds();
    });
} catch (e) {
    console.log('Yandex SDK not available, running in standalone mode');
}

// Настройка рекламы
function setupAds() {
    if (window.ysdk) {
        // Инициализация рекламы
        window.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onClose: function(wasShown) {
                    console.log('Реклама закрыта');
                },
                onError: function(error) {
                    console.log('Ошибка рекламы:', error);
                }
            }
        });
    }
}

// Основной объект игры
const FootballCareerGame = {
    player: null,
    currentSeason: 2024,
    careerHistory: [],
    events: [],
    leagues: [
        // Топ-20 лиг УЕФА + вторые дивизионы
        { name: "Премьер-лига (Англия)", level: 1 },
        { name: "Чемпионшип (Англия)", level: 2 },
        { name: "Ла Лига (Испания)", level: 1 },
        { name: "Сегунда Дивизион (Испания)", level: 2 },
        { name: "Серия A (Италия)", level: 1 },
        { name: "Серия B (Италия)", level: 2 },
        { name: "Бундеслига (Германия)", level: 1 },
        { name: "Бундеслига 2 (Германия)", level: 2 },
        { name: "Лига 1 (Франция)", level: 1 },
        { name: "Лига 2 (Франция)", level: 2 },
        { name: "Примейра Лига (Португалия)", level: 1 },
        { name: "Лига Про (Португалия)", level: 2 },
        { name: "Эредивизи (Нидерланды)", level: 1 },
        { name: "Эрсте Дивизи (Нидерланды)", level: 2 },
        { name: "РПЛ (Россия)", level: 1 },
        { name: "ФНЛ (Россия)", level: 2 },
        { name: "Суперлига (Турция)", level: 1 },
        { name: "Первая лига (Турция)", level: 2 },
        { name: "Лига 1 (Бельгия)", level: 1 },
        { name: "Лига 2 (Бельгия)", level: 2 },
        { name: "Суперлига (Греция)", level: 1 },
        { name: "Суперлига 2 (Греция)", level: 2 },
        { name: "Премьер-лига (Шотландия)", level: 1 },
        { name: "Чемпионшип (Шотландия)", level: 2 },
        { name: "Бундеслига (Австрия)", level: 1 },
        { name: "Вторая лига (Австрия)", level: 2 },
        { name: "ХНЛ (Хорватия)", level: 1 },
        { name: "Вторая лига (Хорватия)", level: 2 },
        { name: "Суперлига (Швейцария)", level: 1 },
        { name: "Челлендж-лига (Швейцария)", level: 2 },
        { name: "Суперлига (Дания)", level: 1 },
        { name: "Первый дивизион (Дания)", level: 2 },
        { name: "Аллсвенскан (Швеция)", level: 1 },
        { name: "Суперэттан (Швеция)", level: 2 },
        { name: "Экстракласа (Польша)", level: 1 },
        { name: "Первая лига (Польша)", level: 2 },
        { name: "Фортуна Лига (Чехия)", level: 1 },
        { name: "Национальная лига (Чехия)", level: 2 },
        { name: "ОБ I Лига (Венгрия)", level: 1 },
        { name: "НБ II (Венгрия)", level: 2 }
    ],
    
    clubs: [
        "Манчестер Юнайтед", "Манчестер Сити", "Ливерпуль", "Челси", "Арсенал",
        "Реал Мадрид", "Барселона", "Атлетико Мадрид", "Валенсия", "Севилья",
        "Ювентус", "Милан", "Интер", "Рома", "Наполи",
        "Бавария", "Боруссия Дортмунд", "РБ Лейпциг", "Байер 04", "Боруссия Мёнхенгладбах",
        "ПСЖ", "Монако", "Олимпик Лион", "Марсель", "Лилль",
        "Порту", "Бенфика", "Спортинг", "Брага",
        "Аякс", "ПСВ", "Фейеноорд", "АЗ",
        "Зенит", "Спартак", "ЦСКА", "Локомотив", "Краснодар"
    ],
    
    init: function() {
        this.bindEvents();
        this.loadGame();
        this.setupWheel();
    },
    
    bindEvents: function() {
        document.getElementById('createPlayerBtn').addEventListener('click', () => this.createPlayer());
        document.getElementById('spinWheelBtn').addEventListener('click', () => this.spinWheel());
        document.getElementById('nextSeasonBtn').addEventListener('click', () => this.nextSeason());
        document.getElementById('retireBtn').addEventListener('click', () => this.retire());
        document.getElementById('newCareerBtn').addEventListener('click', () => this.newCareer());
    },
    
    createPlayer: function() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const position = document.getElementById('position').value;
        const nationality = document.getElementById('nationality').value;
        
        if (!firstName || !lastName) {
            this.addEvent("Введите имя и фамилию игрока!");
            return;
        }
        
        this.player = {
            firstName: firstName,
            lastName: lastName,
            fullName: `${firstName} ${lastName}`,
            age: 16,
            position: position,
            nationality: nationality,
            currentClub: "Молодёжная академия",
            goals: 0,
            assists: 0,
            trophies: 0,
            careerStats: [],
            clubsHistory: ["Молодёжная академия"],
            isRetired: false,
            contractYears: 0
        };
        
        this.currentSeason = 2024;
        
        // Обновление интерфейса
        document.getElementById('player-name').textContent = this.player.fullName;
        document.getElementById('player-age').textContent = `Возраст: ${this.player.age}`;
        document.getElementById('player-position').textContent = `Позиция: ${this.player.position}`;
        document.getElementById('player-nationality').textContent = `Национальность: ${this.player.nationality}`;
        document.getElementById('current-season').textContent = this.currentSeason;
        document.getElementById('current-club').textContent = `Клуб: ${this.player.currentClub}`;
        
        // Переключение экранов
        document.getElementById('player-creation-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
        this.addEvent(`Добро пожаловать, ${this.player.fullName}! Начата карьера в возрасте 16 лет.`);
        this.addEvent(`Вы играете на позиции ${this.player.position} за ${this.player.currentClub}.`);
        
        this.saveGame();
    },
    
    setupWheel: function() {
        this.wheelCanvas = document.getElementById('fortuneWheel');
        this.wheelCtx = this.wheelCanvas.getContext('2d');
        this.wheelSegments = [];
        this.wheelRotation = 0;
        this.isSpinning = false;
        
        this.drawWheel();
    },
    
    drawWheel: function() {
        const ctx = this.wheelCtx;
        const centerX = this.wheelCanvas.width / 2;
        const centerY = this.wheelCanvas.height / 2;
        const radius = 140;
        
        // Очистка холста
        ctx.clearRect(0, 0, this.wheelCanvas.width, this.wheelCanvas.height);
        
        // Определение сегментов колеса
        this.wheelSegments = [
            { color: '#FF6B6B', text: 'Отличный\nсезон', weight: 1 },
            { color: '#4ECDC4', text: 'Хороший\nсезон', weight: 2 },
            { color: '#FFD166', text: 'Средний\nсезон', weight: 3 },
            { color: '#06D6A0', text: 'Прорывной\nсезон', weight: 1 },
            { color: '#118AB2', text: 'Травма', weight: 1 },
            { color: '#EF476F', text: 'Плохой\nсезон', weight: 2 },
            { color: '#073B4C', text: 'Стабильный\nсезон', weight: 3 },
            { color: '#7209B7', text: 'Звёздный\nсезон', weight: 1 }
        ];
        
        const totalWeight = this.wheelSegments.reduce((sum, seg) => sum + seg.weight, 0);
        let currentAngle = this.wheelRotation;
        
        // Отрисовка сегментов
        for (let i = 0; i < this.wheelSegments.length; i++) {
            const segment = this.wheelSegments[i];
            const segmentAngle = (segment.weight / totalWeight) * (2 * Math.PI);
            
            // Рисуем сегмент
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Текст в сегменте
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(currentAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(segment.text, radius - 10, 5);
            ctx.restore();
            
            currentAngle += segmentAngle;
        }
        
        // Центр колеса
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = '#F39C12';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Указатель
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 150);
        ctx.lineTo(centerX - 10, centerY - 120);
        ctx.lineTo(centerX + 10, centerY - 120);
        ctx.closePath();
        ctx.fillStyle = '#E74C3C';
        ctx.fill();
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 2;
        ctx.stroke();
    },
    
    spinWheel: function() {
        if (this.isSpinning || !this.player || this.player.isRetired) return;
        
        this.isSpinning = true;
        const spinBtn = document.getElementById('spinWheelBtn');
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Крутится...';
        
        // Анимация вращения
        const spins = 5 + Math.random() * 3; // 5-8 полных оборотов
        const totalRotation = spins * 2 * Math.PI;
        const segmentIndex = Math.floor(Math.random() * this.wheelSegments.length);
        const segment = this.wheelSegments[segmentIndex];
        
        let currentRotation = 0;
        const rotationStep = 0.1;
        
        const animate = () => {
            currentRotation += rotationStep;
            this.wheelRotation += rotationStep;
            
            if (currentRotation >= totalRotation) {
                // Остановка на выбранном сегменте
                this.isSpinning = false;
                spinBtn.disabled = false;
                spinBtn.innerHTML = '<i class="fas fa-redo"></i> Крутить колесо';
                this.processSeasonResult(segment.text);
                this.drawWheel();
                return;
            }
            
            this.drawWheel();
            requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    processSeasonResult: function(result) {
        if (!this.player) return;
        
        const age = this.player.age;
        const position = this.player.position;
        
        // Базовые значения в зависимости от результата
        let goals = 0;
        let assists = 0;
        let trophies = 0;
        let event = "";
        let newClub = null;
        let contractExtension = false;
        let retirementCheck = false;
        
        switch(result) {
            case 'Отличный\nсезон':
                goals = this.generateStats(15, 40, position);
                assists = this.generateStats(10, 25, position);
                trophies = Math.random() > 0.7 ? 1 : 0;
                event = "Фантастический сезон! Вы были одним из лучших игроков лиги.";
                contractExtension = Math.random() > 0.3;
                break;
                
            case 'Хороший\nсезон':
                goals = this.generateStats(10, 25, position);
                assists = this.generateStats(8, 20, position);
                trophies = Math.random() > 0.8 ? 1 : 0;
                event = "Хороший сезон, вы были важной частью команды.";
                contractExtension = Math.random() > 0.5;
                break;
                
            case 'Средний\nсезон':
                goals = this.generateStats(5, 15, position);
                assists = this.generateStats(5, 12, position);
                event = "Стабильный сезон без особых взлётов и падений.";
                contractExtension = Math.random() > 0.7;
                break;
                
            case 'Прорывной\nсезон':
                goals = this.generateStats(20, 50, position);
                assists = this.generateStats(12, 30, position);
                trophies = Math.random() > 0.6 ? 1 : 0;
                event = "Прорывной сезон! Вас заметили скауты крупных клубов.";
                newClub = this.getRandomClub();
                break;
                
            case 'Травма':
                goals = this.generateStats(0, 5, position);
                assists = this.generateStats(0, 3, position);
                event = "К сожалению, сезон был омрачён травмой.";
                contractExtension = Math.random() > 0.8;
                break;
                
            case 'Плохой\nсезон':
                goals = this.generateStats(0, 8, position);
                assists = this.generateStats(0, 6, position);
                event = "Сложный сезон, не всё получилось как хотелось.";
                contractExtension = Math.random() > 0.9;
                if (age > 30) retirementCheck = true;
                break;
                
            case 'Стабильный\nсезон':
                goals = this.generateStats(8, 20, position);
                assists = this.generateStats(6, 15, position);
                event = "Надёжная игра на протяжении всего сезона.";
                contractExtension = Math.random() > 0.6;
                break;
                
            case 'Звёздный\nсезон':
                goals = this.generateStats(25, 60, position);
                assists = this.generateStats(15, 35, position);
                trophies = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
                event = "Звёздный сезон! Вы номинированы на Золотой мяч!";
                newClub = this.getRandomTopClub();
                contractExtension = Math.random() > 0.2;
                break;
        }
        
        // Проверка на пенсию (36+ лет)
        if (age >= 36) {
            const retireChance = (age - 35) * 0.2; // С каждым годом шанс выше
            if (Math.random() < retireChance) {
                retirementCheck = true;
            }
        }
        
        // Обновление статистики игрока
        this.player.goals += goals;
        this.player.assists += assists;
        this.player.trophies += trophies;
        this.player.age++;
        
        // Обработка контракта и переходов
        if (newClub && newClub !== this.player.currentClub) {
            this.player.clubsHistory.push(newClub);
            this.player.currentClub = newClub;
            event += ` Переход в ${newClub}!`;
        } else if (contractExtension) {
            event += " Контракт продлён.";
        } else if (retirementCheck) {
            event += " Рассматриваете предложение о завершении карьеры.";
        }
        
        // Сохранение сезона в историю
        const seasonRecord = {
            age: age,
            club: this.player.currentClub,
            goals: goals,
            assists: assists,
            trophies: trophies,
            event: event.split('.')[0] + '.'
        };
        
        this.player.careerStats.push(seasonRecord);
        this.careerHistory.push(seasonRecord);
        
        // Обновление интерфейса
        this.updateUI();
        this.addEvent(`Сезон ${this.currentSeason} завершён: ${event}`);
        
        // Проверка на завершение карьеры
        if (retirementCheck && age >= 36 && Math.random() > 0.5) {
            setTimeout(() => this.retire(), 1000);
        }
        
        this.saveGame();
    },
    
    generateStats: function(min, max, position) {
        let adjustedMax = max;
        
        // Корректировка в зависимости от позиции
        switch(position) {
            case 'Вратарь':
                adjustedMax = Math.floor(max * 0.1); // Голы для вратарей редки
                break;
            case 'Защитник':
                adjustedMax = Math.floor(max * 0.4);
                break;
            case 'Полузащитник':
                adjustedMax = Math.floor(max * 0.7);
                break;
            // Нападающие получают полные значения
        }
        
        return Math.floor(Math.random() * (adjustedMax - min + 1)) + min;
    },
    
    getRandomClub: function() {
        return this.clubs[Math.floor(Math.random() * this.clubs.length)];
    },
    
    getRandomTopClub: function() {
        const topClubs = this.clubs.slice(0, 15); // Первые 15 клубов считаем топовыми
        return topClubs[Math.floor(Math.random() * topClubs.length)];
    },
    
    nextSeason: function() {
        if (!this.player || this.player.isRetired) return;
        
        if (this.player.age >= 42) {
            this.retire();
            return;
        }
        
        this.currentSeason++;
        document.getElementById('current-season').textContent = this.currentSeason;
        
        // Сброс кнопки колеса
        document.getElementById('spinWheelBtn').disabled = false;
        document.getElementById('spinWheelBtn').innerHTML = '<i class="fas fa-redo"></i> Крутить колесо';
        
        this.addEvent(`Начало сезона ${this.currentSeason}!`);
        
        this.saveGame();
    },
    
    retire: function() {
        if (!this.player || this.player.isRetired) return;
        
        this.player.isRetired = true;
        
        // Показ экрана завершения карьеры
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('retirement-screen').classList.add('active');
        
        // Обновление финальной статистики
        document.getElementById('final-player-name').textContent = this.player.fullName;
        document.getElementById('final-goals').textContent = this.player.goals;
        document.getElementById('final-assists').textContent = this.player.assists;
        document.getElementById('final-trophies').textContent = this.player.trophies;
        document.getElementById('final-seasons').textContent = this.player.careerStats.length;
        document.getElementById('final-clubs').textContent = this.player.clubsHistory.length;
        
        // Поиск лучшего сезона
        let bestSeason = { goals: 0, assists: 0 };
        this.player.careerStats.forEach(season => {
            if (season.goals + season.assists > bestSeason.goals + bestSeason.assists) {
                bestSeason = season;
            }
        });
        
        document.getElementById('best-season').textContent = 
            bestSeason.goals > 0 ? `${bestSeason.goals} г. ${bestSeason.assists} п. в ${bestSeason.age} лет` : '-';
        
        const avgGoals = this.player.careerStats.length > 0 ? 
            (this.player.goals / this.player.careerStats.length).toFixed(1) : '0';
        document.getElementById('avg-goals').textContent = avgGoals;
        
        this.addEvent(`${this.player.fullName} завершил карьеру в возрасте ${this.player.age} лет.`);
        
        // Показ рекламы при завершении карьеры
        if (window.ysdk) {
            window.ysdk.adv.showFullscreenAdv();
        }
        
        this.saveGame();
    },
    
    newCareer: function() {
        // Сброс игры
        this.player = null;
        this.currentSeason = 2024;
        this.careerHistory = [];
        this.events = [];
        
        // Очистка интерфейса
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('total-goals').textContent = '0';
        document.getElementById('total-assists').textContent = '0';
        document.getElementById('total-trophies').textContent = '0';
        
        const careerTable = document.getElementById('career-table').getElementsByTagName('tbody')[0];
        careerTable.innerHTML = '';
        
        const eventsLog = document.getElementById('events-log');
        eventsLog.innerHTML = '<div class="event">Добро пожаловать в Футбольную Карьеру!</div>';
        
        // Переключение экранов
        document.getElementById('retirement-screen').classList.remove('active');
        document.getElementById('player-creation-screen').classList.add('active');
        
        this.saveGame();
    },
    
    updateUI: function() {
        if (!this.player) return;
        
        document.getElementById('player-age').textContent = `Возраст: ${this.player.age}`;
        document.getElementById('current-season').textContent = this.currentSeason;
        document.getElementById('current-club').textContent = `Клуб: ${this.player.currentClub}`;
        document.getElementById('total-goals').textContent = this.player.goals;
        document.getElementById('total-assists').textContent = this.player.assists;
        document.getElementById('total-trophies').textContent = this.player.trophies;
        
        // Обновление таблицы карьеры
        const careerTable = document.getElementById('career-table').getElementsByTagName('tbody')[0];
        careerTable.innerHTML = '';
        
        this.player.careerStats.forEach(season => {
            const row = careerTable.insertRow();
            row.innerHTML = `
                <td>${season.age}</td>
                <td>${season.club}</td>
                <td>${season.goals}</td>
                <td>${season.assists}</td>
                <td>${season.trophies}</td>
                <td>${season.event}</td>
            `;
        });
    },
    
    addEvent: function(text) {
        const eventsLog = document.getElementById('events-log');
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.textContent = `[Сезон ${this.currentSeason}] ${text}`;
        eventsLog.appendChild(eventElement);
        eventsLog.scrollTop = eventsLog.scrollHeight;
        this.events.push(text);
    },
    
    saveGame: function() {
        const gameData = {
            player: this.player,
            currentSeason: this.currentSeason,
            careerHistory: this.careerHistory,
            events: this.events.slice(-50) // Сохраняем последние 50 событий
        };
        
        try {
            localStorage.setItem('footballCareerGame', JSON.stringify(gameData));
        } catch (e) {
            console.log('Не удалось сохранить игру:', e);
        }
    },
    
    loadGame: function() {
        try {
            const savedData = localStorage.getItem('footballCareerGame');
            if (savedData) {
                const gameData = JSON.parse(savedData);
                
                if (gameData.player) {
                    this.player = gameData.player;
                    this.currentSeason = gameData.currentSeason;
                    this.careerHistory = gameData.careerHistory || [];
                    this.events = gameData.events || [];
                    
                    // Восстановление интерфейса
                    if (this.player.isRetired) {
                        this.showRetirementScreen();
                    } else {
                        this.showGameScreen();
                    }
                }
            }
        } catch (e) {
            console.log('Не удалось загрузить игру:', e);
        }
    },
    
    showGameScreen: function() {
        document.getElementById('player-creation-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        document.getElementById('retirement-screen').classList.remove('active');
        
        this.updateUI();
        
        // Восстановление событий
        const eventsLog = document.getElementById('events-log');
        eventsLog.innerHTML = '';
        this.events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';
            eventElement.textContent = event;
            eventsLog.appendChild(eventElement);
        });
    },
    
    showRetirementScreen: function() {
        this.retire(); // Вызовет обновление экрана завершения
    }
};

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    FootballCareerGame.init();
});
