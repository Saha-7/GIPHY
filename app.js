let submitBtn = document.getElementById("submit-btn");

let generateGif = () => {
  // Display loader until GIFs load
  let loader = document.querySelector(".loader");
  loader.style.display = "block";
  document.querySelector(".wrapper").style.display = "none";

  // getting the search value
  let q = document.getElementById("search-box").value.trim() || 'laugh';
  // 10 GIFs to be displayed in result
  let gifCount = 15;

  // API URL
  let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
  console.log("API Request URL:", finalURL); // Debugging log
  document.querySelector(".wrapper").innerHTML = "";

  // API call
  fetch(finalURL)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`API request failed with status ${resp.status} - ${resp.statusText}`);
      }
      return resp.json();
    })
    .then((info) => {
      console.log("GIF Data:", info.data); // Log data to verify correct response

      // Checking if GIFs were returned or not
      if (!info.data || info.data.length === 0) {
        console.error("No GIFs found or invalid response format:", info);
        loader.style.display = "none"; // Hide loader if no GIFs are found
        document.querySelector(".wrapper").style.display = "grid";
        document.querySelector(".wrapper").innerHTML = "<p>No GIFs found.</p>";
        return;
      }

      // All GIFs
      let gifsData = info.data;
      gifsData.forEach((gif) => {
       
        let container = document.createElement("div");
        container.classList.add("container");

        let img = document.createElement("img");
        img.setAttribute("src", gif.images.downsized_medium.url);
        img.setAttribute("alt", gif.title || 'GIF'); 
        img.onload = () => {
          // If images correctly, reducing the count when each GIF loads
          gifCount--;
          if (gifCount === 0) {
            // If all GIFs have loaded, then hide loader and display GIFs UI
            loader.style.display = "none";
            document.querySelector(".wrapper").style.display = "grid";
          }
        };

        // Handling image load errors
        img.onerror = () => {
          console.error("Image failed to load:", gif.images.downsized_medium.url);
          gifCount--;
          if (gifCount === 0) {
            loader.style.display = "none";
            document.querySelector(".wrapper").style.display = "grid";
          }
        };

        container.append(img);

        // Append container to the wrapper
        document.querySelector(".wrapper").append(container);
      });
    })
    .catch((error) => {
      console.error("Error fetching GIFs:", error);
      alert("Error fetching GIFs: " + error.message);
      loader.style.display = "none"; // Hide loader in case of errors
      document.querySelector(".wrapper").style.display = "grid";
      document.querySelector(".wrapper").innerHTML = "<p>Failed to load GIFs. Please try again later.</p>";
    });
};

// Generating GIFs on screen load or when user clicks on search
submitBtn.addEventListener("click", generateGif);
window.addEventListener("load", generateGif);
