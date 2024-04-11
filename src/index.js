document.addEventListener('DOMContentLoaded', function () {
    const filmsList = document.getElementById('films');
    const baseURL = 'http://localhost:3000/';

    // Function to make GET request to retrieve movie data
    function fetchMovieData() {
        return fetch(`${baseURL}films`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Function to update movie data on server
    function updateMovieData(movie) {
        return fetch(`${baseURL}films/${movie.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to update movie data');
                }
            })
            .catch(function (error) {
                console.error('Error updating movie data:', error);
            });
    }

    // Function to display movie details
    async function displayMovieDetails(movie) {
        const poster = document.getElementById('poster');
        const title = document.getElementById('title');
        const runtime = document.getElementById('runtime');
        const filmInfo = document.getElementById('film-info');
        const showtime = document.getElementById('showtime');
        const ticketNumber = document.getElementById('ticket-num');
        const buyTicketButton = document.getElementById('buy-ticket');

        poster.src = movie.poster;
        title.textContent = movie.title;
        runtime.textContent = `${movie.runtime} minutes`;
        filmInfo.textContent = movie.description;
        showtime.textContent = movie.showtime;
        const availableTickets = movie.capacity - movie.tickets_sold;
        ticketNumber.textContent = `${availableTickets} remaining tickets`;

        if (availableTickets <= 0) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = false;
        }

        // Add event listener to Buy Ticket button
        buyTicketButton.addEventListener('click', function () {
            if (availableTickets > 0) {
                movie.tickets_sold++;
                updateMovieData(movie)
                    .then(function () {
                        displayMovieDetails(movie);
                    })
                    .catch(function (error) {
                        console.error('Error updating movie data:', error);
                    });
            }
        });
    }

    // Function to populate movie menu
    function populateMovieMenu(movies) {
        filmsList.innerHTML = '';
        movies.forEach(function (movie) {
            const li = document.createElement('li');
            li.className = 'film item';
            li.textContent = movie.title;
            filmsList.appendChild(li);

            // Add event listener to each film item
            li.addEventListener('click', function () {
                displayMovieDetails(movie);
            });
        });
    }

    // Initial setup
    fetchMovieData()
        .then(function (movies) {
            if (movies.length > 0) {
                displayMovieDetails(movies[0]);
                populateMovieMenu(movies);
            }
        });
});
