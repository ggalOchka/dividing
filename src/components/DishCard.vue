<template>
    <v-container>
      <v-card class="v-card-dish"> 
        <div class="v-card-text-field">
          <v-text-field  
              variant="solo" 
              label="Название"  
              v-model="dishName"
          >
          </v-text-field>
          <v-text-field 
              variant="solo"  
              label="Цена"
              v-model="dishPrice"
          >
          </v-text-field>
          <v-select 
              :items="userData" 
              variant="solo" 
              density="default" 
              label="Кто платил"
              v-model="whoPay"
          >
          </v-select>
        </div>  
        <div class="v-card-btn" >
          <v-btn-toggle
            v-model="toggleMultiple"
            multiple
            background-color="#D9C6B7"
            dark
            color="#156F15"
            rounded="1"
            density="default"
          >
            <div v-for="(user,index) in userData" :key="index" class="in-row">
              <v-btn @click = "whoEatRecord()">{{ user }}</v-btn>
            </div>
          </v-btn-toggle>
          <div>
            <v-btn class="delete-btn" color="secondary" @click="deleteDish()" icon="mdi-knife"></v-btn>
            <v-btn color="primary" @click="saveDish()" icon="mdi-check-bold"></v-btn>
          </div>          
        </div>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
    import { useAppStore } from '@/store/users.js'
    import { ref } from 'vue';
    const userStore = useAppStore()
    const userData = ref(userStore.onlyUserNames)
    const dishName = ref(props.propsName)
    const dishPrice = ref(props.propsPrice)
    const whoPay = ref(props.propsWhoPay)
    const whoEat = ref(props.propsWhoEat)
    const whoEatMatrix = ref(props.propsWhoEatMatrix)
    const toggleMultiple = ref([])
    const matrixForTotal = ref([])
    const dataDish = ref([])
    const emits = defineEmits()
    const props = defineProps({
      propsName: {
        type: String,
        default: 'name'
      },
      propsPrice: {
        type: Number,
        default: '0'
      },
      propsWhoPay: {
        type: String,
        default:''
      },
      propsWhoEat: {
        type: Array,
        default: []
      },
      propsWhoEatMatrix: {
        type: Array,
        default: []
      }
    })
    const deleteDish = () => {
        emits('deleteDish')
        userStore.deleteDish(dishName.value)
    }
    const whoEatRecord = () => {
      whoEat.value=[]
      for(let i = 0; i<toggleMultiple.value.length; i++){
        whoEat.value.push(userData.value[toggleMultiple.value[i]])
      }
    }
    const saveDish = () => {
      for(let i = 0; i<userStore.onlyUserNames.length;i++){
        whoEatMatrix.value.push(0)
      }
      for(let j = 0; j<whoEat.value.length; j++){
        const indexEaters = userStore.onlyUserNames.findIndex((user) => user === whoEat.value[j]);
        if (indexEaters !== -1) {
          whoEatMatrix.value[indexEaters]=1
        }
      }
      for(let i = 0; i<userStore.onlyUserNames.length;i++){
        matrixForTotal.value[i] = []
        const indexPayer = userStore.onlyUserNames.findIndex((user) => user === whoPay.value);
        for(let j = 0; j<userStore.onlyUserNames.length;j++){
          if(i == indexPayer && whoEatMatrix.value[j]!=0){
            matrixForTotal.value[i][j] = dishPrice.value / whoEat.value.length
          }
          else{
            matrixForTotal.value[i][j] = 0
          }
        }
      }
      userStore.addUserDish(
        dishName.value,
        dishPrice.value,
        whoPay.value,
        whoEat.value,
        whoEatMatrix.value,
      )
      userStore.addMatrixForTotal(matrixForTotal.value)

      dataDish.value.push(dishName.value)
      dataDish.value.push(dishPrice.value)
      dataDish.value.push(whoPay.value)
      dataDish.value.push(whoEat.value)
      dataDish.value.push(whoEatMatrix.value)
      emits('update:propsName',dataDish.value)
    }
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
      };
      .in-row > & {
        border-radius: 15px;
      }
    }
  </style>