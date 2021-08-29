const Base_URL = "https://lighthouse-user-api.herokuapp.com"
const index_URL = Base_URL + "/api/v1/users/"

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const userInfo = []
let filteredUser = []
const USERS_PER_PAGE = 20

function RenderUserInfo(data) {
  let rawHTML = ``
  data.forEach((item) => {
    rawHTML += `
          <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top info-img" data-id="${item.id}"  data-toggle="modal" data-target="#info-modal" alt="avatar">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
          </div>
        </div>
      </div>
    </div>
    `
  })

  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ``

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }

  paginator.innerHTML = rawHTML
}

function getUsersByPage(page) {
  const data = filteredUser.length ? filteredUser : userInfo
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}


function showUserModal(id) {
  const InfoModalTitle = document.querySelector('#info-modal-title')
  const InfoModalImage = document.querySelector('#info-modal-image')
  const InfoModalGender = document.querySelector('#info-modal-gender')
  const InfoModalBirth = document.querySelector('#info-modal-birth')
  const InfoModalRegion = document.querySelector('#info-modal-region')
  const InfoModalEmail = document.querySelector('#info-modal-email')

  axios.get(index_URL + id).then((response) => {
    const data = response.data
    InfoModalTitle.innerText = data.name
    InfoModalGender.innerText = 'Gender: ' + data.gender
    InfoModalBirth.innerText = 'Birth: ' + data.birthday
    InfoModalRegion.innerText = 'Region: ' + data.region
    InfoModalEmail.innerText = 'Email: ' + data.email
    InfoModalImage.innerHTML = `
      <img src="${data.avatar}" alt="avatar">
    `
  })
}



dataPanel.addEventListener('click', function (event) {
  if (event.target.matches('.info-img')) {
    showUserModal(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit',function onSearchFormSubmitted(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // console.log(keyword)

  filteredUser = userInfo.filter((user) => user.name.toLowerCase().includes(keyword))
  // console.log(filteredUser)
  
  if (filteredUser.length === 0) {
    return alert('Cannot find User with keywords:' + keyword)
  }

  renderPaginator(filteredUser.length)
  RenderUserInfo(getUsersByPage(1))

})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  // console.log(event.target.dataset.page)
  const page = Number(event.target.dataset.page)
  RenderUserInfo(getUsersByPage(page))
})

axios.get(index_URL).then((response) => {
  userInfo.push(...response.data.results)
  renderPaginator(userInfo.length)
  RenderUserInfo(getUsersByPage(1))
})