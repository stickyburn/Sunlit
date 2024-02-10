/* eslint-disable solid/no-innerhtml */
import { Component, Match, Switch, createEffect, createSignal, onCleanup } from 'solid-js';
import { marked } from 'marked';
import { isEditing } from '~/stores/editState';

interface EditorProps {
  date?: Date;
  title?: string;
  content: () => string;
  handleInput: (e: InputEvent) => void;
  handleToggleEdit: (e: KeyboardEvent) => void;
}

const Editor: Component<EditorProps> = (props) => {
  const [editorRef, setEditorRef] = createSignal<HTMLTextAreaElement | null>(null);

  createEffect(() => {
    if (isEditing() && editorRef()) {
      editorRef()?.focus();
    }
  });

  window.addEventListener('keydown', props.handleToggleEdit);
  onCleanup(() => window.removeEventListener('keydown', props.handleToggleEdit));

  return (
    <Switch fallback={<div>Loading</div>}>
      <Match when={isEditing()}>
        <textarea
          class="w-full h-96 p-2 text-primary text-lg outline outline-1 outline-primary bg-background rounded-lg"
          onInput={(e) => props.handleInput(e)}
          ref={setEditorRef}
          value={props.content()}
        />
      </Match>

      <Match when={!isEditing()}>
        <div class="w-full h-full" innerHTML={marked.parse(props.content()).toString()} />
      </Match>
    </Switch>
  );
};

export default Editor;
