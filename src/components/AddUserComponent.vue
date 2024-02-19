<template>
  <v-text-field
    v-model="userName"
    label="Имя пользователя"
    variant="underlined"
    :autofocus="false"
  >
    <template v-slot:prepend>
      <v-avatar color="primary">{{ userName.slice(0, 4) }}</v-avatar>
    </template>
    <template v-slot:append>
      <v-btn @click="deleteUser" icon="mdi-knife" color="secondary" />
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAppStore } from "@/store/users.js";
const userName = ref(props.propsName);
const emits = defineEmits(["update:propsName", "deleteUser"]);
const userStore = useAppStore();
const props = defineProps({
  propsName: {
    type: String,
    default: "name",
  },
});
watch(userName, function () {
  emits("update:propsName", userName.value);
});
const deleteUser = (userName) => {
  emits("deleteUser", userName.value);
};
</script>