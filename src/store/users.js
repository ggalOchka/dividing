import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
        onlyUserNames:[],
        usersDish:[],
        totalPay:[],
        matrixForTotal:[]
    }
  },
  actions: {
    addUserName(name) {
      this.onlyUserNames.push(name)
    },
    deleteUser(userName) {
      const indexToDelete = this.onlyUserNames.findIndex((user) => user.userName === userName);
      if (indexToDelete !== -1) {
        this.onlyUserNames.splice(indexToDelete, 1);
      }
    },
    deleteAllNames(){
      this.onlyUserNames.splice(0,this.onlyUserNames.length)
    },
    addUserDish(dishName, dishPrice, whoPay, whoEat, whoEatMatrix) {
        this.usersDish.push({
          dishName: dishName,
          dishPrice: dishPrice,
          whoPay: whoPay,
          whoEat: whoEat,
          whoEatMatrix: whoEatMatrix
        });
    },
    addMatrixForTotal(matrix){
      this.matrixForTotal.push(matrix)
    },
    deleteAllDishes(){
      this.usersDish.splice(0,this.usersDish.length)
    },
    deleteDish(dishName){
      const indexToDelete = this.usersDish.findIndex((user) => user.dishName === dishName)
      if (indexToDelete !== -1) {
        this.usersDish.splice(indexToDelete, 1);
      }
    }
  }
})


