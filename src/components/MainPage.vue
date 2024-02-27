<template>
  <v-container>
    <v-card>
      <label class="text-center">Добавить гостя</label>
      <v-btn 
        @click="onClickAddUser" 
        icon="mdi-account-plus" 
        color="background" 
      />
      <add-user-component
        v-for="(userArr, index) in usersArrs"
        :key="userArr.id"
        :index="index"
        :props-name="userArr.name"
        @update:props-name="(newVal) => updateUsersArrs(index, newVal)"
        @deleteUser="handleDeleteUser(index)"
      />
      <v-btn 
        text="Далее"
        :disabled="!isUsersAdd"
        @click="onClickNextPage"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, onUpdated, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";
import addUserComponent from "./AddUserComponent.vue";
import { useAppStore } from "@/store/users.js";
import {saveToLocalStorage, loadFromLocalStorage} from "@/localStore.js";
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
const onClickAddUser = () => {
  usersArrs.value.push({
    id: uuidv4(),
    name: "",
  });
  // Сохранение данных в localStorage после добавления пользователя
  saveToLocalStorage(key, usersArrs.value);
  isUsersAdd.value = false; 
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
  let count = 0;
  for (let i = 0; i < usersArrs.value.length; i++){
    if (usersArrs.value[i].name != ''){
      count++;
    }
  }
  isUsersAdd.value = usersArrs.value.length > 1 && count === usersArrs.value.length;
};

const onClickNextPage = () => {
  userStore.deleteAllNames();
  for (let i = 0; i < usersArrs.value.length; i++) {
    userStore.addUserName(usersArrs.value[i]);
  }
  userStore.initMatrixForTotal(usersArrs.value.length)
  router.push({ name: "dish" });
};
</script>