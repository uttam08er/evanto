import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { venueAPI } from "../../services/api";
import { toast } from "react-toastify";
import { FiUpload, FiX, FiCheck, FiChevronRight, FiChevronLeft } from "react-icons/fi";

const VENUE_TYPES = ["Hotel","Restaurant","Banquet Hall","Resort","Party Hall"];
const CATEGORIES = ["Wedding","Birthday Party","Corporate Event","Anniversary","Engagement","Baby Shower","Farewell Party","Kitty Party","Family Gathering","Other"];
const AMENITIES = ["Parking","AC","DJ","Decoration","Catering","Photography","WiFi","Swimming Pool","Outdoor Area","Stage"];
const AMENITY_ICONS = {Parking:"🚗",AC:"❄️",DJ:"🎵",Decoration:"🎊",Catering:"🍽️",Photography:"📸",WiFi:"📶","Swimming Pool":"🏊","Outdoor Area":"🌳",Stage:"🎤"};

const STEPS = ["Basic Info","Location","Pricing","Amenities","Photos","Review"];

const AddVenuePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [form, setForm] = useState({
    venueName:"",category:"",description:"",venueType:"",
    address:"",city:"",state:"",pincode:"",
    capacity:"",pricePerPlate:"",decorationPrice:"0",
  });

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleImages = (e) => {
    const f = Array.from(e.target.files);
    if (f.length+files.length>10){ toast.error("Max 10 images"); return; }
    setFiles(prev=>[...prev,...f]);
    setPreviews(prev=>[...prev,...f.map(x=>URL.createObjectURL(x))]);
  };

  const removeImg = (i) => { setFiles(f=>f.filter((_,j)=>j!==i)); setPreviews(p=>p.filter((_,j)=>j!==i)); };
  const toggleAmenity = (a) => setAmenities(prev=>prev.includes(a)?prev.filter(x=>x!==a):[...prev,a]);

  const validate = () => {
    if (step===0&&(!form.venueName||!form.category||!form.description||!form.venueType)){toast.error("Fill all required fields");return false;}
    if (step===1&&(!form.address||!form.city||!form.state||!form.pincode)){toast.error("Fill all location fields");return false;}
    if (step===2&&(!form.capacity||!form.pricePerPlate)){toast.error("Fill capacity and price");return false;}
    if (step===3&&amenities.length===0){toast.error("Select at least one amenity");return false;}
    if (step===4&&files.length===0){toast.error("Upload at least one photo");return false;}
    return true;
  };

  const next = () => { if (validate()) setStep(s=>Math.min(s+1,5)); };
  const back = () => setStep(s=>Math.max(s-1,0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,v));
      fd.append("amenities",JSON.stringify(amenities));
      files.forEach(f=>fd.append("images",f));
      await venueAPI.create(fd);
      toast.success("Venue submitted! Awaiting admin approval.");
      navigate("/owner/venues");
    } catch (e){ toast.error(e.response?.data?.message||"Submission failed"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Venue</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete all steps to list your venue</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s,i)=>(
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${i<step?"bg-emerald-500 text-white":i===step?"bg-blue-600 text-white":"bg-gray-100 text-gray-400"}`}>
                  {i<step?<FiCheck size={13}/>:i+1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block font-medium ${i===step?"text-blue-600":i<step?"text-emerald-600":"text-gray-400"}`}>{s}</span>
              </div>
              {i<5&&<div className={`flex-1 h-0.5 mx-2 mb-4 rounded ${i<step?"bg-emerald-400":"bg-gray-100"}`} style={{minWidth:"12px"}}/>}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.2}}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          {/* STEP 0: Basic Info */}
          {step===0&&<div className="space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
              <input className="input-field" placeholder="e.g. The Grand Palace" value={form.venueName} onChange={e=>set("venueName",e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Type *</label>
                <select className="input-field" value={form.venueType} onChange={e=>set("venueType",e.target.value)}>
                  <option value="">Select type</option>
                  {VENUE_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Best For *</label>
                <select className="input-field" value={form.category} onChange={e=>set("category",e.target.value)}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea className="input-field resize-none" rows={5} maxLength={2000}
                placeholder="Describe your venue in detail..." value={form.description} onChange={e=>set("description",e.target.value)}/>
              <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000</p>
            </div>
          </div>}

          {/* STEP 1: Location */}
          {step===1&&<div className="space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Location Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
              <input className="input-field" placeholder="Street address, landmark" value={form.address} onChange={e=>set("address",e.target.value)}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input className="input-field" placeholder="Mumbai" value={form.city} onChange={e=>set("city",e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input className="input-field" placeholder="Maharashtra" value={form.state} onChange={e=>set("state",e.target.value)}/>
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
              <input className="input-field" placeholder="400001" maxLength={6} value={form.pincode} onChange={e=>set("pincode",e.target.value)}/>
            </div>
          </div>}

          {step===2&&<div className="space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Pricing & Capacity</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests *</label>
                <input type="number" className="input-field" placeholder="200" min="10" value={form.capacity} onChange={e=>set("capacity",e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price/Plate (₹) *</label>
                <input type="number" className="input-field" placeholder="800" min="0" value={form.pricePerPlate} onChange={e=>set("pricePerPlate",e.target.value)}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Decoration (₹)</label>
                <input type="number" className="input-field" placeholder="0" min="0" value={form.decorationPrice} onChange={e=>set("decorationPrice",e.target.value)}/>
              </div>
            </div>
            {form.capacity&&form.pricePerPlate&&(
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-700 mb-1">💡 Revenue Estimate</p>
                <p className="text-xs text-blue-600">Full capacity: {form.capacity} guests × ₹{form.pricePerPlate} = <strong>₹{(+form.capacity * +form.pricePerPlate).toLocaleString()}</strong></p>
              </div>
            )}
          </div>}

          {step===3&&<div>
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Amenities & Features</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {AMENITIES.map(a=>(
                <button key={a} type="button" onClick={()=>toggleAmenity(a)}
                  className={`p-3 rounded-xl border-2 text-center transition-all
                    ${amenities.includes(a)?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-gray-300"}`}>
                  <span className="block text-2xl mb-1">{AMENITY_ICONS[a]}</span>
                  <span className={`text-xs font-medium ${amenities.includes(a)?"text-blue-700":"text-gray-600"}`}>{a}</span>
                  {amenities.includes(a)&&<FiCheck className="text-blue-500 mx-auto mt-1" size={12}/>}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">{amenities.length} selected</p>
          </div>}

          {step===4&&<div>
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Venue Photos (max 10)</h2>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all mb-4">
              <FiUpload size={24} className="text-gray-400 mb-2"/>
              <p className="text-sm text-gray-600 font-medium">Click to upload photos</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP accepted</p>
              <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden"/>
            </label>
            {previews.length>0&&(
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {previews.map((p,i)=>(
                  <div key={i} className="relative group aspect-square">
                    <img src={p} alt="" className="w-full h-full object-cover rounded-xl"/>
                    <button type="button" onClick={()=>removeImg(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <FiX size={11}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>}

          {step===5&&<div className="space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Review & Submit</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                {l:"Venue Name",v:form.venueName},{l:"Type",v:form.venueType},{l:"Category",v:form.category},
                {l:"City",v:`${form.city}, ${form.state}`},{l:"Capacity",v:`${form.capacity} guests`},
                {l:"Price/Plate",v:`₹${form.pricePerPlate}`},{l:"Decoration",v:`₹${form.decorationPrice}`},
                {l:"Photos",v:`${files.length} uploaded`},{l:"Amenities",v:`${amenities.length} selected`},
              ].map(x=>(
                <div key={x.l} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{x.l}</p>
                  <p className="font-semibold text-gray-800">{x.v||"—"}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
              📋 Your venue will be reviewed by our admin team within 24–48 hours before going live.
            </div>
          </div>}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {step>0&&(
          <button onClick={back} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
            <FiChevronLeft size={15}/> Back
          </button>
        )}
        <div className="flex-1"/>
        {step<5 ? (
          <button onClick={next} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Continue <FiChevronRight size={15}/>
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60">
            {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Submitting...</> : <><FiCheck size={15}/>Submit Venue</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddVenuePage;
