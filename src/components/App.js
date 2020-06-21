import React from 'react'
import RegistroUsuario from './RegistroUsuario';
import ConsultaUsuario from './ConsultaUsuario';
import ConsultaFactura from './ConsultaFactura';
import Configuracion from './Configuracion';

class App extends React.Component {

    state = {menu:"", porcentajeVendedor:0, porcentajePadre:0}

    onMenuChange = (e)=>{
        if (e.target.name === "agregar"){
            this.setState({menu:"agregar"})
        }
        if (e.target.name === "vendedores"){
            this.setState({menu:"vendedores"})
        }
        if (e.target.name === "facturas"){
            this.setState({menu:"facturas"})
        }
        if (e.target.name === "configuracion"){
            this.setState({menu:"configuracion"})
        }
    }

    onConfiguracionSubmit = ({porcVend,porcPadre}) =>{
        this.setState({porcentajePadre:porcPadre,porcentajeVendedor:porcVend});
    }
    
    renderMenu = () =>{
        if (this.state.menu === "agregar")
            return <RegistroUsuario/>
        if (this.state.menu === "vendedores")
            return <ConsultaUsuario/>
        if (this.state.menu === "facturas")
            return <ConsultaFactura porcentajepadre={this.state.porcentajePadre} porcentajevendedor={this.state.porcentajeVendedor}/>
        if (this.state.menu === "configuracion")
            return <Configuracion porcVend={this.state.porcentajeVendedor} porcPadre={this.state.porcentajePadre} onConfiguracionSubmit={this.onConfiguracionSubmit}/>
        if (this.state.menu === "")
            return <ConsultaUsuario/>
    }
    render(){
        return (
            <div className="ui container" style={{marginTop: '10px', width: '100%'}}>
                <div className="ui four item menu">
                    <a name="agregar" className="item" onClick={this.onMenuChange}>Agregar Vendedor</a>
                    <a name="vendedores" className="item" onClick={this.onMenuChange}>Consultar Vendedor</a>
                    <a name="facturas" className="item" onClick={this.onMenuChange}>Consultar Facturas</a>
                    <a name="configuracion" className="item" onClick={this.onMenuChange}>Configuración</a>
                </div>
                <div className="ui center aligned segment">
                    {this.renderMenu()}
                </div>
            </div>
        )
    }
}

export default App;