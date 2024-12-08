<template>
    <div>
        <!-- Если игра не началась, показываем главную страницу -->
        <div v-if="!isGameStarted" class="games-container">
            <GameCard
                title="Пазлы"
                description="Соберите красивый пазл, чтобы получить одну из картин художника В.В. Верещагина."
                :image="'/images/games-cover/puzzle-cover.png'"
                @startGame="startGame('working')" 
            />

            <GameCard
                title="Пятнашки"
                description="Любите сложные головоломки? Попробуйте собрать пятнашки, чтобы получить одну из картин художника В.В. Верещагина."
                :image="'/images/games-cover/tag-cover.png'"
                @startGame="startGame('pyatnashki')" 
            />
        </div>
        <!-- Если игра началась, показываем игру с пятнашками -->
        <div v-else>
            <PyatnashkiGame :selectedPicture="selectedPicture" @exitGame="handleExitGame"/>
        </div>

        <div v-if="isModalVisible" class="modal">
            <div class="modal-content">
                <p>Игра находится в разработке...</p>
                <button @click="closeModal">ОК</button>
            </div>
        </div>

        <div v-if="isSelectionModalVisible" class="modal">
        <div class="modal-content">
            <h3>Выберите картину для сборки:</h3>
            <div class="pictures-grid">
                <div 
                    v-for="picture in pictures" 
                    :key="picture.id" 
                    class="picture-card" 
                    @click="selectPicture(picture)">
                    <img :src="picture.image" :alt="picture.title" />
                    <p>{{ picture.title }}</p>
                </div>
            </div>
            <button @click="closeSelectionModal">Отмена</button>
        </div>
    </div>
</div>
</template>

<script setup>
import GameCard from '@/components/layout/GameCard.vue';
import PyatnashkiGame from '@/components/layout/PyatnashkiGame.vue';

const isGameStarted = ref(false);
const isModalVisible = ref(false);
const isSelectionModalVisible = ref(false); // Для модального окна выбора картины
const selectedPicture = ref(null);

const pictures = ref([
    { id: 1, 
        title: 'Белая лошадь. Этюд', 
        image: '/images/tags/change/original-image-1.png',
        info: '1883 г., холст, масло, 28,5 x 36',
        location: 'Рыбинский государственный музей-заповедник',
        originalImage: '/images/tags/tag-1/original-image.png',
        hintImage: '/images/tags/tag-1/original-image.png',
        piecesPath: '/images/tags/tag-1/image-part-00',
        description: 'Композиционным центром этого этюда является изображение белой лошади с желтой гривой и желто-красным хвостом. На лошадь надеты красная уздечка и малиново-красное седло. Справа ее держит под уздцы араб. Он одет в национальные одежды: коричнево-розовые шаровары, просторную белую рубаху и оранжевую чалму. Лошадь и погонщик изображены на фоне каменистой пустыни, которую Верещагин написал с использованием желтых, серых и коричневых цветов, в некоторых местах добавив зеленые оттенки.\n\nВ классической живописи одной из самых сложных технических задач является получение чистого белого цвета из других красок.',
    },
    { id: 2, 
        title: 'Самарканд', 
        image: '/images/tags/change/original-image-2.png',
        info: 'Около 1869 – 1870 гг., холст, масло, 43 х 51',
        location: 'Серпуховский историко-художественный музей',
        originalImage: '/images/tags/tag-2/original-image.png',
        hintImage: '/images/tags/tag-2/original-image.png',
        piecesPath: '/images/tags/tag-2/image-part-00',
        description: 'На полотне запечатлена знаменитая площадь Регистан перед медресе Улугбека. С древних времен Регистан считался центром города и главной базарной площадью. Произведение Верещагина иллюстрирует повседневную городскую жизнь. В лучах жаркого солнца открывается вид на небольшой рынок. Товар расположен зачастую просто на коврах под навесами, между ними ходят немногочисленные покупатели. Базар создает впечатление тихого и провинциального места, а медресе на заднем плане несет следы запустения и медленного разрушения. ',
    },
    //добавление ещё 3 других картин для пятнашек
]);

const startGame = (gameType) => {
    if (gameType === 'pyatnashki') {
        isSelectionModalVisible.value = true; // Показать выбор картины
    } else if (gameType === 'working') {
        isGameStarted.value = false;
        isModalVisible.value = true;
    }
};

const handleExitGame = () => {
    console.log('Switching isGameStarted to false');
    isGameStarted.value = false;// Вернуть состояние выбора игры
};

// Метод для выбора картины
const selectPicture = (picture) => {
    selectedPicture.value = picture; // Сохраняем выбранную картину
    isSelectionModalVisible.value = false; // Закрыть окно выбора
    isGameStarted.value = true; // Начать игру
};

// Закрытие модального окна выбора картины
const closeSelectionModal = () => {
    isSelectionModalVisible.value = false;
};

// Закрывает модальное окно.
const closeModal = () => {
    isModalVisible.value = false;
};
</script>

<style lang="scss" scoped>
    .games-container {
        width: 70%;
        margin: 30px auto;
        padding: 30px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
        justify-content: center;
        background-color: #5a4c80;
        border: #000 1px solid;
        border-radius: 10px;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;

        .modal-content {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

            p {
                margin-bottom: 20px;
                font-size: 18px;
            }

            button {
                padding: 10px 20px;
                margin-top: 20px;
                font-size: 16px;
                background-color: #5a4c80;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            button:hover {
                background-color: #483a64;
            }
        }
    }
    .pictures-grid {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;

    .picture-card {
        width: 150px;
        cursor: pointer;
        text-align: center;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #f9f9f9;

        img {
            max-width: 100px;
            border-radius: 10px;
        }

        p {
            margin-top: 10px;
            font-size: 14px;
        }

        &:hover {
            background-color: #ececec;
        }
    }
}
</style>