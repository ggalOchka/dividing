import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    const usersData = JSON.parse(localStorage.getItem('usersData'))
    return {
      onlyUserNames: usersData || [],
      usersDish: [],
      totalPay: [],
      matrixForTotal: []
    }
  },
  actions: {
    addUserName (name) {
      this.onlyUserNames.push(name)
    },
    deleteUser (userName) {
      this.onlyUserNames = this.onlyUserNames.filter(item => item !== userName)
    },
    deleteAllNames () {
      this.onlyUserNames.splice(0)
    },
    addUserDish (dishName, dishPrice, whoPay, whoEat, whoEatMatrix) {
      this.usersDish.push({
        dishName: dishName,
        dishPrice: dishPrice,
        whoPay: whoPay,
        whoEat: whoEat,
        whoEatMatrix: whoEatMatrix
      })
    },
    initMatrixForTotal (usersCount) {
      this.matrixForTotal = new Array(usersCount)
      for (let i = 0; i < usersCount; i++) {
        this.matrixForTotal[i] = new Array(usersCount).fill(0)
      }
    },
    addMatrixForTotal (matrix) {
      for (let i = 0; i < this.matrixForTotal.length; i++) {
        for (let j = 0; j < this.matrixForTotal[i].length; j++) {
          this.matrixForTotal[i][j] += matrix[i][j]
        }
      }
    },
    deleteMatrixForTotal () {
      for (let i = 0; i < this.matrixForTotal.length; i++) {
        this.matrixForTotal[i].fill(0)
      }
    },
    deleteAllDishes () {
      this.usersDish.splice(0)
    },
    deleteDish (dishName) {
      this.usersDish = this.usersDish.filter(item => item !== dishName)
    },
    getNameById (id) {
      const obj = JSON.parse(localStorage.getItem('usersData')).find(obj => obj.id === id)
      return obj ? obj.name : null
    }
  }
})