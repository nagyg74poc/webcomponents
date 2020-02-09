const listTemplate = document.createElement('template');
listTemplate.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    text-align: center;
    }

    button {
    border: none;
    cursor: pointer;
    }

    ul {
    list-style: none;
    padding: 0;
    }
    
    .list-item {
    color: lightblue;
    }
</style>
<h1>To do List</h1>

<input type="text" placeholder="Add a new to do"></input>
<button>✅</button>

<ul id="todos"></ul>
`;

class NgTodoList extends HTMLElement {

    constructor() {
        super();
        this._todos = [];
        this._shadowRoot = this.attachShadow({'mode': 'open'});
        this._shadowRoot.appendChild(listTemplate.content.cloneNode(true));

        this.$todoList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');

        this.$submitButton = this._shadowRoot.querySelector('button');
        this.$submitButton.addEventListener('click', this.addTodo.bind(this));
    }

    _renderTodoList() {
        this.$todoList.innerHTML = '';

        this._todos.forEach((todo, index) => {
            let $todoItem = document.createElement('ng-todo-item');
            $todoItem.classList.add('list-item');
            $todoItem.setAttribute('text', todo.text);
            $todoItem.setAttribute('index', index);
            if (todo.checked) {
                $todoItem.setAttribute('checked', '');
            }
            $todoItem.innerHTML = todo.text;

            $todoItem.addEventListener('onRemove', this.removeTodo.bind(this));
            $todoItem.addEventListener('onToggle', this.toggleTodo.bind(this));

            this.$todoList.appendChild($todoItem);
        });
    }

    addTodo() {
        if (this.$input.value.length > 0) {
            this._todos.push({text: this.$input.value, checked: false});
            this._renderTodoList();
            this.$input.value = '';
        }
    }

    removeTodo(e) {
        this._todos.splice(e.detail, 1);
        this._renderTodoList();
    }

    toggleTodo(e) {
        const todo = this._todos[e.detail];
        this._todos[e.detail] = Object.assign({}, todo, {
            checked: !todo.checked
        });
        this._renderTodoList();
    }

    set todos(value) {
        this._todos = value;
        this._renderTodoList();
    }

    get todos() {
        return this._todos;
    }
}

window.customElements.define('ng-todo-list', NgTodoList);
