import React, { useEffect, useRef, useState } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../actions';


const Editor = ({ socketRef, roomId, onCodeChange }) => {

    const editorRef = useRef(null)

    useEffect(() => {

        async function initEditor() {
            editorRef.current = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
                mode: {
                    name: 'javascript',
                    json: true
                },
                theme: 'monokai',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true
            })

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes
                const code = instance.getValue()
                onCodeChange(code)

                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code
                    })
                }
            })
        }

        initEditor()

        return () => {
            socketRef.current?.off(ACTIONS.CODE_CHANGE)
        }

    }, [])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code)
                }
            })
        }
    }, [socketRef.current])

    return (
        <>
            <textarea id="code-editor"></textarea>
        </>
    )
}

export default Editor