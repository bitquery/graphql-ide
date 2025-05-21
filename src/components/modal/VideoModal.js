import React from 'react';
import { Modal, Button } from 'react-bootstrap';
const VideoModal = ({ show, onHide, src }) => (
    <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title>Point System Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
            <div style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}>
                <iframe
                    src={src}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        border: 0
                    }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
);

export default VideoModal;
