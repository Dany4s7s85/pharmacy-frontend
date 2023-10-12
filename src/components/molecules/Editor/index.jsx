import React, { useState, useEffect } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import Label from '../../atoms/Label';
import 'suneditor/dist/css/suneditor.min.css';

export default function Editor({ htmlContent, onEditorChange, title, onChange, name, required }) {
  const [html, setHtml] = useState('');
  const handleChange = content => {
    onEditorChange(content);
    onChange({ target: { value: content, name } });
  };
  useEffect(() => {
    if (htmlContent) {
      setHtml(htmlContent);
    } else {
      setHtml('');
    }
  }, [htmlContent]);

  const customButtonList = [
    ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
    ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
    ['link', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'save'],
  ];
  return (
    <div>
      <Label required={required}>{title || 'Contents(*)'} </Label>
      <SunEditor
        setOptions={{
          height: '100%',
          width: '100%',
          minHeight: '400',
          buttonList: title === 'Answer' ? customButtonList : buttonList.complex,
        }}
        onChange={handleChange}
        setContents={html}
      />
    </div>
  );
}
