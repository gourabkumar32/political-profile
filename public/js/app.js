document.addEventListener('DOMContentLoaded', function() {
    const statesContainer = document.getElementById('statesContainer');
    const searchInput = document.getElementById('searchInput');
    const stateFilter = document.getElementById('stateFilter');
    const partyFilter = document.getElementById('partyFilter');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeBtns = document.getElementsByClassName('close');
  
    let mlaData = {};
  
    async function fetchMLAData() {
      try {
        const response = await fetch('/api/mlas');
        const data = await response.json();
        mlaData = data.reduce((acc, mla) => {
          if (!acc[mla.state]) acc[mla.state] = [];
          acc[mla.state].push(mla);
          return acc;
        }, {});
        populateStateFilter();
        populatePartyFilter();
        renderMLAs();
      } catch (error) {
        console.error('Error fetching MLA data:', error);
      }
    }
  
    function populateStateFilter() {
      stateFilter.innerHTML = '<option value="">All States</option>';
      Object.keys(mlaData).forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
      });
    }
  
    function populatePartyFilter() {
      const parties = new Set();
      Object.values(mlaData).flat().forEach(mla => parties.add(mla.party));
      
      partyFilter.innerHTML = '<option value="">All Parties</option>';
      parties.forEach(party => {
        const option = document.createElement('option');
        option.value = party;
        option.textContent = party;
        partyFilter.appendChild(option);
      });
    }
  
    function generateStars(rating) {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
      return `
        ${'★'.repeat(fullStars)}
        ${halfStar ? '½' : ''}
        ${'☆'.repeat(emptyStars)}
      `;
    }
  
    function renderMLAs() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedState = stateFilter.value;
      const selectedParty = partyFilter.value;
  
      statesContainer.innerHTML = '';
  
      Object.entries(mlaData).forEach(([state, mlas]) => {
        if (selectedState && state !== selectedState) return;
  
        const filteredMLAs = mlas.filter(mla => {
          const matchesSearch = mla.name.toLowerCase().includes(searchTerm) ||
                                mla.constituency.toLowerCase().includes(searchTerm);
          const matchesParty = !selectedParty || mla.party === selectedParty;
          return matchesSearch && matchesParty;
        });
  
        if (filteredMLAs.length === 0) return;
  
        const stateCard = document.createElement('div');
        stateCard.className = 'state-card';
        stateCard.innerHTML = `
          <h2 class="state-title">${state}</h2>
          <div class="mla-grid">
            ${filteredMLAs.map(mla => `
              <div class="mla-card">
                <img src="/images/${mla.image}" alt="${mla.name}" class="mla-image">
                <div class="mla-info">
                  <h3>${mla.name}</h3>
                  <p><strong>Constituency:</strong> ${mla.constituency}</p>
                  <p><strong>Party:</strong> ${mla.party}</p>
                  <div class="rating">
                    ${generateStars(mla.rating)}
                    <span>${mla.rating.toFixed(1)}</span>
                  </div>
                  <div class="review-buttons">
                    <button onclick="addReview('${mla._id}')" class="btn-review">Add Review</button>
                    <button onclick="viewReviews('${mla._id}')" class="btn-view">View Reviews</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        statesContainer.appendChild(stateCard);
      });
    }
  
    searchInput.addEventListener('input', renderMLAs);
    stateFilter.addEventListener('change', renderMLAs);
    partyFilter.addEventListener('change', renderMLAs);
  
    loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
    logoutBtn.addEventListener('click', logout);
  
    Array.from(closeBtns).forEach(btn => {
      btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
      });
    });
  
    window.addEventListener('click', (event) => {
      if (event.target == loginModal) loginModal.style.display = 'none';
      if (event.target == registerModal) registerModal.style.display = 'none';
    });
  
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
  
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          loginModal.style.display = 'none';
          updateAuthUI(true);
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'An error occurred during login');
      }
    });
  
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
  
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
  
        const data = await response.json();
        
        if (response.ok) {
          alert('Registration successful! Please log in.');
          registerModal.style.display = 'none';
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'An error occurred during registration');
      }
    });
  
    function updateAuthUI(isLoggedIn) {
      if (isLoggedIn) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
      } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
      }
    }
  
    async function logout() {
      localStorage.removeItem('token');
      updateAuthUI(false);
      alert('Logged out successfully');
    }
  
    window.addReview = async function(mlaId) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add a review');
        loginModal.style.display = 'block';
        return;
      }
    
      const rating = prompt('Enter rating (1-5):', '5');
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please enter a valid rating between 1 and 5');
        return;
      }
    
      const comment = prompt('Enter your review:');
      if (!comment) {
        alert('Please enter a review comment');
        return;
      }
    
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mlaId,
            rating: parseInt(rating),
            comment
          })
        });
    
        const data = await response.json();
        
        if (response.ok) {
          alert('Review added successfully!');
          await fetchMLAData(); // Refresh MLA data to update ratings
        } else {
          throw new Error(data.message || 'Failed to add review');
        }
      } catch (error) {
        console.error('Add review error:', error);
        alert(error.message || 'An error occurred while adding the review');
      }
    };
    
    window.viewReviews = async function(mlaId) {
      try {
        const response = await fetch(`/api/reviews/mla/${mlaId}`);
        const result = await response.json();
    
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch reviews');
        }
    
        if (!result.data || result.data.length === 0) {
          alert('No reviews available for this MLA yet.');
          return;
        }
    
        const modalHtml = `
          <div id="reviewsModal" class="modal" style="display: block;">
            <div class="modal-content">
              <span class="close" onclick="document.getElementById('reviewsModal').remove()">&times;</span>
              <h2>Reviews for ${result.mla.name}</h2>
              <h3>${result.mla.constituency}</h3>
              <div class="reviews-container">
                ${result.data.map(review => `
                  <div class="review-item">
                    <div class="rating">
                      ${generateStars(review.rating)}
                      <span>${review.rating}/5</span>
                    </div>
                    <div class="comment">${review.comment}</div>
                    <div class="reviewer">
                      By: ${review.user ? review.user.name : 'Anonymous'}
                    </div>
                    <div class="date">
                      ${new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
    
        const existingModal = document.getElementById('reviewsModal');
        if (existingModal) {
          existingModal.remove();
        }
    
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    
        document.getElementById('reviewsModal').addEventListener('click', function(event) {
          if (event.target === this) {
            this.remove();
          }
        });
    
      } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Error fetching reviews. Please try again later.');
      }
    };
    
    function isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  
    if (isLoggedIn()) {
      updateAuthUI(true);
    }
  
    fetchMLAData();
  });