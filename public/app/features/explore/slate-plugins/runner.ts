import { Editor as SlateEditor } from 'slate';

export default function RunnerPlugin({ handler }: any) {
  return {
    onKeyDown(event: Event, editor: SlateEditor, next: Function) {
      const keyboardEvent = event as KeyboardEvent;

      // Handle enter
      if (handler && keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
        // Submit on Enter
        keyboardEvent.preventDefault();
        handler(event);
        return true;
      }
      return next();
    },
  };
}
