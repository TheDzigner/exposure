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


const card = document.querySelector(".card")
const postId = card.getAttribute("data-id")
const postKey = card.getAttribute("data-key")

const participantname = document.querySelector(".participant-name")
const displaynumlike = document.querySelector(".display-num-like")
const showCards = document.querySelector(".show-comment-cards")


const likeBtn = document.querySelector(".likeBtn");

const retriveCommentsRef = database.ref(`post/${postId}/comment`)
const retriveLikes = database.ref(`post/${postId}/like`)
const retriveName = database.ref(`post/${postId}/participant`)


// set the class on like button,preventing user from liking more times 

auth.onAuthStateChanged((user)=>{
let userId = ""
if (user) {
    userId = auth.currentUser.uid
    const likeBtnKey = likeBtn.getAttribute("data-id")
   
  const likedByRef = database.ref(`liked_by/${userId}/`)
        likedByRef.on("value",(snapshot)=>{
            const key = snapshot.val()
          for (const keys in key) {
               const id = key[keys].key
               if (id === likeBtnKey) {
                 likeBtn.classList.add("active")
               }
          }
        })
} else {
    
}



})


// like function,save post id in the db,and the current like number
likeBtn.addEventListener("click",()=>{
    let currentNumLikes = parseInt(displaynumlike.textContent)
    const postImage = document.querySelector(".card-image img").src
    const postKey = likeBtn.getAttribute("data-id")
    const participantsName =  participantname .textContent
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
          displaynumlike.textContent = currentNumLikes

          likeRef.update({ like : currentNumLikes })

          imageRef.update({postImage : postImage})
          nameRef.update({participant : participantsName})

      const removeLikedKey =  database.ref(`liked_by/${userId}/`)
                             removeLikedKey.child(postId).remove()
        }
    
      } else {
          likeBtn.classList.add("active")
           currentNumLikes++
           displaynumlike.textContent = currentNumLikes
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








retriveName.once("value",(snapshot)=>{
    const data = snapshot.val()
    participantname.textContent = data.participant
})


retriveLikes.once("value",(snapshot)=>{
    const data = snapshot.val()
    displaynumlike.textContent = data.like
})

retriveCommentsRef.once("value",(snapshot)=>{
    const data = snapshot.val()
  let html = ''
    for (const comments in data) {

        const sender =  data[comments].sender
        const comment = data[comments].comment
        const date =    data[comments].date
     
        const card = `
        <div class="comment">
        <h5>${sender}</h5>
        <p>
        ${comment}
        </p>
        <span>${date}</span>
    </div>
        `
     html += card

    }
    showCards.innerHTML = html

  
})

