import _ from 'lodash'
import usuarios from '../apis/usuarios';
import React, { Component } from 'react'
import {Search} from 'semantic-ui-react'
import '../css/searchBar.css'

const initialState = { isLoading: false, results: [], value: '', user:[], padre:[],factura:false, datosFact:{numero:"",valor:""},mensaje:""}


class ConsultaUsuario extends React.Component{


    state = initialState
    source = []

    crearFactura = async () =>{   
        let request = await usuarios.post('/facturas',this.state.datosFact);
        this.setState({mensaje:request.statusText});
    }

    obtenerUsuarios = async () => {
        let users = await usuarios.get('/users')
        users = users.data;
        this.setState({users})
    }

    obtenerUsuario = async (nombre, apellido, apellido2) =>{
        let user = await usuarios.get(`/users?nombre=${nombre}&apellido=${apellido}&apellido2=${apellido2}`)
        user = user.data;
        console.log(user);
        this.setState({user})
    }

    obtenerPadre = async (cedula) =>{
        console.log("obtener padre", cedula);
        let padre = await usuarios.get(`/users?cedula=${cedula}`)
        padre = padre.data;
        this.setState({padre})
    }

    handleResultSelect = async(e, { result }) => {
        this.setState({ value: result.title, factura:false })
        try{
            let nameArray = _.split(result.title, " ");
            let nombre = nameArray[0];
            let apellido = nameArray[1];
            let apellido2 = nameArray[2];
            await this.obtenerUsuario(nombre,apellido,apellido2);
            await this.obtenerPadre(this.state.user[0].padre);
        }
        catch{}
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value})

        setTimeout(() => {
        if (this.state.value.length < 1) 
            return this.setState(initialState)

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = (result) => re.test(result.title)

        this.setState({
            isLoading: false,
            results: _.filter(this.source, isMatch),
        })
        }, 300)
    }

    onInputChange = e => {
        if (e.target.name =="numeroFact"){
            this.setState({ datosFact:{...this.state.datosFact,numero: _.capitalize(e.target.value)}});
        }
        if (e.target.name =="totalFact"){
            this.setState({ datosFact:{...this.state.datosFact,valor: _.capitalize(e.target.value)}});
        }
    }

    onFormSubmit = (e) =>{
        e.preventDefault();
        this.setState({datosFact:{numero:"",valor:"",usuario:""}, mensaje:""});
        this.crearFactura();
    }

    renderFormFactura = () => {
        if (this.state.factura){
            return(
                <div style={{width:"40%",margin:"10px auto"}}>
                    <h3>Datos de facturas</h3>
                    <form className="ui form" onSubmit={this.onFormSubmit}>
                        <div className="field">
                            <label>Número</label>
                            <input type="text" required="true" name="numeroFact" value={this.state.datosFact.numero} placeholder="Número de factura" onChange={this.onInputChange}/>
                        </div>
                        <div className="field">
                            <label>Total</label>
                            <input type="text" required="true" name="totalFact" value={this.state.datosFact.valor} placeholder="Total" onChange={this.onInputChange}/>
                        </div>
                        <button type="submit" style={{marginTop:"10px"}} className="ui button" onClick={() => {this.setState({factura:true})}}>Agregar</button>
                    </form>
                    <div>{this.state.mensaje}</div>
                </div>
            )
        }
    }

    renderUserInfo= () =>{

        let datosPadre = {};
        let mensajePadre = " "
        let estilo = {display:"none"};
        if (this.state.padre.length!=0){
            estilo = {display:"block"}
            datosPadre = this.state.padre[0];
            mensajePadre = `Vendedor padre: ${datosPadre.nombre} ${datosPadre.apellido} ${datosPadre.apellido2}`
        }
        if (this.state.user.length!=0){
            return(
                <div>
                    <div className="ui segments" style={{width:"40%",margin:"10px auto"}}>
                        <div className="ui segment">
                        <p>Nombre: {this.state.user[0].nombre +" "+ this.state.user[0].apellido + " "+ this.state.user[0].apellido2}</p>
                        </div>
                        <div className="ui segment" style={estilo}>
                            <p>{mensajePadre}</p>
                        </div>
                        <div className="ui segment">
                            <p>Cédula: {this.state.user[0].cedula}</p>
                        </div>
                    </div>
                    <button  style={{marginTop:"10px"}} className="ui button" onClick={() => {this.setState({factura:true, datosFact:{...this.state.datosFact,usuario:this.state.user[0].cedula}})}}>Agregar Factura</button>
                    {this.renderFormFactura()}
                </div>
            )
        }

    }
    async componentDidMount(){
        await this.obtenerUsuarios()
        try{
            this.source = this.state.users.map(user => {
                return ({title:user.nombre + " " + user.apellido + " " + user.apellido2})
            });  
        }
        catch{}
    }
        render(){
            const { isLoading, value, results } = this.state;
            return (
                <div>
                    <h2>Consulta de vendedor</h2>
                    <Search
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                        leading: true,
                        })}
                        results={results}
                        value={value}
                        {...this.props}
                    />
                    {this.renderUserInfo()}
                </div>
                )
        }
}

export default ConsultaUsuario;