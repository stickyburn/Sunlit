import { format } from 'date-fns';
import { createSignal, onMount } from 'solid-js';
import EditPen from '~/assets/EditPen';
import Editor from '~/components/Homepad/Editor';
import { isEditing, toggleEdit } from '~/stores/editState';
import { Themes, theme } from '~/stores/theme';
import * as DB from '~/tmp/database';

export default function Home(props: any) {
  const [content, setContent] = createSignal('');
  const [_, setTags] = createSignal<string[]>([]);

  const saveContentToDB = async () => {
    await DB.postJournalDb(content());
  };

  const toggleStateAndSave = () => {
    if (isEditing()) saveContentToDB();
    toggleEdit();
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
      toggleStateAndSave();
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

  return (
    <main class="bg-background text-primary h-screen w-screen py-8 px-16 text-text-dark">
      <div class="flex justify-between mb-4">
        <h2 class="mt-4">{format(props?.date || Date.now(), 'MMM dd, yyyy')}</h2>
        <button
          classList={{
            'mt-2': true,
            'p-2': true,
            'text-xl': true,
            'rounded-full': true,
            'h-12': true,
            'w-12': true,
            flex: true,
            'items-center': true,
            'justify-center': true,
            outline: true,
            'outline-2': true,
            'outline-primary': true,
            'bg-primary': isEditing(),
            'text-background': isEditing()
          }}
          onClick={toggleStateAndSave}
        >
          {isEditing() ? (
            <EditPen fill={theme() === Themes.DARK ? '#30293D' : '#fedfff'} />
          ) : (
            <EditPen fill={theme() === Themes.DARK ? '#fedfff' : '#18543d'} />
          )}
        </button>
      </div>
      <Editor content={content} handleInput={handleInput} handleToggleEdit={handleToggleEdit} />
    </main>
  );
}
