import React from 'react';
import '../App.css'
import axios from 'axios';

const uniqid = require('uniqid');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}  

function validatePassword(password) {
    const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/ //password must be between 7 to 15 characters which contain at least one numeric digit and a special character
    if(password.match(pass)) return true
    return false
}


class Todos extends React.Component {
    constructor() {
        super()
        this.state = {
            loading: true,
            loginRefresh: false, 
            Todos: [],
            TodoName: '',
            TodoInfo: '',
            TodoNameError: false,
            TodoInfoError: false,
            user: false,
            register: false,
            emailError: false,
            passwordError: false,
            registerEmailError: false,
            registerPasswordError: false,
            confirmPasswordError: false
        }
        this.saveName = 'TodoApp'
        this.addTodo = this.addTodo.bind(this)
        this.saveTodos = this.saveTodos.bind(this)
        this.removeTodo = this.removeTodo.bind(this)
        this.completeTodo = this.completeTodo.bind(this)
        this.undoComplete = this.undoComplete.bind(this)
        this.handleValidation = this.handleValidation.bind(this)
        this.refreshToken = this.refreshToken.bind(this)
        this.register = this.register.bind(this)
        this.showRegister = this.showRegister.bind(this)
        this.login = this.login.bind(this)
    }

    async componentDidMount() {
        if (localStorage.getItem('user')) {
            let user = JSON.parse(localStorage.getItem('user'))
            user = user.token
            try {
                const response = await axios.post('http://localhost:3001/getTodos', {email: user}, {headers:{ 'Authorization': `Bearer ${user}`}})
                const todoItems = response.data

                console.log(todoItems)

                this.setState({
                    user: user,
                    Todos: todoItems,
                    loading: false,
                })

            } catch(err) {
                this.refreshToken()
            }
        }
        else {
            this.setState({
                loading: false
            })
        }
    }

