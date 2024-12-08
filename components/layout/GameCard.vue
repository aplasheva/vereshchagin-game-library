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
        width: 500px;
        height: 300px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 30px;
        background-color: white;
        border-radius: 30px;
        box-shadow:  0 0 20px rgba(0, 0, 0, 0.5);
        padding-inline: 30px;
        margin: 30px 40px;

        .game-cover {
            height: 80%;
            border-radius: 15px;
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
</style>
    