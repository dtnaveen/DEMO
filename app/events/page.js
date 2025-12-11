'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { LocationBasedEvents } from '@/lib/advancedGPS';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon, 
  VideoCameraIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

/**
 * Events & Meetups Page
 * Virtual and in-person events for community building
 */
export default function EventsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'virtual', 'in-person', 'upcoming'

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Mock events data with GPS coordinates for in-person events
    const allMockEvents = [
      {
        id: '1',
        title: 'Virtual Speed Dating Night',
        type: 'virtual',
        date: '2025-12-15T19:00:00',
        duration: 120,
        attendees: 45,
        maxAttendees: 50,
        description: 'Join us for a fun virtual speed dating event!',
        host: 'VibeMatch Team',
        tags: ['speed-dating', 'virtual', 'networking'],
      },
      {
        id: '2',
        title: 'Coffee Meetup - Downtown',
        type: 'in-person',
        date: '2025-12-20T10:00:00',
        location: 'Downtown Coffee Shop',
        latitude: user.latitude || 40.7128,
        longitude: user.longitude || -74.0060,
        attendees: 12,
        maxAttendees: 20,
        description: 'Casual coffee meetup for VibeMatch members',
        host: 'Sarah M.',
        tags: ['coffee', 'casual', 'networking'],
      },
      {
        id: '3',
        title: 'Game Night - Online',
        type: 'virtual',
        date: '2025-12-18T20:00:00',
        duration: 180,
        attendees: 28,
        maxAttendees: 30,
        description: 'Play games and make connections!',
        host: 'VibeMatch Team',
        tags: ['games', 'virtual', 'fun'],
      },
      {
        id: '4',
        title: 'Hiking Adventure',
        type: 'in-person',
        date: '2025-12-22T08:00:00',
        location: 'Mountain Trail',
        latitude: (user.latitude || 40.7128) + 0.1,
        longitude: (user.longitude || -74.0060) + 0.1,
        attendees: 8,
        maxAttendees: 15,
        description: 'Join us for a morning hike!',
        host: 'Outdoor Group',
        tags: ['hiking', 'outdoor', 'fitness'],
      },
    ];

    // Use LocationBasedEvents to find nearby events and suggest based on interests
    if (user.latitude && user.longitude) {
      const nearbyEvents = LocationBasedEvents.findNearbyEvents(
        user.latitude,
        user.longitude,
        50, // 50 mile radius
        allMockEvents
      );
      
      // Also get suggested events based on user interests
      const suggestedEvents = LocationBasedEvents.suggestEvents(user, allMockEvents);
      
      // Combine and prioritize suggested events
      const combinedEvents = [...suggestedEvents, ...nearbyEvents.filter(e => 
        !suggestedEvents.find(se => se.id === e.id)
      )];
      
      setEvents(combinedEvents.length > 0 ? combinedEvents : allMockEvents);
    } else {
      setEvents(allMockEvents);
    }
  }, [router]);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'virtual') return event.type === 'virtual';
    if (filter === 'in-person') return event.type === 'in-person';
    if (filter === 'upcoming') {
      return new Date(event.date) > new Date();
    }
    return true;
  });

  const handleJoinEvent = (eventId) => {
    // In production, call API to join event
    setEvents(events.map(e => 
      e.id === eventId 
        ? { ...e, attendees: e.attendees + 1, joined: true }
        : e
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-dark-900 mb-2 font-display">
            <span className="text-gradient">Events & Meetups</span>
          </h1>
          <p className="text-dark-600 text-lg font-medium">
            Connect with the community through virtual and in-person events
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'gradient-primary text-white shadow-glow'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('virtual')}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              filter === 'virtual'
                ? 'gradient-primary text-white shadow-glow'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            Virtual
          </button>
          <button
            onClick={() => setFilter('in-person')}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              filter === 'in-person'
                ? 'gradient-primary text-white shadow-glow'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            In-Person
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
              filter === 'upcoming'
                ? 'gradient-primary text-white shadow-glow'
                : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
            }`}
          >
            Upcoming
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-dark-900 mb-2 font-display">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {event.type === 'virtual' ? (
                        <VideoCameraIcon className="w-5 h-5 text-primary-600" />
                      ) : (
                        <MapPinIcon className="w-5 h-5 text-accent-600" />
                      )}
                      <span className={`text-sm font-bold ${
                        event.type === 'virtual' ? 'text-primary-600' : 'text-accent-600'
                      }`}>
                        {event.type === 'virtual' ? 'Virtual' : 'In-Person'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-dark-600">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  
                  {event.duration && (
                    <div className="flex items-center gap-2 text-dark-600">
                      <ClockIcon className="w-5 h-5" />
                      <span className="font-medium">{event.duration} minutes</span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-2 text-dark-600">
                      <MapPinIcon className="w-5 h-5" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-dark-600">
                    <UserGroupIcon className="w-5 h-5" />
                    <span className="font-medium">
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                </div>

                <p className="text-dark-600 mb-4">{event.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => handleJoinEvent(event.id)}
                  disabled={event.joined || event.attendees >= event.maxAttendees}
                  className="w-full"
                >
                  {event.joined ? 'Joined' : 
                   event.attendees >= event.maxAttendees ? 'Full' : 
                   'Join Event'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-xl text-gray-600 mb-2">No events found</p>
            <p className="text-gray-500">Check back later for new events!</p>
          </Card>
        )}
      </div>
    </div>
  );
}

