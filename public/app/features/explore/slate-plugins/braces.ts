import { Editor as SlateEditor } from 'slate';
import { Plugin } from 'slate-react';

const BRACES = new Map([['[', ']'], ['{', '}'], ['(', ')']]);

const NON_SELECTOR_SPACE_REGEXP = / (?![^}]+})/;

export default function BracesPlugin(): Plugin {
  return {
    onKeyDown(event: Event, editor: SlateEditor, next: Function) {
      const keyboardEvent = event as KeyboardEvent;
      const value = editor.value;
      if (!value.selection.isCollapsed) {
        return next();
      }

      switch (keyboardEvent.key) {
        case '{':
        case '[': {
          keyboardEvent.preventDefault();
          // Insert matching braces
          editor
            .insertText(`${keyboardEvent.key}${BRACES.get(keyboardEvent.key)}`)
            .moveBackward(1)
            .focus();
          return true;
        }

        case '(': {
          keyboardEvent.preventDefault();
          const text = value.anchorText.text;
          const offset = value.selection.anchor.offset;
          const delimiterIndex = text.slice(offset).search(NON_SELECTOR_SPACE_REGEXP);
          const length = delimiterIndex > -1 ? delimiterIndex + offset : text.length;
          const forward = length - offset;
          // Insert matching braces
          editor
            .insertText(keyboardEvent.key)
            .moveForward(forward)
            .insertText(BRACES.get(keyboardEvent.key))
            .moveBackward(forward + 1)
            .focus();
          return true;
        }

        case 'Backspace': {
          const text = value.anchorText.text;
          const offset = value.selection.anchor.offset;
          const previousChar = text[offset - 1];
          const nextChar = text[offset];
          if (BRACES.get(previousChar) && BRACES.get(previousChar) === nextChar) {
            keyboardEvent.preventDefault();
            // Remove closing brace if directly following
            editor
              .deleteBackward(1)
              .deleteForward(1)
              .focus();
            return true;
          }
        }

        default: {
          break;
        }
      }
      return next();
    },
  };
}
