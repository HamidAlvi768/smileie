import React, { useState } from 'react';
import { Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap';

const mockImages = [
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_1.jpg'),
];

const mockObservations = {
  alert: [
    'Noticeable unseat still present: 2.2 (ignored), 3.1, 4.1',
  ],
  warning: [
    'Slight unseat still present: 3.3, 3.4, 3.6',
    'Noticeable unseat: 3.2, 4.2',
  ],
  silent: [
    'Persistent buccal dental calculus: 2.1, 3.1, 3.2, 4.1, 4.2, 4.3',
    'Slight gingivitis still present: Upper, Lower',
    'Spots on teeth still present (Brown spot): Upper, Lower',
  ],
  info: [],
  generalGoals: ['No Information'],
  anteroposterior: [],
  transverse: [],
  vertical: [],
};

const mockIndices = {
  overbite: '-',
  overjet: '-',
  midlineDeviation: '-',
  right: { molar: '-', cuspid: '-' },
  left: { molar: '-', cuspid: '-' },
};

const ImageViewer = ({ images, onSendPhoto, onSendVideo }) => {
  // For now, always select the first image as main (can be made dynamic later)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, minHeight: 400 }}>
      {/* Main Image and actions */}
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 8 }}>
        <img
          src={images[0]}
          alt="Main intraoral"
          style={{ width: 520, height: 390, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee', background: '#fff' }}
        />
        {/* Action buttons below image */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 24, marginTop: 18, justifyContent: 'center' }}>
          <button type="button" style={{ background: 'none', border: 'none', color: '#16b1c7', fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0 }} onClick={onSendPhoto}>
            <i className="mdi mdi-camera-outline" style={{ fontSize: 22, marginRight: 6 }}></i>
            Send photo
          </button>
          <button type="button" style={{ background: 'none', border: 'none', color: '#16b1c7', fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0 }} onClick={onSendVideo}>
            <i className="mdi mdi-video-outline" style={{ fontSize: 22, marginRight: 6 }}></i>
            Send video
          </button>
        </div>
      </div>
      {/* Thumbnails on the right */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', marginLeft: 16 }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            style={{ width: 100, height: 75, objectFit: 'cover', borderRadius: 6, border: idx === 0 ? '3px solid #16b1c7' : '1px solid #eee', boxShadow: idx === 0 ? '0 0 0 2px #e0f7fa' : 'none', background: '#fff' }}
          />
        ))}
      </div>
    </div>
  );
};

