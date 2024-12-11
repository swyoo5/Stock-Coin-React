import React from "react";
import { Chart } from "react-chartjs-2";
import modal, {CloseButton} from "../styles/modal";

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal" style={modal.modal}>
            <div className="modal-content" style={modal.modalContent}>
                <CloseButton onClose = {onClose}/>
                {children}
            </div>
        </div>
    );
}

export default Modal;
