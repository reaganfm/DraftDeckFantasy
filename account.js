document.addEventListener("DOMContentLoaded", function () {
    const profilePictureInput = document.getElementById("profile-picture-input");
    const profilePicture = document.getElementById("profile-picture");
    const changePictureButton = document.getElementById("change-picture-button");
    const deletePictureButton = document.getElementById("delete-picture-button");
  
    changePictureButton.addEventListener("click", function () {
      profilePictureInput.click();
    });
  
    profilePictureInput.addEventListener("change", function () {
      const file = profilePictureInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          profilePicture.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    deletePictureButton.addEventListener("click", function () {
      profilePicture.src = "Images/default-profile.png";
      profilePictureInput.value = "";
    });
  });