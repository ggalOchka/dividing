<template>
  <v-text-field 
      label="Имя пользователя"
      variant="underlined"
      :autofocus="false" 
      v-model="userName"
      @blur="handleInputEnd">
      <template v-slot:prepend>
        <v-avatar color="primary">{{ userName.slice(0,4)}}</v-avatar>
    </template>
    <template v-slot:append>
      <v-btn 
        icon="mdi-knife" 
        color="secondary"
        @click="deleteUser(userName)"/>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from '@/store/users.js'
const userName = ref(props.propsName)
const emits = defineEmits()
const props = defineProps({
  propsName: {
    type: String,
    default: 'name'
  }
})
const userStore = useAppStore()

watch(userName, function() {
  emits('update:propsName', userName.value)
})
const deleteUser = (userName) => {
  emits('deleteUser', userName.value);
}
const handleInputEnd = () => {
  if (userName.value.trim() !== '') {
    userStore.addUserName(userName.value)
  }
}
</script>