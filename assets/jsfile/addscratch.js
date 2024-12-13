import {checkAdminAccess}  from "../js/initial.js"

  let isFileUploadedCoupon = false;

  const fileInput1 = document.getElementById('fileInput1');
  const fileInput2 = document.getElementById('fileInput2');
  const responseMessage1 = document.getElementById('responseMessage1');
  const responseMessage2 = document.getElementById('responseMessage2');
  const uploadForm1 = document.getElementById('uploadForm1');

  uploadForm1.addEventListener('submit', function (e) {
  e.preventDefault();
  responseMessage1.innerHTML = '';

  if (!fileInput1.files.length) {
      responseMessage1.innerHTML = '<div class="alert alert-danger">Please select a file before submitting.</div>';
      return;
  }

  const selectedFile1 = fileInput1.files[0];
  const textInput = fileInput2.value.trim();

  if (selectedFile1 && textInput) {
      uploadCouponFile(selectedFile1, textInput);
  } else {
      responseMessage2.innerHTML = '<div class="alert alert-danger">Please fill out both fields.</div>';
  }
});

function uploadCouponFile(file, textInput) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('coupon_point', textInput);

  fetch('https://krinik.in/scratch_coupon_get/', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log("Response data:", data); // Debugging: Check if data contains "status" and "data"
      if (data.status === 'success') {
          isFileUploadedCoupon = true;
          alert("Scratch coupon uploaded successfully!");
          location.reload();
      } else {
          responseMessage1.innerHTML = '<div class="alert alert-danger">File upload failed.</div>';
      }
  })
  .catch(error => {
      responseMessage1.innerHTML = '<div class="alert alert-danger">Error: ' + error.message + '</div>';
  });
}

 

  fileInput1.addEventListener('change', function () {
      responseMessage1.innerHTML = '';
  });

  fileInput2.addEventListener('input', function () {
      responseMessage2.innerHTML = '';
  });

  window.onload = checkAdminAccess();

  let fetchdata = async () => {
    try {
        let response = await fetch('https://krinik.in/scratch_coupon_get/');
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data1 = await response.json();
        let data = data1.data;

        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchdata();