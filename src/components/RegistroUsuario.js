import React from 'react';
import usuarios from '../apis/usuarios';
import _ from 'lodash'


class RegistroUsuario extends React.Component{

    state = { usuario:{cedula:"",nombre:"",apellido:"",apellido2:"",padre:""}, users:[], mensaje:""}
    
    crearUsuario = async () =>{   
        let request = await usuarios.post('/users',this.state.usuario);
        this.setState({mensaje:request.statusText});
    }

    obtenerUsuarios = async () => {
        let users = await usuarios.get('/users')
        users = users.data;
        console.log(users);
        await this.setState({users})
    }
    
    borrarUsuario = id => {
        usuarios.delete(`/users/2`);
        console.log(usuarios.delete(`/users/${id}`));
    }
    
    onInputChange = e => {
        if (e.target.name =="cedula"){
            this.setState({ usuario:{...this.state.usuario,cedula: _.capitalize(e.target.value)}});
        }
        if (e.target.name =="nombre"){
            this.setState({ usuario:{...this.state.usuario,nombre: _.capitalize(e.target.value)}});
        }
        if (e.target.name =="apellido"){
            this.setState({ usuario:{...this.state.usuario,apellido: _.capitalize(e.target.value)}});
        }
        if (e.target.name =="apellido2"){
            this.setState({ usuario:{...this.state.usuario,apellido2: _.capitalize(e.target.value)}});
        }
        if (e.target.name =="padre"){
            this.setState({usuario:{...this.state.usuario,padre:e.target.value}});
        }
    }

    onFormSubmit = async (e) =>{
        e.preventDefault();
        this.setState({usuario:{cedula:"",nombre:"",apellido:"",apellido2:"",padre:""},mensaje:""})
        setTimeout(() => this.obtenerUsuarios(),300)
        
    }

    componentDidMount(){
        this.obtenerUsuarios();
    }
    render(){
        return(
            <div>
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        < label>Padre</label>
                        <select className="ui search fluid dropdown" name="padre" onChange={this.onInputChange} defaultValue="" style={{width:"20%", margin:"0px auto"}}>
                            <option></option>
                            {this.state.users.map((user => {
                                return(
                                    <option key={user.id} value={user.cedula}>{`${user.nombre} ${user.apellido} ${user.apellido2}`}</option>
                                )
                            }))}
                        </select>
                    </div>
                    <div className="field">
                        <label>Cédula</label>
                        <input required="true" name="cedula" value={this.state.usuario.cedula} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <div className="field">
                        <label>Nombre</label>
                        <input required="true" name="nombre" value={this.state.usuario.nombre} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <div className="field">
                        <label>Apellido</label>
                        <input required="true" name="apellido" value={this.state.usuario.apellido} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <div className="field">
                        <label>Apellido 2</label>
                        <input required="true" name="apellido2" value={this.state.usuario.apellido2} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <button className="ui button" type="submit" onClick={()=>{this.crearUsuario(this.state.usuario);
}}>Confirmar</button>
                    <div>{this.state.mensaje}</div>
                </form>
            </div>
        )
    }
}

export default RegistroUsuario;