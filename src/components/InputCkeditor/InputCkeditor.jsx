
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import React, { useState } from 'react'; 
import UploadAdapter from './UploadAdapter';      
import { Button } from 'antd';
  

export function InputCkeditor (props){
    const title = props.title;
    const showToolbar = props.showToolbar;
    const isShow = props.isShow;
    const [data, setData] = useState("");
    const [hideToolbar, setHideToolbar] = useState(false); 
    return (
        <>
        <h3>{title}</h3>
        <div style={{width: '100%'}}>
            <div className={isShow?"ckeditor-custom-toolbar":'ckeditor-custom-toolbar hide'}></div>
            <CKEditor   
                onReady={(editor) => { 
                    // editor.ui
                    // .getEditableElement()
                    // .parentElement.append(editor.ui.view.toolbar.element);   
                    editor.ui.getEditableElement().parentElement.querySelector('.ckeditor-custom-toolbar').append(editor.ui.view.toolbar.element)
                    // console.log(editor.ui.getEditableElement().parentElement.querySelector('.ckeditor-custom-toolbar'));

                    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
                    new UploadAdapter(loader);
                }}
                editor={DecoupledcEditor}
                config={{  
                    toolbar:{
                        items:[
                            "heading","|", 
                            "fontsize","|",
                            "bold","italic","underline","strikethrough","|",
                            'alignment',"|",
                            "bulletedList","numberedList","|", 
                            'indent','outdent',"|",
                            "link","blockQuote","imageUpload","insertTable","mediaEmbed","|",
                            "undo","redo"
                          ], 
                    },
                    image: { 
                        styles: ["alignLeft", "alignCenter", "alignRight"],
                        sizes: ["50%", "75%", "100%"], 
                        resizeOptions: [
                          {
                            name: "imageResize:original",
                            label: "Original",
                            value: null
                          },
                          {
                            name: "imageResize:50",
                            label: "50%",
                            value: "50"
                          },
                          {
                            name: "imageResize:75",
                            label: "75%",
                            value: "75"
                          }
                        ], 
                        toolbar: [
                          "imageStyle:alignLeft",
                          "imageStyle:alignCenter",
                          "imageStyle:alignRight",
                          "|",
                          "imageResize",
                          "|",
                          "imageTextAlternative", 
                        ]
                      }, 
                  }}
                data={""} 
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setData(data);
                    console.log({ event, editor, data });
                  }}
                onBlur={(event, editor) => {
                // console.log("Blur.", editor);
                // console.log(Array.from(editor.ui.componentFactory.names())); 
                return editor.disableReadOnlyMode()
                }}
                onFocus={(event, editor) => {
                  showToolbar(true);
                }}
            /> 
        </div>
            <div className="ckeditor-wrapper" style={{float: "right"}}>
                <Button className='ckeditor-wrapper__btn ckeditor-wrapper__btn--cancel' onClick={()=>showToolbar(false)} >Cancel</Button>
                <Button className='ckeditor-wrapper__btn ckeditor-wrapper__btn--save' type="primary">Save</Button>
            </div>
        </>
    );
}