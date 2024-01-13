<template>
    <v-container>
      <v-btn size="default" @click="addDish()">Добавить блюдо</v-btn>
      <dish-card 
        v-for="(dish, index) in dishData"
        :key="dish.id"
        :index="index"
        :propsName="dish.name"
        :propsPrice="dish.price"
        :propsWhoEat="dish.whoEat"
        :propsWhoEat-matrix="dish.whoEatMatrix"
        :propsWhoPay="dish.payer"
        @update:propsName = "newVal => updateDishData(index,newVal)"
        @deleteDish="handleDeleteDish(index)"
      >
      </dish-card>
      <div>
        <v-btn 
          @click="router.push({ name: 'home' })"
          prepend-icon="mdi-arrow-left"
          size="default" 
        >
          Назад
        </v-btn>
        <v-btn 
          @click="router.push({ name: 'calculation' })"
          append-icon="mdi-arrow-right" 
          size="default"
        >
          Рассчитать
        </v-btn>
      </div>
      <v-card class="h4-dish-page">
        <h4>Итог:</h4>
        <h4 class="h4-red">{{ totalPrice }}</h4>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, onUpdated} from 'vue'
    import {useRouter} from 'vue-router'
    import { useAppStore } from '@/store/users.js'
    import { ref } from 'vue';
    import dishCard from './DishCard.vue'
    import { v4 as uuidv4 } from 'uuid'
    const key = 'dishesData'
    const keyTotalPrice = 'totalPrice'
    const userStore = useAppStore()
    const router = useRouter()
    onMounted(() => {
      dishData.value.forEach(user => {
        user.id = uuidv4();
      });
      saveToLocalStorage(key, dishData.value.map(user => ({ name: user.name, id: user.id, price: user.price, payer: user.payer, whoEat: user.whoEat, whoEatMatrix: user.whoEatMatrix})));
      saveToLocalStorage(keyTotalPrice,totalPrice.value)
      loadUsersData();
    })
    onUpdated(() => {
      loadUsersData();
    })

    const saveToLocalStorage = (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
    };

    const loadFromLocalStorage = (key) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    };

    const loadUsersData = () => {
      userStore.deleteAllDishes
      const data = loadFromLocalStorage(key)
      if (data) {
        dishData.value = data
      }
      const dataTotal = loadFromLocalStorage(keyTotalPrice)
      if(dataTotal) {
        totalPrice.value = dataTotal
        console.log(dataTotal)
      }
      for(let i = 0; i<dishData.value.length; i++){
        userStore.addUserDish(dishData.value[i].name, dishData.value[i].price, dishData.value[i].whoEat, dishData.value[i].whoEatMatrix)
      }
    };
    const updateDishData = (index, newVal) => {
      dishData.value[index].name = newVal[0];
      dishData.value[index].price = newVal[1];
      dishData.value[index].payer= newVal[2];
      dishData.value[index].whoEat = newVal[3];
      dishData.value[index].whoEatMatrix = newVal[4];
      totalPrice.value = Number(totalPrice.value) + Number(newVal[1])
      saveToLocalStorage(key, dishData.value);
      saveToLocalStorage(keyTotalPrice, totalPrice.value)
      console.log(dishData.value)
    };

    const userData = ref(userStore.onlyUserNames)
    const totalPrice = ref(loadFromLocalStorage(keyTotalPrice) || 0)
    console.log(totalPrice.value)
    const dishData = ref(loadFromLocalStorage(key) || [{ name: '', id: 0, price: 0, payer: '', whoEat: [], whoEatMatrix: []}]);
    const addDish = () => {
      const newDishId = uuidv4();
      dishData.value.push({
        id: newDishId,
        name: '',
        price: 0,
        payer: '',
        whoEat: [],
        whoEatMatrix: []
      });
      saveToLocalStorage(key, dishData.value);
    }
  
    const handleDeleteDish = (indexToDelete) => { 
      if (indexToDelete !== -1) {
        totalPrice.value = Number(totalPrice.value) - Number(dishData.value[indexToDelete].price)
        dishData.value.splice(indexToDelete, 1);
        saveToLocalStorage(key, dishData.value);
        saveToLocalStorage(keyTotalPrice, totalPrice.value)
      }
      if (dishData.value.length == 0){
        totalPrice.value = 0
        saveToLocalStorage(keyTotalPrice, totalPrice.value)
      }
    }
  </script>
  
  <style scoped lang="scss">
      .v-btn {
      margin: {
        left: 5px;
        right: 5px;
      }
      width: 12em;
    }
  </style>