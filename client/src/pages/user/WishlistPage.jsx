import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { wishlistAPI } from "../../services/api";
import VenueCard from "../../components/venue/VenueCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const WishlistPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    wishlistAPI.get().then(r=>setVenues(r.data.wishlist?.venues||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const handleRemove = (id) => setVenues(v=>v.filter(x=>x._id!==id));

  if (loading) return <LoadingSpinner/>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist ❤️</h1>
        <p className="text-sm text-gray-500 mt-0.5">{venues.length} saved venue{venues.length!==1?"s":""}</p>
      </div>

      {venues.length===0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-5xl mb-4">❤️</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 text-sm mb-5">Save venues you love to plan your event later</p>
          <a href="/venues" className="btn-primary text-sm">Browse Venues</a>
        </div>
      ) : (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {venues.map((venue,i)=>(
            <motion.div key={venue._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
              <VenueCard venue={venue} inWishlist onWishlistChange={handleRemove}/>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WishlistPage;
