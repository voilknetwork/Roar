import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from "axios";

function ChatMessage({ socket }) {
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState("")


    const upload = (file, name = '') => {
        setProgress("Uploading file..")
        //bilal
        const formData = new FormData()

        let URIpost = "https://graphql.voilk.com/upload/files/"
        formData.append("photos", file)
    
        const config = {
            onUploadProgress: progressEvent => {
                let pr = (parseInt(progressEvent.loaded)/10000).toFixed(2)
                setProgress(pr + " %")
            }, // TO SHOW UPLOAD STATUS
            
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post(URIpost, formData, config, {
        }).then(res => {
            if(res.data.files[0]){

                let name = res.data.files[0].metadata.originalname;
                let url = res.data.files[0].metadata.fileurl;
                const image_md = `![${name}](${url})`;
                setMessage(message + " " + image_md)
                setProgress("100 %")
                setTimeout(() => {
                    setProgress("")
                }, 1000)
                
                // const { body } = this.state;
                // const { selectionStart, selectionEnd } = this.refs.postRef;
                // body.props.onChange(
                //     body.value.substring(0, selectionStart) +
                //         image_md +
                //         body.value.substring(selectionEnd, body.value.length)
                // );
                   
            }
            setTimeout(() => {
                setProgress("")
            }, 8000)

        })
    };

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // Do something with the files
        if (!acceptedFiles.length) {
            if (rejectedFiles.length) {
                setProgress("Only image files...")
                console.log('onDrop Rejected files: ', rejectedFiles);
            }
            return;
        }

        const file = acceptedFiles[0];
        upload(file, file.name);

    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    function sendMessage(msg) {
        if (msg)
            socket.emit("sendMessage", msg, (error) => {
            
                setMessage("")
                if(error){
                    alert(error)
                }
            })
    }
    return (
        <div class="typing-msg">
                    <form onSubmit={
                e => {
                    e.preventDefault()
                    sendMessage(message)
                }
            }>
                        <textarea type="text" name="message" value={message} placeholder="Type a message here"
                        onChange={e => {
                            setMessage(e.target.value)
                        }}
                    />
                        <button type="submit" onClick={
                        e => {
                            e.preventDefault()
                            sendMessage(message)
                        }
                    }><i class="fa fa-send"></i></button>
                    </form>
                    <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                        <p>Yep! just drop them here...</p> :
                    <p><i class="fa fa-camera"></i> Click or drag N drop images here {progress}</p>
                    }
                </div>
                    {/* <ul class="ft-options">
                        <li><a href="#" title=""><i class="la la-smile-o"></i></a></li>
                        <li><a href="#" title=""><i class="la la-camera"></i></a></li>
                        <li><a href="#" title=""><i class="fa fa-paperclip"></i></a></li>
                    </ul> */}
                </div>
    )
}

export default ChatMessage
