import React, { useState, useRef, useEffect } from 'react';

const EditableText = ({ value, onSave, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() !== value) {
      onSave(text.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`editable-text-input ${className}`}
      />
    );
  }

  return (
    <span 
      className={`editable-text ${className}`}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {value}
    </span>
  );
};

export default EditableText;
