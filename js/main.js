let eventBus = new Vue()

Vue.component('column', {
    template: `
        <div class="columns">
            <newCard></newCard>
            <p class="error" v-for="error in errors">{{ error }}</p>
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
         errors: [],
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
                this.errors.length = 0
                this.SmallCollumn.push(ColumnCard)
                localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
            } else {
                this.errors.length = 0
                this.errors.push('макс коллво заметок в 1 столбце')
            }
        })

        // Слушатель события для добавления карточки во вторую колонку
        eventBus.$on('addMiddleColumn', ColumnCard => {
            if (this.MiddleColumn.length < 5) {
                this.errors.length = 0
                this.MiddleColumn.push(ColumnCard)
                this.SmallCollumn.splice(this.SmallCollumn.indexOf(ColumnCard), 1)
                localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
                localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            } else {
                this.errors.length = 0
                this.errors.push('Вы не можете редактировать первую колонку, пока во второй есть 5 карточек.')
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

Vue.component('newCard', {
    template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
            <p class="main_text">Заметки</p>
        <div class="form_control">
                
            <div class="form_name">
                <input required type="text" v-model="name" id="name" placeholder="Введите название заметки"/>
            </div>
            
            <input required type="text"  v-model="point_1" placeholder="Первый пункт"/>

            <input required type="text"  v-model="point_2" placeholder="Второй пункт"/>

            <input required type="text"  v-model="point_3" placeholder="Третий пункт"/> 

            <input required type="text"  v-model="point_4"  placeholder="Четвертый пункт"/>

             <input required type="text" v-model="point_5"  placeholder="Пятый пункт"/>
        </div>
        <div>                    
                <p class="sub">
                        <input type="submit" value="Отправить"> 
                </p>
            </div>
        </form>
    </section>
    `,
    data() {
        return {
            name: null,
            point_1: null,
            point_2: null,
            point_3: null,
            point_4: null,
            point_5: null,
            date: null,
        }
    },
    // Метод обработки отправки формы
    methods: {

        Submit() {
            let Chart = {
                name: this.name,
                points: [
                    {name: this.point_1, completed: false},
                    {name: this.point_2, completed: false},
                    {name: this.point_3, completed: false},
                    {name: this.point_4, completed: false},
                    {name: this.point_5, completed: false}
                ],
                date: new Date().toLocaleString(),
                status: 0,
                test: 0,
                errors: [],
            }
            // Эмит события для добавления карточки в первую колонку
            eventBus.$emit('addSmallCollumn', Chart)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }

})

// Компонент "SmallCollumn" для отображения первой колонки
Vue.component('SmallCollumn', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_one">
                <div class="Chart" v-for="Chart in SmallCollumn">
                <h3>{{ Chart.name }}</h3>
                    <div class="tasks" v-for="task in Chart.points"
                    @click="TaskCompleted(Chart, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
      SmallCollumn: {
            type: Array,
        },
        MiddleColumn: {
            type: Array,
        },
        Chart: {
            type: Object,
        },
        Mistakes: {
            type: Array,
        },
    },
    // Метод обработки завершения задачи в карточке
    methods: {
        TaskCompleted(ColumnCard, task) {
            JSON.parse(localStorage.getItem("SmallCollumn"))
            task.completed = true
            ColumnCard.status += 1
            localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
             if (ColumnCard.status === 3) {
                eventBus.$emit('addMiddleColumn', ColumnCard)
            }
            else if (ColumnCard.status > 3){
                ColumnCard.status = 0
                this.SmallCollumn.forEach(items => {
                        items.points.forEach(items => {
                            items.completed = false;
                        })
                    })
             }
        },
    },
})

Vue.component('MiddleColumn', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_two">
                <div class="Chart" v-for="Chart in MiddleColumn">
                <h3>{{ Chart.name }}</h3>
                    <div class="tasks" v-for="task in Chart.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(Chart, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
      MiddleColumn: {
            type: Array,
        },
        Chart: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnCard, task) {
            JSON.parse(localStorage.getItem("MiddleColumn"))
            task.completed = true
            ColumnCard.status += 1
            localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            let count = 0
            for(let i = 0; i < 5; i++){
                count++
            }
            if (( ColumnCard.status / count) * 100 >= 100) {
                eventBus.$emit('addLargeColumn', ColumnCard)
                ColumnCard.date = new Date().toLocaleString()
            }
        }
    }
})

Vue.component('LargeColumn', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_three">
                <div class="Chart" v-for="Chart in LargeColumn">
                <h3>{{ Chart.name }}</h3>
                    <div class="tasks" v-for="task in Chart.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(Chart, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                        <p>{{ Chart.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
      LargeColumn: {
            type: Array,
        },
        Chart: {
            type: Object,
        },
    },
    methods: {
    }
})

let app = new Vue({
    el: '#app',
})
