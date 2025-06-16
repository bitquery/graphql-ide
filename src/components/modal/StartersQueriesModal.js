import React from 'react'
import { observer } from 'mobx-react-lite'
import { Modal, Button } from 'react-bootstrap'
import StartersQueriesComponents from "../StartersQueriesComponents";
import modalStore from "../../store/modalStore";

const StartersQueriesModal = observer(({active}) => {
    if (!active) {
        return null
    }

    return (
        <>
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
            </Modal.Footer>
        </>
    )
})

export default StartersQueriesModal
