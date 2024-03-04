import { React } from 'react'; //React


export default function Imagetest(){

    var base64String = "";

    function addPhotoAlbum(){
        
        let fileInput = document.getElementById("fileInput");

        const file = fileInput.files[0];
        getBase64(file).then(
        data => document.getElementById('img').src = "data:image/png;base64," + data);


        //test with local storage
    
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
            <img id="img" width={300} height={300}/>
        
        </>
    
    )

}





