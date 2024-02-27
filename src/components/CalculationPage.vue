<template>
  <v-container>
    <div 
      v-for="(outputMatrixName, id) in outputMatrixNames" 
      :key="id"
    >
      <h3 class="result">{{ outputMatrixName }}</h3>
    </div>
    <div>
      <v-btn
        text="К блюдам"
        @click="onClickInfoDish"
        class="navigationBtn"
        prepend-icon="mdi-arrow-left"
        size="default"
      />
      <v-btn
        text="На главную"
        @click="onClickInfoHome"
        class="navigationBtn"
        append-icon="mdi-arrow-right"
        size="default"
      />
    </div>
  </v-container>
</template>
  
<script setup>
import { onMounted, onUpdated, ref} from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/users.js";
import {saveToLocalStorage, loadFromLocalStorage} from "@/localStore.js";
const store = useAppStore();
const names = ref(store.onlyUserNames);
const storeMatrixForTotal = ref(store.matrixForTotal);
const router = useRouter();
const total = ref([]);
const key = "usersCalculate";
const outputMatrixNames = ref(loadFromLocalStorage(key) || []);

onMounted(() => {
  saveToLocalStorage(key, outputMatrixNames.value);
  loadUsersData();
});

onUpdated(() => {
  loadUsersData();
});

const loadUsersData = () => {
  const data = loadFromLocalStorage(key);
  if (data) {
    outputMatrixNames.value = data;
  }
};

loadUsersData();

if (storeMatrixForTotal.value.length !== 0){
  outputMatrixNames.value=[]
for (let i = 0; i < names.value.length; i++) {
  total.value[i] = [];
  for (let j = 0; j < names.value.length; j++) {
    total.value[i][j] = 0;
  }
}

for (let i = 0; i < names.value.length; i++) {
  for (let j = 0; j < names.value.length; j++) {
    total.value[i][j] = total.value[i][j] + storeMatrixForTotal.value[i][j];
  }
}

for (let i = 0; i < total.value.length; i++) {
  for (let j = 0; j < total.value.length; j++) {
    const diff = total.value[i][j] - total.value[j][i];
    if (i === j || diff === 0) {
      total.value[i][j] = 0;
      total.value[j][i] = 0;
    } else if (diff > 0) {
      total.value[i][j] = diff;
      total.value[j][i] = 0;
    } else if (diff < 0) {
      total.value[j][i] = Math.abs(diff);
      total.value[i][j] = 0;
    }
  }
}

for (let i = 0; i < total.value.length; i++) {
  let counter = 0;
  let countArr = [];

  for (let j = 0; j < total.value.length; j++) {
    if (total.value[i][j] === 0) {
      counter++;
    } else {
      countArr.push(j);
    }
  }

  if (counter === total.value.length) {
    outputMatrixNames.value.push(
      "Пользователь " + names.value[i].name + " никому ничего не должен;)))"
    );
    saveToLocalStorage(key, outputMatrixNames.value);
  } else {
    for (let c = 0; c < countArr.length; c++) {
      outputMatrixNames.value.push(
        "Пользователь " +
          names.value[i].name +
          " должен " +
          parseFloat(total.value[i][countArr[c]].toFixed(2)) +
          " рублей Пользователю " +
          names.value[countArr[c]].name
      );
      saveToLocalStorage(key, outputMatrixNames.value);
    }
  }
  countArr = [];
  counter = 0;
}
};

const onClickInfoHome = () => {
  router.push({ name: "home" });
  localStorage.removeItem(key);
  total.value.splice(0);
  store.deleteMatrixForTotal();
};

const onClickInfoDish = () => {
  router.push({ name: "dish" });
  localStorage.removeItem(key);
  total.value.splice(0);
  store.deleteMatrixForTotal();
};
</script>