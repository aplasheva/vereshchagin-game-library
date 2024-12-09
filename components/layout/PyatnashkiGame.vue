<template>
    <div class="pyatnashki-container">
      <!-- Экран игры -->
      <div v-if="gameStarted" class="slider-game">
          <div class="top-bar">
              <!-- Кнопка "Правила" -->
              <button @click="toggleRules" class="rules-button">Правила</button>
              <!-- Статус движения -->
              <div id="moves" class="moves" v-if="gameStarted">{{ `Ходы: ${movesCount}` }}</div>
              <h1 class="game-title">{{ currentPicture.title }}</h1>
              <!-- Кнопка "Подсказка" в экране игры -->
              <button @click="toggleHint" class="hint-button">Подсказка</button>
          </div>
        <div class="container" :class="{ 'show-hint': hintVisible }">
          <img 
            v-if="hintVisible"
            class="original-image"
            :src="currentPicture.hintImage"
            alt="Original Image"
            draggable="false"
            @contextmenu.prevent
          />
  
          <div 
            v-for="(image, index) in imagesArr"
            :key="index"
            :data-position="getPosition(index)"
            @click="selectImage(index)"
            class="image-container"
          >
            <img
              v-if="image !== 9"
              :src="`${currentPicture.piecesPath}${image}.png`"
              :class="image === 9 ? 'target' : ''"
              :data-index="image"
              :alt="`Part ${image}`"
              draggable="false"
              @contextmenu.prevent
            />
  
            <!-- Пустой элемент для 9 -->
             <div v-else class="empty-slot"></div>
  
             <!-- Подсказка. Элементы в кружочке -->
              <div v-if="image !== 9 && hintVisible" class="number-circle">
                  {{ image }}
              </div>
          </div>
        </div>
      </div>
  
      <!-- Экран результата -->
      <div v-if="gameCompleted" class="modal-overlay">
        <div class="modal-content">
            <h2>Пятнашки собраны!</h2>
            <div class="text-info">
              <h3> {{ currentPicture.title }}</h3>
              <p>{{ currentPicture.info }}</p>
              <p>{{ currentPicture.location }}</p>
            </div>
            <img :src="currentPicture.originalImage" alt="Original Image" class="modal-image" />
            <p>{{ currentPicture.description }}</p>
            <button style="margin-top: 10px;" @click="closeGame" class="close-button">Закрыть</button>
        </div>
      </div>

      <!-- Модальное окно правил -->
      <div v-if="rulesVisible" class="modal-overlay">
        <div class="modal-content">
          <h2>Правила игры Пятнашки</h2>
          <p>Цель игры в пятнашки - расставить по местам все квадратики так, чтобы получилась изначальная картинка.</p>
          <ol>
            <li>Игра состоит из 9 квадратиков. Один из них пустой. Необходимо переместить квадратики по одному, чтобы решить головоломку.</li>
            <li>Если картинку собрать сложно, можно включить "Подсказку" в правом верхнем углу игры. Данная опция отобразит изначальную картину на фоне и расставит цифры у квадратиков, которые необходимо разложить в порядке возрастания от 1 до 8.</li>
          </ol>
          <div class="modal-image">
            <img class="image-rules-toggle" src="/images/tags/start-toggle.png" alt="Start toggle" />
            <img class="image-arrow" src="/images/svg/basil_arrow-left-solid.svg" alt="Arrow" />
            <img class="image-rules-toggle" src="/images/tags/end-toggle.png" alt="End toggle" />
          </div>
          <button @click="closeRules" class="close-button">Продолжить</button>
        </div>
      </div>
    </div>      
</template>

<script setup>
  import { ref, computed } from 'vue';

  const props = defineProps ({
    selectedPicture: {
      type: Object,
      required: true
    },
  });

  // Генерация случайных чисел для изображений
  const randomNumber = () => Math.floor(Math.random() * 8) + 1;

  // Подсчёт числа инверсий
  const countInversions = (arr) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] !== 9 && arr[j] !== 9 && arr[i] > arr[j]) {
                inversions++;
            }
        }
    }
    return inversions;
};

