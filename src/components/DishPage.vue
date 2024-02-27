<template>
  <v-container>
    <v-btn 
      text="Добавить блюдо"
      @click="onClickAddDish"
      size="default" 
      class="navigationBtn"
    />
    <dish-card
      v-for="(dish, index) in dishData"
      :key="dish.id"
      :props-dish-data="dish"
      :props-is-touch-next-page="isTouchNextPage"
      @update:props-dish-data="(newVal) => updateDishData(index, newVal)"
      @deleteDish="handleDeleteDish(index)"
    />
    <div>
      <v-btn
        text="Назад"
        @click="router.push({ name: 'home' })"
        prepend-icon="mdi-arrow-left"
        size="default"
        class="navigationBtn"
      />
      <v-btn
        :disabled="!(isDishesAdd && isRigt)"
        text="Рассчитать"
        @click="onClickCalculationPage"
        append-icon="mdi-arrow-right"
        size="default"
        class="navigationBtn"
      />
    </div>
    <v-card class="h4-dish-page">
      <h4>Итог:</h4>
      <h4 class="h4-red">{{ totalPriceOnDisplay }}</h4>
    </v-card>
  </v-container>
</template>
  
<script setup>
import { onMounted, onUpdated, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/users.js";
import dishCard from "./DishCard.vue";
import { v4 as uuidv4 } from "uuid";
import {saveToLocalStorage, loadFromLocalStorage} from "@/localStore.js";
const key = "dishesData";
const keyTotalPrice = "totalPrice";
const userStore = useAppStore();
const router = useRouter();
const isTouchNextPage = ref(false);
const isRigt = ref(false);

onMounted(() => {
  isTouchNextPage.value = false;
  if (!localStorage.getItem(key)) {
    saveToLocalStorage(key,dishData.value)
  }
  loadUsersData();
});

onUpdated(() => {
  loadUsersData();
});

const loadUsersData = () => {
  userStore.deleteAllDishes;
  const data = loadFromLocalStorage(key);
  if (data) {
    dishData.value = data;
  }
  const dataTotal = loadFromLocalStorage(keyTotalPrice);
  if (dataTotal) {
    totalPrice.value = dataTotal;
  }
  for (let i = 0; i < dishData.value.length; i++) {
    userStore.addUserDish(dishData.value[i]);
  }
};

//обновление массива данных при изменении или добавлении данных
const updateDishData = (index, newVal) => {
  dishData.value[index].name = newVal.name;
  dishData.value[index].price = newVal.price;
  dishData.value[index].payer = newVal.payer;
  dishData.value[index].whoEat = newVal.whoEat;
  dishData.value[index].whoEatMatrix = newVal.whoEatMatrix;
  totalPrice.value = Number(totalPrice.value) + Number(newVal[1]);
  saveToLocalStorage(key, dishData.value);
  saveToLocalStorage(keyTotalPrice, totalPrice.value);
  isRigt.value = dishData.value[index].price > 0 && parseInt(dishData.value[index].price) == dishData.value[index].price && dishData.value[index].payer != '' &&  dishData.value[index].whoEat.length != 0;
};

const totalPrice = ref(loadFromLocalStorage(keyTotalPrice) || 0);

const dishData = ref(
  loadFromLocalStorage(key) || [
    {
      name: "",
      id: uuidv4(),
      price: 0,
      payer: "",
      whoEat: [],
      whoEatMatrix: [],
    },
  ]
);

// добавление нового блюда (выделение места в массиве для v-for)
const onClickAddDish = () => {
  const newDishId = uuidv4();
  dishData.value.push({
    id: newDishId,
    name: "",
    price: 0,
    payer: "",
    whoEat: [],
    whoEatMatrix: [],
  });
  saveToLocalStorage(key, dishData.value);
};

//удаление блюда
const handleDeleteDish = (indexToDelete) => {
  if (indexToDelete !== -1) {
    totalPrice.value =
      Number(totalPrice.value) - Number(dishData.value[indexToDelete].price);
    dishData.value.splice(indexToDelete, 1);
    saveToLocalStorage(key, dishData.value);
    saveToLocalStorage(keyTotalPrice, totalPrice.value);
  }
  if (dishData.value.length === 0) {
    totalPrice.value = 0;
    saveToLocalStorage(keyTotalPrice, totalPrice.value);
  }
};

const onClickCalculationPage = () => {
  isTouchNextPage.value = true;
  router.push({ name: "calculation" })
  if (userStore.matrixForTotal.length === 0){
    userStore.initMatrixForTotal(userStore.onlyUserNames.length)
  }
};

const totalPriceOnDisplay = computed(() => {
  return dishData.value.reduce((acc, dish) => (isNaN(parseFloat(dish.price)) || parseFloat(dish.price) < 0) ? null : acc + parseFloat(dish.price), 0);
});

const isDishesAdd = computed(() => {
  return dishData.value.length >= 1;
});
</script>


