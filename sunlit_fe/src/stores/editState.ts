import { createSignal } from 'solid-js';

const [isEditing, toggleIsEditing] = createSignal(false);

const toggleEdit = () => {
  toggleIsEditing(!isEditing());
};

export { isEditing, toggleEdit };
