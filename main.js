
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZzFL1Gnr8eRI09lVt2h0Lh5JSzNEI-LA",
    authDomain: "exhibitio-8945c.firebaseapp.com",
    databaseURL: "https://exhibitio-8945c-default-rtdb.firebaseio.com",
    projectId: "exhibitio-8945c",
    storageBucket: "exhibitio-8945c.appspot.com",
    messagingSenderId: "135242412563",
    appId: "1:135242412563:web:0b045f92e079f778eec5e6",
    measurementId: "G-T4VPWCE5ZP"
  };

  firebase.initializeApp(firebaseConfig)

  const database = firebase.database()

 






// get all post cards form the dom 
const postCards = document.querySelectorAll(".participants_wrapper .post_card")

postCards.forEach((card,index)=>{

   
   // get the postCard id 
   const postId = card.getAttribute("data-id")
   const postImage = card.querySelector(".post_image img").src
  
    // select the like button from each cards 
   const likeBtn = card.querySelector(".likeBtn")
         likeBtn.setAttribute("data-id",postCards)
 
   // select the share button from each cards 
   const shareBtn = card.querySelector(".shareBtn")

   // select the html element that will displayt the amount of like number
  const displayNumLike = card.querySelector(".display-num-like")



  // get the post comment button,the input.
  const postComment = card.querySelector(".post-comment-section .postComment")
  const inputComment = card.querySelector(".post-comment-section .inputComment")




 // like function,save post id in the db,and the current like number
  likeBtn.addEventListener("click",()=>{
      let currentNumLikes = parseInt(displayNumLike.textContent)
     
      const likeRef = database.ref(`post/${postId}/like`)
      const imageRef = database.ref(`post/${postId}/image`)
  

    if (likeBtn.classList.contains("active")) {
        likeBtn.classList.remove("active")
        // prevent the number of like to drecremented from -1
      if (currentNumLikes <= 0) {
        
      } else {
        currentNumLikes--
        displayNumLike.textContent = currentNumLikes
        likeRef.update({ like : currentNumLikes })
        imageRef.update({postImage : postImage})
      }
  
    } else {
        likeBtn.classList.add("active")
         currentNumLikes++
         displayNumLike.textContent = currentNumLikes
         likeRef.update({ like : currentNumLikes })
         imageRef.update({postImage : postImage})
    }

     })



  // push comments in the db 

postComment.addEventListener("click",()=>{
  const commentRef = database.ref(`post/${postId}/comment`)
  const commentValue = inputComment.value
        commentRef.push({comment : commentValue,sender : "john doe" })
       
    
})





})