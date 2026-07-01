import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { venueAPI } from "../../services/api";
import VenueCard from "../../components/venue/VenueCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const VENUE_TYPES = ["Hotel", "Restaurant", "Banquet Hall", "Resort", "Party Hall"];
const CATEGORIES = ["Wedding", "Birthday Party", "Corporate Event", "Anniversary", "Engagement", "Baby Shower", "Farewell Party", "Kitty Party", "Family Gathering", "Other"];
const AMENITIES = ["Parking", "AC", "DJ", "Decoration", "Catering", "Photography", "WiFi", "Swimming Pool", "Outdoor Area", "Stage"];

const VenuesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    venueType: searchParams.get("venueType") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    capacity: searchParams.get("capacity") || "",
    amenities: searchParams.get("amenities") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== 0)
      );
      const { data } = await venueAPI.getAll(params);
      setVenues(data.venues);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (error) {
      console.error("Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVenues();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    setSearchParams(params, { replace: true });
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); 
  };

  const clearFilters = () => {
    setFilters({ search: "", city: "", venueType: "", category: "", minPrice: "", maxPrice: "", capacity: "", amenities: "", rating: "", sort: "", page: 1 });
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v && k !== "page" && k !== "sort");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- TOP SEARCH BAR ---- */}
      <div className="bg-white shadow-sm py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 items-center">
            {/* Search input */}
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search venues by name, city..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="input-field pl-10 py-2"
              />
            </div>

            {/* Sort dropdown */}
            <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)}
              className="input-field py-2 w-44 hidden sm:block">
              <option value="">Sort By</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>

            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors
                ${showFilters ? "bg-primary-600 text-white border-primary-600" : "border-gray-300 text-gray-700 hover:border-primary-400"}`}>
              <FiFilter />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-red-500 hover:text-red-700 text-sm flex items-center">
                <FiX className="mr-1" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {showFilters && (
            <aside className="w-64 flex-shrink-0 bg-white rounded-xl shadow-sm p-5 h-fit sticky top-36 space-y-6">
              <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">City</label>
                <input type="text" placeholder="e.g. Mumbai" value={filters.city}
                  onChange={(e) => updateFilter("city", e.target.value)} className="input-field py-2 text-sm" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Venue Type</label>
                <div className="space-y-2">
                  {VENUE_TYPES.map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input type="radio" name="venueType" value={type}
                        checked={filters.venueType === type}
                        onChange={() => updateFilter("venueType", type)}
                        className="mr-2 text-primary-600" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                  {filters.venueType && (
                    <button onClick={() => updateFilter("venueType", "")} className="text-xs text-primary-600 hover:underline">Clear</button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Price per Plate (₹)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={(e) => updateFilter("minPrice", e.target.value)}
                    className="input-field py-2 text-sm w-1/2" />
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    className="input-field py-2 text-sm w-1/2" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Min Rating</label>
                <select value={filters.rating} onChange={(e) => updateFilter("rating", e.target.value)}
                  className="input-field py-2 text-sm">
                  <option value="">Any Rating</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Min Guest Capacity</label>
                <input type="number" placeholder="e.g. 100" value={filters.capacity}
                  onChange={(e) => updateFilter("capacity", e.target.value)}
                  className="input-field py-2 text-sm" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Amenities</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {AMENITIES.map((amenity) => {
                    const selected = filters.amenities.split(",").filter(Boolean);
                    const isChecked = selected.includes(amenity);
                    return (
                      <label key={amenity} className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={isChecked}
                          onChange={() => {
                            const newList = isChecked
                              ? selected.filter((a) => a !== amenity)
                              : [...selected, amenity];
                            updateFilter("amenities", newList.join(","));
                          }}
                          className="mr-2 text-primary-600" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm">
                Showing <strong>{venues.length}</strong> of <strong>{pagination.total}</strong> venues
              </p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : venues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No venues found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search in a different city</p>
                <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {venues.map((venue) => (
                    <VenueCard key={venue._id} venue={venue} />
                  ))}
                </div> */}

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      disabled={pagination.currentPage === 1}
                      onClick={() => updateFilter("page", pagination.currentPage - 1)}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:border-primary-500">
                      <FiChevronLeft />
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button key={i}
                        onClick={() => updateFilter("page", i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors
                          ${pagination.currentPage === i + 1
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-300 hover:border-primary-400"}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => updateFilter("page", pagination.currentPage + 1)}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:border-primary-500">
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;