// Проверка решаемости массива
const isSolvable = (arr) => {
    const inversions = countInversions(arr);
    return inversions % 2 === 0;
};

  // Заполнение массива случайными номерами изображений
  const randomImages = () => {
    const arr = [];
    while (arr.length < 8) {
      const randomVal = randomNumber();
      if (!arr.includes(randomVal)) {
        arr.push(randomVal);
      }
    }
    arr.push(9);
    return arr;
  };

// Генерация решаемого массива
const gridGenerator = () => {
  let arr;
    do {
        arr = randomImages();
    } while (!isSolvable(arr));
  imagesArr.value = arr;
  movesCount.value = 0;
};

// Состояние игры
const movesCount = ref(0);
  const imagesArr = ref([]);
  const gameStarted = ref(false);
  const hintVisible = ref(false); //Состояние подсказки
  const rulesVisible = ref(false); // Состояние модального окна для правил
const currentPicture = ref(null); // Текущая картина
const emit = defineEmits(['exitGame']);

// Состояние экрана результата
const gameCompleted = ref(false);
// Вызвать обновление при изменении props
watch(
    () => props.selectedPicture,
    (newPicture) => {
        if (newPicture) {
            currentPicture.value = newPicture; // Установить выбранную картину
            gameStarted.value = true;         // Начать игру
            gridGenerator();                  // Сгенерировать новую сетку
        }
    },
    { immediate: true } // Вызывать сразу при монтировании
);

// Инициализация
onMounted(() => {
    if (props.selectedPicture) {
        currentPicture.value = props.selectedPicture;
        gridGenerator();
        gameStarted.value = true;
    }
});

  // Вычисляемая позиция в сетке на основе индекса
  const getPosition = computed(() => {
    return (index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      return `${row}_${col}`;
    };
  });
  
  // Проверка на устройство с сенсорным экраном
  const isTouchDevice = () => {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Проверка, являются ли два элемента смежными
  const checkAdjacent = (row1, row2, col1, col2) => {
    return (
      (row1 === row2 && (col2 === col1 - 1 || col2 === col1 + 1)) ||
      (col1 === col2 && (row2 === row1 - 1 || row2 === row1 + 1))
    );
  };
  
  // Выбор изображения и перемещение
  const selectImage = (index) => {
    if (!gameStarted.value) return;
  
    const currentIndex = imagesArr.value[index];
    const targetIndex = imagesArr.value.findIndex((item) => item === 9);
    const [row1, col1] = getCoords(index);
    const [row2, col2] = getCoords(targetIndex);
  
    if (checkAdjacent(row1, row2, col1, col2)) {
      swapElements(index, targetIndex);
      movesCount.value++;
      if (imagesArr.value.join('') === '123456789') {
        setTimeout(() => {
          gameStarted.value = false;
          gameCompleted.value = true;
        }, 1000);
      }
    }
  };
  
  // Позиция в сетке по индексу
  const getCoords = (index) => {
    return [Math.floor(index / 3), index % 3];
  };
  
  // Обмен элементов в массиве
  const swapElements = (index1, index2) => {
    [imagesArr.value[index1], imagesArr.value[index2]] = [
      imagesArr.value[index2],
      imagesArr.value[index1],
    ];
  };
  
// Показать/скрыть правила
const toggleRules = () => {
    rulesVisible.value = !rulesVisible.value;
};

  //Показываем подсказку
  const toggleHint = () => {
    hintVisible.value = !hintVisible.value;
  };

  const closeGame = () => {
    gameCompleted.value = false; // Закрыть модальное окно
    gridGenerator(); // Сбросить состояние игры
    emit('exitGame'); // Уведомить родительский компонент о завершении
};

// Закрыть модальное окно правил
const closeRules = () => {
    rulesVisible.value = false;
};
</script>
  
  <style lang="scss" scoped>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
  }
  .pyatnashki-container {
      width: 70%;
      max-width: 1000px;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      background: #f5e7c6;
  }

  .slider-game {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    margin-top: 5%;
  }
  
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  
  .game-title {
    font-size: 24px;
    margin: 0;
    width: 60%;
    text-align: center;
  }
  
  .moves {
    font-size: 18px;
    margin: 0;
  }
  
  .container {
    display: grid;
    width: 90%;
    max-width: 500px;
    //height: 25em;
    aspect-ratio: 1;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    background: #fff;
    margin: 2em 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  .original-image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
    opacity: 0.5;
    pointer-events: none;
    /* z-index: -1; */
  }
  .image-container {
      width: 100%;
      height: 100%;
      position: relative;
      border: 1px solid #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      -webkit-user-drag: none;
  }
  .cover-screen {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #edb506;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #start-button {
    font-size: 1.2em;
    padding: 0.8em 2em;
    border: none;
    border-radius: 3em;
    cursor: pointer;
  }
  #moves {
    position: relative;
    margin: 0.5em;
    text-align: right;
  }
  .hide {
    display: none;
  }
  
  /*Подсказка*/
  .hint-button {
    background-color: #e0b143;
    border: none;
    padding: 10px 20px;
    margin-inline-start: 10px;
    border-radius: 10px;
    color: white;
    font-size: 1em;
    cursor: pointer;
  }
  
  .hint-button:hover {
    background-color: #a37a1a;
  }
  
  @media only screen and (max-width: 768px) {
    .slider-game {
      flex-direction: column;
    }
    .container {
      width: 20em;
      height: 20em;
      grid-auto-rows: 6em;
    }
    .original-image {
      width: 20em;
      height: 20em;
    }
  }
  .empty-slot {
    width: 100%;
    height: 100%;
    background-color: transparent; /* Или можно скрыть полностью */
    border: 1px solid #fff;; /* Пустая граница, чтобы все было аккуратно */
  }
  
  .number-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    color: #fff;
    padding: 5px 10px;
    font-size: 1.5em;
    z-index: 2;
  }

