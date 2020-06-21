import _ from 'lodash'
import usuarios from '../apis/usuarios';
import React, { Component } from 'react'
import { Search} from 'semantic-ui-react'
import '../css/searchBar.css'

const initialState = { isLoading: false, results: [], value: '', user:[], padre:[],factura:[],mensaje:""}


class ConsultaFactura extends React.Component{


    state = initialState
    source = []

    crearFactura = async () =>{   
        let request = await usuarios.post('/facturas',this.state.datosFact);
        this.setState({mensaje:request.statusText});
    }

    obtenerFacturas = async () => {
        let facturas = await usuarios.get('/facturas')
        facturas = facturas.data;
        this.setState({facturas})
    }

    obtenerUsuario = async (cedula) =>{
        console.log("obtener usuario", cedula);
        let user = await usuarios.get(`/users?cedula=${cedula}`)
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

    obtenerFactura = async (numero) =>{
        let factura = await usuarios.get(`/facturas?numero=${numero}`)
        factura = factura.data;
        console.log(factura);
        this.setState({factura})
    }

    handleResultSelect = async (e, { result }) => {
        this.setState({ value: result.title });
        try{
            await this.obtenerFactura(result.title);
            await this.obtenerUsuario(this.state.factura[0].usuario);
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

    calcularPorcentaje(pvalor,porcentaje){
        let valor = _.toInteger(pvalor);
        return (valor*porcentaje/100);
    }
    renderFacturaInfo= () =>{
        let datosUsuario = {};
        let datosPadre = {};
        let mensajePadre = "";
        let estilo = {display:"none"};
        if (this.state.user.length!=0){
            datosUsuario = this.state.user[0];
        }
        if (this.state.padre.length!=0 & this.state.factura.length!=0){
            datosPadre = this.state.padre[0];
            estilo = {display:"block"}
            mensajePadre = `Total a pagar a ${datosPadre.nombre} ${datosPadre.apellido} ${datosPadre.apellido2}: ₡ ${this.calcularPorcentaje(this.state.factura[0].valor,this.props.porcentajepadre)}`
            
        }
        if (this.state.factura.length!=0){
            return(
                <div>
                    <div className="ui segments" style={{width:"40%",margin:"10px auto"}}>
                        <div className="ui segment">
                            <p>Vendedor: {datosUsuario.nombre+" "+datosUsuario.apellido+" "+datosUsuario.apellido2}</p>
                        </div>
                        <div className="ui segment">
                            <p>Número de factura: {this.state.factura[0].numero}</p>
                        </div>
                        <div className="ui segment">
                            <p>Valor: &#8353;{this.state.factura[0].valor}</p>
                        </div>
                        <div className="ui segment">
                            <p>Total a pagar a vendedor: &#8353;{this.calcularPorcentaje(this.state.factura[0].valor,this.props.porcentajevendedor)}</p>
                        </div>
                        <div className="ui segment" style={estilo}>
                            <p>{mensajePadre}</p>
                        </div>
                    </div>
                </div>
            )
        }

    }
    async componentDidMount(){
        await this.obtenerFacturas()
        try{
            this.source = this.state.facturas.map(factura => {
                return ({title:factura.numero})
            });  
        }
        catch{}
    }
        render(){
            const { isLoading, value, results } = this.state;
            return (
                <div>
                    <h2>Consulta de factura</h2>
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
                    {this.renderFacturaInfo()}
                </div>
                )
        }
}

export default ConsultaFactura;