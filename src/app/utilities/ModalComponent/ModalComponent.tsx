import React from "react"
import { Modal } from "react-bootstrap";
import "./ModalComponent.css";

const ModalComponent = (props: any) => {
    //Return nothing if no modal found in state
    if(!props.modalContent)
    return null;

    return (
      <Modal className={props.className || ''} backdropClassName={props.backdropClassName || ''} onHide={props.onHide} show={props.showModal} aria-labelledby="contained-modal-title-vcenter" centered>
          {<props.modalContent {...props.modalProps}/>}
      </Modal>
    );
  }

export default ModalComponent;