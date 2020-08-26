import React, { Component } from 'react';
import { Modal } from './Modal';
import { Button } from './../Button/Button';
import { JSONFormatter } from './../JSONFormatter/JSONFormatter';

const getJsonObjectFromString = (input: any): any => {
  let output: any = JSON.stringify(input || '');
  try {
    output = JSON.parse(input);
  } catch {} // ignore errors
  return output;
};
const getTruncatedString = (input: string, length = 20): string => {
  input = (input || '').trim();
  if (input.length > length) {
    return input.substring(0, length) + '...';
  }
  return input;
};

type DataLinkModalPropsModalDisplayMode = 'html' | 'json' | 'plain_text';
type DataLinkModalPropsFieldDisplayMode = 'truncated_text' | 'button';
interface DataLinkModalProps {
  fieldDisplayMode: DataLinkModalPropsFieldDisplayMode;
  modalDisplayMode: DataLinkModalPropsModalDisplayMode;
  modalTitle: string;
  modalContent: string;
}
interface State {
  showCellModal: boolean;
}

export class DataLinkModal extends Component<DataLinkModalProps, State> {
  state = {
    showCellModal: false,
  };
  showCellModal(show: boolean) {
    this.setState({ showCellModal: show });
  }
  render() {
    const modalDisplayMode: DataLinkModalPropsModalDisplayMode = this.props.modalDisplayMode || 'plain_text';
    const fieldDisplayMode: DataLinkModalPropsFieldDisplayMode = this.props.fieldDisplayMode || 'truncated_text';
    const modalTitle = this.props.modalTitle || 'Details';
    let fieldDisplayContent: any;
    switch (fieldDisplayMode) {
      case 'button':
        fieldDisplayContent = (
          <Button className="btn-small" variant="secondary" onClick={() => this.showCellModal(true)}>
            {modalTitle}
          </Button>
        );
        break;
      case 'truncated_text':
      default:
        fieldDisplayContent = <a>{getTruncatedString(this.props.modalTitle)}</a>;
        break;
    }
    const modalContent = this.props.modalContent || '';
    let modalDisplayContent: any;
    switch (modalDisplayMode) {
      case 'html':
        modalDisplayContent = <div dangerouslySetInnerHTML={{ __html: modalContent }}></div>;
        break;
      case 'json':
        modalDisplayContent = <JSONFormatter json={getJsonObjectFromString(modalContent)} open={4} />;
        break;
      case 'plain_text':
      default:
        modalDisplayContent = <div>{modalContent}</div>;
    }
    return (
      <div>
        <span onClick={() => this.showCellModal(true)}>{this.props.children || fieldDisplayContent}</span>
        <Modal
          title={modalTitle || 'Details'}
          isOpen={this.state.showCellModal}
          onDismiss={() => this.showCellModal(false)}
        >
          {modalDisplayContent}
        </Modal>
      </div>
    );
  }
}
