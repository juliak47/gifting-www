document.addEventListener("DOMContentLoaded", function () {
    let steps = document.querySelectorAll(".step");
  
    document.querySelectorAll(".button").forEach(button => {
      button.addEventListener("click", function (event) {
        event.preventDefault(); // Stop default anchor behavior
  
        let targetId = this.getAttribute("href");
  
        if (!targetId || targetId === "#" || !targetId.startsWith("#")) {
          console.warn("Invalid or missing href detected:", this);
          return;
        }
  
        targetId = targetId.substring(1); // Remove the "#"
  
        // Birthday check logic
        if (targetId === "birthday-yes-step") {
          let today = new Date();
          let month = today.getMonth() + 1; // JS months are 0-based (January = 0)
          let day = today.getDate();
  
          if (month !== 2 || day !== 24) { // If NOT February 24th, stop
            alert("🚫 Today is NOT February 24th! You cannot proceed.");
            return; // **Stops execution completely**
          }
        }
  
        let targetStep = document.getElementById(targetId);
  
        if (targetStep) {
          // Hide all steps, then show the correct one
          steps.forEach(step => step.style.display = "none");
          targetStep.style.display = "block";
        } else {
          console.error("❌ Target step not found:", targetId);
          alert("Oops! That section doesn't exist.");
        }
      });
    });
  
    // Ensure the first step is visible on page load
    let firstStep = document.querySelector(".step");
    if (firstStep) {
      firstStep.style.display = "block";
    }
  });
  
  
  document.addEventListener("DOMContentLoaded", function () {
    let currentPhotoIndex = 0; // Start at the first photo
    let photos = document.querySelectorAll(".photo-page");
  
    // Function to show a specific photo
    function showPhoto(index) {
      // Hide all photos
      photos.forEach(photo => photo.style.display = "none");
  
      // Show the selected photo
      photos[index].style.display = "block";
    }
  
    // Show the first photo initially
    showPhoto(currentPhotoIndex);
  
    // Next button functionality
    document.getElementById("next-btn").addEventListener("click", function () {
      if (currentPhotoIndex < photos.length - 1) {
        currentPhotoIndex++;
        showPhoto(currentPhotoIndex);
      }
    });
  
    // Previous button functionality
    document.getElementById("prev-btn").addEventListener("click", function () {
      if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        showPhoto(currentPhotoIndex);
      }
    });
  });
  
  document.addEventListener("DOMContentLoaded", function () {
      let audio = new Audio("https://docs.google.com/uc?export=download&id=1loWgo5Hu0m9cEUbHPDoBjc-zRFtntdH1");
  
      document.getElementById("birthday-yes-step").addEventListener("click", function () {
          audio.play().catch(error => console.log("Autoplay blocked:", error));
      });
  });
  
  