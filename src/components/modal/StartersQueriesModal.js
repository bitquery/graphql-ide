import React from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Button } from 'react-bootstrap'
import StartersQueriesComponents from "../StartersQueriesComponents";
import modalStore from "../../store/modalStore";

const StartersQueriesModal = observer(() => {
    const { startersQueriesModalIsOpen, toggleStartersQueriesModal, toggleModal } = modalStore

    return (
        <Modal
            show={startersQueriesModalIsOpen}
            onHide={toggleStartersQueriesModal}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Starter Queries & Subscriptions</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0 }}>
                <StartersQueriesComponents />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary"      onClick={() => {
                    toggleModal();
                    toggleStartersQueriesModal();
                }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
})

export default StartersQueriesModal
