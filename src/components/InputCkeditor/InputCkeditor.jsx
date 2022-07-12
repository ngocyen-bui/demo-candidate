
 import React from 'react';
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';

import Context from '@ckeditor/ckeditor5-core/src/context';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'; 

export function InputCkeditor (props){
    return (
        <div className="App">
        <CKEditorContext context={ Context }>
            <h2>Using the CKeditor 5 context feature in React</h2>
            <CKEditor
                editor={ ClassicEditor }
                config={ {
                    plugins: [ Paragraph, Bold, Italic, Essentials ],
                    toolbar: [ 'bold', 'italic' ]
                } }
                data="<p>Hello from the first editor working with the context!</p>"
                onReady={ editor => {
                    console.log( 'Editor1 is ready to use!', editor );
                } }
            />

            <CKEditor
                editor={ ClassicEditor }
                config={ {
                    plugins: [ Paragraph, Bold, Italic, Essentials ],
                    toolbar: [ 'bold', 'italic' ]
                } }
                data="<p>Hello from the first editor working with the context!</p>"
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log( 'Editor1 is ready to use!', editor );
                } }
            />
        </CKEditorContext> 
    </div>
    )
}