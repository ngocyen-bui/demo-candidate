
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import React, { useEffect, useState } from 'react'; 
import UploadAdapter from './UploadAdapter';      
import { Button, Input } from 'antd';
  

export function InputCkeditor (props){  
    const showToolbar = props.function.handleIsShowToolbar;
    const updateData = props.function.handleSaveData;
    const type = props.data.key;
    const isShow = props.data.status;
    const enabled = props.data.enabled || false;
    const defaultValue = props.data.value;
    const isClearWhenSave = props.isClear;

    const [data, setData] = useState(defaultValue); 
    const [hasInput,setHasInput] = useState(!defaultValue);
    // const [value,setValue] = useState("");
    const [loading,setLoading] = useState(false);   
     

    const handleCancel = ()=>{
      setData(defaultValue);
      setHasInput(true);
      showToolbar(false, type)
    }
    const handleSave = ()=>{  
      updateData(data,type);
      setHasInput(!data);
      setLoading(true);

      if(isClearWhenSave){
        setData("");
        setHasInput(true);
      }
      setTimeout(() => {
        showToolbar(false, type);
        setLoading(false);  
      },1000)
    }
    const handleChange = (e)=>{ 
      setData(e);
    }  

    if(!data && hasInput){
      return <Input onFocus={()=>{
        showToolbar(true,type)
        setHasInput(false);
      }} 
        placeholder = {`Add content ${type}...`} 
      />
    } 
    return (
        <>
        <div style={{width: '100%', marginBottom: "20px"}}>
            <div className={isShow?"ckeditor-custom-toolbar":'ckeditor-custom-toolbar hide'}></div>
            <CKEditor   
                onReady={(editor) => { 
                    // editor.ui
                    // .getEditableElement()
                    // .parentElement.append(editor.ui.view.toolbar.element);   
                    const imageUploadEditing = editor.plugins.get( 'ImageUploadEditing' );

                    editor.ui.getEditableElement().parentElement.querySelector('.ckeditor-custom-toolbar').append(editor.ui.view.toolbar.element)  
                    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);  
                    if(enabled){
                      editor.enableReadOnlyMode(type);  
                    } 
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
                          },
                          {
                            name: "imageResize:100",
                            label: "100%",
                            value: "100"
                          }
                        ], 
                        toolbar: [
                          "imageStyle:alignLeft",
                          "imageStyle:alignCenter",
                          "imageStyle:alignRight", 
                          "|",
                          "toggleImageCaption",
                          "imageTextAlternative", 
                        ],  
                      }, 
                  }}
                data={data} 
                onChange={(event, editor) => {
                    const result = editor.getData();  
                    handleChange(result)
                  }}
                onBlur={(event, editor) => {
                // console.log("Blur.", editor);
                // console.log(Array.from(editor.ui.componentFactory.names()));  
                }}
                onFocus={(event, editor) => {
                  showToolbar(true,type);
                }}
            /> 
        </div>
        {isShow?
        <div className="ckeditor-wrapper" style={{float: "right"}}>
            <Button className='ckeditor-wrapper__btn ckeditor-wrapper__btn--cancel' onClick={handleCancel} >Cancel</Button>
            <Button className='ckeditor-wrapper__btn ckeditor-wrapper__btn--save' loading={loading} type="primary" onClick={handleSave}>Save</Button>
        </div>:<></>}
            
        </>
    );
}