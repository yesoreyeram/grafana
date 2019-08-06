import { Editor as SlateEditor } from 'slate';
import { Plugin } from 'slate-react';

function getIndent(text: string) {
  let offset = text.length - text.trimLeft().length;
  if (offset) {
    let indent = text[0];
    while (--offset) {
      indent += text[0];
    }
    return indent;
  }
  return '';
}

export default function NewlinePlugin(): Plugin {
  return {
    onKeyDown(event: Event, editor: SlateEditor, next: Function) {
      const keyboardEvent = event as KeyboardEvent;
      const value = editor.value;

      if (!value.selection.isCollapsed) {
        return next();
      }

      if (keyboardEvent.key === 'Enter' && keyboardEvent.shiftKey) {
        keyboardEvent.preventDefault();

        const { startBlock } = value;
        const currentLineText = startBlock.text;
        const indent = getIndent(currentLineText);

        return editor
          .splitBlock()
          .insertText(indent)
          .focus();
      }

      return next();
    },
  };
}
