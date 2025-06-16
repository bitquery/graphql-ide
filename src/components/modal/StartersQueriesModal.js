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
                <Modal.Title>Popular Chains and Popular APIs / Streams</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0 }}>
                <StartersQueriesComponents />
            </Modal.Body>
            <Modal.Footer className="justify-content-between align-items-center">
                <small>
                    More APIs on <a className='bitquery-links-info' href="https://docs.bitquery.io/" target="_blank" rel="noopener noreferrer">Docs</a> and <a className='bitquery-links-info' href="https://t.me/bloxy_info" target="_blank" rel="noopener noreferrer">Telegram <i className="bi bi-telegram" /> Bitquery.io (Bloxy) Network</a>
                </small>
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