const ObservationsGoals = ({ obs }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ marginBottom: 8 }}>
      <h5>Goal(s)</h5>
      <ul>{obs.generalGoals.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
    <h5>Observation(s)</h5>
    <div style={{ marginBottom: 8 }}>
      <strong style={{ color: '#e74c3c' }}>Alert</strong>
      <ul>{obs.alert.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
    <div style={{ marginBottom: 8 }}>
      <strong style={{ color: '#f39c12' }}>Warning</strong>
      <ul>{obs.warning.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
    <div style={{ marginBottom: 8 }}>
      <strong style={{ color: '#888' }}>Silent</strong>
      <ul>{obs.silent.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
    {obs.info.length > 0 && (
      <div style={{ marginBottom: 8 }}>
        <strong>Info</strong>
        <ul>{obs.info.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
    )}
    {/* Add Anteroposterior, Transverse, Vertical if needed */}
  </div>
);

const IndicesPanel = ({ indices }) => (
  <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafbfc', minWidth: 260 }}>
    <h6 style={{ fontWeight: 600, marginBottom: 12 }}>Indices</h6>
    {/* Indices Table */}
    <table style={{ width: '100%', fontSize: 14, marginBottom: 18 }}>
      <tbody>
        <tr>
          <td style={{ fontWeight: 500 }}>Overbite</td>
          <td style={{ textAlign: 'right' }}>-</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 500 }}>Overjet</td>
          <td style={{ textAlign: 'right' }}>-</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 500 }}>Midline deviation</td>
          <td style={{ textAlign: 'right' }}>-</td>
        </tr>
      </tbody>
    </table>
    <h6 style={{ fontWeight: 600, marginBottom: 8, marginTop: 8 }}>Occlusions</h6>
    {/* Occlusions Table */}
    <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ fontWeight: 500, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}></th>
          <th style={{ fontWeight: 500, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Right</th>
          <th style={{ fontWeight: 500, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>Left</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ fontWeight: 500, textAlign: 'left' }}>Molar</td>
          <td style={{ textAlign: 'center' }}>-</td>
          <td style={{ textAlign: 'center' }}>-</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 500, textAlign: 'left' }}>Cuspid</td>
          <td style={{ textAlign: 'center' }}>-</td>
          <td style={{ textAlign: 'center' }}>-</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Monitoring = ({ patient }) => {
  const [sendPhotoModal, setSendPhotoModal] = useState(false);
  const [sendVideoModal, setSendVideoModal] = useState(false);
  const [quickReply, setQuickReply] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('2025-05-27');
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [videoQuickReply, setVideoQuickReply] = useState('');
  const [videoMessage, setVideoMessage] = useState('');
  const [addTodo, setAddTodo] = useState(false);
  const [todoDueDate, setTodoDueDate] = useState('2025-05-27');
  const quickReplies = [
    '',
    'Please use chewies for better aligner fit',
    'Please send a new scan',
    'Please schedule your next appointment',
  ];

  return (
    <div className="monitoring-section" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {/* Image Viewer and Panels in a Card */}
      <Card style={{ flex: '0 0 auto', minWidth: '100%', maxWidth: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderRadius: 16 }}>
        <CardBody>
          <ImageViewer images={mockImages} onSendPhoto={() => setSendPhotoModal(true)} onSendVideo={() => setSendVideoModal(true)} />
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <ObservationsGoals obs={mockObservations} />
            </div>
            <div style={{ minWidth: 260, maxWidth: 320 }}>
              <IndicesPanel indices={mockIndices} />
            </div>
          </div>
        </CardBody>
      </Card>
      {/* Right: Placeholder for additional details or content */}
      <div style={{ flex: 1, minWidth: 320 }}>
        <div className="card">
          <div className="card-body">
            <p>Monitoring content will go here</p>
          </div>
        </div>
      </div>
      {/* Send Photo Modal */}
      <Modal isOpen={sendPhotoModal} toggle={() => setSendPhotoModal(false)} centered size="lg">
        <ModalHeader toggle={() => setSendPhotoModal(false)}>
          Write a message to send to your patient {patient?.name || '[Name]'}
        </ModalHeader>
        <ModalBody style={{ minWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img src={mockImages[0]} alt="Intraoral" style={{ width: 320, height: 240, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
            <div>
              <a href="#" style={{ color: '#888', fontSize: 15, textDecoration: 'underline', marginTop: 8, display: 'inline-block' }}>Annotate picture</a>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Label className="fw-bold mb-2">Write your message</Label>
            <Input type="select" value={quickReply} onChange={e => setQuickReply(e.target.value)} className="mb-2">
              {quickReplies.map((qr, idx) => (
                <option key={idx} value={qr}>{qr ? qr : 'Select a quick reply'}</option>
              ))}
            </Input>
            <Input type="textarea" rows="3" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." />
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
            <FormGroup check className="mb-2">
              <Input
                type="checkbox"
                id="send-photo-schedule-later"
              />
              <Label for="send-photo-schedule-later" check style={{ marginLeft: 8, fontWeight: 500 }}>
                Send this message later
              </Label>
            </FormGroup>
            <div style={{ display: 'flex', width: '100%', gap: 12, marginTop: 8 }}>
              <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={{ flex: 3, minWidth: 0 }} />
              <Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} style={{ flex: 2, minWidth: 0 }} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setSendPhotoModal(false)}>Cancel</Button>
          <Button color="primary" onClick={() => setSendPhotoModal(false)}>Send</Button>
        </ModalFooter>
      </Modal>
      {/* Send Video Modal */}
      <Modal isOpen={sendVideoModal} toggle={() => setSendVideoModal(false)} centered size="lg">
        <ModalHeader toggle={() => setSendVideoModal(false)}>
          Send a video message to {patient?.name || '[Name]'}
        </ModalHeader>
        <ModalBody style={{ minWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <Label className="fw-bold mb-2">Instruction</Label>
            <Input type="select" value={videoQuickReply} onChange={e => setVideoQuickReply(e.target.value)} className="mb-2">
              {quickReplies.map((qr, idx) => (
                <option key={idx} value={qr}>{qr ? qr : 'Select a quick reply'}</option>
              ))}
            </Input>
            <Input type="textarea" rows="3" value={videoMessage} onChange={e => setVideoMessage(e.target.value)} placeholder="Type your instruction..." />
          </div>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
            <FormGroup check className="mb-2">
              <Input
                type="checkbox"
                id="send-video-add-todo"
                checked={addTodo}
                onChange={e => setAddTodo(e.target.checked)}
              />
              <Label for="send-video-add-todo" check style={{ marginLeft: 8, fontWeight: 500 }}>
                Add to the To-do List
              </Label>
            </FormGroup>
            <div style={{ display: 'flex', width: '100%', gap: 12, marginTop: 8 }}>
              <Input type="date" value={todoDueDate} onChange={e => setTodoDueDate(e.target.value)} style={{ flex: 1, minWidth: 0 }} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={() => setSendVideoModal(false)}>Cancel</Button>
          <Button color="primary" onClick={() => setSendVideoModal(false)}>Send</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Monitoring; 