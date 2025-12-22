// Explore Pages

function renderExplore() {
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Explore</h1>
            </div>
            <div class="search-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <a href="/explore/universities" class="filter-btn" data-link>Universities</a>
                <a href="/explore/countries" class="filter-btn" data-link>Countries</a>
                <a href="/explore/tags" class="filter-btn" data-link>Topics</a>
            </div>
            <div class="search-results grid-3">
                ${posts.slice(0, 9).map(post => createPostCard(post)).join('')}
            </div>
        </div>
    `;
    
    renderPage(content);
}

function renderExploreUniversities() {
    const universitiesHTML = universities.map(uni => `
        <div class="community-card" style="cursor: pointer;" onclick="window.router.navigate('/explore?university=${uni.id}')">
            <div class="community-header">
                <div class="community-avatar" style="background: linear-gradient(135deg, var(--accent-red), #FF6B6B); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">
                    ${uni.name.charAt(0)}
                </div>
                <div class="community-info">
                    <div class="community-name">${escapeHtml(uni.name)}</div>
                    <div class="community-members">${uni.country} • ${uni.students.toLocaleString()} students</div>
                </div>
            </div>
        </div>
    `).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Universities</h1>
            </div>
            <div class="search-results grid-3">
                ${universitiesHTML}
            </div>
        </div>
    `;
    
    renderPage(content);
}

function renderExploreCountries() {
    const countriesHTML = countries.map(country => `
        <div class="community-card" style="cursor: pointer;" onclick="window.router.navigate('/explore?country=${country.id}')">
            <div class="community-header">
                <div class="community-avatar" style="background: linear-gradient(135deg, #4ECDC4, #44A08D); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">
                    ${country.name.charAt(0)}
                </div>
                <div class="community-info">
                    <div class="community-name">${escapeHtml(country.name)}</div>
                    <div class="community-members">${country.students.toLocaleString()} students • ${country.universities} universities</div>
                </div>
            </div>
        </div>
    `).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Countries</h1>
            </div>
            <div class="search-results grid-3">
                ${countriesHTML}
            </div>
        </div>
    `;
    
    renderPage(content);
}

function renderExploreTags() {
    const tagsHTML = tags.map(tag => `
        <div class="community-card" style="cursor: pointer;" onclick="window.router.navigate('/explore?tag=${tag.id}')">
            <div class="community-header">
                <div class="community-avatar" style="background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold;">
                    #
                </div>
                <div class="community-info">
                    <div class="community-name">#${escapeHtml(tag.name)}</div>
                    <div class="community-members">${tag.posts.toLocaleString()} posts</div>
                </div>
            </div>
        </div>
    `).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Topics</h1>
            </div>
            <div class="search-results grid-3">
                ${tagsHTML}
            </div>
        </div>
    `;
    
    renderPage(content);
}

