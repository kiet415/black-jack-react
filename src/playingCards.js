import React from "react"

function PlayingCards(props) {
    return (
        <div className = "playing-cards">
            <img src = {props.cards.img} alt = "Link of pic here" width = "150" height = "150"/> 
            <p>{props.cards.number}</p>

        </div>

    )
}

export default PlayingCards