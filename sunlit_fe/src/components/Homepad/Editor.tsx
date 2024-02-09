/* eslint-disable solid/no-innerhtml */
import { Match, Switch, createEffect, createSignal, onCleanup } from 'solid-js';
import { marked } from 'marked';

export default function Editor() {
  const [content, setContent] = createSignal(localStorage.getItem('day-1-content') || '');
  const [isEditing, toggleIsEditing] = createSignal(true);
  const [editorRef, setEditorRef] = createSignal<HTMLTextAreaElement | null>(null);

  const saveContentToLocalStorage = () => {
    localStorage.setItem('day-1-content', content());
  };

  const toggleEdit = () => toggleIsEditing(!isEditing());

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

  window.addEventListener('keydown', handleToggleEdit);
  onCleanup(() => window.removeEventListener('keydown', handleToggleEdit));

  return (
    <div class="p-10">
      <Switch fallback={<div>Loading</div>}>
        <Match when={isEditing()}>
          <p class="mb-8 text-xl">Editing</p>
          <textarea
            class="w-full h-full p-2 text-black"
            style={{ margin: '0', 'box-sizing': 'border-box' }}
            onInput={(e) => setContent(e.currentTarget.value)}
            ref={setEditorRef}
            value={content()}
          />

          <button class="my-12 outline p-2 rounded-md" onClick={saveContentToLocalStorage}>
            Savey
          </button>
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
}
