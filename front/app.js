// Function to toggle search input visibility
// document.getElementById('searchButton').addEventListener('click', function () {
//     const searchContainer = document.querySelector('.search-container');
//     searchContainer.classList.toggle('active'); // Toggle the active class
//     const searchInput = document.getElementById('searchInput');

//     // Focus on the input if it becomes visible
//     if (searchContainer.classList.contains('active')) {
//         searchInput.focus();
//     }
// });

// Function to filter students based on search input
// document.getElementById('searchInput').addEventListener('input', function () {
//     const searchValue = this.value.toLowerCase().trim(); // Sanitize input
//     const studentRows = document.querySelectorAll('#studentTable tbody tr');

//     studentRows.forEach(row => {
//         const studentName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
//         row.style.display = studentName.includes(searchValue) ? '' : 'none'; // Show or hide row
//     });
// });

// Handle student form submission
document.getElementById('studentForm').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('loadingSpinner').style.display = 'block';

    const name = document.getElementById('name').value.trim();
    const roll = document.getElementById('roll').value.trim();
    const studentClass = document.getElementById('class').value.trim();
    const contact = document.getElementById('contact').value.trim();

    // Validate input
    if (!name || !roll || !studentClass || !contact) {
        alert('All fields are required.');
        document.getElementById('loadingSpinner').style.display = 'none';
        return;
    }

    fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name, 
            roll_number: roll, 
            class: studentClass, 
            parent_contact: contact 
        }),
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            alert('Student added successfully!');
            document.getElementById('studentForm').reset();
            fetchStudents(); // Refresh the table
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add student. Please try again.');
        })
        .finally(() => {
            document.getElementById('loadingSpinner').style.display = 'none';
        });
});

// Function to edit student
function editStudent(id) {
    document.getElementById('loadingSpinner').style.display = 'block';

    fetch(`/api/students/${id}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(student => {
            document.getElementById('updateName').value = student.name;
            document.getElementById('updateRoll').value = student.roll_number;
            document.getElementById('updateClass').value = student.class;
            document.getElementById('updateContact').value = student.parent_contact;

            const modal = document.getElementById('updateStudentModal');
            modal.style.display = 'block';
            modal.setAttribute('data-student-id', id); // Store student ID
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch student data.');
        })
        .finally(() => {
            document.getElementById('loadingSpinner').style.display = 'none';
        });
}

// Handle update form submission
document.getElementById('updateStudentForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('updateStudentModal').getAttribute('data-student-id');
    const name = document.getElementById('updateName').value.trim();
    const roll = document.getElementById('updateRoll').value.trim();
    const studentClass = document.getElementById('updateClass').value.trim();
    const contact = document.getElementById('updateContact').value.trim();

    if (!name || !roll || !studentClass || !contact) {
        alert('All fields are required.');
        return;
    }

    fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name, 
            roll_number: roll, 
            class: studentClass, 
            parent_contact: contact 
        }),
    })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            alert('Student updated successfully!');
            document.getElementById('updateStudentModal').style.display = 'none';
            fetchStudents(); // Refresh the table
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update student.');
        });
});

// Close modal when clicking the close button
document.querySelector('.close-button').addEventListener('click', function () {
    document.getElementById('updateStudentModal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    const modal = document.getElementById('updateStudentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


// Function to handle search
// const handleSearch = async () => {
//     const searchQuery = document.getElementById('searchInput').value.trim();

//     if (!searchQuery) {
//         alert('Please enter a search term.');
//         return;
//     }

//     showLoading();
//     try {
//         // Send the search query to the backend
//         const response = await fetch(`${apiUrl}/api/search?query=${encodeURIComponent(searchQuery)}`);
//         if (!response.ok) throw new Error(`Error fetching search results: ${response.statusText}`);

//         const results = await response.json();
//         displaySearchResults(results);
//     } catch (error) {
//         showError('Failed to fetch search results');
//         console.error(error);
//     }
//     hideLoading();
// };

// Function to display search results
// const displaySearchResults = (results) => {
//     const tableBody = document.querySelector('#searchResultsTable tbody');
//     tableBody.innerHTML = ''; // Clear previous results

//     if (results.length === 0) {
//         tableBody.innerHTML = '<tr><td colspan="4">No results found.</td></tr>';
//         return;
//     }

//     results.forEach(result => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${result.student_id}</td>
//             <td>${result.name}</td>
//             <td>${result.attendance || 'N/A'}</td>
//             <td>${result.fee_status || 'N/A'}</td>
//         `;
//         tableBody.appendChild(row);
//     });
// };

// Event listener for the search button
// document.getElementById('searchButton').addEventListener('click', handleSearch);

// // Event listener for pressing Enter in the search input
// document.getElementById('searchInput').addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//         handleSearch();
//     }
// });