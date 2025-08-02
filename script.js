// Telegram Web App интеграция
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Расширяем приложение на весь экран
        tg.expand();
        
        // Устанавливаем цвет заголовка
        tg.setHeaderColor('#000000');
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
            // Обновляем никнейм
            const nicknameElement = document.querySelector('.nickname');
            if (nicknameElement) {
                // Используем username, если есть, иначе first_name
                const displayName = user.username ? `@${user.username}` : user.first_name || 'User';
                nicknameElement.textContent = displayName;
            }
            
            // Можно также обновить аватар, если есть photo_url
            if (user.photo_url) {
                const avatarElement = document.querySelector('.avatar');
                if (avatarElement) {
                    avatarElement.src = user.photo_url;
                }
            }
            
            console.log('Telegram user data:', user);
        } else {
            console.log('Telegram user data not available');
        }
        
        // Обработчики для кнопок
        setupTelegramHandlers(tg);
        
    } else {
        console.log('Telegram Web App API not available');
        // Fallback для тестирования вне Telegram
        setupFallbackHandlers();
    }
});

function setupTelegramHandlers(tg) {
    // Обработчик для кнопки Connect Wallet
    const connectWalletBtn = document.querySelector('.connect-wallet-btn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', function() {
            tg.showAlert('Подключение кошелька...');
            // Здесь можно добавить логику подключения кошелька
        });
    }
    
    // Обработчик для главной кнопки (click.png)
    const clickBtn = document.querySelector('.click-btn');
    if (clickBtn) {
        clickBtn.addEventListener('click', function() {
            // Добавляем вибрацию
            tg.HapticFeedback.impactOccurred('medium');
            
            // Увеличиваем счетчик монет (пример)
            const coinsAmount = document.querySelector('.coins-amount');
            if (coinsAmount) {
                let currentAmount = parseFloat(coinsAmount.textContent) || 0;
                currentAmount += 0.01;
                coinsAmount.textContent = currentAmount.toFixed(2);
            }
            
            // Обновляем прогресс
            updateProgress();
        });
    }
    
    // Обработчик для кнопки Check
    const checkBtn = document.querySelector('.check-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', function() {
            tg.showAlert('Проверка выполнена!');
        });
    }
    
    // Обработчики для навигации
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            navBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
            
            // Вибрация при переключении
            tg.HapticFeedback.selectionChanged();
            
            const navText = btn.querySelector('.nav-text').textContent;
            console.log(`Переключение на: ${navText}`);
        });
    });
}

function setupFallbackHandlers() {
    // Fallback обработчики для тестирования вне Telegram
    const connectWalletBtn = document.querySelector('.connect-wallet-btn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', function() {
            alert('Подключение кошелька...');
        });
    }
    
    const clickBtn = document.querySelector('.click-btn');
    if (clickBtn) {
        clickBtn.addEventListener('click', function() {
            const coinsAmount = document.querySelector('.coins-amount');
            if (coinsAmount) {
                let currentAmount = parseFloat(coinsAmount.textContent) || 0;
                currentAmount += 0.01;
                coinsAmount.textContent = currentAmount.toFixed(2);
            }
            updateProgress();
        });
    }
    
    const checkBtn = document.querySelector('.check-btn');
    if (checkBtn) {
        checkBtn.addEventListener('click', function() {
            alert('Проверка выполнена!');
        });
    }
}

function updateProgress() {
    // Обновляем прогресс (пример)
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        const currentText = progressText.textContent;
        const match = currentText.match(/(\d+)\/(\d+)/);
        if (match) {
            let current = parseInt(match[1]);
            const max = parseInt(match[2]);
            if (current < max) {
                current += 1;
                progressText.textContent = `${current}/${max}`;
                
                // Обновляем визуальный прогресс
                const progressFill = document.querySelector('.progress-fill');
                if (progressFill) {
                    const percentage = (current / max) * 100;
                    progressFill.style.width = `${percentage}%`;
                }
            }
        }
    }
}

// Функция для отправки данных в Telegram бот (если нужно)
function sendDataToBot(data) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify(data));
    }
}

// Экспортируем функции для использования в других местах
window.TelegramApp = {
    sendDataToBot,
    updateProgress
};