<template>
  <v-container>
    <v-btn size="default" @click="addDish"> Добавить блюдо </v-btn>
    <dish-card
      v-for="(dish, index) in dishData"
      :key="dish.id"
      :propsDishData="dish"
      :propsIsTouchNextPage="isTouchNextPage"
      @update:propsDishData="(newVal) => updateDishData(index, newVal)"
      @deleteDish="handleDeleteDish(index)"
    />
    <div>
      <v-btn
        @click="router.push({ name: 'home' })"
        prepend-icon="mdi-arrow-left"
        size="default"
      >
        Назад
      </v-btn>
      <v-btn
        v-if="isDishesAdd"
        @click="clickCalculationPage"
        append-icon="mdi-arrow-right"
        size="default"
      >
        Рассчитать
      </v-btn>
      <v-btn
        v-else
        disabled
        @click="clickCalculationPage"
        append-icon="mdi-arrow-right"
        size="default"
      >
        Рассчитать
      </v-btn>
    </div>
    <v-card class="h4-dish-page">
      <h4>Итог:</h4>
      <h4 class="h4-red">{{ getTotalPrice }}</h4>
    </v-card>
  </v-container>
</template>
  
<script setup>
import { onMounted, onUpdated, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/users.js";
import { ref } from "vue";
import dishCard from "./DishCard.vue";
import { v4 as uuidv4 } from "uuid";
const key = "dishesData";
const keyTotalPrice = "totalPrice";
const userStore = useAppStore();
const router = useRouter();
const isTouchNextPage = ref(false);
const isDishesAdd = ref(false);
onMounted(() => {
  isTouchNextPage.value = false;
  //localStorage.removeItem(key)
  if (!localStorage.getItem(key)) {
    saveToLocalStorage(
      key,
      dishData.value.map((dish) => ({
        name: dish.name,
        id: dish.id,
        price: dish.price,
        payer: dish.payer,
        whoEat: dish.whoEat,
        whoEatMatrix: dish.whoEatMatrix,
      }))
    );
  }
  //saveToLocalStorage(keyTotalPrice, totalPrice.value);
  loadUsersData();
});

onUpdated(() => {
  loadUsersData();
});

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

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
    userStore.addUserDish(
      dishData.value[i].name,
      dishData.value[i].price,
      dishData.value[i].payer,
      dishData.value[i].whoEat,
      dishData.value[i].whoEatMatrix
    );
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
  updateIsDishessAdd();
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
const addDish = () => {
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
    updateIsDishessAdd();
  }
  if (dishData.value.length === 0) {
    totalPrice.value = 0;
    saveToLocalStorage(keyTotalPrice, totalPrice.value);
    updateIsDishessAdd();
  }
};

const updateIsDishessAdd = () => {
  if (dishData.value.length >= 1) {
    isDishesAdd.value = true;
  } else {
    isDishesAdd.value = false;
  }
};


const clickCalculationPage = () => {
  isTouchNextPage.value = true;
  router.push({ name: "calculation" })
};

const getTotalPrice = computed(() => {
  return dishData.value
    ? dishData.value.reduce((acc, dish) => acc + parseFloat(dish.price), 0)
    : 0;
});
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

