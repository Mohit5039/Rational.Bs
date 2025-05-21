//sharebuttons js file 
document.addEventListener("DOMContentLoaded" , ()=>{
    const copyLinkBtn = document.querySelector('.share-btn[title="Copy Link"]') ;
    if(!copyLinkBtn) return ;
    copyLinkBtn.addEventListener('click' , async () => {
        try{
            await navigator.clipboard.writeText(window.location.href);
            alert("Blog link copied to clipboard!") ;
        }
        catch(err){
            console.error("failed to copy link :" , err);
            alert("Failed to copy the link . Please try again.") ;
        }
    }) ;
}) ;