import React from 'react';
import axios from 'axios';

class Footer extends React.Component {
    constructor() {
        super()
        this.state =  {
            loading: true,
            user: undefined,
            register: false,
            emailError: false,
            passwordError: false,
            registerEmailError: false,
            registerPasswordError: false,
            confirmPasswordError: false
        }

        this.handleInput = this.handleInput.bind(this)
        this.login = this.login.bind(this)
        this.showRegister = this.showRegister.bind(this)
        this.register = this.register.bind(this)
    }

    componentDidMount() {
        if (localStorage.getItem('user')) {
            let user = JSON.parse(localStorage.getItem('user'))
            this.setState({
                user: user.email,
                loading: false
            })
        } else {
            this.setState({
                loading: false
            })
        }
    }

    handleInput(event) {
        if (event.target.name === 'email') {
            let error = (/\S/.test(event.target.value))
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
            this.setState({
                registerEmail: event.target.value,
                registerEmailError: error
            })
        }
        else if (event.target.name === 'registerPassword') {
            let error = (/\S/.test(event.target.value))
            let confirmError = false
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

    login() {
        const self = this
        if (this.state.emailError && this.state.passwordError) {
            axios.post('http://localhost:3001/login', {email: this.state.email, password: this.state.password})
            .then(function (response) {
                if (response.data.error) {
                    console.log(response.data.error)
                } else {
                    let data = JSON.stringify(response.data)
                    localStorage.setItem('user', data)
                    window.location.href = window.location.pathname + window.location.search + window.location.hash;

                }
            })
            .catch(function (error) {
                console.log(error);
            })
        } else {
            console.log('Please correct errors')
        }
    }

    showRegister() {
        this.setState({
            register: true
        })
    }

    register() {
        if (this.state.registerEmailError && this.state.registerPasswordError && this.state.confirmPasswordError) {
            axios.post('http://localhost:3001/register', {email: this.state.registerEmail, password: this.state.confirmPassword})
            .then(response => {
                // handle success
                if (response.data.error === 'Email already exsist') {
                    this.setState({
                        registerEmailError: false
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
        return (
            <div className='Footer'>
                <div className='container'>
                    {this.state.user ? 
                    <p>Saving to cloud!</p>
                    :
                    <div>
                        <p>Login to save Todos</p>
                        <input onChange={this.handleInput} style={this.state.emailError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='email' type="email" className="form-control" placeholder='Email Address'/>
                        <input onChange={this.handleInput} style={this.state.passwordError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='password' type="password" className="form-control" placeholder='Password'/>
                        <button onClick={this.login} type="button" className="btn btn-dark">Login</button>
                        <p>Done have an account? Click <a style={{color: 'red'}} onClick={this.showRegister}>here</a>!</p>
                        {this.state.register && !this.state.user ?
                        <div>
                        <p>Registration</p>
                        <input onChange={this.handleInput} style={this.state.registerEmailError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='registerEmail' type="email" className="form-control" placeholder='Email Address'/>
                        <input onChange={this.handleInput} style={this.state.registerPasswordError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='registerPassword' type="password" className="form-control" placeholder='Password'/>
                        <input onChange={this.handleInput} style={this.state.confirmPasswordError ? {borderColor: 'limegreen'} : {borderColor: 'red'}} name='confirmPassword' type="password" className="form-control" placeholder='Confirm Password'/>
                        <button onClick={this.register} type="button" className="btn btn-dark">Register</button>
                        </div>
                        :
                        <p></p>
                        }
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default Footer;