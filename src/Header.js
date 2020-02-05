import React from "react"
import './Header.css'
// function NavBar() {
    // return (
    //     <div class = "TopNav">
    //         <a class = "active" href = "#home">Home</a>
    //         <br></br>
    //         <a href = "#AboutMe">About Me</a>
    //     </div>
    
    // )
// }

class Header extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <header className = "Header">
                Made by Kiet Nguyen
            </header>     
        )
    }
}


export default Header