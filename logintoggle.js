// 3d animation for flash card using css and js
function flipcard(){
            document.getElementById("flipcard").classList.toggle("flip-active");
        }
// about button popup screen close and open code    
function toggleAbout() {
            const modal = document.getElementById("about-modal");
            modal.classList.toggle("show");
          }
document.addEventListener("DOMContentLoaded", ()=>{
    const aboutBtn = document.querySelector(".about-btn");
    const modal = document.getElementById("about-modal");
    if(aboutBtn){
        aboutBtn.addEventListener("click", toggleAbout);
    }
    
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                toggleAbout();
            }
        });
    }
})

document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("about-modal");
    if (e.key === "Escape" && modal.classList.contains("show")) {
      modal.classList.remove("show");
    }
  });
          