    refreshToken() {
        const tokens = JSON.parse(localStorage.getItem('user'))
        const refreshToken = tokens.refreshToken
        axios.post('http://localhost:3001/token', {token: refreshToken}, {headers: {'Authorization': `Bearer ${refreshToken}`}})
        .then(response => {
            if (response.data.loginError) {
                console.log('Refresh token expired, please log back in')
                localStorage.removeItem('user')
                this.setState({
                    user: false,
                    loading: false,
                    loginRefresh: false,
                    Todos: []
                })
            } else {
                const newTokens = {token: response.data.token, refreshToken: tokens.refreshToken}
                localStorage.setItem('user', JSON.stringify(newTokens))
                window.location.reload(false)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    saveTodos(todos) {
        const self = this
        axios.post('http://localhost:3001/saveTodos', {todos: todos}, {headers:{'Authorization': `Bearer ${this.state.user}`}})
        .then(response => {
            this.setState({
                Todos: response.data.todos,
                updateMessage: response.data.msg
            })
        }).catch(err => {
            this.setState({
                loginRefresh: true
            })
        }) 
    }

    addTodo() {
        if (this.state.TodoNameError && this.state.TodoInfoError && this.state.TodoName.length > 0 && this.state.TodoInfo.length > 0) {
        let uid = uniqid()
        let newTodos = [...this.state.Todos, {id: uid, TodoName: this.state.TodoName, TodoInfo: this.state.TodoInfo, done: false}]
        this.saveTodos(newTodos)
        this.setState({
            TodoName: '',
            TodoInfo: '',
            TodoNameError: false,
            TodoInfoError: false,
        })
        }
    }

    handleValidation(event) {
        console.log(this.state)
        let error = (/\S/.test(event.target.value))
        if (event.target.id === 'TodoName') {
            this.setState({
                TodoName: event.target.value,
                TodoNameError: error
            })
        }
        else if (event.target.id === 'TodoInfo') {
            let error = (/\S/.test(event.target.value))
            this.setState({
                TodoInfo: event.target.value,
                TodoInfoError: error
            })
        }
        else if (event.target.name === 'email') {
            let error = (/\S/.test(event.target.value))
            if (!validateEmail(event.target.value)) error = false
            this.setState({
                email: event.target.value,
                emailError: error
            })
        }
        else if (event.target.name === 'password') {
            let error = (/\S/.test(event.target.value))
            this.setState({
                password: event.target.value,
                passwordError: error
            })
        }
        else if (event.target.name === 'registerEmail') {
            let error = (/\S/.test(event.target.value))
            if (!validateEmail(event.target.value)) {
                error = false
                this.state.registerEmailErrMsg = false
            }
            this.setState({
                registerEmail: event.target.value,
                registerEmailError: error
            })
        }
        else if (event.target.name === 'registerPassword') {
            let error = (/\S/.test(event.target.value))
            let confirmError = false
            if (!validatePassword(event.target.value)) error = false
            if (this.state.confirmPassword) {
                if (event.target.value === this.state.confirmPassword) confirmError = true
            }
            this.setState({
                registerPassword: event.target.value,
                registerPasswordError: error,
                confirmPasswordError: confirmError
            })
        }
        else if (event.target.name === 'confirmPassword') {
            let error = (/\S/.test(event.target.value))
            let confirmError = false
            if (this.state.registerPassword) {
                if (event.target.value === this.state.registerPassword) confirmError = true
            }
            this.setState({
                confirmPassword: event.target.value,
                confirmPasswordError: error,
                registerPasswordError: confirmError
            })
        }
    }

    removeTodo(event) {
        let id = event.target.id
        axios.post('http://localhost:3001/deleteTodos', {id: id}, {headers:{ 'Authorization': `Bearer ${this.state.user}`}})
        .then(response => {
            this.setState({
                Todos: response.data,
            })
        }).catch(err => {
            this.refreshToken()
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
    }

    showRegister() {
        this.setState({
            register: true
        })
    }

    login() {
        const self = this
        if (this.state.emailError && this.state.passwordError) {
            axios.post('http://localhost:3001/login', {email: this.state.email, password: this.state.password})
            .then(function (response) {
                if (response.data.error) {
                    console.log(response)
                } else {
                    console.log(response)
                    let data = JSON.stringify(response.data)
                    localStorage.setItem('user', data)
                    window.location.reload(false)

                }
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            console.log('Please correct errors')
        }
    }

    register() {
        if (this.state.registerEmailError && this.state.registerPasswordError && this.state.confirmPasswordError) {
            axios.post('http://localhost:3001/register', {email: this.state.registerEmail, password: this.state.confirmPassword})
            .then(response => {
                // handle success
                if (response.data.error === 'Email already exsist') {
                    this.setState({
                        registerEmailError: false,
                        registerEmailErrMsg: true,
                        resetEmail: this.state.registerEmail
                    })
                } else {
                    localStorage.setItem('user', JSON.stringify(response.data))
                    window.location.reload(false)
                }
            })
            .catch(error => {
                // handle error
                console.log(error);
            })        } else {
            console.log('Please fix items in red')
        }
    }

    render() {  
        if (this.state.loading) {
            return (
                <div>
                    <h1>Loading</h1>
                </div>
            )
        }
        else if (this.state.loginRefresh) {
            this.refreshToken()
            return (
                <div>
                    <h1>Please wait while we log you back in.</h1>
                </div>
            )
        }
        else {
            return (
                <div className='Todos'>
                    <div className='container'>
                        {this.state.user &&
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
                        }
                        <div className='TodoList'>
                        {this.state.Todos &&
                            this.state.Todos.map((todo) => {
                                return (
                                    <div className='Todo' key={todo.id}>
                                        <p style={todo.done ? {textDecoration: 'line-through'} : {color: 'black'}}>{todo.TodoName}</p>
                                        <p style={todo.done ? {textDecoration: 'line-through'} : {color: 'black'}}>{todo.TodoInfo}</p>
                                        
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
                        {this.state.user && this.state.Todos.length < 1 && 
                            <p>No Todos</p>
                        }
                        </div>

                    </div>

                    <div className='Footer'>
                <div className='container'>
                    {this.state.user ? 
                    <p>Saving to cloud!</p>
                    :
                    <div>
                        <p>Login to save Todos</p>
                        <input onChange={this.handleValidation} style={this.state.emailError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='email' type="email" className="form-control" placeholder='Email Address'/>
                        <input onChange={this.handleValidation} style={this.state.passwordError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='password' type="password" className="form-control" placeholder='Password'/>
                        <button onClick={this.login} type="button" className="btn btn-dark">Login</button>
                        <p>Done have an account? Click <a style={{color: 'red'}} onClick={this.showRegister}>here</a>!</p>
                        {this.state.register && !this.state.user ?
                        <div>
                        <p>Registration</p>
                        <input onChange={this.handleValidation} style={this.state.registerEmailError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='registerEmail' type="email" className="form-control" placeholder='Email Address'/>
                        <div name='invalid-feedback' style={this.state.registerEmailErrMsg ? {display: 'block', color: 'red', fontSize: '10px'} : {display: 'none'}}>This email already exsist, forgot your <a href={this.state.resetEmail ? this.state.resetEmail : ''}>password</a>?</div>
                        <input onChange={this.handleValidation} style={this.state.registerPasswordError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='registerPassword' type="password" className="form-control" placeholder='Password'/>
                        <div name='invalid-feedback' style={this.state.registerPasswordError ? {display: 'none'} : {display: "block", color: 'red', fontSize: '10px'}}>Password must be 7 characters in length and include aleast one number and one special characters.</div>
                        <input onChange={this.handleValidation} style={this.state.confirmPasswordError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='confirmPassword' type="password" className="form-control" placeholder='Confirm Password'/>
                        <button onClick={this.register} type="button" className="btn btn-dark">Register</button>
                        </div>
                        :
                        <p></p>
                        }
                    </div>
                    }
                </div>
            </div>
                </div>
            )
        }
    }
}

export default Todos;