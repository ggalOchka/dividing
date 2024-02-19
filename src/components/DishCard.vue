<template>
  <v-container>
    <v-card class="v-card-dish">
      <div class="v-card-text-field">
        <v-text-field variant="solo" label="Название" v-model="dataDish.name" />
        <v-text-field
          variant="solo"
          label="Цена"
          v-model="dataDish.price"
          :rules="rules"
        />
        <v-select
          v-model="setDataDishPayer"
          :items="userData.map((x) => x.name)"
          variant="solo"
          density="default"
          label="Кто платил"
        />
      </div>
      <div class="v-card-btn">
        <v-btn-toggle
          v-model="toggleMultiple"
          multiple
          background-color="#D9C6B7"
          dark
          color="#156F15"
          rounded="1"
          density="default"
        >
          <div v-for="(user, index) in userData" :key="index" class="in-row">
            <v-btn @click="whoEatRecord">{{ user.name }}</v-btn>
          </div>
        </v-btn-toggle>
        <div>
          <v-btn
            @click="deleteDish"
            class="delete-btn"
            color="secondary"
            icon="mdi-knife"
          />
        </div>
      </div>
    </v-card>
  </v-container>
</template>
  
<script setup>
import { useAppStore } from "@/store/users.js";
import { onMounted, computed } from "vue";
import { ref, watch, toRefs } from "vue";
const userStore = useAppStore();
const userData = ref([]);
const dishName = ref([]);
const dishPrice = ref([]);
const whoPay = ref([]);
const whoEat = ref([]);
const whoEatMatrix = ref([]);
const toggleMultiple = ref([]);
const matrixForTotal = ref([]);
//const dataDish = ref(JSON.parse(JSON.stringify(props.propsDishData)));
const dataDish = ref(props.propsDishData);
const emits = defineEmits(["deleteDish", "update:propsDishData"]);
const props = defineProps({
  propsDishData: {
    type: Object,
    default: () => {},
  },
  propsIsTouchNextPage: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  // заполним массив пользователей
  // если обновляем страницу, то стор очищается, тогда заполняем из локал стора
  if (userStore.onlyUserNames.length) {
    userData.value = userStore.onlyUserNames;
  } else {
    userData.value = JSON.parse(localStorage.getItem("usersData"));
  }
  // обновление payer вдруг на прошлом шаге что-то поменялось
  if (dataDish.value.payer) {
    // существует ли он
    let name = userStore.getNameById(dataDish.value.payer.id);
    if (name) {
      dataDish.value.payer.name = name;
    } else {
      dataDish.value.payer = null;
    }
  }
  // обновление whoEat
  dataDish.value.whoEat.forEach((nameInDataDish, index) => {
    // проверяем содержится ли по id имя
    const indexInUserData = userData.value.find(
      (item) => item.id === nameInDataDish.id
    )?.id;

    if (indexInUserData) {
      // нашли - обновляем имя и подсвечиваем
      nameInDataDish.name = userStore.getNameById(indexInUserData);
    } else {
      // если не нашли такой объект, значит это имя было удалено ранее
      dataDish.value.whoEat.splice(index, 1);
    }
  });
  // обнуляем массив рассчета
  dataDish.value.whoEatMatrix = new Array(userStore.onlyUserNames.length).fill(
    0
  );
  // если обновляем страницу, а на ней был выбран тот, кто ел,
  // то надо сделать так, чтоб он сохранил подсвечивание,
  // а для этого надо записать индекс в toggleMultiple
  userData.value.forEach((nameInUserData, index) => {
    // проверяем содержится ли по id имя
    const indexInUserDish = dataDish.value.whoEat.findIndex(
      (nameInDataDish) => nameInDataDish.id === nameInUserData.id
    );
    if (indexInUserDish !== -1) {
      toggleMultiple.value.push(index);
      dataDish.value.whoEatMatrix[index] = 1;
    }
  });
});

const deleteDish = () => {
  emits("deleteDish");
  userStore.deleteDish(dishName.value);
};
const whoEatRecord = () => {
  dataDish.value.whoEat = [];
  dataDish.value.whoEatMatrix = dataDish.value.whoEatMatrix.map((x) => 0);
  for (let i = 0; i < toggleMultiple.value.length; i++) {
    dataDish.value.whoEat.push(userData.value[toggleMultiple.value[i]]);
    dataDish.value.whoEatMatrix[toggleMultiple.value[i]] = 1;
  }
};

watch(
  dataDish,
  () => {
    emits("update:propsDishData", dataDish.value);
  },
  { deep: true }
);

const rules = [
  (v) => !!v || "Это поле обязательно",
  (v) => (v && v >= 0) || "Цена не может быть отрицательной",
  (v) => v > 0 || "Значение не может быть отрицательным или равным 0",
  (v) =>
    (!isNaN(parseFloat(v)) && isFinite(v)) || "Значение должно быть числом",
];

const setDataDishPayer = computed({
  get: () => dataDish.value.payer?.name,
  set: (value) => {
    const newData = userData.value.find((obj) => obj.name === value);
    dataDish.value.payer = newData;
  },
});

const { propsIsTouchNextPage } = toRefs(props);

watch(propsIsTouchNextPage, function () {
  saveDish();
});

const saveDish = () => {
  if (dataDish.value.payer) {
    // должны тому, кто платит
    const indexPayer = userStore.onlyUserNames.findIndex(
      (x) => x.id === dataDish.value.payer.id
    );
    // whoEatMatrix уже содержит индексы тех, кто ел
    matrixForTotal.value = new Array(userStore.onlyUserNames.length);

    for (let i = 0; i < userStore.onlyUserNames.length; i++) {
      matrixForTotal.value[i] = new Array(userStore.onlyUserNames.length).fill(
        0
      );
    } // создаем двумерный массив n*n
    if (dataDish.value.whoEat.length) {
      const result = dataDish.value.price / dataDish.value.whoEat.length;
      dataDish.value.whoEatMatrix.forEach((value, i) => {
        if (value === 1) {
          matrixForTotal.value[i][indexPayer] = result;
        } else {
          matrixForTotal.value[i][indexPayer] = 0;
        }
      });
    }

    userStore.addMatrixForTotal(matrixForTotal.value);
  }
};
</script>

<style scoped lang="scss">
.v-text-field {
  margin: {
    top: 5px;
    left: 5px;
    right: 5px;
  }
}
.v-btn {
  margin: {
    left: 5px;
    right: 5px;
  }
  .in-row > & {
    border-radius: 15px;
  }
}
</style>
