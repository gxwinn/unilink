// Events Pages

function renderEvents() {
    const myEvents = events.filter(e => e.registered);
    const allEvents = events;
    
    const myEventsHTML = myEvents.length > 0
        ? myEvents.map(event => createEventCard(event)).join('')
        : '<div class="empty-state"><p>No registered events</p></div>';
    
    const allEventsHTML = allEvents.map(event => createEventCard(event)).join('');
    
    const content = `
        <div class="page-container">
            <div class="page-header">
                <h1 class="page-title">Events</h1>
            </div>
            ${myEvents.length > 0 ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 20px; margin-bottom: 16px;">My Events</h2>
                    <div id="my-events-container">
                        ${myEventsHTML}
                    </div>
                </div>
            ` : ''}
            <div>
                <h2 style="font-size: 20px; margin-bottom: 16px;">All Events</h2>
                <div id="all-events-container">
                    ${allEventsHTML}
                </div>
            </div>
        </div>
    `;
    
    renderPage(content);
}

function renderEventDetails(eventId) {
    const event = getEventById(eventId);
    
    if (!event) {
        renderPage('<div class="page-container"><div class="empty-state"><p>Event not found</p></div></div>');
        return;
    }
    
    const content = `
        <div class="page-container">
            <div style="margin-bottom: 20px;">
                <a href="/events" class="btn-secondary" data-link style="text-decoration: none; display: inline-block;">
                    ← Back to Events
                </a>
            </div>
            <div class="event-card" style="cursor: default;">
                <div class="event-header">
                    <div>
                        <div class="event-title">${escapeHtml(event.title)}</div>
                        <div class="event-date">${formatDate(event.date)}</div>
                        <div class="event-time">${event.time}</div>
                    </div>
                    <span class="event-format ${event.format === 'online' ? 'online' : ''}">${event.format}</span>
                </div>
                <div class="event-description">${escapeHtml(event.description)}</div>
                ${event.location ? `<div class="event-description" style="margin-top: 8px;"><strong>Location:</strong> ${escapeHtml(event.location)}</div>` : ''}
                ${event.link ? `<div class="event-description" style="margin-top: 8px;"><strong>Link:</strong> <a href="${event.link}" target="_blank" style="color: var(--accent-red);">${event.link}</a></div>` : ''}
                <div style="margin-top: 20px;">
                    ${event.registered 
                        ? `<button class="btn-secondary" data-action="register-event" data-event-id="${event.id}">Cancel Registration</button>`
                        : `<button class="btn-primary" data-action="register-event" data-event-id="${event.id}">Register</button>`
                    }
                    ${event.format === 'online' && event.link 
                        ? `<a href="${event.link}" target="_blank" class="btn-primary" style="margin-left: 12px; text-decoration: none; display: inline-block;">Join Event</a>`
                        : ''
                    }
                </div>
            </div>
        </div>
    `;
    
    renderPage(content);
}


