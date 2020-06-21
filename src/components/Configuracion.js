import React from 'react'

class Configuracion extends React.Component{

    state={porcVend:0,porcPadre:0}


    onInputChange = e => {
        if (e.target.name =="porcVend"){
            this.setState({porcVend:e.target.value});
        }
        if (e.target.name =="porcPadre"){
            this.setState({porcPadre:e.target.value});
        }
    }

    onFormSubmit = (e) =>{
        e.preventDefault();
        this.props.onConfiguracionSubmit(this.state);
    }

    componentDidMount(){
        this.setState({porcPadre:this.props.porcPadre, porcVend:this.props.porcVend});
    }

    render(){
        return(
            <form className="ui form" onSubmit={this.onFormSubmit}>
                <h3>Configuracion</h3>
                <div className="field" style={{width:"40%",margin:"0px auto"}}>
                    <label>Porcentaje a pagar al vendedor</label>
                    <input type="number" required="true" name="porcVend" value={this.state.porcVend} onChange={this.onInputChange} style={{width:"20%"}}/>
                    <label>Porcentaje a pagar al padre</label>
                    <input type="number" required="true" name="porcPadre" value={this.state.porcPadre} onChange={this.onInputChange} style={{width:"20%"}}/>
                    <button className="ui button" type="submit" style={{margin:"10px auto",display:"block"}}>Guardar</button>
                    <p>{this.state.mensaje}</p>
                </div>
            </form>
        )
    }

}

export default Configuracion;