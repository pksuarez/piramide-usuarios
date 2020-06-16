import React from 'react'
import RegistroUsuario from './RegistroUsuario';

let App = () => {
    /**componentDidMount(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ padre: '', abuelo:'', usuario:'pablo' })
        };
        fetch('https://fathomless-dawn-33033.herokuapp.com/users', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ postId: data.id }));
    }**/

    return (
        <RegistroUsuario/>
    )
}

export default App;