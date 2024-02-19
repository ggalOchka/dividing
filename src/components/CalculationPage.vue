<template>
  <v-container>
    <div v-for="(outputMatrixName, id) in outputMatrixNames" :key="id">
      <h3 class="result">{{ outputMatrixName }}</h3>
    </div>
    <div>
      <v-btn
        @click="deleteInfoDish"
        prepend-icon="mdi-arrow-left"
        size="default"
      >
        К блюдам
      </v-btn>
      <v-btn
        @click="deleteInfoHome"
        append-icon="mdi-arrow-right"
        size="default"
      >
        На главную
      </v-btn>
    </div>
  </v-container>
</template>
  
<script setup>
import { onMounted, onUpdated, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/store/users.js";
import { ref } from "vue";
const store = useAppStore();
const names = ref(store.onlyUserNames);
const router = useRouter();
const total = ref([]);
const key = "usersCalculate";

const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const outputMatrixNames = ref(loadFromLocalStorage(key) || []);

onMounted(() => {
  saveToLocalStorage(key, outputMatrixNames.value);
  loadUsersData();
});

onUpdated(() => {
  loadUsersData();
});

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadUsersData = () => {
  const data = loadFromLocalStorage(key);
  if (data) {
    outputMatrixNames.value = data;
  }
};

for (let i = 0; i < names.value.length; i++) {
  total.value[i] = [];
  for (let j = 0; j < names.value.length; j++) {
    total.value[i][j] = 0;
  }
}

for (let i = 0; i < names.value.length; i++) {
  for (let j = 0; j < names.value.length; j++) {
    total.value[i][j] = total.value[i][j] + store.matrixForTotal[i][j];
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

const deleteInfoHome = () => {
  router.push({ name: "home" });
  outputMatrixNames.value.splice(0);
  localStorage.removeItem(key);
  total.value.splice(0);
  store.deleteMatrixForTotal();
};

const deleteInfoDish = () => {
  router.push({ name: "dish" });
  outputMatrixNames.value.splice(0);
  localStorage.removeItem(key);
  total.value.splice(0);
  store.deleteMatrixForTotal();
};
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