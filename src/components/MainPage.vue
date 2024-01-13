<template>
  <v-container>
  <v-card>
    <label class="text-center">Добавить гостя</label>
    <v-btn
      icon="mdi-account-plus"
      color="background"
      @click="addUser"
    >
     </v-btn>
    <add-user-component 
      v-for="(userArr, index) in usersArrs" 
      :key="userArr.id"
      :index="index"
      :propsName="userArr.name"
      @update:propsName="newVal => updateUsersArrs(index, newVal)"
      @deleteUser="handleDeleteUser(index)"
      >
    </add-user-component>
  <v-btn @click="router.push({ name: 'dish' })">Далее</v-btn>
 
  </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, onUpdated} from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import addUserComponent from './AddUserComponent.vue';
import { useAppStore } from '@/store/users.js'
const router = useRouter()
const userStore = useAppStore()

onMounted(() => {
  // Генерация уникальных id при монтировании компонента
    usersArrs.value.forEach(user => {
    user.id = uuidv4();
  });
  saveToLocalStorage(key, usersArrs.value.map(user => ({ name: user.name, id: user.id })));
  loadUsersData();
})

onUpdated(() => {
  loadUsersData();
})

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Загрузка из localStorage
const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const loadUsersData = () => {
  userStore.deleteAllNames()
  const data = loadFromLocalStorage(key);
  if (data) {
    usersArrs.value = data;
  }
  for(let i = 0; i<usersArrs.value.length;i++){
    userStore.addUserName(usersArrs.value[i].name)
  }
};

const updateUsersArrs = (index, newVal) => {
  usersArrs.value[index].name = newVal;
  saveToLocalStorage(key, usersArrs.value);
};

// Пример использования для вашего случая
const key = 'usersData'; // Уникальный ключ для вашего массива пользователей

// Загрузка данных из localStorage при инициализации
const usersArrs = ref(loadFromLocalStorage(key) || [{ id: 0, name: '' }]);

const addUser = () => {
  const newUserId = uuidv4();
  usersArrs.value.push({
    id: newUserId,
    name: ''
  });
  // Сохранение данных в localStorage после добавления пользователя
  saveToLocalStorage(key, usersArrs.value);
};


const handleDeleteUser = (indexToDelete) => { 
  if (indexToDelete !== -1) {
    userStore.deleteUser(usersArrs.value[indexToDelete].name)
    usersArrs.value.splice(indexToDelete, 1);
    saveToLocalStorage(key, usersArrs.value);
  }
}
</script>

<style scoped lang="scss">

</style>
