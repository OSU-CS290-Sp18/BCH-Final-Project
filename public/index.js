
function getDesignatorFromURL() {
  var path = window.location.pathname;
  var pathParts = path.split('/');

  return pathParts[1];

}

function handleModalAcceptClick() {

  var photoURL = document.getElementById('photo-url-input').value.trim();
  var description = document.getElementById('photo-description-input').value.trim();
  var tags = document.getElementById('photo-tags-input').value.trim();

  if (!photoURL || !description || !tags) {
    alert("You must fill in all of the fields!");
  } else {

    var request = new XMLHttpRequest();
    var designator = getDesignatorFromURL();
    var url = "/" + designator + "/addItem";
    request.open("POST", url);

    var requestBody = JSON.stringify({
      photoURL: photoURL,
      description: description,
      tags: tags
    });

    request.addEventListener('load', function (event) {
      if (event.target.status === 200) {
        var cardTemplate = Handlebars.templates.photoCard;
        var newCardHTML = cardTemplate({
          photoURL: photoURL,
          description: description,
          tags: tags
        });
        var cardContainer = document.querySelector('.card-container');
        cardContainer.insertAdjacentHTML('beforeend', newCardHTML);
      } else {
        alert("Error storing photo: " + event.target.response);
      }
    });

    request.setRequestHeader('Content-Type', 'application/json');
    request.send(requestBody);

    hideModal();

  }

}


function showModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}


function clearModalInputs() {

  var modalInputElements = document.querySelectorAll('#add-photo-modal input')
  for (var i = 0; i < modalInputElements.length; i++) {
    modalInputElements[i].value = '';
  }

}


function hideModal() {

  var modal = document.getElementById('add-photo-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  modal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearModalInputs();

}

window.addEventListener('DOMContentLoaded', function () {

  var addPhotoButton = document.getElementById('add-photo-button');
  addPhotoButton.addEventListener('click', showModal);

  var modalAcceptButton = document.getElementById('modal-accept');
  modalAcceptButton.addEventListener('click', handleModalAcceptClick);

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', hideModal);
  }

});
