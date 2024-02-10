/* eslint-disable solid/no-innerhtml */
import { Component, Match, Switch, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { marked } from 'marked';
import * as DB from '../../tmp/database';
import { format } from 'date-fns';

interface EditorProps {
  date?: Date;
  title?: string;
}

const Editor: Component<EditorProps> = (props) => {
  const [content, setContent] = createSignal('');
  const [isEditing, toggleIsEditing] = createSignal(false);
  const [editorRef, setEditorRef] = createSignal<HTMLTextAreaElement | null>(null);

  const loadDataFromDB = async () => {
    const data = await DB.getDb(props.date?.toString() || format(Date.now(), 'yyyy-MM-dd'));
    setContent(data || '');
  };

  const saveContentToDB = async () => {
    console.log('saving', content());
    await DB.postJournalDb(content());
  };

  const toggleEdit = () => {
    if (isEditing()) {
      saveContentToDB();
    }
    toggleIsEditing(!isEditing());
  };

  const handleToggleEdit = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      toggleEdit();
    }
  };

  createEffect(() => {
    if (isEditing() && editorRef()) {
      editorRef()?.focus();
    }
  });

  onMount(() => {
    loadDataFromDB();
  });

  window.addEventListener('keydown', handleToggleEdit);
  onCleanup(() => window.removeEventListener('keydown', handleToggleEdit));

  return (
    <div class="py-6 px-12">
      <Switch fallback={<div>Loading</div>}>
        <Match when={isEditing()}>
          <button class="mb-8 text-xl" onClick={toggleEdit}>
            Editing
          </button>
          <textarea
            class="w-full h-72 p-2 text-white text-lg outline outline-1 outline-text-dark bg-background-dark"
            style={{ margin: '0', 'box-sizing': 'border-box' }}
            onInput={(e) => setContent(e.currentTarget.value)}
            ref={setEditorRef}
            value={content()}
          />
        </Match>

        <Match when={!isEditing()}>
          <button class="mb-8 text-xl" onClick={toggleEdit}>
            Preview
          </button>
          <div
            class="w-full h-full p-2 rounded-md"
            innerHTML={marked.parse(content()).toString()}
          />
        </Match>
      </Switch>
    </div>
  );
};

export default Editor;
