document.addEventListener('DOMContentLoaded', function () {
  const filmsList = document.getElementById('films');

  // Function to make GET request to retrieve movie data
  async function fetchMovieData() {
      try {
          const response = await fetch('http://localhost:3000/films');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          return data.films;
      } catch (error) {
          console.error('Error fetching movie data:', error);
          return [];
      }
  }

  // Function to display movie details
  async function displayMovieDetails(movie) {
      const poster = document.getElementById('poster');
      const title = document.getElementById('title');
      const runtime = document.getElementById('runtime');
      const filmInfo = document.getElementById('film-info');
      const showtime = document.getElementById('showtime');
      const ticketNum = document.getElementById('ticket-num');
      const buyTicketBtn = document.getElementById('buy-ticket');

      poster.src = movie.poster;
      title.textContent = movie.title;
      runtime.textContent = `${movie.runtime} minutes`;
      filmInfo.textContent = movie.description;
      showtime.textContent = movie.showtime;
      const availableTickets = movie.capacity - movie.tickets_sold;
      ticketNum.textContent = `${availableTickets} remaining tickets`;

      if (availableTickets <= 0) {
          buyTicketBtn.textContent = 'Sold Out';
          buyTicketBtn.disabled = true;
      } else {
          buyTicketBtn.textContent = 'Buy Ticket';
          buyTicketBtn.disabled = false;
      }

      // Add event listener to Buy Ticket button
      buyTicketBtn.addEventListener('click', async function () {
          if (availableTickets > 0) {
              movie.tickets_sold++;
              await updateMovieData(movie);
              displayMovieDetails(movie);
          }
      });
  }

  // Function to populate movie menu
  async function populateMovieMenu(movies) {
      filmsList.innerHTML = '';
      movies.forEach(movie => {
          const li = document.createElement('li');
          li.className = 'film item';
          li.textContent = movie.title;
          filmsList.appendChild(li);

          // Add event listener to each film item
          li.addEventListener('click', async function () {
              await displayMovieDetails(movie);
          });
      });
  }

  // Function to update movie data on server
  async function updateMovieData(movie) {
      try {
          const response = await fetch(`http://localhost:3000/films/${movie.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(movie)
          });
          if (!response.ok) {
              throw new Error('Failed to update movie data');
          }
      } catch (error) {
          console.error('Error updating movie data:', error);
      }
  }

  // Initial setup
  (async function () {
      const movies = await fetchMovieData();
      if (movies.length > 0) {
          await displayMovieDetails(movies[0]);
          populateMovieMenu(movies);
      }
  })();
});
