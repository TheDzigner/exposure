
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


  const  date = new Date();
  const hours = date.getHours() % 12 || 12
  const isAm = date.getHours() < 12
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const year = date.getFullYear()
  const day = date.getDay();
  const day_number = date.getDate()
  
  const month = date.getMonth()
  
  const days = 
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = 
  ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct', 'Nov','Dec']

  // Jun 28, 2017 at 1:18

const timeStamp = 
`${months[month]} ${day_number}, ${year} At ${hours}:${minutes}`



// get all post cards form the dom 
const postCards = document.querySelectorAll(".participants_wrapper .post_card")
const searchInput = document.getElementById("search-input")
 // select the share button from each cards 
 const shareBtn = document.querySelectorAll(".shareBtn")

 const most_liked_wrapper = document.querySelector(".most-liked-wrapper")



postCards.forEach((card)=>{

    const randomPos = Math.floor(Math.random() * postCards.length + 1)
    card.style.order = randomPos

   
   // get the postCard id 
   const postId = card.getAttribute("data-id")
   const postImage = card.querySelector(".post_image img").src
   const participantsName = card.getAttribute("data-name")
  
    // select the like button from each cards 
   const likeBtn = card.querySelector(".likeBtn")
         likeBtn.setAttribute("data-id",postId)
         likeBtn.disabled = true
 
  
   // select the html element that will displayt the amount of like number
  const displayNumLike = card.querySelector(".display-num-like")



  // get the post comment button,the input.
  const postComment = card.querySelector(".post-comment-section .postComment")
  const inputComment = card.querySelector(".post-comment-section .inputComment")
  postComment.disabled = true

  const show_comments_section = card.querySelector(".show_comments_section")


 // like function,save post id in the db,and the current like number
  likeBtn.addEventListener("click",()=>{
      let currentNumLikes = parseInt(displayNumLike.textContent)
      const postKey = likeBtn.getAttribute("data-id")
      let userId = ''

      const likeRef = database.ref(`post/${postId}/like`)
      const imageRef = database.ref(`post/${postId}/image`)
      const nameRef = database.ref(`post/${postId}/participant`)
     

      auth.onAuthStateChanged((user)=>{
        
        if (user) {

         userId = auth.currentUser.uid

         const mailVerified = auth.currentUser
         const userLikeRef =  database.ref(`liked_by/${userId}/${postId}`)


         if (mailVerified && mailVerified.emailVerified) {
         
          likeBtn.disabled = false

          if (likeBtn.classList.contains("active")) {
            likeBtn.classList.remove("active")
          if (currentNumLikes <= 0) {
            
          } else {
            currentNumLikes--
            displayNumLike.textContent = currentNumLikes

            likeRef.update({ like : currentNumLikes })

            imageRef.update({postImage : postImage})
            nameRef.update({participant : participantsName})

        const removeLikedKey =  database.ref(`liked_by/${userId}/`)
                               removeLikedKey.child(postId).remove()
          }
      
        } else {
            likeBtn.classList.add("active")
             currentNumLikes++
             displayNumLike.textContent = currentNumLikes
              likeRef.update({ like : currentNumLikes })


             imageRef.update({postImage : postImage})
             nameRef.update({participant : participantsName})

             userLikeRef.set({
              key : postId
             })
        
        }



       
         } else {
           console.log("email not verified");
           alert("please verify your mail address,before liking post")
           likeBtn.disabled = true
           return
         }


      
       

        } else {
          console.log("create an account to like post")
          likeBtn.disabled = true
          document.querySelector(".form_wrapper ").style.display = 'block'
        }


      })
   

     })


// share participants 













  // push comments in the db 

postComment.addEventListener("click",()=>{
  let senderId = ''
  const commentRef = database.ref(`post/${postId}/comment`)

  const commentValue = inputComment.value.trim()
       
       console.log(commentValue)
 auth.onAuthStateChanged((user)=>{

 if (!commentValue) {
  alert("comment cannot be empty")
  return
 }

  if (user) {
   senderId = auth.currentUser.uid 
  } else {
    alert("create an account before positing comments")
    document.querySelector(".form_wrapper ").style.display = 'block'
    return
  }

  const mailVerified = auth.currentUser

  if (mailVerified && mailVerified.emailVerified) {
    postComment.disabled = false
    console.log("email verified");
    const senderRef = database.ref(`users/${senderId}/`)


    senderRef.once("value",(snapchot)=>{
      const data = snapchot.val()
      const sender = data.username
      commentRef.push({comment : commentValue,sender : sender ,date : timeStamp}).then(()=>{
        alert("comment posted")
      }).catch((error)=>{
        alert("failed to post comment",error.message)
      })
     
      commentRef.once("child_added",(snapshot)=>{
        const data = snapshot.val()
       const comment = data.comment 
       const sender = data.sender
       const date = data.date

       const comment_wrapper = document.createElement("div")
             comment_wrapper.classList.add("comment")

       const senderComment = document.createElement("h5")
             senderComment.textContent = sender

       const Comment_text = document.createElement("p")
             Comment_text.textContent = comment

       const Comment_date = document.createElement("span")
             Comment_date.textContent = date

       comment_wrapper.append(senderComment)
       comment_wrapper.append(Comment_text)
       comment_wrapper.append(Comment_date)
      
       show_comments_section.appendChild(comment_wrapper)

      })



    })
    inputComment.value = ""
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
  const userKey = auth.currentUser.uid
 
  const checkUserLikedRef = database.ref(`liked_by/${userKey}/${postId}`)
  const likeBtnKey = likeBtn.getAttribute("data-id")
  checkUserLikedRef.once("value",(snapshot)=>{
  const data = snapshot.val()
 
 if (data) {
  for (const key in data) {
    if (data[key] === likeBtnKey) {
     likeBtn.classList.add("active")
    }
     }
   
 } else {
  return
 }


  })
}



})
















// display numbers of like

const numLikesRef =  database.ref(`post/${postId}/like`)
      numLikesRef.once("value",(snapshot)=>{
        const data = snapshot.val()
        

      if (data) {
        displayNumLike.textContent = data.like
      } else {
        return
      }

      })



// display comments 

const retriveCommentsRef = database.ref(`post/${postId}/comment`)

       retriveCommentsRef.once("value",(snapshot)=>{
              const data = snapshot.val()
              
           if (data) {
            for (const key in data) {
         
              const comment_wrapper = document.createElement("div")
               comment_wrapper.classList.add("comment")
  
         const senderComment = document.createElement("h5")
               senderComment.textContent = data[key].sender
  
         const Comment_text = document.createElement("p")
               Comment_text.textContent = data[key].comment
  
         const Comment_date = document.createElement("span")
               Comment_date.textContent =data[key].date
  
         comment_wrapper.append(senderComment)
         comment_wrapper.append(Comment_text)
         comment_wrapper.append(Comment_date)
        
         show_comments_section.appendChild(comment_wrapper)
             }
                     
     
           } else {
            return
           }


    
      
     })



auth.onAuthStateChanged((user)=>{
const Usermail = auth.currentUser

if (user && Usermail.emailVerified ) {
  likeBtn.disabled = false
  postComment.disabled = false
} else {
  likeBtn.disabled = true
  postComment.disabled = true
}


})




})


// search for participants
searchInput.addEventListener("input", function() {
  const value = this.value.trim().toLowerCase();

  postCards.forEach(card => {
    const participant = card.getAttribute("data-name").toLowerCase()
    if (value) {
      if (participant.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    } else {
      card.style.display = "block";
    }
  });
});



// display winners

function winners()
{
  const participants = database.ref("post")
    
         participants.once("value",(snapshot)=>{
          const data = snapshot.val()
         const keys = Object.values(data)

          keys.sort((a,b)=>{
            return b.like.like - a.like.like
          })

          // console.log(keys[0].image.postImage)
      
        
          let html = ""
        for (let index = 0; index < 3; index++) {
          const like_num = keys[index].like.like
          const image = keys[index].image.postImage
          const name = keys[index].participant.participant
          // console.log(like_num,image,name)
         const card = `
         <div class="most-like-card">
         <h4>${name}</h4>
          <img src="${image}" alt="">
          <div class="show-nbLikes">
           <span class="material-symbols-outlined">
             favorite
           </span>
           <p>${like_num}</p>
          </div>
        </div>
         `
          html += card
          
        }
        most_liked_wrapper.innerHTML = html
        // console.log(most_liked_wrapper)
       

         })
       
}
winners()