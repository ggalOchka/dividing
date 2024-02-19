<template>
  <v-container>
    <v-card>
      <label class="text-center">Добавить гостя</label>
      <v-btn @click="addUser" icon="mdi-account-plus" color="background" />
      <add-user-component
        v-for="(userArr, index) in usersArrs"
        :key="userArr.id"
        :index="index"
        :propsName="userArr.name"
        @update:propsName="(newVal) => updateUsersArrs(index, newVal)"
        @deleteUser="handleDeleteUser(index)"
      />
      <v-btn v-if="isUsersAdd" @click="clickNextPage">Далее</v-btn>
      <v-btn v-else disabled @click="clickNextPage">Далее</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, onUpdated } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";
import { ref } from "vue";
import addUserComponent from "./AddUserComponent.vue";
import { useAppStore } from "@/store/users.js";
const router = useRouter();
const userStore = useAppStore();
const isUsersAdd = ref(false);

onMounted(() => {
  if (!localStorage.getItem(key)) {
    saveToLocalStorage(
      key,
      usersArrs.value.map((user) => ({ name: user.name, id: user.id }))
    );
  }
  loadUsersData();
  updateIsUsersAdd();
});

onUpdated(() => {
  loadUsersData();
  updateIsUsersAdd();
});

//сохраняем данные в localStorage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Загрузка из localStorage
const loadFromLocalStorage = (key) => {
  //localStorage.clear()
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

//вышружаем данные из localStorage
const loadUsersData = () => {
  userStore.deleteAllNames();
  const data = loadFromLocalStorage(key);
  if (data) {
    usersArrs.value = data;
  }
  for (let i = 0; i < usersArrs.value.length; i++) {
    userStore.addUserName(usersArrs.value[i]);
  }
};

//добавление данных о новом пользователе в массив (и сохранение в localStorage)
const updateUsersArrs = (index, newVal) => {
  usersArrs.value[index].name = newVal;
  saveToLocalStorage(key, usersArrs.value);
  updateIsUsersAdd();
};

const key = "usersData";

// Загрузка данных из localStorage при инициализации
const usersArrs = ref(
  loadFromLocalStorage(key) || [{ id: uuidv4(), name: "" }]
);

// добавление нового пользователя (выделение места в массиве для v-for)
const addUser = () => {
  usersArrs.value.push({
    id: uuidv4(),
    name: "",
  });
  // Сохранение данных в localStorage после добавления пользователя
  saveToLocalStorage(key, usersArrs.value);
};

// удаление введенного пользователя
const handleDeleteUser = (indexToDelete) => {
  if (indexToDelete !== -1) {
    userStore.deleteUser(usersArrs.value[indexToDelete]);
    usersArrs.value.splice(indexToDelete, 1);
    saveToLocalStorage(key, usersArrs.value);
    updateIsUsersAdd();
  }
};

const updateIsUsersAdd = () => {
  if (usersArrs.value.length > 1) {
    isUsersAdd.value = true;
  } else {
    isUsersAdd.value = false;
  }
};

const clickNextPage = () => {
  userStore.deleteAllNames();
  for (let i = 0; i < usersArrs.value.length; i++) {
    userStore.addUserName(usersArrs.value[i]);
  }
  userStore.initMatrixForTotal(usersArrs.value.length)
  router.push({ name: "dish" });
};
</script>