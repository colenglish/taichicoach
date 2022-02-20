import React, { Component } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import MovementSelector from './MovementSelector';

class FormSelector extends Component {
    render() {
        const movementComp = (form) => {
            if (this.props.currentForm && form._id === this.props.currentForm._id) {
                return <MovementSelector form={this.props.currentForm} currentMovement={this.props.currentMovement} onClick={movement => this.props.onMovementClick(movement)}/>;
            }
        };

        const itemClass = (form) => this.props.currentForm && form._id === this.props.currentForm._id ? 'forms-item item-selected' : 'forms-item';

        return(
            <Offcanvas show={this.props.show} onHide={() => this.props.onClose()}>
                <Offcanvas.Header closeButton keyboard>
                    <Offcanvas.Title>Forms</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {this.props.forms.map(form => (
                        <>
                        <div className={itemClass(form)} onClick={(e) => { this.props.onFormClick(form); e.preventDefault(); }}>{form.name}</div>
                        {movementComp(form)}
                        </>
                    ))}                    
                </Offcanvas.Body>
            </Offcanvas>
        );
    }
}

export default FormSelector;