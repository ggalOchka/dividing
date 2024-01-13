<template>
    <v-container>
        <div v-for="(outputMatrixName, id) in outputMatrixNames"  
            :key="id"
        >
        <h3 class="result">{{ outputMatrixName }}</h3>
        </div>
        <v-btn 
          @click="deleteInfo"
          prepend-icon="mdi-arrow-left"
          size="default" 
        >
          На главную
        </v-btn>
    </v-container>
  </template>
  
  <script setup>
    import { onMounted, onUpdated} from 'vue'
    import { v4 as uuidv4 } from 'uuid';
    import {useRouter} from 'vue-router'
    import { useAppStore } from '@/store/users.js'
    import { ref } from 'vue';
    const store = useAppStore()
    const names = ref(store.onlyUserNames)
    const router = useRouter()
    const totalMatrix = ref([])

    const key = 'usersCalculate';

    const loadFromLocalStorage = (key) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    };
    const outputMatrixNames =  ref(loadFromLocalStorage(key) || []);
    onMounted(() => {
      saveToLocalStorage(key, outputMatrixNames.value);
      loadUsersData();
    })

    onUpdated(() => {
      loadUsersData();
    })
    
    const saveToLocalStorage = (key, data) => {
     localStorage.setItem(key, JSON.stringify(data));
    };

    const loadUsersData = () => {
      const data = loadFromLocalStorage(key);
      if (data) {
        outputMatrixNames.value = data;
      }
    };

    for(let i = 0; i<names.value.length;i++){
        totalMatrix.value[i] = []
        for(let j = 0; j<names.value.length;j++){
            totalMatrix.value[i][j] = 0
        }
    }
    for(let a=0; a<store.matrixForTotal.length;a++){
      var matrixForSum = store.matrixForTotal[a]
      for (let i = 0; i<names.value.length; i++){
        for(let j=0; j<names.value.length; j++){
          totalMatrix.value[i][j]=totalMatrix.value[i][j] + matrixForSum[i][j]
        }
      }
    }
    for (let i = 0; i<totalMatrix.value.length; i++){
      for(let j=0; j<totalMatrix.value.length; j++){
        if(i==j){
          totalMatrix.value[i][j] = 0
          totalMatrix.value[j][i] = 0
        }
        else if(totalMatrix.value[i][j]==totalMatrix.value[j][i]){
          totalMatrix.value[i][j]=0
          totalMatrix.value[j][i]=0
        }
        else if(totalMatrix.value[i][j]>totalMatrix.value[j][i]){
          totalMatrix.value[i][j]=totalMatrix.value[i][j] - totalMatrix.value[j][i]
          totalMatrix.value[j][i] = 0
        }
        else if(totalMatrix.value[j][i]>totalMatrix.value[i][j]){
          totalMatrix.value[j][i]= totalMatrix.value[j][i]-totalMatrix.value[i][j]
          totalMatrix.value[i][j] = 0
        }
      }
    }
    for (let i = 0; i<totalMatrix.value.length; i++){
      let counter = 0
      let countArr = []
      for(let j=0; j<totalMatrix.value.length; j++){
        if (totalMatrix.value[j][i] == 0){
          counter++
        }
        else{
          countArr.push(j)
        }
      }
      if(counter == totalMatrix.value.length){
        outputMatrixNames.value.push('Пользователь '+names.value[i]+' никому ничего не должен;)))')
        saveToLocalStorage(key, outputMatrixNames.value)
      } 
      else{
        for(let c = 0; c< countArr.length; c++){
          outputMatrixNames.value.push('Пользователь ' + names.value[i] + ' должен ' + totalMatrix.value[countArr[c]][i] + ' рублей Пользователю ' + names.value[countArr[c]])
          saveToLocalStorage(key, outputMatrixNames.value)
        }
      }

    }
    const deleteInfo = () =>{
      router.push({ name: 'home' })
      outputMatrixNames.value.splice(0,outputMatrixNames.value.length)
      localStorage.removeItem(key)
    }
  </script>
  
  <style scoped lang="scss">

  </style>