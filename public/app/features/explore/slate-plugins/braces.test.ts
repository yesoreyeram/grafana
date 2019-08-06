// @ts-ignore
import Plain from 'slate-plain-serializer';
import { Editor as SlateEditor } from 'slate';

import BracesPlugin from './braces';

declare global {
  interface Window {
    KeyboardEvent: any;
  }
}

describe('braces', () => {
  const handler = BracesPlugin().onKeyDown;
  const nextMock = () => {};

  it('adds closing braces around empty value', () => {
    const value = Plain.deserialize('');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', { key: '(' });
    handler(event as Event, editor, nextMock);
    expect(Plain.serialize(editor.value)).toEqual('()');
  });

  it('adds closing braces around a value', () => {
    const value = Plain.deserialize('foo');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', { key: '(' });
    handler(event as Event, editor, nextMock);
    expect(Plain.serialize(editor.value)).toEqual('(foo)');
  });

  it('adds closing braces around the following value only', () => {
    const value = Plain.deserialize('foo bar ugh');
    const editor = new SlateEditor({ value });
    let event;
    event = new window.KeyboardEvent('keydown', { key: '(' });
    handler(event as Event, editor, nextMock);
    expect(Plain.serialize(editor.value)).toEqual('(foo) bar ugh');

    // Wrap bar
    event = new window.KeyboardEvent('keydown', { key: '(' });
    handler(event as Event, editor.moveForward(5), nextMock);
    expect(Plain.serialize(editor.value)).toEqual('(foo) (bar) ugh');

    // Create empty parens after (bar)
    event = new window.KeyboardEvent('keydown', { key: '(' });
    handler(event as Event, editor.moveForward(4), nextMock);
    expect(Plain.serialize(editor.value)).toEqual('(foo) (bar)() ugh');
  });

  it('adds closing braces outside a selector', () => {
    const value = Plain.deserialize('sumrate(metric{namespace="dev", cluster="c1"}[2m])');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', { key: '(' });
    handler(event as Event, editor.moveForward(3), nextMock);
    expect(Plain.serialize(editor.value)).toEqual('sum(rate(metric{namespace="dev", cluster="c1"}[2m]))');
  });

  it('removes closing brace when opening brace is removed', () => {
    const value = Plain.deserialize('time()');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    handler(event as Event, editor.moveForward(5), nextMock);
    expect(Plain.serialize(editor.value)).toEqual('time');
  });

  it('keeps closing brace when opening brace is removed and inner values exist', () => {
    const value = Plain.deserialize('time(value)');
    const editor = new SlateEditor({ value });
    const event = new window.KeyboardEvent('keydown', { key: 'Backspace' });
    const handled = handler(event as Event, editor.moveForward(5), nextMock);
    expect(handled).toBeFalsy();
  });
});
