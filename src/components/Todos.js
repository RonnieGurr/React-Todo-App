import React from 'react';
import '../App.css'

const uniqid = require('uniqid');


class Todos extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            Todos: [],
            TodoName: '',
            TodoInfo: '',
            TodoNameError: false,
            TodoInfoError: false
        }
        this.saveName = 'TodoApp'
        this.addTodo = this.addTodo.bind(this)
        this.saveTodos = this.saveTodos.bind(this)
        this.removeTodo = this.removeTodo.bind(this)
        this.completeTodo = this.completeTodo.bind(this)
        this.undoComplete = this.undoComplete.bind(this)
        this.handleValidation = this.handleValidation.bind(this)
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

    addTodo() {
        if (this.state.TodoNameError && this.state.TodoInfoError && this.state.TodoName.length > 0 && this.state.TodoInfo.length > 0) {
        let uid = uniqid()
        let newTodos = [...this.state.Todos, {id: uid, name: this.state.TodoName, info: this.state.TodoInfo, done: false}]
        this.saveTodos(newTodos)
        this.setState({
            Todos: newTodos,
            TodoName: '',
            TodoInfo: '',
            TodoNameError: false,
            TodoInfoError: false
        })
        }
    }

    handleValidation(event) {
        let error = (/\S/.test(event.target.value))
        if (event.target.id === 'TodoName') {
            this.setState({
                TodoName: event.target.value,
                TodoNameError: error
            })
        }
        else if (event.target.id === 'TodoInfo') {
            let error = (/\S/.test(event.target.value))
            console.log(error)
            this.setState({
                TodoInfo: event.target.value,
                TodoInfoError: error
            })
        }
    }

    removeTodo(event) {
        let id = event.target.id

        let newTodos = this.state.Todos.filter(todo => todo.id !== id)
        this.saveTodos(newTodos)
        this.setState({
            Todos: newTodos
        })
    }
    
    completeTodo(event) {
        let id = event.target.id

        let newTodos = this.state.Todos.map(todo => {
         if (todo.id === id) {
             todo.done = true
         }
         return todo
        })
        
        this.saveTodos(newTodos)
        this.setState({
            Todos: newTodos
        })
    }

    undoComplete(event) {
        let id = event.target.id

        let newTodos = this.state.Todos.map(todo => {
            if (todo.id === id) {
                todo.done = false
            }
            return todo
        })
        this.saveTodos(newTodos)
        this.setState({
            Todos: newTodos
        })
    }

    render() {
        console.log(this.state)
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
                                <input style={this.state.TodoNameError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name={'TodoNameInput'} onChange={this.handleValidation} id="TodoName" type="text" className="form-control" placeholder="Todo Name" value={this.state.TodoName}/>
                            </div>
                            <div className="col">
                                <input style={this.state.TodoInfoError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name={'TodoInfoInput'} onChange={this.handleValidation} id="TodoInfo" type="text" className="form-control" placeholder="Todo Notes" value={this.state.TodoInfo}/>
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
                                        <p style={todo.done ? {textDecoration: 'line-through'} : {color: 'black'}}>{todo.name}</p>
                                        <p style={todo.done ? {textDecoration: 'line-through'} : {color: 'black'}}>{todo.info}</p>
                                        
                                        <div className='row'>
                                            <div className='col'>
                                                <button id={todo.id} onClick={todo.done ? this.undoComplete : this.completeTodo} type="button" className="btn btn-dark">{todo.done ? 'UN-Complete' : 'Complete'}</button>
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