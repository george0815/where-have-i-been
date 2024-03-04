import { React, useState, useEffect } from 'react'; //React


export default function Imagetest(){


  let temp = JSON.parse(localStorage.getItem("photo"));


    const [testPhoto, setTestPhoto] = useState(temp);



    function addPhotoAlbum(){
        
        let fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        getBase64(file).then( data => addPhoto(data));

    }

    
    useEffect( () => {
      if(JSON.parse(localStorage.getItem("photo"))){
        setTestPhoto(JSON.parse(localStorage.getItem("photo")))
      }
    },[testPhoto])




function addPhoto(src){

    let tempPhoto = testPhoto;
    tempPhoto.img ="data:image/png;base64," + src   

    setTestPhoto(tempPhoto);
    localStorage.setItem('photo', JSON.stringify(testPhoto));

}



    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
            if ((encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
          };
          reader.onerror = error => reject(error);
        });
      }





      
    return (
   
        <>

<           input onChange={addPhotoAlbum} id="fileInput" type="file" multiple />
            <img id="img" key={testPhoto.img} src={testPhoto.img} width={300} height={300}/>
        
        </>
    
    )

}





