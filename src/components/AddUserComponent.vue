<template>
  <v-text-field
    v-model.trim="userName"
    label="Имя пользователя"
    variant="underlined"
    :autofocus="false"
    :rules="rules"
  >
    <template #prepend>
      <v-avatar color="primary">{{ userName.slice(0, 4) }}</v-avatar>
    </template>
    <template #append>
      <v-btn 
        @click="onClickDeleteUser" 
        icon="mdi-knife" 
        color="secondary" 
      />
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, watch } from "vue";
const userName = ref(props.propsName);
const emits = defineEmits(["update:propsName", "deleteUser"]);
const props = defineProps({
  propsName: {
    type: String,
    default: "name",
  },
});

watch(
  userName, 
  () => {
  emits("update:propsName", userName.value);
  }
);

const onClickDeleteUser = (userName) => {
  emits("deleteUser", userName.value);
};

const rules = [
  (v) => !!v || "Это поле обязательно"
];
</script>