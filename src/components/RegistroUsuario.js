import React from 'react';
import users from '../apis/users';

class RegistroUsuario extends React.Component{

    state = {users:[]}

    
    crearUsuario = async (datos) =>{   
        await users.post('/users',datos)
    }

    obtenerUsuario = async nombre =>{
        let user = await users.get(`/users?nombre=${nombre}`).then(response => response.json());
        user = user.data;
        await this.setState({users:user})

    }
    componentDidMount(){
        this.obtenerUsuario("Pablo")
    }
    

    render(){
        if (this.state.users[0] !== undefined){
            console.log(typeof this.state.users, this.state.users)
            return this.state.users[0].nombre
        }

        else    
            return "not found"
    }
}

export default RegistroUsuario;