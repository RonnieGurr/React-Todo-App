import React from 'react';
import '../App.css'

class Todos extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            Todos: []
        }
        this.saveName = 'TodoApp'
        this.addTodo = this.addTodo.bind(this)
        this.saveTodos = this.saveTodos.bind(this)
        this.removeTodo = this.removeTodo.bind(this)
    }

    componentDidMount() {
        if (localStorage.getItem(this.saveName)) {
            this.setState({
                Todos: JSON.parse(localStorage.getItem(this.saveName)),
                loading: false
            })
        } else {
            this.setState({
                loading: false
            })
        }
    }

    saveTodos(todos) {
        localStorage.setItem(this.saveName, JSON.stringify(todos))
    }

    addTodo(event) {
        if (event.target.id === 'TodoName') {
            this.setState({
                TodoName: event.target.value
            })
        }
        else if (event.target.id === 'TodoInfo') {
            this.setState({
                TodoInfo: event.target.value
            })
        } else {
            if (this.state.TodoName && this.state.TodoInfo) {
                let uid = this.state.Todos.length + 1
                let newTodos = [...this.state.Todos, {id: uid, name: this.state.TodoName, info: this.state.TodoInfo}]
                this.saveTodos(newTodos)
                this.setState({
                    Todos: newTodos
                })
            } else {
                console.log('Todo name or Todo info is empty')
            }
        }
    }

    removeTodo(event) {
        var id = parseInt(event.target.id)

        for(var i = 0; i < this.state.Todos.length; i++) {
            if(this.state.Todos[i].id === id) {
                this.state.Todos.splice(i, 1)
                let newTodos = this.state.Todos
                this.saveTodos(newTodos)
                this.setState({
                    Todos: newTodos
                })
            }
        }
    }
    
    completeTodo() {
        //You stopped coding here btw
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <h1>Loading</h1>
                </div>
            )
        }
        else {
            return (
                <div className='Todos'>
                    <div className='container'>

                        <div className='row'>
                            <div className="col">
                                <input onChange={this.addTodo} id="TodoName" type="text" className="form-control" placeholder="Todo Name" />
                            </div>
                            <div className="col">
                                <input onChange={this.addTodo} id="TodoInfo" type="text" className="form-control" placeholder="Todo Notes" />
                            </div>
                            <div className="col">
                                <button onClick={this.addTodo} style={{width: '100%'}} type="button" className="btn btn-dark">Add Todo</button>
                            </div>
                        </div>

                        <div className='TodoList'>
                        {this.state.Todos &&
                            this.state.Todos.map((todo) => {
                                return (
                                    <div className='Todo' key={todo.id}>
                                        <p>{todo.name}</p>
                                        <p>{todo.info}</p>
                                        
                                        <div className='row'>
                                            <div className='col'>
                                                <button type="button" className="btn btn-dark">Complete</button>
                                            </div>
                                            <div className='col'>
                                                <button id={todo.id} onClick={this.removeTodo} type="button" className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                        }
                        {this.state.Todos.length < 1 && 
                            <p>No Todos</p>
                        }
                        </div>

                    </div>
                </div>
            )
        }
    }
}

export default Todos;