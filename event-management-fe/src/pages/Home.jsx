import { useEffect, useState, useMemo } from "react";
import {
  getPublicEvents,
  searchEvents,
  getEventsWithFilters,
  getEventsByCategory,
} from "../api/eventApi";
import { EventCategory } from "../utils/constants";
import EventCard from "../components/event/EventCard";
import EventDetails from "../components/event/EventDetails";
import SearchBar from "../components/navbar/SearchBar";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const { handleBookEvent } = useCart();

  useEffect(() => {
    getPublicEvents()
      .then((res) => setEvents(res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.eventName?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q),
      );
    }

    if (locationFilter.trim()) {
      const loc = locationFilter.toLowerCase();
      result = result.filter((e) => e.venue?.toLowerCase().includes(loc));
    }

    if (dateFilter) {
      result = result.filter((e) => {
        const d = e.eventDate;
        const eventDate = typeof d === "string" ? d.slice(0, 10) : d;
        return eventDate === dateFilter;
      });
    }

    if (categoryFilter) {
      result = result.filter((e) => e.eventCategory === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        const da = a.eventDate ? new Date(a.eventDate) : new Date(0);
        const db = b.eventDate ? new Date(b.eventDate) : new Date(0);
        return da - db;
      }
      if (sortBy === "price-asc") {
        return (a.ticketPrice ?? 0) - (b.ticketPrice ?? 0);
      }
      if (sortBy === "price-desc") {
        return (b.ticketPrice ?? 0) - (a.ticketPrice ?? 0);
      }
      if (sortBy === "name") {
        return (a.eventName ?? "").localeCompare(b.eventName ?? "");
      }
      return 0;
    });

    return result;
  }, [events, search, locationFilter, dateFilter, sortBy]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Events
        </h1>
        <p className="text-gray-600">
          Find and register for upcoming events near you
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, description, or location..."
        />
        <input
          className="input w-48"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <input
          className="input w-48"
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select
          className="input w-40"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="CONFERENCE">Conference</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="CONCERT">Concert</option>
          <option value="SPORTS">Sports</option>
          <option value="SOCIAL">Social</option>
          <option value="EDUCATIONAL">Educational</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="BUSINESS">Business</option>
          <option value="CHARITY">Charity</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          className="input w-40"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading events...</div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-600">No events found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAndSorted.map((e) => (
            <EventCard
              key={e.eventId}
              event={e}
              onView={setSelected}
              onBookEvent={handleBookEvent}
            />
          ))}
        </div>
      )}

      {selected && (
        <EventDetails
          event={selected}
          onClose={() => setSelected(null)}
          onBookEvent={handleBookEvent}
        />
      )}
    </div>
  );
}
