import { Editor as SlateEditor } from 'slate';
import { Plugin } from 'slate-react';

// Clears the rest of the line after the caret
export default function ClearPlugin(): Plugin {
  return {
    onKeyDown(event: Event, editor: SlateEditor, next: Function) {
      const value = editor.value;
      const keyboardEvent = event as KeyboardEvent;

      if (!value.selection.isCollapsed) {
        return next();
      }

      if (keyboardEvent.key === 'k' && keyboardEvent.ctrlKey) {
        keyboardEvent.preventDefault();
        const text = value.anchorText.text;
        const offset = value.selection.anchor.offset;
        const length = text.length;
        const forward = length - offset;
        editor.deleteForward(forward);
        return true;
      }

      return next();
    },
  };
}
