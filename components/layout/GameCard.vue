<template>
    <div class="game-card">
        <img class="game-cover" :src="image" alt="Puzzle Card" />
        <div class="game-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <button @click="$emit('startGame')">Играть</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps ({
    title: String,
    description: String,
    image: String
})
</script>

<style lang="scss" scoped>
    .game-card {
        width: 100%;
        max-width: 500px;
        height: 300px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 30px;
        background-color: white;
        border-radius: 30px;
        box-shadow:  0 0 20px rgba(0, 0, 0, 0.5);
        padding-inline: 30px;
        margin: 30px auto;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        .game-cover {
            height: 230px;
            border-radius: 5px;
        }

        .game-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
            
            h1 {
                font-size: 32px;
                text-align: center;
                margin: 0;
            }

            p {
                font-size: 16px;
                margin: 0;
            }

            button {
                width: 100px;
                height: 40px;
                border: none;
                border-radius: 10px;
                background-color: #8675ac;
                color: white;
                font-size: 16px;
                cursor: pointer;
                margin-block-start: 10px;

                &:hover {
                    background-color: #5a4c80;
                    transition: 0.3s;
                }
            }

        }
    }
    .game-card:hover {
    transform: translateY(-5px); /* Легкий "подъем" карточки при наведении */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Увеличение тени при наведении */
}

.game-card h2 {
    font-size: 1.5rem; /* Заголовок покрупнее */
    margin-bottom: 10px;
    color: #333; /* Темный цвет для контраста */
}

.game-card p {
    font-size: 1rem; /* Размер текста для мобильных устройств */
    color: #666; /* Серый цвет текста */
}

@media (max-width: 1400px) {
    .games-container {
        grid-template-columns: 1fr; /* Одна колонка на узких экранах */
        padding: 10px;
    }

    .game-card {
        padding: 15px; /* Уменьшаем внутренние отступы */
        width: 95%;
        .game-cover {
            height: 200px;
        }
    }

    .game-card h2 {
        font-size: 1.25rem; /* Уменьшаем заголовок */
    }

    .game-card p {
        font-size: 0.9rem; /* Уменьшаем текст */
    }
}

@media (max-width: 480px) {
    .game-card {
        padding: 10px; /* Еще меньший отступ для компактности */
        width: 60%;
        padding-block: 20px;
        display:flex;
        flex-direction: column;
        align-items: center;
        height: auto;

        .game-cover {
            height: 150px;
        }
    }

    .game-card h2 {
        font-size: 1rem; /* Компактный заголовок */
    }

    .game-card p {
        font-size: 0.85rem; /* Компактный текст */
        text-align: center;
    }
}
</style>
    