
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

  const auth = firebase.auth()








// get all post cards form the dom 
const postCards = document.querySelectorAll(".participants_wrapper .post_card")

postCards.forEach((card,index)=>{

   
   // get the postCard id 
   const postId = card.getAttribute("data-id")
   const postImage = card.querySelector(".post_image img").src
  
    // select the like button from each cards 
   const likeBtn = card.querySelector(".likeBtn")
         likeBtn.setAttribute("data-id",postId)
 
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
      const postKey = likeBtn.getAttribute("data-id")
      let userId = ''

      const likeRef = database.ref(`post/${postId}/like`)
      const imageRef = database.ref(`post/${postId}/image`)
     

     

      auth.onAuthStateChanged((user)=>{
        
        if (user) {

         userId = auth.currentUser.uid

         const mailVerified = auth.currentUser

         if (mailVerified && mailVerified.emailVerified) {
         
          const userLikeRef = database.ref(`liked/${userId}/${postKey}`)
          
          if (likeBtn.classList.contains("active")) {
            likeBtn.classList.remove("active")
          if (currentNumLikes <= 0) {
            
          } else {
            currentNumLikes--
            displayNumLike.textContent = currentNumLikes
            likeRef.update({ like : currentNumLikes })
            imageRef.update({postImage : postImage})

            database.ref(`liked/${userId}/`).child(postKey).remove()
          
          
                  
          }
      
        } else {
            likeBtn.classList.add("active")
             currentNumLikes++
             displayNumLike.textContent = currentNumLikes
             likeRef.update({ like : currentNumLikes })
             imageRef.update({postImage : postImage})

             userLikeRef.set({
              liked : postId,
              image : postImage
             })
        }



       
         } else {
           console.log("email not verified");
           alert("please verified your mail address,before liking post")
           return
         }


      
       

        } else {
          console.log("create an account to like post")
        }


      })
   

     })



  // push comments in the db 

postComment.addEventListener("click",()=>{
  let senderId = ''
  const commentRef = database.ref(`post/${postId}/comment`)

  const commentValue = inputComment.value
       
       
 auth.onAuthStateChanged((user)=>{

  if (user) {
   senderId = auth.currentUser.uid 
  } else {
    alert("create an account before positing comments")
    return
  }

  const mailVerified = auth.currentUser

  if (mailVerified && mailVerified.emailVerified) {
    console.log("email verified");
    const senderRef = database.ref(`users/${senderId}/`)


    senderRef.once("value",(snapchot)=>{
      const data = snapchot.val()
      const sender = data.username
      commentRef.push({comment : commentValue,sender : sender })
     
    })

  } else {
    console.log("email not verified");
    alert("please verified your mail address,before postion comments")
    return
  }
  

 



 })



    
})




// set the active class to the like button 


auth.onAuthStateChanged((user)=>{

if (user) {
 const userId = auth.currentUser.uid
 const retriveLikesRef = database.ref(`liked/${userId}/`)
 const likeBtnKey = likeBtn.getAttribute("data-id")
 retriveLikesRef.once("value",(snapshot)=>{
 const data = snapshot.val()
       
    for (const key in data) {
    const id = data[key].liked 
     
    if (id === likeBtnKey) {
       likeBtn.classList.add("active")
    }


    }




 })


} else {
  console.log("false")
}

})



})



