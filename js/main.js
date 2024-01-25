let eventBus = new Vue()

Vue.component('Todo', {
    template: `
 
        <div class="columns">
            <newCard></newCard>
        <p class="error" v-for="Mistake in Mistakes">{{ Mistake }}</p>
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

        eventBus.$on('Addition_1', ColumnWithCards => {

            if (this.SmallCollumn.length < 3) {
                this.Mistakes.length = 0
                this.SmallCollumn.push(ColumnWithCards)
                localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
            } else {
                this.Mistakes.length = 0
                this.Mistakes.push('Максимальное кол-во карточек в первом столбце')
            }
        })
        eventBus.$on('addColumn_2', ColumnWithCards => {
            if (this.MiddleColumn.length < 5) {
                this.Mistakes.length = 0
                this.MiddleColumn.push(ColumnWithCards)
                this.SmallCollumn.splice(this.SmallCollumn.indexOf(ColumnWithCards), 1)
                localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
                localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            } else {
                this.Mistakes.length = 0
                this.Mistakes.push('')
            }
        })
        eventBus.$on('addColumn_3', ColumnWithCards => {
            JSON.parse(localStorage.getItem('MiddleColumn'))
            this.LargeColumn.push(ColumnWithCards)
            this.MiddleColumn.splice(this.MiddleColumn.indexOf(ColumnWithCards), 1)
            localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            localStorage.setItem('LargeColumn', JSON.stringify(this.LargeColumn))
        })

    }
})

Vue.component('newCard', {
    template: `
    <section>
        <form class="row" @submit.prevent="Submit">
            <p class="Texting">Заметки</p>
        <div class='SomeOne'>  
            <div class="NameForm">
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
    methods: {

        Submit() {
            let card = {
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
                Mistakes: [],
            }
            eventBus.$emit('Addition_1', card)
            this.name = null;
            this.point_1 = null
            this.point_2 = null
            this.point_3 = null
            this.point_4 = null
            this.point_5 = null
        }
    }

})

Vue.component('SmallCollumn', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_one">
                <div class="card" v-for="card in SmallCollumn">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                    @click="TaskCompleted(card, task)"
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
        card: {
            type: Object,
        },
        Mistakes: {
            type: Array,
        },
    },
    methods: {
        TaskCompleted(ColumnWithCards, task) {
            JSON.parse(localStorage.getItem("SmallCollumn"))
            task.completed = true
            ColumnWithCards.status += 1
            localStorage.setItem('SmallCollumn', JSON.stringify(this.SmallCollumn))
             if (ColumnWithCards.status === 3) {
                eventBus.$emit('addColumn_2', ColumnWithCards)
            }
            else if (ColumnWithCards.status > 3){
                ColumnWithCards.status = 0
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
                <div class="card" v-for="card in MiddleColumn">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
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
        card: {
            type: Object,
        },
    },
    methods: {
        TaskCompleted(ColumnWithCards, task) {
            JSON.parse(localStorage.getItem("MiddleColumn"))
            task.completed = true
            ColumnWithCards.status += 1
            localStorage.setItem('MiddleColumn', JSON.stringify(this.MiddleColumn))
            let count = 0
            for(let i = 0; i < 5; i++){
                count++
            }
            if (( ColumnWithCards.status / count) * 100 >= 100) {
                eventBus.$emit('addColumn_3', ColumnWithCards)
                ColumnWithCards.date = new Date().toLocaleString()
            }
        }
    }
})

Vue.component('LargeColumn', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column_three">
                <div class="card" v-for="card in LargeColumn">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="TaskCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                        <p>{{ card.date }} (GMT-7)</p>
                </div>
            </div>
        </section>
    `,
    props: {
        LargeColumn: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
    methods: {
    }
})

let app = new Vue({
    el: '#app',
})
