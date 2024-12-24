// Инициализация перетаскивания
document.querySelectorAll('.images img').forEach(img => {
    img.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
        img.classList.add('dragging'); // Добавляем класс для перетаскиваемого элемента
    });

    img.addEventListener('dragend', () => {
        img.classList.remove('dragging'); // Убираем класс после завершения перетаскивания
    });
});

// Зоны для сброса
document.querySelectorAll('.dropzone').forEach(zone => {
    zone.addEventListener('dragover', (event) => {
        event.preventDefault(); // Разрешаем сброс
    });

    zone.addEventListener('drop', (event) => {
        event.preventDefault();

        const draggedElementId = event.dataTransfer.getData('text/plain'); // Получаем ID перетаскиваемого элемента
        const draggedElement = document.getElementById(draggedElementId);

        if (draggedElement) {
            // Проверяем правильность вставки
            if (zone.dataset.correct === draggedElement.id) {
                // Очищаем зону и добавляем изображение
                zone.innerHTML = '';
                zone.appendChild(draggedElement);

                // Добавляем название картины
                const title = document.createElement('span');
                title.textContent = draggedElement.alt;
                zone.insertBefore(title, draggedElement);

                // Стили правильного выбора
                zone.style.borderColor = '#27ae60';
                zone.style.backgroundColor = '#f5f9f5';

                // Уведомление о правильной вставке
                showNotification(`Правильно! Это "${draggedElement.alt}"`, 'success');
            } else {
                // Стили неправильного выбора
                zone.style.borderColor = '#e74c3c';
                zone.style.backgroundColor = '#fdeae9';

                // Уведомление об ошибке
                showNotification('Неверно! Попробуйте еще раз.', 'error');

                setTimeout(() => {
                    zone.style.borderColor = '#c8b7a6'; // Возврат рамки
                    zone.style.backgroundColor = '#fdf6e3'; // Возврат фона
                }, 1000);
            }
        }
    });
});

// Функция отображения уведомлений
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Убираем уведомление через 2.5 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300); // Ждем завершения анимации
    }, 2500);
}
