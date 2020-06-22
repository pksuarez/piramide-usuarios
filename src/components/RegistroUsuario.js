import React from 'react';
import usuarios from '../apis/usuarios';
import _ from 'lodash';
import {Search} from 'semantic-ui-react';   
import '../css/searchBar.css';




class RegistroUsuario extends React.Component{

    state = { usuario:{isLoading: false, results: [], value: '', cedula:"",nombre:"",apellido:"",apellido2:"",padre:""}, users:[], mensaje:"", source:[]}
    
    crearUsuario = async () =>{   
        let request = await usuarios.post('/users',this.state.usuario);
        this.setState({mensaje:request.statusText});
    }

    obtenerUsuarios = async () => {
        let users = await usuarios.get('/users')
        users = users.data;
        await this.setState({users})
    }

    generateSource = () => {
        try{
            let source = this.state.users.map(user => {
                return ({title:user.nombre + " " + user.apellido + " " + user.apellido2, description:user.cedula})
            });  

            this.setState({source});

        }
        catch{}
    }
    
    borrarUsuario = id => {
        usuarios.delete(`/users/2`);
    }
    
    onInputChange = e => {
        if (e.target.name ==="cedula"){
            this.setState({ usuario:{...this.state.usuario,cedula: _.capitalize(e.target.value)}});
        }
        if (e.target.name ==="nombre"){
            this.setState({ usuario:{...this.state.usuario,nombre: _.capitalize(e.target.value)}});
        }
        if (e.target.name ==="apellido"){
            this.setState({ usuario:{...this.state.usuario,apellido: _.capitalize(e.target.value)}});
        }
        if (e.target.name ==="apellido2"){
            this.setState({ usuario:{...this.state.usuario,apellido2: _.capitalize(e.target.value)}});
        }
        if (e.target.name ==="padre"){
            this.setState({usuario:{...this.state.usuario,padre:e.target.value}});
        }
    }

    onFormSubmit = async (e) =>{
        e.preventDefault();
        this.setState({usuario:{cedula:"",nombre:"",apellido:"",apellido2:"",padre:""},mensaje:""})
        setTimeout(() => {this.obtenerUsuarios();
        },300)
        
    }

    handleResultSelect = async(e, { result }) => {
        this.setState({ value: result.title, factura:false })
        this.setState({usuario:{...this.state.usuario,padre:result.description}});

        try{
        }
        catch{}
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value})

        setTimeout(() => {
        if (this.state.value.length < 1) 
            return this.setState({isLoading: false, results: [], value: ''})

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = (result) => re.test(result.title)

        this.setState({
            isLoading: false,
            results: _.filter(this.state.source, isMatch),
        })
        }, 300)
    }
    
    async componentDidMount(){
        await this.obtenerUsuarios();
    }

    render(){
        if (this.state.users.length!==this.state.source.length)
            this.generateSource();
        const { isLoading, value, results } = this.state;
        return(
            <div>
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        < label>Padre</label>
                        <Search
                        style={{width:"20%", margin:"0px auto"}}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                        leading: true,
                        })}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                    </div>
                    <div className="field">
                        <label>Cédula</label>
                        <input required={true} name="cedula" value={this.state.usuario.cedula} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <div className="field">
                        <label>Nombre</label>
                        <input required={true} name="nombre" value={this.state.usuario.nombre} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <div className="field">
                        <label>Apellido</label>
                        <input required={true} name="apellido" value={this.state.usuario.apellido} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
                    </div>
                    <div className="field">
                        <label>Apellido 2</label>
                        <input required={true} name="apellido2" value={this.state.usuario.apellido2} type='text' onChange={this.onInputChange} style={{width:'20%'}}/>
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