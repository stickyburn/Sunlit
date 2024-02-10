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
  const [tags, setTags] = createSignal<string[]>([]);
  const [isEditing, toggleIsEditing] = createSignal(false);
  const [editorRef, setEditorRef] = createSignal<HTMLTextAreaElement | null>(null);

  const saveContentToDB = async () => {
    await DB.postJournalDb(content());
  };

  const toggleEdit = () => {
    if (isEditing()) {
      saveContentToDB();
    }
    toggleIsEditing(!isEditing());
  };

  const updateTagsFromContent = (textContent: string) => {
    // tags are #example or #example-tag
    // remove ##.. but include everything else
    const tagPattern = /#[^\s#]+/g;
    const foundTags = textContent.match(tagPattern) || [];
    setTags(foundTags);
  };

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setContent(target.value);
    updateTagsFromContent(target.value);
  };

  const handleToggleEdit = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      toggleEdit();
    }
  };

  onMount(() => {
    const loadDataFromDb = async () => {
      const data = await DB.getDb(props.date?.toString() || format(Date.now(), 'yyyy-MM-dd'));
      setContent(data || '');
      updateTagsFromContent(data || '');
    };

    loadDataFromDb();
  });

  createEffect(() => {
    if (isEditing() && editorRef()) {
      editorRef()?.focus();
    }
  });

  window.addEventListener('keydown', handleToggleEdit);
  onCleanup(() => window.removeEventListener('keydown', handleToggleEdit));

  return (
    <div class="py-6 px-12">
      <div class="flex justify-between mb-4">
        <h2>{format(props?.date || Date.now(), 'MMM dd, yyyy')}</h2>
        <button class="text-xl min-w-36 rounded-md outline outline-1" onClick={toggleEdit}>
          {isEditing() ? 'Preview' : 'Edit'}
        </button>
      </div>
      <Switch fallback={<div>Loading</div>}>
        <Match when={isEditing()}>
          <textarea
            class="w-full h-96 mt-4 p-2 text-white text-lg outline outline-1 outline-text-dark bg-background-dark"
            onInput={handleInput}
            ref={setEditorRef}
            value={content()}
          />
        </Match>

        <Match when={!isEditing()}>
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
