import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Container, Card, CardBody, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { getAlignerTipsAPI, saveAlignerTipsAPI } from '../../helpers/api_helper';

const PAGE_TITLE = 'Aligner Maintenance & Tips';
const PAGE_SLUG = 'aligner-maintenance-tips';

const AlignerTips = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    getAlignerTipsAPI()
      .then(res => {
        // Support both possible response shapes
        const status = res.data?.status || res.status;
        const content = res.data?.data?.content || res.data?.content || res.content;
        if (status === 'success' && content) {
          const blocksFromHtml = htmlToDraft(content);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
          setEditorState(EditorState.createWithContent(contentState));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    try {
      const res = await saveAlignerTipsAPI(PAGE_TITLE, contentHtml);
      const status = res.data?.status || res.status;
      const message = res.data?.message || res.message;
      if (status === 'success') {
        setMessage({ type: 'success', text: message || 'Tips saved successfully.' });
      } else {
        setMessage({ type: 'error', text: message || 'Failed to save tips.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save tips.' });
    }
    setSaving(false);
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs title="Smileie" breadcrumbItem="Settings" breadcrumbItem2="Aligner Maintenance & Tips" />
        <Card>
          <CardBody>
            <h4 className="mb-3">Edit Aligner Maintenance & Tips</h4>
            {loading ? (
              <div className="text-center py-5">Loading tips...</div>
            ) : (
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                placeholder="Write aligner maintenance tips here..."
              />
            )}
            <Button color="primary" className="mt-3" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Tips"}
            </Button>
            {message && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mt-3`}>
                {message.text}
              </div>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AlignerTips; 