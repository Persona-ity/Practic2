let eventBus = new Vue()

Vue.component('Todo', {
    template: `
    <div id="cols">
        <p class="error" v-if="errors.length" 
                v-for="error in errors">
                   {{ error }}
        </p>
        <addCart></addCart>
        <div class="cill"> 
        <column1 class="col" :column1="column1"></column1>
        <column2 class="col" :column2="column2"></column2>
        <column3 class="col" :column3="column3"></column3>
        </div>
    </div>
    `,
    data() {
        return {
            errors: [],
            column1: [],
            column2: [],
            column3: []
        }
    },
    
    mounted() {
        if ((JSON.parse(localStorage.getItem('column1')) != null)) {
            this.column1 = JSON.parse(localStorage.getItem('column1'))
        }
        if ((JSON.parse(localStorage.getItem('column2')) != null)) {
            this.column2 = JSON.parse(localStorage.getItem('column2'))
        }
        if ((JSON.parse(localStorage.getItem('column3')) != null)) {
            this.column3 = JSON.parse(localStorage.getItem('column3'))
        }
// Слушатели событий для перемещения задач между колонками
        eventBus.$on('add-card', card => {
            this.errors = []
            if (this.column1.length < 3) {
                JSON.parse(localStorage.getItem('column1'))
                this.column1.push(card)
                localStorage.setItem('column1', JSON.stringify(this.column1))
                localStorage.setItem('column2', JSON.stringify(this.column2))
            } else {
                this.errors.push('Превышен лимит по карточкам в 1')
            }
        })
// Обработка события перемещения задачи во вторую колонку        
        eventBus.$on('to-column2', card => {
            this.errors = []
            if (this.column2.length < 5) {
                JSON.parse(localStorage.getItem('column2'))
                this.column2.push(card)
                this.column1.splice(this.column1.indexOf(card), 1)
                localStorage.setItem('column2', JSON.stringify(this.column2))
                localStorage.setItem('column1', JSON.stringify(this.column1))
            } else if (this.column1.length > 0) {
                this.column1.forEach(items => {
                    items.tasks.forEach(items => {
                        items.completed = false;
                    })
                })
                this.errors.push('Превышен лимит по карточкам в 2')
            }
        })
 // Обработка события перемещения задачи в третью колонку
        eventBus.$on('to-column3', card => {
            JSON.parse(localStorage.getItem('column3'))
            this.column3.push(card)
            this.column2.splice(this.column2.indexOf(card), 1)
            localStorage.setItem('column2', JSON.stringify(this.column2))
            localStorage.setItem('column3', JSON.stringify(this.column3))
        })
    },
})

Vue.component('addCart', {
    template: `
    <section>
    <div>
        <div id="form" class="modal-shadow">
            <div class="modal">
                <h3>Заполните карточку задачи</h3>
                <form @submit.prevent="onSubmit">
                     <input type="text" id="task_title" v-model="title" placeholder="Заголовок задачи" required></br>
                     <ul> 
                        <input type="text" id="task_1" v-model="task_1" placeholder="1 пункт:" required></br>
                        <input type="text" id="task_2" v-model="task_2" placeholder="2 пункт:" required></br>
                        <input type="text" id="task_3" v-model="task_3" placeholder="3 пункт:" required></br>
                        <input type="text" id="task_4" v-model="task_4" placeholder="4 пункт:"></br>
                        <input type="text" id="task_5" v-model="task_5" placeholder="5 пункт:"></br>
                     </ul>    
                     <button type="submit">Добавить задачу</button>
                     
                </form>
            </div>
        </div>    
    </div>
        
    </section>
    `,
    data() {
        return {
            title: null,
            task_1: null,
            task_2: null,
            task_3: null,
            task_4: null,
            task_5: null,
            date: null,
            errors: [],
        }
    },
    methods: {
        // Создание объекта задачи и отправка события для добавления
        onSubmit() {
            let card = {
                title: this.title,
                tasks: [
                    {text: this.task_1, completed: false},
                    {text: this.task_2, completed: false},
                    {text: this.task_3, completed: false},
                    {text: this.task_4, completed: false},
                    {text: this.task_5, completed: false},
                ],
                date: new Date().toLocaleString(),
                status: 0,
                errors: [],
            }
            eventBus.$emit('add-card', card)
            this.title = null
            this.task_1 = null
            this.task_2 = null
            this.task_3 = null
            this.task_4 = null
            this.task_5 = null
        },
    },
})

Vue.component('column1', {
    template: `
        <div>
            <h2>Заметки</h2>
            <div class="Task" v-for="card in column1">
                <p><b>Заголовок задачи: </br></b>{{ card.title }}</p>
                <ul v-for="task in card.tasks" 
                    v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                    @click="updateStage(task, card)"
                    :disabled="task.completed" focus>
                    {{ task.text }}
                    </li>
                </ul>
            </div>
        </div v-for>
    `,
    methods: {
        updateStage(task, card) {
            task.completed = true
            card.status = 0
            let lengths = 0

            for (let i = 0; i < 5; i++) {
                if (card.tasks[i].text != null) {
                    lengths++
                }
            }

            for (let i = 0; i < 5; i++) {
                if (card.tasks[i].completed === true) {
                    card.status++
                }
            }

            if (card.status / lengths * 100 >= 50 && card.status / lengths * 100 < 100) {
                eventBus.$emit('to-column2', card)
            } else if (this.column2.length === 5) {
                this.errors.push('')
                if (this.column1.length > 0) {
                    this.column1.forEach(items => {
                        items.tasks.forEach(items => {
                            items.completed = false;
                        })
                    })
                }
            }

        },
    },
    props: {
        column1: {
            type: Array,
            card: {
                type: Object,
            }
        },
        column2: {
            type: Array,
            card: {
                type: Object,
            }
        },
        errors: {
            type: Array,
        },
    },
})

Vue.component('column2', {
    template: `
    <section>
        <div>
            <h2>На половину выполненая карточка</h2>
            <div class="Task" v-for="card in column2">
                <p><b>Заголовок задачи: </br></b>{{ card.title }}</p>
                <ul v-for="task in card.tasks" v-if="task.text != null">
                    <li :class="{ completed:task.completed }" 
                        @click="updateStage2(task, card)"
                        :anabled="task.completed" focus>
                        {{ task.text }}
                    </li>
                </ul>
            </div>
        </div>
    </section>
    `,
    methods: {
        updateStage2(task, card) {
            task.completed = true
            card.status += 1
            let count = 0
            for(let i = 0; i < 5; i++){
                count++
            }
            if (card.status / count * 100 >= 100) {
                eventBus.$emit('to-column3', card)
                card.date = new Date().toLocaleString()
            }
        },
    },
    props: {
        column2: {
            type: Array,
            card: {
                type: Object,
            }
        }
    },
})

Vue.component('column3', {
    template: `
    <section>
        <div>
            <h2>Выполненные заметки</h2>
            <div class="Task" v-for="card in column3">
                <span><b>Заголовок задачи: </b></br>{{ card.title }}</span></br>
                <ul v-for="task in card.tasks" v-if="task.text != null">
                    <li :class="{ completed:task.completed }">
                        {{ task.text }}
                    </li>
                </ul>
                <span id="font"><b>Дата и время выполненных задач: </b></br>{{ card.date}} (GMT-7)</span>
            </div>
        </div>
    </section>
    `,
    computed: {},
    methods: {},
    props: {
        column3: {
            type: Array,
            card: {
                type: Object,
            },
        }
    },
})

let app = new Vue({
    el: '#app',
    data: {}
})