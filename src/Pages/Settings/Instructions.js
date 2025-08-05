import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Container, Card, CardBody, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getInstructionsAPI, saveInstructionsAPI } from '../../helpers/api_helper';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Instructions = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    getInstructionsAPI()
      .then(res => {
        if (res.status === 'success' && res.data && res.data.content) {
          const blocksFromHtml = htmlToDraft(res.data.content);
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
      const res = await saveInstructionsAPI('Instructions', contentHtml);
      if (res.status === 'success') {
        setMessage({ type: 'success', text: res.message || 'Treatment instructions saved successfully.' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to save treatment instructions.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save treatment instructions.' });
    }
    setSaving(false);
  };

  return (
    <div className="page-content no-navbar">
      <Container fluid={true}>
        <Breadcrumbs title="Smileie" breadcrumbItem="Settings" breadcrumbItem2="Treatment Instructions" />
        <Card>
          <CardBody>
            <h4 className="mb-3">Edit Treatment Instructions</h4>
            {loading ? (
              <div className="text-center py-5">Loading instructions...</div>
            ) : (
              <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                placeholder="Write treatment instructions here..."
              />
            )}
            <Button color="primary" className="mt-3" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Treatment Instructions"}
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

export default Instructions; 