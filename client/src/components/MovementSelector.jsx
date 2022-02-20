import React, { Component } from 'react';

class MovementSelector extends Component {
    render() {
        const movements = (this.props.form && this.props.form.movements) ? this.props.form.movements : [];
        const itemClass = (movement) => this.props.currentMovement && movement._id === this.props.currentMovement._id ? 'movements-item item-selected' : 'movements-item';
        
        return(
            <div class="movements-list">
                {movements.map(movement => (
                    <div className={itemClass(movement)} onClick={(e) => { this.props.onClick(movement); e.preventDefault(); }}>{movement.name}</div>
                ))}
            </div>
        );
    }
}

export default MovementSelector;