import React, { useRef, useEffect } from 'react'
import styles from '../../pages/admin/Admin.module.scss'
import { Editor } from '@tinymce/tinymce-react';

const TextEditor = ({
    value,
    setData,
    element,
    elClass,
    type,
    Title,
    SetTitle,
    Seo,
    SetSeo,
    id,
    readonly
}) => {

    const editorRef = useRef(null);

    const log = () => {
        
        if (editorRef.current) {
            var content = editorRef.current.getContent({ format: 'text' });
            if (Title != null) {
                SetTitle(content);
            }
            if (Seo != null) {
                SetSeo(content);
            }
        }
    };

    return (
        <Editor
            onInit={(evt, editor) => {
                editorRef.current = editor
            }}
            disabled={readonly}
            value={`<${element} class="${elClass}">${value}</${element}>`}
            onEditorChange={(newValue, editor) => {
                if (id) {
                    setData(newValue, id)
                    id === "question" && log()
                    return true
                }
                setData(newValue)
                log()
            }}
            apiKey="to3w6hipgwq18hju4nl1yrp7we7lz3f9d9lg48hj7lm6d7fk"
            init={{
                menubar: false,
                inline: true,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 
                type === 'one' ? 
                'bold italic | alignleft aligncenter | ' + 'alignright alignjustify |' + 'link': 
                type === 'none' ? 
                '' :
                'bold italic underline | fontsizeselect | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'link',
                paste_as_text: true,
            }}
        />
    )
}

export default TextEditor