/*Правила*/
  .rules-button {
      background-color: #a0c4ff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      color: white;
      font-size: 1em;
      cursor: pointer;
  }

.rules-button:hover {
    background-color: #7ea3d8;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow: hidden;
}

.modal-content {
    background-color: #efdecd;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border: #a37a1a 6px solid;

    h2 {
        margin-bottom: 20px;
        font-size: 30px;
    }

    p {
      text-align: left;
      margin-bottom: 10px;
      font-size: 16px;
    }

    ol {
      padding: 20px;
      text-align: left;
      margin: 10px 0;
    }
    li {
      margin-bottom: 10px;
    }
} 

.close-button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #5a4c80;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.close-button:hover {
    background-color: #483a64;
}

.modal-image {
    display: flex;
    align-content: center;
    justify-content: center;
    margin-inline: auto;
    margin-bottom: 20px;
    max-height: 300px;

    .image-rules-toggle {
      width: 200px;
    }

    .image-arrow {
      width: 50px;
    }
}

.text-info {
  margin: 20px;
  font-size: 16px;
  text-align: center;
  p {
    margin: 10px;
    text-align: center;
  }
}

@media (max-width: 1280px) {
  .pyatnashki-container {
    width: 90%;
  }
  .game-title {
    width: 40%;
  }
  .top-bar {
    gap: 10px;
  }
  .game-title {
    font-size: 18px;
  }
  .hint-button, .rules-button {
    font-size: 14px;
    padding: 8px 16px;
  }
}

@media (max-width: 600px) {
  .pyatnashki-container {
    width: 95%;
  }
  .game-title {
    width: 100%;
    margin-bottom: 10px;
  }

  .container {
    width: 100%;
    height: 100%;
    grid-auto-rows: 6em;
  }

  .original-image {
    width: 100%;
    height: 100%;
  }

  .top-bar {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .game-title {
    font-size: 16px;
  }
  .hint-button, .rules-button {
    font-size: 12px;
    padding: 8px 16px;
  }
  .modal-image {
    .image-rules-toggle {
      width: 50%;
    }
}
  p {
    font-size: 10px;
  }
}

  </style>
  