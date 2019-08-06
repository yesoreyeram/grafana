// @ts-ignore
import Plain from 'slate-plain-serializer';
import { Editor as SlateEditor } from 'slate';

import ClearPlugin from './clear';

describe('clear', () => {
  const handler = ClearPlugin().onKeyDown;

  it('does not change the empty value', () => {
    const value = Plain.deserialize('');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    handler(event as Event, editor, () => {});
    expect(Plain.serialize(editor.value)).toEqual('');
  });

  it('clears to the end of the line', () => {
    const value = Plain.deserialize('foo');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    handler(event as Event, editor, () => {});
    expect(Plain.serialize(editor.value)).toEqual('');
  });

  it('clears from the middle to the end of the line', () => {
    const value = Plain.deserialize('foo bar');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
    });
    handler(event as Event, editor.moveForward(4), () => {});
    expect(Plain.serialize(editor.value)).toEqual('foo ');
  });
});
