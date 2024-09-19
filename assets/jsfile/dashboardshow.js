
const cardData = [
{ title: "Todays Register User", value: 100 },
{ title: "Total Register User", value: 200 },
{ title: "Total Credits", value: 200, admin: 'superadmin' },
{ title: "Total Debits", value: 200, admin: 'superadmin' },
{ title: "Todays Profit", value: 200, admin: 'superadmin' },
{ title: "Total Profit", value: 200, admin: 'superadmin' },
{ title: "Total Wallet Amount", value: 200 },
{ title: "Total Transaction", value: 200, admin: 'superadmin' },
{ title: "All Users", value: 100 },
];

function createCard(title, value, isAdmin) {
// Determine if the `otp-exempt` class should be added
const extraClass = isAdmin ? 'otp-exempt5' : '';

return `
 <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-1 ${extraClass}">
   <div class="card">
     <div class="card-body">
       <div class="row">
         <div class="col-12">
           <h5>${title}</h5>
           <div class="mt-2 d-flex align-items-center justify-content-center">
             <span href="#" class="btn btn-primary btn-sm data-padding btn-font">${value}</span>
           </div>
         </div>           
       </div>
     </div>
   </div>
 </div>
`;
}

const cardContainer = document.getElementById('card-container');
cardData.forEach(data => {
// Check if `admin` is 'superadmin'
const isAdmin = data.admin === 'superadmin';
cardContainer.innerHTML += createCard(data.title, data.value, isAdmin);
});


 const tableData = [
   { regNo: 1, regName: "John Doe", regMobile: "8145259674", depNo: 1, depMobile: "8145259674", depAmount: "₹ 100", depStatus: "Success", withNo: 1, withMobile: "8145259674", withAmount: "₹ 50", withStatus: "Reject" },
   { regNo: 2, regName: "Jane Smith", regMobile: "9235742002", depNo: 2, depMobile: "6375203628", depAmount: "₹ 200", depStatus: "Pending", withNo: 2, withMobile: "1234567890", withAmount: "₹ 75", withStatus: "Pending" },
   { regNo: 3, regName: "Alice Johnson", regMobile: "9876543210", depNo: 3, depMobile: "9876543210", depAmount: "₹ 300", depStatus: "Failed", withNo: 3, withMobile: "9876543210", withAmount: "₹ 150", withStatus: "Success" },
   { regNo: 4, regName: "Bob Brown", regMobile: "4567891230", depNo: 4, depMobile: "4567891230", depAmount: "₹ 400", depStatus: "Success", withNo: 4, withMobile: "4567891230", withAmount: "₹ 250", withStatus: "Pending" },
   { regNo: 5, regName: "Charlie Davis", regMobile: "7891234560", depNo: 5, depMobile: "7891234560", depAmount: "₹ 500", depStatus: "Pending", withNo: 5, withMobile: "7891234560", withAmount: "₹ 350", withStatus: "Failed" },
   { regNo: 6, regName: "David Evans", regMobile: "3216549870", depNo: 6, depMobile: "3216549870", depAmount: "₹ 600", depStatus: "Success", withNo: 6, withMobile: "3216549870", withAmount: "₹ 450", withStatus: "Success" },
   { regNo: 7, regName: "Eve Foster", regMobile: "6549873210", depNo: 7, depMobile: "6549873210", depAmount: "₹ 700", depStatus: "Failed", withNo: 7, withMobile: "6549873210", withAmount: "₹ 550", withStatus: "Pending" }
   // Add more objects as needed
 ];

 function createRow(data) {
   return `
     <tr>
       <td>${data.regNo}</td>
       <td>${data.regName}</td>
       <td>${data.regMobile}</td>
       <td>${data.depNo}</td>
       <td>${data.depMobile}</td>
       <td>${data.depAmount}</td>
       <td class="status">${data.depStatus}</td>
       <td>${data.withNo}</td>
       <td>${data.withMobile}</td>
       <td>${data.withAmount}</td>
       <td class="status">${data.withStatus}</td>
     </tr>
   `;
 }

 const tableBody = document.getElementById('table-body');
 tableData.forEach(data => {
   tableBody.innerHTML += createRow(data);
 });

 console.log(new Date().getMinutes())
