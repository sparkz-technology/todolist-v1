var clickCount = 0;

function performActions(event, buttonValue, listTitle) {
  event.preventDefault();

  if (clickCount === 0) {
    const elements = document.getElementById('fa-edit'+ buttonValue);
    // Loop through the selected elements and replace the class
    
      elements.classList.replace('fa-edit', 'fa-check');
   

    console.log("First click action executed!");
    console.log("Button value: " + buttonValue);
    convert(buttonValue);
    clickCount++;
  } else if (clickCount === 1) {
    console.log("Second click action executed!");
    console.log("Button value: " + buttonValue);
    clickCount = 0; // Reset the click count for future clicks
    const inputTag = document.getElementById('editInput' + buttonValue);
    const newItemName = inputTag.value;
    console.log("New value:", newItemName);
    var data = {
      buttonValueN: buttonValue,
      listTitleN: listTitle,
      itemNameN: newItemName
    };
    console.log(data);
    // Send a POST request to the server to update the item
    fetch('/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log("Item updated successfully");
        // Refresh the page
        location.reload();
      })
      .catch((err) => {
        console.error("Error updating item:", err);
      });
  }
}

function convert(buttonValue) {
  const paraTag = document.getElementById("paraTag" + buttonValue);
  const inputTag = document.getElementById('editInput' + buttonValue);
  inputTag.value = paraTag.innerText;
  inputTag.style.display = 'block';
  paraTag.style.display = 'none';

  inputTag.addEventListener("change", function(event) {
    const itemName = event.target.value;
    console.log("New value:", itemName);
    // You can perform further actions with the new value here
  });
}

document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page

  var value = document.getElementById("listInput").value;
  this.action = "/" + value;
  this.submit(); // Submits the form
});
fetch('/api/names')
  .then(response => response.json())
  .then(names => {
    // Use the 'names' array in your frontend JavaScript code
    console.log(names);
   

// Define the suggestions

var suggestions = names
const input = document.getElementById('listInput');
    const autocompleteList = document.getElementById('autocomplete-list');
    
    input.addEventListener('input', function() {
      const inputValue = this.value;
      autocompleteList.innerHTML = '';
    
      if (inputValue.length > 0) {
        const matchingSuggestions = suggestions.filter(function(suggestion) {
          return suggestion.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });
    
        matchingSuggestions.forEach(function(suggestion) {
          const suggestionElement = document.createElement('div');
          suggestionElement.innerHTML = "<strong>" + suggestion.substr(0, inputValue.length) + "</strong>";
          suggestionElement.innerHTML += suggestion.substr(inputValue.length);
          suggestionElement.addEventListener('click', function() {
            input.value = suggestion;
            autocompleteList.innerHTML = '';
          });
          autocompleteList.appendChild(suggestionElement);
        });
    
        autocompleteList.style.display = 'block';
      } else {
        autocompleteList.style.display = 'none';
      }
    });
    
    document.addEventListener('click', function(e) {
      if (!autocompleteList.contains(e.target)) {
        autocompleteList.innerHTML = '';
      }
    });

  })
  .catch(error => {
    console.error(error);
  });



