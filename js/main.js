let eventBus = new Vue()

Vue.component('Todo', {
    template: `
        <div class="columns">
            <newCard></newCard>
            <p class="Mistake" v-for="Mistake in Mistakes">{{ Mistake }}</p>
            <SmallCollumn :SmallCollumn="SmallCollumn"></SmallCollumn>
            <MiddleColumn :MiddleColumn="MiddleColumn"></MiddleColumn>
            <LargeColumn :LargeColumn="LargeColumn"></LargeColumn>
         </div>
    `,
    data() {
        return {
         SmallCollumn: [],
         MiddleColumn: [],
         LargeColumn: [], 
         Mistakes: [],
        }
    },

    mounted() {

        if ((JSON.parse(localStorage.getItem("SmallCollumn")) != null)){
            this.SmallCollumn = JSON.parse(localStorage.getItem("SmallCollumn"))
        }
        if ((JSON.parse(localStorage.getItem("MiddleColumn")) != null)){
            this.MiddleColumn = JSON.parse(localStorage.getItem("MiddleColumn"))
        }
        if ((JSON.parse(localStorage.getItem("LargeColumn")) != null)){
            this.LargeColumn = JSON.parse(localStorage.getItem("LargeColumn"))
        }

        eventBus.$on('addSmallCollumn', ColumnCard => {

            if (this.SmallCollumn.length < 3) {
                this.Mistakes.length = 0
                this.SmallCollumn.push(ColumnCard)
                localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
            } else {
                this.Mistakes.length = 0
                this.Mistakes.push('макс коллво заметок в 1 столбце')
            }
        })

        // Слушатель события для добавления карточки во вторую колонку
        eventBus.$on('addMiddleColumn', ColumnCard => {
            if (this.MiddleColumn.length < 5) {
                this.Mistakes.length = 0
                this.MiddleColumn.push(ColumnCard)
                this.SmallCollumn.splice(this.SmallCollumn.indexOf(ColumnCard), 1)
                localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
                localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            } else {
                this.Mistakes.length = 0
                this.Mistakes.push('Вы не можете редактировать первую колонку, пока во второй есть 5 карточек.')
            }
        })
        eventBus.$on('addLargeColumn', ColumnCard => {
            JSON.parse(localStorage.getItem('MiddleColumn'))
            this.LargeColumn.push(ColumnCard)
            this.MiddleColumn.splice(this.MiddleColumn.indexOf(ColumnCard), 1)
            localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            localStorage.setItem('LargeColumn', JSON.stringify(this.LargeColumn))
        })

    }
})

let app = new Vue({
    el: '#app',
})
